import React, { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  ExternalLink,
  Award,
  Search,
  Layers,
  Sparkles,
  Download,
  Globe,
  ArrowRight,
  Bot,
  Smartphone,
} from 'lucide-react';
import { FullAuditReport, Language } from '../types';
import { translations } from '../data/translations';
import { generateAuditReport, SAMPLE_URLS } from '../data/auditEngine';
import { AnimatedScore } from './AnimatedScore';

interface AuditComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  reportA: FullAuditReport;
  reportB?: FullAuditReport | null;
  history?: FullAuditReport[];
}

const POPULAR_BENCHMARKS = [
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'Shopify', url: 'https://shopify.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Apple', url: 'https://apple.com' },
];

export const AuditComparisonModal: React.FC<AuditComparisonModalProps> = ({
  isOpen,
  onClose,
  lang,
  reportA,
  reportB: initialReportB,
  history = [],
}) => {
  const t = translations[lang];
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [currentReportB, setCurrentReportB] = useState<FullAuditReport>(() => {
    if (initialReportB) return initialReportB;
    if (history.length > 1 && history[1].id !== reportA.id) return history[1];
    return generateAuditReport('https://stripe.com');
  });

  if (!isOpen || !reportA) return null;

  const handleCompareCompetitor = (urlToCompare: string) => {
    let formatted = urlToCompare.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    const generated = generateAuditReport(formatted);
    setCurrentReportB(generated);
  };

  const reportB = currentReportB;

  const compareRows = [
    {
      title: 'Overall Health Grade',
      titleTe: 'మొత్తం వెబ్‌సైట్ హెల్త్ స్కోర్',
      valA: reportA.overallScore,
      valB: reportB.overallScore,
      unit: '/100',
      isHigherBetter: true,
      icon: Award,
    },
    {
      title: 'SEO & Search Indexing',
      titleTe: 'ఎస్‌ఈఓ మరియు సెర్చ్ ఇండెక్సింగ్ స్కోర్',
      valA: reportA.seoScore,
      valB: reportB.seoScore,
      unit: '/100',
      isHigherBetter: true,
      icon: Search,
    },
    {
      title: 'AI SEO & GEO Readiness',
      titleTe: 'AI SEO & GEO సంసిద్ధత (AEO)',
      valA: reportA.aiScore || 88,
      valB: reportB.aiScore || 85,
      unit: '/100',
      isHigherBetter: true,
      icon: Bot,
    },
    {
      title: 'Mobile & Responsive Audit',
      titleTe: 'మొబైల్ ఆడిట్ & రెస్పాన్సివ్',
      valA: reportA.mobileScore || 92,
      valB: reportB.mobileScore || 90,
      unit: '/100',
      isHigherBetter: true,
      icon: Smartphone,
    },
    {
      title: 'Performance & Speed',
      titleTe: 'స్పీడ్ మరియు పెర్ఫార్మెన్స్ స్కోర్',
      valA: reportA.perfScore,
      valB: reportB.perfScore,
      unit: '/100',
      isHigherBetter: true,
      icon: Zap,
    },
    {
      title: 'Security & SSL TLS',
      titleTe: 'సెక్యూరిటీ మరియు ఎస్‌ఎస్‌ఎల్ ఎన్‌క్రిప్షన్',
      valA: reportA.secScore,
      valB: reportB.secScore,
      unit: '/100',
      isHigherBetter: true,
      icon: ShieldCheck,
    },
    {
      title: 'Accessibility Compliance',
      titleTe: 'యాక్సెసిబిలిటీ (WCAG) స్కోర్',
      valA: reportA.accScore,
      valB: reportB.accScore,
      unit: '/100',
      isHigherBetter: true,
      icon: Layers,
    },
    {
      title: 'Modern Best Practices',
      titleTe: 'మోడరన్ బెస్ట్ ప్రాక్టీసెస్',
      valA: reportA.bestPracticesScore,
      valB: reportB.bestPracticesScore,
      unit: '/100',
      isHigherBetter: true,
      icon: Sparkles,
    },
    {
      title: 'Network Latency',
      titleTe: 'నెట్‌వర్క్ లేటెన్సీ (TTFB)',
      valA: reportA.latencyMs || 180,
      valB: reportB.latencyMs || 164,
      unit: ' ms',
      isHigherBetter: false,
      icon: Zap,
    },
  ];

  const diffOverall = reportA.overallScore - reportB.overallScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>{lang === 'te' ? 'ఆడిట్ సైడ్-బై-సైడ్ పోలిక' : 'Website Comparison Engine'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Side-by-Side
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'te'
                  ? 'రెండు వేర్వేరు వెబ్‌సైట్లు లేదా ఆడిట్ల మధ్య మెట్రిక్స్ మరియు స్కోర్ తేడాల విశ్లేషణ'
                  : 'Compare critical SEO, speed, security, and accessibility metrics with competitors or past audits'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Competitor / Benchmark Input Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'te' ? 'పోల్చడానికి పోటీదారు URL నమోదు చేయండి (ఉదా. flipkart.com)' : 'Enter competitor URL to compare (e.g. stripe.com, shopify.com)...'}
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && competitorUrl) {
                    handleCompareCompetitor(competitorUrl);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => competitorUrl && handleCompareCompetitor(competitorUrl)}
              disabled={!competitorUrl.trim()}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>{lang === 'te' ? 'పోల్చండి' : 'Compare'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Benchmark Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500">
              {lang === 'te' ? 'శీఘ్ర ప్రమాణాలు:' : 'Quick Benchmarks:'}
            </span>
            {POPULAR_BENCHMARKS.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  setCompetitorUrl(b.url);
                  handleCompareCompetitor(b.url);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  reportB.hostname.includes(b.name.toLowerCase())
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {b.name}
              </button>
            ))}
            {history.length > 1 && (
              <button
                onClick={() => {
                  const prev = history.find((h) => h.id !== reportA.id);
                  if (prev) setCurrentReportB(prev);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              >
                {lang === 'te' ? 'గత స్కాన్' : 'Previous Scan'}
              </button>
            )}
          </div>
        </div>

        {/* Websites Header Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/30 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Your Website (Target A)
              </span>
              {diffOverall >= 0 ? (
                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                  Leader ⭐
                </span>
              ) : null}
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              {reportA.hostname}
            </h4>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                <AnimatedScore value={reportA.overallScore} />
              </span>
              <span className="text-xs text-slate-500 font-bold">/ 100</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/30 border border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                Competitor (Target B)
              </span>
              {diffOverall < 0 ? (
                <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  Leader ⭐
                </span>
              ) : null}
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              {reportB.hostname}
            </h4>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-indigo-700">
                <AnimatedScore value={reportB.overallScore} />
              </span>
              <span className="text-xs text-slate-500 font-bold">/ 100</span>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] sm:text-xs">
              <tr>
                <th className="p-3.5">Metric Dimension</th>
                <th className="p-3.5 text-center">{reportA.hostname}</th>
                <th className="p-3.5 text-center">{reportB.hostname}</th>
                <th className="p-3.5 text-right">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {compareRows.map((row, idx) => {
                const diff = row.valA - row.valB;
                const isPositive = row.isHigherBetter ? diff > 0 : diff < 0;
                const isNeutral = diff === 0;

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-800 flex items-center space-x-2">
                      <row.icon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{lang === 'te' ? row.titleTe : row.title}</span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                      <AnimatedScore value={row.valA} />
                      <span className="text-slate-400 font-normal">{row.unit}</span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                      <AnimatedScore value={row.valB} />
                      <span className="text-slate-400 font-normal">{row.unit}</span>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      {isNeutral ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          <Minus className="w-3 h-3 mr-1" />
                          Tied
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {isPositive ? `+${Math.abs(diff)}` : `-${Math.abs(diff)}`}
                          {row.unit}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {diffOverall >= 0
              ? `🎉 Your website scores ${diffOverall} points higher than ${reportB.hostname}!`
              : `⚠️ ${reportB.hostname} leads by ${Math.abs(diffOverall)} points. Apply quick fixes to outrank them.`}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
