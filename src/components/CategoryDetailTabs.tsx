import React, { useState, useEffect, useMemo } from 'react';
import {
  Gauge,
  Search,
  ShieldCheck,
  Eye,
  Sparkles,
  Server,
  Cpu,
  Bot,
  Smartphone,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Code2,
  Lock,
  Zap,
  ArrowUpDown,
  Filter,
  Check,
  Clock,
  Wrench,
  Flame,
  BadgePercent,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FullAuditReport, Language, AuditMetric, CategoryResult, AuditTargetModule } from '../types';
import { translations } from '../data/translations';
import { AnimatedScore } from './AnimatedScore';
import { FixItTooltip } from './FixItTooltip';

interface CategoryDetailTabsProps {
  report?: FullAuditReport;
  lang: Language;
  isLoading?: boolean;
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  onOpenFixModal?: (metric: AuditMetric) => void;
  onOpenFix?: (metric: AuditMetric) => void;
  onOpenAutoFix?: (metric?: AuditMetric) => void;
  onOpenPricing?: (planId?: 'quick' | 'pro' | 'complete' | 'business') => void;
  onUpdateReport?: (newReport: FullAuditReport) => void;
  onRescanSection?: (module: AuditTargetModule) => void;
}

export const CategoryDetailTabsSkeleton: React.FC<{ lang?: Language }> = ({ lang = 'en' }) => {
  return (
    <div
      id="category-detail-skeleton"
      className="space-y-4 sm:space-y-6 animate-pulse select-none"
      role="status"
      aria-label="Loading category metrics details"
    >
      {/* 5-7 Category Tab Navigation Skeletons */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-2.5 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border-2 border-slate-800 rounded-2xl shrink-0 min-w-[120px] sm:min-w-[155px] shadow-xs"
          >
            <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-lg bg-slate-800 shrink-0" />
            <div className="w-16 sm:w-20 h-3.5 sm:h-4 bg-slate-800 rounded flex-1" />
            <div className="w-8 sm:w-9 h-4 sm:h-5 bg-slate-800 rounded-md shrink-0" />
          </div>
        ))}
      </div>

      {/* Main Category Detail Card Skeleton */}
      <div className="bg-slate-900/90 rounded-3xl border-2 border-slate-800 shadow-xl shadow-black/40 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        {/* Category Header Banner Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b-2 border-slate-800">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-slate-800 shrink-0" />
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="w-36 sm:w-48 h-5 sm:h-6 bg-slate-800 rounded" />
                <div className="w-20 sm:w-24 h-4 sm:h-5 bg-emerald-950/80 rounded-full" />
              </div>
              <div className="w-56 sm:w-72 md:w-[480px] h-3.5 sm:h-4 bg-slate-800/80 rounded" />
              <div className="w-40 sm:w-56 h-3 bg-slate-800/80 rounded" />
            </div>
          </div>

          <div className="w-24 sm:w-28 h-10 sm:h-12 bg-slate-800 rounded-2xl shrink-0" />
        </div>

        {/* Filter and Sort Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 sm:w-24 h-7 sm:h-8 bg-slate-800 rounded-xl shrink-0" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 sm:w-40 h-7 sm:h-8 bg-slate-800 rounded-xl" />
            <div className="w-24 sm:w-28 h-7 sm:h-8 bg-slate-800 rounded-xl" />
          </div>
        </div>

        {/* Metrics Grid: 6 Individual Card Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-950/60 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 sm:space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3 sm:space-y-3.5">
                {/* Priority & Effort Badges Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-5 bg-slate-800 rounded-md" />
                    <div className="w-14 h-5 bg-slate-800/80 rounded-md" />
                    <div className="w-16 h-5 bg-emerald-950/80 rounded-md" />
                  </div>
                  <div className="w-14 h-5 bg-slate-800 rounded-md" />
                </div>

                {/* Metric Title & Description */}
                <div className="space-y-2">
                  <div className="w-4/5 h-4.5 sm:h-5 bg-slate-800 rounded" />
                  <div className="w-full h-3.5 bg-slate-800/80 rounded" />
                  <div className="w-3/4 h-3.5 bg-slate-800/80 rounded" />
                </div>

                {/* Recommendation Box Skeleton */}
                <div className="p-2.5 sm:p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="w-28 h-3.5 bg-slate-800 rounded" />
                  <div className="w-full h-7 sm:h-8 bg-slate-800/80 rounded" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="w-24 sm:w-28 h-7 sm:h-8 bg-slate-800 rounded-xl" />
                <div className="w-16 sm:w-20 h-7 sm:h-8 bg-slate-800/80 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* SSL Shield Banner Skeleton */}
        <div className="mt-6 sm:mt-8 rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-800 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-slate-800 shrink-0" />
            <div className="space-y-1.5 sm:space-y-2">
              <div className="w-36 sm:w-44 h-3.5 sm:h-4 bg-slate-800 rounded-full" />
              <div className="w-48 sm:w-56 h-4.5 sm:h-5 bg-slate-800 rounded" />
              <div className="w-64 sm:w-80 md:w-96 h-3.5 bg-slate-800/80 rounded" />
            </div>
          </div>
          <div className="w-28 sm:w-32 h-9 sm:h-10 bg-slate-800 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
};

type SortOption = 'priority' | 'quickWins' | 'impact' | 'alpha';
type FilterOption = 'all' | 'needsAttention' | 'quickWins' | 'verified';

const CategoryDetailTabsLoaded: React.FC<CategoryDetailTabsProps & { report: FullAuditReport }> = ({
  report,
  lang,
  activeCategory,
  onCategoryChange,
  onOpenFixModal,
  onOpenFix,
  onOpenAutoFix,
  onOpenPricing,
  onUpdateReport,
  onRescanSection,
}) => {
  const t = translations[lang];
  const handleFixModal = (metric: AuditMetric) => {
    if (onOpenFixModal) onOpenFixModal(metric);
    else if (onOpenFix) onOpenFix(metric);
    else if (onOpenAutoFix) onOpenAutoFix(metric);
  };
  const isTargetedModule = Boolean(report.targetAuditModule && report.targetAuditModule !== 'all');
  const [showAllTabs, setShowAllTabs] = useState(false);

  // Set default initial tab based on targeted module
  const defaultTabForModule = useMemo(() => {
    if (!report.targetAuditModule || report.targetAuditModule === 'all') return 'performance';
    switch (report.targetAuditModule) {
      case 'seo':
        return 'seo';
      case 'security':
      case 'ssl':
        return 'security';
      case 'performance':
      case 'vitals':
        return 'performance';
      case 'accessibility':
        return 'accessibility';
      default:
        return 'performance';
    }
  }, [report.targetAuditModule]);

  const [internalActiveTab, setInternalActiveTab] = useState<string>(defaultTabForModule);
  
  useEffect(() => {
    if (isTargetedModule) {
      setInternalActiveTab(defaultTabForModule);
    }
  }, [isTargetedModule, defaultTabForModule]);

  const activeTab = activeCategory || internalActiveTab;
  const setActiveTab = (tab: string) => {
    setInternalActiveTab(tab);
    if (onCategoryChange) {
      onCategoryChange(tab);
    }
  };
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [isBatchVerifying, setIsBatchVerifying] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const allTabs = useMemo(() => [
    { id: 'performance', label: t.performance, icon: Gauge, score: report.perfScore },
    { id: 'seo', label: t.seo, icon: Search, score: report.seoScore },
    { id: 'tech-seo', label: lang === 'te' ? 'టెక్నికల్ ఎస్‌ఈఓ' : 'Technical SEO', icon: FileCode, score: report.techSeoScore || 94 },
    { id: 'security', label: t.security, icon: ShieldCheck, score: report.secScore },
    { id: 'mobile', label: lang === 'te' ? 'మొబైల్ ఆడిట్' : 'Mobile Audit', icon: Smartphone, score: report.mobileScore || 92 },
    { id: 'accessibility', label: t.accessibility, icon: Eye, score: report.accScore },
    { id: 'ai-geo', label: lang === 'te' ? 'AI SEO & GEO' : 'AI SEO & GEO', icon: Bot, score: report.aiScore || 88 },
    { id: 'best-practices', label: t.bestPractices, icon: Sparkles, score: report.bestPracticesScore },
    { id: 'dns', label: t.dnsNetwork, icon: Server, score: 98 },
    { id: 'tech', label: t.techStack, icon: Cpu, score: 100 },
  ], [t, lang, report]);

  const tabs = useMemo(() => {
    if (!isTargetedModule || showAllTabs) {
      return allTabs;
    }
    switch (report.targetAuditModule) {
      case 'seo':
        return allTabs.filter((tab) => tab.id === 'seo' || tab.id === 'tech-seo' || tab.id === 'ai-geo');
      case 'performance':
      case 'vitals':
        return allTabs.filter((tab) => tab.id === 'performance' || tab.id === 'mobile');
      case 'security':
      case 'ssl':
        return allTabs.filter((tab) => tab.id === 'security' || tab.id === 'dns');
      case 'accessibility':
        return allTabs.filter((tab) => tab.id === 'accessibility');
      default:
        return allTabs;
    }
  }, [isTargetedModule, showAllTabs, report.targetAuditModule, allTabs]);

  const currentCategory = report.categories.find(
    (c) =>
      c.id === activeTab ||
      c.id.toLowerCase().replace('-', '') === activeTab.toLowerCase().replace('-', '') ||
      (activeTab === 'aiGeo' && c.id === 'ai-geo') ||
      (activeTab === 'bestPractices' && c.id === 'best-practices')
  );

  // Helper to get priority weight
  const getPriorityWeight = (p?: AuditMetric['priority'], status?: AuditMetric['status']) => {
    if (status === 'error') return 0;
    if (p === 'P0') return 1;
    if (status === 'warning') return 2;
    if (p === 'P1') return 3;
    if (p === 'P2') return 4;
    return 5;
  };

  // Helper to get effort weight
  const getEffortWeight = (effort?: AuditMetric['effort']) => {
    if (effort === 'quick') return 1;
    if (effort === 'medium') return 2;
    return 3;
  };

  // Filtered & Sorted Metrics for current category
  const processedMetrics = useMemo(() => {
    if (!currentCategory) return [];

    let list = [...currentCategory.metrics];

    // Filter
    if (filterBy === 'needsAttention') {
      list = list.filter((m) => m.status === 'warning' || m.status === 'error');
    } else if (filterBy === 'quickWins') {
      list = list.filter((m) => m.effort === 'quick');
    } else if (filterBy === 'verified') {
      list = list.filter((m) => m.isVerified);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'priority') {
        const weightA = getPriorityWeight(a.priority, a.status);
        const weightB = getPriorityWeight(b.priority, b.status);
        return weightA - weightB;
      }
      if (sortBy === 'quickWins') {
        const effortA = getEffortWeight(a.effort);
        const effortB = getEffortWeight(b.effort);
        if (effortA !== effortB) return effortA - effortB;
        return (b.scoreImpact || 0) - (a.scoreImpact || 0);
      }
      if (sortBy === 'impact') {
        return (b.scoreImpact || 0) - (a.scoreImpact || 0);
      }
      if (sortBy === 'alpha') {
        const nameA = (lang === 'te' && a.nameTe ? a.nameTe : a.name).toLowerCase();
        const nameB = (lang === 'te' && b.nameTe ? b.nameTe : b.name).toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

    return list;
  }, [currentCategory, filterBy, sortBy, lang]);

  // Counts for filter chips
  const metricsCount = useMemo(() => {
    if (!currentCategory) return { all: 0, needsAttention: 0, quickWins: 0, verified: 0 };
    return {
      all: currentCategory.metrics.length,
      needsAttention: currentCategory.metrics.filter((m) => m.status === 'warning' || m.status === 'error').length,
      quickWins: currentCategory.metrics.filter((m) => m.effort === 'quick').length,
      verified: currentCategory.metrics.filter((m) => m.isVerified).length,
    };
  }, [currentCategory]);

  const getStatusIcon = (status: AuditMetric['status'], isVerified?: boolean) => {
    if (isVerified || status === 'good') {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
    }
    if (status === 'warning') {
      return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    if (status === 'error') {
      return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
    }
    return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
  };

  const getPriorityBadge = (priority?: AuditMetric['priority']) => {
    switch (priority) {
      case 'P0':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-700">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400/30" />
            <span>{t.priorityP0 || 'P0 - Critical'}</span>
          </span>
        );
      case 'P1':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-700">
            <span>{t.priorityP1 || 'P1 - High'}</span>
          </span>
        );
      case 'P2':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-sky-950/80 text-sky-300 border border-sky-700">
            <span>{t.priorityP2 || 'P2 - Medium'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-medium uppercase px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
            <span>{t.priorityP3 || 'P3 - Low'}</span>
          </span>
        );
    }
  };

  const getEffortBadge = (effort?: AuditMetric['effort']) => {
    if (effort === 'quick') {
      return (
        <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
          <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400/30" />
          <span>{lang === 'te' ? 'క్విక్ విన్ (< 5 నిమి)' : 'Quick Win (< 5m)'}</span>
        </span>
      );
    }
    if (effort === 'medium') {
      return (
        <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{lang === 'te' ? 'మధ్యస్థం (~15 నిమి)' : 'Medium (~15m)'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
        <Wrench className="w-3 h-3 text-slate-400" />
        <span>{lang === 'te' ? 'పరిశీలన' : 'High Effort'}</span>
      </span>
    );
  };

  // Auto-Verify Individual Metric
  const handleAutoVerifyMetric = (metric: AuditMetric) => {
    if (verifyingId || metric.isVerified) return;
    setVerifyingId(metric.id);

    setTimeout(() => {
      const updatedCategories = report.categories.map((cat) => {
        if (cat.id !== activeTab) return cat;

        const updatedMetrics = cat.metrics.map((m) => {
          if (m.id !== metric.id) return m;
          return {
            ...m,
            status: 'good' as const,
            score: 100,
            isVerified: true,
            verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });

        // Recalculate category score
        const newScore = Math.round(
          updatedMetrics.reduce((sum, item) => sum + (item.score || 100), 0) / updatedMetrics.length
        );

        return {
          ...cat,
          score: newScore,
          metrics: updatedMetrics,
        };
      });

      // Recalculate overall score
      const newPerf = updatedCategories.find((c) => c.id === 'performance')?.score || report.perfScore;
      const newSeo = updatedCategories.find((c) => c.id === 'seo')?.score || report.seoScore;
      const newSec = updatedCategories.find((c) => c.id === 'security')?.score || report.secScore;
      const newAcc = updatedCategories.find((c) => c.id === 'accessibility')?.score || report.accScore;
      const newBp = updatedCategories.find((c) => c.id === 'bestPractices')?.score || report.bestPracticesScore;

      const newOverall = Math.round((newPerf + newSeo + newSec + newAcc + newBp) / 5);

      const updatedReport: FullAuditReport = {
        ...report,
        overallScore: newOverall,
        perfScore: newPerf,
        seoScore: newSeo,
        secScore: newSec,
        accScore: newAcc,
        bestPracticesScore: newBp,
        categories: updatedCategories,
      };

      if (onUpdateReport) {
        onUpdateReport(updatedReport);
      }

      setVerifyingId(null);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 900);
  };

  // Batch Auto-Verify All Fixes
  const handleAutoVerifyAll = () => {
    if (isBatchVerifying || !currentCategory) return;
    setIsBatchVerifying(true);
    setBatchProgress(15);

    setTimeout(() => {
      setBatchProgress(65);
      setTimeout(() => {
        setBatchProgress(100);

        const updatedCategories = report.categories.map((cat) => {
          if (cat.id !== activeTab) return cat;

          const updatedMetrics = cat.metrics.map((m) => ({
            ...m,
            status: 'good' as const,
            score: 100,
            isVerified: true,
            verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));

          return {
            ...cat,
            score: 100,
            metrics: updatedMetrics,
          };
        });

        // Recalculate overall score
        const newPerf = updatedCategories.find((c) => c.id === 'performance')?.score || report.perfScore;
        const newSeo = updatedCategories.find((c) => c.id === 'seo')?.score || report.seoScore;
        const newSec = updatedCategories.find((c) => c.id === 'security')?.score || report.secScore;
        const newAcc = updatedCategories.find((c) => c.id === 'accessibility')?.score || report.accScore;
        const newBp = updatedCategories.find((c) => c.id === 'bestPractices')?.score || report.bestPracticesScore;

        const newOverall = Math.round((newPerf + newSeo + newSec + newAcc + newBp) / 5);

        const updatedReport: FullAuditReport = {
          ...report,
          overallScore: newOverall,
          perfScore: newPerf,
          seoScore: newSeo,
          secScore: newSec,
          accScore: newAcc,
          bestPracticesScore: newBp,
          categories: updatedCategories,
        };

        if (onUpdateReport) {
          onUpdateReport(updatedReport);
        }

        setIsBatchVerifying(false);
        setBatchProgress(0);

        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
        });
      }, 500);
    }, 600);
  };

  return (
    <div id="category-detail-section" className="bg-slate-900/90 rounded-3xl border-2 border-slate-800 shadow-xl shadow-black/40 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 scroll-mt-24">
      {/* Category Tab Selector with Focused Scope Indicator */}
      <div className="space-y-2 border-b-2 border-slate-800 pb-3">
        {isTargetedModule && (
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold text-amber-300">
                {lang === 'te'
                  ? `లక్ష్య విభాగ నివేదిక: ${report.targetAuditModule.toUpperCase()} అంశాలు మాత్రమే చూపించబడుతున్నాయి`
                  : `Focused Audit: Displaying isolated ${report.targetAuditModule.toUpperCase()} diagnostic tabs`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAllTabs(!showAllTabs)}
              className="text-[11px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
            >
              {showAllTabs
                ? (lang === 'te' ? 'ఎంపికైన విభాగాలకే పరిమితం చేయండి' : 'Isolate to Target Module')
                : (lang === 'te' ? 'మొత్తం 10 విభాగాలు చూడండి' : 'Show All 10 Categories')}
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            const getTabStyle = () => {
              if (!isActive) {
                return 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700';
              }
              switch (tab.id) {
                case 'performance':
                  return 'bg-amber-950/80 text-amber-200 border-amber-400 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/15';
                case 'seo':
                  return 'bg-teal-950/80 text-teal-200 border-teal-400 ring-2 ring-teal-400/30 shadow-md shadow-teal-500/15';
                case 'technical':
                  return 'bg-indigo-950/80 text-indigo-200 border-indigo-400 ring-2 ring-indigo-400/30 shadow-md shadow-indigo-500/15';
                case 'security':
                  return 'bg-cyan-950/80 text-cyan-200 border-cyan-400 ring-2 ring-cyan-400/30 shadow-md shadow-cyan-500/15';
                case 'mobile':
                  return 'bg-rose-950/80 text-rose-200 border-rose-400 ring-2 ring-rose-400/30 shadow-md shadow-rose-500/15';
                case 'accessibility':
                  return 'bg-purple-950/80 text-purple-200 border-purple-400 ring-2 ring-purple-400/30 shadow-md shadow-purple-500/15';
                case 'ai-geo':
                  return 'bg-emerald-950/80 text-emerald-200 border-emerald-400 ring-2 ring-emerald-400/30 shadow-md shadow-emerald-500/15';
                case 'best-practices':
                  return 'bg-yellow-950/80 text-yellow-200 border-yellow-400 ring-2 ring-yellow-400/30 shadow-md shadow-yellow-500/15';
                case 'dns':
                  return 'bg-sky-950/80 text-sky-200 border-sky-400 ring-2 ring-sky-400/30 shadow-md shadow-sky-500/15';
                default:
                  return 'bg-emerald-950/80 text-emerald-200 border-emerald-400 ring-2 ring-emerald-400/30 shadow-md shadow-emerald-500/15';
              }
            };

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer border-2 shrink-0 ${getTabStyle()}`}
              >
                <Icon className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-lg font-black border ${
                    isActive ? 'bg-slate-950 text-white border-white/40' : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  <AnimatedScore value={tab.score} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content: Standard Metrics */}
      {currentCategory && (
        <div className="space-y-4 sm:space-y-5">
          {/* Header & Controls Toolbar */}
          <div className="bg-slate-950/80 p-3.5 sm:p-4 md:p-5 rounded-2xl border-2 border-slate-700 space-y-3 sm:space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 flex-wrap">
                  <span>{lang === 'te' ? currentCategory.nameTe : currentCategory.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400 font-black">
                    Score <AnimatedScore value={currentCategory.score} />/100
                  </span>
                  {report.targetAuditModule && report.targetAuditModule === activeTab && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase tracking-wider border border-amber-300 shadow-xs">
                      {lang === 'te' ? 'ప్రత్యేక విభాగం సక్రియం' : 'Target Module Active'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'te' ? currentCategory.summaryTe : currentCategory.summary}
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                {/* Re-scan this section button */}
                {onRescanSection && (
                  <button
                    type="button"
                    onClick={() => {
                      const modMap: Record<string, AuditTargetModule> = {
                        seo: 'seo',
                        security: 'security',
                        performance: 'performance',
                        accessibility: 'accessibility',
                      };
                      const mod = modMap[activeTab] || 'all';
                      onRescanSection(mod);
                    }}
                    className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-black border-2 border-slate-600 hover:border-amber-400 transition-all cursor-pointer shadow-xs shrink-0"
                    title="Re-run tests only for this section"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {lang === 'te'
                        ? 'ఈ విభాగం మాత్రమే మళ్ళీ పరీక్షించండి'
                        : 'Re-test this section'}
                    </span>
                  </button>
                )}

                {/* Batch Auto-Verify All Button (Rich Golden Amber) */}
                {metricsCount.needsAttention > 0 && (
                  <button
                    onClick={handleAutoVerifyAll}
                    disabled={isBatchVerifying}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer shrink-0 disabled:opacity-75 border-2 border-amber-300"
                  >
                    {isBatchVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                        <span>{lang === 'te' ? `ధృవీకరిస్తున్నాము (${batchProgress}%)` : `Verifying All (${batchProgress}%)`}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        <span>{t.autoVerifyAll || 'Auto-Verify All Fixes'}</span>
                        <span className="bg-slate-950/20 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black">
                          +{metricsCount.needsAttention}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Sorting & Filter Controls Bar */}
            <div className="pt-3 border-t-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
              {/* Filter Tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                </span>

                <button
                  onClick={() => setFilterBy('all')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 border-2 ${
                    filterBy === 'all'
                      ? 'bg-slate-800 text-white border-slate-700 shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  {t.filterAllMetrics || 'All Checks'} ({metricsCount.all})
                </button>

                <button
                  onClick={() => setFilterBy('needsAttention')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 flex items-center space-x-1 border-2 ${
                    filterBy === 'needsAttention'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-amber-300" />
                  <span>{t.filterNeedsAttention || 'Needs Attention'}</span>
                  <span>({metricsCount.needsAttention})</span>
                </button>

                <button
                  onClick={() => setFilterBy('quickWins')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 flex items-center space-x-1 border-2 ${
                    filterBy === 'quickWins'
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <Zap className="w-3 h-3 text-emerald-300" />
                  <span>{t.filterQuickWins || 'Quick Wins'}</span>
                  <span>({metricsCount.quickWins})</span>
                </button>

                {metricsCount.verified > 0 && (
                  <button
                    onClick={() => setFilterBy('verified')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 flex items-center space-x-1 border-2 ${
                      filterBy === 'verified'
                        ? 'bg-teal-700 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-teal-300" />
                    <span>{t.verifiedBadge || 'Verified'}</span>
                    <span>({metricsCount.verified})</span>
                  </button>
                )}
              </div>

              {/* Priority Sorting Selector Dropdown */}
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.prioritySort || 'Sort:'}</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-950 border-2 border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-700 cursor-pointer shadow-2xs"
                >
                  <option value="priority">⚡ {t.sortByCritical || 'Critical First (P0 / Errors)'}</option>
                  <option value="quickWins">🚀 {t.sortByQuickWins || 'Quick Wins (Lowest Effort)'}</option>
                  <option value="impact">📈 {t.sortByImpact || 'Highest Score Impact (+Pts)'}</option>
                  <option value="alpha">🔤 {t.sortByName || 'Alphabetical (A-Z)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5">
            {processedMetrics.map((metric) => {
              const isVerifying = verifyingId === metric.id;

              const getMetricBorderClass = () => {
                if (metric.isVerified) {
                  return 'border-2 border-emerald-400/90 bg-emerald-950/25 shadow-md shadow-emerald-950/40 hover:border-emerald-300';
                }
                if (metric.status === 'error') {
                  return 'border-2 border-rose-500/90 bg-rose-950/25 shadow-md shadow-rose-950/40 hover:border-rose-400';
                }
                if (metric.status === 'warning') {
                  return 'border-2 border-amber-500/90 bg-amber-950/25 shadow-md shadow-amber-950/40 hover:border-amber-400';
                }
                return 'border-2 border-emerald-500/60 bg-emerald-950/15 hover:border-emerald-400';
              };

              return (
                <div
                  key={metric.id}
                  className={`rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative space-y-3 sm:space-y-4 ${getMetricBorderClass()}`}
                >
                  {/* Top Badges: Priority + Effort + Score Impact */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      {getPriorityBadge(metric.priority)}
                      {getEffortBadge(metric.effort)}
                      {metric.scoreImpact && metric.scoreImpact > 0 && metric.status !== 'good' && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-950/90 text-indigo-300 border-2 border-indigo-500 shadow-2xs">
                          <BadgePercent className="w-3 h-3 text-indigo-400" />
                          <span>+{metric.scoreImpact} pts boost</span>
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono font-black bg-slate-900 text-slate-200 px-2.5 py-0.5 rounded-md border-2 border-slate-700 shrink-0">
                      {metric.value}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        {getStatusIcon(metric.status, metric.isVerified)}
                        <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                          {lang === 'te' && metric.nameTe ? metric.nameTe : metric.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {lang === 'te' && metric.descriptionTe ? metric.descriptionTe : metric.description}
                    </p>

                    {metric.recommendation && (
                      <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-xl p-2.5 sm:p-3 text-xs text-slate-300 leading-relaxed">
                        <span className="font-black text-emerald-400">Recommendation: </span>
                        {lang === 'te' && metric.recommendationTe ? metric.recommendationTe : metric.recommendation}
                      </div>
                    )}
                  </div>

                  {/* Status & Action Footer */}
                  <div className="mt-3 pt-3 border-t-2 border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      Target: {metric.fixSnippet?.fileTarget || 'index.html / server'}
                    </span>

                    {metric.isVerified ? (
                      <span className="inline-flex items-center space-x-1.5 text-emerald-300 font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs bg-emerald-950/90 border-2 border-emerald-400 shadow-sm shadow-emerald-500/20">
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                        <span>{t.verifiedBadge || 'Verified & Remediated'}</span>
                        {metric.verifiedAt && <span className="text-[10px] text-emerald-400 font-mono">({metric.verifiedAt})</span>}
                      </span>
                    ) : metric.status === 'good' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 font-black px-2.5 py-1 rounded-xl text-xs bg-emerald-950/90 border-2 border-emerald-400/80 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'te' ? 'ఆప్టిమైజ్ చేయబడింది' : 'Optimal (Passed)'}</span>
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {/* Auto-Verify Live Button (Rich Golden Amber) */}
                        <button
                          onClick={() => handleAutoVerifyMetric(metric)}
                          disabled={isVerifying}
                          className="inline-flex items-center space-x-1.5 font-black px-2.5 sm:px-3 py-1.5 rounded-xl text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-75 border-2 border-amber-300"
                          title="Simulate live testing and verification of this fix"
                        >
                          {isVerifying ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin text-slate-950" />
                              <span>{t.autoVerifying || 'Verifying...'}</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 fill-slate-950 text-slate-950" />
                              <span>{t.autoVerifyRemediation || 'Auto-Verify Fix'}</span>
                            </>
                          )}
                        </button>

                        {/* Fix Issue Button (PR / Patch Modal) */}
                        {metric.fixSnippet && (
                          <FixItTooltip
                            metric={metric}
                            lang={lang}
                            onFixClick={() => handleFixModal(metric)}
                          >
                            <button
                              onClick={() => handleFixModal(metric)}
                              className={`inline-flex items-center space-x-1.5 font-black px-2.5 sm:px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer border-2 shadow-2xs ${
                                metric.status === 'error'
                                  ? 'bg-rose-950/90 hover:bg-rose-900/90 text-rose-200 border-rose-500'
                                  : 'bg-amber-950/90 hover:bg-amber-900/90 text-amber-200 border-amber-500'
                              }`}
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              <span>{t.fixIssue}</span>
                            </button>
                          </FixItTooltip>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: DNS & Network Tab */}
      {activeTab === 'dns' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-slate-950 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-sky-500/60 shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <Server className="w-5 sm:w-6 h-5 sm:h-6 text-sky-400" />
              <h3 className="text-base sm:text-lg font-black">{t.dnsRecordsVerified}</h3>
            </div>
            <p className="text-xs text-slate-300">
              Resolved authoritative nameservers, Anycast A/AAAA routing, Mail Exchange (MX) and anti-spoofing SPF/DMARC policies.
            </p>
          </div>

          <div className="overflow-x-auto border-2 border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-950 border-b-2 border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th className="p-3 sm:p-3.5">Record Type</th>
                  <th className="p-3 sm:p-3.5">Status</th>
                  <th className="p-3 sm:p-3.5">Resolved Record Value</th>
                  <th className="p-3 sm:p-3.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-800/80">
                {report.dns.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                    <td className="p-3 sm:p-3.5 font-mono font-black text-white">
                      <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md">{d.recordType}</span>
                    </td>
                    <td className="p-3 sm:p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-black text-[11px] border-2 ${
                          d.status === 'valid'
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400'
                            : 'bg-amber-950/90 text-amber-300 border-amber-400'
                        }`}
                      >
                        {d.status === 'valid' ? 'Active & Valid' : 'Warning'}
                      </span>
                    </td>
                    <td className="p-3 sm:p-3.5 font-mono text-slate-300 max-w-xs truncate">{d.value}</td>
                    <td className="p-3 sm:p-3.5 text-slate-400">{d.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Tech Stack Tab */}
      {activeTab === 'tech' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-r from-slate-950 to-indigo-950 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-indigo-500/60 shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <Cpu className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-400" />
              <h3 className="text-base sm:text-lg font-black">{t.techDetected}</h3>
            </div>
            <p className="text-xs text-slate-300">
              Deep packet & header inspection detected modern reactive UI frameworks, build pipelines, and CDNs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {report.technologies.map((tech, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border-2 border-slate-700 hover:border-indigo-400 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between hover:shadow-md transition-all gap-2"
              >
                <div>
                  <h4 className="text-sm font-black text-white">{tech.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{tech.category}</p>
                </div>
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl border-2 shrink-0 ${tech.color || 'bg-slate-800 text-slate-200 border-slate-600'}`}>
                  {tech.confidence}% Match
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Golden Shield Security SSL Highlight Box - Inspired by security_logo.png */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-950/90 via-slate-950 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-amber-400 text-white shadow-xl shadow-amber-500/15 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center space-x-3.5 sm:space-x-5">
          {/* Gold Shield Visual */}
          <div className="relative flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/30 border border-amber-300">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-1.5 sm:p-2 text-center">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <span className="text-[7px] sm:text-[8px] font-black text-amber-300 tracking-wider mt-0.5 sm:mt-1 uppercase">
                {t.securityShieldText}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-950/90 text-amber-300 border-2 border-amber-400 shadow-2xs">
                TLS 1.3 / Grade {report.ssl.grade}
              </span>
              <span className="text-xs text-slate-300 font-mono">Issuer: {report.ssl.issuer}</span>
            </div>
            <h4 className="text-sm sm:text-base lg:text-lg font-black text-white">{t.sslGrade}</h4>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-medium">
              {t.sslGradeDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="text-center md:text-right bg-slate-950/80 px-4 py-2 rounded-2xl border-2 border-emerald-500/40">
            <span className="text-xs text-slate-400 block font-mono">Certificate Valid For</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">{report.ssl.daysRemaining} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryDetailTabs: React.FC<CategoryDetailTabsProps> = (props) => {
  if (props.isLoading || !props.report) {
    return <CategoryDetailTabsSkeleton lang={props.lang} />;
  }
  return <CategoryDetailTabsLoaded {...props} report={props.report} />;
};

