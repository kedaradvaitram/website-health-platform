import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Shield,
  Zap,
  Globe,
  Lock,
  Bot,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowUpRight,
  Radio,
  Search,
  Trash2,
} from 'lucide-react';
import { Language, FullAuditReport, UserAccount, AuditTargetModule } from '../types';

interface ActivityFeedProps {
  lang: Language;
  history?: FullAuditReport[];
  user?: UserAccount | null;
  onSelectUrl?: (url: string) => void;
  onSelectReport?: (report: FullAuditReport) => void;
  onClearHistory?: () => void;
  latestUserScan?: {
    url: string;
    score: number;
    grade?: string;
    module?: string;
  } | null;
}

export interface RealActivityItem {
  id: string;
  url: string;
  hostname: string;
  auditorName: string;
  auditorRole: string;
  auditorAvatar?: string;
  module: AuditTargetModule | string;
  moduleLabel: string;
  score: number;
  grade: string;
  timestamp: string;
  relativeTime: string;
  issuesCount: number;
  criticalIssues: number;
  rawReport?: FullAuditReport;
}

function formatRelativeTime(dateString: string, lang: Language): string {
  try {
    const timestamp = new Date(dateString).getTime();
    if (isNaN(timestamp)) return lang === 'te' ? 'ఇప్పుడే' : 'Just now';

    const diffMs = Math.max(0, Date.now() - timestamp);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return lang === 'te' ? 'ఇప్పుడే' : 'Just now';
    }
    if (diffMins < 60) {
      return lang === 'te' ? `${diffMins} నిమి క్రితం` : `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return lang === 'te' ? `${diffHours} గంటల క్రితం` : `${diffHours}h ago`;
    }
    return lang === 'te' ? `${diffDays} రోజుల క్రితం` : `${diffDays}d ago`;
  } catch {
    return lang === 'te' ? 'ఇప్పుడే' : 'Just now';
  }
}

function getModuleDisplay(mod: string | undefined, lang: Language): { label: string; icon: React.ReactNode } {
  switch (mod) {
    case 'security':
    case 'ssl':
      return {
        label: lang === 'te' ? 'సెక్యూరిటీ & SSL' : 'Security & SSL',
        icon: <Shield className="w-3.5 h-3.5 text-indigo-400" />,
      };
    case 'performance':
    case 'speed':
      return {
        label: lang === 'te' ? 'స్పీడ్ & పెర్ఫార్మెన్స్' : 'Speed & Performance',
        icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
      };
    case 'vitals':
      return {
        label: lang === 'te' ? 'కోర్ వెబ్ వైటల్స్' : 'Core Web Vitals',
        icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      };
    case 'seo':
      return {
        label: lang === 'te' ? 'వెబ్‌సైట్ SEO' : 'Website SEO',
        icon: <Globe className="w-3.5 h-3.5 text-teal-400" />,
      };
    case 'accessibility':
      return {
        label: lang === 'te' ? 'యాక్సెసిబిలిటీ' : 'Accessibility (WCAG)',
        icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
      };
    case 'ai':
      return {
        label: lang === 'te' ? 'AI ఇంజిన్ డయాగ్నోస్టిక్స్' : 'AI Engine Diagnostics',
        icon: <Bot className="w-3.5 h-3.5 text-purple-400" />,
      };
    default:
      return {
        label: lang === 'te' ? '360° ఫుల్ ఆడిట్' : 'Full 360° Audit',
        icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
      };
  }
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  lang,
  history = [],
  user,
  onSelectUrl,
  onSelectReport,
  onClearHistory,
  latestUserScan,
}) => {
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'security' | 'performance' | 'seo'>('all');
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Clean up any legacy mock data from previous versions
  useEffect(() => {
    try {
      localStorage.removeItem('whs_team_activity_feed');
    } catch {}
  }, []);

  // Update relative timestamps every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Convert real history items into activity stream items (100% genuine user/team scans)
  const realAuditItems = useMemo<RealActivityItem[]>(() => {
    const items: RealActivityItem[] = [];

    // 1. Process reports from real audit history
    if (Array.isArray(history)) {
      history.forEach((report) => {
        if (!report || !report.url) return;
        const cleanHost = report.hostname || report.url.replace(/^https?:\/\//, '').split('/')[0];
        const mod = report.targetAuditModule || 'all';
        const modDisplay = getModuleDisplay(mod, lang);

        const currentAuditorName = user?.name || (user?.email ? user.email.split('@')[0] : (lang === 'te' ? 'మీరు (ప్రస్తుత సెషన్)' : 'You (Current Session)'));
        const currentAuditorRole = user?.role === 'admin' 
          ? (lang === 'te' ? 'అడ్మిన్' : 'Security Admin')
          : (lang === 'te' ? 'ఆడిటర్' : 'Security Analyst');

        const totalIssues = report.issueCounts?.total ?? (
          (report.issueCounts?.critical || 0) + 
          (report.issueCounts?.high || 0) + 
          (report.issueCounts?.medium || 0) + 
          (report.issueCounts?.low || 0)
        );

        items.push({
          id: report.id || `audit-${report.timestamp}-${cleanHost}`,
          url: report.url,
          hostname: cleanHost,
          auditorName: currentAuditorName,
          auditorRole: currentAuditorRole,
          auditorAvatar: user?.photoURL,
          module: mod,
          moduleLabel: modDisplay.label,
          score: report.overallScore ?? 90,
          grade: report.grade || (report.overallScore >= 90 ? 'A+' : report.overallScore >= 80 ? 'A' : 'B'),
          timestamp: report.timestamp || new Date().toISOString(),
          relativeTime: formatRelativeTime(report.timestamp || new Date().toISOString(), lang),
          issuesCount: totalIssues,
          criticalIssues: report.issueCounts?.critical ?? 0,
          rawReport: report,
        });
      });
    }

    // 2. If latest scan exists and isn't in history yet, prepend it
    if (latestUserScan && latestUserScan.url) {
      const cleanHost = latestUserScan.url.replace(/^https?:\/\//, '').split('/')[0];
      const exists = items.some((item) => item.url === latestUserScan.url || item.hostname === cleanHost);
      if (!exists) {
        const mod = latestUserScan.module || 'all';
        const modDisplay = getModuleDisplay(mod, lang);
        items.unshift({
          id: `latest-${Date.now()}`,
          url: latestUserScan.url,
          hostname: cleanHost,
          auditorName: user?.name || (user?.email ? user.email.split('@')[0] : (lang === 'te' ? 'మీరు (ప్రస్తుత సెషన్)' : 'You (Current Session)')),
          auditorRole: user?.role === 'admin' ? (lang === 'te' ? 'అడ్మిన్' : 'Security Admin') : (lang === 'te' ? 'ఆడిటర్' : 'Security Analyst'),
          auditorAvatar: user?.photoURL,
          module: mod,
          moduleLabel: modDisplay.label,
          score: latestUserScan.score || 95,
          grade: latestUserScan.grade || (latestUserScan.score >= 90 ? 'A+' : 'A'),
          timestamp: new Date().toISOString(),
          relativeTime: lang === 'te' ? 'ఇప్పుడే' : 'Just now',
          issuesCount: Math.max(0, Math.floor((100 - (latestUserScan.score || 95)) / 4)),
          criticalIssues: latestUserScan.score < 75 ? 1 : 0,
        });
      }
    }

    return items;
  }, [history, user, latestUserScan, lang, currentTime]);

  // Filter real audits by category
  const filteredAudits = useMemo(() => {
    return realAuditItems.filter((item) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'security') return item.module === 'security' || item.module === 'ssl';
      if (activeFilter === 'performance') return item.module === 'performance' || item.module === 'vitals' || item.module === 'speed';
      if (activeFilter === 'seo') return item.module === 'seo';
      return true;
    });
  }, [realAuditItems, activeFilter]);

  return (
    <section
      id="team-activity-feed-section"
      aria-label="Real-Time Audit Feed"
      className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10"
    >
      <div className="bg-slate-900/90 hover:bg-slate-900/95 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-xl backdrop-blur-md transition-all overflow-hidden">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & Live Heartbeat */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <span className="flex h-2.5 w-2.5 relative">
                {isLiveStreaming && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveStreaming ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{lang === 'te' ? 'లైవ్ ఆడిట్ యాక్టివిటీ ఫీడ్' : 'Real-Time Audit Activity Feed'}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  {realAuditItems.length > 0 
                    ? (lang === 'te' ? `${realAuditItems.length} ఆడిట్‌లు` : `${realAuditItems.length} Real Audits`) 
                    : (lang === 'te' ? 'లైవ్ స్ట్రీమ్' : 'Live Stream')}
                </span>
              </h3>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
            {/* Filter Pills */}
            <div className="hidden sm:flex items-center bg-slate-950/80 rounded-xl p-0.5 border border-slate-800 text-[11px] font-medium">
              {[
                { id: 'all', label: lang === 'te' ? 'అన్నీ' : 'All' },
                { id: 'security', label: lang === 'te' ? 'సెక్యూరిటీ' : 'Security' },
                { id: 'performance', label: lang === 'te' ? 'స్పీడ్' : 'Speed' },
                { id: 'seo', label: 'SEO' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-slate-800 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Live Toggle Button */}
            <button
              type="button"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              title={isLiveStreaming ? 'Pause live stream' : 'Resume live stream'}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                isLiveStreaming
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3 h-3 ${isLiveStreaming ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden xs:inline">{isLiveStreaming ? 'LIVE' : 'PAUSED'}</span>
            </button>

            {/* Clear All Dev / History button */}
            {realAuditItems.length > 0 && onClearHistory && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(lang === 'te' ? 'పాత ఆడిట్ రికార్డులన్నింటినీ క్లియర్ చేయాలా?' : 'Clear all audit activity history?')) {
                    onClearHistory();
                  }
                }}
                title={lang === 'te' ? 'హిస్టరీని పూర్తిగా క్లియర్ చేయండి' : 'Clear all audit history'}
                className="px-2 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">{lang === 'te' ? 'క్లియర్' : 'Clear'}</span>
              </button>
            )}

            {/* Collapse / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse activity feed' : 'Expand activity feed'}
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Feed List Items (Compact, 100% Real Scans) */}
        {isExpanded && (
          <div className="divide-y divide-slate-800/60 overflow-hidden">
            {filteredAudits.length === 0 ? (
              <div className="py-8 px-4 text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-300">
                  {lang === 'te' 
                    ? 'ఇప్పటివరకు ఎటువంటి ఆడిట్ రికార్డులు లేవు' 
                    : 'No real audit history recorded yet'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-md">
                  {lang === 'te'
                    ? 'లైవ్ డయాగ్నోస్టిక్స్ మరియు హెల్త్ లాగ్‌లను ఇక్కడ నిజ సమయంలో చూడటానికి పైన ఏదైనా వెబ్‌సైట్ URLను స్కాన్ చేయండి.'
                    : 'Run a website scan above to view real-time diagnostics, performance metrics, and security health records here.'}
                </p>
              </div>
            ) : (
              filteredAudits.slice(0, 8).map((audit) => {
                const scoreColor =
                  audit.score >= 90
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : audit.score >= 80
                    ? 'text-teal-300 bg-teal-500/10 border-teal-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

                const modIcon = getModuleDisplay(audit.module, lang).icon;

                return (
                  <div
                    key={audit.id}
                    className="p-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Left: Auditor & Website Info */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {/* Auditor Avatar */}
                      <div className="relative shrink-0">
                        {audit.auditorAvatar ? (
                          <img
                            src={audit.auditorAvatar}
                            alt={audit.auditorName}
                            className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
                            {audit.auditorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-700">
                          {modIcon}
                        </span>
                      </div>

                      {/* URL & Auditor details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (audit.rawReport && onSelectReport) {
                                onSelectReport(audit.rawReport);
                              } else if (onSelectUrl) {
                                onSelectUrl(audit.url);
                              }
                            }}
                            className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate max-w-[240px] sm:max-w-md font-mono text-left cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{audit.hostname}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 shrink-0" />
                          </button>

                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono shrink-0">
                            {audit.moduleLabel}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="text-slate-300 font-medium truncate max-w-[160px]">
                            {audit.auditorName}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400 truncate max-w-[120px] hidden xs:inline">
                            {audit.auditorRole}
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-1 text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{audit.relativeTime}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Score, Issues, and Quick Scan Action */}
                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/50">
                      {/* Issues pill */}
                      <div className="text-[11px] text-slate-400 font-mono">
                        {audit.issuesCount === 0 ? (
                          <span className="text-emerald-400 font-semibold">
                            {lang === 'te' ? '0 సమస్యలు' : '0 issues'}
                          </span>
                        ) : (
                          <span>
                            {audit.issuesCount} {lang === 'te' ? 'సమస్యలు' : 'issues'}
                          </span>
                        )}
                      </div>

                      {/* Score Badge */}
                      <div className={`px-2.5 py-1 rounded-xl border text-xs font-black font-mono flex items-center space-x-1.5 ${scoreColor}`}>
                        <span>{audit.score}</span>
                        <span className="text-[10px] font-bold opacity-80">{audit.grade}</span>
                      </div>

                      {/* Quick Inspect / Audit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (audit.rawReport && onSelectReport) {
                            onSelectReport(audit.rawReport);
                          } else if (onSelectUrl) {
                            onSelectUrl(audit.url);
                          }
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                        title={`Audit ${audit.hostname} now`}
                      >
                        <span className="hidden sm:inline">
                          {audit.rawReport ? (lang === 'te' ? 'రిపోర్ట్' : 'View') : (lang === 'te' ? 'ఆడిట్' : 'Audit')}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
};
