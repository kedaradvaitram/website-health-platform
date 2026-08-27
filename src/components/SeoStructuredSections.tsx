import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Lock,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Gauge,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Language } from '../types';

interface SeoStructuredSectionsProps {
  lang: Language;
  onScanUrl?: (url: string) => void;
  onOpenPricing?: () => void;
  onNavigateLandingPage?: (pageKey: string) => void;
  onOpenSeoPage?: (pageKey: string) => void;
}

export const SeoStructuredSections: React.FC<SeoStructuredSectionsProps> = ({
  lang,
  onScanUrl,
  onOpenPricing,
  onNavigateLandingPage,
  onOpenSeoPage,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const isTe = lang === 'te';

  const faqs = [
    {
      q: isTe
        ? 'వెబ్‌సైట్ హెల్త్ చెకర్ మరియు SEO ఆడిట్ టూల్ అంటే ఏమిటి?'
        : 'What is a Website Health Checker and SEO Audit Tool?',
      a: isTe
        ? 'వెబ్‌సైట్ హెల్త్ చెకర్ అనేది మీ వెబ్‌సైట్ యొక్క టెక్నికల్ SEO, కోర్ వెబ్ వైటల్స్ స్పీడ్, SSL సెక్యూరిటీ ఎన్‌క్రిప్షన్, యాక్సెసిబిలిటీ (WCAG AA) మరియు బెస్ట్ ప్రాక్టీసెస్ లోపాలన్నింటినీ తక్షణమే స్కాన్ చేసి, స్వయంచాలక కోడ్ ఫిక్స్‌లను అందించే సమగ్ర ఆడిట్ ప్లాట్‌ఫామ్.'
        : 'A Website Health Checker performs an in-depth, automated technical audit of your entire site across On-Page SEO, Core Web Vitals, SSL encryption, WCAG accessibility, and security headers, identifying critical errors and outputting 1-click code patches.',
    },
    {
      q: isTe
        ? 'ఈ టూల్ ఆన్-పేజ్ మరియు టెక్నికల్ SEOని ఎలా విశ్లేషిస్తుంది?'
        : 'How does this tool analyze Technical & On-Page SEO?',
      a: isTe
        ? 'మా ఇంజిన్ Meta Titles, Meta Descriptions, H1-H6 హెడింగ్ హైరార్కీ, Canonical URLs, Open Graph / Twitter కార్డ్స్, Robots.txt, Sitemap.xml, ఇమేజ్ Alt ట్యాగ్స్ మరియు Schema.org JSON-LD మార్కప్‌లను నిశితంగా పరిశీలిస్తుంది.'
        : 'Our diagnostic engine systematically evaluates HTML meta tags, heading hierarchies (single H1 rule, semantic H2-H6), canonical URLs, XML sitemaps, robots.txt crawlability, image dimensions/alt text, internal linking, and structured data schemas.',
    },
    {
      q: isTe
        ? 'కోర్ వెబ్ వైటల్స్ (Core Web Vitals) స్కోర్‌లను ఎలా లెక్కిస్తారు?'
        : 'How are Performance & Core Web Vitals metrics measured?',
      a: isTe
        ? 'Largest Contentful Paint (LCP < 2.5s), Cumulative Layout Shift (CLS < 0.1), First Input Delay / INP, Total Blocking Time (TBT), మరియు సర్వర్ రెస్పాన్స్ టైమ్ (TTFB) ఆధారంగా వాస్తవ Google లైట్‌హౌస్ ప్రమాణాలతో స్కోర్ లెక్కిస్తాము.'
        : 'We benchmark Largest Contentful Paint (LCP < 2.5s), Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP), Total Blocking Time (TBT), and Time to First Byte (TTFB) against Google Web Vitals enterprise standards.',
    },
    {
      q: isTe
        ? 'గుర్తించిన లోపాలను ఆటోమేటిక్‌గా కోడ్‌లో సరిదిద్దవచ్చా?'
        : 'Can I automatically fix detected issues in my website repository?',
      a: isTe
        ? 'అవును! మా ఆటోమేటెడ్ రెమిడియేషన్ ఇంజిన్ సిద్ధంగా ఉన్న GitHub Pull Requests లేదా డౌన్‌లోడ్ చేసుకోగల ZIP ప్యాచ్ ఫైల్స్‌ను రూపొందిస్తుంది, దీని ద్వారా డెవలపర్లు గంటల కొద్దీ శ్రమ లేకుండా నిమిషాల్లో లోపాలను సరిచేయవచ్చు.'
        : 'Yes! Our automated remediation engine builds ready-to-merge GitHub Pull Requests or downloadable ZIP patches containing optimized meta tags, defer scripts, and security header configurations.',
    },
    {
      q: isTe
        ? 'ఈ ప్లాట్‌ఫామ్ పూర్తిగా ఉచితమా?'
        : 'Is this website audit tool free to use?',
      a: isTe
        ? 'అవును, బేసిక్ మరియు డీటెయిల్డ్ సింగిల్/బల్క్ వెబ్‌సైట్ ఆడిట్‌లు, స్కోర్‌కార్డులు మరియు లైవ్ డయాగ్నస్టిక్స్ నివేదికలు 100% ఉచితం. డెడికేటెడ్ ఆటో-ఫిక్స్ ఇంజనీరింగ్ ప్యాకేజీలు నామమాత్రపు ధరలతో అందుబాటులో ఉన్నాయి.'
        : 'Yes, full technical audits, live performance scoring, accessibility checks, and PDF diagnostic reports are 100% free with unlimited scans. Instant automated code PR generation is available with transparent pricing.',
    },
  ];

  return (
    <div className="space-y-14 py-10">
      {/* SECTION 1: Complete Website Health Check */}
      <section
        id="complete-health-check"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 shadow-2xl space-y-6 transition-all hover:border-emerald-400 ring-1 ring-emerald-500/20"
      >
        <div className="flex items-center space-x-3 pb-5 border-b-2 border-slate-700/80">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTe ? 'సమగ్ర వెబ్‌సైట్ హెల్త్ చెక్ (Complete Website Health Check)' : 'Complete Website Health Check'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isTe
                ? 'మీ వెబ్‌సైట్ యొక్క పూర్తి సాంకేతిక స్థితి, భద్రత, వేగం మరియు ఆప్టిమైజేషన్ స్థాయిలను ఒకే చోట చూడండి.'
                : 'Holistic multi-vector telemetry evaluating technical stability, user experience, and search engine crawlability.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-emerald-400 space-y-3 transition-all shadow-md">
            <div className="flex items-center space-x-2 text-emerald-400 pb-2.5 border-b-2 border-slate-800">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Full-Stack Coverage</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Analyzes HTML DOM structure, HTTP/2 & HTTP/3 protocol headers, SSL cipher handshakes, and rendering bottlenecks simultaneously.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-teal-400 space-y-3 transition-all shadow-md">
            <div className="flex items-center space-x-2 text-teal-400 pb-2.5 border-b-2 border-slate-800">
              <Gauge className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Actionable Health Grade</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unified 0–100 score rating combining Core Web Vitals, On-Page SEO meta completeness, and OWASP server security headers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-cyan-400 space-y-3 transition-all shadow-md">
            <div className="flex items-center space-x-2 text-cyan-400 pb-2.5 border-b-2 border-slate-800">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Bulk & Sitemap Crawling</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Audit up to 20 URLs concurrently or parse entire XML sitemaps in a resilient, queued background worker.
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Thick Divider Line 1 */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="w-full h-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-400 to-cyan-500/20 rounded-full shadow-lg shadow-teal-500/20" />
        <div className="absolute px-5 py-1 bg-slate-950 text-xs font-black uppercase tracking-wider text-teal-300 border-2 border-teal-500/50 rounded-full shadow-xl">
          ✦ {isTe ? 'సెక్షన్ 2: SEO & టెక్నికల్ ఆడిట్' : 'SECTION 2: SEO & TECHNICAL AUDIT'} ✦
        </div>
      </div>

      {/* SECTION 2: SEO Audit & Technical Analysis */}
      <section
        id="seo-audit"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-teal-500/50 shadow-2xl space-y-6 transition-all hover:border-teal-400 ring-1 ring-teal-500/20"
      >
        <div className="flex items-center space-x-3 pb-5 border-b-2 border-slate-700/80">
          <div className="p-2.5 rounded-xl bg-teal-500/20 border-2 border-teal-500/40 text-teal-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTe ? 'SEO ఆడిట్ & సాంకేతిక విశ్లేషణ (SEO Audit)' : 'SEO Audit & Technical Analysis'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isTe
                ? 'Google శోధన ఫలితాలలో అగ్రస్థానంలో నిలవడానికి అవసరమైన సమగ్ర On-Page & Technical SEO చెక్‌లిస్ట్.'
                : 'Ensure 100% search engine indexability with rigorous on-page tags, robots directives, and schema integrity.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-teal-400 space-y-2.5 transition-all shadow-md">
            <h4 className="text-xs font-black text-teal-300 uppercase tracking-wider pb-2.5 border-b-2 border-slate-800">
              Meta Titles & Descriptions
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Validates length (50-60 chars for title, 150-160 for snippet) and keyword uniqueness.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-teal-400 space-y-2.5 transition-all shadow-md">
            <h4 className="text-xs font-black text-teal-300 uppercase tracking-wider pb-2.5 border-b-2 border-slate-800">
              Heading Structure (H1-H6)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enforces the strict single H1 rule and verifies logical, non-skipping sub-heading hierarchy.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-teal-400 space-y-2.5 transition-all shadow-md">
            <h4 className="text-xs font-black text-teal-300 uppercase tracking-wider pb-2.5 border-b-2 border-slate-800">
              Canonical & Robots.txt
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prevents duplicate content penalties and verifies clean crawler directive policies.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-teal-400 space-y-2.5 transition-all shadow-md">
            <h4 className="text-xs font-black text-teal-300 uppercase tracking-wider pb-2.5 border-b-2 border-slate-800">
              Structured Data (JSON-LD)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verifies Organization, WebApplication, FAQPage, and Breadcrumbs for Google rich snippets.
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Thick Divider Line 2 */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="w-full h-1.5 bg-gradient-to-r from-teal-500/20 via-cyan-400 to-blue-500/20 rounded-full shadow-lg shadow-cyan-500/20" />
        <div className="absolute px-5 py-1 bg-slate-950 text-xs font-black uppercase tracking-wider text-cyan-300 border-2 border-cyan-500/50 rounded-full shadow-xl">
          ✦ {isTe ? 'సెక్షన్ 3: వెబ్‌సైట్ భద్రత & SSL' : 'SECTION 3: SECURITY & SSL ENCRYPTION'} ✦
        </div>
      </div>

      {/* SECTION 3: Website Security Check & SSL Encryption */}
      <section
        id="website-security-check"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/50 shadow-2xl space-y-6 transition-all hover:border-cyan-400 ring-1 ring-cyan-500/20"
      >
        <div className="flex items-center space-x-3 pb-5 border-b-2 border-slate-700/80">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/40 text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTe ? 'వెబ్‌సైట్ సెక్యూరిటీ చెక్ & SSL (Website Security Check)' : 'Website Security Check & SSL Encryption'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isTe
                ? 'SSL సర్టిఫికేట్ చెల్లుబాటు, HSTS ఎన్‌ఫోర్స్‌మెంట్ మరియు క్లిక్‌జాకింగ్ రక్షణల సమగ్ర తనిఖీ.'
                : 'Defend your visitors against vulnerabilities with automated HTTPS, TLS 1.3, and OWASP header validation.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-cyan-400 space-y-2.5 transition-all shadow-md">
            <h3 className="font-bold text-sm text-cyan-300 pb-2.5 border-b-2 border-slate-800">
              SSL/TLS Certificate Validity
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Validates issuer authority, cryptographic cipher strength, expiry dates, and SAN hostname matching.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-cyan-400 space-y-2.5 transition-all shadow-md">
            <h3 className="font-bold text-sm text-cyan-300 pb-2.5 border-b-2 border-slate-800">
              Strict-Transport-Security (HSTS)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enforces browser-side HTTPS redirection to protect against man-in-the-middle attacks and cookie hijacking.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-cyan-400 space-y-2.5 transition-all shadow-md">
            <h3 className="font-bold text-sm text-cyan-300 pb-2.5 border-b-2 border-slate-800">
              X-Frame & CSP Protection
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Audits Content Security Policy (CSP), X-Frame-Options against clickjacking, and MIME-type sniffing blocks.
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Thick Divider Line 3 */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="w-full h-1.5 bg-gradient-to-r from-cyan-500/20 via-amber-400 to-orange-500/20 rounded-full shadow-lg shadow-amber-500/20" />
        <div className="absolute px-5 py-1 bg-slate-950 text-xs font-black uppercase tracking-wider text-amber-300 border-2 border-amber-500/50 rounded-full shadow-xl">
          ✦ {isTe ? 'సెక్షన్ 4: స్పీడ్ & కోర్ వెబ్ వైటల్స్' : 'SECTION 4: SPEED & CORE WEB VITALS'} ✦
        </div>
      </div>

      {/* SECTION 4: Performance & Core Web Vitals */}
      <section
        id="performance-core-web-vitals"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 shadow-2xl space-y-6 transition-all hover:border-amber-400 ring-1 ring-amber-500/20"
      >
        <div className="flex items-center space-x-3 pb-5 border-b-2 border-slate-700/80">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTe ? 'పెర్ఫార్మెన్స్ & కోర్ వెబ్ వైటల్స్ (Performance & Core Web Vitals)' : 'Performance & Core Web Vitals'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isTe
                ? 'లైవ్ స్పీడ్ టెస్ట్, LCP, CLS, TBT మరియు రెండర్ బ్లాకింగ్ స్క్రిప్ట్‌ల ఆప్టిమైజేషన్ నివేదిక.'
                : 'Diagnose critical rendering path delays, server latency (TTFB), and responsive image bottlenecks.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-amber-400 transition-all space-y-2 shadow-md">
            <div className="text-2xl font-black text-amber-400">&lt; 2.5s</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              LCP Target
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Largest Contentful Paint speed requirement for green SEO ranking.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-emerald-400 transition-all space-y-2 shadow-md">
            <div className="text-2xl font-black text-emerald-400">&lt; 0.10</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              CLS Stability
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Cumulative Layout Shift to eliminate unexpected visual page jumps.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-teal-400 transition-all space-y-2 shadow-md">
            <div className="text-2xl font-black text-teal-400">&lt; 200ms</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              INP / FID
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Interactive responsiveness to user clicks and keystrokes.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-cyan-400 transition-all space-y-2 shadow-md">
            <div className="text-2xl font-black text-cyan-400">WebP / AVIF</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              Next-Gen Assets
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Automated compression reducing payload sizes by up to 70%.
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Thick Divider Line 4 */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="w-full h-1.5 bg-gradient-to-r from-amber-500/20 via-purple-400 to-indigo-500/20 rounded-full shadow-lg shadow-purple-500/20" />
        <div className="absolute px-5 py-1 bg-slate-950 text-xs font-black uppercase tracking-wider text-purple-300 border-2 border-purple-500/50 rounded-full shadow-xl">
          ✦ {isTe ? 'సెక్షన్ 5: యాక్సెసిబిలిటీ & WCAG' : 'SECTION 5: ACCESSIBILITY & WCAG'} ✦
        </div>
      </div>

      {/* SECTION 5: Accessibility Check & WCAG Compliance */}
      <section
        id="accessibility-check"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-purple-500/50 shadow-2xl space-y-6 transition-all hover:border-purple-400 ring-1 ring-purple-500/20"
      >
        <div className="flex items-center space-x-3 pb-5 border-b-2 border-slate-700/80">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border-2 border-purple-500/40 text-purple-400">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTe ? 'యాక్సెసిబిలిటీ చెక్ (Accessibility Check & WCAG)' : 'Accessibility Check & WCAG Compliance'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isTe
                ? 'దివ్యాంగులు మరియు స్క్రీన్ రీడర్ యూజర్ల కోసం WCAG 2.1 AA ప్రమాణాల తనిఖీ.'
                : 'Guarantee full digital inclusion with WCAG 2.1 AA contrast ratio tests, keyboard navigation, and ARIA labels.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-purple-400 space-y-2.5 transition-all shadow-md">
            <h3 className="font-bold text-sm text-purple-300 pb-2.5 border-b-2 border-slate-800">
              Color Contrast (4.5:1)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tests foreground text against backgrounds to prevent visual readability fatigue.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-purple-400 space-y-2.5 transition-all shadow-md">
            <h3 className="font-bold text-sm text-purple-300 pb-2.5 border-b-2 border-slate-800">
              Screen Reader ARIA Labels
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verifies semantic HTML landmarks and aria-label attributes for non-text interactive elements.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-purple-400 space-y-2.5 transition-all shadow-md">
            <h3 className="font-bold text-sm text-purple-300 pb-2.5 border-b-2 border-slate-800">
              Keyboard Traversal & Focus
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ensures all buttons, modals, and input fields are smoothly operable with Tab/Enter keys.
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Thick Divider Line 5 */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="w-full h-1.5 bg-gradient-to-r from-purple-500/20 via-emerald-400 to-teal-500/20 rounded-full shadow-lg shadow-emerald-500/20" />
        <div className="absolute px-5 py-1 bg-slate-950 text-xs font-black uppercase tracking-wider text-emerald-300 border-2 border-emerald-500/50 rounded-full shadow-xl">
          ✦ {isTe ? 'సెక్షన్ 6: ఆటోమేటెడ్ కోడ్ రెమిడియేషన్' : 'SECTION 6: AUTOMATED CODE REMEDIATION'} ✦
        </div>
      </div>

      {/* SECTION 6: Get Actionable Fixes */}
      <section
        id="actionable-fixes"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 shadow-2xl space-y-6 transition-all hover:border-emerald-400 ring-1 ring-emerald-500/20"
      >
        <div className="flex items-center space-x-3 pb-5 border-b-2 border-slate-700/80">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTe ? 'స్వయంచాలక కోడ్ ఫిక్స్‌లు (Get Actionable Fixes)' : 'Get Actionable Fixes & Code Remediation'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isTe
                ? 'కేవలం లోపాలను చూపించడమే కాకుండా, వాటిని పరిష్కరించే ఖచ్చితమైన కోడ్ స్నిప్పెట్స్ మరియు PRలను రూపొందిస్తుంది.'
                : 'Turn diagnostic telemetry directly into production-ready code with 1-click GitHub PR creation or ZIP patch export.'}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border-2 border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automated Git Pull Request Generator</span>
            </div>
            <h3 className="text-lg font-black text-white">
              {isTe ? 'మీ కోడ్ రిపోజిటరీకి డైరెక్ట్ ప్యాచ్‌లు' : 'Deploy Verified Patches in Minutes'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Auto-inject missing meta tags, resolve render-blocking resource scripts, configure HSTS headers, and repair ARIA attributes without manual refactoring.
            </p>
          </div>
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 transition-all cursor-pointer shrink-0"
            >
              <span>{isTe ? 'రెమిడియేషన్ ప్లాన్లు చూడండి' : 'View Remediation Plans'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* Prominent Thick Divider Line 6 */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="w-full h-1.5 bg-gradient-to-r from-slate-700/30 via-slate-400 to-slate-700/30 rounded-full shadow-lg shadow-slate-500/20" />
        <div className="absolute px-5 py-1 bg-slate-950 text-xs font-black uppercase tracking-wider text-slate-200 border-2 border-slate-500 rounded-full shadow-xl">
          ✦ {isTe ? 'సెక్షన్ 7: మా ప్లాట్‌ఫామ్ ప్రయోజనాలు' : 'SECTION 7: WHY CHOOSE US'} ✦
        </div>
      </div>

      {/* SECTION 7: Why Choose Us */}
      <section
        id="why-choose-us"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl space-y-6 transition-all hover:border-slate-500 ring-1 ring-slate-700/30"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2 pb-5 border-b-2 border-slate-700/80">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isTe ? 'మా ప్లాట్‌ఫామ్‌ను ఎందుకు ఎంచుకోవాలి?' : 'Why Choose Website Health Platform?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {isTe
              ? 'డెవలపర్లు, మార్కెటర్లు మరియు వ్యాపారవేత్తల కోసం రూపొందించబడిన అత్యుత్తమ వెబ్ ఆడిట్ టెక్నాలజీ.'
              : 'Engineered for developers, webmasters, and digital agencies demanding high precision telemetry.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-emerald-400 text-center space-y-2.5 transition-all shadow-md">
            <div className="text-3xl font-black text-emerald-400">0.8s</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              Lightning-Fast Engine
            </h4>
            <p className="text-xs text-slate-300">Asynchronous multi-thread analysis yields complete reports in under a second.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-teal-400 text-center space-y-2.5 transition-all shadow-md">
            <div className="text-3xl font-black text-teal-400">50+</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              Checkpoints Inspected
            </h4>
            <p className="text-xs text-slate-300">Comprehensive verification across SEO, Speed, Security, Accessibility, and DNS.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-cyan-400 text-center space-y-2.5 transition-all shadow-md">
            <div className="text-3xl font-black text-cyan-400">100%</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              Privacy &amp; Security
            </h4>
            <p className="text-xs text-slate-300">Zero intrusive tracking or server payload harvesting. Secure cryptographic orders.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 hover:border-purple-400 text-center space-y-2.5 transition-all shadow-md">
            <div className="text-3xl font-black text-purple-400">PDF + PR</div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b-2 border-slate-800">
              Ready Deliverables
            </h4>
            <p className="text-xs text-slate-300">Executive PDF reports for clients and automated GitHub PR code patches for engineers.</p>
          </div>
        </div>
      </section>

      {/* Prominent Thick Divider Line 7 */}
      <div className="relative py-3 flex items-center justify-center">
        <div className="w-full h-1.5 bg-gradient-to-r from-teal-500/20 via-teal-400 to-emerald-500/20 rounded-full shadow-lg shadow-teal-500/20" />
        <div className="absolute px-5 py-1 bg-slate-950 text-xs font-black uppercase tracking-wider text-teal-300 border-2 border-teal-500/50 rounded-full shadow-xl">
          ✦ {isTe ? 'సెక్షన్ 8: తరచుగా అడిగే ప్రశ్నలు (FAQ)' : 'SECTION 8: FREQUENTLY ASKED QUESTIONS'} ✦
        </div>
      </div>

      {/* SECTION 8: Frequently Asked Questions */}
      <section
        id="faq-section"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-teal-500/40 shadow-2xl space-y-6 transition-all hover:border-teal-400 ring-1 ring-teal-500/20"
      >
        <div className="flex items-center space-x-3 pb-5 border-b-2 border-slate-700/80">
          <div className="p-2.5 rounded-xl bg-teal-500/20 border-2 border-teal-500/40 text-teal-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTe ? 'తరచుగా అడిగే ప్రశ్నలు (Frequently Asked Questions)' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {isTe
                ? 'వెబ్‌సైట్ ఆడిట్, SEO స్కోరింగ్ మరియు ఆటో-ఫిక్స్ సేవలపై సమగ్ర సమాధానాలు.'
                : 'Answers to common questions about SEO diagnostics, performance audits, and remediation.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950/80 border-2 border-slate-700/80 overflow-hidden transition-all hover:border-teal-400 shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-900/60 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0 ml-3" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t-2 border-slate-800 bg-slate-900/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
