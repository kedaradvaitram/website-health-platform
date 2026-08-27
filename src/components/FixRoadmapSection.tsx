import React, { useState, useMemo } from 'react';
import {
  Flame,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Code2,
  Wrench,
  Zap,
  ArrowRight,
  FileCode,
  Layers,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Download,
  Copy,
  Check,
  Users,
} from 'lucide-react';
import { AuditMetric, Language, FullAuditReport } from '../types';
import { translations } from '../data/translations';
import confetti from 'canvas-confetti';

interface FixRoadmapSectionProps {
  report: FullAuditReport;
  lang: Language;
  onOpenFixModal?: (metric: AuditMetric) => void;
  onOpenAutoFix?: (metric?: AuditMetric) => void;
  onOpenPricing?: (planId?: 'quick' | 'pro' | 'complete' | 'business') => void;
  onOpenTeamWorkspace?: () => void;
}

type RoadmapTab = 'all' | 'p0' | 'p1' | 'p2' | 'good';

export const FixRoadmapSection: React.FC<FixRoadmapSectionProps> = ({
  report,
  lang,
  onOpenFixModal,
  onOpenAutoFix,
  onOpenPricing,
  onOpenTeamWorkspace,
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<RoadmapTab>('all');
  const [copiedMetricId, setCopiedMetricId] = useState<string | null>(null);

  // Group metrics from categories (isolated strictly to targeted module if a specific section was requested)
  const isTargeted = Boolean(report.targetAuditModule && report.targetAuditModule !== 'all');

  const allMetrics = useMemo(() => {
    if (!report.categories) return [];
    let relevantCats = report.categories;
    if (isTargeted) {
      if (report.targetAuditModule === 'seo') {
        relevantCats = report.categories.filter((c) => c.id === 'seo' || c.id === 'tech-seo' || c.id === 'ai-geo');
      } else if (report.targetAuditModule === 'performance' || report.targetAuditModule === 'vitals') {
        relevantCats = report.categories.filter((c) => c.id === 'performance' || c.id === 'mobile');
      } else if (report.targetAuditModule === 'security' || report.targetAuditModule === 'ssl') {
        relevantCats = report.categories.filter((c) => c.id === 'security' || c.id === 'dns');
      } else if (report.targetAuditModule === 'accessibility') {
        relevantCats = report.categories.filter((c) => c.id === 'accessibility');
      }
    }
    return relevantCats.flatMap((cat) =>
      cat.metrics.map((m) => ({
        ...m,
        categoryName: cat.name,
        categoryNameTe: cat.nameTe,
        categoryId: cat.id,
      }))
    );
  }, [report.categories, isTargeted, report.targetAuditModule]);

  // Buckets for Fix Roadmap
  const p0Metrics = useMemo(() => {
    return allMetrics.filter((m) => m.status === 'error' || m.priority === 'P0');
  }, [allMetrics]);

  const p1Metrics = useMemo(() => {
    return allMetrics.filter(
      (m) =>
        m.status === 'warning' &&
        m.priority === 'P1' &&
        !p0Metrics.some((p) => p.id === m.id)
    );
  }, [allMetrics, p0Metrics]);

  const p2Metrics = useMemo(() => {
    return allMetrics.filter(
      (m) =>
        (m.status === 'warning' || (m.status !== 'error' && m.score < 90)) &&
        !p0Metrics.some((p) => p.id === m.id) &&
        !p1Metrics.some((p) => p.id === m.id)
    );
  }, [allMetrics, p0Metrics, p1Metrics]);

  const goodMetrics = useMemo(() => {
    return allMetrics.filter(
      (m) =>
        m.status === 'good' &&
        !p0Metrics.some((p) => p.id === m.id) &&
        !p1Metrics.some((p) => p.id === m.id) &&
        !p2Metrics.some((p) => p.id === m.id)
    );
  }, [allMetrics, p0Metrics, p1Metrics, p2Metrics]);

  const totalIssues = p0Metrics.length + p1Metrics.length + p2Metrics.length;

  const handleCopyCode = (metric: AuditMetric) => {
    const code =
      metric.personaFixes?.developer?.codeSnippet ||
      metric.fixSnippet?.code ||
      `<!-- Fix for ${metric.name} -->\n<!-- Add recommended configuration -->`;
    navigator.clipboard.writeText(code);
    setCopiedMetricId(metric.id);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopiedMetricId(null), 2000);
  };

  const handleDownloadFixFile = (metric: AuditMetric) => {
    const code =
      metric.personaFixes?.developer?.codeSnippet ||
      metric.fixSnippet?.code ||
      `// Fix configuration for ${metric.name}\n`;
    const targetFile = metric.fixSnippet?.fileTarget || `${metric.id}-fix.txt`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetFile.includes('/') ? targetFile.split('/').pop() || 'fix.txt' : targetFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="fix-roadmap-section" className="pt-6 border-t-2 border-slate-800 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border-2 border-rose-700 shadow-xs">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-500/30" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{t.fixRoadmapTitle || 'Fix Roadmap: What to Fix First'}</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                {totalIssues} {t.issuesDetected || 'Issues Detected'}
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {lang === 'te'
              ? 'మీ వెబ్‌సైట్‌లో గుర్తించబడిన సమస్యలను ప్రాధాన్యతా క్రమంలో క్రమబద్ధీకరించాము. తక్షణ ర్యాంకింగ్ & సెక్యూరిటీ మెరుగుదల కోసం "ముందుగా పరిష్కరించండి" నుండి ప్రారంభించండి.'
              : 'Zero confusion prioritized execution order: Fix urgent blocking issues first (P0), followed by high-impact SEO & mobile issues (P1), then optimization polishes (P2).'}
          </p>
        </div>

        {/* Action CTAs: Team Workspace & 1-Click Batch Fix */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onOpenTeamWorkspace && (
            <button
              type="button"
              onClick={onOpenTeamWorkspace}
              className="inline-flex items-center space-x-1.5 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 font-bold px-3 py-2.5 rounded-xl text-xs border border-indigo-700 transition-all cursor-pointer shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.collaborateInTeam || 'Collaborate in Team'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => (onOpenPricing ? onOpenPricing('pro') : onOpenAutoFix ? onOpenAutoFix() : null)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer border border-indigo-400"
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>{t.autoFixAllIssues1Click || 'Auto-Fix All Issues (1-Click)'}</span>
          </button>
        </div>
      </div>

      {/* 4 Priority Bucket Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* P0 Critical Button */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'p0' ? 'all' : 'p0')}
          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between space-y-2 ${
            activeTab === 'p0'
              ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/30'
              : 'bg-slate-900/90 border-rose-900/50 hover:border-rose-500 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-950 text-rose-200 border-2 border-rose-500">
              {t.fixFirstP0 || '🔴 Fix First (P0)'}
            </span>
            <span className="font-mono font-black text-rose-400 text-base">{p0Metrics.length}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {t.criticalBlockers || 'Critical Blockers'}
            </span>
            <span className="text-[11px] text-slate-400">
              {t.fixWithin24h || 'Fix within 24h'}
            </span>
          </div>
        </button>

        {/* P1 High Button */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'p1' ? 'all' : 'p1')}
          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between space-y-2 ${
            activeTab === 'p1'
              ? 'bg-orange-950/80 border-orange-500 shadow-lg shadow-orange-500/20 ring-2 ring-orange-500/30'
              : 'bg-slate-900/90 border-orange-900/50 hover:border-orange-500 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-950 text-orange-200 border-2 border-orange-500">
              {t.fixNextP1 || '🟠 Fix Next (P1)'}
            </span>
            <span className="font-mono font-black text-orange-400 text-base">{p1Metrics.length}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {t.highImpactSeo || 'High Impact SEO'}
            </span>
            <span className="text-[11px] text-slate-400">
              {t.rankingsBoost || 'Rankings boost'}
            </span>
          </div>
        </button>

        {/* P2 Optimization Button */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'p2' ? 'all' : 'p2')}
          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between space-y-2 ${
            activeTab === 'p2'
              ? 'bg-amber-950/80 border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/30'
              : 'bg-slate-900/90 border-amber-900/50 hover:border-amber-500 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-950 text-amber-200 border-2 border-amber-500">
              {t.optimizeP2 || '🟡 Optimize (P2)'}
            </span>
            <span className="font-mono font-black text-amber-400 text-base">{p2Metrics.length}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {t.speedAndTags || 'Speed & Tags'}
            </span>
            <span className="text-[11px] text-slate-400">
              {t.fineTuning || 'Fine-tuning'}
            </span>
          </div>
        </button>

        {/* Good / Passed Button */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'good' ? 'all' : 'good')}
          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between space-y-2 ${
            activeTab === 'good'
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30'
              : 'bg-slate-900/90 border-emerald-900/50 hover:border-emerald-500 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-200 border-2 border-emerald-500">
              {t.alreadyGoodPassed || '🟢 Already Good'}
            </span>
            <span className="font-mono font-black text-emerald-400 text-base">{goodMetrics.length}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {t.passedChecks || 'Passed Checks'}
            </span>
            <span className="text-[11px] text-slate-400">
              {t.zeroActionNeeded || 'Zero action needed'}
            </span>
          </div>
        </button>
      </div>

      {/* ROADMAP LISTINGS */}
      <div className="space-y-4">
        {/* 1. FIX FIRST (P0 Critical) */}
        {(activeTab === 'all' || activeTab === 'p0') && p0Metrics.length > 0 && (
          <div className="bg-rose-950/30 rounded-3xl p-4 sm:p-5 border-2 border-rose-500 shadow-lg shadow-rose-950/40 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm sm:text-base font-black text-rose-200">
                  {t.fixFirstP0 || '1. Fix First (Critical Blockers — P0)'}
                </h4>
              </div>
              <span className="text-xs font-mono font-black text-rose-200 bg-rose-950 px-2.5 py-0.5 rounded-full border-2 border-rose-500">
                {p0Metrics.length} {t.criticalBlockers || 'Critical Items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {p0Metrics.map((metric) => (
                <RoadmapMetricCard
                  key={metric.id}
                  metric={metric}
                  lang={lang}
                  priorityBadge={t.priorityP0 || '🔴 P0 Critical'}
                  badgeBg="bg-rose-950/90 text-rose-200 border-2 border-rose-500"
                  copiedMetricId={copiedMetricId}
                  onCopyCode={() => handleCopyCode(metric)}
                  onDownloadFile={() => handleDownloadFixFile(metric)}
                  onOpenFixModal={() => onOpenFixModal?.(metric)}
                  onOpenAutoFix={() => (onOpenAutoFix ? onOpenAutoFix(metric) : onOpenPricing ? onOpenPricing('quick') : null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. FIX NEXT (P1 High) */}
        {(activeTab === 'all' || activeTab === 'p1') && p1Metrics.length > 0 && (
          <div className="bg-orange-950/30 rounded-3xl p-4 sm:p-5 border-2 border-orange-500 shadow-lg shadow-orange-950/40 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <h4 className="text-sm sm:text-base font-black text-orange-200">
                  {t.fixNextP1 || '2. Fix Next (High Priority SEO & Core Web Vitals — P1)'}
                </h4>
              </div>
              <span className="text-xs font-mono font-black text-orange-200 bg-orange-950 px-2.5 py-0.5 rounded-full border-2 border-orange-500">
                {p1Metrics.length} {t.highImpactSeo || 'High Priority Items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {p1Metrics.map((metric) => (
                <RoadmapMetricCard
                  key={metric.id}
                  metric={metric}
                  lang={lang}
                  priorityBadge={t.priorityP1 || '🟠 P1 High'}
                  badgeBg="bg-orange-950/90 text-orange-200 border-2 border-orange-500"
                  copiedMetricId={copiedMetricId}
                  onCopyCode={() => handleCopyCode(metric)}
                  onDownloadFile={() => handleDownloadFixFile(metric)}
                  onOpenFixModal={() => onOpenFixModal?.(metric)}
                  onOpenAutoFix={() => (onOpenAutoFix ? onOpenAutoFix(metric) : onOpenPricing ? onOpenPricing('pro') : null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. OPTIMIZATION (P2 Medium / Low) */}
        {(activeTab === 'all' || activeTab === 'p2') && p2Metrics.length > 0 && (
          <div className="bg-amber-950/30 rounded-3xl p-4 sm:p-5 border-2 border-amber-500 shadow-lg shadow-amber-950/40 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm sm:text-base font-black text-amber-200">
                  {t.optimizeP2 || '3. Optimization & Fine-Tuning (P2)'}
                </h4>
              </div>
              <span className="text-xs font-mono font-black text-amber-200 bg-amber-950 px-2.5 py-0.5 rounded-full border-2 border-amber-500">
                {p2Metrics.length} {t.speedAndTags || 'Optimization Items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {p2Metrics.map((metric) => (
                <RoadmapMetricCard
                  key={metric.id}
                  metric={metric}
                  lang={lang}
                  priorityBadge={t.priorityP2 || '🟡 P2 Medium'}
                  badgeBg="bg-amber-950/90 text-amber-200 border-2 border-amber-500"
                  copiedMetricId={copiedMetricId}
                  onCopyCode={() => handleCopyCode(metric)}
                  onDownloadFile={() => handleDownloadFixFile(metric)}
                  onOpenFixModal={() => onOpenFixModal?.(metric)}
                  onOpenAutoFix={() => (onOpenAutoFix ? onOpenAutoFix(metric) : onOpenPricing ? onOpenPricing('quick') : null)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. ALREADY GOOD (Passed checks) */}
        {(activeTab === 'all' || activeTab === 'good') && goodMetrics.length > 0 && (
          <div className="bg-emerald-950/30 rounded-3xl p-4 sm:p-5 border-2 border-emerald-500 shadow-lg shadow-emerald-950/40 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm sm:text-base font-black text-emerald-200">
                  {t.alreadyGoodPassed || '4. Already Good (Passed Compliance Checks)'}
                </h4>
              </div>
              <span className="text-xs font-mono font-black text-emerald-200 bg-emerald-950 px-2.5 py-0.5 rounded-full border-2 border-emerald-500">
                {goodMetrics.length} {t.passedChecks || 'Passed Checks'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {goodMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-slate-950/80 rounded-xl p-3 border-2 border-emerald-500/50 hover:border-emerald-400 flex items-center space-x-2.5 shadow-2xs transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {lang === 'te' && metric.nameTe ? metric.nameTe : metric.name}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 font-mono font-bold">
                      {metric.value || '100% Passed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface RoadmapMetricCardProps {
  metric: AuditMetric & { categoryName?: string; categoryNameTe?: string };
  lang: Language;
  priorityBadge: string;
  badgeBg: string;
  copiedMetricId: string | null;
  onCopyCode: () => void;
  onDownloadFile: () => void;
  onOpenFixModal: () => void;
  onOpenAutoFix: () => void;
}

const RoadmapMetricCard: React.FC<RoadmapMetricCardProps> = ({
  metric,
  lang,
  priorityBadge,
  badgeBg,
  copiedMetricId,
  onCopyCode,
  onDownloadFile,
  onOpenFixModal,
  onOpenAutoFix,
}) => {
  const t = translations[lang] || translations.en;
  const problemText =
    lang === 'te' && metric.problemTe
      ? metric.problemTe
      : metric.problem || metric.descriptionTe || metric.description;

  const targetFile =
    metric.personaFixes?.developer?.fileTarget ||
    metric.fixSnippet?.fileTarget ||
    'HTML <head> / Web Server';

  const isCopied = copiedMetricId === metric.id;

  const isP0 = priorityBadge.includes('P0');
  const isP1 = priorityBadge.includes('P1');
  const isP2 = priorityBadge.includes('P2');

  const cardBorder = isP0
    ? 'border-2 border-rose-500/80 hover:border-rose-400 bg-slate-950/80 shadow-md shadow-rose-950/30'
    : isP1
    ? 'border-2 border-orange-500/80 hover:border-orange-400 bg-slate-950/80 shadow-md shadow-orange-950/30'
    : isP2
    ? 'border-2 border-amber-500/80 hover:border-amber-400 bg-slate-950/80 shadow-md shadow-amber-950/30'
    : 'border-2 border-slate-800 hover:border-slate-700 bg-slate-950/60';

  return (
    <div className={`rounded-2xl p-4 space-y-3 shadow-xs transition-all flex flex-col justify-between ${cardBorder}`}>
      <div className="space-y-2">
        {/* Header row: Badge, Score Impact, Category */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${badgeBg}`}>
              {priorityBadge}
            </span>
            {metric.categoryName && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border-2 border-slate-700">
                {lang === 'te' && metric.categoryNameTe ? metric.categoryNameTe : metric.categoryName}
              </span>
            )}
          </div>
          {metric.scoreImpact && (
            <span className="text-[10px] font-black text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-md border-2 border-emerald-500">
              +{metric.scoreImpact} pts
            </span>
          )}
        </div>

        {/* Metric Name */}
        <h5 className="text-xs sm:text-sm font-black text-white leading-snug">
          {lang === 'te' && metric.nameTe ? metric.nameTe : metric.name}
        </h5>

        {/* Problem summary */}
        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium">
          {problemText}
        </p>

        {/* Where to fix tag */}
        <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono pt-1">
          <span className="font-bold text-slate-300">Target:</span>
          <span className="bg-slate-900 px-1.5 py-0.5 rounded border-2 border-slate-700 text-slate-300 truncate max-w-[200px]">
            {targetFile}
          </span>
        </div>
      </div>

      {/* Action Buttons: View Fix, Copy Code, Download File, 1-Click Fix */}
      <div className="pt-2.5 border-t-2 border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={onOpenFixModal}
          className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-2xs border-2 border-slate-600 hover:border-amber-400"
          title="Open complete Problem, Why, and Fix guide"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.howToFix || 'How to Fix'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Quick Copy Code */}
          <button
            type="button"
            onClick={onCopyCode}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer border-2 border-slate-700 hover:border-slate-500"
            title={t.copyCode || 'Copy fix snippet'}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Download File */}
          <button
            type="button"
            onClick={onDownloadFile}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer border-2 border-slate-700 hover:border-slate-500"
            title="Download ready-to-use fix file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Auto Fix Button */}
          <button
            type="button"
            onClick={onOpenAutoFix}
            className="inline-flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-xs transition-all shadow-2xs cursor-pointer border-2 border-amber-300"
            title={t.autoFix || 'Automated Fix'}
          >
            <Zap className="w-3 h-3 fill-slate-950 text-slate-950" />
            <span>{t.autoFix || 'Auto-Fix'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
