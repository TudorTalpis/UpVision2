/* ============================================================
   Single source of truth for site content.
   ============================================================ */

export const STAGES = [
  { id: 'idea',     n: '01', label: 'Idea',        line: 'A problem worth solving.' },
  { id: 'research', n: '02', label: 'Research',     line: 'Proof it can make money.' },
  { id: 'brand',    n: '03', label: 'Brand',        line: 'A name people trust.' },
  { id: 'design',   n: '04', label: 'Design',       line: 'An experience that converts.' },
  { id: 'build',    n: '05', label: 'Development',  line: 'Fast, reliable software.' },
  { id: 'launch',   n: '06', label: 'Launch',       line: 'Live, measured, ready.' },
  { id: 'growth',   n: '07', label: 'Growth',       line: 'Traffic and qualified leads.' },
  { id: 'revenue',  n: '08', label: 'Revenue',      line: 'A system that compounds.' },
]

export const SERVICES = [
  {
    slug: 'custom-websites', n: '01', title: 'Custom Websites',
    short: 'Bespoke sites engineered to convert — never a template.',
    body: 'Design and development of fast, accessible, search-friendly websites built around the actions that grow your business. Modern React stack, your content, your brand.',
    deliverables: ['Tailored design', 'React build', 'CMS & content', 'Core Web Vitals', 'Analytics wiring'],
    outcome: 'A site that earns its keep — faster load, higher conversion, lower cost-per-lead.',
  },
  {
    slug: 'landing-pages', n: '02', title: 'Landing Pages',
    short: 'Single-purpose pages that turn campaigns into leads.',
    body: 'High-converting landing pages for launches, ads and campaigns — built fast, instrumented for measurement, and tuned around one clear action.',
    deliverables: ['Conversion-first layout', 'Copy structure', 'Forms & tracking', 'A/B-ready', 'Fast load'],
    outcome: 'More qualified leads from the traffic you already pay for.',
  },
  {
    slug: 'business-websites', n: '03', title: 'Business Websites',
    short: 'Credible, fast sites that win trust and inquiries.',
    body: 'Professional websites for established businesses — clear structure, strong first impression, and the trust signals that turn visitors into inquiries.',
    deliverables: ['Sitemap & UX', 'Responsive design', 'SEO foundations', 'CMS', 'Lead capture'],
    outcome: 'A presence that makes customers choose you with confidence.',
  },
  {
    slug: 'web-applications', n: '04', title: 'Web Applications',
    short: 'Custom web apps and internal tools on a modern stack.',
    body: 'From customer portals to dashboards and internal tools — custom web applications built to be fast, reliable and maintainable by your team.',
    deliverables: ['Product UX', 'React app', 'Auth & data', 'Integrations', 'Maintainable code'],
    outcome: 'Software that removes friction and scales with the business.',
  },
  {
    slug: 'ecommerce', n: '05', title: 'E-commerce',
    short: 'Online stores built to sell and scale.',
    body: 'Fast, conversion-focused online stores — clean product experiences, reliable checkout, and the performance that keeps shoppers buying.',
    deliverables: ['Store UX', 'Catalog & checkout', 'Payments', 'Performance', 'Analytics'],
    outcome: 'More revenue per visitor and a store that grows with you.',
  },
]

/* Secondary — mentioned lightly, never as a primary offer. */
export const ADDONS = [
  { title: 'Telegram bots',      d: 'Customer or internal bots wired into your site and tools.' },
  { title: 'Business automation', d: 'Automate the repetitive work around your website where it pays off.' },
  { title: 'Custom integrations', d: 'Connect your site to CRMs, payments and the tools you already use.' },
  { title: 'Workflow automation',  d: 'Quiet systems that remove busywork once the site is live.' },
]
export const ADDONS_NOTE = 'Already building your site with us? We can wire in automation and integrations where they pay off — optional, on request.'

export const PROCESS = [
  { n: '01', title: 'Discover', d: 'We clarify your goal, audience and the actions that make you money — and scope the site around them.', out: 'Strategy & scope' },
  { n: '02', title: 'Design',   d: 'Structure, then high-fidelity design of every page and state — reviewed before a line of code.', out: 'Designed site' },
  { n: '03', title: 'Build',    d: 'Engineering on a modern React stack — fast, accessible, responsive, instrumented from day one.', out: 'Production site' },
  { n: '04', title: 'Launch',   d: 'QA, SEO, analytics and a go-live plan. Staging to the world, with a safety net.', out: 'Live website' },
  { n: '05', title: 'Grow',     d: 'Post-launch fixes, optimisation and reporting — optional automation where it pays off.', out: 'Compounding results' },
]

// NOTE: project results and stats below are ILLUSTRATIVE placeholders.
export const PROJECTS = [
  {
    slug: 'northwind',
    name: 'Northwind',
    cat: 'B2B SaaS · Rebrand & site',
    year: '2025',
    result: '+38% trial conversion',
    metricA: ['+38%', 'trial conversion'],
    metricB: ['−41%', 'cost per lead'],
    metricC: ['2.4×', 'demo bookings'],
    summary: 'A tired B2B platform repositioned, redesigned and rebuilt into a category-credible product site.',
    accent: '#3b6cf2',
    tags: ['Web app', 'B2B site', 'CRO'],
  },
  {
    slug: 'homemade',
    name: 'Homemade',
    cat: 'Marketplace · 0→1',
    year: '2025',
    result: '48k users in 90 days',
    metricA: ['48k', 'users / 90 days'],
    metricB: ['$127k', 'MRR at month 6'],
    metricC: ['4.8★', 'app store rating'],
    summary: 'A two-sided marketplace taken from napkin to launched app, brand, and growth engine.',
    accent: '#c0552f',
    tags: ['Web app', 'Launch', 'Performance'],
  },
  {
    slug: 'atlas-health',
    name: 'Atlas Health',
    cat: 'Healthtech · Platform',
    year: '2024',
    result: 'MVP shipped in 6 weeks',
    metricA: ['6 wks', 'idea to MVP'],
    metricB: ['HIPAA', 'compliant build'],
    metricC: ['9 → 1', 'tools consolidated'],
    summary: 'A fragmented clinic operation digitalised into one patient platform with automated intake.',
    accent: '#1f8a5b',
    tags: ['Web app', 'Integrations', 'Automation'],
  },
  {
    slug: 'faro-coffee',
    name: 'Faro Coffee',
    cat: 'D2C · E-commerce',
    year: '2024',
    result: '2.1× online revenue',
    metricA: ['2.1×', 'online revenue'],
    metricB: ['+64%', 'returning buyers'],
    metricC: ['1.2s', 'median load'],
    summary: 'A specialty roaster rebranded and re-platformed into a fast, beautiful storefront.',
    accent: '#8a5a1f',
    tags: ['E-commerce', 'Performance', 'SEO'],
  },
]

// NOTE: prices and ranges are ILLUSTRATIVE placeholders — replace before launch.
export const PRICING = [
  {
    name: 'Landing Page', tag: 'One page, built to convert', invest: '1.5k', range: '$1.5k–$3k', horizon: '1–2 weeks',
    points: ['Single high-converting page', 'Custom design', 'Mobile-first build', 'SEO basics', 'Analytics & launch'],
    returns: 'Turns campaign and ad traffic into qualified leads.', featured: false,
  },
  {
    name: 'Business Website', tag: 'A credible presence that wins trust', invest: '4k', range: '$4k–$9k', horizon: '3–5 weeks',
    points: ['Up to 8 designed pages', 'React build + CMS', 'SEO foundations', 'Lead capture', 'Launch & analytics'],
    returns: 'A professional site that turns visitors into inquiries.', featured: true,
  },
  {
    name: 'Web App / Store', tag: 'Custom software or e-commerce', invest: '12k', range: '$12k+', horizon: '6–10 weeks',
    points: ['Product UX & design', 'Custom web app or store', 'Integrations & payments', 'Performance budget', 'Post-launch support'],
    returns: 'A system that removes friction and scales revenue.', featured: false,
  },
]

export const STATS = [
  { v: 60, suffix: '+', label: 'Products launched' },
  { v: 14, suffix: '', label: 'Industries served' },
  { v: 3.2, suffix: '×', label: 'Avg. conversion lift', dec: 1 },
  { v: 97, suffix: '%', label: 'Client retention' },
]

export const FAQ = [
  ['Is a website really an investment, not a cost?', 'A cost disappears; an investment returns. We scope every build around a measurable outcome — more qualified leads, higher conversion, lower acquisition cost — and instrument it so you can see the return.'],
  ['How fast can you build my website?', 'A landing page ships in 1–2 weeks, a business website in 3–5 weeks, and a web app or store in 6–10 weeks. We sequence delivery so something valuable ships early.'],
  ['Do you only build websites?', 'Websites and web apps are our core work. We can also add Telegram bots, integrations and automation on request — but only where they clearly pay off for your site.'],
  ['Do you work with businesses in Moldova?', 'Yes — we are a custom web development studio based in Chișinău, Moldova, working with local businesses and clients abroad.'],
  ['Who owns the work?', 'You do — code, design files, accounts. No lock-in. We build sites your team can actually maintain.'],
]
