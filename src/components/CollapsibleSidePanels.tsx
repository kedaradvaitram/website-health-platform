import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  Globe,
  Zap,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Flame,
  ShieldCheck,
  Sparkles,
  Gift,
  X,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Language } from '../types';
import { AFFILIATE_LINKS } from '../data/affiliateLinks';
import { GoogleAdSlot } from './GoogleAdSlot';

export interface CollapsibleSidePanelsProps {
  lang: Language;
  children: React.ReactNode;
  onOpenPricing?: () => void;
  onOpenDeepCrawler?: () => void;
  onOpenAiGeo?: () => void;
}

export const CollapsibleSidePanels: React.FC<CollapsibleSidePanelsProps> = ({
  lang,
  children,
  onOpenPricing,
  onOpenDeepCrawler,
  onOpenAiGeo,
}) => {
  const isTe = lang === 'te';
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(true);
  const [isRightCollapsed, setIsRightCollapsed] = useState(true);

  return (
    <div className="relative w-full">
      {/* 
        ========================================================================
        MOBILE & SMALL SCREENS (< md breakpoint):
        Side panels collapse into this sleek, high-visibility Horizontal Ad Banner 
        at the top of the screen to maintain content focus and avoid side clutter.
        ========================================================================
      */}
      <div className="block md:hidden w-full px-3 sm:px-4 pt-2 -mb-2">
        <div className="flex items-center justify-between px-2 py-1 mb-1 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1 text-amber-400 uppercase tracking-wider">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>{isTe ? 'స్పాన్సర్డ్ పార్ట్‌నర్ ఆఫర్స్' : 'Featured Partner Offers'}</span>
          </span>
          <span className="text-slate-500 font-mono text-[9px]">
            {isTe ? 'మొబైల్ ఫోకస్ మోడ్' : 'Compact Top Banner'}
          </span>
        </div>
        <GoogleAdSlot
          slotId="mobile-top-collapsed-banner"
          slotType="horizontal"
          bannerPreset="auto-rotate"
          lang={lang}
          className="!my-1"
        />
      </div>

      {/* 
        ========================================================================
        DESKTOP LAYOUT (>= md breakpoint):
        Left & Right Vertical Side Panels flank the main full-width content.
        ========================================================================
      */}
      <div className="w-full flex justify-between items-start gap-2 sm:gap-4 px-1 sm:px-2 md:px-4">
        {/* LEFT SIDE PANEL (Desktop >= md) */}
        <aside
          aria-label="Partner & Web Hosting Side Panel"
          className={`hidden md:flex flex-col shrink-0 sticky top-24 z-20 transition-all duration-300 ${
            isLeftCollapsed ? 'w-10' : 'w-44 lg:w-52 xl:w-56'
          }`}
        >
          {isLeftCollapsed ? (
            <button
              type="button"
              onClick={() => setIsLeftCollapsed(false)}
              className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 shadow-xl transition-all flex flex-col items-center gap-2 cursor-pointer group"
              title={isTe ? 'సైడ్ ప్యానెల్ తెరవండి' : 'Expand Left Sponsor Panel'}
            >
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              <span className="[writing-mode:vertical-rl] text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-amber-400">
                {isTe ? 'హోస్టింగ్ ఆఫర్స్' : 'Hosting Deals'}
              </span>
              <Server className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          ) : (
            <div className="relative rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-3.5 backdrop-blur-md space-y-3.5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                    {isTe ? 'హోస్టింగ్ డీల్స్' : 'Hosting Deals'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeftCollapsed(true)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title="Collapse panel"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Hostinger France Card */}
              <a
                href={AFFILIATE_LINKS.hostingerFranceBanner728x90}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-indigo-300 flex items-center gap-1">
                    <span>🇫🇷</span> Hostinger France
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                    75% OFF
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-200 leading-tight">
                  {isTe ? 'లైట్‌స్పీడ్ హోస్టింగ్ + ఫ్రీ డొమైన్' : 'LiteSpeed Hosting + Free Domain'}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-indigo-900/50">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">€2.89/mo</span>
                  <span className="text-[10px] font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center">
                    <span>{isTe ? 'డీల్' : 'View'}</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </a>

              {/* Hostinger Germany Card */}
              <a
                href={AFFILIATE_LINKS.hostingerGermanyMain}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-xl bg-gradient-to-br from-blue-950/80 to-slate-900 border border-blue-500/30 hover:border-blue-400 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-blue-300 flex items-center gap-1">
                    <span>🇩🇪</span> Hostinger DE
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950">
                    NVMe Fast
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-200 leading-tight">
                  {isTe ? 'టర్బో క్లౌడ్ & వర్డ్‌ప్రెస్ సర్వర్లు' : 'Turbo Cloud & WordPress Host'}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-blue-900/50">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">€2.99/mo</span>
                  <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-300 flex items-center">
                    <span>{isTe ? 'డీల్' : 'View'}</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </a>

              {/* Verified Partner Badge */}
              <div className="px-2 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[9px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{isTe ? 'అఫీషియల్ పార్ట్‌నర్ ఆఫర్స్' : 'Verified Partner Offers'}</span>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT CONTAINER */}
        <div className="flex-1 min-w-0 w-full">
          {children}
        </div>

        {/* RIGHT SIDE PANEL (Desktop >= md) */}
        <aside
          aria-label="GoDaddy & Tools Side Panel"
          className={`hidden md:flex flex-col shrink-0 sticky top-24 z-20 transition-all duration-300 ${
            isRightCollapsed ? 'w-10' : 'w-44 lg:w-52 xl:w-56'
          }`}
        >
          {isRightCollapsed ? (
            <button
              type="button"
              onClick={() => setIsRightCollapsed(false)}
              className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 shadow-xl transition-all flex flex-col items-center gap-2 cursor-pointer group"
              title={isTe ? 'సైడ్ ప్యానెల్ తెరవండి' : 'Expand Right Tools Panel'}
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="[writing-mode:vertical-rl] text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-emerald-400">
                {isTe ? 'GoDaddy & టూల్స్' : 'GoDaddy & Tools'}
              </span>
              <Globe className="w-3.5 h-3.5 text-teal-400" />
            </button>
          ) : (
            <div className="relative rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-3.5 backdrop-blur-md space-y-3.5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[11px] font-black text-teal-300 uppercase tracking-wider">
                    {isTe ? 'డొమైన్ & బిల్డర్' : 'Domain & Builder'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRightCollapsed(true)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title="Collapse panel"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* GoDaddy Website Builder Card */}
              <a
                href={AFFILIATE_LINKS.godaddyWebsiteBuilder}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-xl bg-gradient-to-br from-teal-950/80 to-slate-900 border border-teal-500/30 hover:border-teal-400 transition-all group shadow-md"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-teal-300 flex items-center gap-1">
                    <span>🚀</span> GoDaddy Builder
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-teal-400 text-slate-950">
                    Official
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-200 leading-tight">
                  {isTe ? 'నిమిషాల్లో AI వెబ్‌సైట్ + ఉచిత హోస్టింగ్' : 'Build AI Websites + Free SSL'}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-teal-900/50">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">isc=cjcfos1</span>
                  <span className="text-[10px] font-bold text-teal-400 group-hover:text-teal-300 flex items-center">
                    <span>{isTe ? 'ప్రారంభించు' : 'Try Free'}</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </a>

              {/* Quick AI Crawler Shortcut */}
              {onOpenDeepCrawler && (
                <button
                  type="button"
                  onClick={onOpenDeepCrawler}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-indigo-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-extrabold text-white">
                      {isTe ? 'డీప్ AI క్రాలర్' : 'Deep AI Crawler'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {isTe ? 'మొత్తం వెబ్‌సైట్ పేజీలను ఒకే క్లిక్‌తో స్కాన్ చేయండి' : 'Crawl entire domain pages'}
                  </p>
                </button>
              )}

              {/* Quick AI Geo Audit Shortcut */}
              {onOpenAiGeo && (
                <button
                  type="button"
                  onClick={onOpenAiGeo}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-extrabold text-white">
                      {isTe ? 'గ్లోబల్ AI & SEO ఆడిట్' : 'Global AI & GEO'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {isTe ? '18+ దేశాలలో AI ర్యాంకింగ్ తనిఖీ' : 'Multi-region AI Search Visibility'}
                  </p>
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
