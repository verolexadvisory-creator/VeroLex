// Jonli sayt inventarizatsiyasi va texnik SEO tekshiruvi (faqat o'qish).
// Ishga tushirish:
//   node audit/evidence/scripts/site_inventory.mjs --base https://verolex.uz --out audit/evidence/live
// Parametrlar: --concurrency 2 (maks. 3), --delay 400 (ms), --max 200, --no-render (JSsiz rejim)
// Har URL uchun: redirect zanjiri, status, til, title, description, H1, canonical, hreflang,
// robots, OG, JSON-LD turlari, emaillar, tel/Telegram havolalari, ichki havolalar;
// JS'dan keyingi DOM bilan farq; aliaslar; haqiqiy 404; hreflang qaytish havolalari.
import { chromium, request as pwRequest } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { parseArgs, tashkentNow, ensureDir, writeJSON, sleep, mapLimit, installSafetyRoutes, toCSV, normUrl } from './lib.mjs';

const args = parseArgs(process.argv, { base: 'https://verolex.uz', out: 'audit/evidence/live', concurrency: '2', delay: '400', max: '200' });
const BASE = String(args.base).replace(/\/$/, '');
const OUT = ensureDir(path.resolve(args.out));
const CONC = Math.min(3, Number(args.concurrency) || 2);
const DELAY = Number(args.delay) || 400;
const MAX = Number(args.max) || 200;
const UA = 'VeroLexAudit/1.0 (read-only SEO audit; no form submission)';
const startedAt = tashkentNow();

const api = await pwRequest.newContext({ userAgent: UA, ignoreHTTPSErrors: false, timeout: 30000 });

async function fetchChain(url, maxHops = 10) {
  const chain = [];
  let cur = url;
  for (let i = 0; i <= maxHops; i++) {
    let res;
    try {
      res = await api.get(cur, { maxRedirects: 0, failOnStatusCode: false });
    } catch (e) {
      chain.push({ url: cur, status: null, error: String(e.message || e).split('\n')[0] });
      return { chain, finalUrl: cur, status: null, body: null, headers: {} };
    }
    const status = res.status();
    const headers = res.headers();
    chain.push({ url: cur, status, location: headers.location || null });
    if (status >= 300 && status < 400 && headers.location) {
      cur = new URL(headers.location, cur).toString();
      await sleep(DELAY / 2);
      continue;
    }
    let body = null;
    try { body = await res.text(); } catch { body = null; }
    return { chain, finalUrl: cur, status, body, headers };
  }
  return { chain, finalUrl: cur, status: 'TOO_MANY_REDIRECTS', body: null, headers: {} };
}

// --- 1. robots.txt va sitemap ---
const robots = await fetchChain(`${BASE}/robots.txt`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), robots.body || `# yuklanmadi: ${JSON.stringify(robots.chain)}`);
const sitemapUrls = new Set();
const sitemapSources = [];
const robotsSitemaps = (robots.body || '').split('\n').filter((l) => /^sitemap:/i.test(l.trim())).map((l) => l.split(/:\s*/).slice(1).join(':').trim());
const queue = robotsSitemaps.length ? robotsSitemaps : [`${BASE}/sitemap.xml`];
const seenSm = new Set();
while (queue.length) {
  const sm = queue.shift();
  if (seenSm.has(sm)) continue; seenSm.add(sm);
  const r = await fetchChain(sm);
  sitemapSources.push({ sitemap: sm, chain: r.chain });
  if (!r.body) continue;
  fs.writeFileSync(path.join(OUT, `sitemap_${seenSm.size}.xml`), r.body);
  const locs = [...r.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, '&'));
  if (/<sitemapindex/i.test(r.body)) queue.push(...locs); else locs.forEach((u) => sitemapUrls.add(u));
}
const urls = [...sitemapUrls].slice(0, MAX);

// --- 2. Brauzer: JSsiz parser konteksti va JS'li render konteksti ---
const browser = await chromium.launch();
const rawCtx = await browser.newContext({ javaScriptEnabled: false, userAgent: UA });
await rawCtx.route('**/*', (r) => r.abort()); // setContent paytida hech qanday tarmoq so'rovi yo'q
const renderCtx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
const netLog = [];
await installSafetyRoutes(renderCtx, netLog, { mode: 'browse' });

const EXTRACT = () => {
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const meta = (n) => (q(`meta[name="${n}"]`) || q(`meta[property="${n}"]`))?.getAttribute('content') ?? null;
  const headings = qa('h1,h2,h3,h4,h5,h6').map((h) => Number(h.tagName[1]));
  const skips = [];
  for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) skips.push(`h${headings[i - 1]}→h${headings[i]}`);
  const jsonld = qa('script[type="application/ld+json"]').map((s) => {
    try {
      const d = JSON.parse(s.textContent);
      const types = [];
      const walk = (o) => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); if (o['@type']) types.push(...[].concat(o['@type'])); if (o['@graph']) walk(o['@graph']); };
      walk(d);
      const emails = JSON.stringify(d).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
      return { ok: true, types, emails: [...new Set(emails)] };
    } catch (e) { return { ok: false, error: String(e).slice(0, 120) }; }
  });
  // Matn tugunlarini bo'shliq bilan qo'shamiz: aks holda qo'shni so'z emailga yopishib qoladi
  const bodyText = (() => {
    if (!document.body) return '';
    // filtr callback'i JSsiz kontekstda ishlamaydi, shuning uchun tekshiruv tsikl ichida
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const parts = [];
    while (w.nextNode()) if (!/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(w.currentNode.parentElement?.tagName || '')) parts.push(w.currentNode.nodeValue);
    return parts.join(' ');
  })();
  const textEmails = bodyText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  const hrefs = qa('a[href]').map((a) => a.getAttribute('href'));
  return {
    lang: document.documentElement.getAttribute('lang'),
    title: document.title || null,
    description: meta('description'),
    robotsMeta: meta('robots'),
    keywordsMeta: meta('keywords'),
    h1: qa('h1').map((h) => h.textContent.trim().replace(/\s+/g, ' ')),
    headingSkips: skips,
    canonical: q('link[rel="canonical"]')?.getAttribute('href') ?? null,
    hreflang: qa('link[rel="alternate"][hreflang]').map((l) => ({ lang: l.getAttribute('hreflang'), href: l.getAttribute('href') })),
    og: { title: meta('og:title'), description: meta('og:description'), image: meta('og:image'), url: meta('og:url'), type: meta('og:type'), locale: meta('og:locale') },
    twitterCard: meta('twitter:card'),
    gscVerification: meta('google-site-verification'),
    yandexVerification: meta('yandex-verification'),
    jsonld,
    mailto: [...new Set(hrefs.filter((h) => /^mailto:/i.test(h)).map((h) => h.replace(/^mailto:/i, '').split('?')[0]))],
    textEmails: [...new Set(textEmails)],
    tel: [...new Set(hrefs.filter((h) => /^tel:/i.test(h)))],
    telegram: [...new Set(hrefs.filter((h) => /t\.me\/|telegram\.me\//i.test(h)))],
    maps: [...new Set([...hrefs.filter((h) => /maps\.|yandex\.[a-z]+\/maps|2gis|goo\.gl\/maps/i.test(h)), ...qa('iframe[src]').map((f) => f.getAttribute('src')).filter((s) => /map/i.test(s))])],
    hrefs,
    jsOnlyLinks: qa('a:not([href]), a[href^="javascript:"], a[href="#"]').length,
    imgs: qa('img').map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt'), loading: i.getAttribute('loading'), w: i.getAttribute('width'), h: i.getAttribute('height') })),
    forms: qa('form').map((f) => ({ action: f.getAttribute('action'), method: f.getAttribute('method'), novalidate: f.hasAttribute('novalidate'), fields: f.querySelectorAll('input,textarea,select').length })),
    bodyTextLength: bodyText.replace(/\s+/g, ' ').trim().length,
  };
};

async function parseRaw(html, url) {
  const page = await rawCtx.newPage();
  try {
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const d = await page.evaluate(EXTRACT);
    return d;
  } finally { await page.close(); }
}

async function render(url) {
  if (args['no-render']) return null;
  const page = await renderCtx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 200)}`));
  try {
    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    const d = await page.evaluate(EXTRACT);
    const scripts = await page.evaluate(() => [...document.scripts].map((s) => s.src).filter(Boolean));
    const tagIds = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      return [...new Set(html.match(/\b(G-[A-Z0-9]{6,12}|AW-\d{6,12}|GTM-[A-Z0-9]{4,10}|UA-\d+-\d+)\b/g) || [])];
    });
    return { status: resp?.status() ?? null, loadMs: Date.now() - t0, ...d, scripts, tagIds, consoleErrors };
  } catch (e) {
    return { error: String(e.message || e).split('\n')[0], consoleErrors };
  } finally { await page.close(); }
}

const pages = await mapLimit(urls, CONC, async (u) => {
  await sleep(DELAY);
  const f = await fetchChain(u);
  const rec = { sitemapUrl: u, chain: f.chain, finalUrl: f.finalUrl, status: f.status, contentType: f.headers['content-type'] || null, xRobotsTag: f.headers['x-robots-tag'] || null };
  if (f.body && /html/i.test(rec.contentType || 'html')) {
    rec.raw = await parseRaw(f.body, f.finalUrl);
    rec.rendered = await render(f.finalUrl);
  }
  process.stderr.write(`${rec.status} ${u}\n`);
  return rec;
});

// --- 3. Aliaslar va 404 ---
const host = new URL(BASE).host;
const bare = host.replace(/^www\./, '');
const aliasTargets = [
  `http://${bare}/`, `https://${bare}/`, `http://www.${bare}/`, `https://www.${bare}/`,
  `${BASE}/index.html`, `${BASE}/ru/index.html`, `${BASE}/en/index.html`, `${BASE}/ru`, `${BASE}/en`,
  `${BASE}/__audit-404-check-${Date.now()}.html`,
];
const aliases = [];
for (const a of aliasTargets) { await sleep(DELAY); const r = await fetchChain(a); aliases.push({ url: a, chain: r.chain, finalUrl: r.finalUrl, status: r.status }); }

// --- 4. Tahlil ---
const issues = [];
const byFinal = new Map(pages.filter((p) => p.raw).map((p) => [normUrl(p.finalUrl), p]));
const abs = (h, b) => { try { return normUrl(new URL(h, b).toString()); } catch { return h; } };
const dup = (field) => {
  const m = new Map();
  for (const p of pages) { const v = p.raw?.[field]; if (!v) continue; m.set(v, [...(m.get(v) || []), p.sitemapUrl]); }
  return [...m.entries()].filter(([, v]) => v.length > 1);
};
for (const p of pages) {
  const u = p.sitemapUrl;
  if (p.status !== 200) issues.push({ url: u, issue: `status ${p.status}`, chain: p.chain });
  if (p.chain.length > 1) issues.push({ url: u, issue: 'sitemapdagi URL redirect qiladi', chain: p.chain.map((c) => `${c.status} ${c.url}`) });
  const r = p.raw; if (!r) continue;
  if (!r.title) issues.push({ url: u, issue: 'title yo\'q' });
  if (!r.description) issues.push({ url: u, issue: 'meta description yo\'q' });
  if (r.h1.length !== 1) issues.push({ url: u, issue: `H1 soni ${r.h1.length}` });
  if (r.headingSkips.length) issues.push({ url: u, issue: `heading darajasi o'tkazib yuborilgan: ${r.headingSkips.join(', ')}` });
  if (!r.canonical) issues.push({ url: u, issue: 'canonical yo\'q' });
  else if (abs(r.canonical, p.finalUrl) !== normUrl(p.finalUrl)) issues.push({ url: u, issue: `canonical boshqa URLga: ${abs(r.canonical, p.finalUrl)}` });
  if (/noindex/i.test(r.robotsMeta || '') || /noindex/i.test(p.xRobotsTag || '')) issues.push({ url: u, issue: 'noindex sitemapdagi sahifada' });
  if (!r.hreflang.length) issues.push({ url: u, issue: 'hreflang yo\'q' });
  if (r.hreflang.length && !r.hreflang.some((h) => h.lang === 'x-default')) issues.push({ url: u, issue: 'x-default yo\'q' });
  for (const h of r.hreflang) {
    if (h.lang === 'x-default') continue;
    const target = byFinal.get(abs(h.href, p.finalUrl));
    if (!target) { issues.push({ url: u, issue: `hreflang ${h.lang} → ${h.href}: sitemap/inventarda yo'q yoki status≠200` }); continue; }
    const back = target.raw.hreflang.some((x) => abs(x.href, target.finalUrl) === normUrl(p.finalUrl));
    if (!back) issues.push({ url: u, issue: `hreflang qaytish havolasi yo'q: ${h.lang} → ${target.sitemapUrl}` });
  }
  if (!r.og.title || !r.og.image) issues.push({ url: u, issue: `Open Graph to'liq emas (og:title=${!!r.og.title}, og:image=${!!r.og.image})` });
  r.jsonld.filter((j) => !j.ok).forEach((j) => issues.push({ url: u, issue: `JSON-LD parse xatosi: ${j.error}` }));
  const imgsNoAlt = r.imgs.filter((i) => i.alt === null);
  if (imgsNoAlt.length) issues.push({ url: u, issue: `alt atributisiz rasm: ${imgsNoAlt.length}` });
  if (r.jsOnlyLinks) issues.push({ url: u, issue: `href'siz yoki javascript: havolalar: ${r.jsOnlyLinks}` });
  const rd = p.rendered;
  if (rd && !rd.error) {
    if (rd.title !== r.title) issues.push({ url: u, issue: `JS title'ni o'zgartiradi: "${r.title}" → "${rd.title}"` });
    if (JSON.stringify(rd.h1) !== JSON.stringify(r.h1)) issues.push({ url: u, issue: `JS H1'ni o'zgartiradi: ${JSON.stringify(r.h1)} → ${JSON.stringify(rd.h1)}` });
    const rawE = new Set([...r.mailto, ...r.textEmails]); const rendE = new Set([...rd.mailto, ...rd.textEmails]);
    if ([...rendE].some((e) => !rawE.has(e)) || [...rawE].some((e) => !rendE.has(e))) issues.push({ url: u, issue: `JS emailni o'zgartiradi: raw=${[...rawE]} rendered=${[...rendE]}` });
    if (rd.consoleErrors?.length) issues.push({ url: u, issue: `console xatolari: ${rd.consoleErrors.length}`, sample: rd.consoleErrors.slice(0, 3) });
  }
}
for (const [v, list] of dup('title')) issues.push({ url: list.join(' , '), issue: `takroriy title: "${v}"` });
for (const [v, list] of dup('description')) issues.push({ url: list.join(' , '), issue: `takroriy description: "${v.slice(0, 80)}…"` });

// Emaillar til va sahifa bo'yicha
const emailMatrix = pages.filter((p) => p.raw).map((p) => ({
  url: p.sitemapUrl, lang: p.raw.lang,
  raw: [...new Set([...p.raw.mailto, ...p.raw.textEmails])].join(' '),
  rendered: p.rendered && !p.rendered.error ? [...new Set([...p.rendered.mailto, ...p.rendered.textEmails])].join(' ') : '',
  jsonld: [...new Set(p.raw.jsonld.flatMap((j) => j.emails || []))].join(' '),
}));
const allEmails = new Set(emailMatrix.flatMap((e) => `${e.raw} ${e.rendered} ${e.jsonld}`.split(/\s+/).filter(Boolean)));
if (allEmails.size > 1) issues.push({ url: '(butun sayt)', issue: `bir nechta email manzil: ${[...allEmails].join(', ')}` });

// Ichki havolalar: sitemapda yo'q ichki URLlar va kiruvchi havolasi yo'q sitemap sahifalari
const internal = new Map();
for (const p of pages) for (const h of p.raw?.hrefs || []) {
  if (/^(mailto:|tel:|javascript:|#)/i.test(h)) continue;
  const a = abs(h, p.finalUrl);
  try { if (new URL(a).host.replace(/^www\./, '') !== bare) continue; } catch { continue; }
  internal.set(a, [...(internal.get(a) || []), p.sitemapUrl]);
}
const sitemapNorm = new Set(urls.map(normUrl));
const notInSitemap = [...internal.keys()].filter((u) => !sitemapNorm.has(u) && !STATICISH(u));
function STATICISH(u) { return /\.(css|js|png|jpe?g|svg|webp|pdf|ico|xml|txt)(\?|$)/i.test(u); }
const linkChecks = [];
for (const u of notInSitemap.slice(0, 60)) { await sleep(DELAY); const r = await fetchChain(u); linkChecks.push({ url: u, from: internal.get(u).slice(0, 3), status: r.status, finalUrl: r.finalUrl, hops: r.chain.length - 1 }); }
linkChecks.filter((l) => l.status !== 200).forEach((l) => issues.push({ url: l.url, issue: `ichki havola status ${l.status}`, from: l.from }));
const inbound = new Set(internal.keys());
const orphans = urls.filter((u) => !inbound.has(normUrl(u)));

// Bir xil domendagi JS fayllar: analitika IDlari va GA4 yoqilish sharti (A01 qayta tekshiruvi)
const jsUrls = [...new Set(pages.flatMap((p) => p.rendered?.scripts || []))].filter((s) => { try { return new URL(s).host.replace(/^www\./, '') === bare; } catch { return false; } });
const JS_DIR = ensureDir(path.join(OUT, 'js'));
const scriptFindings = [];
for (const s of jsUrls.slice(0, 30)) {
  await sleep(DELAY);
  const r = await fetchChain(s);
  if (!r.body) { scriptFindings.push({ url: s, status: r.status }); continue; }
  fs.writeFileSync(path.join(JS_DIR, new URL(s).pathname.replace(/[^a-z0-9.]+/gi, '_')), r.body);
  const ids = [...new Set(r.body.match(/\b(G-[A-Z0-9]{6,12}|AW-\d{6,12}|GTM-[A-Z0-9]{4,10})\b/g) || [])];
  const conditions = (r.body.match(/[^\n;]{0,80}(!==?|===?)\s*["']G-[A-Z0-9]+["'][^\n;]{0,40}/g) || []).map((c) => c.trim());
  const adsLabel = (r.body.match(/ADS_LABEL\s*=\s*["'][^"']*["']/g) || []);
  const events = [...new Set(r.body.match(/["'](page_view|generate_lead|conversion|click_to_call|contact|lead|sign_up|language_switch|select_content)["']/g) || [])];
  const ym = /mc\.yandex|ym\(/.test(r.body);
  scriptFindings.push({ url: s, status: r.status, ids, conditions, adsLabel, events, yandexMetrika: ym });
  if (conditions.some((c) => ids.some((id) => c.includes(id)))) issues.push({ url: s, issue: `analitika IDsi bilan solishtiruvchi shart: ${conditions.join(' || ')}` });
}

await browser.close(); await api.dispose();

const finishedAt = tashkentNow();
const result = { base: BASE, startedAt, finishedAt, tool: `playwright chromium`, concurrency: CONC, robots: { chain: robots.chain }, sitemapSources, sitemapCount: sitemapUrls.size, pages, aliases, emailMatrix, linkChecks, orphans, scriptFindings, analyticsAndBlockedRequests: netLog, issues };
writeJSON(path.join(OUT, 'inventory.json'), result);
fs.writeFileSync(path.join(OUT, 'inventory.csv'), toCSV(pages.map((p) => ({
  sitemap_url: p.sitemapUrl, final_url: p.finalUrl, status: p.status, hops: p.chain.length - 1, lang: p.raw?.lang,
  title: p.raw?.title, description: p.raw?.description, h1: p.raw?.h1, canonical: p.raw?.canonical,
  hreflang: p.raw?.hreflang.map((h) => `${h.lang}=${h.href}`), robots: p.raw?.robotsMeta, og_title: p.raw?.og.title,
  jsonld_types: p.raw?.jsonld.flatMap((j) => j.types || []), emails_raw: [...new Set([...(p.raw?.mailto || []), ...(p.raw?.textEmails || [])])],
  emails_rendered: p.rendered && !p.rendered.error ? [...new Set([...p.rendered.mailto, ...p.rendered.textEmails])] : '',
  tag_ids: p.rendered?.tagIds, body_text_len: p.raw?.bodyTextLength, imgs_no_alt: p.raw?.imgs.filter((i) => i.alt === null).length,
})), ['sitemap_url', 'final_url', 'status', 'hops', 'lang', 'title', 'description', 'h1', 'canonical', 'hreflang', 'robots', 'og_title', 'jsonld_types', 'emails_raw', 'emails_rendered', 'tag_ids', 'body_text_len', 'imgs_no_alt']));

const md = [
  `# Inventarizatsiya natijasi`, '', `- Baza: ${BASE}`, `- Boshlandi: ${startedAt}`, `- Tugadi: ${finishedAt}`,
  `- Sitemap URLlari: ${sitemapUrls.size} (tekshirildi: ${urls.length})`, `- 200 qaytargan: ${pages.filter((p) => p.status === 200).length}`,
  `- Kiruvchi ichki havolasi topilmagan sitemap sahifalari: ${orphans.length}`, '',
  '## Aliaslar va 404', '', '| URL | Zanjir | Yakuniy status |', '|---|---|---|',
  ...aliases.map((a) => `| ${a.url} | ${a.chain.map((c) => `${c.status ?? c.error}`).join(' → ')} | ${a.status} |`), '',
  '## JS fayllardagi analitika topilmalari', '',
  ...scriptFindings.map((f) => `- ${f.url} — status ${f.status}; ID: ${(f.ids || []).join(', ') || '—'}; shartlar: ${(f.conditions || []).join(' || ') || '—'}; ADS_LABEL: ${(f.adsLabel || []).join(', ') || '—'}; hodisalar: ${(f.events || []).join(', ') || '—'}; Yandex Metrika: ${f.yandexMetrika ?? '—'}`), '',
  '## Analitika/blok qilingan so\'rovlar (serverga yuborilmagan)', '',
  ...[...new Set(netLog.map((n) => `- ${n.action} ${n.method} ${n.url.slice(0, 160)}`))].slice(0, 80), '',
  '## Aniqlangan muammolar', '', ...issues.map((i) => `- **${i.url}** — ${i.issue}${i.chain ? ` (${[].concat(i.chain).join(' ; ')})` : ''}`),
].join('\n');
fs.writeFileSync(path.join(OUT, 'inventory_summary.md'), md + '\n');
console.log(`OK: ${path.join(OUT, 'inventory.json')} — ${pages.length} sahifa, ${issues.length} qayd`);
