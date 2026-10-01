// Audit skriptlari uchun umumiy yordamchilar.
// Muhim xavfsizlik qoidasi: brauzer ichidan production serverga GET bo'lmagan
// so'rov (POST/PUT/...), forma backendlari va analitika "collect" so'rovlari
// hech qachon yuborilmaydi — ular ushlab qolinadi, qayd etiladi va mock/abort qilinadi.
import fs from 'node:fs';
import path from 'node:path';

export function parseArgs(argv, defaults) {
  const args = { ...defaults };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}

export function tashkentNow() {
  const d = new Date();
  const s = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(d);
  return `${s} Asia/Tashkent`;
}

export function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); return p; }
export function writeJSON(file, data) { ensureDir(path.dirname(file)); fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  });
  await Promise.all(workers);
  return out;
}

// Analitika/reklama ma'lumot yuboruvchi endpointlar (skript yuklanishi emas, "hit"lar).
export const ANALYTICS_HIT = [
  /google-analytics\.com\/(g\/)?collect/i,
  /analytics\.google\.com\/g\/collect/i,
  /\/g\/collect\?/i,
  /googleads\.g\.doubleclick\.net\/pagead/i,
  /googleadservices\.com\/pagead/i,
  /google\.[a-z.]+\/pagead/i,
  /google\.[a-z.]+\/ads\/ga-audiences/i,
  /mc\.yandex\.(ru|com|uz)\/(watch|webvisor|clmap)/i,
  /facebook\.com\/tr/i,
];
// Forma yetkazuvchi tashqi xizmatlar: GET bo'lsa ham bloklanadi.
export const FORM_BACKENDS = [
  /api\.telegram\.org/i, /formspree\.io/i, /getform\.io/i, /web3forms\.com/i,
  /api\.emailjs\.com/i, /script\.google(usercontent)?\.com/i, /hooks\.zapier\.com/i,
  /make\.com|integromat/i, /bitrix24|amocrm|kommo/i, /sendgrid|mailgun|mandrill/i,
];
const STATIC_EXT = /\.(css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|map)(\?|#|$)/i;

/**
 * Sahifa/kontekst uchun xavfsiz marshrutlash.
 * mode: 'browse'  — oddiy ko'rish: GET ruxsat, analitika hitlari va forma backendlari abort, GET bo'lmaganlari mock 200.
 *       'locked'  — forma sinovi: faqat statik GET resurslar o'tadi; qolgan hammasi (navigatsiya, XHR, fetch) mock.
 * mock: { status, body, contentType, delayMs }
 */
export async function installSafetyRoutes(target, log, opts = {}) {
  // armed=false bo'lsa 'locked' rejim hali qo'llanmaydi (sahifaning o'zi yuklanishi uchun);
  // forma sinovida sahifa yuklangach state.armed = true qilinadi.
  const state = { mode: opts.mode || 'browse', armed: false, mock: opts.mock || { status: 200, body: '{"ok":true,"success":true}', contentType: 'application/json', delayMs: 0 } };
  await target.route('**/*', async (route) => {
    const req = route.request();
    const url = req.url();
    const method = req.method();
    const entry = { t: Date.now(), method, url: url.slice(0, 500), type: req.resourceType() };
    try {
      if (/^(data|blob):/i.test(url)) return route.continue();
      if (FORM_BACKENDS.some((r) => r.test(url))) {
        log.push({ ...entry, action: 'ABORT_FORM_BACKEND', postData: (req.postData() || '').slice(0, 300) });
        return route.abort('blockedbyclient');
      }
      if (ANALYTICS_HIT.some((r) => r.test(url))) {
        log.push({ ...entry, action: 'ABORT_ANALYTICS_HIT', postData: (req.postData() || '').slice(0, 300) });
        return route.abort('blockedbyclient');
      }
      if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
        const m = state.mock;
        log.push({ ...entry, action: `MOCK_${m.status}`, postData: (req.postData() || '').slice(0, 1000) });
        if (m.delayMs) await sleep(m.delayMs);
        return route.fulfill({ status: m.status, contentType: m.contentType, body: m.body });
      }
      if (state.mode === 'locked' && state.armed) {
        const isStatic = STATIC_EXT.test(new URL(url).pathname) && ['stylesheet', 'script', 'image', 'font', 'media'].includes(req.resourceType());
        if (!isStatic) {
          const m = state.mock;
          log.push({ ...entry, action: `LOCKED_MOCK_${m.status}` });
          if (m.delayMs) await sleep(m.delayMs);
          if (req.resourceType() === 'document') {
            return route.fulfill({ status: m.status, contentType: 'text/html', body: '<!doctype html><title>AUDIT MOCK</title><p>AUDIT MOCK — so\'rov serverga yuborilmadi.</p>' });
          }
          return route.fulfill({ status: m.status, contentType: m.contentType, body: m.body });
        }
      }
      return route.continue();
    } catch (e) {
      log.push({ ...entry, action: 'ROUTE_ERROR', error: String(e).slice(0, 200) });
      try { await route.abort(); } catch { /* already handled */ }
    }
  });
  return state;
}

export function csvEscape(v) {
  if (v === null || v === undefined) return '';
  const s = Array.isArray(v) ? v.join(' | ') : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export function toCSV(rows, cols) {
  return [cols.join(','), ...rows.map((r) => cols.map((c) => csvEscape(r[c])).join(','))].join('\n') + '\n';
}

export function normUrl(u) {
  try { const x = new URL(u); x.hash = ''; return x.toString(); } catch { return u; }
}
