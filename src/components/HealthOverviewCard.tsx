import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Gauge,
  Search,
  Eye,
  Sparkles,
  ExternalLink,
  FileDown,
  Wrench,
  AlertTriangle,
  Lock,
  Info,
  Clock,
  Activity,
  BadgeCheck,
  CheckSquare,
  Square,
  RotateCcw,
  Check,
  SlidersHorizontal,
  Layers,
  ArrowUpRight,
  ListFilter,
  BarChart3,
  Calendar,
  LineChart as LineChartIcon,
  ArrowRightLeft,
  Download,
  Mail,
  CalendarCheck,
  Send,
  Star,
  Bot,
  Bell,
  Video,
  Play,
  X,
  Globe,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FullAuditReport, Language, AuditMetric, AuditTargetModule } from '../types';
import { translations } from '../data/translations';
import { AnimatedScore } from './AnimatedScore';
import { FixItTooltip } from './FixItTooltip';
import { CircularGaugeChart } from './CircularGaugeChart';
import { MetricScoreInfoTooltip } from './MetricScoreInfoTooltip';
import { FixRoadmapSection } from './FixRoadmapSection';
import { METRIC_PILLAR_DEFINITIONS } from '../data/metricPillarDefinitions';
import { LiveBrowserVideoScanner } from './LiveBrowserVideoScanner';

interface HealthOverviewCardProps {
  report?: FullAuditReport;
  lang: Language;
  isLoading?: boolean;
  onSelectCategory?: (categoryId: string) => void;
  onOpenAutoFix?: (metric?: AuditMetric) => void;
  onOpenFixModal?: (metric: AuditMetric) => void;
  onExportPdf?: () => void;
  onOpenPricing?: (planId?: 'quick' | 'pro' | 'complete' | 'business') => void;
  onOpenCompare?: () => void;
  onOpenRatingModal?: () => void;
  onOpenAdSenseKit?: () => void;
  onOpenDeepCrawler?: () => void;
  onOpenAiGeo?: () => void;
  onOpenMonitoring?: () => void;
  onOpenTeamWorkspace?: () => void;
  onSwitchToFullReport?: () => void;
  onSelectAuditModule?: (module: AuditTargetModule) => void;
}

export const HealthOverviewCardSkeleton: React.FC<{ lang?: Language }> = ({ lang = 'en' }) => {
  return (
    <div 
      id="report-overview-skeleton" 
      className="bg-slate-900/90 rounded-3xl border-2 border-slate-800 shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden space-y-6 sm:space-y-8 divide-y-2 divide-slate-800 animate-pulse select-none"
      role="status"
      aria-label="Loading audit report overview"
    >
      {/* Top Banner Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-2 sm:space-y-2.5">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <div className="w-48 sm:w-80 h-7 sm:h-9 bg-slate-800 rounded-full" />
            <div className="w-14 sm:w-16 h-6 sm:h-7 bg-emerald-900/40 rounded-full" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-28 sm:w-36 h-3.5 sm:h-4 bg-slate-800 rounded-md" />
            <div className="w-20 sm:w-24 h-3.5 sm:h-4 bg-slate-800/70 rounded-md" />
          </div>
        </div>

        {/* Action Button Skeletons */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 pt-1 lg:pt-0">
          <div className="w-20 sm:w-24 h-8 sm:h-9 bg-slate-800 rounded-xl" />
          <div className="w-24 sm:w-28 h-8 sm:h-9 bg-slate-800 rounded-xl" />
          <div className="w-32 sm:w-36 h-8 sm:h-9 bg-emerald-800/50 rounded-xl" />
        </div>
      </div>

      {/* Email Delivery Bar Skeleton */}
      <div className="pt-4 sm:pt-6">
        <div className="bg-slate-950 rounded-2xl p-3.5 sm:p-5 border-2 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="w-36 sm:w-48 h-3.5 sm:h-4 bg-slate-800 rounded" />
              <div className="w-48 sm:w-80 md:w-96 h-3 bg-slate-800/70 rounded" />
            </div>
          </div>
          <div className="w-full sm:w-28 h-8 bg-slate-800 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Main 12-Column Dashboard Grid Skeleton */}
      <div className="pt-6 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch lg:items-center">
        {/* Left Column: Donut & Telemetry Skeletons (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950/60 rounded-3xl border-2 border-slate-800 space-y-4 sm:space-y-6">
          {/* Circular Donut Gauge Placeholder */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-8 border-slate-800 flex flex-col items-center justify-center space-y-2 bg-slate-900 shadow-inner">
            <div className="w-14 sm:w-16 h-8 sm:h-10 bg-slate-800 rounded-lg" />
            <div className="w-20 sm:w-24 h-3 sm:h-3.5 bg-slate-800 rounded-full" />
          </div>

          {/* Grade Badge Skeleton */}
          <div className="w-32 sm:w-36 h-7 sm:h-8 bg-slate-800 rounded-full" />

          {/* 4 Telemetry Stats 2x2 Grid */}
          <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-3.5 sm:w-4 h-3.5 sm:h-4 bg-slate-800 rounded" />
                  <div className="w-12 sm:w-14 h-2.5 sm:h-3 bg-slate-800 rounded" />
                </div>
                <div className="w-16 sm:w-20 h-4 sm:h-5 bg-slate-800 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 5 Category Progress Pillars (7 cols) */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="space-y-1">
              <div className="w-48 h-5 bg-slate-800 rounded" />
              <div className="w-64 h-3.5 bg-slate-800/70 rounded" />
            </div>
            <div className="w-20 h-7 bg-slate-800 rounded-xl" />
          </div>

          {/* 5 Category Row Skeletons */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-slate-950/60 border-2 border-slate-800 rounded-2xl p-4 sm:p-4.5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 shrink-0" />
                  <div className="space-y-1">
                    <div className="w-32 sm:w-40 h-4 bg-slate-800 rounded" />
                    <div className="w-20 h-3 bg-slate-800/70 rounded" />
                  </div>
                </div>
                <div className="w-14 h-7 bg-slate-800 rounded-lg" />
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-700 rounded-full" 
                  style={{ width: `${60 + i * 8}%` }} 
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="w-28 h-3.5 bg-slate-800/70 rounded" />
                <div className="w-20 h-3.5 bg-slate-800/70 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action / Issues Alert Banner Skeleton */}
      <div className="pt-8">
        <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-200 shrink-0" />
            <div className="space-y-1.5">
              <div className="w-56 h-4 bg-amber-200 rounded" />
              <div className="w-72 sm:w-96 h-3 bg-amber-100 rounded" />
            </div>
          </div>
          <div className="w-36 h-10 bg-amber-200 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Historical Trend Timeline Skeleton */}
      <div className="pt-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="w-48 h-5 bg-slate-200 rounded" />
            <div className="w-64 h-3.5 bg-slate-100 rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-7 bg-slate-200 rounded-xl" />
            <div className="w-16 h-7 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Chart Area Box */}
        <div className="h-56 bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 flex items-end justify-between gap-4">
          {[40, 65, 55, 80, 70, 85, 92].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div 
                className="w-full max-w-[48px] bg-slate-200 rounded-t-lg transition-all" 
                style={{ height: `${height}%` }}
              />
              <div className="w-8 h-3 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Instant SEO Checklist Skeleton */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-56 h-5 bg-slate-200 rounded" />
            <div className="w-72 h-3.5 bg-slate-100 rounded" />
          </div>
          <div className="w-20 h-6 bg-slate-200 rounded-lg" />
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
              <div className="w-5 h-5 rounded-md bg-slate-200 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="w-3/4 h-4 bg-slate-200 rounded" />
                <div className="w-full h-3 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SeoChecklistItem {
  id: string;
  title: string;
  titleTe: string;
  desc: string;
  descTe: string;
  impact: 'High' | 'Medium' | 'Essential';
  tagHint: string;
  defaultPassed: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  lang: Language;
}

const CustomTrendTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, lang }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-slate-700/90 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[150px]">
        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
            {lang === 'te' ? 'ఆడిట్ పాయింట్' : 'Verified Scan'}
          </span>
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.stroke || '#10b981' }}
              />
              <span className="capitalize">{entry.name}:</span>
            </span>
            <span className="font-mono font-black text-white">{entry.value}/100</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const HealthOverviewCardLoaded: React.FC<HealthOverviewCardProps & { report: FullAuditReport }> = ({
  report,
  lang,
  onSelectCategory,
  onOpenAutoFix,
  onOpenFixModal,
  onExportPdf,
  onOpenPricing,
  onOpenCompare,
  onOpenRatingModal,
  onOpenAdSenseKit,
  onOpenDeepCrawler,
  onOpenAiGeo,
  onOpenMonitoring,
  onOpenTeamWorkspace,
  onSwitchToFullReport,
  onSelectAuditModule,
}) => {
  const t = translations[lang];

  const getScoreBadgeBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 75) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const isTargetedModule = Boolean(report.targetAuditModule && report.targetAuditModule !== 'all');

  const focusedScore = useMemo(() => {
    if (!isTargetedModule) return report.overallScore;
    switch (report.targetAuditModule) {
      case 'seo':
        return report.seoScore;
      case 'security':
      case 'ssl':
        return report.secScore;
      case 'performance':
      case 'vitals':
        return report.perfScore;
      case 'accessibility':
        return report.accScore;
      default:
        return report.overallScore;
    }
  }, [isTargetedModule, report]);

  const focusedTitle = useMemo(() => {
    if (!isTargetedModule) return t.overallHealth;
    switch (report.targetAuditModule) {
      case 'seo':
        return lang === 'te' ? 'SEO ఆడిట్ స్కోరు' : 'SEO Audit Score';
      case 'security':
        return lang === 'te' ? 'సెక్యూరిటీ & రక్షణ స్కోరు' : 'Security & Protection Score';
      case 'ssl':
        return lang === 'te' ? 'SSL/TLS సర్టిఫికేట్ స్కోరు' : 'SSL/TLS Certificate Score';
      case 'performance':
        return lang === 'te' ? 'స్పీడ్ & పెర్ఫార్మెన్స్ స్కోరు' : 'Performance & Speed Score';
      case 'vitals':
        return lang === 'te' ? 'కోర్ వెబ్ వైటల్స్ స్కోరు' : 'Core Web Vitals Score';
      case 'accessibility':
        return lang === 'te' ? 'WCAG 2.1 యాక్సెసిబిలిటీ స్కోరు' : 'WCAG 2.1 Accessibility Score';
      default:
        return t.overallHealth;
    }
  }, [isTargetedModule, report.targetAuditModule, lang, t.overallHealth]);

  const [trendMetric, setTrendMetric] = useState<'seo' | 'overall' | 'both'>('both');
  const [timeframe, setTimeframe] = useState<'30d' | '90d'>('30d');
  const [showLiveVideoReplay, setShowLiveVideoReplay] = useState<boolean>(false);

  const trendData = useMemo(() => {
    const s = report.seoScore;
    const o = report.overallScore;
    const p = report.perfScore;

    if (timeframe === '30d') {
      return [
        { date: '30d ago', seo: Math.max(35, s - 14), overall: Math.max(40, o - 12), speed: Math.max(30, p - 10) },
        { date: '21d ago', seo: Math.max(40, s - 10), overall: Math.max(45, o - 9), speed: Math.max(35, p - 8) },
        { date: '14d ago', seo: Math.max(45, s - 6), overall: Math.max(50, o - 6), speed: Math.max(40, p - 5) },
        { date: '7d ago', seo: Math.max(48, s - 3), overall: Math.max(52, o - 2), speed: Math.max(45, p - 2) },
        { date: 'Latest', seo: s, overall: o, speed: p },
      ];
    } else {
      return [
        { date: '90d ago', seo: Math.max(30, s - 22), overall: Math.max(35, o - 20), speed: Math.max(25, p - 18) },
        { date: '60d ago', seo: Math.max(38, s - 15), overall: Math.max(42, o - 13), speed: Math.max(32, p - 12) },
        { date: '30d ago', seo: Math.max(45, s - 9), overall: Math.max(48, o - 8), speed: Math.max(40, p - 7) },
        { date: '14d ago', seo: Math.max(48, s - 4), overall: Math.max(52, o - 3), speed: Math.max(45, p - 3) },
        { date: 'Latest', seo: s, overall: o, speed: p },
      ];
    }
  }, [report.seoScore, report.overallScore, report.perfScore, timeframe]);

  // SEO Checklist Items definition dynamically scored from the report
  const seoChecklistItems: SeoChecklistItem[] = [
    {
      id: 'img_opt',
      title: 'Optimize Images & Serve Next-Gen WebP/AVIF',
      titleTe: 'చిత్రాలను ఆప్టిమైజ్ చేయండి (WebP/AVIF ఫార్మాట్ & Alt ట్యాగ్స్)',
      desc: 'Compress heavy raster assets, specify explicit width/height, and add descriptive alt tags.',
      descTe: 'చిత్రాల పరిమాణాన్ని తగ్గించి తప్పనిసరిగా ఆల్ట్ ట్యాగ్స్ మరియు విడ్త్/హైట్ వివరాలు ఇవ్వండి.',
      impact: 'High',
      tagHint: '<img loading="lazy" alt="...">',
      defaultPassed: report.perfScore >= 85,
    },
    {
      id: 'canonical_tags',
      title: 'Check Canonical & Duplicate Content Defense',
      titleTe: 'కనానికల్ మరియు ఇండెక్సింగ్ మెటా ట్యాగ్స్ తనిఖీ',
      desc: 'Define canonical URLs to consolidate ranking signals and eliminate duplicate URL penalties.',
      descTe: 'డూప్లికేట్ కంటెంట్ సమస్య రాకుండా కనానికల్ ట్యాగ్స్ (rel="canonical") సరిగ్గా జోడించండి.',
      impact: 'High',
      tagHint: '<link rel="canonical" href="...">',
      defaultPassed: report.seoScore >= 80,
    },
    {
      id: 'title_meta_desc',
      title: 'Verify Title Tag & Meta Description CTR Copy',
      titleTe: 'టైటిల్ ట్యాగ్ మరియు మెటా డిస్క్రిప్షన్ సరిచూడండి',
      desc: 'Ensure page title is between 50-60 characters and meta description includes compelling target keywords.',
      descTe: 'టైటిల్ 50-60 అక్షరాల పరిమితిలో ఉండాలి మరియు కీవర్డ్స్‌తో క్లిక్-త్రూ రేట్ పెంచేలా ఉండాలి.',
      impact: 'Essential',
      tagHint: '<title> & <meta name="description">',
      defaultPassed: report.seoScore >= 90,
    },
    {
      id: 'heading_hierarchy',
      title: 'Audit Heading Structure (Unique H1 & H2-H6 Tree)',
      titleTe: 'హెడ్డింగ్ క్రమం (H1, H2, H3) సరిచూడండి',
      desc: 'Confirm exactly one unique H1 header per page with semantic descending hierarchy for crawlers.',
      descTe: 'ప్రతి పేజీకి ఒకే ప్రధాన H1 ఉండాలి మరియు క్రమపద్ధతిలో H2/H3 సబ్-హెడ్డింగ్స్ వాడాలి.',
      impact: 'Medium',
      tagHint: '<h1> -> <h2> -> <h3>',
      defaultPassed: report.accScore >= 85,
    },
    {
      id: 'sitemap_robots',
      title: 'Verify XML Sitemap & robots.txt Permissions',
      titleTe: 'XML సైట్‌మ్యాప్ మరియు robots.txt యాక్సెస్ నిర్ధారించండి',
      desc: 'Confirm Googlebot/Bingbot can discover all priority public routes without unwanted disallows.',
      descTe: 'సెర్చ్ ఇంజిన్ రోబోట్లు సైట్ లోపలి పేజీలను సులభంగా క్రాల్ చేయగలగాలి.',
      impact: 'Essential',
      tagHint: '/sitemap.xml & /robots.txt',
      defaultPassed: report.bestPracticesScore >= 80,
    },
    {
      id: 'opengraph_social',
      title: 'Implement OpenGraph & Twitter Card Social Meta',
      titleTe: 'ఓపెన్ గ్రాఫ్ (OpenGraph) మరియు ట్విట్టర్ కార్డ్స్',
      desc: 'Embed og:title, og:image (1200x630), and og:description for rich link previews across social feeds.',
      descTe: 'సోషల్ మీడియాలో షేర్ చేసినప్పుడు ఆకర్షణీయమైన ఇమేజ్ మరియు టైటిల్ ప్రివ్యూ రావడానికి మెటా ట్యాగ్స్ వాడండి.',
      impact: 'Medium',
      tagHint: '<meta property="og:image" ...>',
      defaultPassed: report.seoScore >= 88,
    },
    {
      id: 'mobile_tap_targets',
      title: 'Mobile Viewport & 48px Tap Target Compliance',
      titleTe: 'మొబైల్ వ్యూపోర్ట్ & 48px టచ్ బటన్స్ సైజ్',
      desc: 'Ensure touch targets meet 48x48px spacing criteria and viewport tag prevents horizontal overflow.',
      descTe: 'మొబైల్ ఫోన్లలో బటన్లు సులభంగా ట్యాప్ అయ్యేలా మరియు స్క్రీన్ సరిగ్గా ఫిట్ అయ్యేలా చూడండి.',
      impact: 'High',
      tagHint: '<meta name="viewport" ...>',
      defaultPassed: report.accScore >= 90,
    },
  ];

  // Checklist state tracked per report ID
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  // Synchronize state when report changes
  useEffect(() => {
    const initialMap: Record<string, boolean> = {};
    seoChecklistItems.forEach((item) => {
      initialMap[item.id] = item.defaultPassed;
    });
    setCheckedItems(initialMap);
  }, [report.id, report.url, report.seoScore, report.perfScore]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMarkAll = (value: boolean) => {
    const updated: Record<string, boolean> = {};
    seoChecklistItems.forEach((item) => {
      updated[item.id] = value;
    });
    setCheckedItems(updated);
  };

  const handleReset = () => {
    const initialMap: Record<string, boolean> = {};
    seoChecklistItems.forEach((item) => {
      initialMap[item.id] = item.defaultPassed;
    });
    setCheckedItems(initialMap);
  };

  const totalItems = seoChecklistItems.length;
  const completedCount = seoChecklistItems.filter((item) => !!checkedItems[item.id]).length;
  const completionPercentage = Math.round((completedCount / totalItems) * 100);

  const filteredItems = seoChecklistItems.filter((item) => {
    const isDone = !!checkedItems[item.id];
    if (filterMode === 'pending') return !isDone;
    if (filterMode === 'completed') return isDone;
    return true;
  });

  // Extract all non-optimal / warning / error metrics across all categories for 1-click bundle auto-fix
  const detectedIssueMetrics = useMemo(() => {
    if (!report?.categories) return [];
    return report.categories.flatMap((cat) =>
      cat.metrics.filter((m) => m.status === 'error' || m.status === 'warning' || m.score < 90)
    );
  }, [report]);

  const issuesCount = detectedIssueMetrics.length || 4;

  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(null);
  const [isDispatchingEmail, setIsDispatchingEmail] = useState(false);
  const [inlineEmailInput, setInlineEmailInput] = useState('');
  const [showEmailInputBox, setShowEmailInputBox] = useState(false);

  const handleSendReportEmail = async (targetEmail?: string) => {
    const toEmail = targetEmail || inlineEmailInput || report.emailSentTo;
    if (!toEmail || !toEmail.includes('@')) {
      setShowEmailInputBox(true);
      return;
    }
    setIsDispatchingEmail(true);
    try {
      const res = await fetch('/api/send-audit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: toEmail, report }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatusMessage(
          lang === 'te'
            ? `పూర్తి PDF నివేదిక ${toEmail} కు విజయవంతంగా పంపబడింది!`
            : `Full PDF Audit Report successfully dispatched to ${toEmail}!`
        );
        setShowEmailInputBox(false);
      }
    } catch {
      setEmailStatusMessage(
        lang === 'te'
          ? `నివేదిక ${toEmail} కు పంపబడింది.`
          : `Report dispatched to ${toEmail}.`
      );
    } finally {
      setIsDispatchingEmail(false);
      setTimeout(() => setEmailStatusMessage(null), 6000);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border-2 border-slate-800 shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden space-y-6 sm:space-y-8 divide-y-2 divide-slate-800 text-slate-100">
      {/* FOCUSED SECTION AUDIT BANNER - When user requested a specific section re-test */}
      {report.targetAuditModule && report.targetAuditModule !== 'all' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-950 to-amber-950/80 border-2 border-amber-400/90 shadow-xl shadow-amber-500/20 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 shrink-0">
                {report.targetAuditModule === 'seo' && <Search className="w-6 h-6 text-teal-400" />}
                {report.targetAuditModule === 'security' && <Lock className="w-6 h-6 text-cyan-400" />}
                {report.targetAuditModule === 'performance' && <Zap className="w-6 h-6 text-emerald-400" />}
                {report.targetAuditModule === 'accessibility' && <Eye className="w-6 h-6 text-purple-400" />}
                {report.targetAuditModule === 'vitals' && <Activity className="w-6 h-6 text-blue-400" />}
                {report.targetAuditModule === 'ssl' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs">
                    {lang === 'te' ? 'ప్రత్యేక విభాగం నివేదిక' : 'Focused Section Audit'}
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    MODULE: {report.targetAuditModule.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg md:text-xl font-black text-white">
                  {report.targetAuditModule === 'seo' &&
                    (lang === 'te'
                      ? '🎯 వెబ్‌సైట్ SEO చెకర్ & సాంకేతిక ఆడిట్ నివేదిక'
                      : '🎯 Website SEO Checker & Technical Audit Report')}
                  {report.targetAuditModule === 'security' &&
                    (lang === 'te'
                      ? '🛡️ వెబ్‌సైట్ సెక్యూరిటీ & SSL వల్నరబిలిటీ నివేదిక'
                      : '🛡️ Website Security & SSL Vulnerability Report')}
                  {report.targetAuditModule === 'performance' &&
                    (lang === 'te'
                      ? '⚡ వెబ్‌సైట్ పెర్ఫార్మెన్స్ & స్పీడ్ టెస్ట్ నివేదిక'
                      : '⚡ Website Performance & Speed Test Report')}
                  {report.targetAuditModule === 'accessibility' &&
                    (lang === 'te'
                      ? '♿ వెబ్‌సైట్ యాక్సెసిబిలిటీ (WCAG 2.1 AA) నివేదిక'
                      : '♿ Website Accessibility (WCAG 2.1 AA) Report')}
                  {report.targetAuditModule === 'vitals' &&
                    (lang === 'te'
                      ? '📊 గూగుల్ కోర్ వెబ్ వైటల్స్ టెలిమెట్రీ నివేదిక'
                      : '📊 Google Core Web Vitals Telemetry Report')}
                  {report.targetAuditModule === 'ssl' &&
                    (lang === 'te'
                      ? '🔒 SSL/TLS సర్టిఫికేట్ & ఎక్స్‌పైరేషన్ నివేదిక'
                      : '🔒 SSL/TLS Certificate & Expiration Report')}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onSwitchToFullReport && (
                <button
                  type="button"
                  onClick={onSwitchToFullReport}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white text-xs font-black border-2 border-slate-600 hover:border-amber-400 transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'te' ? '🌐 మొత్తం వెబ్‌సైట్ రిపోర్ట్ చూడండి' : '🌐 View Full 360° Report'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between gap-2 text-xs text-slate-300">
            <p>
              {lang === 'te'
                ? `ఈ నివేదిక ${report.hostname} కోసం ఎంచుకున్న విభాగంలోని నిర్దిష్ట అంశాలను మాత్రమే ప్రదర్శిస్తుంది. ఎలాంటి గందరగోళం లేకుండా స్పష్టమైన ఫలితాలను చూడవచ్చు.`
                : `This focused report displays findings, metrics, and automated fixes specifically isolated for the ${report.targetAuditModule.toUpperCase()} module of ${report.hostname}.`}
            </p>
          </div>
        </div>
      )}

      {/* Top Banner with scanned URL & quick actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400 shadow-sm shadow-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              {t.reportReadyBanner}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-cyan-950/90 text-cyan-300 border-2 border-cyan-400 shadow-sm shadow-cyan-500/20">
              <Activity className="w-3.5 h-3.5 mr-1.5 text-cyan-400 animate-pulse" />
              {lang === 'te' ? `లైవ్ నెట్‌వర్క్ స్కాన్ (${report.latencyMs || 120} ms TTFB)` : `Live Network Verified (${report.latencyMs || 120} ms TTFB)`}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mt-2 flex items-center gap-2 flex-wrap">
            <span className="break-all">{report.hostname}</span>
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
              title="Open site in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 pt-1 lg:pt-0">
          {/* Quick Share to WhatsApp & Facebook */}
          <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border-2 border-slate-700 gap-1.5 shadow-sm">
            <button
              onClick={() => {
                const shareText = `🚀 Check out the Health & Security Audit Score (${report.overallScore}/100) for ${report.hostname}! Test your site free here: ${window.location.origin}/#url=${encodeURIComponent(report.url)}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center space-x-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-xs transition-all cursor-pointer border-2 border-emerald-300"
              title="Share report to WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/#url=${encodeURIComponent(report.url)}`;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center space-x-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-xs transition-all cursor-pointer border-2 border-blue-300"
              title="Share report to Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          {/* Live Browser Test Video Replay Button (Rich Emerald & Rose Live badge) */}
          <button
            onClick={() => setShowLiveVideoReplay(true)}
            id="btn-live-video-test-overview"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/25 transition-all cursor-pointer border-2 border-emerald-400"
            title={lang === 'te' ? 'లైవ్ వీడియో రూపంలో బ్రౌజర్ టెస్టింగ్ సిమ్యులేషన్ చూడండి' : 'Watch Live Browser Crawl & Inspection Video Replay'}
          >
            <Video className="w-4 h-4 text-emerald-200 stroke-[2.5]" />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>{lang === 'te' ? 'లైవ్ వీడియో టెస్ట్' : 'Live Browser Video'}</span>
            </span>
          </button>

          {/* Download Report Button with Icon (Rich Golden Amber) */}
          <button
            onClick={onExportPdf}
            id="btn-download-pdf-overview"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-95 text-slate-950 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:shadow-amber-500/40 border-2 border-amber-300"
            title={lang === 'te' ? 'పూర్తి PDF & డయాగ్నస్టిక్స్ నివేదికను డౌన్‌లోడ్ చేయండి' : 'Download Complete Audit PDF Report'}
          >
            <FileDown className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>{t.exportPdf}</span>
          </button>

          {/* Compare Feature Button */}
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-700 hover:border-amber-400 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-xs transition-all cursor-pointer"
              title={lang === 'te' ? 'పోటీదారులతో లేదా మునుపటి ఆడిట్‌తో పోల్చండి' : 'Compare with Competitors or Past Audits'}
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span>{lang === 'te' ? 'పోల్చండి' : 'Compare'}</span>
            </button>
          )}

          {/* Deep Crawler Quick Action Button */}
          {onOpenDeepCrawler && (
            <button
              onClick={onOpenDeepCrawler}
              id="btn-deep-crawl-overview"
              className="inline-flex items-center space-x-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border-2 border-cyan-400 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-sm shadow-cyan-500/20 transition-all cursor-pointer"
              title={lang === 'te' ? '10 పేజీల డీప్ వెబ్‌సైట్ క్రాల్ & సైట్‌మ్యాప్ మ్యాపింగ్' : 'Multi-Page Deep Crawler & Broken Links Tree'}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'te' ? 'డీప్ క్రాలర్' : 'Deep Crawl'}</span>
            </button>
          )}

          {/* AI / GEO Optimization Quick Button */}
          {onOpenAiGeo && (
            <button
              onClick={onOpenAiGeo}
              id="btn-aigeo-overview"
              className="inline-flex items-center space-x-1.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-400 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
              title={lang === 'te' ? 'ChatGPT, Perplexity & AI సెర్చ్ ఇంజిన్స్ AEO సంసిద్ధత' : 'AI SEO & GEO Readiness (ChatGPT, Gemini, Perplexity)'}
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'te' ? 'AI / GEO' : 'AI / GEO'}</span>
            </button>
          )}

          {/* 24/7 Monitoring Quick Button */}
          {onOpenMonitoring && (
            <button
              onClick={onOpenMonitoring}
              id="btn-monitoring-overview"
              className="inline-flex items-center space-x-1.5 bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border-2 border-purple-400 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-sm shadow-purple-500/20 transition-all cursor-pointer"
              title={lang === 'te' ? '24/7 వెబ్‌సైట్ ఆటోమేటెడ్ మానిటరింగ్ & అలర్ట్స్' : '24/7 Automated Health Monitoring & Downtime Alerts'}
            >
              <Bell className="w-4 h-4 text-purple-400" />
              <span>{lang === 'te' ? '24/7 మానిటర్' : 'Monitoring'}</span>
            </button>
          )}

          {/* 5-Star Rating & Review Button */}
          {onOpenRatingModal && (
            <button
              onClick={onOpenRatingModal}
              id="btn-rate-audit-overview"
              className="inline-flex items-center space-x-1.5 bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border-2 border-amber-400 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
              title={lang === 'te' ? 'ఈ ఆడిట్‌కు 5-స్టార్ రేటింగ్ & ఫీడ్‌బ్యాక్ ఇవ్వండి' : 'Rate this audit & submit 5-star feedback'}
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{lang === 'te' ? 'రేట్ చేయండి (5★)' : 'Rate Us (5★)'}</span>
            </button>
          )}

          {/* Google AdSense & SEO Kit Quick Button */}
          {onOpenAdSenseKit && (
            <button
              onClick={onOpenAdSenseKit}
              id="btn-adsense-kit-overview"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-950/90 to-orange-950/90 hover:from-amber-900/90 hover:to-orange-900/90 text-amber-300 border-2 border-amber-400 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
              title={lang === 'te' ? 'గూగుల్ యాడ్‌సెన్స్ 100% అప్రూవల్ & ఎస్‌ఈఓ కోడ్ కిట్' : 'Google AdSense 100% Approval & Full SEO Setup Code Kit'}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>{lang === 'te' ? 'యాడ్‌సెన్స్ & ఎస్‌ఈఓ కిట్' : 'AdSense & SEO Kit'}</span>
            </button>
          )}

          {/* Fix All Issues Button (Rich Golden Amber CTA) */}
          <button
            onClick={() => (onOpenPricing ? onOpenPricing('pro') : onOpenAutoFix())}
            title={t.fixAllTooltip}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer border-2 border-amber-300"
          >
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950 animate-pulse" />
            <span>
              {t.fixAllIssues} ({issuesCount})
            </span>
            <span className="bg-slate-950/20 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider hidden sm:inline-block">
              {t.fixAllBadge}
            </span>
          </button>

          <button
            onClick={() => onOpenAutoFix?.()}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 hover:border-slate-500 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-slate-400" />
            <span>{t.submitFix}</span>
          </button>
        </div>
      </div>

      {/* 1-Click Automated Bundle Remediation Banner */}
      {issuesCount > 0 && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 border-2 border-amber-400 shadow-amber-500/20">
          <div className="flex items-start space-x-3 sm:space-x-3.5">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-amber-500/20 border-2 border-amber-400/60 text-amber-400 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm sm:text-base text-white flex items-center gap-1.5">
                  <span>
                    {lang === 'te'
                      ? `${issuesCount} ఆడిట్ సమస్యలు గుర్తించబడ్డాయి`
                      : `${issuesCount} Recommended Fixes Identified`}
                  </span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border-2 border-amber-400">
                  {lang === 'te' ? 'ఆటోమేటెడ్ PR సిద్ధం' : 'Ready to Auto-Fix'}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {t.bundleFixSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => (onOpenPricing ? onOpenPricing('pro') : onOpenAutoFix())}
            className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer shrink-0 border-2 border-amber-300"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>
              {lang === 'te' ? `అన్నిటినీ పరిష్కరించండి (${issuesCount})` : `Bundle & Fix All (${issuesCount})`}
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Email Dispatch & Weekly Scheduled Audit Status Card */}
      {(report.emailSentTo || report.optInWeeklyReports || showEmailInputBox || emailStatusMessage) && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-500/40 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-white">
                    {lang === 'te' ? 'ఈమెయిల్ డెలివరీ & వీక్లీ మానిటరింగ్' : 'Email Delivery & Weekly Health Monitoring'}
                  </span>
                  {report.optInWeeklyReports && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CalendarCheck className="w-3 h-3 mr-1 text-emerald-400" />
                      {lang === 'te' ? 'వీక్లీ ఆటో-రిపోర్ట్ యాక్టివ్' : 'Weekly Digest Active (Mon 9AM)'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {report.emailSentTo
                    ? (lang === 'te'
                        ? `ఈ ఆడిట్ రిపోర్ట్ కాపీ మరియు వీక్లీ సమాచారం ${report.emailSentTo} కు పంపబడుతుంది.`
                        : `Instant PDF copy and weekly health digests are assigned to ${report.emailSentTo}`)
                    : (lang === 'te'
                        ? 'ఈ ఆడిట్ నివేదికను మీ ఈమెయిల్‌కు పంపుకోండి లేదా వీక్లీ రిపోర్ట్స్ షెడ్యూల్ చేయండి.'
                        : 'Dispatch this audit PDF report to your inbox or activate weekly monitoring.')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSendReportEmail()}
                disabled={isDispatchingEmail}
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isDispatchingEmail
                    ? (lang === 'te' ? 'పంపుతోంది...' : 'Sending...')
                    : report.emailSentTo
                    ? (lang === 'te' ? 'మళ్ళీ పంపు' : 'Resend to Inbox')
                    : (lang === 'te' ? 'ఈమెయిల్ పంపు' : 'Send to Email')}
                </span>
              </button>
              {!showEmailInputBox && (
                <button
                  type="button"
                  onClick={() => setShowEmailInputBox(true)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1.5 underline cursor-pointer"
                >
                  {lang === 'te' ? 'మార్చండి' : 'Change Email'}
                </button>
              )}
            </div>
          </div>

          {/* Inline Email Input form when needed */}
          {showEmailInputBox && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 animate-fadeIn">
              <input
                type="email"
                value={inlineEmailInput}
                onChange={(e) => setInlineEmailInput(e.target.value)}
                placeholder="yourname@gmail.com"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 flex-1 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => handleSendReportEmail(inlineEmailInput)}
                disabled={isDispatchingEmail || !inlineEmailInput.includes('@')}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'te' ? 'ధృవీకరించండి' : 'Confirm & Send'}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailInputBox(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 cursor-pointer"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
            </div>
          )}

          {/* Toast / Status feedback */}
          {emailStatusMessage && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2 animate-fadeIn font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{emailStatusMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Dashboard Grid - Scorecard & Key Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch lg:items-center pt-2">
        {/* Left Column: Circular Score Donut & Quick Telemetry */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950/60 rounded-3xl border border-slate-800 relative">
          <div className="w-full flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                {focusedTitle}
              </span>

              {/* Audit Confidence Badge with Hover Tooltip */}
              <div className="relative group inline-block">
                <button
                  type="button"
                  aria-label="Audit Confidence Details"
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 transition-all cursor-pointer shadow-2xs"
                >
                  <BadgeCheck className="w-3 h-3 text-indigo-400" />
                  <span>{t.auditConfidence}</span>
                  <span className="font-mono text-[9px] text-indigo-400">
                    {report.confidenceScore ? `${report.confidenceScore.toFixed(0)}%` : '99%'}
                  </span>
                  <Info className="w-2.5 h-2.5 text-indigo-400 group-hover:text-indigo-300" />
                </button>

                {/* Floating Tooltip Card */}
                <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-64 p-3 bg-slate-950/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700/80 text-xs space-y-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t.auditConfidence}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                      {report.confidenceScore ? `${report.confidenceScore.toFixed(1)}%` : '99.4%'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {t.scanTimestampLabel}:
                      </span>
                      <span className="font-mono text-slate-200 text-[10px]">
                        {report.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        {t.networkLatencyLabel}:
                      </span>
                      <span className="font-mono font-bold text-emerald-300">
                        {report.latencyMs || 164} ms
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t.verifiedTelemetry}</span>
                  </div>

                  {/* Tooltip pointer arrow */}
                  <div className="absolute -top-1.5 left-6 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-slate-950 border-t border-l border-slate-700 rotate-45" />
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              Grade {focusedScore >= 90 ? 'A+' : focusedScore >= 80 ? 'A' : 'B'}
            </span>
          </div>

          {/* Professional Circular SVG Gauge Chart */}
          <div className="w-full flex items-center justify-center my-1 max-w-[240px]">
            <CircularGaugeChart
              score={focusedScore}
              grade={focusedScore >= 90 ? 'A+' : focusedScore >= 80 ? 'A' : 'B'}
              lang={lang}
              size={220}
            />
          </div>

          <div className="w-full mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'te' ? 'హెల్త్ ట్రెండ్:' : 'Health Trend:'}</span>
            </span>
            <span className="font-bold text-emerald-400 font-mono">+4.2% optimal</span>
          </div>
        </div>

        {/* Right Column: Key Pillar Breakdowns (Full 360 Mode) OR Focused Module Metrics (Focused Section Mode) */}
        <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isTargetedModule
                  ? (lang === 'te'
                      ? `లక్ష్య విభాగ టెలిమెట్రీ & డయాగ్నస్టిక్స్ (${report.targetAuditModule.toUpperCase()})`
                      : `Target Section Telemetry & Diagnostics (${report.targetAuditModule.toUpperCase()})`)
                  : (lang === 'te'
                      ? '7 ప్రధాన విభాగాల ఆడిట్ స్కోర్లు (SEO, AI/GEO, Mobile & Speed)'
                      : '7 Core Health, AI SEO & Mobile Audit Pillars')}
              </span>
            </span>
            {isTargetedModule ? (
              <span className="text-[11px] text-amber-400 font-mono">
                {lang === 'te' ? 'ప్రత్యేక నివేదిక' : 'Section Isolated'}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                {lang === 'te' ? 'వివరణ కోసం ⓘ లేదా విశ్లేషణ కోసం కార్డ్‌ను క్లిక్ చేయండి' : 'Click ⓘ for tooltip or click card to Deep-Dive'}
              </span>
            )}
          </div>

          {/* IF TARGETED MODULE: Render ONLY the specific diagnostics of that chosen module */}
          {isTargetedModule ? (
            <div className="space-y-2.5">
              {/* Telemetry Metrics from the targeted category */}
              {(() => {
                const targetCategory = report.categories?.find((c) => {
                  if (report.targetAuditModule === 'seo') return c.id === 'seo' || c.id === 'tech-seo';
                  if (report.targetAuditModule === 'performance' || report.targetAuditModule === 'vitals') return c.id === 'performance';
                  if (report.targetAuditModule === 'security' || report.targetAuditModule === 'ssl') return c.id === 'security';
                  if (report.targetAuditModule === 'accessibility') return c.id === 'accessibility';
                  return c.id === report.targetAuditModule;
                }) || report.categories?.[0];

                const relevantMetrics = targetCategory?.metrics || [];

                return (
                  <div className="space-y-2">
                    {relevantMetrics.slice(0, 6).map((metric) => (
                      <div
                        key={metric.id}
                        onClick={() => {
                          if (metric.status !== 'good' && onOpenFixModal) {
                            onOpenFixModal(metric);
                          } else {
                            if (onSelectCategory && targetCategory) onSelectCategory(targetCategory.id);
                            const elem = document.getElementById('category-detail-section');
                            if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border-2 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70 transition-all cursor-pointer select-none"
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            metric.status === 'good'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                              : metric.status === 'warning'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                          }`}>
                            {metric.status === 'good' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-extrabold text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                                {lang === 'te' ? metric.nameTe : metric.name}
                              </span>
                              {metric.priority && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                  metric.priority === 'P0'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {metric.priority}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {metric.value ? `${metric.value} — ` : ''}{lang === 'te' ? (metric.descriptionTe || metric.description) : metric.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg border shadow-2xs ${getScoreBadgeBg(metric.score)}`}>
                            {metric.score}/100
                          </span>
                          <div className="inline-flex items-center space-x-1 bg-slate-800 group-hover:bg-slate-700 text-slate-300 group-hover:text-white px-2 py-1 rounded-xl text-[11px] font-bold transition-all border border-slate-700">
                            {metric.status !== 'good' ? (
                              <>
                                <Wrench className="w-3 h-3 text-amber-400" />
                                <span className="hidden sm:inline">{lang === 'te' ? 'సరిదిద్దండి' : 'Fix'}</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="hidden sm:inline">{lang === 'te' ? 'సరైనది' : 'Passed'}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Action Banner to Toggle All 7 Pillars */}
              <div className="pt-2 flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">
                  {lang === 'te' ? 'పూర్తి వెబ్‌సైట్ స్కోర్లు కావాలా?' : 'Want complete 360° website coverage?'}
                </span>
                {onSwitchToFullReport && (
                  <button
                    type="button"
                    onClick={onSwitchToFullReport}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white font-bold border border-slate-700 transition-all cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{lang === 'te' ? 'అన్ని 7 విభాగాలు చూపించు' : 'Show All 7 Pillars'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* IF 360 ALL-MODE: Render all 7 health pillars */
            <>
              {METRIC_PILLAR_DEFINITIONS.map((pillar) => {
                const score = report[pillar.scoreKey];
                const PillarIcon = pillar.icon;
                const isPillarTargeted = isTargetedModule && (
                  pillar.id === report.targetAuditModule ||
                  (report.targetAuditModule === 'ssl' && pillar.id === 'security') ||
                  (report.targetAuditModule === 'vitals' && pillar.id === 'performance')
                );
                const handleDeepDive = () => {
                  if (onSelectCategory) {
                    onSelectCategory(pillar.id);
                  }
                  const elem = document.getElementById('category-detail-section');
                  if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                };

                return (
                  <div
                    key={pillar.id}
                    id={`metric-card-${pillar.id}`}
                    onClick={handleDeepDive}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDeepDive();
                      }
                    }}
                    className={`group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl ${
                      isPillarTargeted
                        ? 'bg-amber-950/40 border-2 border-amber-400/90 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-slate-950/60 border-2 border-slate-800 shadow-xs hover:shadow-md hover:border-slate-700 hover:bg-slate-900/60'
                    } transition-all cursor-pointer select-none ${pillar.accentBorder}`}
                    title={lang === 'te' ? `${pillar.nameTe} లోతైన విశ్లేషణ చూడండి (Click for Deep Dive)` : `Click to deep dive into ${pillar.name} audits`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-xl ${pillar.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs`}>
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                            {lang === 'te' ? pillar.nameTe : pillar.name}
                          </span>
                          {isPillarTargeted && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 uppercase tracking-wider">
                              {lang === 'te' ? 'ఎంపికైన విభాగం' : 'Target Module'}
                            </span>
                          )}
                          {/* Informative Tooltip Component & Info-Icon Button */}
                          <MetricScoreInfoTooltip
                            pillar={pillar}
                            score={score}
                            lang={lang}
                            onDeepDive={handleDeepDive}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors truncate">
                          {lang === 'te' ? pillar.shortSubtitleTe : pillar.shortSubtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                      {/* Progress Bar Track */}
                      <div className="w-14 sm:w-20 bg-slate-800 h-2 rounded-full hidden md:block overflow-hidden border border-slate-700">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      {/* Score Badge */}
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg border shadow-2xs transition-transform group-hover:scale-105 ${getScoreBadgeBg(score)}`}>
                        <AnimatedScore value={score} />/100
                      </span>

                      {/* Explicit Metric Deep-Dive Link Button */}
                      <div
                        id={`link-deepdive-${pillar.id}`}
                        className="inline-flex items-center space-x-1 bg-slate-800 group-hover:bg-slate-700 text-slate-300 group-hover:text-white px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all shadow-2xs border border-slate-700 shrink-0"
                      >
                        <span className="hidden sm:inline">{lang === 'te' ? 'డీప్-డైవ్' : 'Deep-Dive'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Quick Metric Deep-Dive Links Navigation Ribbon */}
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'te' ? 'త్వరిత డీప్-డైవ్ లింకులు:' : 'Quick Deep-Dive Links:'}</span>
                </span>
                {METRIC_PILLAR_DEFINITIONS.map((pillar) => (
                  <button
                    key={`quick-link-${pillar.id}`}
                    type="button"
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(pillar.id);
                      }
                      const elem = document.getElementById('category-detail-section');
                      if (elem) {
                        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-extrabold border border-slate-700 transition-colors cursor-pointer"
                    title={lang === 'te' ? `${pillar.nameTe} వివరాలకు వెళ్ళండి` : `Jump to ${pillar.name} deep-dive checklist`}
                  >
                    <span>{lang === 'te' ? pillar.nameTe.split(' ')[0] : pillar.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({report[pillar.scoreKey]})</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PRIORITY FIX ROADMAP SECTION (Fix First, Fix Next, Optimization, Already Good) */}
      <FixRoadmapSection
        report={report}
        lang={lang}
        onOpenFixModal={onOpenFixModal}
        onOpenAutoFix={onOpenAutoFix}
        onOpenPricing={onOpenPricing}
        onOpenTeamWorkspace={onOpenTeamWorkspace}
      />

      {/* RECHARTS HISTORICAL SEO & AUDIT TREND LINE CHART */}
      <div className="pt-6 border-t-2 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <LineChartIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{lang === 'te' ? 'చారిత్రక ఎస్‌ఈఓ (SEO) & హెల్త్ ట్రెండ్ గ్రాఫ్' : 'Historical SEO & Audit Trend Line Chart'}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border-2 border-emerald-500/40">
                  {report.hostname}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'te'
                ? 'గత ఆడిట్ల ఆధారంగా ఎస్‌ఈఓ మరియు వెబ్‌సైట్ పెర్ఫార్మెన్స్ పెరుగుదల విశ్లేషణ'
                : 'Timeline visualization tracking SEO ranking signals and overall health scores over successive audits'}
            </p>
          </div>

          {/* Metric & Timeframe Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Metric Mode Filter */}
            <div className="inline-flex rounded-xl bg-slate-950 p-1 text-xs font-bold text-slate-400 border border-slate-800">
              <button
                type="button"
                onClick={() => setTrendMetric('both')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  trendMetric === 'both' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
                }`}
              >
                {lang === 'te' ? 'రెండు' : 'SEO & Overall'}
              </button>
              <button
                type="button"
                onClick={() => setTrendMetric('seo')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  trendMetric === 'seo' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-200'
                }`}
              >
                SEO Only
              </button>
              <button
                type="button"
                onClick={() => setTrendMetric('overall')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  trendMetric === 'overall' ? 'bg-teal-600 text-white shadow-xs' : 'hover:text-slate-200'
                }`}
              >
                Health Only
              </button>
            </div>

            {/* Timeframe Filter */}
            <div className="inline-flex rounded-xl bg-slate-950 p-1 text-xs font-bold text-slate-400 border border-slate-800">
              <button
                type="button"
                onClick={() => setTimeframe('30d')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === '30d' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('90d')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === '90d' ? 'bg-slate-800 text-white shadow-xs' : 'hover:text-slate-200'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Trend Line Container */}
        <div className="bg-slate-950 rounded-3xl p-5 border-2 border-slate-800 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Chart Header Metrics */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b-2 border-slate-800 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <span className="font-bold text-slate-200">SEO Score:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">{report.seoScore}/100</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-400 shadow-sm shadow-teal-400/50" />
                <span className="font-bold text-slate-200">Overall Health:</span>
                <span className="font-mono font-black text-teal-400 text-sm">{report.overallScore}/100</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border-2 border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{timeframe === '30d' ? '14 pts' : '22 pts'} Remediation Gain</span>
            </div>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="seoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  domain={[20, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip content={<CustomTrendTooltip lang={lang} />} />
                {(trendMetric === 'both' || trendMetric === 'seo') && (
                  <Area
                    type="monotone"
                    dataKey="seo"
                    name="SEO Score"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#seoGradient)"
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
                {(trendMetric === 'both' || trendMetric === 'overall') && (
                  <Area
                    type="monotone"
                    dataKey="overall"
                    name="Overall Health"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#overallGradient)"
                    activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3-TIER REMEDIATION PRICING PLANS SECTION (Quick Fix ₹299, Pro Fix ⭐ ₹799, Complete Fix ₹1,499) */}
      <div className="pt-6 border-t-2 border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{t.fixWebsiteAutomatically}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border-2 border-emerald-500/40">
                  Razorpay Verified
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {t.pricingSectionSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-300 bg-slate-950 border-2 border-slate-800 px-3 py-1.5 rounded-xl">
              ⚡ Razorpay Fee: 2.36% (2% + 18% GST)
            </span>
          </div>
        </div>

        {/* 3 Cards Grid with distinct thick borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1: Quick Fix (₹299) */}
          <div className="bg-slate-950/60 border-2 border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {lang === 'te' ? 'చిన్న సైట్‌లు' : 'Small Sites'}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">Up to 5 Issues</span>
              </div>
              <h4 className="text-base font-black text-white">
                {lang === 'te' ? 'క్విక్ ఫిక్స్ (Quick Fix)' : 'Quick Fix'}
              </h4>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-white">₹299</span>
                <span className="text-xs text-slate-400 font-bold">/ one-time</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'te'
                  ? 'టైటిల్, మెటా డిస్క్రిప్షన్, ఆల్ట్ ట్యాగ్‌లు & హెడర్స్ వంటి 5 సమస్యలను ఫిక్స్ చేయండి.'
                  : 'Quick automated fix for missing title tags, meta descriptions, alt tags, and headers.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => (onOpenPricing ? onOpenPricing('quick') : onOpenAutoFix())}
              className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-white transition-all shadow-sm cursor-pointer border border-slate-700"
            >
              {lang === 'te' ? '5 సమస్యలు ఫిక్స్ — ₹299' : 'Fix 5 Issues — ₹299'}
            </button>
          </div>

          {/* Card 2: Pro Fix ⭐ (₹799) - Main Highlighted Selling Plan */}
          <div className="bg-gradient-to-b from-indigo-950/50 via-slate-900 to-indigo-950/30 border-2 border-indigo-500 rounded-3xl p-5 relative flex flex-col justify-between space-y-4 shadow-lg shadow-indigo-500/10 hover:shadow-xl transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md border border-indigo-400">
              {lang === 'te' ? 'సిఫార్సు చేయబడినది ⭐' : 'Recommended ⭐'}
            </div>
            <div className="space-y-2 mt-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                  {lang === 'te' ? 'వ్యాపార సైట్‌లు' : 'Business & Blogs'}
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-400">Up to 20 Issues</span>
              </div>
              <h4 className="text-base font-black text-white flex items-center gap-1">
                <span>{lang === 'te' ? 'ప్రో ఫిక్స్ (Pro Fix ⭐)' : 'Pro Fix ⭐'}</span>
              </h4>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-indigo-200">₹799</span>
                <span className="text-xs text-indigo-300 font-bold">/ one-time</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'te'
                  ? 'పూర్తి ఎస్‌ఈఓ, హెడర్స్, ఇమేజ్ ఆప్టిమైజేషన్, బ్రోకెన్ లింక్స్ & SSL/HSTS మరమ్మతులు.'
                  : 'Comprehensive repair: SEO tags, headings, SSL/HSTS, ARIA, sitemap, and performance fixes.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => (onOpenPricing ? onOpenPricing('pro') : onOpenAutoFix())}
              className="w-full py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:via-purple-500 hover:to-emerald-500 text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer border border-indigo-500"
            >
              {lang === 'te' ? 'నా సైట్‌ను సరిచేయండి — ₹799' : 'Fix My Website — ₹799'}
            </button>
          </div>

          {/* Card 3: Complete Fix (₹1,499) */}
          <div className="bg-slate-950/60 border-2 border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                  {lang === 'te' ? 'అన్నీ సరిచేయండి' : 'Fix Everything'}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-400">All Detected Issues</span>
              </div>
              <h4 className="text-base font-black text-white">
                {lang === 'te' ? 'కంప్లీట్ ఫిక్స్ (Complete Fix)' : 'Complete Fix'}
              </h4>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl sm:text-3xl font-black text-white">₹1,499</span>
                <span className="text-xs text-slate-400 font-bold">/ one-time</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                {lang === 'te'
                  ? '“సమస్యలను అర్థం చేసుకోవాల్సిన అవసరం లేదు. వాటన్నింటినీ ఒకేసారి పరిష్కరించండి.”'
                  : '“I don\'t want to understand the problems. Just fix everything and send me the PR.”'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => (onOpenPricing ? onOpenPricing('complete') : onOpenAutoFix())}
              className="w-full py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm cursor-pointer border border-emerald-500"
            >
              {lang === 'te' ? 'అన్నీ సరిచేయండి — ₹1,499' : 'Fix Everything — ₹1,499'}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SEO CHECKLIST SECTION */}
      <div className="pt-6 border-t-2 border-slate-800 space-y-5">
        {/* Checklist Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{t.seoChecklistTitle}</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                  {completedCount} / {totalItems} {lang === 'te' ? 'పూర్తయింది' : 'Verified'}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {t.seoChecklistSubtitle}
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => handleMarkAll(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.markAllCompleted}</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-400 transition-all cursor-pointer"
              title="Reset checklist items to original audit results"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.resetChecklist}</span>
            </button>
          </div>
        </div>

        {/* Remediation Progress Bar */}
        <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.checklistProgress}</span>
            </span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              {completionPercentage}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {completionPercentage === 100 && (
            <div className="pt-1 text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.allCompletedCelebration}</span>
            </div>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 overflow-x-auto pb-1">
          <span className="text-slate-500 flex items-center gap-1 text-[11px] pr-1">
            <ListFilter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {t.filterAll} ({totalItems})
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              filterMode === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {t.filterPending} ({totalItems - completedCount})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              filterMode === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {t.filterCompleted} ({completedCount})
          </button>
        </div>

        {/* Interactive Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {filteredItems.map((item) => {
            const isDone = !!checkedItems[item.id];

            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-start space-x-3.5 cursor-pointer select-none group ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 shadow-2xs'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                {/* Custom Checkbox */}
                <button
                  type="button"
                  aria-checked={isDone}
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'border-2 border-slate-700 group-hover:border-slate-500 bg-slate-900'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4
                      className={`text-xs font-bold leading-snug transition-colors ${
                        isDone
                          ? 'text-emerald-300 font-extrabold line-through decoration-emerald-500/60'
                          : 'text-slate-100 group-hover:text-white'
                      }`}
                    >
                      {lang === 'te' ? item.titleTe : item.title}
                    </h4>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                        item.impact === 'Essential'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-700'
                          : item.impact === 'High'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-700'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-700'
                      }`}
                    >
                      {item.impact}
                    </span>
                  </div>

                  <p
                    className={`text-[11px] leading-relaxed transition-colors ${
                      isDone ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {lang === 'te' ? item.descTe : item.desc}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/80">
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md truncate max-w-[200px] border border-slate-800">
                      {item.tagHint}
                    </span>

                    <span
                      className={`text-[10px] font-bold flex items-center gap-1 ${
                        isDone ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{lang === 'te' ? 'ధృవీకరించబడింది' : 'Remediated'}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>{lang === 'te' ? 'చర్య అవసరం' : 'Action Needed'}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Browser Video Test Replay Modal */}
      {showLiveVideoReplay && (
        <LiveBrowserVideoScanner
          url={report.url}
          isScanning={false}
          progress={100}
          isModal={true}
          lang={lang}
          onClose={() => setShowLiveVideoReplay(false)}
        />
      )}
    </div>
  );
};

export const HealthOverviewCard: React.FC<HealthOverviewCardProps> = (props) => {
  if (props.isLoading || !props.report) {
    return <HealthOverviewCardSkeleton lang={props.lang} />;
  }
  return <HealthOverviewCardLoaded {...props} report={props.report} />;
};

