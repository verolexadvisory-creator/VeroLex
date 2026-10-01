// Funksional va accessibility tekshiruvlari (faqat o'qish; formalar serverga YUBORILMAYDI).
// Ishga tushirish:
//   node audit/evidence/scripts/ui_checks.mjs --base https://verolex.uz --out audit/evidence/live
// Parametrlar: --pages "/,/ru/,/en/,/about.html" (aks holda standart ro'yxat), --browser chromium|firefox|webkit
//              --skip-forms, --skip-viewports
// Xavfsizlik: barcha GET bo'lmagan so'rovlar, tashqi forma backendlari (Telegram API va h.k.) va
// analitika hitlari ushlab qolinadi. Forma ssenariylarida faqat statik resurslar tarmoqqa chiqadi.
import * as pw from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { parseArgs, tashkentNow, ensureDir, writeJSON, sleep, installSafetyRoutes } from './lib.mjs';

const args = parseArgs(process.argv, { base: 'https://verolex.uz', out: 'audit/evidence/live', browser: 'chromium' });
const BASE = String(args.base).replace(/\/$/, '');
const OUT = ensureDir(path.resolve(args.out));
const SHOTS = ensureDir(path.join(OUT, 'screenshots'));
const startedAt = tashkentNow();
// Xizmat sahifasi: RU slug indeksda ko'rilgan (/ru/korporativ.html); UZ/EN sluglari taxminiy — 404 bo'lsa natijada xato sifatida qayd etiladi.
const DEFAULT_PAGES = ['/', '/about.html', '/blog.html', '/contact.html', '/korporativ.html', '/ru/', '/ru/about.html', '/ru/blog.html', '/ru/contact.html', '/ru/korporativ.html', '/en/', '/en/about.html', '/en/blog.html', '/en/contact.html', '/en/korporativ.html'];
const PAGES = args.pages ? String(args.pages).split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT_PAGES;
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 800 },
];
const UZ_MARKERS = /\b(tanlash|tarozi|yuborish|ismingiz|raqamingiz|bosh sahifa|xizmatlar|aloqa|menyuni|yopish|ochish|savol|javob)\b|[oʻgʻ]ʻ|o'|g'/i;

let browserType = pw[args.browser];
if (!browserType) throw new Error(`Noma'lum brauzer: ${args.browser}`);
let browser;
try { browser = await browserType.launch(); } catch (e) {
  writeJSON(path.join(OUT, `ui_checks_${args.browser}.json`), { startedAt, browser: args.browser, status: 'BLOCKED', reason: String(e.message).split('\n')[0] });
  console.error(`BLOCKED: ${args.browser} ishga tushmadi`); process.exit(2);
}
const result = { base: BASE, startedAt, browser: `${args.browser} ${browser.version()}`, pages: {}, network: [] };

async function newPage(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: opts.reducedMotion || 'no-preference' });
  const log = [];
  const state = await installSafetyRoutes(ctx, log, { mode: opts.mode || 'browse', mock: opts.mock });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  page.on('dialog', (d) => { errors.push(`dialog: ${d.message().slice(0, 200)}`); d.dismiss().catch(() => {}); });
  return { ctx, page, log, state, errors };
}
const url = (p) => (p.startsWith('http') ? p : `${BASE}${p}`);
// Intro/preloader animatsiyalari tugashini kutish (ms); --settle 0 bilan o'chiriladi
const SETTLE = args.settle !== undefined ? Number(args.settle) : 3500;
async function gotoSettled(page, p) { await page.goto(url(p), { waitUntil: 'load', timeout: 45000 }); if (SETTLE) await sleep(SETTLE); }
const slug = (p) => p.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'root';

// ---------- Layout / overflow / skrinshot ----------
async function layoutCheck(p, vp) {
  const { ctx, page, log } = await newPage(vp);
  try {
    await gotoSettled(page, p);
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    const data = await page.evaluate((vw) => {
      const de = document.documentElement;
      const offenders = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > vw + 1 && getComputedStyle(el).position !== 'fixed') offenders.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} (right=${Math.round(r.right)})`);
        if (offenders.length >= 10) break;
      }
      const clipped = [...document.querySelectorAll('h1,h2,h3,button,a.btn,.btn,nav a')].filter((el) => {
        const cs = getComputedStyle(el); return (el.scrollWidth > el.clientWidth + 1) && /hidden|clip/.test(cs.overflow + cs.overflowX) && el.clientWidth > 0;
      }).slice(0, 10).map((el) => el.textContent.trim().slice(0, 60));
      const smallText = [...document.querySelectorAll('p,li,a,button,label,input,textarea')].filter((el) => el.offsetParent && parseFloat(getComputedStyle(el).fontSize) < 14).length;
      return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, horizontalOverflow: de.scrollWidth > de.clientWidth + 1, offenders, clipped, smallTextCount: smallText };
    }, vp.width);
    await page.screenshot({ path: path.join(SHOTS, `${slug(p)}__${vp.name}.png`), fullPage: false });
    return { ...data, blocked: log.length };
  } catch (e) { return { error: String(e.message).split('\n')[0] }; } finally { await ctx.close(); }
}

// ---------- Mobil menyu ----------
async function menuCheck(p) {
  const vp = VIEWPORTS[2];
  const { ctx, page } = await newPage(vp);
  try {
    await gotoSettled(page, p);
    const toggle = page.locator('button[aria-controls], .burger, .hamburger, .menu-toggle, .nav-toggle, [aria-label*="menu" i], [aria-label*="menyu" i], [aria-label*="меню" i]').filter({ visible: true }).first();
    if (!(await toggle.count())) return { found: false };
    const info = async () => toggle.evaluate((b) => ({ ariaExpanded: b.getAttribute('aria-expanded'), ariaControls: b.getAttribute('aria-controls'), ariaLabel: b.getAttribute('aria-label'), tag: b.tagName.toLowerCase() }));
    const before = await info();
    // Yopiq menyuda Tab bosilganda ko'rinmas element fokusga tushadimi? (haqiqiy Tab bilan)
    let hiddenFocusable = 0; const hiddenSamples = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const st = await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const inView = r.width > 0 && r.height > 0 && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
        const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1); const cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
        const hit = inView ? document.elementFromPoint(cx, cy) : null;
        const visible = inView && !!hit && (hit === el || el.contains(hit) || hit.contains(el)) && getComputedStyle(el).opacity !== '0';
        return { visible, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40), inNav: !!el.closest('nav,header') };
      });
      if (st && st.inNav && !st.visible) { hiddenFocusable++; if (hiddenSamples.length < 5) hiddenSamples.push(st.text); }
    }
    await page.evaluate(() => document.activeElement?.blur());
    await toggle.click();
    await sleep(400);
    const after = await info();
    const visibleLinks = await page.locator('nav a[href]').filter({ visible: true }).count();
    await page.keyboard.press('Escape');
    await sleep(300);
    const afterEsc = await info();
    return { found: true, before, after, visibleNavLinksWhenOpen: visibleLinks, afterEscape: afterEsc, hiddenLinksFocusableWhenClosed: hiddenFocusable, hiddenSamples };
  } catch (e) { return { error: String(e.message).split('\n')[0] }; } finally { await ctx.close(); }
}

// ---------- Klaviatura fokusi ----------
async function focusCheck(p) {
  const { ctx, page } = await newPage(VIEWPORTS[0]);
  try {
    await gotoSettled(page, p);
    const steps = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      steps.push(await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return null;
        const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), text: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim().slice(0, 50), visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight * 3, indicator: (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none' };
      }));
    }
    const real = steps.filter(Boolean);
    return { steps: real, invisibleFocused: real.filter((s) => !s.visible).length, noIndicator: real.filter((s) => s.visible && !s.indicator).length };
  } catch (e) { return { error: String(e.message).split('\n')[0] }; } finally { await ctx.close(); }
}

// ---------- FAQ akkordeon ----------
async function faqCheck(p) {
  const { ctx, page } = await newPage(VIEWPORTS[0]);
  try {
    await gotoSettled(page, p);
    const trigger = page.locator('details > summary, [class*="faq" i] button, [class*="faq" i] [class*="question" i], [class*="accordion" i] button, [class*="accordion" i] [class*="header" i]').first();
    if (!(await trigger.count())) return { found: false };
    const snap = () => trigger.evaluate((t) => {
      const item = t.tagName === 'SUMMARY' ? t.parentElement : t.parentElement?.closest('details, [class*="item" i], li, div');
      // avval trigger'dan keyingi element (odatda javob konteyneri), keyin sinf nomi bo'yicha
      const ans = (t.tagName !== 'SUMMARY' && t.nextElementSibling) || item?.querySelector('[class*="answer" i], [class*="faq-a" i], [class*="body" i], [class*="content" i], p');
      return { tag: t.tagName.toLowerCase(), role: t.getAttribute('role'), tabIndex: t.tabIndex, ariaExpanded: t.getAttribute('aria-expanded'), ariaControls: t.getAttribute('aria-controls'), itemClass: item?.className || null, detailsOpen: item?.tagName === 'DETAILS' ? item.open : null, answerHeight: ans ? Math.round(ans.getBoundingClientRect().height) : null };
    });
    const before = await snap();
    await trigger.click(); await sleep(500);
    const afterClick = await snap();
    await trigger.click(); await sleep(500);
    await trigger.focus().catch(() => {});
    const focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    await page.keyboard.press('Enter'); await sleep(500);
    const afterEnter = await snap();
    return { found: true, count: await page.locator('details > summary, [class*="faq" i] [class*="question" i], [class*="accordion" i] button').count(), before, afterClick, focusedTagAfterFocus: focused, afterEnter };
  } catch (e) { return { error: String(e.message).split('\n')[0] }; } finally { await ctx.close(); }
}

// ---------- Til almashtirish ----------
async function langSwitchCheck(p) {
  const { ctx, page } = await newPage(VIEWPORTS[0]);
  const findSwitch = async (code) => {
    const names = { uz: /^(uz|uzb|o['ʻ‘]?z|o['ʻ‘]zbek(cha)?|ўзб?)$/i, ru: /^(ru|rus|рус(ский)?)$/i, en: /^(en|eng(lish)?)$/i };
    const cands = page.locator(`a[hreflang="${code}"], a[lang="${code}"], a[data-lang="${code}"], button[data-lang="${code}"], header a, nav a, [class*="lang" i] a, [class*="lang" i] button`);
    const n = await cands.count();
    for (let i = 0; i < n; i++) {
      const a = cands.nth(i);
      const attrs = await a.evaluate((el) => ({ t: el.textContent.trim(), hl: el.getAttribute('hreflang') || el.getAttribute('lang') || el.getAttribute('data-lang'), href: el.getAttribute('href') }));
      if (attrs.hl === code || names[code].test(attrs.t)) return a;
    }
    return null;
  };
  try {
    await gotoSettled(page, p);
    const seq = [{ step: 'start', url: page.url(), lang: await page.getAttribute('html', 'lang'), h1: await page.locator('h1').first().textContent().catch(() => null) }];
    for (const code of ['ru', 'en', 'uz']) {
      const a = await findSwitch(code);
      if (!a) { seq.push({ step: `→${code}`, error: 'til tugmasi topilmadi' }); continue; }
      if (!(await a.isVisible())) { const t = page.locator('[class*="lang" i] button, [class*="lang" i] [aria-haspopup], [aria-label*="til" i], [aria-label*="язык" i], [aria-label*="language" i]').first(); if (await t.count()) await t.click().catch(() => {}); }
      await Promise.all([page.waitForLoadState('load'), a.click({ timeout: 5000 }).catch((e) => seq.push({ step: `→${code}`, clickError: String(e.message).split('\n')[0] }))]);
      await sleep(400);
      seq.push({ step: `→${code}`, url: page.url(), lang: await page.getAttribute('html', 'lang'), h1: (await page.locator('h1').first().textContent().catch(() => null))?.trim().slice(0, 80) });
    }
    await page.goBack().catch(() => {}); seq.push({ step: 'back', url: page.url() });
    await page.goForward().catch(() => {}); seq.push({ step: 'forward', url: page.url() });
    await page.reload().catch(() => {}); seq.push({ step: 'reload', url: page.url(), lang: await page.getAttribute('html', 'lang') });
    return { seq };
  } catch (e) { return { error: String(e.message).split('\n')[0] }; } finally { await ctx.close(); }
}

// ---------- Accessibility matnlari (alt/aria/placeholder) ----------
async function a11yTexts(p) {
  const { ctx, page } = await newPage(VIEWPORTS[0]);
  try {
    await gotoSettled(page, p);
    const d = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('[aria-label],[alt],[title],[placeholder]').forEach((el) => {
        for (const a of ['aria-label', 'alt', 'title', 'placeholder']) if (el.hasAttribute(a) && el.getAttribute(a).trim()) items.push({ el: el.tagName.toLowerCase(), attr: a, value: el.getAttribute(a).trim().slice(0, 80) });
      });
      return { lang: document.documentElement.lang, items, imgsNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src.slice(0, 120)), iframesNoTitle: [...document.querySelectorAll('iframe')].filter((f) => !f.title).length };
    });
    d.possiblyUntranslated = /^(ru|en)/i.test(d.lang || '') ? d.items.filter((i) => UZ_MARKERS.test(i.value)) : [];
    const reduce = await newPage(VIEWPORTS[0], { reducedMotion: 'reduce' });
    await reduce.page.goto(url(p), { waitUntil: 'load', timeout: 45000 });
    await sleep(800);
    d.runningAnimationsWithReducedMotion = await reduce.page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    await reduce.ctx.close();
    return d;
  } catch (e) { return { error: String(e.message).split('\n')[0] }; } finally { await ctx.close(); }
}

// ---------- Formalar (mock bilan) ----------
const TEST = { name: 'AUDIT TEST yuborilmaydi', phone: '+998 90 000 00 00', email: 'audit-test@example.invalid', message: 'AUDIT TEST — bu so\'rov mock qilinadi va serverga yuborilmaydi.' };
async function describeForms(page) {
  return page.evaluate(() => [...document.forms].map((f, fi) => ({
    index: fi, id: f.id || null, action: f.getAttribute('action'), method: f.getAttribute('method'), novalidate: f.hasAttribute('novalidate'),
    fields: [...f.querySelectorAll('input,textarea,select')].map((el) => {
      const lbl = el.labels ? [...el.labels].map((l) => l.textContent.trim()).join(' ') : '';
      const lb = el.getAttribute('aria-labelledby');
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(), type: el.type, name: el.name, id: el.id || null, required: el.required, autocomplete: el.getAttribute('autocomplete'),
        maxlength: el.getAttribute('maxlength'), pattern: el.getAttribute('pattern'), labelsLength: el.labels ? el.labels.length : 0, labelText: lbl,
        ariaLabel: el.getAttribute('aria-label'), ariaLabelledbyText: lb ? lb.split(/\s+/).map((id) => document.getElementById(id)?.textContent.trim()).join(' ') : null,
        placeholder: el.getAttribute('placeholder'),
        accessibleNameSource: lbl ? 'label' : el.getAttribute('aria-label') ? 'aria-label' : lb ? 'aria-labelledby' : el.getAttribute('title') ? 'title' : el.getAttribute('placeholder') ? 'placeholder-only' : 'NONE',
        hiddenLikeHoneypot: el.type !== 'hidden' && (cs.display === 'none' || cs.visibility === 'hidden' || r.left < -1000 || cs.opacity === '0' || el.tabIndex === -1),
      };
    }),
  })));
}
async function visibleMessages(page) {
  return page.evaluate(() => [...document.querySelectorAll('[role="alert"],[role="status"],[aria-live],[class*="status" i],[class*="error" i],[class*="success" i],[class*="message" i],[class*="notice" i],[class*="toast" i],.invalid-feedback')]
    .filter((e) => e.offsetParent !== null && e.textContent.trim()).map((e) => ({ cls: typeof e.className === 'string' ? e.className.slice(0, 60) : '', role: e.getAttribute('role'), live: e.getAttribute('aria-live'), text: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 160) })));
}
async function fillForm(page, formIndex, values) {
  return page.evaluate(({ formIndex, values }) => {
    const f = document.forms[formIndex]; const filled = [];
    for (const el of f.querySelectorAll('input,textarea')) {
      const cs = getComputedStyle(el); if (['hidden', 'submit', 'button', 'checkbox', 'radio', 'file'].includes(el.type) || cs.display === 'none' || cs.visibility === 'hidden' || el.getBoundingClientRect().left < -1000) continue;
      const key = `${el.name} ${el.id} ${el.type} ${el.placeholder || ''}`.toLowerCase();
      let v = null;
      if (/tel|phone|telefon|телефон/.test(key)) v = values.phone; else if (/mail|почт/.test(key)) v = values.email;
      else if (el.tagName === 'TEXTAREA' || /message|xabar|comment|izoh|сообщ/.test(key)) v = values.message; else if (/name|ism|имя|fio|f\.i\.sh/.test(key)) v = values.name;
      if (v === null || v === undefined) continue;
      el.focus(); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); filled.push(el.name || el.id || el.type);
    }
    return filled;
  }, { formIndex, values });
}
async function submit(page, formIndex, { double = false } = {}) {
  const btn = page.locator('form').nth(formIndex).locator('button[type="submit"], input[type="submit"], button:not([type])').first();
  if (!(await btn.count())) return 'submit tugmasi topilmadi';
  if (double) { await btn.dblclick({ timeout: 5000 }).catch(() => {}); } else { await btn.click({ timeout: 5000 }).catch(() => {}); }
  await sleep(1800);
  return 'ok';
}
async function formScenarios(p) {
  const out = { page: p, forms: [], scenarios: [] };
  const base = await newPage(VIEWPORTS[0], { mode: 'locked' });
  try {
    await base.page.goto(url(p), { waitUntil: 'load', timeout: 45000 });
    out.forms = await describeForms(base.page);
  } finally { await base.ctx.close(); }
  for (const f of out.forms) {
    if (!f.fields.some((x) => ['text', 'tel', 'email', 'textarea'].includes(x.type) || x.tag === 'textarea')) continue;
    const scen = [
      { id: 'S1_bosh', values: {} },
      { id: 'S2_faqat_ism', values: { name: TEST.name } },
      { id: 'S3_notogri_telefon', values: { name: TEST.name, phone: 'abc' } },
      { id: 'S4_notogri_email', values: { name: TEST.name, phone: TEST.phone, email: 'test@' } },
      { id: 'S5_uzun_matn_mock_success', values: { ...TEST, message: 'A'.repeat(5000) }, mock: { status: 200, body: '{"ok":true,"success":true}', contentType: 'application/json', delayMs: 300 } },
      { id: 'S6_ikki_marta_bosish', values: TEST, double: true, mock: { status: 200, body: '{"ok":true,"success":true}', contentType: 'application/json', delayMs: 1500 } },
      { id: 'S7_server_xatosi_500', values: TEST, mock: { status: 500, body: '{"ok":false,"error":"mock"}', contentType: 'application/json', delayMs: 300 } },
    ];
    for (const s of scen) {
      const t = await newPage(VIEWPORTS[0], { mode: 'locked', mock: s.mock });
      try {
        await gotoSettled(t.page, p);
        t.state.armed = true; // shu nuqtadan boshlab faqat statik resurslar tarmoqqa chiqadi
        const before = await visibleMessages(t.page);
        t.log.length = 0; // sahifa yuklanishidagi statik so'rovlar hisobga olinmaydi
        const filled = await fillForm(t.page, f.index, s.values);
        const sres = await submit(t.page, f.index, { double: s.double });
        const after = await visibleMessages(t.page);
        const btnState = await t.page.locator('form').nth(f.index).locator('button[type="submit"], input[type="submit"], button:not([type])').first().evaluate((b) => ({ disabled: b.disabled, text: (b.value || b.textContent || '').trim().slice(0, 40), ariaBusy: b.getAttribute('aria-busy') })).catch(() => null);
        const invalid = await t.page.evaluate((fi) => [...document.forms[fi].querySelectorAll('[aria-invalid="true"], :invalid')].map((e) => e.name || e.id).slice(0, 10), f.index);
        out.scenarios.push({
          form: f.index, scenario: s.id, filled, submit: sres,
          newMessages: after.filter((a) => !before.some((b) => b.text === a.text)),
          interceptedRequests: t.log.filter((l) => !/^LOCKED_MOCK/.test(l.action) || l.type !== 'image').map((l) => ({ action: l.action, method: l.method, url: l.url.slice(0, 160), postDataSample: (l.postData || '').slice(0, 120) })),
          submitRequestCount: t.log.filter((l) => /MOCK|ABORT_FORM/.test(l.action) && ['fetch', 'xhr', 'document', 'ping', 'other'].includes(l.type)).length,
          invalidFields: invalid, button: btnState, dialogsOrErrors: t.errors,
        });
      } catch (e) { out.scenarios.push({ form: f.index, scenario: s.id, error: String(e.message).split('\n')[0] }); } finally { await t.ctx.close(); }
    }
  }
  return out;
}

// ---------- Aloqa havolalari ----------
async function contactLinks(p) {
  const { ctx, page } = await newPage(VIEWPORTS[0]);
  try {
    await gotoSettled(page, p);
    return await page.evaluate(() => {
      const hrefs = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim().slice(0, 40), target: a.target, rel: a.rel }));
      return {
        tel: hrefs.filter((h) => /^tel:/i.test(h.href)), mailto: hrefs.filter((h) => /^mailto:/i.test(h.href)),
        telegram: hrefs.filter((h) => /t\.me\/|telegram\.me/i.test(h.href)), social: hrefs.filter((h) => /instagram|facebook|linkedin|youtube|tiktok|x\.com|twitter/i.test(h.href)),
        maps: hrefs.filter((h) => /maps|2gis|yandex\.[a-z]+\/maps/i.test(h.href)), mapIframes: [...document.querySelectorAll('iframe')].map((f) => ({ src: (f.getAttribute('src') || '').slice(0, 160), title: f.title, loading: f.loading })),
        blankWithoutNoopener: hrefs.filter((h) => h.target === '_blank' && !/noopener|noreferrer/.test(h.rel)).length,
      };
    });
  } catch (e) { return { error: String(e.message).split('\n')[0] }; } finally { await ctx.close(); }
}

for (const p of PAGES) {
  process.stderr.write(`… ${p}\n`);
  const r = {};
  if (!args['skip-viewports']) { r.layout = {}; for (const vp of VIEWPORTS) r.layout[vp.name] = await layoutCheck(p, vp); }
  r.menuMobile = await menuCheck(p);
  r.focus = await focusCheck(p);
  r.langSwitch = await langSwitchCheck(p);
  r.a11yTexts = await a11yTexts(p);
  r.contactLinks = await contactLinks(p);
  if (/blog|faq/i.test(p)) r.faq = await faqCheck(p);
  if (!args['skip-forms']) r.forms = await formScenarios(p);
  result.pages[p] = r;
  await sleep(500);
}
await browser.close();
result.finishedAt = tashkentNow();
writeJSON(path.join(OUT, `ui_checks_${args.browser}.json`), result);

// Qisqa xulosa
const lines = [`# UI tekshiruvlari — ${result.browser}`, '', `- Baza: ${BASE}`, `- Boshlandi: ${startedAt}`, `- Tugadi: ${result.finishedAt}`, ''];
for (const [p, r] of Object.entries(result.pages)) {
  lines.push(`## ${p}`);
  if (r.layout) for (const [vp, l] of Object.entries(r.layout)) lines.push(`- ${vp}: ${l.error ? 'XATO ' + l.error : `gorizontal overflow=${l.horizontalOverflow} (scrollWidth ${l.scrollWidth}/${l.clientWidth}); kesilgan=${l.clipped.length}; <14px matn=${l.smallTextCount}`}`);
  const m = r.menuMobile; lines.push(`- Mobil menyu: ${m.error ? 'XATO ' + m.error : m.found ? `aria-expanded ${m.before.ariaExpanded}→${m.after.ariaExpanded}→(Esc) ${m.afterEscape.ariaExpanded}; yopiq holatda fokusga tushadigan yashirin havolalar=${m.hiddenLinksFocusableWhenClosed}` : 'toggle topilmadi'}`);
  const f = r.focus; lines.push(`- Fokus: ${f.error ? 'XATO ' + f.error : `${f.steps.length} qadam; ko'rinmas fokus=${f.invisibleFocused}; indikatorsiz=${f.noIndicator}`}`);
  const ls = r.langSwitch; lines.push(`- Til: ${ls.error ? 'XATO ' + ls.error : ls.seq.map((s) => `${s.step}:${s.url ? new URL(s.url).pathname : s.error || s.clickError}`).join(' → ')}`);
  const a = r.a11yTexts; lines.push(`- A11y matnlari: ${a.error ? 'XATO ' + a.error : `alt'siz rasm=${a.imgsNoAlt.length}; title'siz iframe=${a.iframesNoTitle}; tarjima qilinmagan bo'lishi mumkin=${a.possiblyUntranslated.map((x) => `${x.attr}="${x.value}"`).join('; ') || 0}; reduced-motionda animatsiya=${a.runningAnimationsWithReducedMotion}`}`);
  if (r.faq) lines.push(`- FAQ: ${r.faq.error ? 'XATO ' + r.faq.error : r.faq.found ? `aria-expanded ${r.faq.before.ariaExpanded}→${r.faq.afterClick.ariaExpanded}; aria-controls=${r.faq.before.ariaControls}; balandlik ${r.faq.before.answerHeight}→${r.faq.afterClick.answerHeight}; Enter'dan keyin ${r.faq.afterEnter.answerHeight}` : 'topilmadi'}`);
  if (r.forms) {
    for (const fm of r.forms.forms) lines.push(`- Forma #${fm.index}: novalidate=${fm.novalidate}; maydonlar: ${fm.fields.map((x) => `${x.name || x.type}[${x.accessibleNameSource}${x.required ? ',required' : ''}${x.hiddenLikeHoneypot ? ',yashirin' : ''}]`).join(', ')}`);
    for (const s of r.forms.scenarios) lines.push(`  - ${s.scenario}: ${s.error ? 'XATO ' + s.error : `yangi xabar: ${s.newMessages.map((m) => `"${m.text}"`).join(' ') || '—'}; ushlangan yuborish so'rovlari=${s.submitRequestCount}; tugma=${s.button ? JSON.stringify(s.button) : '—'}`}`);
  }
  lines.push('');
}
fs.writeFileSync(path.join(OUT, `ui_checks_${args.browser}_summary.md`), lines.join('\n') + '\n');
console.log(`OK: ui_checks_${args.browser}.json`);
