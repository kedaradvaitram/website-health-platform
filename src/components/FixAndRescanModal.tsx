import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  Code2,
  Sliders,
  Check,
  Activity,
  Server,
  FileCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, FullAuditReport } from '../types';
import { translations } from '../data/translations';

interface FixAndRescanModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
  onTriggerRescan: (url: string) => void;
  onOpenAutoFix?: () => void;
}

interface SimulatedFix {
  id: string;
  name: string;
  nameTe: string;
  category: 'performance' | 'security' | 'seo' | 'accessibility';
  scoreImpact: number;
  timeImpact: number; // in ms
  description: string;
  applied: boolean;
}

export const FixAndRescanModal: React.FC<FixAndRescanModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
  onTriggerRescan,
  onOpenAutoFix,
}) => {
  const t = translations[lang];
  const targetUrl = report?.url || 'https://mywebsite.com';
  const baseScore = report?.overallScore || 68;

  const [fixes, setFixes] = useState<SimulatedFix[]>([
    {
      id: 'fix-hsts',
      name: 'Enable HSTS & Strict Security Headers',
      nameTe: 'HSTS & సెక్యూరిటీ హెడర్స్ ఎనేబుల్ చేయండి',
      category: 'security',
      scoreImpact: 8,
      timeImpact: 0,
      description: 'Adds max-age=63072000; includeSubDomains; preload to Nginx/Cloudflare',
      applied: true,
    },
    {
      id: 'fix-images',
      name: 'Convert Next-Gen WebP/AVIF Images',
      nameTe: 'చిత్రాలను WebP/AVIF ఫార్మాట్‌కు మార్చండి',
      category: 'performance',
      scoreImpact: 11,
      timeImpact: 650,
      description: 'Compresses hero banner and logo, saving 1.8MB total payload',
      applied: true,
    },
    {
      id: 'fix-schema',
      name: 'Inject Organization & Breadcrumb JSON-LD',
      nameTe: 'ఆర్గనైజేషన్ JSON-LD స్కీమా చేర్చండి',
      category: 'seo',
      scoreImpact: 6,
      timeImpact: 0,
      description: 'Enables rich Google search cards & Perplexity citation knowledge graphs',
      applied: true,
    },
    {
      id: 'fix-preconnect',
      name: 'Add DNS Preconnect & Font Display Swap',
      nameTe: 'DNS ప్రీకనెక్ట్ & ఫాంట్ స్వాప్ జోడించండి',
      category: 'performance',
      scoreImpact: 5,
      timeImpact: 320,
      description: 'Eliminates render-blocking Google Fonts stylesheet delay',
      applied: false,
    },
    {
      id: 'fix-viewport',
      name: 'Set Mobile Viewport & Contrast Fixes',
      nameTe: 'మొబైల్ వ్యూపోర్ట్ & కాంట్రాస్ట్ లోపాలు సరిచేయండి',
      category: 'accessibility',
      scoreImpact: 4,
      timeImpact: 0,
      description: 'WCAG 2.1 AA 4.5:1 compliant contrast for text buttons',
      applied: false,
    },
  ]);

  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const totalAddedScore = fixes
    .filter((f) => f.applied)
    .reduce((sum, f) => sum + f.scoreImpact, 0);

  const projectedScore = Math.min(100, baseScore + totalAddedScore);
  const totalTimeSaved = fixes
    .filter((f) => f.applied)
    .reduce((sum, f) => sum + f.timeImpact, 0);

  const toggleFix = (id: string) => {
    setFixes((prev) =>
      prev.map((f) => (f.id === id ? { ...f, applied: !f.applied } : f))
    );
  };

  const handleApplyAll = () => {
    setFixes((prev) => prev.map((f) => ({ ...f, applied: true })));
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const handleStartRescan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onClose();
      onTriggerRescan(targetUrl);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="fix-and-rescan-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {lang === 'te' ? 'ఫిక్స్ & రీ-స్కాన్ వెరిఫికేషన్ ఇంజిన్' : 'Fix & Re-scan UI Verification Engine'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Simulator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'మీరు కోడ్ మార్పులు చేసిన తర్వాత స్కోర్ ఇంప్రూవ్‌మెంట్‌ను పరీక్షించండి మరియు లైవ్ రీ-స్కాన్ చేయండి'
                  : 'Simulate predicted score gains from applied fixes and trigger instant live re-validation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-rescan-modal"
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target URL Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Target Domain</span>
                <div className="text-sm font-mono font-bold text-white">{targetUrl}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyAll}
                className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'అన్నీ ఎంచుకోండి' : 'Select All Fixes'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Score Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Score */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium">Initial Score</span>
              <div className="text-3xl font-black text-amber-400 font-mono">{baseScore}/100</div>
              <span className="text-[11px] text-amber-300/80 font-mono">Needs Remediation</span>
            </div>

            {/* Projected Improvement */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-center space-y-1 shadow-lg shadow-emerald-500/5">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Projected Score</span>
              <div className="text-4xl font-black text-emerald-300 font-mono flex items-center justify-center gap-1">
                <span>{projectedScore}</span>
                <span className="text-xs text-emerald-400 font-bold">/100</span>
              </div>
              <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{totalAddedScore} Points Gain</span>
              </div>
            </div>

            {/* Est Speed Optimization */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium">Est. Latency Saved</span>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {totalTimeSaved > 0 ? `-${(totalTimeSaved / 1000).toFixed(2)}s` : '0.00s'}
              </div>
              <span className="text-[11px] text-cyan-300/80 font-mono">Faster LCP &amp; FCP</span>
            </div>
          </div>

          {/* Interactive Checklist of Fixes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {lang === 'te' ? 'సరిదిద్దబడిన లోపాల చెక్‌లిస్ట్ (మార్పులను టోగుల్ చేయండి):' : 'Applied Remediation Checklist (Toggle to preview):'}
            </h4>
            <div className="space-y-2">
              {fixes.map((fix) => (
                <div
                  key={fix.id}
                  onClick={() => toggleFix(fix.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    fix.applied
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                        fix.applied
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700 bg-slate-800 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>{lang === 'te' ? fix.nameTe : fix.name}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {fix.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{fix.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400">+{fix.scoreImpact} pts</span>
                    {fix.timeImpact > 0 && (
                      <div className="text-[10px] font-mono text-cyan-300">-{fix.timeImpact}ms</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onOpenAutoFix) onOpenAutoFix();
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>{lang === 'te' ? 'AI ఫిక్స్ కోడ్ స్నిప్పెట్లను చూడండి' : 'View AI Fix Code Snippets'}</span>
          </button>

          <button
            onClick={handleStartRescan}
            disabled={isVerifying}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Connecting to Server...' : 'Trigger Live Re-Scan Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
