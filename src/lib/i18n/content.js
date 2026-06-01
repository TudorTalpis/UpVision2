// Locale-aware structured content. English structure/numbers live in data.js;
// RO/RU below are text overlays merged by index. // TODO: native review.
import { useMemo } from 'react'
import { useLocale } from './index.jsx'
import { SERVICES, ADDONS, ADDONS_NOTE, PROCESS, PROJECTS, PRICING, STATS, FAQ } from '../data.js'

/* English page-local lists (kept here so all three locales share one shape). */
const EN_EXTRA = {
  journey: [
    ['Wireframe', 'A rough structure — boxes and intent.'],
    ['Design', 'Structure becomes a polished, branded interface.'],
    ['Code', 'The design turns into clean, modern code.'],
    ['Edit', 'We refine, line by line, until it’s right.'],
    ['Compile', 'It builds — accessibility, SEO and speed checked.'],
    ['Launch', 'The finished website goes live.'],
    ['Visitors', 'Real people arrive and start engaging.'],
    ['Growth', 'Leads and revenue climb, month after month.'],
  ],
  pipe: [
    ['Investment', 'You commit capital to a system, not an expense.'],
    ['Digital presence', 'A fast, credible, findable home for the business.'],
    ['Leads', 'Qualified traffic converts into real enquiries.'],
    ['Customers', 'A trustworthy experience closes the sale.'],
    ['Revenue', 'A compounding asset that pays back, then keeps paying.'],
  ],
  values: [
    ['Outcomes over output', 'We’re hired to move a number, not to deliver a folder of files. Every decision ladders up to a business result.'],
    ['One team, no handoffs', 'Design and engineering sit together. Nothing gets lost in translation between agencies.'],
    ['Senior, hands-on', 'The people you meet are the people who do the work. No juniors hiding behind account managers.'],
    ['Build to last', 'Clean systems and code your team can own and maintain — never a black box you can’t escape.'],
  ],
  marquee: ['Custom websites', 'Landing pages', 'Business sites', 'Web apps', 'E-commerce', 'React', 'Performance', 'SEO', 'Responsive', 'Accessible'],
}

const RO = {
  services: [
    { title: 'Site-uri personalizate', short: 'Site-uri create să convertească — niciodată un șablon.', body: 'Proiectare și dezvoltare de site-uri rapide, accesibile și optimizate pentru căutare, construite în jurul acțiunilor care îți cresc afacerea. Stack React modern, conținutul tău, brandul tău.', deliverables: ['Design personalizat', 'Construire în React', 'CMS și conținut', 'Core Web Vitals', 'Integrare analytics'], outcome: 'Un site care își merită investiția — încărcare mai rapidă, conversie mai mare, cost-pe-lead mai mic.' },
    { title: 'Landing page-uri', short: 'Pagini cu un singur scop care transformă campaniile în clienți.', body: 'Landing page-uri cu rată mare de conversie pentru lansări, reclame și campanii — construite rapid, măsurabile și optimizate în jurul unei singure acțiuni clare.', deliverables: ['Layout axat pe conversie', 'Structură de copy', 'Formulare și tracking', 'Pregătit pentru A/B', 'Încărcare rapidă'], outcome: 'Mai mulți clienți calificați din traficul pentru care deja plătești.' },
    { title: 'Site-uri de prezentare', short: 'Site-uri rapide și credibile care inspiră încredere și aduc cereri.', body: 'Site-uri profesionale pentru afaceri consacrate — structură clară, primă impresie puternică și semnalele de încredere care transformă vizitatorii în cereri.', deliverables: ['Structură și UX', 'Design responsiv', 'Fundație SEO', 'CMS', 'Captare de lead-uri'], outcome: 'O prezență care îi face pe clienți să te aleagă cu încredere.' },
    { title: 'Aplicații web', short: 'Aplicații web și instrumente interne pe un stack modern.', body: 'De la portaluri de clienți la dashboard-uri și instrumente interne — aplicații web personalizate, rapide, fiabile și ușor de întreținut de echipa ta.', deliverables: ['UX de produs', 'Aplicație React', 'Autentificare și date', 'Integrări', 'Cod ușor de întreținut'], outcome: 'Software care elimină frecarea și scalează odată cu afacerea.' },
    { title: 'Magazine online', short: 'Magazine online create să vândă și să scaleze.', body: 'Magazine online rapide, axate pe conversie — experiențe de produs curate, checkout fiabil și performanța care îi ține pe cumpărători activi.', deliverables: ['UX de magazin', 'Catalog și checkout', 'Plăți', 'Performanță', 'Analytics'], outcome: 'Mai mult venit per vizitator și un magazin care crește cu tine.' },
  ],
  addons: [
    { title: 'Boți Telegram', d: 'Boți pentru clienți sau interni, conectați la site-ul și instrumentele tale.' },
    { title: 'Automatizare', d: 'Automatizăm munca repetitivă din jurul site-ului, acolo unde merită.' },
    { title: 'Integrări personalizate', d: 'Conectăm site-ul la CRM-uri, plăți și instrumentele pe care le folosești deja.' },
    { title: 'Automatizarea fluxurilor', d: 'Sisteme discrete care elimină munca de rutină după lansare.' },
  ],
  addonsNote: 'Construiești deja site-ul cu noi? Putem adăuga automatizări și integrări acolo unde merită — opțional, la cerere.',
  process: [
    { title: 'Descoperire', d: 'Clarificăm obiectivul, publicul și acțiunile care îți aduc bani — și definim site-ul în jurul lor.', out: 'Strategie și scop' },
    { title: 'Design', d: 'Structură, apoi design de înaltă fidelitate al fiecărei pagini și stări — revizuit înainte de orice linie de cod.', out: 'Site proiectat' },
    { title: 'Construire', d: 'Inginerie pe un stack React modern — rapid, accesibil, responsiv, măsurat din prima zi.', out: 'Site de producție' },
    { title: 'Lansare', d: 'QA, SEO, analytics și un plan de go-live. De pe staging în lume, cu plasă de siguranță.', out: 'Site live' },
    { title: 'Creștere', d: 'Corecturi post-lansare, optimizare și raportare — automatizare opțională unde merită.', out: 'Rezultate care se acumulează' },
  ],
  projects: [
    { cat: 'B2B SaaS · Rebranding și site', result: '+38% conversie la trial', metricA: ['+38%', 'conversie trial'], metricB: ['−41%', 'cost per lead'], metricC: ['2.4×', 'programări demo'], summary: 'O platformă B2B obosită, repoziționată, reproiectată și reconstruită într-un site de produs credibil.', tags: ['Aplicație web', 'Site B2B', 'CRO'] },
    { cat: 'Marketplace · 0→1', result: '48k utilizatori în 90 de zile', metricA: ['48k', 'utilizatori / 90 zile'], metricB: ['$127k', 'MRR în luna 6'], metricC: ['4.8★', 'rating în store'], summary: 'Un marketplace cu două fețe dus de la idee la aplicație lansată, brand și motor de creștere.', tags: ['Aplicație web', 'Lansare', 'Performanță'] },
    { cat: 'Healthtech · Platformă', result: 'MVP livrat în 6 săptămâni', metricA: ['6 săpt', 'idee la MVP'], metricB: ['HIPAA', 'build conform'], metricC: ['9 → 1', 'instrumente consolidate'], summary: 'O clinică fragmentată, digitalizată într-o singură platformă de pacienți cu intake automatizat.', tags: ['Aplicație web', 'Integrări', 'Automatizare'] },
    { cat: 'D2C · E-commerce', result: '2.1× venit online', metricA: ['2.1×', 'venit online'], metricB: ['+64%', 'cumpărători recurenți'], metricC: ['1.2s', 'încărcare mediană'], summary: 'O prăjitorie de specialitate rebranduită și re-platformată într-un magazin rapid și frumos.', tags: ['E-commerce', 'Performanță', 'SEO'] },
  ],
  pricing: [
    { tag: 'O pagină, creată să convertească', horizon: '1–2 săptămâni', points: ['O pagină cu conversie mare', 'Design personalizat', 'Construire mobile-first', 'SEO de bază', 'Analytics și lansare'], returns: 'Transformă traficul din campanii și reclame în clienți calificați.' },
    { tag: 'O prezență credibilă care inspiră încredere', horizon: '3–5 săptămâni', points: ['Până la 8 pagini proiectate', 'Construire React + CMS', 'Fundație SEO', 'Captare de lead-uri', 'Lansare și analytics'], returns: 'Un site profesional care transformă vizitatorii în cereri.' },
    { tag: 'Software personalizat sau e-commerce', horizon: '6–10 săptămâni', points: ['UX și design de produs', 'Aplicație web sau magazin personalizat', 'Integrări și plăți', 'Buget de performanță', 'Suport post-lansare'], returns: 'Un sistem care elimină frecarea și scalează venitul.' },
  ],
  stats: ['Produse lansate', 'Industrii deservite', 'Creștere medie a conversiei', 'Retenția clienților'],
  faq: [
    ['Chiar este un site o investiție, nu o cheltuială?', 'O cheltuială dispare; o investiție aduce randament. Definim fiecare proiect în jurul unui rezultat măsurabil — mai mulți clienți calificați, conversie mai mare, cost de achiziție mai mic — și îl măsurăm ca să vezi randamentul.'],
    ['Cât de repede îmi puteți construi site-ul?', 'Un landing page se livrează în 1–2 săptămâni, un site de prezentare în 3–5 săptămâni, iar o aplicație web sau un magazin în 6–10 săptămâni. Eșalonăm livrarea ca ceva valoros să apară devreme.'],
    ['Construiți doar site-uri?', 'Site-urile și aplicațiile web sunt activitatea noastră principală. Putem adăuga și boți Telegram, integrări și automatizare la cerere — dar doar acolo unde aduc clar valoare site-ului tău.'],
    ['Lucrați cu afaceri din Moldova?', 'Da — suntem un studio de dezvoltare web din Chișinău, Moldova, care lucrează cu afaceri locale și clienți din străinătate.'],
    ['Cine deține rezultatul muncii?', 'Tu — codul, fișierele de design, conturile. Fără blocaje. Construim site-uri pe care echipa ta chiar le poate întreține.'],
  ],
  journey: [
    ['Schiță (wireframe)', 'O structură brută — chenare și intenție.'],
    ['Design', 'Structura devine o interfață rafinată, cu brand.'],
    ['Cod', 'Designul se transformă în cod curat și modern.'],
    ['Editare', 'Rafinăm, linie cu linie, până iese bine.'],
    ['Compilare', 'Se construiește — accesibilitate, SEO și viteză verificate.'],
    ['Lansare', 'Site-ul finalizat intră live.'],
    ['Vizitatori', 'Oameni reali sosesc și încep să interacționeze.'],
    ['Creștere', 'Clienții și venitul cresc, lună după lună.'],
  ],
  pipe: [
    ['Investiție', 'Investești capital într-un sistem, nu într-o cheltuială.'],
    ['Prezență digitală', 'O casă rapidă, credibilă și ușor de găsit pentru afacere.'],
    ['Lead-uri', 'Traficul calificat se transformă în cereri reale.'],
    ['Clienți', 'O experiență de încredere închide vânzarea.'],
    ['Venit', 'Un activ care se acumulează, se amortizează și continuă să aducă.'],
  ],
  values: [
    ['Rezultate, nu livrabile', 'Suntem angajați să mișcăm o cifră, nu să livrăm un dosar de fișiere. Fiecare decizie duce către un rezultat de business.'],
    ['O echipă, fără predări', 'Designul și ingineria stau împreună. Nimic nu se pierde în traducere între agenții.'],
    ['Seniori, implicați', 'Oamenii pe care îi cunoști sunt cei care fac munca. Fără juniori ascunși după account manageri.'],
    ['Construit să dureze', 'Sisteme și cod curate pe care echipa ta le poate deține și întreține — niciodată o cutie neagră din care nu poți ieși.'],
  ],
  marquee: ['Site-uri personalizate', 'Landing page-uri', 'Site-uri de prezentare', 'Aplicații web', 'E-commerce', 'React', 'Performanță', 'SEO', 'Responsiv', 'Accesibil'],
}

const RU = {
  services: [
    { title: 'Индивидуальные сайты', short: 'Сайты, созданные для конверсии — никаких шаблонов.', body: 'Проектирование и разработка быстрых, доступных и удобных для поиска сайтов, построенных вокруг действий, которые растят ваш бизнес. Современный стек React, ваш контент, ваш бренд.', deliverables: ['Индивидуальный дизайн', 'Сборка на React', 'CMS и контент', 'Core Web Vitals', 'Подключение аналитики'], outcome: 'Сайт, который окупается — быстрее загрузка, выше конверсия, ниже цена лида.' },
    { title: 'Лендинги', short: 'Одностраничники, превращающие кампании в заявки.', body: 'Высококонверсионные лендинги для запусков, рекламы и кампаний — собраны быстро, измеримы и заточены под одно ясное действие.', deliverables: ['Макет под конверсию', 'Структура текста', 'Формы и трекинг', 'Готов к A/B', 'Быстрая загрузка'], outcome: 'Больше целевых заявок из трафика, за который вы уже платите.' },
    { title: 'Корпоративные сайты', short: 'Быстрые, убедительные сайты, вызывающие доверие и заявки.', body: 'Профессиональные сайты для устоявшегося бизнеса — ясная структура, сильное первое впечатление и сигналы доверия, превращающие посетителей в заявки.', deliverables: ['Структура и UX', 'Адаптивный дизайн', 'SEO-основа', 'CMS', 'Сбор заявок'], outcome: 'Присутствие, благодаря которому клиенты уверенно выбирают вас.' },
    { title: 'Веб-приложения', short: 'Индивидуальные веб-приложения и внутренние инструменты на современном стеке.', body: 'От клиентских порталов до дашбордов и внутренних инструментов — индивидуальные веб-приложения: быстрые, надёжные и удобные в поддержке вашей командой.', deliverables: ['UX продукта', 'Приложение на React', 'Авторизация и данные', 'Интеграции', 'Поддерживаемый код'], outcome: 'Программное обеспечение, убирающее трение и растущее вместе с бизнесом.' },
    { title: 'Интернет-магазины', short: 'Магазины, созданные продавать и масштабироваться.', body: 'Быстрые интернет-магазины с фокусом на конверсию — чистый опыт работы с товаром, надёжная оплата и производительность, удерживающая покупателей.', deliverables: ['UX магазина', 'Каталог и оформление', 'Платежи', 'Производительность', 'Аналитика'], outcome: 'Больше выручки с посетителя и магазин, который растёт с вами.' },
  ],
  addons: [
    { title: 'Telegram-боты', d: 'Клиентские или внутренние боты, связанные с вашим сайтом и инструментами.' },
    { title: 'Автоматизация', d: 'Автоматизируем рутинную работу вокруг сайта там, где это окупается.' },
    { title: 'Интеграции', d: 'Подключаем сайт к CRM, платежам и инструментам, которыми вы уже пользуетесь.' },
    { title: 'Автоматизация процессов', d: 'Незаметные системы, убирающие рутину после запуска.' },
  ],
  addonsNote: 'Уже строите сайт с нами? Можем подключить автоматизацию и интеграции там, где это окупается — опционально, по запросу.',
  process: [
    { title: 'Анализ', d: 'Проясняем цель, аудиторию и действия, которые приносят деньги — и проектируем сайт вокруг них.', out: 'Стратегия и объём' },
    { title: 'Дизайн', d: 'Сначала структура, затем детальный дизайн каждой страницы и состояния — до единой строки кода.', out: 'Спроектированный сайт' },
    { title: 'Разработка', d: 'Инженерия на современном стеке React — быстро, доступно, адаптивно, с метриками с первого дня.', out: 'Боевой сайт' },
    { title: 'Запуск', d: 'QA, SEO, аналитика и план go-live. Со стейджинга в мир, со страховкой.', out: 'Живой сайт' },
    { title: 'Рост', d: 'Доработки после запуска, оптимизация и отчётность — автоматизация по необходимости.', out: 'Накопительный результат' },
  ],
  projects: [
    { cat: 'B2B SaaS · Ребрендинг и сайт', result: '+38% конверсии в триал', metricA: ['+38%', 'конверсия в триал'], metricB: ['−41%', 'цена лида'], metricC: ['2.4×', 'запросы демо'], summary: 'Уставшая B2B-платформа, перепозиционированная, переработанная и пересобранная в убедительный продуктовый сайт.', tags: ['Веб-приложение', 'B2B-сайт', 'CRO'] },
    { cat: 'Маркетплейс · 0→1', result: '48k пользователей за 90 дней', metricA: ['48k', 'польз. / 90 дней'], metricB: ['$127k', 'MRR на 6-й месяц'], metricC: ['4.8★', 'рейтинг в сторе'], summary: 'Двусторонний маркетплейс, доведённый от идеи до запущенного приложения, бренда и движка роста.', tags: ['Веб-приложение', 'Запуск', 'Производительность'] },
    { cat: 'Healthtech · Платформа', result: 'MVP за 6 недель', metricA: ['6 нед', 'идея до MVP'], metricB: ['HIPAA', 'соответствие'], metricC: ['9 → 1', 'инструментов объединено'], summary: 'Разрозненная работа клиники, оцифрованная в единую платформу пациентов с автоматическим приёмом.', tags: ['Веб-приложение', 'Интеграции', 'Автоматизация'] },
    { cat: 'D2C · E-commerce', result: '2.1× онлайн-выручки', metricA: ['2.1×', 'онлайн-выручка'], metricB: ['+64%', 'повторные покупатели'], metricC: ['1.2s', 'медианная загрузка'], summary: 'Спешелти-обжарщик с ребрендингом и переездом на быстрый, красивый магазин.', tags: ['E-commerce', 'Производительность', 'SEO'] },
  ],
  pricing: [
    { tag: 'Одна страница, созданная для конверсии', horizon: '1–2 недели', points: ['Одна высококонверсионная страница', 'Индивидуальный дизайн', 'Сборка mobile-first', 'Базовое SEO', 'Аналитика и запуск'], returns: 'Превращает трафик из кампаний и рекламы в целевые заявки.' },
    { tag: 'Убедительное присутствие, вызывающее доверие', horizon: '3–5 недель', points: ['До 8 спроектированных страниц', 'Сборка React + CMS', 'SEO-основа', 'Сбор заявок', 'Запуск и аналитика'], returns: 'Профессиональный сайт, превращающий посетителей в заявки.' },
    { tag: 'Индивидуальное ПО или e-commerce', horizon: '6–10 недель', points: ['UX и дизайн продукта', 'Веб-приложение или магазин', 'Интеграции и платежи', 'Бюджет производительности', 'Поддержка после запуска'], returns: 'Система, убирающая трение и масштабирующая выручку.' },
  ],
  stats: ['Запущено продуктов', 'Отраслей охвачено', 'Средний рост конверсии', 'Удержание клиентов'],
  faq: [
    ['Сайт действительно инвестиция, а не расход?', 'Расход исчезает; инвестиция приносит отдачу. Мы строим каждый проект вокруг измеримого результата — больше целевых заявок, выше конверсия, ниже стоимость привлечения — и измеряем его, чтобы вы видели отдачу.'],
    ['Как быстро вы построите мой сайт?', 'Лендинг — за 1–2 недели, корпоративный сайт — за 3–5 недель, веб-приложение или магазин — за 6–10 недель. Мы выстраиваем поставку так, чтобы ценность появлялась рано.'],
    ['Вы делаете только сайты?', 'Сайты и веб-приложения — наша основная работа. Также можем добавить Telegram-ботов, интеграции и автоматизацию по запросу — но только там, где это явно окупается для вашего сайта.'],
    ['Вы работаете с бизнесом в Молдове?', 'Да — мы студия веб-разработки из Кишинёва, Молдова, работаем с местным бизнесом и клиентами за рубежом.'],
    ['Кому принадлежит результат?', 'Вам — код, файлы дизайна, аккаунты. Без привязки. Мы строим сайты, которые ваша команда действительно может поддерживать.'],
  ],
  journey: [
    ['Каркас (wireframe)', 'Грубая структура — блоки и замысел.'],
    ['Дизайн', 'Структура становится отточенным фирменным интерфейсом.'],
    ['Код', 'Дизайн превращается в чистый современный код.'],
    ['Правки', 'Шлифуем, строка за строкой, пока не станет идеально.'],
    ['Сборка', 'Собирается — доступность, SEO и скорость проверены.'],
    ['Запуск', 'Готовый сайт выходит в свет.'],
    ['Посетители', 'Приходят реальные люди и начинают взаимодействовать.'],
    ['Рост', 'Заявки и выручка растут, месяц за месяцем.'],
  ],
  pipe: [
    ['Инвестиция', 'Вы вкладываете капитал в систему, а не в расход.'],
    ['Цифровое присутствие', 'Быстрый, убедительный и находимый дом для бизнеса.'],
    ['Заявки', 'Целевой трафик превращается в реальные обращения.'],
    ['Клиенты', 'Опыт, вызывающий доверие, закрывает продажу.'],
    ['Выручка', 'Накопительный актив, который окупается и продолжает приносить.'],
  ],
  values: [
    ['Результат важнее объёма', 'Нас нанимают, чтобы сдвинуть цифру, а не сдать папку с файлами. Каждое решение ведёт к бизнес-результату.'],
    ['Одна команда, без передач', 'Дизайн и инженерия работают вместе. Ничего не теряется при передаче между агентствами.'],
    ['Сеньоры, руки в деле', 'Люди, с которыми вы общаетесь, и есть исполнители. Никаких джунов за спинами аккаунт-менеджеров.'],
    ['Сделано надолго', 'Чистые системы и код, которыми ваша команда владеет и которые поддерживает — никогда не «чёрный ящик».'],
  ],
  marquee: ['Индивидуальные сайты', 'Лендинги', 'Корпоративные сайты', 'Веб-приложения', 'E-commerce', 'React', 'Производительность', 'SEO', 'Адаптивность', 'Доступность'],
}

const OVER = { ro: RO, ru: RU }

function localize(locale) {
  const o = OVER[locale]
  if (!o) return { SERVICES, ADDONS, ADDONS_NOTE, PROCESS, PROJECTS, PRICING, STATS, FAQ, ...EN_EXTRA }
  return {
    SERVICES: SERVICES.map((s, i) => ({ ...s, ...o.services[i] })),
    ADDONS: ADDONS.map((a, i) => ({ ...a, ...o.addons[i] })),
    ADDONS_NOTE: o.addonsNote,
    PROCESS: PROCESS.map((p, i) => ({ ...p, ...o.process[i] })),
    PROJECTS: PROJECTS.map((p, i) => ({ ...p, ...o.projects[i] })),
    PRICING: PRICING.map((p, i) => ({ ...p, ...o.pricing[i] })),
    STATS: STATS.map((s, i) => ({ ...s, label: o.stats[i] })),
    FAQ: o.faq,
    journey: o.journey,
    pipe: o.pipe,
    values: o.values,
    marquee: o.marquee,
  }
}

export function useContent() {
  const { locale } = useLocale()
  return useMemo(() => localize(locale), [locale])
}
