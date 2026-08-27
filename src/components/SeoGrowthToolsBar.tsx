import React from 'react';
import {
  Layers,
  Sparkles,
  Bot,
  Swords,
  Code2,
  Globe2,
  Building2,
  Activity,
  FileCheck2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface SeoGrowthToolsBarProps {
  lang: Language;
  onOpenDeepCrawler: () => void;
  onOpenAiGeo: () => void;
  onOpenCompetitor: () => void;
  onOpenDevCenter: () => void;
  onOpenIntlSeo: () => void;
  onOpenAgency: () => void;
  onOpenMonitoring: () => void;
  onOpenExecutiveReport: () => void;
  onOpenFixAndRescan?: () => void;
  onOpenAiFix?: () => void;
}

export const SeoGrowthToolsBar: React.FC<SeoGrowthToolsBarProps> = ({
  lang,
  onOpenDeepCrawler,
  onOpenAiGeo,
  onOpenCompetitor,
  onOpenDevCenter,
  onOpenIntlSeo,
  onOpenAgency,
  onOpenMonitoring,
  onOpenExecutiveReport,
  onOpenFixAndRescan,
  onOpenAiFix,
}) => {
  const t = translations[lang];

  const pillars = [
    {
      id: 'pillar-1',
      number: '01',
      title: lang === 'te' ? 'డీప్ వెబ్‌సైట్ క్రాలర్' : 'Deep Crawler Engine',
      subtitle: lang === 'te' ? '1,000+ పేజీలు & సైట్‌మ్యాప్' : '1,000+ Pages & Sitemap',
      icon: Layers,
      accentColor: 'border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900 text-cyan-400 hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      badgeText: 'Multi-Page',
      primaryAction: {
        label: lang === 'te' ? 'క్రాలర్ లాంచ్ చేయండి' : 'Launch Crawler',
        onClick: onOpenDeepCrawler,
      },
      secondaryAction: null,
    },
    {
      id: 'pillar-2',
      number: '02',
      title: lang === 'te' ? 'AI సెర్చ్ & GEO ఇంజిన్' : 'AI Search & GEO Audit',
      subtitle: lang === 'te' ? 'ChatGPT, Perplexity & SGE' : 'ChatGPT, Perplexity & SGE',
      icon: Bot,
      accentColor: 'border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 text-purple-400 hover:border-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      badgeText: 'AI Engine',
      primaryAction: {
        label: lang === 'te' ? 'AI ఆడిట్ చూడండి' : 'Analyze AI Visibility',
        onClick: onOpenAiGeo,
      },
      secondaryAction: null,
    },
    {
      id: 'pillar-3',
      number: '03',
      title: lang === 'te' ? 'AI ఫిక్స్ & రీ-స్కాన్' : 'AI Fix & Re-scan Suite',
      subtitle: lang === 'te' ? 'కోడ్ స్నిప్పెట్స్ & లైవ్ సిమ్యులేటర్' : 'Code Fixes & Live Simulator',
      icon: Code2,
      accentColor: 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 text-emerald-400 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      badgeText: 'Live Remediation',
      primaryAction: {
        label: lang === 'te' ? 'ఫిక్స్ & రీ-స్కాన్' : 'Fix & Re-scan UI',
        onClick: onOpenFixAndRescan || onOpenDevCenter,
      },
      secondaryAction: {
        label: lang === 'te' ? 'డెవ్ సెంటర్' : 'Dev Center',
        onClick: onOpenDevCenter,
      },
    },
    {
      id: 'pillar-4',
      number: '04',
      title: lang === 'te' ? 'కాంపిటీటర్ & గ్లోబల్ SEO' : 'Competitor & Global SEO',
      subtitle: lang === 'te' ? 'హెడ్-టు-హెడ్ & Hreflang' : 'Head-to-Head & Hreflang',
      icon: Swords,
      accentColor: 'border-amber-500/30 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 text-amber-400 hover:border-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      badgeText: 'Intelligence',
      primaryAction: {
        label: lang === 'te' ? 'కాంపిటీటర్ బెంచ్‌మార్క్' : 'Compare Competitor',
        onClick: onOpenCompetitor,
      },
      secondaryAction: {
        label: lang === 'te' ? 'ఇంటర్నేషనల్' : 'Intl SEO',
        onClick: onOpenIntlSeo,
      },
    },
    {
      id: 'pillar-5',
      number: '05',
      title: lang === 'te' ? '24/7 మానిటర్ & ఏజెన్సీ' : '24/7 Monitor & Agency',
      subtitle: lang === 'te' ? 'లైవ్ అలర్ట్స్ & వైట్-లేబుల్ PDF' : 'Uptime Alerts & White-Label',
      icon: Activity,
      accentColor: 'border-fuchsia-500/30 bg-gradient-to-b from-fuchsia-950/40 via-slate-900 to-slate-900 text-fuchsia-400 hover:border-fuchsia-400',
      badgeBg: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20',
      badgeText: 'Agency Ops',
      primaryAction: {
        label: lang === 'te' ? '24/7 మానిటరింగ్' : '24/7 Monitor',
        onClick: onOpenMonitoring,
      },
      secondaryAction: {
        label: lang === 'te' ? 'వైట్-లేబుల్' : 'Agency Portal',
        onClick: onOpenAgency,
      },
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl space-y-3.5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span>🏆 5-PILLAR PLATFORM ARCHITECTURE</span>
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {lang === 'te' ? 'అన్నీ ఒకే చోట సులభంగా నిర్వహించండి' : 'Unified Executive Tool Suite'}
          </span>
        </div>

        {/* Clean 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`p-3.5 rounded-2xl border ${pillar.accentColor} transition-all duration-200 hover:shadow-lg flex flex-col justify-between space-y-3`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-950/60 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {pillar.number}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-md border ${pillar.badgeBg}`}
                      >
                        {pillar.badgeText}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white tracking-tight leading-snug">
                    {pillar.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-medium line-clamp-1">
                    {pillar.subtitle}
                  </p>
                </div>

                <div className="pt-1 flex flex-col gap-1.5">
                  <button
                    onClick={pillar.primaryAction.onClick}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-white text-[11px] font-bold border border-slate-700 hover:border-slate-600 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span>{pillar.primaryAction.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {pillar.secondaryAction && (
                    <button
                      onClick={pillar.secondaryAction.onClick}
                      className="w-full py-1 px-2 rounded-lg bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-[10px] font-medium flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {pillar.secondaryAction.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
