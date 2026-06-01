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
    slug: 'web-design-development',
    n: '01',
    title: 'Website Design & Development',
    short: 'High-performance sites engineered to convert.',
    body: 'Fast, accessible, SEO-ready websites and web apps built on a modern React stack — designed around the actions that grow your business.',
    deliverables: ['Design system', 'React / headless build', 'CMS & content', 'Core Web Vitals', 'Analytics wiring'],
    outcome: 'A site that earns its keep — faster load, higher conversion, lower cost-per-lead.',
  },
  {
    slug: 'branding',
    n: '02',
    title: 'Branding',
    short: 'Identities the market remembers.',
    body: 'Positioning, naming, visual identity and voice. We make you instantly recognisable and impossible to confuse with the competition.',
    deliverables: ['Positioning', 'Naming', 'Logo & system', 'Guidelines', 'Brand assets'],
    outcome: 'Premium perception that lets you charge more and close faster.',
  },
  {
    slug: 'ui-ux-design',
    n: '03',
    title: 'UI/UX Design',
    short: 'Interfaces designed for revenue, not applause.',
    body: 'Research-led product and interface design. Every screen, state and flow is shaped around clarity, trust and the next click.',
    deliverables: ['UX research', 'Wireframes', 'UI design', 'Prototypes', 'Design system'],
    outcome: 'Lower friction, higher completion, measurable lift in conversion.',
  },
  {
    slug: 'automation',
    n: '04',
    title: 'Automation',
    short: 'Quiet systems that remove busywork.',
    body: 'We connect your tools and automate the repetitive work — lead routing, onboarding, billing, reporting — so your team scales without headcount.',
    deliverables: ['Workflow mapping', 'Integrations', 'CRM automation', 'AI assistants', 'Dashboards'],
    outcome: 'Hours back every week and fewer things falling through the cracks.',
  },
  {
    slug: 'business-digitalization',
    n: '05',
    title: 'Business Digitalization',
    short: 'Turn an offline operation into a digital one.',
    body: 'We move your operation online end-to-end — bookings, payments, customer portals, internal tools — into one coherent digital backbone.',
    deliverables: ['Audit', 'Tooling strategy', 'Portals & dashboards', 'Payments', 'Training'],
    outcome: 'A business that runs online, with data you can actually act on.',
  },
  {
    slug: 'marketing-assets',
    n: '06',
    title: 'Marketing Assets',
    short: 'The creative that fuels the funnel.',
    body: 'Landing pages, ad creative, social systems, decks and motion — produced as a system so your message stays sharp across every channel.',
    deliverables: ['Landing pages', 'Ad creative', 'Social kit', 'Pitch decks', 'Motion'],
    outcome: 'A consistent, conversion-ready presence wherever customers find you.',
  },
  {
    slug: 'product-strategy',
    n: '07',
    title: 'Product Strategy',
    short: 'The plan that makes the spend pay off.',
    body: 'Before a pixel: market research, business model, roadmap and a measurement plan — so every investment maps to a result.',
    deliverables: ['Market research', 'Business model', 'Roadmap', 'KPIs', 'GTM plan'],
    outcome: 'Clarity and a sequenced plan that de-risks the whole investment.',
  },
]

export const PROCESS = [
  { n: '01', title: 'Discover', d: 'We pressure-test the idea against the market, the money and the maths. You leave with a clear thesis.', out: 'Strategy & scope' },
  { n: '02', title: 'Define',   d: 'Positioning, brand direction and the architecture of the experience. The blueprint everyone aligns on.', out: 'Brand & blueprint' },
  { n: '03', title: 'Design',   d: 'High-fidelity design of every screen and state, prototyped and tested before a line of code.', out: 'Designed product' },
  { n: '04', title: 'Build',    d: 'Engineering on a modern stack — fast, accessible, maintainable, instrumented from day one.', out: 'Production software' },
  { n: '05', title: 'Launch',   d: 'QA, SEO, analytics and a go-live plan. Staging to the world, with a safety net.', out: 'Live product' },
  { n: '06', title: 'Grow',     d: 'Post-launch experiments, optimisation and reporting. We tune the system toward revenue.', out: 'Compounding growth' },
]

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
    tags: ['Brand', 'UI/UX', 'Web', 'CRO'],
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
    tags: ['Strategy', 'Brand', 'App', 'Launch'],
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
    tags: ['Product', 'Web', 'Automation'],
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
    tags: ['Brand', 'E-commerce', 'Growth'],
  },
]

export const PRICING = [
  {
    name: 'Launch',
    tag: 'For getting a credible presence live fast',
    invest: '7k',
    range: '$7k–$12k',
    horizon: '3–4 weeks',
    points: ['Brand essentials', 'Up to 6 designed pages', 'React build + CMS', 'SEO foundations', 'Analytics & launch'],
    returns: 'A professional presence that turns existing demand into leads.',
    featured: false,
  },
  {
    name: 'Growth',
    tag: 'For businesses ready to compound results',
    invest: '18k',
    range: '$18k–$35k',
    horizon: '6–10 weeks',
    points: ['Full brand system', 'Product/UX design', 'Custom web app or store', 'Automation & integrations', 'CRO + 3 months of growth'],
    returns: 'A growth system: more qualified traffic, higher conversion, lower CAC.',
    featured: true,
  },
  {
    name: 'Partner',
    tag: 'An embedded team for ambitious roadmaps',
    invest: 'Custom',
    range: 'Monthly retainer',
    horizon: 'Ongoing',
    points: ['Dedicated squad', 'Continuous design & build', 'Automation at scale', 'Experimentation program', 'Quarterly strategy'],
    returns: 'A long-term engine — shipping, measuring and growing every single month.',
    featured: false,
  },
]

export const STATS = [
  { v: 60, suffix: '+', label: 'Products launched' },
  { v: 14, suffix: '', label: 'Industries served' },
  { v: 3.2, suffix: '×', label: 'Avg. conversion lift', dec: 1 },
  { v: 97, suffix: '%', label: 'Client retention' },
]

export const FAQ = [
  ['Is a website really an investment, not a cost?', 'A cost disappears. An investment returns. We design every engagement around a measurable outcome — more qualified leads, higher conversion, lower acquisition cost — and instrument it so you can see the return.'],
  ['How fast can we launch?', 'A focused Launch engagement goes live in 3–4 weeks. Larger growth systems run 6–10 weeks. We sequence delivery so something valuable ships early and often.'],
  ['Do you only build websites?', 'No — the website is one component. We build the surrounding system: brand, product design, automation, and the growth program that turns visitors into revenue.'],
  ['What happens after launch?', 'That’s where the compounding starts. We run experiments, optimise conversion and report on what’s working — turning a launched product into a growing business.'],
  ['Who owns the work?', 'You do — code, design files, brand assets, accounts. No lock-in. We build things your team can actually maintain.'],
]
