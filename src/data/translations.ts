import { Language } from '../types';
import { enTranslations, TranslationDict } from './locales/en';
import { teTranslations } from './locales/te';
import { hiTranslations } from './locales/hi';
import { esTranslations } from './locales/es';
import { frTranslations } from './locales/fr';
import { deTranslations } from './locales/de';
import { jaTranslations } from './locales/ja';
import { zhTranslations } from './locales/zh';
import { arTranslations } from './locales/ar';
import { ptTranslations } from './locales/pt';
import { ruTranslations } from './locales/ru';

export interface SupportedLanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global / US / UK' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'India (AP / TS)' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain & Latin America' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France & Francophonie' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany / DACH' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', region: 'China & Asia-Pacific' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East & MENA' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Brazil & Portugal' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Eastern Europe' },
];

export const baseEnTranslations = enTranslations;
export type TranslationKey = keyof TranslationDict;

export const translations: Record<Language, TranslationDict> = {
  en: enTranslations,
  te: teTranslations,
  hi: hiTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  ja: jaTranslations,
  zh: zhTranslations,
  ar: arTranslations,
  pt: ptTranslations,
  ru: ruTranslations,
};

export const getTranslation = (lang: Language): TranslationDict => {
  return translations[lang] || translations.en;
};

export const getSupportedLangInfo = (code: Language): SupportedLanguageInfo => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
};

export const getAuditModuleLocalized = (
  moduleId: string,
  lang: Language
): { name: string; badge: string; placeholder: string; desc: string; btnLabel: string } => {
  const t = getTranslation(lang);
  switch (moduleId) {
    case 'seo':
      return {
        name: t.seo || 'Website SEO',
        badge: 'SEO',
        placeholder: lang === 'te' ? 'ఉదా: https://mywebsite.com (SEO ఆడిట్)' : 'e.g. https://mywebsite.com (SEO Audit)',
        desc: lang === 'te' ? 'సెర్చ్ ఇంజిన్ ఆప్టిమైజేషన్ & మెటా ట్యాగ్స్' : 'Search Engine Optimization & Meta tags',
        btnLabel: lang === 'te' ? 'SEO ఆడిట్ ప్రారంభించు' : 'Audit SEO',
      };
    case 'performance':
      return {
        name: t.performance || 'Speed & Performance',
        badge: 'SPEED',
        placeholder: lang === 'te' ? 'ఉదా: https://mywebsite.com (స్పీడ్ టెస్ట్)' : 'e.g. https://mywebsite.com (Speed Test)',
        desc: lang === 'te' ? 'పేజీ లోడింగ్ వేగం, అసెట్ బరువు మరియు TTFB' : 'Page load time, asset weights and TTFB',
        btnLabel: lang === 'te' ? 'స్పీడ్ టెస్ట్ ప్రారంభించు' : 'Test Speed',
      };
    case 'vitals':
      return {
        name: lang === 'te' ? 'కోర్ వెబ్ వైటల్స్' : 'Core Web Vitals',
        badge: 'VITALS',
        placeholder: lang === 'te' ? 'ఉదా: https://mywebsite.com (LCP/INP/CLS)' : 'e.g. https://mywebsite.com (LCP/INP/CLS)',
        desc: lang === 'te' ? 'LCP, INP, CLS & రియల్ యూజర్ టెలిమెట్రీ' : 'LCP, INP, CLS & Real User Telemetry',
        btnLabel: lang === 'te' ? 'వైటల్స్ చెక్ చేయండి' : 'Check Vitals',
      };
    case 'security':
      return {
        name: t.security || 'Security & SSL',
        badge: 'SECURITY',
        placeholder: lang === 'te' ? 'ఉదా: https://mywebsite.com (సెక్యూరిటీ స్కాన్)' : 'e.g. https://mywebsite.com (Security Scan)',
        desc: lang === 'te' ? 'SSL, TLS 1.3, CSP, HSTS మరియు సెక్యూరిటీ హెడర్స్' : 'SSL, TLS 1.3, CSP, HSTS and Headers',
        btnLabel: lang === 'te' ? 'సెక్యూరిటీ స్కాన్ రన్ చేయండి' : 'Scan Security',
      };
    case 'ssl':
      return {
        name: lang === 'te' ? 'SSL / TLS సర్టిఫికెట్' : 'SSL / TLS Grade',
        badge: 'SSL',
        placeholder: lang === 'te' ? 'ఉదా: https://mywebsite.com (SSL తనిఖీ)' : 'e.g. https://mywebsite.com (SSL Check)',
        desc: lang === 'te' ? 'సర్టిఫికెట్ గడువు, సైఫర్ మరియు భద్రత' : 'Certificate validity, cipher suites & expiration',
        btnLabel: lang === 'te' ? 'SSL చెక్ చేయండి' : 'Verify SSL',
      };
    case 'accessibility':
      return {
        name: t.accessibility || 'Accessibility (WCAG)',
        badge: 'WCAG',
        placeholder: lang === 'te' ? 'ఉదా: https://mywebsite.com (యాక్సెసిబిలిటీ)' : 'e.g. https://mywebsite.com (Accessibility)',
        desc: lang === 'te' ? 'WCAG 2.1 కాంప్లియెన్స్, కాంట్రాస్ట్, ARIA ట్యాగ్స్' : 'WCAG 2.1 compliance, contrast, ARIA tags',
        btnLabel: lang === 'te' ? 'యాక్సెసిబిలిటీ ఆడిట్' : 'Audit A11y',
      };
    case 'ai':
      return {
        name: lang === 'te' ? 'జెనరేటివ్ AI SEO (GEO)' : 'Generative AI SEO (GEO)',
        badge: 'AI GEO',
        placeholder: lang === 'te' ? 'ఉదా: https://mywebsite.com (AI ఆడిట్)' : 'e.g. https://mywebsite.com (AI Audit)',
        desc: lang === 'te' ? 'ChatGPT, Gemini, Perplexity సైటేషన్ సంసిద్ధత' : 'ChatGPT, Gemini, Perplexity AI Citation Readiness',
        btnLabel: lang === 'te' ? 'AI SEO చెక్ చేయండి' : 'Check AI GEO',
      };
    default:
      return {
        name: lang === 'te' ? 'పూర్తి 360° ఆడిట్' : 'Full 360° Audit',
        badge: '360°',
        placeholder: t.scanPlaceholder || 'e.g. https://mywebsite.com',
        desc: t.appTagline || 'Complete 360 degree health, SEO and security audit',
        btnLabel: t.scanButton || (lang === 'te' ? 'ఉచిత ఆడిట్ ప్రారంభించండి' : 'Run Free Audit'),
      };
  }
};

export const getAuditPhaseLocalized = (
  phaseId: string,
  lang: Language
): { title: string; desc: string } => {
  switch (phaseId) {
    case 'dns':
      return {
        title: lang === 'te' ? '1. నెట్‌వర్క్ & DNS కనెక్షన్' : '1. Network & DNS Connection',
        desc: lang === 'te' ? 'సర్వర్ కనెక్టివిటీ మరియు DNS హెల్త్ పరిశీలన' : 'Resolving IP, DNS records & network latency',
      };
    case 'ssl':
      return {
        title: lang === 'te' ? '2. SSL & TLS 1.3 సర్టిఫికెట్' : '2. SSL & TLS 1.3 Certificate',
        desc: lang === 'te' ? 'ఎన్‌క్రిప్షన్, సైఫర్ మరియు సెక్యూరిటీ హెడర్స్' : 'Verifying cryptographic certificate & security headers',
      };
    case 'seo':
      return {
        title: lang === 'te' ? '3. SEO & మెటా ట్యాగ్స్' : '3. SEO & Meta Tags',
        desc: lang === 'te' ? 'టైటిల్, వివరణ, H1-H6, ఓపెన్‌గ్రాఫ్ ట్యాగ్స్' : 'Inspecting Title, Meta, Headings & OpenGraph',
      };
    case 'vitals':
      return {
        title: lang === 'te' ? '4. కోర్ వెబ్ వైటల్స్ & స్పీడ్' : '4. Core Web Vitals & Speed',
        desc: lang === 'te' ? 'LCP, INP, CLS, TTFB మరియు రెండరింగ్ వేగం' : 'Analyzing LCP, INP, CLS & render pipeline',
      };
    case 'score':
      return {
        title: lang === 'te' ? '5. AI కన్సెన్సస్ స్కోరింగ్' : '5. AI Consensus Scoring',
        desc: lang === 'te' ? 'రిపోర్ట్ మరియు 1-క్లిక్ ఫిక్స్ కోడ్ జనరేషన్' : 'Synthesizing final diagnostic report & code patches',
      };
    default:
      return {
        title: lang === 'te' ? 'స్కాన్ జరుగుతోంది' : 'Audit in Progress',
        desc: lang === 'te' ? 'వెబ్‌సైట్ విశ్లేషణ పూర్తవుతోంది...' : 'Analyzing website health telemetry...',
      };
  }
};
