import { Gauge, Search, ShieldCheck, Eye, Sparkles, Smartphone, Bot, LucideIcon } from 'lucide-react';
import { FullAuditReport, Language } from '../types';

export interface MetricPillarDefinition {
  id: 'performance' | 'seo' | 'security' | 'accessibility' | 'bestPractices' | 'aiGeo' | 'mobile';
  name: string;
  nameTe: string;
  shortSubtitle: string;
  shortSubtitleTe: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  scoreKey: 'perfScore' | 'seoScore' | 'secScore' | 'accScore' | 'bestPracticesScore' | 'aiScore' | 'mobileScore';
  whatItMeasures: string[];
  whatItMeasuresTe: string[];
  whyItMatters: string;
  whyItMattersTe: string;
  targetBenchmark: string;
  targetBenchmarkTe: string;
}

export const METRIC_PILLAR_DEFINITIONS: MetricPillarDefinition[] = [
  {
    id: 'performance',
    name: 'Performance',
    nameTe: 'పెర్ఫార్మెన్స్ (వేగం & లోడింగ్)',
    shortSubtitle: 'Core Web Vitals & Server TTFB',
    shortSubtitleTe: 'కోర్ వెబ్ వైటల్స్ & సర్వర్ రెస్పాన్స్ TTFB',
    icon: Gauge,
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
    iconColor: 'text-blue-600',
    accentBorder: 'hover:border-blue-300 hover:shadow-blue-500/10',
    scoreKey: 'perfScore',
    whatItMeasures: [
      'Largest Contentful Paint (LCP) loading time (< 2.5s standard)',
      'Cumulative Layout Shift (CLS) visual stability (< 0.1 target)',
      'First Input Delay (FID) / INP user interaction responsiveness',
      'Time to First Byte (TTFB) server latency and DNS resolution',
      'Minification and asset compression (Brotli/Gzip)',
      'Next-Gen image formatting (WebP/AVIF) and responsive srcsets',
    ],
    whatItMeasuresTe: [
      'లార్జెస్ట్ కంటెంట్‌ఫుల్ పెయింట్ (LCP) లోడింగ్ సమయం (< 2.5s)',
      'క్యుములేటివ్ లేఅవుట్ షిఫ్ట్ (CLS) విజువల్ స్థిరత్వం (< 0.1)',
      'మొదటి ఇన్‌పుట్ ఆలస్యం (FID/INP) ఇంటరాక్షన్ వేగం',
      'సర్వర్ రెస్పాన్స్ సమయం (TTFB) & DNS రిజల్యూషన్',
      'CSS/JS కోడ్ మినిఫికేషన్ & బ్రోట్లీ/జీజిప్ కంప్రెషన్',
      'ఆధునిక ఇమేజ్ ఫార్మాట్లు (WebP/AVIF) & రెస్పాన్సివ్ ఇమేజెస్',
    ],
    whyItMatters: 'Page speed directly influences user bounce rates, conversion sales, and Google Mobile-First organic search ranking criteria.',
    whyItMattersTe: 'పేజీ వేగం బౌన్స్ రేట్లను తగ్గించి, యూజర్ కన్వర్షన్లను పెంచుతుంది మరియు గూగుల్ మొబైల్ ర్యాంకింగ్‌ను మెరుగుపరుస్తుంది.',
    targetBenchmark: 'Target: >90 Score · LCP < 2.5s · TTFB < 200ms',
    targetBenchmarkTe: 'లక్ష్యం: >90 స్కోరు · LCP < 2.5s · TTFB < 200ms',
  },
  {
    id: 'seo',
    name: 'SEO (Search Engine Optimization)',
    nameTe: 'సెర్చ్ ఇంజిన్ ఆప్టిమైజేషన్ (SEO)',
    shortSubtitle: 'Title, Meta Tags, Alt Text & Indexing',
    shortSubtitleTe: 'టైటిల్, మెటా ట్యాగ్‌లు, ఆల్ట్ టెక్స్ట్ & ఇండెక్సింగ్',
    icon: Search,
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    iconColor: 'text-emerald-600',
    accentBorder: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
    scoreKey: 'seoScore',
    whatItMeasures: [
      '<title> tag presence, length (50-60 chars) & keyword relevance',
      'Meta description completeness for click-through rate (CTR)',
      'Proper heading hierarchy (Single H1 tag, structured H2-H6)',
      'Image alt attributes for Google Image Search crawling',
      'Schema.org JSON-LD structured data and Rich Snippets',
      'OpenGraph & Twitter Card social media preview meta tags',
      'Robots.txt & XML sitemap crawl directives for Googlebot',
    ],
    whatItMeasuresTe: [
      '<title> ట్యాగ్ సమగ్రత, సరైన పొడవు (50-60 అక్షరాలు) & ప్రాముఖ్యత',
      'సెర్చ్ క్లిక్-త్రూ రేట్ (CTR) కోసం మెటా డిస్క్రిప్షన్',
      'ఖచ్చితమైన హెడింగ్ నిర్మాణం (ఒకే H1 ట్యాగ్, క్రమబద్ధమైన H2-H6)',
      'గూగుల్ ఇమేజ్ సెర్చ్ కోసం ఇమేజ్ alt ట్యాగ్‌లు',
      'Schema.org JSON-LD స్ట్రక్చర్డ్ డేటా & రిచ్ స్నిప్పెట్స్',
      'సోషల్ మీడియా షేరింగ్ కోసం OpenGraph & Twitter కార్డ్స్',
      'గూగుల్‌బాట్ కోసం Robots.txt & XML సైట్‌మ్యాప్ డైరెక్టివ్‌లు',
    ],
    whyItMatters: 'Governs how search engines crawl, understand, and rank your website pages on Google 1st-page search results.',
    whyItMattersTe: 'గూగుల్ సెర్చ్ ఇంజిన్ మీ పేజీలను ఎలా అర్థం చేసుకుని మొదటి పేజీలో ర్యాంక్ చేస్తుందో ఈ స్కోరు నిర్దేశిస్తుంది.',
    targetBenchmark: 'Target: 95-100 Score · 100% Crawlable & Schema Valid',
    targetBenchmarkTe: 'లక్ష్యం: 95-100 స్కోరు · 100% క్రాలబుల్ & స్కీమా సమగ్రత',
  },
  {
    id: 'aiGeo',
    name: 'AI SEO & GEO (Generative Optimization)',
    nameTe: 'AI SEO & GEO (జెనరేటివ్ సెర్చ్ ఆప్టిమైజేషన్)',
    shortSubtitle: 'ChatGPT, Gemini, Perplexity & llms.txt',
    shortSubtitleTe: 'ChatGPT, Gemini, Perplexity & llms.txt సామర్థ్యం',
    icon: Bot,
    iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
    iconColor: 'text-cyan-600',
    accentBorder: 'hover:border-cyan-300 hover:shadow-cyan-500/10',
    scoreKey: 'aiScore',
    whatItMeasures: [
      'ChatGPT & Perplexity citation probability and entity clarity',
      'Google AI Overviews (Gemini) direct answer extraction readiness',
      'Presence & structure of llms.txt crawler guidance file',
      'Schema.org JSON-LD structured knowledge graph nodes',
      'Concise Q&A section formatting and AI-readable context',
      'Topical authority and brand knowledge graph density',
    ],
    whatItMeasuresTe: [
      'ChatGPT మరియు Perplexityలలో వెబ్‌సైట్ సూచనల సంసిద్ధత',
      'గూగుల్ AI ఓవర్‌వ్యూస్ (Gemini) డైరెక్ట్ ఆన్సర్ ఎక్స్‌ట్రాక్షన్',
      'llms.txt AI క్రాలర్ గైడెన్స్ ఫైల్ సమగ్రత',
      'Schema.org JSON-LD నాలెడ్జ్ గ్రాఫ్ ఆర్కిటెక్చర్',
      'AI-రీడబుల్ Q&A మరియు నేచురల్ లాంగ్వేజ్ కంటెంట్',
      'టాపిక్ అథారిటీ మరియు బ్రాండ్ ఐడెంటిటీ స్పష్టత',
    ],
    whyItMatters: 'With AI search engines answering 40%+ of global queries directly, GEO readiness ensures your website is cited as the primary authority.',
    whyItMattersTe: 'ప్రపంచ సెర్చ్‌లలో 40%+ AI మోడల్స్ సమాధానాలు ఇస్తుండటంతో, AI సమాధానాలలో మీ బ్రాండ్ ప్రధాన ఆధారంగా ఉండటానికి ఇది చాలా అవసరం.',
    targetBenchmark: 'Target: 90+ Score · llms.txt Active · Entity Schema Verified',
    targetBenchmarkTe: 'లక్ష్యం: 90+ స్కోరు · llms.txt యాక్టివ్ · ఎంటిటీ స్కీమా వెరిఫైడ్',
  },
  {
    id: 'mobile',
    name: 'Mobile Audit & Responsive UX',
    nameTe: 'మొబైల్ ఆడిట్ & రెస్పాన్సివ్ UX',
    shortSubtitle: 'Touch Targets, Viewport & Mobile Speed',
    shortSubtitleTe: 'టచ్ టార్గెట్స్, వ్యూపోర్ట్ & మొబైల్ స్పీడ్',
    icon: Smartphone,
    iconBg: 'bg-rose-50 text-rose-600 border border-rose-200',
    iconColor: 'text-rose-600',
    accentBorder: 'hover:border-rose-300 hover:shadow-rose-500/10',
    scoreKey: 'mobileScore',
    whatItMeasures: [
      'Mobile viewport configuration (width=device-width)',
      'Touch target sizes (≥48x48px with 8px separation)',
      'Legible mobile typography (minimum 16px body font)',
      'Zero horizontal layout overflow or wide table clipping',
      'Mobile First Contentful Paint & cellular data efficiency',
      'PWA readiness and mobile web app manifest indicators',
    ],
    whatItMeasuresTe: [
      'మొబైల్ రెస్పాన్సివ్ వ్యూపోర్ట్ సమగ్రత',
      'టచ్ టార్గెట్ సైజులు (కనీసం 48x48px ట్యాప్ ఏరియా)',
      'స్పష్టమైన మొబైల్ ఫాంట్ సైజు (కనీసం 16px)',
      'హారిజాంటల్ స్క్రోలింగ్ సమస్యలు లేకపోవడం',
      'మొబైల్ డేటా సామర్థ్యం & FCP లోడింగ్ వేగం',
      'PWA మరియు మొబైల్ బ్రౌజర్ ఆప్టిమైజేషన్',
    ],
    whyItMatters: 'Over 68% of global internet traffic originates from smartphones; Google indexes websites exclusively using Mobile-First crawlers.',
    whyItMattersTe: '68% కంటే ఎక్కువ ట్రాఫిక్ మొబైల్ నుండే వస్తుంది; గూగుల్ మొబైల్-ఫస్ట్ ఆధారంగానే సైట్లను ర్యాంక్ చేస్తుంది.',
    targetBenchmark: 'Target: 95+ Score · 0 Horizontal Scroll · 48px Touch',
    targetBenchmarkTe: 'లక్ష్యం: 95+ స్కోరు · 0 హారిజాంటల్ స్క్రోల్ · 48px టచ్',
  },
  {
    id: 'security',
    name: 'Security & Encryption',
    nameTe: 'సెక్యూరిటీ & SSL ఎన్‌క్రిప్షన్',
    shortSubtitle: 'SSL Grade, TLS 1.3 & Security Headers',
    shortSubtitleTe: 'SSL గ్రేడ్, TLS 1.3 & రక్షణ హెడర్లు',
    icon: ShieldCheck,
    iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    iconColor: 'text-indigo-600',
    accentBorder: 'hover:border-indigo-300 hover:shadow-indigo-500/10',
    scoreKey: 'secScore',
    whatItMeasures: [
      'SSL/TLS certificate validity and 256-bit TLS 1.3 modern ciphers',
      'Strict-Transport-Security (HSTS) header enforcement',
      'X-Frame-Options (Clickjacking & UI-redress defense)',
      'Content-Security-Policy (CSP) cross-site scripting mitigation',
      'X-Content-Type-Options: nosniff MIME-type protection',
      'Referrer-Policy and Permissions-Policy browser controls',
    ],
    whatItMeasuresTe: [
      'SSL/TLS సర్టిఫికేట్ చెల్లుబాటు & 256-బిట్ TLS 1.3 ఎన్‌క్రిప్షన్',
      'HSTS (Strict-Transport-Security) రక్షణ హెడర్ ఎన్‌ఫోర్స్‌మెంట్',
      'క్లిక్‌జాకింగ్ దాడులను అడ్డుకునేందుకు X-Frame-Options',
      'XSS దాడులను నివారించేందుకు Content-Security-Policy (CSP)',
      'X-Content-Type-Options: nosniff MIME రక్షణ',
      'రెఫరర్ పాలసీ & బ్రౌజర్ అనుమతుల భద్రతా నియంత్రణ',
    ],
    whyItMatters: 'Protects user sessions, prevents packet sniffing and data tampering, and secures HTTPS trust indicators in modern web browsers.',
    whyItMattersTe: 'యూజర్ డేటా దొంగతనం, మాల్‌వేర్ ఇంజెక్షన్ల నుండి వెబ్‌సైట్‌ను రక్షించి బ్రౌజర్లలో భద్రతా నమ్మకాన్ని కలిగిస్తుంది.',
    targetBenchmark: 'Target: Grade A+ SSL · Full HTTP Security Headers',
    targetBenchmarkTe: 'లక్ష్యం: గ్రేడ్ A+ SSL · పూర్తి సెక్యూరిటీ హెడర్స్',
  },
  {
    id: 'accessibility',
    name: 'Accessibility (a11y)',
    nameTe: 'యాక్సెసిబిలిటీ (సౌలభ్యం)',
    shortSubtitle: 'WCAG 2.1 Contrast & ARIA Labels',
    shortSubtitleTe: 'WCAG 2.1 కాంట్రాస్ట్ & ARIA లేబుల్స్',
    icon: Eye,
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
    iconColor: 'text-purple-600',
    accentBorder: 'hover:border-purple-300 hover:shadow-purple-500/10',
    scoreKey: 'accScore',
    whatItMeasures: [
      'Color contrast ratio (Minimum 4.5:1 for standard body text)',
      'ARIA labels & accessible names for all interactive buttons and links',
      'Full keyboard navigability & high-visibility focus outlines',
      'Form inputs with explicit <label> associations',
      'Logical HTML landmark tags (<main>, <nav>, <header>, <footer>)',
      'Mobile touch target sizes (Minimum 44x44px tap area)',
    ],
    whatItMeasuresTe: [
      'రంగుల కాంట్రాస్ట్ నిష్పత్తి (కనీసం 4.5:1 టెక్స్ట్ కాంట్రాస్ట్)',
      'బటన్‌లు మరియు లింక్‌లకు స్పష్టమైన ARIA లేబుల్స్',
      'పూర్తి కీబోర్డ్ నావిగేషన్ & ఫోకస్ అవుట్‌లైన్ మద్దతు',
      'ఫారమ్ ఇన్‌పుట్‌లకు అనుసంధానించబడిన <label> ట్యాగ్‌లు',
      'స్క్రీన్ రీడర్ల కోసం ఖచ్చితమైన ల్యాండ్‌మార్క్ ట్యాగ్‌లు',
      'టచ్ టార్గెట్ సైజు (మొబైల్‌లో కనీసం 44x44px)',
    ],
    whyItMatters: 'Guarantees an inclusive digital experience for visually impaired users and screen readers while adhering to legal ADA compliance standards.',
    whyItMattersTe: 'దృష్టి లోపం ఉన్నవారు స్క్రీన్ రీడర్ల ద్వారా వెబ్‌సైట్‌ను సులభంగా ఉపయోగించుకునేలా చేసి ADA నిబంధనలను నెరవేరుస్తుంది.',
    targetBenchmark: 'Target: 100/100 · Zero WCAG AA Contrast Violations',
    targetBenchmarkTe: 'లక్ష్యం: 100/100 · సున్నా WCAG AA కాంట్రాస్ట్ లోపాలు',
  },
  {
    id: 'bestPractices',
    name: 'Best Practices & Code Quality',
    nameTe: 'ఉత్తమ ప్రమాణాలు & కోడ్ నాణ్యత',
    shortSubtitle: 'Zero Console Errors & Modern Standards',
    shortSubtitleTe: 'సున్నా కన్సోల్ ఎర్రర్లు & ఆధునిక ప్రమాణాలు',
    icon: Sparkles,
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
    iconColor: 'text-amber-600',
    accentBorder: 'hover:border-amber-300 hover:shadow-amber-500/10',
    scoreKey: 'bestPracticesScore',
    whatItMeasures: [
      'Zero runtime JavaScript exceptions and console error logs',
      'Secure asset delivery over HTTPS without mixed-content warnings',
      'External outbound links configured with rel="noopener noreferrer"',
      'Valid HTML5 doctype and UTF-8 charset declaration',
      'Avoiding deprecated APIs and legacy plugins (e.g. Flash)',
      'Clean DOM tree size and memory leak prevention',
    ],
    whatItMeasuresTe: [
      'బ్రౌజర్ కన్సోల్‌లో ఎటువంటి జావాస్క్రిప్ట్ ఎర్రర్లు లేకపోవడం',
      'మిక్స్డ్ కంటెంట్ లేకుండా సురక్షితమైన HTTPS అసెట్స్ లోడింగ్',
      'బయటి లింక్‌లకు rel="noopener noreferrer" సెక్యూరిటీ',
      'సరైన HTML5 doctype మరియు UTF-8 క్యారెక్టర్ ఎన్‌కోడింగ్',
      'పాతబడిపోయిన APIలు మరియు లెగసీ ప్లగిన్లు నివారించడం',
      'ఆప్టిమైజ్డ్ DOM నిర్మాణం మరియు మెమరీ ఎఫిషియెన్సీ',
    ],
    whyItMatters: 'Ensures rock-solid cross-browser stability, modern browser compatibility, and prevents front-end crashes.',
    whyItMattersTe: 'అన్ని రకాల బ్రౌజర్లలో వెబ్‌సైట్ ఎలాంటి లోపాలు లేకుండా నిరంతరాయంగా పనిచేస్తుందని నిర్ధారిస్తుంది.',
    targetBenchmark: 'Target: 100/100 · 0 Console Errors · Modern HTML5',
    targetBenchmarkTe: 'లక్ష్యం: 100/100 · 0 కన్సోల్ ఎర్రర్లు · ఆధునిక HTML5',
  },
];

export function getScoreStatusLabel(score: number, lang: Language): { label: string; color: string; bg: string; border: string } {
  if (score >= 90) {
    return {
      label: lang === 'te' ? 'అద్భుతం (Optimal)' : 'Optimal',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
    };
  }
  if (score >= 70) {
    return {
      label: lang === 'te' ? 'మెరుగుపరచాలి (Needs Work)' : 'Needs Improvement',
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
    };
  }
  return {
    label: lang === 'te' ? 'ప్రమాదకరం (Critical)' : 'Critical Issues',
    color: 'text-rose-400',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/30',
  };
}
