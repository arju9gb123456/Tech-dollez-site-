#!/usr/bin/env python3
"""
Tech Dollez — static page builder.

Edit the sources in _src/ and run:   python3 _src/build.py
It writes the final pages (index.html, services.html, ...) and sitemap.xml
into the repo root. No dependencies, no build step needed on Vercel.

  _src/partials/   shared head, nav, footer, overlays
  _src/sections/   reusable page sections
  _src/pages/      one file per page: a META json block + {{> section}} includes

Made by Arjun Ahirwar
"""
import json, re, html, os, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_src')
SITE = 'https://techdoodlez.com'
PHONE = '+91-6260993724'
FONTS = ('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800'
         '&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700'
         '&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap')
ORDER = ['home', 'services', 'work', 'playground', 'audit', 'about', 'contact']
NAV_KEYS = ['services', 'work', 'playground', 'audit', 'about', 'contact']


def read(*p):
    with open(os.path.join(SRC, *p), encoding='utf-8') as f:
        return f.read()


def include(body):
    def sub(m):
        return read('sections', m.group(1) + '.html').rstrip('\n')
    return re.sub(r'\{\{>\s*([\w-]+)\s*\}\}', sub, body)


def strip_tags(t):
    return html.unescape(re.sub(r'<[^>]+>', '', t)).strip()


def org_full(desc):
    return {
        "@type": ["Organization", "ProfessionalService"],
        "@id": SITE + "/#organization",
        "name": "Tech Dollez",
        "alternateName": ["TechDollez", "Tech Dollez Bhopal", "Techdollez", "Tech Doodlez", "techdoodlez"],
        "url": SITE + "/",
        "logo": {"@type": "ImageObject", "url": SITE + "/assets/logo-512.png", "width": 512, "height": 512},
        "image": SITE + "/assets/og-image.jpg",
        "description": desc,
        "slogan": "We build the digital world.",
        "telephone": PHONE,
        "priceRange": "₹₹",
        "founder": {"@id": SITE + "/#founder"},
        "address": {"@type": "PostalAddress", "addressLocality": "Bhopal", "addressRegion": "Madhya Pradesh", "addressCountry": "IN"},
        "areaServed": [{"@type": "City", "name": "Bhopal"}, {"@type": "State", "name": "Madhya Pradesh"}, {"@type": "Country", "name": "India"}],
        "contactPoint": [{"@type": "ContactPoint", "telephone": PHONE, "contactType": "sales", "areaServed": "IN", "availableLanguage": ["English", "Hindi"]}],
        "knowsAbout": ["Website Design", "Web Development", "Mobile App Development", "Custom Software Development", "ERP Development", "Website Redesign", "SEO", "UI/UX Design"],
        "hasOfferCatalog": {
            "@type": "OfferCatalog", "name": "Tech Dollez Services",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n, "description": d, "url": SITE + "/services#" + slug,
                                                    "provider": {"@id": SITE + "/#organization"}, "areaServed": "IN"}}
                for n, d, slug in [
                    ("Website Design", "Premium, conversion-focused website design with motion and 3D.", "website-design"),
                    ("Web Development", "Fast, secure and scalable websites and web apps.", "web-development"),
                    ("App Development", "Android and iOS mobile app development.", "app-development"),
                    ("Custom Software & ERP", "ERPs, CRMs, dashboards and automation tools built for your business.", "custom-software"),
                    ("Website Redesign", "Modern, fast, mobile-first redesigns of old websites.", "website-redesign"),
                    ("SEO & Growth", "Technical SEO, performance tuning and analytics.", "seo"),
                ]
            ]
        }
    }


FOUNDER = {
    "@type": "Person", "@id": SITE + "/#founder", "name": "Arjun Ahirwar",
    "jobTitle": "Founder & Full-Stack Developer", "worksFor": {"@id": SITE + "/#organization"},
    "address": {"@type": "PostalAddress", "addressLocality": "Bhopal", "addressRegion": "Madhya Pradesh", "addressCountry": "IN"},
    "knowsAbout": ["React", "Node.js", "TypeScript", "Supabase", "MongoDB", "AWS", "Three.js"]
}
WEBSITE = {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "Tech Dollez",
           "alternateName": "TechDollez", "inLanguage": ["en-IN", "hi-IN"], "publisher": {"@id": SITE + "/#organization"}}


def jsonld(meta, body, canon):
    kind = meta.get('jsonld', 'page')
    page_type = {'about': 'AboutPage', 'contact': 'ContactPage'}.get(kind, 'WebPage')
    webpage = {"@type": page_type, "@id": canon + "#webpage", "url": canon, "name": meta['title'],
               "description": meta['desc'], "isPartOf": {"@id": SITE + "/#website"},
               "about": {"@id": SITE + "/#organization"}, "inLanguage": "en-IN",
               "primaryImageOfPage": {"@type": "ImageObject", "url": SITE + "/assets/og-image.jpg"}}
    graph = [org_full(meta['desc']) if kind == 'home' else
             {"@type": ["Organization", "ProfessionalService"], "@id": SITE + "/#organization", "name": "Tech Dollez",
              "url": SITE + "/", "telephone": PHONE, "logo": SITE + "/assets/logo-512.png",
              "address": {"@type": "PostalAddress", "addressLocality": "Bhopal", "addressRegion": "Madhya Pradesh", "addressCountry": "IN"}},
             WEBSITE, webpage]
    if kind in ('home', 'about'):
        graph.append(FOUNDER)
    if meta.get('crumb'):
        webpage["breadcrumb"] = {"@id": canon + "#breadcrumb"}
        graph.append({"@type": "BreadcrumbList", "@id": canon + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": meta['crumb'], "item": canon}]})
    if kind == 'services':
        faqs = re.findall(r'<summary>(.*?)<span class="faq__icon"></span></summary>\s*<p[^>]*>(.*?)</p>', body, re.S)
        if faqs:
            graph.append({"@type": "FAQPage", "@id": canon + "#faq", "mainEntity": [
                {"@type": "Question", "name": strip_tags(q), "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}}
                for q, a in faqs]})
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)


def build():
    head_t, top_t, bottom_t = read('partials', 'head.html'), read('partials', 'top.html'), read('partials', 'bottom.html')
    overlays = read('partials', 'overlays.html').rstrip('\n')
    pages = []
    for fn in sorted(os.listdir(os.path.join(SRC, 'pages'))):
        if not fn.endswith('.html'):
            continue
        raw = read('pages', fn)
        m = re.match(r'\s*<!--META\s*(\{.*?\})\s*-->\s*', raw, re.S)
        meta = json.loads(m.group(1))
        body = include(raw[m.end():])
        canon = SITE + ('/' if meta['path'] == '/' else meta['path'])
        e = lambda s: html.escape(s, quote=True)
        head = (head_t.replace('{{TITLE}}', e(meta['title'])).replace('{{DESC}}', e(meta['desc']))
                .replace('{{ROBOTS}}', meta.get('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'))
                .replace('{{CANON}}', canon).replace('{{OG_TITLE}}', e(meta.get('og_title', meta['title'])))
                .replace('{{OG_DESC}}', e(meta.get('og_desc', meta['desc']))).replace('{{FONTS}}', FONTS.replace('&', '&amp;'))
                .replace('{{JSONLD}}', jsonld(meta, body, canon)).replace('{{KEY}}', meta['key']))
        top = top_t
        for k in NAV_KEYS:
            top = top.replace('{{A:%s}}' % k, ' class="active" aria-current="page"' if k == meta['key'] else '')
        scripts = '\n'.join('  <script defer src="%s"></script>' % s for s in meta.get('scripts', []))
        bottom = bottom_t.replace('{{OVERLAYS}}', overlays).replace('{{EXTRA_SCRIPTS}}', scripts)
        out = head + top + '\n' + body.rstrip('\n') + '\n' + bottom
        assert '{{' not in out.replace('{{ ', ''), 'unreplaced placeholder in ' + fn
        target = 'index.html' if meta['path'] == '/' else meta['path'].strip('/') + '.html'
        with open(os.path.join(ROOT, target), 'w', encoding='utf-8') as f:
            f.write(out)
        pages.append((meta, canon))
        print('built', target)

    today = datetime.date.today().isoformat()
    pages.sort(key=lambda p: ORDER.index(p[0]['key']) if p[0]['key'] in ORDER else 99)
    urls = []
    for meta, canon in pages:
        pr = '1.0' if meta['key'] == 'home' else '0.8'
        img = ('\n    <image:image>\n      <image:loc>%s/assets/og-image.jpg</image:loc>\n    </image:image>' % SITE) if meta['key'] == 'home' else ''
        urls.append('  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>%s</priority>%s\n  </url>' % (canon, today, pr, img))
    with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
                '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + '\n'.join(urls) + '\n</urlset>\n')
    print('built sitemap.xml (%d urls)' % len(urls))


if __name__ == '__main__':
    build()
