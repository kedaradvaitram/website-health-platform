import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Cell,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Globe2,
  TrendingUp,
  ShieldAlert,
  Zap,
  Search,
  Eye,
  FileCheck,
  BarChart3,
  Layers,
  LineChart as LineChartIcon,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface GlobalAuditStatsProps {
  lang: Language;
}

interface DayHealthPoint {
  date: string;
  isoDate: string;
  dayName: string;
  avgScore: number;
  audits: number;
  perfAvg: number;
  seoAvg: number;
  secAvg: number;
  accAvg: number;
  bestPracticesAvg: number;
  grade: string;
}

interface TrendMeta {
  currentAvgScore: number;
  overallMeanScore: number;
  scoreDiff: number;
  percentageDelta: string;
  trendDirection: 'up' | 'down';
  total7dAudits: number;
  minScore: number;
  maxScore: number;
  benchmarkSummary: string;
  updatedAt: string;
}

// Fallback generator for 7-day health trend data
function generateFallback7dData(): { data: DayHealthPoint[]; meta: TrendMeta } {
  const baseScores = [84.6, 85.3, 86.1, 87.4, 86.8, 88.2, 89.4];
  const baseAudits = [1180, 1340, 1260, 1590, 1720, 1890, 2140];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const data: DayHealthPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayIndex = 6 - i;
    const avgScore = Number((baseScores[dayIndex]).toFixed(1));
    const audits = baseAudits[dayIndex];

    data.push({
      date: `${months[d.getMonth()]} ${d.getDate()}`,
      isoDate: d.toISOString().split('T')[0],
      dayName: days[d.getDay()],
      avgScore,
      audits,
      perfAvg: Number((avgScore - 1.1).toFixed(1)),
      seoAvg: Number((avgScore + 2.0).toFixed(1)),
      secAvg: Number((avgScore + 0.9).toFixed(1)),
      accAvg: Number((avgScore - 0.4).toFixed(1)),
      bestPracticesAvg: Number((avgScore + 1.2).toFixed(1)),
      grade: avgScore >= 90 ? 'A+' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B' : 'C',
    });
  }

  const firstScore = data[0].avgScore;
  const latestScore = data[data.length - 1].avgScore;
  const scoreDiff = Number((latestScore - firstScore).toFixed(1));
  const percentageDelta = Number(((scoreDiff / firstScore) * 100).toFixed(2));
  const totalAudits = data.reduce((acc, curr) => acc + curr.audits, 0);
  const overallMeanScore = Number((data.reduce((acc, curr) => acc + curr.avgScore, 0) / data.length).toFixed(1));

  return {
    data,
    meta: {
      currentAvgScore: latestScore,
      overallMeanScore,
      scoreDiff,
      percentageDelta: `+${percentageDelta}%`,
      trendDirection: 'up',
      total7dAudits: totalAudits,
      minScore: Math.min(...data.map((d) => d.avgScore)),
      maxScore: Math.max(...data.map((d) => d.avgScore)),
      benchmarkSummary: `Average website health score improved from ${firstScore} to ${latestScore} (+${percentageDelta}%) over the last 7 days across ${totalAudits.toLocaleString()} verified scans.`,
      updatedAt: new Date().toISOString(),
    },
  };
}

// Aggregated common issues dataset
const COMMON_ISSUES_DATA = [
  {
    category: 'SEO',
    categoryTe: 'ఎస్‌ఈఓ',
    issue: 'Missing Alt / Title Tags',
    issueTe: 'మిస్ అయిన ఆల్ట్ / టైటిల్ ట్యాగ్స్',
    count: 64280,
    percentage: 78.4,
    color: '#3b82f6',
    icon: Search,
    impact: 'High',
  },
  {
    category: 'Security',
    categoryTe: 'సెక్యూరిటీ',
    issue: 'Missing HSTS / CSP Headers',
    issueTe: 'HSTS & CSP హెడర్స్ లోపం',
    count: 52140,
    percentage: 63.6,
    color: '#eab308',
    icon: ShieldAlert,
    impact: 'Critical',
  },
  {
    category: 'Performance',
    categoryTe: 'పెర్ఫార్మెన్స్',
    issue: 'Unoptimized Images / High LCP',
    issueTe: 'భారీ చిత్రాలు / ఆలస్యమైన LCP',
    count: 48920,
    percentage: 59.7,
    color: '#f97316',
    icon: Zap,
    impact: 'High',
  },
  {
    category: 'Security',
    categoryTe: 'సెక్యూరిటీ',
    issue: 'Insecure SSL / Weak Ciphers',
    issueTe: 'బలహీనమైన SSL ఎన్‌క్రిప్షన్',
    count: 31800,
    percentage: 38.8,
    color: '#ef4444',
    icon: ShieldAlert,
    impact: 'Critical',
  },
  {
    category: 'Accessibility',
    categoryTe: 'యాక్సెసిబిలిటీ',
    issue: 'Low Contrast / Missing ARIA',
    issueTe: 'తక్కువ కాంట్రాస్ట్ & ARIA లేకపోవడం',
    count: 27430,
    percentage: 33.5,
    color: '#8b5cf6',
    icon: Eye,
    impact: 'Medium',
  },
  {
    category: 'Best Practices',
    categoryTe: 'బెస్ట్ ప్రాక్టీసెస్',
    issue: 'Missing DMARC / DNS Records',
    issueTe: 'DMARC & DNS రికార్డుల లోపం',
    count: 24190,
    percentage: 29.5,
    color: '#10b981',
    icon: FileCheck,
    impact: 'Medium',
  },
];

const AUDIT_TREND_DATA = [
  { month: 'Jan', audits: 9400, issuesFound: 24200, issuesFixed: 21800 },
  { month: 'Feb', audits: 12100, issuesFound: 31000, issuesFixed: 28400 },
  { month: 'Mar', audits: 15600, issuesFound: 39500, issuesFixed: 37100 },
  { month: 'Apr', audits: 18900, issuesFound: 48200, issuesFixed: 46000 },
  { month: 'May', audits: 23400, issuesFound: 59800, issuesFixed: 57400 },
  { month: 'Jun', audits: 28700, issuesFound: 71200, issuesFixed: 69100 },
  { month: 'Jul', audits: 34500, issuesFound: 84900, issuesFixed: 82500 },
  { month: 'Aug', audits: 41200, issuesFound: 98400, issuesFixed: 96300 },
];

export const GlobalAuditStats: React.FC<GlobalAuditStatsProps> = ({ lang }) => {
  const t = translations[lang];
  const initialFallback = generateFallback7dData();

  const [activeTab, setActiveTab] = useState<'score7d' | 'issues' | 'trend'>('score7d');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '30d' | '7d'>('7d');
  const [showPillarComparison, setShowPillarComparison] = useState<boolean>(false);

  // 7-day live API state
  const [sevenDayData, setSevenDayData] = useState<DayHealthPoint[]>(initialFallback.data);
  const [trendMeta, setTrendMeta] = useState<TrendMeta>(initialFallback.meta);
  const [isFetchingTrend, setIsFetchingTrend] = useState<boolean>(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string>('Just now');

  const fetch7dTrend = useCallback(async () => {
    setIsFetchingTrend(true);
    try {
      const res = await fetch('/api/stats/7d-health-score');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.sevenDayData) && json.sevenDayData.length > 0) {
          setSevenDayData(json.sevenDayData);
          setTrendMeta({
            currentAvgScore: json.currentAvgScore || 89.4,
            overallMeanScore: json.overallMeanScore || 87.1,
            scoreDiff: json.scoreDiff || 4.8,
            percentageDelta: json.percentageDelta || '+5.6%',
            trendDirection: json.trendDirection || 'up',
            total7dAudits: json.total7dAudits || 11650,
            minScore: json.minScore || 84.6,
            maxScore: json.maxScore || 89.4,
            benchmarkSummary: json.benchmarkSummary || 'Average website health score improved over the last 7 days.',
            updatedAt: json.updatedAt || new Date().toISOString(),
          });
          setLastFetchedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Utilizing fallback for 7-day health trend stats:', err);
    } finally {
      setIsFetchingTrend(false);
    }
  }, []);

  useEffect(() => {
    fetch7dTrend();
  }, [fetch7dTrend]);

  // Multiplier based on timeframe
  const multiplier = selectedTimeframe === 'all' ? 1 : selectedTimeframe === '30d' ? 0.32 : 0.09;

  const dynamicTrendData = AUDIT_TREND_DATA.map((item) => ({
    ...item,
    audits: Math.round(item.audits * (selectedTimeframe === 'all' ? 1 : selectedTimeframe === '30d' ? 0.7 : 0.25)),
    issuesFound: Math.round(item.issuesFound * (selectedTimeframe === 'all' ? 1 : selectedTimeframe === '30d' ? 0.7 : 0.25)),
    issuesFixed: Math.round(item.issuesFixed * (selectedTimeframe === 'all' ? 1 : selectedTimeframe === '30d' ? 0.7 : 0.25)),
  }));

  const dynamicIssuesData = COMMON_ISSUES_DATA.map((item) => ({
    ...item,
    displayName: lang === 'te' ? item.issueTe : item.issue,
    categoryName: lang === 'te' ? item.categoryTe : item.category,
    count: Math.round(item.count * multiplier),
  }));

  return (
    <section id="global-audit-stats-section" className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700 mb-2">
            <Globe2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span>{t.globalStatsTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {lang === 'te' ? 'గ్లోబల్ ఆడిట్ గణాంకాలు & నెట్‌వర్క్ ఇంటెలిజెన్స్' : 'Global Audit Benchmark & Vulnerability Index'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t.globalStatsSubtitle}
          </p>
        </div>

        {/* Action Controls: View Switcher & Timeframe */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Timeframe selector */}
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setSelectedTimeframe('7d')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTimeframe === '7d'
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              {t.timeframe7d}
            </button>
            <button
              onClick={() => setSelectedTimeframe('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTimeframe === '30d'
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              {t.timeframe30d}
            </button>
            <button
              onClick={() => setSelectedTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTimeframe === 'all'
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              {t.timeframeAllTime}
            </button>
          </div>

          {/* View Toggle */}
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold text-slate-300 shadow-sm">
            <button
              onClick={() => setActiveTab('score7d')}
              id="tab-7d-score-trend"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'score7d'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>{t.sevenDayScoreTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              id="tab-common-issues"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'issues'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'సాధారణ లోపాలు' : 'Common Issues'}</span>
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              id="tab-audit-volume"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'trend'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'ఆడిట్ వృద్ధి ట్రెండ్' : 'Audit Volume'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Global KPI Counters with Embedded 7-Day Sparkline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Audits */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5 hover:border-slate-700 transition-all overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
              {t.totalAuditsPerformed}
            </p>
            <p className="text-xl sm:text-2xl font-black text-white truncate">
              {selectedTimeframe === 'all' ? '184,520+' : selectedTimeframe === '30d' ? '41,200' : `${trendMeta.total7dAudits.toLocaleString()}+`}
            </p>
          </div>
        </div>

        {/* KPI 2: Vulnerabilities Remediated */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5 hover:border-slate-700 transition-all overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
              {t.totalIssuesRemediated}
            </p>
            <p className="text-xl sm:text-2xl font-black text-white truncate">
              {selectedTimeframe === 'all' ? '432,600+' : selectedTimeframe === '30d' ? '96,300' : '23,100'}
            </p>
          </div>
        </div>

        {/* KPI 3: Average Platform Health + Mini Sparkline */}
        <div 
          onClick={() => setActiveTab('score7d')}
          className={`bg-slate-900/90 border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:shadow-sm overflow-hidden ${
            activeTab === 'score7d' ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 bg-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
          }`}
          title="Click to view full 7-Day Average Health Score Line Chart"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  {t.avgPlatformHealth}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {trendMeta.currentAvgScore}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">/100</span>
                </div>
              </div>
            </div>

            {/* Sparkline badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-700 gap-0.5 shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              {trendMeta.percentageDelta}
            </span>
          </div>

          {/* Mini Sparkline Line Chart */}
          <div className="w-full h-8 pt-1 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sevenDayData}>
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 4: Monitored Endpoints */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5 hover:border-slate-700 transition-all overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
              {t.activeMonitoredSites}
            </p>
            <p className="text-xl sm:text-2xl font-black text-white truncate">
              42,850+
            </p>
          </div>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="bg-slate-950 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-4 shadow-xl">
        {/* Dynamic Section Topbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                {activeTab === 'score7d' && (
                  <>
                    <span>{t.sevenDayHealthTrendTitle}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {t.liveBenchmarkBadge}
                    </span>
                  </>
                )}
                {activeTab === 'issues' && t.issueFrequencyChartTitle}
                {activeTab === 'trend' && t.auditVolumeTrendTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                {activeTab === 'score7d' && t.sevenDayHealthTrendSubtitle}
                {activeTab === 'issues' && t.issueFrequencyDescription}
                {activeTab === 'trend' && (lang === 'te' ? 'నెలకు ఆడిట్లు & పరిష్కరించిన సమస్యలు' : 'Monthly Audit Volume & Fixed Defects')}
              </p>
            </div>
          </div>

          {/* Action buttons depending on active tab */}
          <div className="flex items-center space-x-2">
            {activeTab === 'score7d' && (
              <>
                <button
                  onClick={() => setShowPillarComparison((prev) => !prev)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    showPillarComparison
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showPillarComparison ? (lang === 'te' ? 'సింగిల్ లైన్' : 'Single Score') : (lang === 'te' ? 'అన్ని కేటగిరీలు' : 'Compare Pillars')}</span>
                </button>

                <button
                  onClick={fetch7dTrend}
                  disabled={isFetchingTrend}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-700 font-semibold transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                  title="Refresh latest platform telemetry"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingTrend ? 'animate-spin text-emerald-400' : ''}`} />
                  <span className="hidden sm:inline">{t.refreshStats}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* =========================================================
            CHART VIEW 1: 7-Day Average Website Health Score Line Chart
           ========================================================= */}
        {activeTab === 'score7d' && (
          <div className="space-y-4 pt-1">
            {/* Telemetry Highlight Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[11px] font-medium">{t.dailyAvgScoreLabel}</span>
                <p className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-1.5">
                  <span>{trendMeta.currentAvgScore}</span>
                  <span className="text-[11px] text-slate-400 font-normal">/100</span>
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 text-[11px] font-medium">{t.sevenDayDeltaLabel}</span>
                <p className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>{trendMeta.percentageDelta}</span>
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 text-[11px] font-medium">{t.weeklyMean}</span>
                <p className="text-base sm:text-lg font-black text-white">
                  {trendMeta.overallMeanScore} <span className="text-[11px] text-slate-400 font-normal">/100</span>
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 text-[11px] font-medium">{t.dailyAuditsLabel}</span>
                <p className="text-base sm:text-lg font-black text-indigo-300">
                  {trendMeta.total7dAudits.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recharts LineChart Visual Canvas */}
            <div className="w-full h-72 sm:h-80 pt-2" id="line-chart-health-score-7d">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sevenDayData}
                  margin={{ top: 15, right: 30, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="scoreLineGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />

                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    stroke="#475569"
                    dy={5}
                  />

                  <YAxis
                    domain={[
                      Math.max(60, Math.floor(trendMeta.minScore - 3)),
                      Math.min(100, Math.ceil(trendMeta.maxScore + 2)),
                    ]}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    stroke="#475569"
                    tickFormatter={(val) => `${val}`}
                    dx={-2}
                  />

                  {/* 7-day mean reference line */}
                  <ReferenceLine
                    y={trendMeta.overallMeanScore}
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `7d Mean: ${trendMeta.overallMeanScore}`,
                      fill: '#94a3b8',
                      fontSize: 11,
                      position: 'insideTopRight',
                    }}
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as DayHealthPoint;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 text-white min-w-[200px]">
                            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                              <div>
                                <span className="font-bold text-slate-200">{data.dayName}, {data.date}</span>
                                <p className="text-[10px] text-slate-400">{data.isoDate}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Grade {data.grade}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-slate-300 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                <span className="font-semibold">{t.dailyAvgScoreLabel}:</span>
                              </span>
                              <span className="font-black text-emerald-400 text-sm">
                                {data.avgScore} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">{t.dailyAuditsLabel}:</span>
                              <span className="font-bold text-white">{data.audits.toLocaleString()} audits</span>
                            </div>

                            {/* Sub-pillar Breakdown in Tooltip */}
                            <div className="pt-1.5 border-t border-slate-800 space-y-1 text-[11px]">
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="text-blue-400">SEO:</span>
                                <span className="font-semibold">{data.seoAvg}/100</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="text-amber-400">Performance:</span>
                                <span className="font-semibold">{data.perfAvg}/100</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="text-yellow-400">Security:</span>
                                <span className="font-semibold">{data.secAvg}/100</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Primary 7-Day Average Health Score Line */}
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    name={t.dailyAvgScoreLabel}
                    stroke="url(#scoreLineGlow)"
                    strokeWidth={3.5}
                    dot={{ r: 4, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2.5 }}
                  />

                  {/* Secondary comparison lines when enabled */}
                  {showPillarComparison && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="seoAvg"
                        name="SEO Score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="secAvg"
                        name="Security"
                        stroke="#eab308"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="perfAvg"
                        name="Performance"
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </>
                  )}

                  {showPillarComparison && <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Benchmark Footer Note */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  {trendMeta.benchmarkSummary}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Updated: {lastFetchedTime}</span>
              </span>
            </div>
          </div>
        )}

        {/* =========================================================
            CHART VIEW 2: Common Issues Bar Chart
           ========================================================= */}
        {activeTab === 'issues' && (
          <div className="w-full h-72 sm:h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dynamicIssuesData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.5} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  stroke="#475569"
                />
                <YAxis
                  type="category"
                  dataKey="displayName"
                  tick={{ fill: '#f8fafc', fontSize: 12 }}
                  width={160}
                  stroke="#475569"
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 text-white">
                          <p className="font-bold text-emerald-400">{data.displayName}</p>
                          <p className="text-slate-300">
                            <span className="text-slate-400">{lang === 'te' ? 'కేటగిరీ:' : 'Category:'}</span>{' '}
                            <span className="font-semibold">{data.categoryName}</span>
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-400">{lang === 'te' ? 'బాధిత సైట్లు:' : 'Affected Sites:'}</span>{' '}
                            <span className="font-semibold text-white">{data.percentage}%</span>{' '}
                            <span className="text-slate-500">({data.count.toLocaleString()} sites)</span>
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-400">{lang === 'te' ? 'తీవ్రత:' : 'Severity:'}</span>{' '}
                            <span
                              className={`font-semibold ${
                                data.impact === 'Critical' ? 'text-rose-400' : 'text-amber-400'
                              }`}
                            >
                              {data.impact}
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {dynamicIssuesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* =========================================================
            CHART VIEW 3: Audit Volume & Resolved Trend Area Chart
           ========================================================= */}
        {activeTab === 'trend' && (
          <div className="w-full h-72 sm:h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAudits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="#475569" />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  stroke="#475569"
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 text-white">
                          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">
                            {label} 2026 Overview
                          </p>
                          {payload.map((entry, index) => (
                            <div key={`entry-${index}`} className="flex items-center justify-between gap-4 text-xs">
                              <span className="flex items-center gap-1.5 text-slate-300">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                {entry.name === 'audits'
                                  ? t.auditsCount
                                  : entry.name === 'issuesFixed'
                                  ? t.resolvedCount
                                  : t.issuesCount}
                              </span>
                              <span className="font-bold text-white">
                                {Number(entry.value).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-slate-300 font-medium">
                      {value === 'audits'
                        ? t.auditsCount
                        : value === 'issuesFixed'
                        ? t.resolvedCount
                        : t.issuesCount}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="issuesFixed"
                  name="issuesFixed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
                <Area
                  type="monotone"
                  dataKey="audits"
                  name="audits"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAudits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Breakdown Badges Footer */}
      <div className="pt-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          {lang === 'te' ? 'ఆడిట్ వర్గాల వారీగా ప్రభావం & సలహాలు' : 'Category Benchmark & Fast Remediation'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMON_ISSUES_DATA.map((issue) => {
            const Icon = issue.icon;
            return (
              <div
                key={issue.issue}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${issue.color}20`, color: issue.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {lang === 'te' ? issue.issueTe : issue.issue}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'te' ? issue.categoryTe : issue.category} •{' '}
                      <span className="font-semibold text-slate-300">{issue.percentage}% prevalence</span>
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    issue.impact === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : issue.impact === 'High'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {issue.impact}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
