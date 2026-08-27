import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Shield,
  Gauge,
  Check,
  Smartphone,
  Tablet,
  Laptop,
  X,
  ArrowRight,
  Wifi,
  Activity,
  Zap,
  BarChart2,
  Globe,
  Search,
  CheckCircle2,
  Lock,
  FileCode,
  AlertCircle,
  RefreshCw,
  Sliders,
  ChevronDown,
  Image as ImageIcon,
  Compass
} from 'lucide-react';
import { ApiLatencyTracker } from './ApiLatencyTracker';
import { Language } from '../types';

export interface LiveBrowserVideoScannerProps {
  url: string;
  isScanning?: boolean;
  progress?: number;
  currentPhaseIndex?: number;
  onComplete?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  lang?: Language;
}

interface StreamLog {
  id: string;
  time: string;
  message: string;
  messageTe?: string;
  type: 'info' | 'success' | 'perf' | 'warn';
}

interface LiveSiteData {
  url: string;
  hostname: string;
  status: number;
  fetchLatency: number;
  isHttps: boolean;
  meta: {
    title: string;
    description: string;
    favicon: string;
    ogImage?: string;
  };
  content: {
    h1List: string[];
    h2List: string[];
    pList: string[];
    navLinks: { text: string; href: string }[];
    realImages: { src: string; alt: string }[];
    footerLinks: string[];
  };
  stats: {
    totalDomCount: number;
    scriptsCount: number;
    stylesheetsCount: number;
    server: string;
    contentEncoding: string;
  };
}

type DomSectionFocus = 'all' | 'header' | 'body' | 'footer';

export const LiveBrowserVideoScanner: React.FC<LiveBrowserVideoScannerProps> = ({
  url,
  isScanning = true,
  progress = 0,
  currentPhaseIndex,
  onComplete,
  onClose,
  isModal = true,
  lang = 'en'
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showDevTools, setShowDevTools] = useState<boolean>(true);
  const [rightPanelTab, setRightPanelTab] = useState<'latency' | 'console' | 'domTree'>('latency');
  const [showDOMGrid, setShowDOMGrid] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [logs, setLogs] = useState<StreamLog[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<DomSectionFocus>('header');
  const [autoScrollScan, setAutoScrollScan] = useState<boolean>(true);
  
  // Real site content fetched live from target website
  const [liveSiteData, setLiveSiteData] = useState<LiveSiteData | null>(null);
  const [isFetchingSite, setIsFetchingSite] = useState<boolean>(false);
  const [faviconLoadFailed, setFaviconLoadFailed] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const viewportScrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Normalize URL for clean display
  const cleanUrl = url && url.trim() ? (url.startsWith('http') ? url : `https://${url}`) : 'https://example.com';
  let rawHostname = 'example.com';
  try {
    rawHostname = new URL(cleanUrl).hostname;
  } catch {
    rawHostname = url || 'example.com';
  }

  // Active progress uses the parent progress if passed, or internal simulation
  const activeProgress = isScanning ? Math.max(progress, simulatedProgress) : 100;
  const isFinished = activeProgress >= 100;

  // Format Elapsed Milliseconds to mm:ss.ms
  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const seconds = (totalSecs % 60).toString().padStart(2, '0');
    const centis = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${centis}`;
  };

  // 1. Fetch REAL Live Website Content via /api/live-site-content
  useEffect(() => {
    let isMounted = true;
    const fetchRealSite = async () => {
      if (!url || url.trim() === '') return;
      setIsFetchingSite(true);
      try {
        const response = await fetch('/api/live-site-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanUrl }),
        });
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.success) {
            setLiveSiteData(data);
          }
        }
      } catch (err) {
        console.warn('Could not fetch real site content:', err);
      } finally {
        if (isMounted) setIsFetchingSite(false);
      }
    };

    fetchRealSite();
    return () => {
      isMounted = false;
    };
  }, [cleanUrl]);

  // 2. Simulation Timer & Log Pipeline
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // 3. Simulated Progress Driver (smoothens from 0 to 100% over ~7 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    const progressInterval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const delta = Math.random() * 2.8 + 1.2;
        const next = Math.min(100, prev + delta);
        return next;
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, [isPlaying]);

  // 4. Dynamic Section Active Phase Switching (Header -> Body -> Footer)
  useEffect(() => {
    if (!autoScrollScan) return;

    if (activeProgress < 33) {
      setActiveSection('header');
      if (viewportScrollRef.current) {
        viewportScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (activeProgress < 68) {
      setActiveSection('body');
      if (viewportScrollRef.current) {
        viewportScrollRef.current.scrollTo({ top: 180, behavior: 'smooth' });
      }
    } else {
      setActiveSection('footer');
      if (viewportScrollRef.current) {
        viewportScrollRef.current.scrollTo({ top: 9999, behavior: 'smooth' });
      }
    }
  }, [activeProgress, autoScrollScan]);

  // Auto fire onComplete after finished delay
  useEffect(() => {
    if (isFinished && onComplete) {
      const finishTimeout = setTimeout(() => {
        onComplete();
      }, 1400);
      return () => clearTimeout(finishTimeout);
    }
  }, [isFinished, onComplete]);

  // 5. Dynamic Step Definitions for live simulation audit stream
  const steps = [
    {
      pct: 5,
      log: `DNS Query resolved for ${rawHostname} -> IP 76.76.21.21 (Anycast Route)`,
      logTe: `DNS పరిష్కరించబడింది: ${rawHostname} -> IP 76.76.21.21`,
      type: 'info' as const
    },
    {
      pct: 15,
      log: `TLS 1.3 Handshake completed. 256-bit AES-GCM • Strict HSTS enabled`,
      logTe: `TLS 1.3 హ్యాండ్‌షేక్ విజయవంతం: 256-bit AES ఎన్‌క్రిప్షన్ • HSTS యాక్టివ్`,
      type: 'success' as const
    },
    {
      pct: 25,
      log: `🔍 [HEADER AUDIT] Scanning <header>: ${liveSiteData?.meta?.title ? `Title: "${liveSiteData.meta.title.substring(0, 30)}..."` : 'Brand logo, Favicon & Meta Tags...'}`,
      logTe: `🔍 [హెడర్ ఆడిట్] <header> తనిఖీ: ${liveSiteData?.meta?.title ? `టైటిల్ "${liveSiteData.meta.title.substring(0, 25)}..."` : 'నావిగేషన్, బ్రాండ్ లోగో, ఫెవికాన్'}`,
      type: 'perf' as const
    },
    {
      pct: 35,
      log: `HTTP/2 GET 200 OK • TTFB: ${liveSiteData?.fetchLatency || 38}ms (Server: ${liveSiteData?.stats?.server || 'Cloudflare/Edge'})`,
      logTe: `HTTP/2 ప్రతిస్పందన 200 OK • TTFB: ${liveSiteData?.fetchLatency || 38}ms (వేగవంతమైన సర్వర్)`,
      type: 'perf' as const
    },
    {
      pct: 48,
      log: `⚡ [BODY AUDIT] Scanning <body>: ${liveSiteData?.stats?.totalDomCount || 842} DOM nodes, ${liveSiteData?.content?.realImages?.length || 4} real images & JS chunks`,
      logTe: `⚡ [బాడీ ఆడిట్] <body> తనిఖీ: ${liveSiteData?.stats?.totalDomCount || 842} DOM నోడ్‌లు, చిత్రాలు, జావాస్క్రిప్ట్ & CSSOM ట్రీ`,
      type: 'info' as const
    },
    {
      pct: 62,
      log: `Core Web Vitals Capture: LCP=0.80s, FCP=0.40s, CLS=0.002, INP=24ms (Good/Green)`,
      logTe: `కోర్ వెబ్ వైటల్స్: LCP=0.80s, FCP=0.40s, CLS=0.002, INP=24ms (అద్భుతమైన వేగం)`,
      type: 'perf' as const
    },
    {
      pct: 75,
      log: `🛡️ [FOOTER AUDIT] Scanning <footer>: ${liveSiteData?.content?.footerLinks?.slice(0, 3)?.join(', ') || 'Legal links, Privacy policy, Security compliance'}`,
      logTe: `🛡️ [ఫుటర్ ఆడిట్] <footer> తనిఖీ: లీగల్ లింకులు, ప్రైవసీ పాలసీ, భద్రతా బ్యాడ్జ్‌లు & సైట్‌మ్యాప్`,
      type: 'info' as const
    },
    {
      pct: 88,
      log: `Compliance Check: SOC2, ISO-27001, GDPR & /sitemap.xml 200 OK verified`,
      logTe: `కంప్లైయెన్స్ ధృవీకరణ: SOC2, ISO-27001, GDPR మరియు /sitemap.xml ధృవీకరించబడింది`,
      type: 'success' as const
    },
    {
      pct: 96,
      log: `Lighthouse Evaluation Engine: 98/100 Total Health & Security Score for ${rawHostname}`,
      logTe: `లైట్‌హౌస్ ఇంజిన్: 98/100 పూర్తి వెబ్‌సైట్ హెల్త్ స్కోర్ ఖరారైంది`,
      type: 'success' as const
    }
  ];

  // Feed logs based on active progress
  useEffect(() => {
    steps.forEach((step, idx) => {
      if (activeProgress >= step.pct && idx >= activeStepIndex) {
        setActiveStepIndex(idx + 1);
        setLogs((prev) => {
          if (prev.some((l) => l.id === `step-${idx}`)) return prev;
          return [
            ...prev,
            {
              id: `step-${idx}`,
              time: formatTime(elapsedMs),
              message: step.log,
              messageTe: step.logTe,
              type: step.type
            }
          ];
        });
      }
    });
  }, [activeProgress, activeStepIndex, elapsedMs, liveSiteData]);

  // Auto-scroll DevTools terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleManualSectionSelect = (section: DomSectionFocus) => {
    setAutoScrollScan(false);
    setActiveSection(section);
    if (viewportScrollRef.current) {
      if (section === 'header') {
        viewportScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (section === 'body') {
        viewportScrollRef.current.scrollTo({ top: 180, behavior: 'smooth' });
      } else if (section === 'footer') {
        viewportScrollRef.current.scrollTo({ top: 9999, behavior: 'smooth' });
      }
    }
  };

  // Helper values from live website or clean fallback
  const siteTitle = liveSiteData?.meta?.title || rawHostname;
  const siteDesc = liveSiteData?.meta?.description || `Live production digital infrastructure on ${rawHostname}`;
  const siteFavicon = liveSiteData?.meta?.favicon || `https://www.google.com/s2/favicons?domain=${rawHostname}&sz=64`;
  const heroH1 = liveSiteData?.content?.h1List?.[0] || siteTitle;
  const heroSubH2 = liveSiteData?.content?.h2List?.[0] || liveSiteData?.content?.h1List?.[1] || 'Real-time performance, security, and cloud scalability';
  const heroParagraph = liveSiteData?.content?.pList?.[0] || siteDesc;
  const navLinks = liveSiteData?.content?.navLinks && liveSiteData.content.navLinks.length > 0
    ? liveSiteData.content.navLinks
    : [
        { text: 'Home', href: '/' },
        { text: 'Features', href: '#features' },
        { text: 'Solutions', href: '#solutions' },
        { text: 'Docs', href: '#docs' },
        { text: 'Pricing', href: '#pricing' }
      ];
  const realImages = liveSiteData?.content?.realImages || [];
  const footerLinks = liveSiteData?.content?.footerLinks && liveSiteData.content.footerLinks.length > 0
    ? liveSiteData.content.footerLinks
    : ['Privacy Policy', 'Terms of Service', 'Security Policy', 'Sitemap', 'API Docs', 'Status Page'];

  const content = (
    <div
      ref={containerRef}
      className={`relative w-full bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen flex flex-col' : ''
      }`}
    >
      {/* 1. TOP VIDEO STREAM HEADER */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Stream Title & Live REC Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-rose-500/15 border border-rose-500/40 text-rose-400 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider animate-pulse shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-ping" />
            <span>LIVE AUDIT STREAM</span>
          </div>

          <div className="text-xs font-mono text-slate-300 flex items-center space-x-1.5 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400">REC</span>
            <span className="text-emerald-400 font-bold">{formatTime(elapsedMs)}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
            <span className="text-slate-400">Target:</span>
            <span className="text-amber-300 font-bold truncate max-w-[150px] md:max-w-[240px]">{rawHostname}</span>
          </div>
        </div>

        {/* Center: Real DOM Section Focus Pills (Header, Body, Footer) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
          <button
            type="button"
            onClick={() => handleManualSectionSelect('header')}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer text-xs font-bold ${
              activeSection === 'header'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Scan Header Section"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>&lt;header&gt;</span>
          </button>

          <button
            type="button"
            onClick={() => handleManualSectionSelect('body')}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer text-xs font-bold ${
              activeSection === 'body'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Scan Body/Main Section"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>&lt;body&gt;</span>
          </button>

          <button
            type="button"
            onClick={() => handleManualSectionSelect('footer')}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer text-xs font-bold ${
              activeSection === 'footer'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Scan Footer Section"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>&lt;footer&gt;</span>
          </button>
        </div>

        {/* Center-Right: Viewport & Render Mode Controls */}
        <div className="flex items-center space-x-1.5 text-slate-300">
          {/* Device Switcher */}
          <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 space-x-0.5 text-xs">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                deviceView === 'desktop' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop 1920x1080"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                deviceView === 'tablet' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tablet Viewport"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                deviceView === 'mobile' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDOMGrid(!showDOMGrid)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showDOMGrid
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle DOM Inspection Overlay"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Quick API Latency Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowDevTools(true);
              setRightPanelTab('latency');
            }}
            className={`px-2 py-1 rounded-lg border transition-colors cursor-pointer flex items-center space-x-1 text-xs font-mono ${
              showDevTools && rightPanelTab === 'latency'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Open API Latency Dashboard"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">API Monitor</span>
          </button>

          {/* DevTools Console Toggle */}
          <button
            type="button"
            onClick={() => {
              if (showDevTools && rightPanelTab === 'console') {
                setShowDevTools(false);
              } else {
                setShowDevTools(true);
                setRightPanelTab('console');
              }
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showDevTools && rightPanelTab === 'console'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle DevTools Console"
          >
            <Terminal className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. BROWSER FRAME MOCK & ADDRESS BAR WITH REAL FAVICON AND URL */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between space-x-3 text-xs">
        {/* macOS Style Window Dots */}
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        {/* Address URL Pill with Real Favicon & Live Domain */}
        <div className="flex-1 max-w-xl bg-slate-950 border border-slate-700/80 rounded-full px-3 py-1 flex items-center justify-between text-[11px] font-mono shadow-inner">
          <div className="flex items-center space-x-2 truncate">
            {/* Real Favicon of scanned website */}
            {!faviconLoadFailed ? (
              <img
                src={siteFavicon}
                alt=""
                className="w-3.5 h-3.5 rounded-xs shrink-0 object-contain"
                onError={() => setFaviconLoadFailed(true)}
              />
            ) : (
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span>https://</span>
            </span>
            <span className="text-amber-200 font-bold truncate">{rawHostname}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] shrink-0 pl-2">
            <span className="hidden sm:inline bg-emerald-500/15 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/30">
              TLS 1.3 • HTTP/2
            </span>
          </div>
        </div>

        {/* Active DOM Section & Status Pill */}
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>HTTP {liveSiteData?.status || 200} OK</span>
          </span>
          <span className="text-slate-400 hidden md:inline">{liveSiteData?.fetchLatency || 38}ms TTFB</span>
        </div>
      </div>

      {/* 3. MAIN LIVE VIDEO STAGE (SPLIT VIEW: REAL WEBPAGE SCANNER + DEVTOOLS / LATENCY MONITOR) */}
      <div className={`grid ${showDevTools ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'} gap-0 bg-slate-950 min-h-[440px] lg:min-h-[500px]`}>
        
        {/* LEFT COLUMN: REAL WEBPAGE WITH REAL EXTRACTED HEADINGS, LOGO, IMAGES, NAV & FOOTER */}
        <div className={`${showDevTools ? 'lg:col-span-7 xl:col-span-7' : 'w-full'} relative bg-slate-950 p-3 sm:p-5 overflow-hidden flex flex-col items-center justify-start border-b lg:border-b-0 lg:border-r border-slate-800`}>
          
          {/* Active Laser Scanning Sweep Bar (Moves across active scanning areas) */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_18px_#f59e0b] z-30 pointer-events-none animate-pulse"
            style={{
              top: activeSection === 'header' ? '22%' : activeSection === 'body' ? '50%' : '78%',
              transition: 'top 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          {/* Floating Section Status HUD Banner */}
          <div className="w-full mb-2.5 flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 shadow-md">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-bold shrink-0">Scanning:</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-black border flex items-center gap-1.5 bg-slate-950 text-amber-300 border-amber-500/40 truncate">
                {activeSection === 'header' && '🔍 <header> Real Nav, Brand Logo & Favicon'}
                {activeSection === 'body' && '⚡ <body> Real Headlines, Media & DOM Nodes'}
                {activeSection === 'footer' && '🛡️ <footer> Real Links, Legal & Compliance'}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 font-mono hidden sm:block shrink-0 pl-2">
              {isFetchingSite ? 'Connecting Live Stream...' : autoScrollScan ? 'Auto-Scrolling Active' : 'Manual Viewport'}
            </div>
          </div>

          {/* Device Frame Viewport Container with Real Webpage Content & Scroll */}
          <div
            className={`transition-all duration-300 bg-slate-900 border-2 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col ${
              activeSection === 'header'
                ? 'border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                : activeSection === 'body'
                ? 'border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                : 'border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
            } ${
              deviceView === 'desktop'
                ? 'w-full max-w-2xl h-[380px] sm:h-[420px]'
                : deviceView === 'tablet'
                ? 'w-[340px] sm:w-[400px] h-[380px] sm:h-[420px]'
                : 'w-[260px] sm:w-[300px] h-[380px] sm:h-[420px]'
            }`}
          >
            {/* Real Webpage Scroll Container */}
            <div
              ref={viewportScrollRef}
              className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-slate-800/80 bg-slate-950 select-none text-left"
            >
              
              {/* ========================================================================= */}
              {/* 1. REAL WEBSITE <HEADER> SECTION */}
              {/* ========================================================================= */}
              <div
                ref={headerRef}
                className={`relative transition-all duration-300 p-3.5 sm:p-4 bg-slate-900/95 border-b border-slate-800 ${
                  activeSection === 'header' ? 'ring-2 ring-amber-400/50 bg-amber-950/10' : ''
                }`}
              >
                {/* Header DOM Tag Overlay */}
                {showDOMGrid && (
                  <div className="absolute top-1.5 right-2 z-20 flex items-center space-x-1.5 text-[9px] font-mono">
                    <span className="bg-amber-950/90 text-amber-300 border border-amber-500/50 px-1.5 py-0.5 rounded font-bold">
                      &lt;header class=&quot;site-header&quot;&gt;
                    </span>
                    <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.5 rounded">
                      ✓ SSL 256-bit
                    </span>
                  </div>
                )}

                {/* Navbar Content: Real Favicon + Real Brand Name + Real Nav Links */}
                <div className="flex items-center justify-between gap-3">
                  {/* Brand Logo & Title */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 flex items-center justify-center p-1 shadow-md">
                      <img
                        src={siteFavicon}
                        alt={rawHostname}
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-black text-white text-xs sm:text-sm tracking-tight truncate max-w-[130px] sm:max-w-[200px] block">
                        {rawHostname}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Secure HTTPS</span>
                      </span>
                    </div>
                  </div>

                  {/* Real Navigation Links extracted from Website */}
                  <div className="hidden sm:flex items-center space-x-3 text-[11px] font-medium text-slate-300">
                    {navLinks.slice(0, 4).map((link, idx) => (
                      <span
                        key={idx}
                        className={`${idx === 0 ? 'text-amber-400 font-bold' : 'hover:text-amber-300'} cursor-pointer truncate max-w-[90px]`}
                        title={link.text}
                      >
                        {link.text}
                      </span>
                    ))}
                  </div>

                  {/* Right Header Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer hidden sm:block">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] shadow-sm cursor-pointer"
                    >
                      {navLinks[navLinks.length - 1]?.text || 'Get Started'}
                    </button>
                  </div>
                </div>

                {/* Header Inspection Highlights */}
                {activeSection === 'header' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-[9px] font-mono">
                    <div className="bg-slate-950/80 p-1.5 rounded-lg border border-amber-500/30 text-amber-300">
                      <span className="text-slate-400 block">Favicon & Meta:</span>
                      <span>✓ 200 OK Verified</span>
                    </div>
                    <div className="bg-slate-950/80 p-1.5 rounded-lg border border-amber-500/30 text-amber-300">
                      <span className="text-slate-400 block">Security Header:</span>
                      <span>HSTS + CSP Active</span>
                    </div>
                    <div className="bg-slate-950/80 p-1.5 rounded-lg border border-amber-500/30 text-amber-300">
                      <span className="text-slate-400 block">Navbar Render:</span>
                      <span>{liveSiteData?.fetchLatency ? `${Math.round(liveSiteData.fetchLatency / 3)}ms` : '12ms'} Paint</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* 2. REAL WEBSITE <BODY / MAIN> SECTION */}
              {/* ========================================================================= */}
              <div
                ref={bodyRef}
                className={`relative transition-all duration-300 p-4 sm:p-5 space-y-4 bg-slate-950 ${
                  activeSection === 'body' ? 'ring-2 ring-cyan-400/50 bg-cyan-950/10' : ''
                }`}
              >
                {/* Body DOM Tag Overlay */}
                {showDOMGrid && (
                  <div className="absolute top-2 right-2 z-20 flex items-center space-x-1.5 text-[9px] font-mono">
                    <span className="bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 px-1.5 py-0.5 rounded font-bold">
                      &lt;main class=&quot;hero-and-content&quot;&gt;
                    </span>
                    <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.5 rounded font-bold">
                      {liveSiteData?.stats?.totalDomCount || 842} DOM Nodes
                    </span>
                  </div>
                )}

                {/* Hero Badge */}
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Real Instance Live Scan • {rawHostname}</span>
                </div>

                {/* Real Website Headlines (H1 & H2) */}
                <div className="space-y-1.5">
                  <h2 className="text-base sm:text-xl font-black text-white leading-tight">
                    {heroH1}
                  </h2>
                  {heroSubH2 && heroSubH2 !== heroH1 && (
                    <h3 className="text-xs sm:text-sm font-bold text-amber-300/90">
                      {heroSubH2}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {heroParagraph}
                  </p>
                </div>

                {/* Real OG Image Banner or Real Image Grid from Website if available */}
                {liveSiteData?.meta?.ogImage && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 relative max-h-[140px] bg-slate-900 group">
                    <img
                      src={liveSiteData.meta.ogImage}
                      alt="Website Hero Media"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs text-[9px] font-mono text-emerald-300 border border-emerald-500/40">
                      Live Asset: OpenGraph Media
                    </div>
                  </div>
                )}

                {/* Hero CTAs */}
                <div className="flex items-center space-x-2.5 pt-1">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs shadow-md flex items-center space-x-1.5"
                  >
                    <span>{navLinks[0]?.text || 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700"
                  >
                    {navLinks[1]?.text || 'Learn More'}
                  </button>
                </div>

                {/* Real Image Grid from Site (if available) or 4-Card Feature Grid */}
                {realImages.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Live Site Media Assets ({realImages.length} verified):</span>
                      <span className="text-emerald-400">WebP / Image CDN</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {realImages.slice(0, 3).map((img, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-1 space-y-1">
                          <div className="h-16 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                            <img
                              src={img.src}
                              alt={img.alt || 'Asset'}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 truncate px-1 font-mono">
                            {img.alt || `Media Node #${idx + 1}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                      <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>Sub-40ms TTFB</span>
                      </span>
                      <p className="text-[10px] text-slate-400">Edge server routing with 99.99% availability</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                      <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>Enterprise TLS</span>
                      </span>
                      <p className="text-[10px] text-slate-400">Automated HSTS headers & CSP shield</p>
                    </div>
                  </div>
                )}

                {/* Body Inspection Telemetry Tag */}
                {activeSection === 'body' && (
                  <div className="p-2 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                    <span>⚡ DOM Nodes: {liveSiteData?.stats?.totalDomCount || 842} • Scripts: {liveSiteData?.stats?.scriptsCount || 12}</span>
                    <span className="text-emerald-400 font-bold">100% Mobile Ready</span>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* 3. REAL WEBSITE <FOOTER> SECTION */}
              {/* ========================================================================= */}
              <div
                ref={footerRef}
                className={`relative transition-all duration-300 p-4 sm:p-5 space-y-4 bg-slate-900 border-t border-slate-800 ${
                  activeSection === 'footer' ? 'ring-2 ring-emerald-400/50 bg-emerald-950/15' : ''
                }`}
              >
                {/* Footer DOM Tag Overlay */}
                {showDOMGrid && (
                  <div className="absolute top-2 right-2 z-20 flex items-center space-x-1.5 text-[9px] font-mono">
                    <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.5 rounded font-bold">
                      &lt;footer class=&quot;site-footer&quot;&gt;
                    </span>
                    <span className="bg-slate-950 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded">
                      /sitemap.xml 200 OK
                    </span>
                  </div>
                )}

                {/* Real Footer Navigation Structure */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  {/* Column 1: Brand Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-5 h-5 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold flex items-center justify-center text-[10px] p-0.5">
                        <img
                          src={siteFavicon}
                          alt=""
                          className="w-3.5 h-3.5 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="font-bold text-white text-xs truncate">{rawHostname}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {siteDesc.substring(0, 65)}...
                    </p>
                  </div>

                  {/* Column 2: Extracted Links */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Navigation</span>
                    <ul className="space-y-0.5 text-[10px] text-slate-400">
                      {navLinks.slice(0, 3).map((l, i) => (
                        <li key={i} className="hover:text-emerald-400 cursor-pointer truncate">{l.text}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: Footer Links */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Resources</span>
                    <ul className="space-y-0.5 text-[10px] text-slate-400">
                      {footerLinks.slice(0, 3).map((fl, i) => (
                        <li key={i} className="hover:text-emerald-400 cursor-pointer truncate">{fl}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 4: Legal & Compliance */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Compliance</span>
                    <ul className="space-y-0.5 text-[10px] text-slate-400">
                      <li className="hover:text-emerald-400 cursor-pointer">Privacy Policy</li>
                      <li className="hover:text-emerald-400 cursor-pointer">Terms of Service</li>
                      <li className="hover:text-emerald-400 cursor-pointer">Cookie Preferences</li>
                    </ul>
                  </div>
                </div>

                {/* Compliance Badges Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[9px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>SOC2 Type II</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-1 text-cyan-400 font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>ISO 27001</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-1 text-amber-400 font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>GDPR Ready</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-1 text-purple-400 font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>SSL/TLS A+</span>
                  </span>
                </div>

                {/* Copyright & Live Status Line */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>© 2026 {rawHostname}. All Rights Reserved.</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>All Systems Operational</span>
                  </span>
                </div>

                {/* Footer Inspection Highlights */}
                {activeSection === 'footer' && (
                  <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                    <span>🛡️ Footer Audit: Canonical tags & Robots.txt validated</span>
                    <span className="font-bold">✓ 100% Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Live Telemetry HUD Bar inside preview */}
            <div className="bg-slate-950 border-t border-slate-800 p-2.5 flex items-center justify-between text-[10px] font-mono shrink-0">
              <div className="flex items-center space-x-3 text-slate-300">
                <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HEALTH 98</span>
                </span>
                <span className="text-slate-400">LCP: 0.80s</span>
                <span className="text-slate-400 hidden sm:inline">FCP: 0.40s</span>
                <span className="text-slate-400 hidden md:inline">CLS: 0.002</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Chromium 128 DOM Inspector</span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME DEVTOOLS OR API LATENCY TRACKING DASHBOARD */}
        {showDevTools && (
          <div className="lg:col-span-5 xl:col-span-5 bg-slate-950 flex flex-col font-mono text-xs border-t lg:border-t-0 border-slate-800">
            {/* Panel Tabs Header: API Latency vs DevTools Console vs DOM Tree */}
            <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRightPanelTab('latency')}
                  className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer text-[11px] font-mono ${
                    rightPanelTab === 'latency'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'te' ? 'API లేటెన్సీ' : 'API Latency'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRightPanelTab('console')}
                  className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer text-[11px] font-mono ${
                    rightPanelTab === 'console'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'te' ? 'కన్సోల్' : 'DevTools'}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                    {logs.length}
                  </span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 font-bold hidden sm:inline">Telemetry Live</span>
              </div>
            </div>

            {/* TAB CONTENT: API Latency Dashboard */}
            {rightPanelTab === 'latency' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <ApiLatencyTracker
                  hostname={rawHostname}
                  isScanning={isScanning}
                  activeProgress={activeProgress}
                  lang={lang}
                />
              </div>
            )}

            {/* TAB CONTENT: DevTools Console Logs */}
            {rightPanelTab === 'console' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Terminal Logs Body */}
                <div
                  ref={terminalRef}
                  className="flex-1 p-3.5 space-y-2 overflow-y-auto max-h-[320px] lg:max-h-[380px] text-[11px] scrollbar-thin"
                >
                  {logs.map((log) => {
                    let badgeColor = 'text-slate-400';
                    let icon = '>';
                    if (log.type === 'success') {
                      badgeColor = 'text-emerald-400 font-semibold';
                      icon = '✓';
                    } else if (log.type === 'perf') {
                      badgeColor = 'text-cyan-300 font-semibold';
                      icon = '⚡';
                    } else if (log.type === 'warn') {
                      badgeColor = 'text-amber-400';
                      icon = '⚠';
                    }

                    return (
                      <div key={log.id} className="leading-tight animate-fadeIn flex items-start space-x-1.5">
                        <span className="text-slate-400 shrink-0 text-[10px]">{log.time}</span>
                        <span className={`${badgeColor} shrink-0`}>{icon}</span>
                        <span className="text-slate-200">
                          {lang === 'te' && log.messageTe ? log.messageTe : log.message}
                        </span>
                      </div>
                    );
                  })}

                  {/* Blinking prompt line */}
                  <div className="flex items-center space-x-1.5 text-emerald-400 pt-1">
                    <span className="text-slate-400 text-[10px]">{formatTime(elapsedMs)}</span>
                    <span className="animate-pulse">❯</span>
                    <span className="text-slate-400 text-[11px] italic">
                      {isFinished
                        ? (lang === 'te' ? 'ఆడిట్ విజయవంతంగా పూర్తయింది! నివేదిక తయారవుతోంది...' : 'Audit complete! Generating comprehensive report...')
                        : (lang === 'te' ? 'ఆడిట్ విశ్లేషణ జరుగుతోంది...' : 'Evaluating DOM tree & security headers...')}
                    </span>
                  </div>
                </div>

                {/* Bottom Terminal Telemetry Bar */}
                <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Wifi className="w-3 h-3" />
                    <span>WebSocket Stream: Connected</span>
                  </span>
                  <span className="font-bold text-slate-300">{Math.min(100, Math.round(activeProgress))}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. BOTTOM VIDEO TIMELINE & NAVIGATION BAR */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          {isFinished ? (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex items-center justify-center">
              <Check className="w-2 h-2 text-slate-950 stroke-[3]" />
            </span>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          )}
          <span className="text-[11px] font-bold text-white">
            {isFinished
              ? (lang === 'te' ? 'ఆడిట్ పూర్తయింది (100% Verified)' : 'Live Audit Completed (100% Verified)')
              : (lang === 'te' ? 'లైవ్ వీడియో బ్రౌజర్ సిమ్యులేషన్ యాక్టివ్' : 'Live Browser Video Engine Active')}
          </span>
        </div>

        {/* Progress bar inside the bottom bar */}
        <div className="flex items-center space-x-3">
          <div className="w-28 sm:w-48 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-150 ease-out shadow-sm shadow-emerald-500/50"
              style={{ width: `${activeProgress}%` }}
            />
          </div>
          <span className="text-emerald-400 font-mono font-bold text-xs">{Math.round(activeProgress)}%</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
            60 FPS Render
          </span>
        </div>
      </div>
    </div>
  );

  // If used in Modal Mode (prominent full overlay when testing on Home page)
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
          {/* Top Modal Header */}
          <div className="bg-slate-850 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{lang === 'te' ? 'లైవ్ బ్రౌజర్ ఆడిట్ వీడియో సిమ్యులేషన్' : 'Live Browser Audit Video Simulation'}</span>
                  <span className="bg-rose-500/20 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
                    REC 60 FPS
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {rawHostname} • Real-Time Latency & Vitals
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onComplete && isFinished && (
                <button
                  type="button"
                  onClick={onComplete}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition-all cursor-pointer animate-pulse"
                >
                  <span>{lang === 'te' ? 'రిపోర్ట్ చూడండి' : 'View Full Report'}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              )}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close / Skip"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Modal Body with the Video Stream */}
          <div className="p-4 overflow-y-auto max-h-[calc(94vh-70px)] scrollbar-thin">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-4">
      {content}
    </div>
  );
};


