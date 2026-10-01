// WCAG 2.x kontrast nisbati: taklif etilgan VeroLex palitrasi juftliklari.
// Ishga tushirish: node audit/evidence/scripts/contrast.mjs > audit/evidence/05_contrast.json
const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const C = {
  navy: '#142131', bg: '#F7F6F2', text: '#20262E', gold: '#AD8A4F', white: '#FFFFFF',
  muted: '#5B6470', goldDark: '#7A5E2E', goldLight: '#C9A86A', line: '#D9D4C7',
  border: '#7D838B', error: '#B42318', success: '#1E6B41', onNavy2: '#E8E4DA', onNavyMuted: '#AEB6C2',
};
const pairs = [
  ['text', 'bg', 'Asosiy matn — och fonda'],
  ['text', 'white', 'Asosiy matn — oq fonda'],
  ['navy', 'bg', 'To\'q ko\'k matn/sarlavha — och fonda'],
  ['white', 'navy', 'Oq matn — to\'q ko\'k header/footer/tugma'],
  ['bg', 'navy', 'Och fon rangidagi matn — to\'q ko\'k fonda'],
  ['muted', 'bg', 'Ikkilamchi matn (taklif #5B6470) — och fonda'],
  ['gold', 'bg', 'Oltin — och fonda (matn uchun)'],
  ['gold', 'white', 'Oltin — oq fonda (matn uchun)'],
  ['gold', 'navy', 'Oltin — to\'q ko\'k fonda'],
  ['white', 'gold', 'Oq matn — oltin tugmada'],
  ['navy', 'gold', 'To\'q ko\'k matn — oltin tugmada'],
  ['goldDark', 'bg', 'To\'q oltin (taklif #7A5E2E) — och fonda'],
  ['goldLight', 'navy', 'Och oltin (taklif #C9A86A) — to\'q ko\'k fonda'],
  ['line', 'bg', 'Ajratuvchi chiziq (taklif #D9D4C7) — och fonda (dekorativ)'],
  ['navy', 'white', 'Fokus halqasi to\'q ko\'k — oq fonda (UI komponent)'],
  ['goldLight', 'navy', 'Fokus halqasi och oltin — to\'q ko\'k fonda (UI komponent)'],
  ['muted', 'white', 'Ikkilamchi matn — oq kartada'],
  ['border', 'white', 'Input chegarasi (taklif #7D838B) — oq fonda (UI komponent)'],
  ['border', 'bg', 'Input chegarasi — och fonda (UI komponent)'],
  ['error', 'white', 'Xato matni (taklif #B42318) — oq fonda'],
  ['error', 'bg', 'Xato matni — och fonda'],
  ['success', 'white', 'Muvaffaqiyat matni (taklif #1E6B41) — oq fonda'],
  ['success', 'bg', 'Muvaffaqiyat matni — och fonda'],
  ['white', 'goldDark', 'Oq matn — to\'q oltin tugmada'],
  ['onNavy2', 'navy', 'Footer ikkilamchi matni (taklif #E8E4DA) — to\'q ko\'k fonda'],
  ['onNavyMuted', 'navy', 'Footer xira matni (taklif #AEB6C2) — to\'q ko\'k fonda'],
];
const out = pairs.map(([fg, bg, note]) => {
  const r = Math.round(ratio(C[fg], C[bg]) * 100) / 100;
  return {
    juftlik: `${C[fg]} / ${C[bg]}`, izoh: note, nisbat: r,
    'AA_oddiy_matn_4.5': r >= 4.5 ? 'PASS' : 'FAIL',
    'AA_katta_matn_3.0': r >= 3 ? 'PASS' : 'FAIL',
    'AAA_oddiy_matn_7.0': r >= 7 ? 'PASS' : 'FAIL',
    'UI_komponent_3.0': r >= 3 ? 'PASS' : 'FAIL',
  };
});
console.log(JSON.stringify({ usul: 'WCAG 2.x relative luminance', ranglar: C, natijalar: out }, null, 2));
