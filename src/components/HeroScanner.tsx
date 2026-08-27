import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Zap,
  RefreshCw,
  CalendarCheck,
  Code2,
  Check,
  Server,
  Activity,
  Layers,
  FileCode,
  ListOrdered,
  Clock,
  Trash2,
  X,
  ExternalLink,
  Key,
  Copy,
  Eye,
  EyeOff,
  Terminal,
  Video,
  Users,
} from 'lucide-react';
import { FullAuditReport, Language, UserAccount, AuditTargetModule } from '../types';
import { translations, getAuditModuleLocalized, getAuditPhaseLocalized } from '../data/translations';
import { SmokeBackground } from './SmokeBackground';
import { LiveBrowserVideoScanner } from './LiveBrowserVideoScanner';

interface HeroScannerProps {
  lang: Language;
  user?: UserAccount;
  onUpdateUser?: (updated: UserAccount) => void;
  onScan: (url: string, email?: string, optInWeekly?: boolean, targetModule?: AuditTargetModule) => void;
  onBulkScan: (urls: string[], email?: string, optInWeekly?: boolean) => void;
  isScanning: boolean;
  isScanningBulk?: boolean;
  activeUrl: string;
  queueLength?: number;
  history?: FullAuditReport[];
  selectedTargetModule?: AuditTargetModule;
  onSelectTargetModule?: (module: AuditTargetModule) => void;
  onSelectHistoryReport?: (report: FullAuditReport) => void;
  onDeleteHistoryItem?: (hostname: string) => void;
  onClearHistory?: () => void;
  onOpenAiFix?: () => void;
  onOpenFixAndRescan?: () => void;
  onOpenIssueRoadmap?: () => void;
  onOpenAiFeatures?: () => void;
  onOpenCrawlerEngine?: () => void;
  onOpenDeveloperApi?: () => void;
  onOpenApiDocs?: () => void;
  onOpenMeetRoom?: () => void;
  onOpenCreateMeetingModal?: () => void;
  onOpenWorldsBestEngine?: () => void;
}

export interface AuditModuleOption {
  id: AuditTargetModule;
  name: string;
  nameTe: string;
  badge: string;
  badgeTe: string;
  icon: React.ElementType;
  color: string;
  placeholder: string;
  placeholderTe: string;
  btnLabel: string;
  btnLabelTe: string;
}

export const AUDIT_MODULE_OPTIONS: AuditModuleOption[] = [
  {
    id: 'all',
    name: 'Full 360° Audit',
    nameTe: 'పూర్తి 360° ఆడిట్',
    badge: 'All-in-One',
    badgeTe: 'సంపూర్ణ రిపోర్ట్',
    icon: Globe,
    color: 'amber',
    placeholder: 'Enter website URL for full comprehensive scan (e.g. stripe.com)',
    placeholderTe: 'పూర్తి స్కాన్ కోసం వెబ్‌సైట్ URL నమోదు చేయండి (ఉదా: stripe.com)',
    btnLabel: 'Run Full Audit',
    btnLabelTe: 'పూర్తి ఆడిట్ రన్ చేయండి',
  },
  {
    id: 'seo',
    name: 'Website SEO Checker',
    nameTe: 'SEO చెకర్ & ఆడిట్',
    badge: 'On-Page & Schema',
    badgeTe: 'మెటా & స్కీమా',
    icon: Search,
    color: 'teal',
    placeholder: 'Enter website to check SEO tags, headings & indexing (e.g. vercel.com)',
    placeholderTe: 'SEO ట్యాగ్‌లు & హెడ్డింగ్స్ చెక్ చేయడానికి URL ఇవ్వండి',
    btnLabel: 'Run SEO Audit',
    btnLabelTe: 'SEO ఆడిట్ చెక్ చేయండి',
  },
  {
    id: 'security',
    name: 'Security & SSL Check',
    nameTe: 'సెక్యూరిటీ & వల్నరబిలిటీ',
    badge: 'OWASP & Headers',
    badgeTe: 'భద్రతా రక్షణ',
    icon: ShieldCheck,
    color: 'cyan',
    placeholder: 'Enter website to scan SSL encryption & security headers',
    placeholderTe: 'సెక్యూరిటీ హెడర్స్ & ఎన్‌క్రిప్షన్ స్కాన్ చేయడానికి URL ఇవ్వండి',
    btnLabel: 'Run Security Audit',
    btnLabelTe: 'సెక్యూరిటీ టెస్ట్ చేయండి',
  },
  {
    id: 'performance',
    name: 'Speed & Performance',
    nameTe: 'స్పీడ్ & పెర్ఫార్మెన్స్',
    badge: 'Speed & TTFB',
    badgeTe: 'లోడింగ్ స్పీడ్',
    icon: Zap,
    color: 'emerald',
    placeholder: 'Enter website to test load speed, TTFB & assets (e.g. github.com)',
    placeholderTe: 'లోడ్ స్పీడ్ మరియు సర్వర్ రెస్పాన్స్ తనిఖీ చేయండి',
    btnLabel: 'Run Speed Test',
    btnLabelTe: 'స్పీడ్ టెస్ట్ చేయండి',
  },
  {
    id: 'accessibility',
    name: 'Accessibility (WCAG)',
    nameTe: 'యాక్సెసిబిలిటీ చెకర్',
    badge: 'WCAG 2.1 AA',
    badgeTe: 'WCAG ప్రమాణాలు',
    icon: Eye,
    color: 'purple',
    placeholder: 'Enter website to audit color contrast, ARIA & keyboard access',
    placeholderTe: 'కలర్ కాంట్రాస్ట్ మరియు ARIA యాక్సెస్ చెక్ చేయండి',
    btnLabel: 'Run WCAG Audit',
    btnLabelTe: 'యాక్సెసిబిలిటీ టెస్ట్',
  },
  {
    id: 'vitals',
    name: 'Core Web Vitals',
    nameTe: 'కోర్ వెబ్ వైటల్స్',
    badge: 'LCP • CLS • INP',
    badgeTe: 'LCP & లేఅవుట్',
    icon: Activity,
    color: 'blue',
    placeholder: 'Enter website to benchmark LCP, CLS, INP and render telemetry',
    placeholderTe: 'LCP, CLS, INP కొలతలను పరీక్షించడానికి URL ఇవ్వండి',
    btnLabel: 'Test Web Vitals',
    btnLabelTe: 'వెబ్ వైటల్స్ టెస్ట్',
  },
  {
    id: 'ssl',
    name: 'SSL Expiry & Trust',
    nameTe: 'SSL సర్టిఫికేట్ చెక్',
    badge: 'TLS 1.3 & Expiry',
    badgeTe: 'గడువు తేదీ',
    icon: Shield,
    color: 'emerald',
    placeholder: 'Enter domain to check SSL validity, issuer chain & expiration',
    placeholderTe: 'SSL సర్టిఫికేట్ గడువు & చైన్ ధృవీకరించండి',
    btnLabel: 'Check SSL Validity',
    btnLabelTe: 'SSL చెక్ చేయండి',
  },
];

interface AuditPhase {
  id: string;
  title: string;
  titleTe: string;
  desc: string;
  descTe: string;
  icon: React.ElementType;
}

const AUDIT_PHASES: AuditPhase[] = [
  {
    id: 'dns',
    title: 'Analyzing DNS',
    titleTe: 'DNS & రికార్డుల విశ్లేషణ',
    desc: 'Resolving A, AAAA, MX & DMARC routing',
    descTe: 'A, MX మరియు DMARC రూటింగ్ తనిఖీ',
    icon: Globe,
  },
  {
    id: 'ssl',
    title: 'Checking SSL',
    titleTe: 'SSL ఎన్‌క్రిప్షన్ తనిఖీ',
    desc: 'Validating TLS 1.3, ciphers & HSTS defense',
    descTe: 'TLS 1.3 సర్టిఫికేట్ మరియు HSTS రక్షణ',
    icon: ShieldCheck,
  },
  {
    id: 'perf',
    title: 'Testing Speed',
    titleTe: 'స్పీడ్ & పెర్ఫార్మెన్స్',
    desc: 'Measuring LCP, FCP, TTFB & Core Web Vitals',
    descTe: 'LCP, FCP మరియు TTFB వేగం కొలత',
    icon: Zap,
  },
  {
    id: 'seo',
    title: 'Auditing SEO',
    titleTe: 'ఎస్‌ఈఓ & మెటా ఆడిట్',
    desc: 'Evaluating meta titles, hierarchy & image alts',
    descTe: 'టైటిల్స్, మెటా ట్యాగ్స్ మరియు ఆల్ట్ వివరాలు',
    icon: Search,
  },
  {
    id: 'code',
    title: 'Scanning Code',
    titleTe: 'కోడ్ & లోపాల స్కాన్',
    desc: 'Detecting frameworks & generating fix snippets',
    descTe: 'టెక్నాలజీ స్టాక్ మరియు కోడ్ ఫిక్సెస్ తయారీ',
    icon: Code2,
  },
];

const QUICK_SAMPLES = ['github.com', 'stripe.com', 'vercel.com', 'cloudflare.com', 'wikipedia.org'];

export const HeroScanner: React.FC<HeroScannerProps> = ({
  lang,
  user,
  onUpdateUser,
  onScan,
  onBulkScan,
  isScanning,
  isScanningBulk,
  activeUrl,
  queueLength = 0,
  history = [],
  selectedTargetModule = 'all',
  onSelectTargetModule,
  onSelectHistoryReport,
  onDeleteHistoryItem,
  onClearHistory,
  onOpenAiFix,
  onOpenFixAndRescan,
  onOpenIssueRoadmap,
  onOpenAiFeatures,
  onOpenCrawlerEngine,
  onOpenDeveloperApi,
  onOpenApiDocs,
  onOpenMeetRoom,
  onOpenCreateMeetingModal,
  onOpenWorldsBestEngine,
}) => {
  const t = translations[lang];
  const [scanMode, setScanMode] = useState<'single' | 'bulk'>('single');
  const [targetModule, setTargetModule] = useState<AuditTargetModule>(selectedTargetModule || 'all');

  // Keep targetModule synced if selectedTargetModule changes externally
  useEffect(() => {
    if (selectedTargetModule) {
      setTargetModule(selectedTargetModule);
    }
  }, [selectedTargetModule]);

  const activeModuleOption =
    AUDIT_MODULE_OPTIONS.find((opt) => opt.id === targetModule) || AUDIT_MODULE_OPTIONS[0];

  const [urlInput, setUrlInput] = useState(activeUrl || '');
  const [bulkInput, setBulkInput] = useState('');
  const [emailInput, setEmailInput] = useState(user?.isLoggedIn && user?.email ? user.email : '');
  const [showEmailField, setShowEmailField] = useState(false);
  const [optInWeekly, setOptInWeekly] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);

  // API Key Quick Access states
  const [isApiKeyRevealed, setIsApiKeyRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [snippetTab, setSnippetTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [localApiKey, setLocalApiKey] = useState<string>(() => {
    return user?.apiKey || user?.apiKeysList?.[0]?.key || 'whs_live_d82f7c041e9b2a64';
  });

  // Sync API Key if user state changes
  useEffect(() => {
    if (user?.apiKey) {
      setLocalApiKey(user.apiKey);
    } else if (user?.apiKeysList?.[0]?.key) {
      setLocalApiKey(user.apiKeysList[0].key);
    }
  }, [user?.apiKey, user?.apiKeysList]);

  const activeApiKey = localApiKey;
  const maskedApiKey = activeApiKey.length > 12 
    ? `${activeApiKey.slice(0, 8)}${'•'.repeat(16)}${activeApiKey.slice(-4)}`
    : 'whs_live_••••••••••••••••8a92';

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(activeApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateNewKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newKey = `whs_live_${randomHex}`;
    setLocalApiKey(newKey);
    setIsApiKeyRevealed(true);

    if (user && onUpdateUser) {
      const updatedUser: UserAccount = {
        ...user,
        apiKey: newKey,
        apiKeyCreatedAt: new Date().toISOString(),
        apiKeyStatus: 'active',
        apiTier: user.apiTier || 'Free Starter',
        apiCreditsRemaining: user.apiCreditsRemaining ?? 1000,
      };
      onUpdateUser(updatedUser);
    }
  };

  const getCodeSnippet = (tab: 'curl' | 'node' | 'python') => {
    const target = urlInput.trim() || 'https://example.com';
    if (tab === 'curl') {
      return `curl -X POST "https://api.websitehealth.io/v1/audit" \\
  -H "Authorization: Bearer ${activeApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${target}", "modules": ["seo", "security", "perf"]}'`;
    }
    if (tab === 'node') {
      return `import { WebsiteHealthClient } from '@websitehealth/sdk';
const client = new WebsiteHealthClient({ apiKey: '${activeApiKey}' });
const report = await client.audit.run({ url: '${target}' });
console.log('Score:', report.overallScore);`;
    }
    return `import requests

res = requests.post(
    "https://api.websitehealth.io/v1/audit",
    headers={"Authorization": "Bearer ${activeApiKey}"},
    json={"url": "${target}", "modules": ["all"]}
)
print(res.json()["overallScore"])`;
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet(snippetTab));
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  // Sync email if user logs in
  useEffect(() => {
    if (user?.isLoggedIn && user?.email && !emailInput) {
      setEmailInput(user.email);
    }
  }, [user]);

  // Synchronize phase animations whenever isScanning becomes true
  useEffect(() => {
    if (!isScanning) {
      setCurrentPhaseIndex(0);
      setSmoothProgress(0);
      return;
    }

    setSmoothProgress(10);
    setCurrentPhaseIndex(0);

    const progressInterval = setInterval(() => {
      setSmoothProgress((prev) => {
        if (prev >= 98) return 98;
        return prev + 2;
      });
    }, 45);

    const phaseInterval = setInterval(() => {
      setCurrentPhaseIndex((prev) => {
        if (prev < AUDIT_PHASES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 480);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [isScanning]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setOptInWeekly(isChecked);
    if (isChecked) {
      setShowEmailField(true);
      if (user?.isLoggedIn && user?.email && !emailInput) {
        setEmailInput(user.email);
      }
    }
  };

  const parseBulkUrls = (raw: string): string[] => {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    // Check if it is a sitemap XML link
    if (trimmed.toLowerCase().includes('.xml') || trimmed.toLowerCase().includes('sitemap')) {
      let base = trimmed;
      if (!base.startsWith('http://') && !base.startsWith('https://')) {
        base = 'https://' + base;
      }
      try {
        const parsed = new URL(base);
        const origin = parsed.origin;
        return [
          `${origin}/`,
          `${origin}/pricing`,
          `${origin}/features`,
          `${origin}/docs`,
          `${origin}/security`,
          `${origin}/blog`,
        ];
      } catch {
        const cleanBase = base.replace(/\/sitemap.*$/i, '');
        return [
          cleanBase,
          `${cleanBase}/pricing`,
          `${cleanBase}/docs`,
          `${cleanBase}/security`,
        ];
      }
    }

    // Split by comma or newline
    const items = trimmed
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return items;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScanning) return;

    if (scanMode === 'single') {
      if (!urlInput.trim()) return;
      // Auto-detect if user entered comma-separated URLs into the single input field
      if (urlInput.includes(',') || urlInput.toLowerCase().includes('.xml') || urlInput.toLowerCase().includes('sitemap')) {
        const parsed = parseBulkUrls(urlInput);
        if (parsed.length > 1) {
          onBulkScan(parsed, emailInput.trim() || undefined, optInWeekly);
          return;
        }
      }
      onScan(urlInput.trim(), emailInput.trim() || undefined, optInWeekly, targetModule);
    } else {
      const parsedUrls = parseBulkUrls(bulkInput);
      if (parsedUrls.length === 0) return;
      if (parsedUrls.length === 1) {
        onScan(parsedUrls[0], emailInput.trim() || undefined, optInWeekly, targetModule);
      } else {
        onBulkScan(parsedUrls, emailInput.trim() || undefined, optInWeekly);
      }
    }
  };

  const activePhase = AUDIT_PHASES[currentPhaseIndex] || AUDIT_PHASES[0];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
      {/* Interactive Atmospheric Multi-Color Aurora & Stardust Cosmos Canvas */}
      <SmokeBackground density="high" interactive={true} />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Top Feature Pill (Rich Warm / Multi-tone Contrast) */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-indigo-500/15 border border-amber-500/30 text-amber-200 text-xs font-bold shadow-md shadow-amber-500/5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            {lang === 'te'
              ? 'ఆటోమేటెడ్ వెబ్‌సైట్ ఎర్రర్ స్కానర్ & బల్క్ ఆడిట్ క్యూ'
              : 'Next-Gen Instant Web Health, Batch Scanner & Queue'}
          </span>
        </div>

        {/* Main Headline - High-Contrast Rich Radiant Gradient */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
          {lang === 'te' ? (
            <>
              మీ వెబ్‌సైట్{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-cyan-300 drop-shadow-sm">
                హెల్త్, SEO &amp; సెక్యూరిటీని
              </span>{' '}
              చెక్ చేయండి
            </>
          ) : (
            <>
              Check Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-cyan-300 drop-shadow-sm">
                Website Health, SEO &amp; Security
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.appTagline}
        </p>

        {/* Scan Mode Switcher (Single vs Bulk / Sitemap) - Rich Luxury Switcher */}
        <div className="inline-flex rounded-2xl bg-slate-900/90 p-1.5 border border-slate-700/90 text-xs font-bold text-slate-300 shadow-xl ring-1 ring-white/5">
          <button
            type="button"
            onClick={() => setScanMode('single')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              scanMode === 'single'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.singleAuditMode}</span>
          </button>
          <button
            type="button"
            onClick={() => setScanMode('bulk')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              scanMode === 'bulk'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.bulkAuditMode}</span>
          </button>
        </div>

        {/* World's Best AI Neural Engine (Gemini 3.7 Flash) Launch Banner Button */}
        {onOpenWorldsBestEngine && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={onOpenWorldsBestEngine}
              id="btn-hero-launch-worlds-best-engine"
              className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-200 border border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-500/10 text-xs font-bold transition-all cursor-pointer group hover:scale-[1.02]"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              </div>
              <span className="text-white font-extrabold">
                {lang === 'te' ? '✨ ప్రపంచంలోనే బెస్ట్ AI న్యూరల్ ఇంజిన్:' : "✨ World's Best AI Neural Engine:"}
              </span>
              <span className="text-emerald-300 font-mono font-semibold">
                Google Gemini 3.7 Flash Core
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                {lang === 'te' ? 'రన్ చేయండి' : 'Launch'}
              </span>
            </button>
          </div>
        )}

        {/* Section Target & Scope Picker - Allows user to choose between 360 Full Scan or Specific Section */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.optionsAndTools || 'Select Audit Target Scope:'}</span>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 max-w-3xl mx-auto">
            {AUDIT_MODULE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = targetModule === opt.id;
              const modLoc = getAuditModuleLocalized(opt.id, lang);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTargetModule(opt.id);
                    if (onSelectTargetModule) {
                      onSelectTargetModule(opt.id);
                    }
                  }}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-400/50'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{modLoc.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {modLoc.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scan Input Form - Prominently Highlighted & Enlarged */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
          {scanMode === 'single' ? (
            <div className="relative group/search">
              {/* Outer Ambient Dynamic Luminous Golden Aura Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/45 via-yellow-400/35 to-amber-500/45 rounded-3xl sm:rounded-full blur-xl opacity-85 group-hover/search:opacity-100 group-focus-within/search:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Main Search Bar Shell - Permanently Golden Highlighted, Responsive & Non-Clipping */}
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-400 hover:border-amber-300 focus-within:border-amber-300 ring-2 ring-amber-400/40 focus-within:ring-4 focus-within:ring-amber-400/40 rounded-3xl sm:rounded-full p-2.5 sm:p-3 shadow-[0_0_35px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.45)] transition-all duration-300 min-h-[64px]">
                
                {/* Top Input Row (Globe + URL Input + Clear button) */}
                <div className="flex items-center flex-1 w-full gap-2 min-w-0">
                  {/* Left Protocol / Globe Pill - Crisp & Compact */}
                  <div className="flex items-center space-x-1.5 bg-slate-900/95 border border-emerald-500/40 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-emerald-400 shadow-inner shrink-0">
                    <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 font-mono text-xs sm:text-sm">https://</span>
                  </div>

                  {/* Main URL Input Field */}
                  <div className="relative flex-1 flex items-center min-w-0">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={getAuditModuleLocalized(targetModule, lang).placeholder}
                      className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base md:text-lg font-medium px-2 py-2 sm:py-2.5 focus:outline-none min-w-0"
                      disabled={isScanning}
                    />

                    {/* Clear button when text exists */}
                    {urlInput.trim().length > 0 && !isScanning && (
                      <button
                        type="button"
                        onClick={() => setUrlInput('')}
                        className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1 cursor-pointer shrink-0"
                        title="Clear"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Action Controls on Mobile / Right Inline on Desktop */}
                <div className="flex items-center w-full sm:w-auto gap-2 pt-2.5 sm:pt-0 sm:pl-2 shrink-0 border-t border-slate-800/80 sm:border-t-0">
                  {/* Email Report Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowEmailField(!showEmailField)}
                    className={`relative p-3 sm:p-3.5 rounded-xl sm:rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      showEmailField || emailInput || optInWeekly
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                    title={t.emailOptional}
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    {(emailInput || optInWeekly) && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>

                  {/* Primary "Run Audit" Action Button - Full width on mobile, sleek on desktop */}
                  <button
                    type="submit"
                    disabled={isScanning || !urlInput.trim()}
                    id="btn-hero-run-audit"
                    className="flex-1 sm:flex-initial sm:w-auto whitespace-nowrap inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-4 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-full text-sm sm:text-base md:text-lg shadow-xl shadow-amber-500/35 hover:shadow-amber-500/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer group tracking-wide min-h-[46px] sm:min-h-[50px]"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-slate-950 shrink-0" />
                        <span className="whitespace-nowrap font-bold">{t.scanningButton}</span>
                      </>
                    ) : (
                      <>
                        <span className="whitespace-nowrap font-black">
                          {targetModule === 'all'
                            ? t.scanButton
                            : getAuditModuleLocalized(targetModule, lang).btnLabel}
                        </span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Bulk URLs & Sitemap Multi-Input Container - Prominently Highlighted */
            <div className="relative group/bulk">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-500/40 rounded-3xl blur-xl opacity-80 group-hover/bulk:opacity-100 group-focus-within/bulk:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-400 hover:border-amber-300 focus-within:border-amber-300 ring-2 ring-amber-400/40 focus-within:ring-4 focus-within:ring-amber-400/40 rounded-3xl p-5 shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] transition-all space-y-3.5 text-left">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2.5">
                  <span className="flex items-center space-x-2 font-bold text-amber-400 text-sm">
                    <FileCode className="w-4 h-4" />
                    <span>{t.bulkAuditMode}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {lang === 'te' ? 'కామా లేదా కొత్త లైన్‌తో వేరు చేయండి' : 'Separate with commas or newlines'}
                  </span>
                </div>

                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={t.bulkPlaceholder}
                  rows={4}
                  disabled={isScanning}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all font-mono resize-none"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmailField(!showEmailField)}
                      className={`inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        showEmailField || emailInput
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-400/80 shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>{emailInput ? emailInput : t.emailOptional}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isScanning || !bulkInput.trim()}
                    className="w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-base shadow-xl shadow-amber-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                        <span>{t.scanningBulk}</span>
                      </>
                    ) : (
                      <>
                        <ListOrdered className="w-5 h-5" />
                        <span>{t.startBulkScan}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Configuration Drawer */}
          {showEmailField && (
            <div className="bg-slate-800/95 border-2 border-emerald-500/40 rounded-2xl p-3.5 text-left max-w-xl mx-auto animate-fadeIn space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {lang === 'te' ? 'ఈమెయిల్ డెలివరీ అడ్రస్' : 'Email Address for Instant PDF & Weekly Reports'}
                  </span>
                </span>
                {user?.isLoggedIn && user?.email && emailInput !== user.email && (
                  <button
                    type="button"
                    onClick={() => setEmailInput(user.email)}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                  >
                    {lang === 'te' ? 'నా ఈమెయిల్ వాడండి' : `Use account (${user.email})`}
                  </button>
                )}
              </div>

              <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-emerald-400 transition-colors">
                <Mail className="w-4 h-4 text-emerald-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={lang === 'te' ? 'ఉదాహరణ: yourname@gmail.com' : 'e.g. yourname@company.com'}
                  className="bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 w-full focus:outline-none"
                  autoFocus={optInWeekly && !emailInput}
                />
                {emailInput.trim() && emailInput.includes('@') && (
                  <span className="shrink-0 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{lang === 'te' ? 'చెల్లుబాటు అయింది' : 'Ready'}</span>
                  </span>
                )}
              </div>

              {/* Dynamic Status / Guidance Helper */}
              {emailInput.trim() && emailInput.includes('@') ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-[11px] text-emerald-300 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {optInWeekly
                      ? (lang === 'te'
                          ? `ఆడిట్ PDF మరియు ప్రతి సోమవారం వీక్లీ సారాంశం ${emailInput} కు పంపబడుతుంది.`
                          : `Full Audit PDF & Weekly Monday Health Digest will be delivered to ${emailInput}`)
                      : (lang === 'te'
                          ? `తక్షణ ఆడిట్ PDF నివేదిక ${emailInput} కు పంపబడుతుంది.`
                          : `Instant Audit PDF Report will be dispatched to ${emailInput}`)}
                  </span>
                </div>
              ) : optInWeekly ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5 text-[11px] text-amber-300 font-medium flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>
                      {lang === 'te'
                        ? 'వీక్లీ నివేదికలను అందుకోవడానికి దయచేసి పై బాక్స్‌లో మీ ఈమెయిల్‌ను నమోదు చేయండి.'
                        : 'Please enter your email above to schedule weekly automated uptime & SEO reports.'}
                    </span>
                  </span>
                  {user?.isLoggedIn && user?.email && (
                    <button
                      type="button"
                      onClick={() => setEmailInput(user.email)}
                      className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 rounded-md text-[10px] font-bold text-amber-200 shrink-0 cursor-pointer"
                    >
                      {lang === 'te' ? 'ఆటో ఫిల్' : 'Auto Fill'}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Opt-in Weekly Health Summary Reports Checkbox */}
          <div className="flex flex-col items-center justify-center gap-3 pt-1">
            {/* Quick Sample Suggestions Chips */}
            {scanMode === 'single' && !isScanning && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400">
                <span className="text-[11px] font-bold text-amber-300/90 flex items-center gap-1 mr-0.5">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{t.presetLabel}</span>
                </span>
                {QUICK_SAMPLES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setUrlInput(sample);
                      onScan(sample, emailInput.trim() || undefined, optInWeekly);
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-400/50 text-[11px] font-mono transition-all cursor-pointer shadow-xs active:scale-95 hover:shadow-amber-500/10"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            )}

            <label className={`inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer select-none group shadow-lg border-2 ${
              optInWeekly
                ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/15 border-amber-400/60 text-amber-200 shadow-amber-500/10'
                : 'bg-slate-900/90 hover:bg-slate-850 border-slate-750 hover:border-slate-600 text-slate-300'
            }`}>
              <input
                type="checkbox"
                checked={optInWeekly}
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded-md text-amber-500 bg-slate-900 border-slate-600 focus:ring-amber-500/40 focus:ring-2 focus:ring-offset-0 transition-colors cursor-pointer accent-amber-500"
              />
              <span className="flex items-center gap-2 font-bold group-hover:text-white">
                <CalendarCheck className={`w-4 h-4 ${optInWeekly ? 'text-amber-400 animate-bounce' : 'text-amber-400'}`} />
                <span>{t.optInWeeklyReports}</span>
              </span>
            </label>

            {/* Quick Actions: Developer REST API Key & Google Meet Live Collaboration */}
            {!isScanning && (
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                {/* 1. HealthSec Live Meet (Instant, Schedule & Invite Links) */}
                {onOpenMeetRoom && (
                  <button
                    type="button"
                    onClick={onOpenMeetRoom}
                    id="hero-join-native-meet-btn"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-slate-900 to-indigo-500/20 hover:from-emerald-500/30 hover:to-indigo-500/30 text-emerald-200 hover:text-white border-2 border-emerald-500/60 hover:border-emerald-400 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 hover:scale-[1.03] active:scale-95 group"
                    title={lang === 'te' ? 'లైవ్ మీట్ డాష్‌బోర్డ్: తక్షణ మీటింగ్ & తేదీ/సమయం షెడ్యూలింగ్' : 'Launch Live Meet: Instant Meeting, Schedule & Invite Link'}
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>{lang === 'te' ? 'లైవ్ మీట్ & షెడ్యూలర్' : 'Live Meet & Schedule'}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase">
                      Instant • Schedule
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </button>
                )}

                {/* 2. Developer REST API Key */}
                {onOpenDeveloperApi && (
                  <button
                    type="button"
                    onClick={onOpenDeveloperApi}
                    id="hero-developer-api-dashboard-btn"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 text-amber-200 hover:text-white border-2 border-amber-500/60 hover:border-amber-400 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 hover:scale-[1.03] active:scale-95 group"
                    title={lang === 'te' ? 'డెవలపర్ API డాష్‌బోర్డ్ & కీలను తెరవండి' : 'Open Developer REST API Dashboard & Key Management'}
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span>{lang === 'te' ? 'డెవలపర్ REST API కీ' : 'Developer REST API Key'}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40 uppercase">
                      v1 REST
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      1,000 Free Req
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Live Browser Video Test Simulator & Multi-Phase Progress Visualizer */}
        {isScanning && (
          <div className="space-y-4 animate-fadeIn">
            {/* Live Interactive Browser Video Stream */}
            <LiveBrowserVideoScanner
              url={urlInput.trim() || activeUrl || 'website.com'}
              isScanning={isScanning}
              lang={lang}
              progress={smoothProgress}
              currentPhaseIndex={currentPhaseIndex}
            />

            {/* Enhanced Multi-Phase Scanning Progress Visualizer */}
            <div className="max-w-2xl mx-auto bg-slate-850/95 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-5 backdrop-blur-md">
              {/* Header info & smooth progress percentage */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{getAuditPhaseLocalized(AUDIT_PHASES[currentPhaseIndex]?.id || 'dns', lang).title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        Phase {currentPhaseIndex + 1}/{AUDIT_PHASES.length}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {getAuditPhaseLocalized(AUDIT_PHASES[currentPhaseIndex]?.id || 'dns', lang).desc}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {Math.min(100, Math.round(smoothProgress))}%
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Progress
                  </p>
                </div>
              </div>

              {/* Glowing animated progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-150 ease-out shadow-sm shadow-emerald-500/50"
                    style={{ width: `${smoothProgress}%` }}
                  />
                </div>
              </div>

              {/* Interactive 5-Step Phase Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {AUDIT_PHASES.map((phase, index) => {
                  const Icon = phase.icon;
                  const isCompleted = index < currentPhaseIndex;
                  const isCurrent = index === currentPhaseIndex;
                  const phaseLoc = getAuditPhaseLocalized(phase.id, lang);

                  return (
                    <div
                      key={phase.id}
                      className={`rounded-xl p-2.5 border transition-all duration-300 flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-emerald-950/50 border-emerald-500/60 shadow-lg shadow-emerald-900/20 scale-[1.02]'
                          : isCompleted
                          ? 'bg-slate-800/60 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          0{index + 1}
                        </span>
                      </div>

                      <div>
                        <p
                          className={`text-xs font-bold truncate ${
                            isCurrent
                              ? 'text-emerald-300'
                              : isCompleted
                              ? 'text-slate-200'
                              : 'text-slate-500'
                          }`}
                        >
                          {phaseLoc.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {isCompleted
                            ? (lang === 'te' ? 'పూర్తయింది' : 'Verified')
                            : isCurrent
                            ? (lang === 'te' ? 'స్కాన్ అవుతోంది...' : 'Scanning...')
                            : (lang === 'te' ? 'వేచి ఉంది' : 'Pending')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* User Tested Websites (Only shown if user has tested websites) */}
        {!isScanning && history.length > 0 && (
          <div className="pt-3 space-y-2.5 max-w-4xl mx-auto text-xs animate-fadeIn">
            <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5 font-bold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {lang === 'te'
                    ? `మీరు టెస్ట్ చేసిన వెబ్‌సైట్లు (${history.length}):`
                    : `Websites Tested by You (${history.length}):`}
                </span>
              </span>
              {onClearHistory && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title={t.clearTestedHistory}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.clearTestedHistory}</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {history.map((item) => {
                const score = item.overallScore;
                const scoreBadge =
                  score >= 90
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : score >= 75
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    : score >= 50
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

                const isCurrentActive = activeUrl.includes(item.hostname);

                return (
                  <div
                    key={item.hostname}
                    className={`group relative flex items-center space-x-2 pl-3 pr-2 py-1.5 rounded-xl border transition-all ${
                      isCurrentActive
                        ? 'bg-slate-800 text-white border-emerald-500 ring-1 ring-emerald-500/50 shadow-md'
                        : 'bg-slate-850/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectHistoryReport) {
                          onSelectHistoryReport(item);
                        } else {
                          onScan(item.url, emailInput.trim() || undefined, optInWeekly);
                        }
                      }}
                      className="flex items-center space-x-2 text-left cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-bold text-xs tracking-tight">{item.hostname}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${scoreBadge}`}>
                        {score}/100
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
                        Grade {item.grade}
                      </span>
                    </button>

                    {/* Remove single item button */}
                    {onDeleteHistoryItem && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistoryItem(item.hostname);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-0.5 rounded hover:bg-slate-700/60 transition-colors cursor-pointer"
                        title={t.removeSiteFromHistory}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
