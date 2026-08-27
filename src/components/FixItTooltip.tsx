import React, { useState } from 'react';
import { Sparkles, Zap, TrendingUp, Clock, Code2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { AuditMetric, Language } from '../types';

interface FixItTooltipProps {
  children: React.ReactNode;
  metric?: AuditMetric;
  scoreImpact?: number;
  fixTitle?: string;
  fixDescription?: string;
  lang?: Language;
  onFixClick?: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export const FixItTooltip: React.FC<FixItTooltipProps> = ({
  children,
  metric,
  scoreImpact,
  fixTitle,
  fixDescription,
  lang = 'en',
  onFixClick,
  position = 'top',
  align = 'right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Compute realistic impact based on metric status if not explicitly provided
  const impact = scoreImpact || (metric?.status === 'error' ? 8 : metric?.status === 'warning' ? 4 : 2);
  const title = fixTitle || (lang === 'te' ? metric?.nameTe : metric?.name) || 'Automated Remediation Patch';
  const desc = fixDescription || (lang === 'te' ? metric?.descriptionTe : metric?.description) || 'Injects optimized code snippet or config patch to instantly resolve this health warning.';

  const getPositionClasses = () => {
    if (position === 'top') {
      if (align === 'right') return 'bottom-full right-0 mb-3';
      if (align === 'left') return 'bottom-full left-0 mb-3';
      return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
    }
    if (position === 'bottom') {
      if (align === 'right') return 'top-full right-0 mt-3';
      if (align === 'left') return 'top-full left-0 mt-3';
      return 'top-full left-1/2 -translate-x-1/2 mt-3';
    }
    if (position === 'left') return 'right-full top-1/2 -translate-y-1/2 mr-3';
    return 'left-full top-1/2 -translate-y-1/2 ml-3';
  };

  const getArrowClasses = () => {
    if (position === 'top') {
      const xPos = align === 'right' ? 'right-6' : align === 'left' ? 'left-6' : 'left-1/2 -translate-x-1/2';
      return `top-full ${xPos} border-t-slate-900 border-l-transparent border-r-transparent border-b-transparent`;
    }
    if (position === 'bottom') {
      const xPos = align === 'right' ? 'right-6' : align === 'left' ? 'left-6' : 'left-1/2 -translate-x-1/2';
      return `bottom-full ${xPos} border-b-slate-900 border-l-transparent border-r-transparent border-t-transparent`;
    }
    if (position === 'left') {
      return 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-t-transparent border-b-transparent border-r-transparent';
    }
    return 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-t-transparent border-b-transparent border-l-transparent';
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] p-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/90 pointer-events-auto animate-fadeIn ${getPositionClasses()}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center space-x-1.5 text-amber-400 font-black text-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>{lang === 'te' ? 'ఆటోమేటెడ్ ఫిక్స్ అందుబాటులో ఉంది' : '1-Click Code Remediation'}</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3" />
              <span>+{impact} pts Boost</span>
            </span>
          </div>

          {/* Body content */}
          <div className="space-y-1.5 text-left">
            <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{title}</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{desc}</p>
          </div>

          {/* Meta stats */}
          <div className="grid grid-cols-2 gap-2 my-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-left">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="whitespace-nowrap">Fix Time: &lt; 5 sec</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="whitespace-nowrap">Zero Regressions</span>
            </div>
          </div>

          {/* Action button inside tooltip */}
          {onFixClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
                onFixClick();
              }}
              className="w-full mt-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'te' ? 'కోడ్ మార్పును పరిశీలించండి' : 'Preview Fix Code & Patch'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
            </button>
          )}

          {/* Tooltip Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
          />
        </div>
      )}
    </div>
  );
};
