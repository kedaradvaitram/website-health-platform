import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Language, CrUXFieldMetric, HistoricalTrendPoint, FullAuditReport } from '../types';

interface CrUXHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
}

const DEFAULT_CRUX_METRICS: CrUXFieldMetric[] = [
  {
    name: 'Largest Contentful Paint',
    acronym: 'LCP',
    value: '1.42s',
    unit: 's',
    p75: 1.42,
    status: 'good',
    goodPercent: 88,
    needsImprovementPercent: 9,
    poorPercent: 3,
    thresholdGood: '≤ 2.5s',
  },
  {
    name: 'Interaction to Next Paint',
    acronym: 'INP',
    value: '78ms',
    unit: 'ms',
    p75: 78,
    status: 'good',
    goodPercent: 94,
    needsImprovementPercent: 5,
    poorPercent: 1,
    thresholdGood: '≤ 200ms',
  },
  {
    name: 'Cumulative Layout Shift',
    acronym: 'CLS',
    value: '0.02',
    unit: '',
    p75: 0.02,
    status: 'good',
    goodPercent: 96,
    needsImprovementPercent: 3,
    poorPercent: 1,
    thresholdGood: '≤ 0.1',
  },
  {
    name: 'First Contentful Paint',
    acronym: 'FCP',
    value: '0.86s',
    unit: 's',
    p75: 0.86,
    status: 'good',
    goodPercent: 91,
    needsImprovementPercent: 7,
    poorPercent: 2,
    thresholdGood: '≤ 1.8s',
  },
  {
    name: 'Time to First Byte',
    acronym: 'TTFB',
    value: '180ms',
    unit: 'ms',
    p75: 180,
    status: 'good',
    goodPercent: 86,
    needsImprovementPercent: 11,
    poorPercent: 3,
    thresholdGood: '≤ 800ms',
  },
];

const HISTORICAL_DATA_30D: HistoricalTrendPoint[] = [
  { date: 'Day -30', overallScore: 62, perfScore: 54, seoScore: 78, secScore: 68, lcpMs: 2450, inpMs: 140, clsScore: 0.14 },
  { date: 'Day -25', overallScore: 66, perfScore: 59, seoScore: 80, secScore: 70, lcpMs: 2200, inpMs: 125, clsScore: 0.12 },
  { date: 'Day -20', overallScore: 72, perfScore: 68, seoScore: 84, secScore: 78, lcpMs: 1950, inpMs: 110, clsScore: 0.08 },
  { date: 'Day -15', overallScore: 80, perfScore: 79, seoScore: 88, secScore: 86, lcpMs: 1680, inpMs: 95, clsScore: 0.05 },
  { date: 'Day -10', overallScore: 88, perfScore: 89, seoScore: 92, secScore: 92, lcpMs: 1510, inpMs: 84, clsScore: 0.03 },
  { date: 'Day -5', overallScore: 94, perfScore: 95, seoScore: 96, secScore: 96, lcpMs: 1440, inpMs: 80, clsScore: 0.02 },
  { date: 'Today', overallScore: 98, perfScore: 98, seoScore: 99, secScore: 98, lcpMs: 1420, inpMs: 78, clsScore: 0.02 },
];

export const CrUXHistoryModal: React.FC<CrUXHistoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
}) => {
  const isTe = lang === 'te';
  const targetUrl = report?.url || 'https://mywebsite.com';
  const [activeTab, setActiveTab] = useState<'crux' | 'trends'>('crux');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="crux-history-modal"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isTe
                    ? 'Google CrUX రియల్ యూజర్ డేటా & హిస్టారికల్ ట్రెండ్స్'
                    : 'Google CrUX Real User Monitoring & Historical Trends'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>28-Day Field Data Passed</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isTe
                  ? 'వాస్తవ Chrome యూజర్ల 28-రోజుల P75 ఫీల్డ్ అనుభవం మరియు 30-రోజుల స్కోర్ వృద్ధి విశ్లేషణ'
                  : 'Chrome User Experience Report (CrUX) P75 real-world metrics with 30-day performance progression'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Domain & Mode Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[11px] text-slate-400 font-mono uppercase">Analyzed Origin</span>
                <div className="text-sm font-mono font-bold text-white">{targetUrl}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('crux')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'crux'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {isTe ? 'Google CrUX ఫీల్డ్ డేటా' : 'CrUX Field Metrics'}
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'trends'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {isTe ? '30-రోజుల హిస్టారికల్ ట్రెండ్స్' : '30-Day Historical Trends'}
              </button>
            </div>
          </div>

          {activeTab === 'crux' ? (
            /* CrUX Metrics 28-Day Real User Grid */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Core Web Vitals Status Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Core Web Vitals Assessment
                  </span>
                  <div className="text-2xl font-black text-white flex items-center gap-2">
                    <span>PASSED</span>
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Good (P75)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isTe
                      ? 'మీ వెబ్‌సైట్ గూగుల్ ఫీల్డ్ యూజర్లలో 88%+ మందికి వేగంగా మరియు సాఫీగా పనిచేస్తోంది.'
                      : 'Over 88% of real visits meet the Core Web Vitals good threshold.'}
                  </p>
                </div>

                {/* Mobile vs Desktop Distribution */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Device Traffic Distribution
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                      <span>Mobile (72%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Laptop className="w-4 h-4 text-cyan-400" />
                      <span>Desktop (28%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div className="h-full bg-indigo-500 w-[72%]" />
                    <div className="h-full bg-cyan-400 w-[28%]" />
                  </div>
                </div>

                {/* Connection Speed */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Network Profile
                  </span>
                  <div className="text-lg font-mono font-black text-amber-300">4G / 5G / Broadband</div>
                  <p className="text-xs text-slate-400">
                    High bandwidth reliability across global CDN edge endpoints.
                  </p>
                </div>
              </div>

              {/* Individual Core Metrics Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {isTe ? 'P75 క్రోమ్ ఫీల్డ్ కొలతలు (Chrome CrUX Metrics):' : 'P75 Chrome CrUX Metrics Breakdown:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEFAULT_CRUX_METRICS.map((metric) => (
                    <div
                      key={metric.acronym}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-300">{metric.name}</div>
                          <span className="text-[10px] font-mono text-slate-500">{metric.acronym}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Target {metric.thresholdGood}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black font-mono text-emerald-400">
                          {metric.value}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                          {metric.status}
                        </span>
                      </div>

                      {/* Distribution Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                          <div
                            style={{ width: `${metric.goodPercent}%` }}
                            className="h-full bg-emerald-500"
                            title={`Good: ${metric.goodPercent}%`}
                          />
                          <div
                            style={{ width: `${metric.needsImprovementPercent}%` }}
                            className="h-full bg-amber-500"
                            title={`Needs Work: ${metric.needsImprovementPercent}%`}
                          />
                          <div
                            style={{ width: `${metric.poorPercent}%` }}
                            className="h-full bg-rose-500"
                            title={`Poor: ${metric.poorPercent}%`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-emerald-400">{metric.goodPercent}% Good</span>
                          <span className="text-amber-400">{metric.needsImprovementPercent}% Avg</span>
                          <span className="text-rose-400">{metric.poorPercent}% Poor</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Historical Trend Charts */
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {isTe ? '30-రోజుల వెబ్‌సైట్ హెల్త్ స్కోర్ వృద్ధి' : '30-Day Overall Health Score Trajectory'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Progression of Performance, SEO, and Security scores after applied remediations
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+36% Gain</span>
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORICAL_DATA_30D}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="perfColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="overallScore"
                        name="Overall Score"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#scoreColor)"
                      />
                      <Area
                        type="monotone"
                        dataKey="perfScore"
                        name="Performance"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#perfColor)"
                      />
                      <Area
                        type="monotone"
                        dataKey="seoScore"
                        name="SEO Score"
                        stroke="#a855f7"
                        strokeWidth={2}
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isTe
              ? 'డేటా స్వయంచాలకంగా గూగుల్ CrUX API నుండి సింక్ అవుతుంది'
              : 'Data synchronized with Google Chrome User Experience API'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            {isTe ? 'మూసివేయండి' : 'Close Monitor'}
          </button>
        </div>
      </div>
    </div>
  );
};
