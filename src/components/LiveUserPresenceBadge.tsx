import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Sparkles, 
  Globe2, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Zap, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Language, LiveUserPresenceStats } from '../types';
import { translations } from '../data/translations';
import { presenceService, ActivityFeedItem } from '../lib/presenceService';

interface LiveUserPresenceBadgeProps {
  lang: Language;
  onOpenAuth?: () => void;
}

export const LiveUserPresenceBadge: React.FC<LiveUserPresenceBadgeProps> = ({
  lang,
  onOpenAuth,
}) => {
  const t = translations[lang] || translations.en;

  const [stats, setStats] = useState<LiveUserPresenceStats>(presenceService.getStats());
  const [feed, setFeed] = useState<ActivityFeedItem[]>(presenceService.getFeed());
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Subscribe to real-time global multi-device presence stream
  useEffect(() => {
    const unsubscribe = presenceService.subscribe((updatedStats, updatedFeed) => {
      setStats(updatedStats);
      if (updatedFeed && updatedFeed.length > 0) {
        setFeed(updatedFeed);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await presenceService.fetchApiFallback();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Format user numbers (e.g. 0 -> '0', 1200 -> '1.2k')
  const formatUserNumber = (num: number) => {
    if (!num || num <= 0) {
      return '0';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toLocaleString();
  };

  return (
    <>
      {/* Header Pill / Interactive Badge */}
      <button
        type="button"
        id="btn-header-active-users-score"
        onClick={() => setIsOpenModal(true)}
        className="group relative flex items-center bg-slate-900/90 hover:bg-slate-850 text-slate-200 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700/90 hover:border-amber-400/50 shadow-sm hover:shadow-amber-500/10 transition-all cursor-pointer select-none ring-1 ring-white/5 shrink-0"
        title={
          lang === 'te'
            ? `లైవ్ యాక్టివ్ యూజర్లు: ${stats.activeOnlineUsers} | మొత్తం లాగిన్లు: ${stats.totalRegisteredUsers.toLocaleString()} | యాక్టివ్ స్కోర్: ${stats.activeScore}/100 (పూర్తి వివరాలు చూడండి)`
            : `Live Active Users: ${stats.activeOnlineUsers} | Logged-in Users: ${stats.totalRegisteredUsers.toLocaleString()} | Active Score: ${stats.activeScore}/100 (Click for Telemetry)`
        }
      >
        {/* Pulsing Live Beacon Indicator */}
        <span className="relative flex h-2.5 w-2.5 mr-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-xs shadow-emerald-400"></span>
        </span>

        {/* Desktop View (Full detailed metrics) */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold">
          {/* Active Now */}
          <div className="flex items-center space-x-1">
            <span className="font-black text-emerald-400 font-mono tracking-tight">
              {stats.activeOnlineUsers}
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              {lang === 'te' ? 'యాక్టివ్' : 'Active'}
            </span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Logged in users */}
          <div className="flex items-center space-x-1 text-slate-300">
            <Users className="w-3 h-3 text-indigo-400" />
            <span className="font-black text-indigo-200 font-mono">
              {formatUserNumber(stats.totalRegisteredUsers)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {lang === 'te' ? 'యూజర్లు' : 'Users'}
            </span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Active Score Pill (Rich Amber/Gold Contrast) */}
          <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300 px-2 py-0.5 rounded-lg text-[11px] font-black tracking-tight group-hover:border-amber-400 group-hover:shadow-xs group-hover:shadow-amber-500/20 transition-all">
            <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span>{stats.activeScore}</span>
            <span className="text-[9px] text-amber-400/80 font-bold uppercase">
              {lang === 'te' ? 'స్కోర్' : 'Score'}
            </span>
          </div>
        </div>

        {/* Tablet View (Active count + Active Score) */}
        <div className="hidden sm:flex lg:hidden items-center space-x-1.5 text-xs font-semibold">
          <span className="font-black text-emerald-400 font-mono">
            {stats.activeOnlineUsers}
          </span>
          <span className="text-[11px] text-slate-300">
            {lang === 'te' ? 'యాక్టివ్' : 'Active'}
          </span>
          <span className="text-slate-700">•</span>
          <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-md border border-amber-500/40">
            ⚡ {stats.activeScore}
          </span>
        </div>

        {/* Mobile View (Ultra-compact & Clean) */}
        <div className="flex sm:hidden items-center space-x-1 text-xs">
          <span className="font-black text-emerald-400 font-mono text-[11px]">
            {stats.activeOnlineUsers}
          </span>
          <span className="text-[10px] text-slate-400">
            {lang === 'te' ? 'యాక్టివ్' : 'Live'}
          </span>
          <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
            {stats.activeScore}⚡
          </span>
        </div>
      </button>

      {/* Live User Presence & Activity Telemetry Modal (Safely centered, no top clipping) */}
      {isOpenModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-5 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpenModal(false);
          }}
        >
          <div 
            id="modal-user-activity-telemetry"
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl shadow-black flex flex-col my-auto max-h-[88vh] overflow-hidden"
          >
            {/* Modal Header - Fixed Top */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0 z-10">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white shrink-0">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-white truncate">
                      {lang === 'te' ? 'లైవ్ యూజర్ యాక్టివిటీ & స్కోర్' : 'Live Users & Platform Telemetry'}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {lang === 'te'
                      ? 'ప్రస్తుతం సైట్‌లో ఉన్న యాక్టివ్ యూజర్లు & రియల్-టైమ్ గణాంకాలు'
                      : 'Real-time concurrent sessions and active system health'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer disabled:opacity-50"
                  title="Refresh Telemetry"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {/* Primary Active Score & Live Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-850 to-teal-950/50 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
                    <Zap className="w-6 h-6 fill-emerald-400" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {lang === 'te' ? 'ప్లాట్‌ఫామ్ యాక్టివ్ స్కోర్' : 'Platform Active Score'}
                    </div>
                    <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1.5">
                      <span>{stats.activeScore}</span>
                      <span className="text-xs text-slate-400 font-sans font-medium">/ 100 Optimal</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'te' ? 'సిస్టమ్ 100% ఆపరేషనల్' : '100% High-Availability Edge'}</span>
                </div>
              </div>

              {/* 4-Stat Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {/* 1. Active Now */}
                <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-left">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">
                      {lang === 'te' ? 'లైవ్ యాక్టివ్' : 'Active Now'}
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {stats.activeOnlineUsers}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'te' ? 'ప్రస్తుత యూజర్లు' : 'concurrent users'}
                  </div>
                </div>

                {/* 2. Total Registered Users */}
                <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-left">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">
                      {lang === 'te' ? 'మొత్తం యూజర్లు' : 'Total Users'}
                    </span>
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {stats.totalRegisteredUsers.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'te' ? 'రిజిస్టర్డ్ ఖాతాలు' : 'registered accounts'}
                  </div>
                </div>

                {/* 3. Logins Today */}
                <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-left">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">
                      {lang === 'te' ? 'ఈరోజు లాగిన్లు' : 'Logins Today'}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {stats.totalLoggedToday.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'te' ? 'ఈరోజు యాక్టివ్' : 'sessions claimed'}
                  </div>
                </div>

                {/* 4. Active Audits Running */}
                <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-left">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">
                      {lang === 'te' ? 'లైవ్ స్కాన్లు' : 'Active Scans'}
                    </span>
                    <Cpu className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-teal-300 font-mono">
                    {stats.activeAuditsRunning}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'te' ? 'రన్ అవుతున్నవి' : 'executing now'}
                  </div>
                </div>
              </div>

              {/* Live Community Activity Stream */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'te' ? 'లైవ్ కమ్యూనిటీ యాక్టివిటీ ఫీడ్' : 'Live Community Activity Stream'}</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    auto-updating edge feed
                  </span>
                </div>

                <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-2 divide-y divide-slate-800/80 max-h-48 overflow-y-auto">
                  {feed.length === 0 ? (
                    <div className="py-6 px-4 text-center text-xs text-slate-400">
                      {lang === 'te'
                        ? 'లైవ్ ఆడిట్లు ప్రారంభం కాగానే రియల్-టైమ్ యాక్టివిటీ ఇక్కడ కనిపిస్తుంది.'
                        : 'Live community activity stream will populate as real audits and actions occur.'}
                    </div>
                  ) : (
                    feed.map((item) => (
                      <div key={item.id} className="py-2 px-2.5 flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
                          <div className="truncate">
                            <div className="text-slate-200 font-medium truncate">
                              <span className="font-bold text-white">{item.user}</span>{' '}
                              <span className="text-slate-400">({item.location})</span>{' '}
                              <span className="text-emerald-300">{item.action}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {item.score && (
                            <span className="text-[10px] font-bold bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700">
                              {item.score}/100
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                            {item.timeAgo}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Login Callout if guest */}
              {onOpenAuth && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {lang === 'te' ? 'లాగిన్ అయ్యి +5 ఉచిత క్రెడిట్స్ పొందండి' : 'Sign in to claim +5 Free Scan Credits'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lang === 'te' ? 'Google, OTP లేదా పాస్‌వర్డ్ ద్వారా తక్షణ లాగిన్' : 'Instant 1-click login with Google or 6-digit OTP'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenModal(false);
                      onOpenAuth();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer shrink-0"
                  >
                    {lang === 'te' ? 'లాగిన్ (+5⚡)' : 'Sign In (+5⚡)'}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer - Fixed Bottom */}
            <div className="px-5 sm:px-6 py-3 border-t border-slate-800 bg-slate-900/95 shrink-0 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{lang === 'te' ? 'ధృవీకరించబడిన నెట్‌వర్క్ టెలిమెట్రీ' : 'Verified Real-Time Network Telemetry'}</span>
              </span>

              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.close || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
