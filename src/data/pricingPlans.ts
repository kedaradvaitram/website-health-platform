import { PricingPlan, PricingPlanId } from '../types';

export interface RazorpayFeeBreakdown {
  planPrice: number;
  razorpayFeePercentage: number; // 2.0%
  gstPercentageOnFee: number; // 18%
  effectiveFeePercentage: number; // 2.36%
  razorpayFeeAmount: number;
  netRevenue: number;
  internationalFeePercentage: number; // 3.54%
  internationalFeeAmount: number;
  internationalNetRevenue: number;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Scan',
    nameTe: 'ఉచిత స్కాన్ (Free Scan)',
    price: 0,
    maxIssues: 0,
    tag: 'Diagnostic Only',
    tagTe: 'ఉచిత విశ్లేషణ',
    description: 'Basic website health report & diagnostics across SEO, SSL, and speed',
    descriptionTe: 'ఎస్‌ఈఓ, ఎస్‌ఎస్‌ఎల్ మరియు వేగంతో ప్రాథమిక వెబ్‌సైట్ హెల్త్ రిపోర్ట్',
    targetAudience: 'Testing & Initial URL Health Assessment',
    targetAudienceTe: 'పరీక్షించడానికి & ప్రారంభ ఆరోగ్య అంచనా కోసం',
    features: [
      'Full SEO & Meta Tag Score',
      'Performance & TTFB latency check',
      'SSL Certificate & TLS 1.3 verification',
      'Accessibility basic scan',
      'Broken links & Heading hierarchy check',
      'Security headers diagnostic (CSP, HSTS)',
      'Core Web Vitals overview',
      'No automatic fix included',
    ],
    featuresTe: [
      'పూర్తి ఎస్‌ఈఓ & మెటా ట్యాగ్ స్కోర్',
      'పెర్ఫార్మెన్స్ & లేటెన్సీ చెక్',
      'SSL సర్టిఫికేట్ & TLS 1.3 తనిఖీ',
      'యాక్సెసిబిలిటీ ప్రాథమిక స్కాన్',
      'బ్రోకెన్ లింక్స్ & హెడింగ్స్ చెక్',
      'సెక్యూరిటీ హెడర్స్ విశ్లేషణ (CSP, HSTS)',
      'కోర్ వెబ్ వైటల్స్ వివరాలు',
      'ఆటోమేటిక్ ఫిక్స్ ఉండదు',
    ],
    ctaText: 'Fix My Website',
    ctaTextTe: 'నా సైట్‌ను సరిచేయండి',
  },
  {
    id: 'quick',
    name: 'Quick Fix',
    nameTe: 'క్విక్ ఫిక్స్ (Quick Fix)',
    price: 299,
    billingPeriod: 'one-time',
    maxIssues: 5,
    tag: 'Small Sites',
    tagTe: 'చిన్న వెబ్‌సైట్‌లకు',
    description: 'Fix up to 5 critical issues quickly on small websites or landing pages',
    descriptionTe: 'చిన్న వెబ్‌సైట్లు లేదా ల్యాండింగ్ పేజీలలో గరిష్టంగా 5 ప్రధాన సమస్యలను సరిచేయండి',
    targetAudience: 'Portfolios, Landing Pages & Micro Sites',
    targetAudienceTe: 'పోర్ట్‌ఫోలియోలు, ల్యాండింగ్ పేజీలు & మైక్రో సైట్స్',
    features: [
      'Fix up to 5 critical issues',
      'Missing <title> & meta descriptions injection',
      'Google AdSense ads.txt & robots.txt generator',
      'Missing image alt tags optimization',
      'Broken H1/H2 heading hierarchy repair',
      'Basic security headers setup (X-Frame-Options, X-Content-Type)',
      'Automated GitHub PR or Fixed ZIP Package',
      'Verification re-scan after repair',
    ],
    featuresTe: [
      'గరిష్టంగా 5 ప్రధాన లోపాల పరిష్కారం',
      'మిస్ అయిన <title> & మెటా డిస్క్రిప్షన్ల చేర్పు',
      'గూగుల్ యాడ్‌సెన్స్ ads.txt & robots.txt కోడ్',
      'ఇమేజ్ alt ట్యాగ్‌ల ఆప్టిమైజేషన్',
      'బ్రోకెన్ H1/H2 హెడింగ్ స్ట్రక్చర్ సరిచేయడం',
      'ప్రాథమిక సెక్యూరిటీ హెడర్స్ కాన్ఫిగరేషన్',
      'ఆటోమేటెడ్ గిట్‌హబ్ PR లేదా ZIP ప్యాకేజ్',
      'ఫిక్స్ తర్వాత వెరిఫికేషన్ రీ-స్కాన్',
    ],
    ctaText: 'Fix 5 Issues — ₹299',
    ctaTextTe: '5 సమస్యలను పరిష్కరించండి — ₹299',
  },
  {
    id: 'pro',
    name: 'Pro Fix',
    nameTe: 'ప్రో ఫిక్స్ (Pro Fix ⭐)',
    price: 799,
    billingPeriod: 'one-time',
    maxIssues: 20,
    popular: true,
    tag: 'Recommended ⭐',
    tagTe: 'అత్యంత ప్రాచుర్యం పొందినది ⭐',
    description: 'Comprehensive repair covering up to 20 issues across SEO, Speed, and Security + Full AdSense Approval Kit',
    descriptionTe: 'ఎస్‌ఈఓ, స్పీడ్ మరియు సెక్యూరిటీలలో 20 సమస్యల పరిష్కారం + గూగుల్ యాడ్‌సెన్స్ 100% అప్రూవల్ కిట్',
    targetAudience: 'Business Websites, Blogs, & E-commerce',
    targetAudienceTe: 'బిజినెస్ వెబ్‌సైట్లు, బ్లాగులు & ఈ-కామర్స్',
    features: [
      'Fix up to 20 detected issues',
      '🤖 AI SEO & GEO Search Readiness (ChatGPT & Perplexity /llms.txt generator)',
      '📱 100% Mobile & Responsive Audit (Touch Targets, Viewport, CLS)',
      '🕸️ Multi-Page Deep Website Crawler (Up to 10 Pages & Broken Links)',
      '🚀 Google AdSense 100% Approval Code Kit (ads.txt + 5 Legal Pages)',
      '🌟 Complete Schema.org JSON-LD Rich Snippets & OpenGraph',
      'Anti-CLS Responsive Ad Containers & GDPR Cookie Consent',
      'Heading structures & canonical tag injection',
      'Image optimization & responsive srcsets',
      'Broken links & anchor tag remediation',
      'Advanced SSL/HSTS & Nginx CSP security headers',
      'ARIA accessibility attributes & contrast fixes',
      'Performance & Web Vitals payload reductions',
      'XML Sitemap & robots.txt generator',
      'Direct GitHub PR with code diffs or instant ZIP',
      'Before/After verified scorecard certificate',
    ],
    featuresTe: [
      'గరిష్టంగా 20 లోపాల వరకు పూర్తి పరిష్కారం',
      '🤖 AI SEO & GEO సంసిద్ధత (ChatGPT, Perplexity & /llms.txt జనరేటర్)',
      '📱 100% మొబైల్ ఆడిట్ & రెస్పాన్సివ్ కంప్లయన్స్',
      '🕸️ 10 పేజీల డీప్ వెబ్‌సైట్ క్రాలర్ & బ్రోకెన్ లింక్స్ ట్రీ',
      '🚀 గూగుల్ యాడ్‌సెన్స్ 100% అప్రూవల్ కోడ్ కిట్ (ads.txt + 5 లీగల్ పేజీలు)',
      '🌟 పూర్తి Schema.org JSON-LD రిచ్ స్నిప్పెట్స్ & ఓపెన్‌గ్రాఫ్',
      'Anti-CLS రెస్పాన్సివ్ యాడ్ బాక్స్‌లు & GDPR కుకీ కన్సెంట్',
      'హెడింగ్స్ & కానానికల్ ట్యాగ్స్ ఇంజెక్షన్',
      'ఇమేజ్ ఆప్టిమైజేషన్ & రెస్పాన్సివ్ ట్యాగ్స్',
      'బ్రోకెన్ లింక్స్ సరిచేయడం',
      'అధునాతన SSL/HSTS & CSP సెక్యూరిటీ హెడర్స్',
      'ARIA యాక్సెసిబిలిటీ & కాంట్రాస్ట్ రిపేర్స్',
      'పెర్ఫార్మెన్స్ & కోర్ వెబ్ వైటల్స్ బూస్ట్',
      'XML సైట్‌మ్యాప్ & robots.txt జనరేషన్',
      'గిట్‌హబ్ PR లేదా తక్షణ ZIP డౌన్‌లోడ్',
      'బిఫోర్/ఆఫ్టర్ స్కోర్ సర్టిఫికేట్',
    ],
    ctaText: 'Fix My Website — ₹799',
    ctaTextTe: 'నా సైట్‌ను సరిచేయండి — ₹799',
  },
  {
    id: 'complete',
    name: 'Complete Fix',
    nameTe: 'కంప్లీట్ ఫిక్స్ (Complete Fix)',
    price: 1499,
    billingPeriod: 'one-time',
    maxIssues: 'all',
    tag: 'Fix Everything',
    tagTe: 'అన్నీ సరిచేయండి',
    description: '“I don\'t want to understand the problems. Just fix everything + 100% AdSense & SEO Ready.”',
    descriptionTe: '“సమస్యలను అర్థం చేసుకోవాల్సిన అవసరం లేదు. వాటన్నింటినీ పూర్తిగా సరిచేసి 100% యాడ్‌సెన్స్ & ఎస్‌ఈఓ రెడీ చేయండి.”',
    targetAudience: 'Founders & Busy Website Owners',
    targetAudienceTe: 'ఫౌండర్లు & సమయం లేని వెబ్‌సైట్ యజమానులు',
    features: [
      'Fix ALL supported detected issues on the website',
      '🚀 Complete Google AdSense 100% Approval Kit (13+ Files Pack)',
      '🌟 100% Google 1st Page SEO & Schema.org Rich Snippets JSON-LD',
      'Comprehensive before & after verification audit (e.g., 72 → 95+)',
      'Automated code patches, full codebase PR, and ZIP',
      'Complete Core Web Vitals, CSS, and JS minification scripts',
      'High-grade Security Shield (A+ SSL, CSP, Permissions-Policy)',
      'Detailed downloadable PDF remediation report',
      'Priority live verification re-scan & guarantee',
    ],
    featuresTe: [
      'వెబ్‌సైట్‌లోని గుర్తించబడిన అన్ని సమస్యల పరిష్కారం',
      '🚀 పూర్తి గూగుల్ యాడ్‌సెన్స్ 100% అప్రూవల్ కిట్ (13+ ఫైళ్ల ప్యాక్)',
      '🌟 100% గూగుల్ 1st పేజీ ఎస్‌ఈఓ & Schema.org రిచ్ స్నిప్పెట్స్ JSON-LD',
      'బిఫోర్ & ఆఫ్టర్ ధృవీకరణ స్కోరు (ఉదా: 72 → 95+)',
      'పూర్తి కోడ్‌బేస్ గిట్‌హబ్ PR మరియు ZIP ప్యాచ్',
      'కోర్ వెబ్ వైటల్స్, CSS మరియు JS మినిఫికేషన్ స్క్రిప్ట్స్',
      'A+ గ్రేడ్ సెక్యూరిటీ షీల్డ్ & హెడర్స్',
      'వివరణాత్మక PDF రిపేర్ నివేదిక డౌన్‌లోడ్',
      'ప్రాధాన్యత లైవ్ రీ-స్కాన్ & గ్యారెంటీ',
    ],
    ctaText: 'Fix Everything — ₹1,499',
    ctaTextTe: 'అన్నీ సరిచేయండి — ₹1,499',
  },
  {
    id: 'business',
    name: 'Business',
    nameTe: 'బిజినెస్ ప్లాన్ (Business)',
    price: 3999,
    billingPeriod: 'month',
    maxIssues: 50,
    tag: 'Monthly Subscription',
    tagTe: 'నెలవారీ సబ్‌స్క్రిప్షన్',
    description: 'Continuous monitoring, weekly health checks, and ongoing automated fixes for agencies and growing businesses',
    descriptionTe: 'ఏజెన్సీలు మరియు వ్యాపారాల కోసం నిరంతర పర్యవేక్షణ, వారపు చెక్స్ మరియు నెలవారీ ఆటోమేటెడ్ రిపేర్లు',
    targetAudience: 'Agencies, SaaS, & High-Traffic Portals',
    targetAudienceTe: 'ఏజెన్సీలు, SaaS & పెద్ద వెబ్‌సైట్లు',
    features: [
      'Unlimited website scans anytime',
      '⏰ 24/7 Automated Health Monitoring & Downtime Alerts',
      '🕸️ Full Multi-Page Deep Crawling (Unlimited Pages)',
      '🤖 Continuous AI SEO & GEO Search Optimization',
      'Automatic issue detection & instant email notifications',
      'Security, DNS & SSL expiration monitoring',
      'SEO & Core Web Vitals regression tracking',
      'Monthly executive performance & compliance report',
      'Fix up to 50 issues per month included with code PRs',
      'Priority ticket queue & 24/7 dedicated engineer support',
    ],
    featuresTe: [
      'అపరిమిత వెబ్‌సైట్ స్కాన్లు',
      '⏰ 24/7 స్వయంచాలక హెల్త్ మానిటరింగ్ & అలర్ట్స్',
      '🕸️ అపరిమిత పేజీల డీప్ వెబ్‌సైట్ క్రాలింగ్',
      '🤖 నిరంతర AI SEO & GEO సెర్చ్ ఆప్టిమైజేషన్',
      'ఆటోమేటిక్ లోపాల గుర్తింపు & తక్షణ ఈమెయిల్ నోటిఫికేషన్లు',
      'సెక్యూరిటీ, DNS & SSL గడువు పర్యవేక్షణ',
      'ఎస్‌ఈఓ & కోర్ వెబ్ వైటల్స్ ట్రాకింగ్',
      'నెలవారీ ఎగ్జిక్యూటివ్ రిపోర్ట్',
      'నెలకు 50 సమస్యల వరకు ఉచిత కోడ్ ఫిక్స్',
      'ప్రాధాన్యత సపోర్ట్ & 24/7 ఇంజనీర్ సేవలు',
    ],
    ctaText: 'Start Business Plan — ₹3,999/mo',
    ctaTextTe: 'బిజినెస్ ప్లాన్ ప్రారంభించండి — ₹3,999/నెల',
  },
];

/**
 * Razorpay Domestic Fee Math:
 * Standard Domestic: 2.0% + 18% GST on the fee = 2.36% effective
 * International Cards: 3.0% + 18% GST = 3.54% effective
 */
export function calculateRazorpayFee(amount: number): RazorpayFeeBreakdown {
  const domesticEffectiveRate = 0.0236;
  const internationalEffectiveRate = 0.0354;

  const domesticFee = Math.round(amount * domesticEffectiveRate * 100) / 100;
  const domesticNet = Math.round((amount - domesticFee) * 100) / 100;

  const intlFee = Math.round(amount * internationalEffectiveRate * 100) / 100;
  const intlNet = Math.round((amount - intlFee) * 100) / 100;

  return {
    planPrice: amount,
    razorpayFeePercentage: 2.0,
    gstPercentageOnFee: 18.0,
    effectiveFeePercentage: 2.36,
    razorpayFeeAmount: domesticFee,
    netRevenue: domesticNet,
    internationalFeePercentage: 3.54,
    internationalFeeAmount: intlFee,
    internationalNetRevenue: intlNet,
  };
}

export const RAZORPAY_FEES_SUMMARY = [
  { price: 299, plan: 'Quick Fix', fee: 7.06, net: 291.94 },
  { price: 799, plan: 'Pro Fix ⭐', fee: 18.86, net: 780.14 },
  { price: 1499, plan: 'Complete Fix', fee: 35.38, net: 1463.62 },
  { price: 3999, plan: 'Business / mo', fee: 94.38, net: 3904.62 },
];
