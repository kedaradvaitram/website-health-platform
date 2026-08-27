import React, { useState, useRef, useEffect } from 'react';
import { Info, CheckCircle2, ChevronRight, Target, TrendingUp, Sparkles, Copy, Check, ArrowUpRight } from 'lucide-react';
import { MetricPillarDefinition, getScoreStatusLabel } from '../data/metricPillarDefinitions';
import { Language } from '../types';

interface MetricScoreInfoTooltipProps {
  pillar: MetricPillarDefinition;
  score: number;
  lang: Language;
  onDeepDive?: () => void;
  className?: string;
  isOverallHealth?: boolean;
}

export const MetricScoreInfoTooltip: React.FC<MetricScoreInfoTooltipProps> = ({
  pillar,
  score,
  lang,
  onDeepDive,
  className = '',
  isOverallHealth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const PillarIcon = pillar.icon;
  const status = getScoreStatusLabel(score, lang);

  // Close tooltip on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const whatMeasures = lang === 'te' ? pillar.whatItMeasuresTe : pillar.whatItMeasures;
  const whyMatters = lang === 'te' ? pillar.whyItMattersTe : pillar.whyItMatters;
  const targetBench = lang === 'te' ? pillar.targetBenchmarkTe : pillar.targetBenchmark;
  const titleText = lang === 'te' ? pillar.nameTe : pillar.name;

  const handleCopySummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    const summaryText = `${titleText} (${score}/100) - ${status.label}\nBenchmark: ${targetBench}\nImpact: ${whyMatters}\nAudits:\n${whatMeasures.map((m) => `• ${m}`).join('\n')}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Interactive Info Icon Button with Tooltip Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        aria-expanded={isOpen}
        aria-label={`Detailed score breakdown and info for ${pillar.name}`}
        id={`info-btn-${pillar.id}`}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/80 active:bg-slate-300 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
        title={lang === 'te' ? 'ఈ స్కోరు యొక్క సమగ్ర వివరాలు & ప్రాముఖ్యత (Metric Info)' : `What does this ${pillar.name} score represent? (Metric Info Tooltip)`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {/* Floating Rich Tooltip Card */}
      {isOpen && (
        <div
          role="tooltip"
          id={`tooltip-card-${pillar.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 top-full mt-2.5 w-80 sm:w-96 max-w-[calc(100vw-2rem)] p-4 bg-slate-950 text-white rounded-2xl shadow-2xl border-2 border-slate-700 text-xs space-y-3 animate-fadeIn select-none"
        >
          {/* Header with Title, Icon & Score Pill */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className={`w-7 h-7 rounded-lg ${pillar.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                <PillarIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <span>{titleText}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-300 font-mono">
                    {lang === 'te' ? 'మెట్రిక్ టూల్‌టిప్' : 'Metric Tooltip'}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">{lang === 'te' ? pillar.shortSubtitleTe : pillar.shortSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-lg border ${status.bg} ${status.color} ${status.border}`}>
                {score}/100
              </span>
            </div>
          </div>

          {/* Business & Search Engine Impact Summary */}
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{lang === 'te' ? 'వ్యాపార & ఆర్గానిక్ ర్యాంకింగ్ ప్రభావం' : 'Impact & Significance'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{whyMatters}</p>
          </div>

          {/* Key Checklist Factors Measured */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{lang === 'te' ? 'ఈ స్కోర్‌లో కొలిచే ముఖ్య అంశాలు:' : 'Key Signals & Audits Measured:'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">6 checks</span>
            </div>
            <ul className="grid grid-cols-1 gap-1 text-[11px] text-slate-300">
              {whatMeasures.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benchmark Target & Copy Actions */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-1">
            <span className="flex items-center gap-1 font-mono text-emerald-300">
              <Target className="w-3 h-3 text-emerald-400" />
              {targetBench}
            </span>
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center space-x-1 text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy metric summary"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'సారాంశం కాపీ' : 'Copy')}</span>
            </button>
          </div>

          {/* Metric Deep-Dive Link Action Button */}
          {onDeepDive && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDeepDive();
              }}
              id={`btn-deepdive-tooltip-${pillar.id}`}
              className="w-full mt-1.5 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2 rounded-xl text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <span>{lang === 'te' ? `${pillar.nameTe} లోతైన విశ్లేషణ (Deep-Dive Link)` : `Open ${pillar.name} Deep-Dive Breakdown`}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}

          {/* Arrow Pointer */}
          <div className="absolute -top-1.5 right-3 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-slate-950 border-t-2 border-l-2 border-slate-700 rotate-45" />
        </div>
      )}
    </div>
  );
};
