// Audit skriptlarining o'zini tekshirish: sun'iy fixture saytda ataylab qo'yilgan
// nuqsonlar aniqlanadimi? Tarmoqqa chiqmaydi (faqat 127.0.0.1).
// Ishga tushirish: node selftest.mjs  (natija: ../07_selftest_fixture.txt)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { tashkentNow } from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, 'fixture');
const PORT = 8089;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.xml': 'application/xml', '.txt': 'text/plain' };
// Server tomonida hisoblagich: forma so'rovi (GET bo'lmagan yoki /api/ ga) serverga yetib keldimi?
const serverSeen = { nonGet: 0, api: 0 };
const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (u.pathname.startsWith('/api/')) serverSeen.api++;
  if (req.method !== 'GET' && req.method !== 'HEAD') { serverSeen.nonGet++; res.writeHead(405); return res.end('fixture: faqat GET'); }
  let p = decodeURIComponent(u.pathname);
  if (p === '/ru' || p === '/en') { res.writeHead(302, { location: `${p}/` }); return res.end(); }
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end('<!doctype html><title>404</title>'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'verolex-selftest-'));
// Asinxron: sinxron chaqiruv shu jarayondagi fixture serverni bloklab qo'yadi.
const run = (script, extra = []) => promisify(execFile)(process.execPath, [path.join(HERE, script), '--base', `http://127.0.0.1:${PORT}`, '--out', OUT, '--delay', '20', ...extra], { timeout: 600000, maxBuffer: 16 * 1024 * 1024 });
const started = tashkentNow();
let inv; let ui;
try {
  await run('site_inventory.mjs');
  await run('ui_checks.mjs', ['--pages', '/about.html,/blog.html,/ru/index.html,/en/index.html']);
  inv = JSON.parse(fs.readFileSync(path.join(OUT, 'inventory.json'), 'utf8'));
  ui = JSON.parse(fs.readFileSync(path.join(OUT, 'ui_checks_chromium.json'), 'utf8'));
} finally { server.close(); }

const has = (re) => inv.issues.some((i) => re.test(i.issue));
const en = ui.pages['/en/index.html'];
const sc = (id) => en.forms.scenarios.find((s) => s.scenario === id);
const checks = [
  ['Sitemapdagi 7 URL topildi va 200 qaytardi', inv.sitemapCount === 7 && inv.pages.every((p) => p.status === 200)],
  ['Haqiqiy 404 aniqlandi', inv.aliases.some((a) => /__audit-404/.test(a.url) && a.status === 404)],
  ['Bir nechta email aniqlandi', has(/bir nechta email/)],
  ['hreflang qaytish havolasi yo\'qligi aniqlandi', has(/qaytish havolasi yo'q/)],
  ['GA4 IDsi bilan solishtiruvchi shart aniqlandi (A01 turidagi xato)', has(/analitika IDsi bilan solishtiruvchi shart/)],
  ['Open Graph yetishmasligi aniqlandi', has(/Open Graph/)],
  ['Labelsiz (faqat placeholder) maydonlar aniqlandi', en.forms.forms[0].fields.filter((f) => f.accessibleNameSource === 'placeholder-only').length === 3],
  ['novalidate aniqlandi', en.forms.forms[0].novalidate === true],
  ['Honeypot maydoni aniqlandi', en.forms.forms[0].fields.some((f) => f.name === 'website' && f.hiddenLikeHoneypot)],
  ['Bo\'sh forma: EN xabar ushlandi va so\'rov yuborilmadi', sc('S1_bosh').newMessages.some((m) => /Please enter your name/.test(m.text)) && sc('S1_bosh').submitRequestCount === 0],
  ['Noto\'g\'ri telefon frontendda qabul qilinishi aniqlandi (mock)', sc('S3_notogri_telefon').submitRequestCount === 1],
  ['Ikki marta bosishda 2 so\'rov aniqlandi (mock)', sc('S6_ikki_marta_bosish').submitRequestCount === 2],
  ['Forma so\'rovlari serverga yetib bormadi (server hisoblagichi: GET bo\'lmagan=0, /api/=0)', serverSeen.nonGet === 0 && serverSeen.api === 0],
  ['RU/EN sahifada o\'zbekcha aria-label aniqlandi', ui.pages['/ru/index.html'].a11yTexts.possiblyUntranslated.length >= 2],
  ['FAQ: aria-expanded yo\'qligi va klaviatura bilan ochilmasligi aniqlandi', ui.pages['/blog.html'].faq.afterClick.ariaExpanded === null && ui.pages['/blog.html'].faq.afterClick.answerHeight > 0 && ui.pages['/blog.html'].faq.afterEnter.answerHeight === 0],
  ['Mobil gorizontal overflow aniqlandi', ui.pages['/about.html'].layout['mobile-360'].horizontalOverflow === true],
  ['Til almashtirish ketma-ketligi qayd etildi', ui.pages['/blog.html'].langSwitch.seq.find((s) => s.step === '→ru')?.url.endsWith('/ru/blog.html')],
];
const lines = [`Selftest: ${started} → ${tashkentNow()}`, `Brauzer: ${ui.browser}`, `Vaqtinchalik natijalar: ${OUT}`, ''];
let fail = 0;
for (const [name, ok] of checks) { lines.push(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
lines.push('', `Jami: ${checks.length - fail}/${checks.length} PASS`);
const text = lines.join('\n') + '\n';
fs.writeFileSync(path.join(HERE, '..', '07_selftest_fixture.txt'), text);
process.stdout.write(text);
process.exit(fail ? 1 : 0);
