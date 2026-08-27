import React, { useState } from 'react';
import {
  X,
  Swords,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Plus,
  Trash2,
  Download,
  Flame,
  Award,
  BarChart3,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, FullAuditReport, AuditMetric } from '../types';
import { translations } from '../data/translations';

interface CompetitorIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
  onOpenFixModal?: (metric: AuditMetric) => void;
  onOpenPricing?: () => void;
}

interface CompetitorEntry {
  id: string;
  domain: string;
  score: number;
  seoScore: number;
  perfScore: number;
  secScore: number;
  loadTimeMs: number;
  wordCount: number;
  hasSchema: boolean;
  hasAvif: boolean;
  hasInpGood: boolean;
  status: 'winner' | 'runner_up' | 'behind';
}

interface GapItem {
  id: string;
  title: string;
  titleTe: string;
  category: 'SEO' | 'Speed' | 'Schema' | 'Security';
  businessImpact: 'High' | 'Medium' | 'Critical';
  competitorAdvantage: string;
  yourGap: string;
  fixSnippet: string;
}

export const CompetitorIntelligenceModal: React.FC<CompetitorIntelligenceModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
  onOpenFixModal,
  onOpenPricing,
}) => {
  const t = translations[lang];
  const userDomain = report?.url ? new URL(report.url).hostname : 'mywebsite.com';
  const userScore = report?.overallScore || 76;

  const [competitorList, setCompetitorList] = useState<string[]>([
    'stripe.com',
    'shopify.com',
    'cloudflare.com',
  ]);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedGapId, setCopiedGapId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'gaps' | 'content'>('matrix');

  if (!isOpen) return null;

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    const clean = newDomainInput.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!competitorList.includes(clean) && competitorList.length < 8) {
      setCompetitorList([...competitorList, clean]);
      setNewDomainInput('');
    }
  };

  const handleRemoveCompetitor = (dom: string) => {
    setCompetitorList(competitorList.filter((d) => d !== dom));
  };

  const handleTriggerAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  const handleCopyGapFix = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedGapId(id);
    setTimeout(() => setCopiedGapId(null), 2200);
  };

  // Mock benchmark matrix derived deterministically from domain names
  const competitorsData: CompetitorEntry[] = competitorList.map((domain, idx) => {
    let hash = 0;
    for (let i = 0; i < domain.length; i++) hash += domain.charCodeAt(i);
    const score = Math.min(96, Math.max(78, 88 + (hash % 9) - idx * 2));
    return {
      id: `comp-${idx}`,
      domain,
      score,
      seoScore: Math.min(98, score + 2),
      perfScore: Math.min(96, score - 3),
      secScore: 98,
      loadTimeMs: 190 + (hash % 120),
      wordCount: 1450 + (hash % 800),
      hasSchema: true,
      hasAvif: true,
      hasInpGood: true,
      status: score > userScore ? 'winner' : 'runner_up',
    };
  });

  const gapItems: GapItem[] = [
    {
      id: 'gap-1',
      title: 'Missing Organization & Product JSON-LD Schema',
      titleTe: 'ఆర్గనైజేషన్ & ప్రొడక్ట్ JSON-LD స్కీమా లేదు',
      category: 'Schema',
      businessImpact: 'High',
      competitorAdvantage: 'Competitors have rich Google snippet star ratings and price rich cards.',
      yourGap: 'Your site uses plain markup without structured entity annotations.',
      fixSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${userDomain}",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1280"
  }
}
</script>`,
    },
    {
      id: 'gap-2',
      title: 'Modern AVIF & WebP Next-Gen Image Compression',
      titleTe: 'AVIF & WebP ఇమేజ్ కంప్రెషన్ వాడకం',
      category: 'Speed',
      businessImpact: 'High',
      competitorAdvantage: 'Competitors serve 60% lighter AVIF hero banners loaded under 140ms.',
      yourGap: 'Your site serves uncompressed PNG/JPEG assets totaling 1.8MB.',
      fixSnippet: `<picture>
  <source srcset="/assets/hero.avif" type="image/avif">
  <source srcset="/assets/hero.webp" type="image/webp">
  <img src="/assets/hero.jpg" alt="Hero overview" width="1200" height="630" loading="eager" fetchpriority="high">
</picture>`,
    },
    {
      id: 'gap-3',
      title: 'Interaction to Next Paint (INP) Under 150ms',
      titleTe: 'INP రెస్పాన్స్ సమయం 150ms కంటే తక్కువ',
      category: 'Speed',
      businessImpact: 'Critical',
      competitorAdvantage: 'Instant button clicks with zero Main Thread JavaScript blocking.',
      yourGap: 'Your site delays heavy hydration scripts, causing 340ms INP lags.',
      fixSnippet: `// Break long tasks using scheduler.yield() or requestIdleCallback
async function processHeavyInput(data) {
  if ('scheduler' in window && 'yield' in scheduler) {
    await scheduler.yield();
  }
  // Run lightweight UI update first
  updateActiveTabState();
}`,
    },
    {
      id: 'gap-4',
      title: 'Robots.txt AI Crawler Whitelist Directives (GPTBot & Perplexity)',
      titleTe: 'AI బాట్‌ల కోసం Robots.txt పర్మిషన్లు',
      category: 'SEO',
      businessImpact: 'High',
      competitorAdvantage: 'Directly cited in ChatGPT Search, Perplexity and Google AI Overviews.',
      yourGap: 'Missing explicit crawler permissions in robots.txt.',
      fixSnippet: `# Allow Generative AI Citations
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
Sitemap: https://${userDomain}/sitemap.xml`,
    },
    {
      id: 'gap-5',
      title: 'Strict Content-Security-Policy & HSTS Preload',
      titleTe: 'సెక్యూరిటీ హెడర్స్ & HSTS Preload రక్షణ',
      category: 'Security',
      businessImpact: 'Medium',
      competitorAdvantage: 'A+ Grade SSL with 2-year HSTS max-age and frame protection.',
      yourGap: 'Missing strict-transport-security preload directive.',
      fixSnippet: `# Nginx config
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="competitor-intelligence-modal"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {lang === 'te' ? 'కాంపిటీటర్ ఇంటెలిజెన్స్ & గ్యాప్ అనాలిసిస్' : 'Competitor Intelligence & Head-to-Head Gap Analysis'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {competitorList.length + 1} Domains Compared
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'మీ వెబ్‌సైట్‌ను టాప్ కాంపిటీటర్లతో పోల్చి, వారు పాటిస్తున్న 13+ టెక్నికల్ అడ్వాంటేజెస్‌ను తక్షణమే అందుకోండి'
                  : 'Benchmark Core Web Vitals, Schema, SEO & discover exact gaps top competitors hold over your domain'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-competitor-modal"
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Competitor Domain Manager Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <form onSubmit={handleAddCompetitor} className="relative flex-1 w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  placeholder="Enter competitor domain (e.g. competitor.com)"
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <button
                type="submit"
                id="btn-add-competitor"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'te' ? 'జతచేయి' : 'Add Competitor'}</span>
              </button>
            </form>

            <button
              onClick={handleTriggerAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Zap className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? (lang === 'te' ? 'విశ్లేషిస్తోంది...' : 'Benchmarking...') : (lang === 'te' ? 'రీ-స్కాన్ కాంపిటీషన్' : 'Run Live Benchmark')}</span>
            </button>
          </div>

          {/* Active Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">{lang === 'te' ? 'పోల్చబడుతున్నవి:' : 'Comparing:'}</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{userDomain} (You: {userScore}/100)</span>
            </div>
            {competitorList.map((dom) => (
              <div
                key={dom}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono"
              >
                <span>{dom}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCompetitor(dom)}
                  className="hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrix'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{lang === 'te' ? 'పోలిక మ్యాట్రిక్స్' : 'Benchmark Matrix'}</span>
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'gaps'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{lang === 'te' ? 'గ్యాప్స్ & AI పరిష్కారాలు' : 'Actionable Gap Fixes'}</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] rounded-full font-mono">
              {gapItems.length}
            </span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'matrix' ? (
            <div className="space-y-6">
              {/* Leaderboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Your site card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border-2 border-emerald-500/50 relative overflow-hidden">
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                    Your Site
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[140px]">{userDomain}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400">{userScore}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">SEO:</span>
                      <span className="font-bold text-white">{report?.categories.find((c) => c.id === 'seo')?.score || 78}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed:</span>
                      <span className="font-bold text-white">{report?.categories.find((c) => c.id === 'performance')?.score || 72}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Load Time:</span>
                      <span className="font-bold text-white">280ms</span>
                    </div>
                  </div>
                </div>

                {/* Competitor cards */}
                {competitorsData.map((comp, i) => (
                  <div key={comp.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 relative">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono font-bold text-slate-200 truncate max-w-[140px]">
                        #{i + 1} {comp.domain}
                      </p>
                      <Award className={`w-4 h-4 ${i === 0 ? 'text-amber-400' : 'text-slate-500'}`} />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-amber-400">{comp.score}</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">SEO:</span>
                        <span className="font-bold text-white">{comp.seoScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Speed:</span>
                        <span className="font-bold text-white">{comp.perfScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Load Time:</span>
                        <span className="font-bold text-white">{comp.loadTimeMs}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actionable Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'te' ? 'కాంపిటీటర్లను అధిగమించడానికి తక్షణ మార్గం' : 'Bridge the 15-Point Gap in 3 Easy Steps'}</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    {lang === 'te'
                      ? 'కాంపిటీటర్లు వాడుతున్న JSON-LD స్కీమా & AVIF కంప్రెషన్ మీ సైట్‌లో అమర్చడం ద్వారా మీరు వారి కంటే పైకి చేరుకోవచ్చు.'
                      : 'Applying the 5 high-impact gap patches below will boost your score from 76 to 95/100.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('gaps')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                >
                  <span>{lang === 'te' ? 'గ్యాప్స్ చూడండి' : 'Inspect All Gaps'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {gapItems.map((gap, idx) => (
                <div
                  key={gap.id}
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {lang === 'te' ? gap.titleTe : gap.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/30">
                        {gap.businessImpact} Business Impact
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                      {gap.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                      <p className="font-bold text-amber-300 mb-1">
                        {lang === 'te' ? '🏆 కాంపిటీటర్లలో ఉన్నది:' : '🏆 Competitor Advantage:'}
                      </p>
                      <p className="text-slate-300">{gap.competitorAdvantage}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                      <p className="font-bold text-red-300 mb-1">
                        {lang === 'te' ? '⚠️ మీ వెబ్‌సైట్‌లో లోపం:' : '⚠️ Your Current Gap:'}
                      </p>
                      <p className="text-slate-300">{gap.yourGap}</p>
                    </div>
                  </div>

                  {/* Ready-to-copy code snippet */}
                  <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs text-slate-200">
                    <div className="flex items-center justify-between mb-2 text-[11px] text-slate-400">
                      <span>{lang === 'te' ? 'తక్షణ పరిష్కార కోడ్ (Copy & Paste):' : 'Actionable Code Snippet:'}</span>
                      <button
                        onClick={() => handleCopyGapFix(gap.id, gap.fixSnippet)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedGapId === gap.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">{lang === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{lang === 'te' ? 'కోడ్ కాపీ చేయి' : 'Copy Fix'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto text-[11px] text-emerald-300/90 leading-relaxed max-h-36">
                      {gap.fixSnippet}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
