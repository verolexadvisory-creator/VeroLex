"""VeroLex sayti: korporativ dizayn qatlami, jamoa va hamkorlar bo'limlarini yig'ish.

Ishlatish (repo ildizidan):
    python3 tools/build_site.py site                 # site-data/*.json dan
    python3 tools/build_site.py <dir> --data <dir>   # boshqa ma'lumot papkasi (masalan, namuna)

Skript idempotent: qayta ishga tushirilganda faqat <!-- VL:... --> belgilari orasidagi
qism qayta yoziladi, qolgan o'zgarishlar ikki marta qo'llanmaydi.
"""
import sys, re, json, html, pathlib

args = sys.argv[1:]
root = pathlib.Path(args[0])
data_dir = pathlib.Path(args[args.index('--data') + 1]) if '--data' in args else pathlib.Path(__file__).resolve().parent.parent / 'site-data'

LANGS = {'uz': '', 'ru': 'ru/', 'en': 'en/'}
BASE = 'https://verolex.uz/'
VERSION = '10'
EMAIL_OLD, EMAIL_NEW = 'verolexadvisory@gmail.com', 'info@verolex.uz'
LINKEDIN_OLD, LINKEDIN_NEW = 'https://www.linkedin.com/in/vero-lex-937a04383/', 'https://www.linkedin.com/company/144922984/'
FONTS_NEW = '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet">'
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'

L = {
 'team_eyebrow': {'uz': 'Jamoa', 'ru': 'Команда', 'en': 'Team'},
 'team_title': {'uz': 'Rahbariyat va jamoa', 'ru': 'Руководство и команда', 'en': 'Leadership and team'},
 'team_desc': {'uz': 'Har bir loyihani tajribali yuristlarimiz shaxsan olib boradi.', 'ru': 'Каждый проект лично ведут наши опытные юристы.', 'en': 'Every matter is handled personally by our experienced lawyers.'},
 'team_photo_alt': {'uz': 'VeroLex Advisory jamoasi ofisda, Toshkent', 'ru': 'Команда VeroLex Advisory в офисе, Ташкент', 'en': 'The VeroLex Advisory team at the office in Tashkent'},
 'team_photo_cap': {'uz': 'VeroLex Advisory jamoasi', 'ru': 'Команда VeroLex Advisory', 'en': 'The VeroLex Advisory team'},
 'team_photo_sub': {'uz': 'Toshkent, Yunusobod tumani', 'ru': 'Ташкент, Юнусабадский район', 'en': 'Tashkent, Yunusabad district'},
 'position': {'uz': 'Lavozimi', 'ru': 'Должность', 'en': 'Position'},
 'specialization': {'uz': 'Mutaxassisligi', 'ru': 'Специализация', 'en': 'Practice'},
 'leader_badge': {'uz': 'Rahbar', 'ru': 'Руководитель', 'en': 'Managing Partner'},
 'team_more': {'uz': 'Butun jamoa', 'ru': 'Вся команда', 'en': 'Meet the team'},
 'clients_title': {'uz': 'Bizga ishonch bildirgan kompaniyalar', 'ru': 'Компании, которые нам доверяют', 'en': 'Companies that trust us'},
 'clients_desc': {'uz': 'Biz bilan ishlayotgan va ishlagan mijoz kompaniyalar.', 'ru': 'Клиенты, с которыми мы работаем и работали.', 'en': 'Clients we work with and have worked with.'},
 'partners_title': {'uz': 'Hamkorlarimiz', 'ru': 'Наши партнёры', 'en': 'Our partners'},
 'partners_desc': {'uz': 'Biz bilan hamkorlikda ishlovchi kompaniyalar.', 'ru': 'Компании, с которыми мы сотрудничаем.', 'en': 'Firms we collaborate with.'},
 'partners_eyebrow': {'uz': 'Mijozlar va hamkorlar', 'ru': 'Клиенты и партнёры', 'en': 'Clients and partners'},
 'partners_home_title': {'uz': 'Biz bilan ishlayotgan va ishlagan kompaniyalar', 'ru': 'Компании, которые работают и работали с нами', 'en': 'Companies we work and have worked with'},
 'partners_more': {'uz': 'Barcha kompaniyalar', 'ru': 'Все компании', 'en': 'All companies'},
 'local': {'uz': 'Mahalliy kompaniyalar', 'ru': 'Местные компании', 'en': 'Local companies'},
 'foreign': {'uz': 'Xorijiy kompaniyalar', 'ru': 'Иностранные компании', 'en': 'Foreign companies'},
 'past': {'uz': 'Avval hamkorlik qilganmiz', 'ru': 'Сотрудничали ранее', 'en': 'Past engagement'},
 'logo_alt': {'uz': 'logotipi', 'ru': 'логотип', 'en': 'logo'},
}

def esc(s): return html.escape(s or '', quote=True)
def t(obj, lang): return (obj or {}).get(lang) or (obj or {}).get('uz') or ''

# ---------------- ma'lumot ----------------
team = json.loads((data_dir / 'team.json').read_text(encoding='utf-8'))
partners = json.loads((data_dir / 'partners.json').read_text(encoding='utf-8'))
sample = bool(team.get('_sample') or partners.get('_sample'))
members = sorted([m for m in team.get('members', []) if m.get('published') and t(m.get('name'), 'uz') and t(m.get('position'), 'uz')], key=lambda m: m.get('order', 99))
companies = [c for c in partners.get('companies', []) if c.get('published') and c.get('name')]

def member_card(m, lang, tag='h3'):
    name = t(m['name'], lang)
    img = f'<img src="{{root}}{esc(m["photo"])}" alt="{esc(name)}" loading="lazy" decoding="async" width="480" height="600">' if m.get('photo') else f'<div class="vl-mono" aria-hidden="true">{esc("".join(w[0] for w in name.split()[:2]))}</div>'
    spec = t(m.get('specialization'), lang)
    spec_html = f'<span class="vl-field"><small>{L["specialization"][lang]}</small>{esc(spec)}</span>' if spec else ''
    return (f'<article class="vl-member reveal">{img}<div class="vl-m-body"><{tag}>{esc(name)}</{tag}>'
            f'<span class="vl-field"><small>{L["position"][lang]}</small>{esc(t(m["position"], lang))}</span>{spec_html}</div></article>')

def person_ld(lang):
    if not members: return ''
    people = [{'@type': 'Person', 'name': t(m['name'], lang), 'jobTitle': t(m['position'], lang),
               **({'knowsAbout': t(m.get('specialization'), lang)} if t(m.get('specialization'), lang) else {}),
               **({'image': BASE + m['photo']} if m.get('photo') else {}),
               'worksFor': {'@id': BASE + '#org'}} for m in members]
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': people}, ensure_ascii=False, separators=(',', ':')) + '</script>'

def team_section(lang, root_prefix):
    leaders = [m for m in members if m.get('leader')]
    others = [m for m in members if not m.get('leader')]
    out = [f'<section class="sec" id="jamoa"><div class="container">',
           f'<div class="sec-head reveal"><span class="eyebrow">{L["team_eyebrow"][lang]}</span><h2>{L["team_title"][lang]}</h2><p>{L["team_desc"][lang]}</p></div>']
    if not members:
        out.append(f'<figure class="hero-photo vl-team-photo reveal" style="max-width:860px"><img src="{root_prefix}assets/img/team.webp" alt="{L["team_photo_alt"][lang]}" loading="lazy" decoding="async" width="1092" height="1120"><figcaption><b>{L["team_photo_cap"][lang]}</b>{L["team_photo_sub"][lang]}</figcaption></figure>')
    for m in leaders:
        name = t(m['name'], lang); spec = t(m.get('specialization'), lang)
        out.append(f'<article class="vl-leader reveal"><img src="{root_prefix}{esc(m["photo"])}" alt="{esc(name)}" loading="lazy" decoding="async" width="480" height="600"><div>'
                   f'<span class="vl-badge">{L["leader_badge"][lang]}</span><h3>{esc(name)}</h3>'
                   f'<span class="vl-field"><small>{L["position"][lang]}</small>{esc(t(m["position"], lang))}</span>'
                   + (f'<span class="vl-field"><small>{L["specialization"][lang]}</small>{esc(spec)}</span>' if spec else '') + '</div></article>')
    if others:
        out.append('<div class="vl-team-grid">' + ''.join(member_card(m, lang).replace('{root}', root_prefix) for m in others) + '</div>')
    out.append(person_ld(lang))
    out.append('</div></section>')
    return '\n'.join(out)

def logo_cell(c, lang, root_prefix):
    name = c['name']; country = t(c.get('country'), lang)
    meta = ' · '.join(x for x in [country, L['past'][lang] if c.get('status') == 'past' else ''] if x)
    img = f'<img src="{root_prefix}{esc(c["logo"])}" alt="{esc(name)} {L["logo_alt"][lang]}" loading="lazy" decoding="async" onerror="this.remove()">' if c.get('logo') else ''
    inner = f'{img}<span class="vl-logo-name">{esc(name)}</span>' + (f'<span class="vl-logo-meta">{esc(meta)}</span>' if meta else '')
    cls = 'vl-logo' + (' is-past' if c.get('status') == 'past' else '')
    if c.get('url'):
        return f'<a class="{cls}" href="{esc(c["url"])}" target="_blank" rel="noopener nofollow">{inner}</a>'
    return f'<div class="{cls}">{inner}</div>'

def partners_section(lang, root_prefix):
    if not companies: return ''
    out = [f'<section class="sec" id="hamkorlar" style="background:var(--white)"><div class="container">',
           f'<div class="sec-head reveal"><span class="eyebrow">{L["partners_eyebrow"][lang]}</span><h2>{L["partners_home_title"][lang]}</h2></div>']
    for rel, tkey, dkey in [('client', 'clients_title', 'clients_desc'), ('partner', 'partners_title', 'partners_desc')]:
        group = [c for c in companies if c.get('relation') == rel]
        if not group: continue
        out.append(f'<div class="vl-partners-block reveal"><h3>{L[tkey][lang]}</h3><p>{L[dkey][lang]}</p>')
        for scope in ('local', 'foreign'):
            g = sorted([c for c in group if c.get('scope') == scope], key=lambda c: (c.get('status') == 'past', c.get('order', 99)))
            if g:
                out.append(f'<div class="vl-geo">{L[scope][lang]}</div><div class="vl-logo-grid">' + ''.join(logo_cell(c, lang, root_prefix) for c in g) + '</div>')
        out.append('</div>')
    out.append('</div></section>')
    return '\n'.join(out)

def home_team(lang, root_prefix):
    if not members: return ''
    cards = ''.join(member_card(m, lang).replace('{root}', root_prefix) for m in members[:4])
    return (f'<section class="sec"><div class="container"><div class="sec-head reveal"><span class="eyebrow">{L["team_eyebrow"][lang]}</span><h2>{L["team_title"][lang]}</h2><p>{L["team_desc"][lang]}</p></div>'
            f'<div class="vl-team-grid">{cards}</div><div style="margin-top:28px" class="reveal"><a class="btn btn-ink" href="about.html#jamoa"><span>{L["team_more"][lang]}</span>{ARROW}</a></div></div></section>')

def home_partners(lang, root_prefix):
    if not companies: return ''
    cur = sorted(companies, key=lambda c: (c.get('status') == 'past', c.get('order', 99)))[:12]
    return (f'<section class="sec" style="background:var(--white)"><div class="container"><div class="sec-head reveal"><span class="eyebrow">{L["partners_eyebrow"][lang]}</span><h2>{L["partners_home_title"][lang]}</h2></div>'
            f'<div class="vl-logo-grid reveal">' + ''.join(logo_cell(c, lang, root_prefix) for c in cur) + '</div>'
            f'<div style="margin-top:28px" class="reveal"><a class="btn btn-ink" href="about.html#hamkorlar"><span>{L["partners_more"][lang]}</span>{ARROW}</a></div></div></section>')

def put_block(s, name, content, anchor_before):
    """<!-- VL:name --> ... <!-- /VL:name --> blokini yozadi; bo'lmasa anchor_before oldiga qo'yadi."""
    block = f'<!-- VL:{name} -->\n{content}\n<!-- /VL:{name} -->'
    pat = re.compile(rf'<!-- VL:{name} -->.*?<!-- /VL:{name} -->', re.S)
    if pat.search(s): return pat.sub(lambda _: block, s)
    i = s.index(anchor_before)
    return s[:i] + block + '\n' + s[i:]

stats = {}
def bump(k): stats[k] = stats.get(k, 0) + 1

# ---------------- barcha sahifalar ----------------
pages = sorted(list(root.glob('*.html')) + list(root.glob('ru/*.html')) + list(root.glob('en/*.html')))
for p in pages:
    if p.name.startswith('yandex_'): continue
    s = p.read_text(encoding='utf-8'); o = s
    lang = 'ru' if p.parent.name == 'ru' else 'en' if p.parent.name == 'en' else 'uz'
    root_prefix = '' if lang == 'uz' else '../'
    if p.name == '404.html': root_prefix = '/'
    # shriftlar
    s, n = re.subn(r'<link href="https://fonts\.googleapis\.com/css2\?family=Cormorant\+Garamond[^"]*" rel="stylesheet">', FONTS_NEW, s)
    if n: bump('fonts')
    # korporativ CSS qatlami
    if 'vl-corporate.css' not in s:
        s, n = re.subn(r'(<link rel="stylesheet" href="([^"]*?)vl-extra\.css\?v=\d+">)', lambda m: m.group(1) + f'\n<link rel="stylesheet" href="{m.group(2)}vl-corporate.css?v={VERSION}">', s)
        if n: bump('corp_css')
    s = re.sub(r'(\.(?:css|js))\?v=\d+', rf'\1?v={VERSION}', s)
    # aloqa ma'lumotlari
    if EMAIL_OLD in s: s = s.replace(EMAIL_OLD, EMAIL_NEW); bump('email')
    if LINKEDIN_OLD in s: s = s.replace(LINKEDIN_OLD, LINKEDIN_NEW); bump('linkedin')
    # bosh sahifa: tarozi o'rniga jamoa surati, harakatlanuvchi lenta olib tashlanadi, yangi bloklar
    if p.name == 'index.html':
        fig = (f'<figure class="hero-photo hr-seq d4"><img src="{root_prefix}assets/img/team.webp" alt="{L["team_photo_alt"][lang]}" width="1092" height="1120" fetchpriority="high" decoding="async">'
               f'<figcaption><b>{L["team_photo_cap"][lang]}</b>{L["team_photo_sub"][lang]}</figcaption></figure>')
        s, n = re.subn(r'<div class="scales-wrap hr-seq d4">\s*<svg class="scales".*?</svg>\s*</div>', fig, s, flags=re.S)
        if n: bump('hero_photo')
        s, n = re.subn(r'\n?<div class="ticker" aria-hidden="true">.*?</div>\s*</div>\n', '\n', s, flags=re.S)
        if n: bump('ticker')
        faq_anchor = '<section class="sec">\n  <div class="container">\n    <div class="sec-head center reveal">\n      <span class="eyebrow" data-i18n="ex_faq_pre">'
        s = put_block(s, 'HOME-TEAM', home_team(lang, root_prefix), faq_anchor)
        s = put_block(s, 'HOME-PARTNERS', home_partners(lang, root_prefix), faq_anchor)
    # Biz haqimizda: jamoa va hamkorlar bo'limlari
    if p.name == 'about.html':
        anchor = '<section class="sec" style="padding-bottom:0"></section>'
        s = put_block(s, 'TEAM', team_section(lang, root_prefix), anchor)
        s = put_block(s, 'PARTNERS', partners_section(lang, root_prefix), anchor)
    if s != o:
        p.write_text(s, encoding='utf-8'); bump('files')

# ---------------- SEO: tashkilot JSON-LD va sitemap lastmod ----------------
import datetime
TODAY = datetime.date.today().isoformat()
CONTACT_POINT = {'@type': 'ContactPoint', 'contactType': 'customer service', 'telephone': '+998771436888',
                 'email': EMAIL_NEW, 'areaServed': 'UZ', 'availableLanguage': ['uz', 'ru', 'en']}
def fix_org(m):
    try: data = json.loads(m.group(1))
    except Exception: return m.group(0)
    changed = False
    for g in data.get('@graph', []):
        types = g.get('@type'); types = types if isinstance(types, list) else [types]
        if 'Organization' in types or 'LegalService' in types:
            if g.get('contactPoint') != CONTACT_POINT: g['contactPoint'] = CONTACT_POINT; changed = True
            if g.get('foundingDate') != '2020': g['foundingDate'] = '2020'; changed = True
            same = g.get('sameAs', [])
            if LINKEDIN_NEW not in same: g['sameAs'] = [x for x in same if 'linkedin.com' not in x] + [LINKEDIN_NEW]; changed = True
    if not changed: return m.group(0)
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '</script>'
for p in pages:
    if p.name.startswith('yandex_') or p.name == '404.html': continue
    s = p.read_text(encoding='utf-8')
    s2 = re.sub(r'<script type="application/ld\+json">(.*?)</script>', fix_org, s, count=1, flags=re.S)
    if s2 != s: p.write_text(s2, encoding='utf-8'); bump('org_ld')
sm = root / 'sitemap.xml'
if sm.exists():
    x = sm.read_text(encoding='utf-8')
    x2 = re.sub(r'\s*<lastmod>[^<]*</lastmod>', '', x)
    x2 = re.sub(r'(<loc>[^<]+</loc>)', rf'\1\n    <lastmod>{TODAY}</lastmod>', x2)
    if x2 != x: sm.write_text(x2, encoding='utf-8'); bump('sitemap_lastmod')

# JS va README ichidagi aloqa ma'lumotlari
for f in [root / 'assets/js/i18n.js', root / 'README.md', root / 'privacy.html']:
    if f.exists():
        s = f.read_text(encoding='utf-8'); o = s
        s = s.replace(EMAIL_OLD, EMAIL_NEW).replace(LINKEDIN_OLD, LINKEDIN_NEW)
        if s != o: f.write_text(s, encoding='utf-8'); bump('assets_contacts')

print(json.dumps({'members': len(members), 'companies': len(companies), 'sample': sample, **stats}, ensure_ascii=False))
