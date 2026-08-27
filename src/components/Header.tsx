import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Gift, 
  Download, 
  Globe, 
  ArrowRightLeft, 
  FileDown, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Check, 
  Sparkles,
  Zap,
  Star,
  Layers,
  Bot,
  Bell,
  Swords,
  Code2,
  Globe2,
  Building2,
  Users,
  Activity,
  ListOrdered,
  RefreshCw,
  Key,
  LogOut,
  Sliders,
  Sun,
  Moon,
  BrainCircuit,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations, SUPPORTED_LANGUAGES, SupportedLanguageInfo } from '../data/translations';
import { LiveUserPresenceBadge } from './LiveUserPresenceBadge';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  user: UserAccount;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenReferral: () => void;
  onOpenDownloads: () => void;
  onNewScan: () => void;
  historyCount: number;
  onOpenCompare?: () => void;
  onDownloadReport?: () => void;
  hasActiveReport?: boolean;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  onOpenPricing?: () => void;
  onOpenRating?: () => void;
  onOpenAdSenseKit?: () => void;
  onOpenDeepCrawler?: () => void;
  onOpenAiGeo?: () => void;
  onOpenMonitoring?: () => void;
  onOpenCompetitor?: () => void;
  onOpenDevCenter?: () => void;
  onOpenIntlSeo?: () => void;
  onOpenAgency?: () => void;
  onOpenGlobalLatency?: () => void;
  onOpenGitHubAutoFix?: () => void;
  onOpenCrUXHistory?: () => void;
  onOpenOwaspSecurity?: () => void;
  onOpenMultiChannelAlerts?: () => void;
  onOpenTeamWorkspace?: () => void;
  onOpenDeveloperApi?: () => void;
  onOpenApiDocs?: () => void;
  onOpenStatusPage?: () => void;
  onOpenAiFix?: () => void;
  onOpenFixAndRescan?: () => void;
  onOpenIssueRoadmap?: () => void;
  onOpenWorldsBestEngine?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  user,
  onOpenReferral,
  onOpenDownloads,
  onNewScan,
  onOpenCompare,
  onDownloadReport,
  hasActiveReport = false,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onOpenPricing,
  onOpenRating,
  onOpenAdSenseKit,
  onOpenDeepCrawler,
  onOpenAiGeo,
  onOpenMonitoring,
  onOpenCompetitor,
  onOpenDevCenter,
  onOpenIntlSeo,
  onOpenAgency,
  onOpenGlobalLatency,
  onOpenGitHubAutoFix,
  onOpenCrUXHistory,
  onOpenOwaspSecurity,
  onOpenMultiChannelAlerts,
  onOpenTeamWorkspace,
  onOpenDeveloperApi,
  onOpenApiDocs,
  onOpenStatusPage,
  onOpenAiFix,
  onOpenFixAndRescan,
  onOpenIssueRoadmap,
  onOpenWorldsBestEngine,
}) => {
  const t = translations[lang] || translations.en;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuLangExpanded, setIsMenuLangExpanded] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userInitial = (user.name || user.email || 'U').charAt(0).toUpperCase();
  const displayName = user.name || (user.email ? user.email.split('@')[0] : 'Member');
  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAction = (callback?: () => void) => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    if (callback) callback();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand with Updated Favicon Emblem */}
          <button
            onClick={onNewScan}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200 border border-emerald-300/30">
              <ShieldCheck className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  {t.appTitle.includes('Website') ? 'WebsiteHealth.AI' : t.appTitle}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                  PRO
                </span>
              </div>
              <p className="text-[11px] hidden sm:block font-medium text-slate-400">
                {t.appTagline}
              </p>
            </div>
          </button>

          {/* Header Controls: Live Users Active Score + Status Button + User Profile + Three Lines Menu Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dedicated Live System Status Pill Button */}
            {onOpenStatusPage && (
              <button
                type="button"
                id="btn-header-live-status"
                onClick={onOpenStatusPage}
                className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 transition-all cursor-pointer shadow-xs group"
                title="View Real-Time API Uptime, Latency & System Health"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-extrabold">100%</span>
                <span className="hidden xl:inline text-[11px] font-semibold text-slate-300">
                  {t.systemStatus || 'Status'}
                </span>
              </button>
            )}

            {/* Live User Presence & Active Score Pill Badge */}
            <LiveUserPresenceBadge lang={lang} onOpenAuth={onOpenAuth} />

            {/* Quick Referral & Free Pass Pill */}
            <button
              type="button"
              id="btn-header-quick-referral"
              onClick={onOpenReferral}
              className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border-2 border-amber-400/70 hover:border-amber-300 transition-all cursor-pointer shadow-sm shadow-amber-500/10 active:scale-95"
              title="1 Refer = 1 Full Website Pass (₹799 Value Free)"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">
                {t.oneReferPass || '1 Refer = 1 Free Pass'}
              </span>
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md font-mono font-black text-[10px]">
                {user.credits ?? 0} ⚡
              </span>
            </button>

            {/* User Account Button with Dropdown */}
            {user.isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  id="btn-header-profile"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 pl-2 pr-3 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer border border-amber-300/60 group"
                  title={`${user.name || 'User'} (${user.email || ''}) - View Account & Settings`}
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-950/25 text-slate-950 flex items-center justify-center text-xs font-black shadow-2xs overflow-hidden">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div className="text-left leading-tight hidden sm:block max-w-[130px] truncate">
                    <span className="block truncate font-black text-xs text-slate-950">{displayName}</span>
                    <span className="block truncate text-[9px] text-slate-900 font-mono font-bold">{user.email || 'Pro Member'}</span>
                  </div>
                  <span className="sm:hidden font-black text-slate-950">{displayName}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-950 transition-transform ${isUserMenuOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                    {/* User Identity Card */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md overflow-hidden shrink-0">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            userInitial
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-xs text-white truncate block">{displayName}</span>
                            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>Live</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{user.email || 'jpschari789@gmail.com'}</p>
                        </div>
                      </div>

                      {/* Real-time Cloud Sync Badge */}
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{lang === 'te' ? 'Firebase సింక్' : 'Firestore Synced'}</span>
                        </span>
                        <span className="font-mono text-emerald-400 font-semibold text-[10px]">
                          {user.authProvider === 'google' ? 'Google Auth' : 'Verified'}
                        </span>
                      </div>

                      {/* Credits Counter in Dropdown */}
                      <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">
                          {lang === 'te' ? 'స్కాన్ క్రెడిట్స్:' : 'Scan Credits:'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-mono font-bold text-amber-300 text-xs">
                            {user.credits ?? 5} ⚡
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <div className="flex-1">
                          <span className="block">{lang === 'te' ? 'యూజర్ ప్రొఫైల్ & API సెట్టింగ్స్' : 'Profile & API Settings'}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{lang === 'te' ? 'API కీలు, వినియోగ వివరాలు' : 'Manage API Keys & Quota'}</span>
                        </div>
                      </button>

                      {onOpenReferral && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenReferral();
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
                        >
                          <Gift className="w-4 h-4 text-amber-400" />
                          <div className="flex-1">
                            <span className="block font-bold">{lang === 'te' ? '1 రిఫర్ = 1 వెబ్‌సైట్ ఫుల్ పాస్ (₹799 ఉచితం)' : '1 Refer = 1 Website Pass (₹799 Free)'}</span>
                            <span className="block text-[10px] text-amber-300/80 font-normal">{lang === 'te' ? 'స్నేహితుడిని ఆహ్వానించి పూర్తి కోడ్ ఫిక్స్ పొందండి' : 'Earn 100% full Pro fixes free per refer'}</span>
                          </div>
                        </button>
                      )}

                      {/* Direct Logout Button */}
                      {onLogout && (
                        <div className="pt-1 mt-1 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onLogout();
                            }}
                            id="btn-header-logout-direct"
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-400" />
                            <span>{lang === 'te' ? 'లాగ్ అవుట్ (Logout)' : 'Log Out'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  id="btn-header-auth"
                  className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 border border-amber-300/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-pulse-subtle"
                  title="Sign in with Google, 6-Digit OTP, or Password (+5 Scan Credits)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950 animate-spin-slow" />
                  <span className="hidden sm:inline font-black tracking-tight">
                    {lang === 'te' ? 'లాగిన్ / సైన్ అప్ (+5⚡)' : 'Login / Sign Up (+5⚡)'}
                  </span>
                  <span className="sm:hidden font-black">
                    {lang === 'te' ? 'లాగిన్ (+5⚡)' : 'Login (+5⚡)'}
                  </span>
                </button>
              )
            )}

            {/* Three Lines (Hamburger) Dropdown Menu Container */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                id="btn-three-lines-menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                  isMenuOpen
                    ? 'bg-slate-800 text-amber-300 border-amber-400/60 shadow-amber-500/20 ring-2 ring-amber-400/30'
                    : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700/90 hover:border-slate-600'
                }`}
                title={lang === 'te' ? 'మెనూ ఎంపికలు' : 'Menu options'}
              >
                {/* 3 Lines Icon */}
                {isMenuOpen ? (
                  <X className="w-4 h-4 text-amber-400 transition-transform" />
                ) : (
                  <Menu className="w-4 h-4 text-emerald-400 transition-transform" />
                )}
                <span className="hidden sm:inline">
                  {lang === 'te' ? 'మెనూ' : 'Menu'}
                </span>
              </button>

              {/* Dropdown Menu Content */}
              {isMenuOpen && (
                <div 
                  id="three-lines-dropdown-panel"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/80 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl max-h-[85vh] overflow-y-auto scrollbar-thin"
                >
                  {/* Dropdown Header */}
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{lang === 'te' ? 'ఎంపికలు & సాధనాలు' : 'Options & Tools'}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-mono lowercase">
                      quick actions
                    </span>
                  </div>

                  <div className="p-2 space-y-1.5">
                    {/* 1. Worldwide Language Picker (All 11 Languages) */}
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 space-y-2">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setIsMenuLangExpanded(!isMenuLangExpanded)}
                      >
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-slate-200">
                            {lang === 'te' ? 'భాష (Worldwide Languages)' : 'Language (Worldwide)'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-400 bg-slate-850 px-2 py-0.5 rounded-lg border border-slate-700">
                          <span>{currentLangInfo.flag}</span>
                          <span>{currentLangInfo.nativeName}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${isMenuLangExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {isMenuLangExpanded && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/80 max-h-44 overflow-y-auto scrollbar-thin">
                          {SUPPORTED_LANGUAGES.map((item) => {
                            const isSelected = item.code === lang;
                            return (
                              <button
                                key={item.code}
                                type="button"
                                onClick={() => {
                                  onToggleLang(item.code);
                                }}
                                className={`flex items-center justify-start space-x-1.5 px-2 py-1.5 rounded-lg text-left text-[11px] transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-500 text-white font-black shadow-xs ring-1 ring-emerald-400'
                                    : 'bg-slate-850 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-750'
                                }`}
                                title={`${item.name} (${item.region})`}
                              >
                                <span className="text-xs">{item.flag}</span>
                                <span className="truncate">{item.nativeName}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* World's Best AI Neural Engine (Gemini 3.7 Flash) */}
                    {onOpenWorldsBestEngine && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenWorldsBestEngine)}
                        id="btn-drawer-worlds-best-engine"
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900 hover:from-emerald-500/25 hover:to-slate-800 text-left text-slate-100 hover:text-white transition-all cursor-pointer group border border-emerald-500/40 shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                            <BrainCircuit className="w-4 h-4 text-emerald-300 animate-pulse" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-emerald-300 group-hover:text-emerald-200 transition-colors flex items-center gap-1.5">
                              <span>{t.worldsBestEngineTitle || "World's Best AI Neural Engine"}</span>
                              <span className="text-[9px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded font-black font-mono">
                                Gemini 3.7
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {t.worldsBestEngineDesc || 'Google Gemini 3.7 Flash autonomous diagnostics & 1-click code remediation'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-md shrink-0 shadow-xs">
                          {t.worldsBestEngineBadge || 'Gemini'}
                        </span>
                      </button>
                    )}

                    {/* 2. 1-Click Auto-Fix & Remediation Pricing Plans */}
                    {onOpenPricing && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenPricing)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group border border-amber-500/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'ఆటో-ఫిక్స్ ప్లాన్‌లు & ధరలు' : '1-Click Auto-Fix & Pricing'}</span>
                              <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">₹299+</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'తక్షణ కోడ్ ప్యాచ్ & రేజర్‌పే గేట్‌వే' : 'Instant PR patches & Razorpay checkout'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-0.5 rounded-md shadow-xs">
                          {lang === 'te' ? 'ప్లాన్లు' : 'Plans'}
                        </span>
                      </button>
                    )}

                    {/* AI Fix Engine */}
                    {onOpenAiFix && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenAiFix)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'AI ఫిక్స్ ఇంజిన్ (AI Fix Engine)' : 'AI Fix Engine'}</span>
                              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono font-bold">Auto</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'ఆటోమేటిక్ కోడ్ ఫిక్సెస్ & ఫ్రేమ్‌వర్క్ ప్యాచ్‌లు' : '1-Click framework-aware code patches'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md">
                          AI Fix
                        </span>
                      </button>
                    )}

                    {/* Fix & Re-scan UI */}
                    {onOpenFixAndRescan && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenFixAndRescan)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'ఫిక్స్ & రీ-స్కాన్ UI (Fix & Re-scan)' : 'Fix & Re-scan UI'}</span>
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">Live</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'కోడ్ మార్పుల తనిఖీ & తక్షణ స్కోర్ అప్‌డేట్' : 'Live patch editor & re-scan verification'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md">
                          Re-scan
                        </span>
                      </button>
                    )}

                    {/* Issue Priority Roadmap */}
                    {onOpenIssueRoadmap && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenIssueRoadmap)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                            <ListOrdered className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'ఇష్యూ ప్రయారిటీ రోడ్‌మ్యాప్' : 'Issue Priority Roadmap'}</span>
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">P0-P3</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'క్రమబద్ధీకరించిన సమస్యల పరిష్కార ప్రణాళిక' : 'Sequenced critical P0/P1 fix roadmap'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-amber-950/80 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md">
                          Roadmap
                        </span>
                      </button>
                    )}

                    {/* 3. Compare Websites Feature */}
                    {onOpenCompare && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenCompare)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <ArrowRightLeft className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-indigo-300 transition-colors">
                              {lang === 'te' ? 'వెబ్‌సైట్లను పోల్చండి (Compare)' : 'Compare Websites'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'పోటీదారులతో హెల్త్ స్కోర్ పోలిక' : 'Benchmark against competitors'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md">
                          {lang === 'te' ? 'పోల్చండి' : 'Compare'}
                        </span>
                      </button>
                    )}

                    {/* 4. Deep Website Crawler (Multi-Page Tree) */}
                    {onOpenDeepCrawler && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenDeepCrawler)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-cyan-300 transition-colors">
                              {lang === 'te' ? 'డీప్ వెబ్‌సైట్ క్రాలర్' : 'Deep Website Crawler'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? '10 పేజీల డీప్ ట్రావర్సల్ & బ్రోకెన్ లింక్స్' : 'Multi-page tree & 404 broken link check'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-md">
                          Crawl
                        </span>
                      </button>
                    )}

                    {/* 5. AI SEO & GEO Analyzer */}
                    {onOpenAiGeo && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenAiGeo)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-emerald-300 transition-colors">
                              {lang === 'te' ? 'AI SEO & GEO అనలైజర్' : 'AI SEO & GEO Analyzer'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'ChatGPT, Perplexity & /llms.txt సపోర్ట్' : 'ChatGPT, Gemini citations & llms.txt'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md">
                          GEO
                        </span>
                      </button>
                    )}

                    {/* 6. 24/7 Automated Monitoring & Alerts */}
                    {onOpenMonitoring && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenMonitoring)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-purple-300 transition-colors">
                              {lang === 'te' ? '24/7 హెల్త్ మానిటరింగ్' : '24/7 Health Monitoring'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'స్కోర్ డ్రాప్ & SSL అలర్ట్ షెడ్యూలర్' : 'Recurring scans & instant email alerts'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-purple-950/80 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-md">
                          Alerts
                        </span>
                      </button>
                    )}

                    {/* 7. Competitor Benchmarking */}
                    {onOpenCompetitor && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenCompetitor)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                            <Swords className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-amber-300 transition-colors">
                              {lang === 'te' ? 'కాంపిటీటర్ ఇంటెలిజెన్స్' : 'Competitor Intelligence'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'హెడ్-టు-హెడ్ గ్యాప్ ఎనాలసిస్ & స్కీమా' : 'Head-to-head performance & SEO gaps'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-amber-950/80 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md">
                          Versus
                        </span>
                      </button>
                    )}

                    {/* 8. Developer Fix Center & Tools Hub */}
                    {onOpenDevCenter && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenDevCenter)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-indigo-300 transition-colors">
                              {lang === 'te' ? 'డెవలపర్ ఫిక్స్ సెంటర్' : 'Developer Fix Suite'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'JSON-LD, Nginx కాన్ఫిగ్ & హెల్త్ బ్యాడ్జ్' : 'JSON-LD builder, Nginx & embed badge'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md">
                          Tools
                        </span>
                      </button>
                    )}

                    {/* 9. International SEO & Hreflang */}
                    {onOpenIntlSeo && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenIntlSeo)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                            <Globe2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-teal-300 transition-colors">
                              {lang === 'te' ? 'ఇంటర్నేషనల్ SEO & Hreflang' : 'International SEO'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'మల్టీలింగ్వల్ ట్యాగ్స్ & కానానికల్ చెక్' : 'Hreflang & multi-region targeting'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-teal-950/80 border border-teal-500/30 text-teal-300 px-2 py-0.5 rounded-md">
                          Global
                        </span>
                      </button>
                    )}

                    {/* 10. Agency & White-Label */}
                    {onOpenAgency && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenAgency)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-purple-300 transition-colors">
                              {lang === 'te' ? 'ఏజెన్సీ & వైట్-లేబుల్' : 'Agency White-Label Suite'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'క్లయింట్ పోర్టల్స్ & బల్క్ ఆడిట్' : 'Client workspaces & white-label PDFs'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-purple-950/80 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-md">
                          Agency
                        </span>
                      </button>
                    )}

                    {/* 10.5 Website Audit REST API & Marketplace */}
                    {onOpenDeveloperApi && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenDeveloperApi)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group bg-gradient-to-r from-indigo-950/40 to-transparent border border-indigo-500/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'Website Audit API (v1)' : 'Website Audit API (v1)'}</span>
                              <span className="px-1.5 py-0.2 text-[9px] bg-indigo-500/30 text-indigo-200 rounded font-mono">REST</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'API కీలు, డెవలపర్ ప్లేగ్రౌండ్ & కోటా' : 'API Keys, Playground & Quota'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-md">
                          API Keys
                        </span>
                      </button>
                    )}

                    {/* 10.6 API Documentation & SDK Examples Modal */}
                    {onOpenApiDocs && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenApiDocs)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'API డాక్యుమెంటేషన్ & SDKs' : 'API Docs & SDKs'}</span>
                              <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 rounded font-mono">7 Langs</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'గెట్టింగ్ స్టార్టెడ్, cURL, Python & Node' : 'Getting started guide & code snippets'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md">
                          Docs
                        </span>
                      </button>
                    )}

                    {/* 10.7 Dedicated Live API Status & 90-Day SLA Page */}
                    {onOpenStatusPage && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenStatusPage)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group bg-emerald-950/20 border border-emerald-500/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'లైవ్ API సిస్టమ్ స్టేటస్' : 'Live API System Status'}</span>
                              <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/30 text-emerald-200 rounded font-mono font-bold">100% Up</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? '14 ఎండ్‌పాయింట్ల అప్‌టైమ్, లేటెన్సీ & 90d SLA' : 'Real-time uptime, latency & 90-day SLA'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                          Status
                        </span>
                      </button>
                    )}

                    {/* 11. Global Multi-Region Latency & Edge CDN */}
                    {onOpenGlobalLatency && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenGlobalLatency)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-cyan-300 transition-colors">
                              {lang === 'te' ? 'గ్లోబల్ మల్టీ-రీజియన్ లేటెన్సీ' : 'Global Edge Latency'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? '8 గ్లోబల్ POPs & ఎడ్జ్ TTFB టెస్ట్' : '8 worldwide edge nodes & CDN probe'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-md">
                          Global
                        </span>
                      </button>
                    )}

                    {/* 12. 1-Click GitHub Auto-Fix PR */}
                    {onOpenGitHubAutoFix && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenGitHubAutoFix)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <Code2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-indigo-300 transition-colors">
                              {lang === 'te' ? '1-క్లిక్ GitHub ఆటో-ఫిక్స్ PR' : '1-Click GitHub Auto-Fix PR'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'ఆటోమేటిక్ కోడ్ కమిట్స్ & Pull Request' : 'Direct repository commit & PR creation'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md">
                          PR Fix
                        </span>
                      </button>
                    )}

                    {/* 13. Google CrUX Real User Monitoring */}
                    {onOpenCrUXHistory && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenCrUXHistory)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-amber-300 transition-colors">
                              {lang === 'te' ? 'Google CrUX & ట్రెండ్స్' : 'Google CrUX & RUM Trends'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? '28-రోజుల P75 క్రోమ్ ఫీల్డ్ డేటా' : '28-day Chrome User Experience stats'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-amber-950/80 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md">
                          CrUX
                        </span>
                      </button>
                    )}

                    {/* 14. OWASP Top 10 & CVE Scanner */}
                    {onOpenOwaspSecurity && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenOwaspSecurity)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-rose-300 transition-colors">
                              {lang === 'te' ? 'OWASP & CVE సెక్యూరిటీ' : 'OWASP & CVE Scanner'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'ఎక్స్‌పోజ్డ్ ఫైల్స్, XSS & డిపెండెన్సీ CVEs' : 'Deep vulnerability & zero-trust checks'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-rose-950/80 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-md">
                          CVEs
                        </span>
                      </button>
                    )}

                    {/* 15. Multi-Channel Slack & WhatsApp Alerts */}
                    {onOpenMultiChannelAlerts && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenMultiChannelAlerts)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-emerald-300 transition-colors">
                              {lang === 'te' ? 'WhatsApp & Slack అలర్ట్స్' : 'WhatsApp & Slack Alerts'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'డౌన్‌టైమ్ & SSL తక్షణ నోటిఫికేషన్లు' : 'Instant multi-channel incident pings'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md">
                          Alerts
                        </span>
                      </button>
                    )}

                    {/* 16. Team Workspace (Share Reports & Security Collaboration) */}
                    {onOpenTeamWorkspace && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenTeamWorkspace)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/30"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'టీమ్ వర్క్‌స్పేస్' : 'Team Workspace'}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'ఈమెయిల్ ఆహ్వానాలు & సెక్యూరిటీ సహకారం' : 'Email invites, report sharing & fix collaboration'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-2 py-0.5 rounded-md">
                          Team
                        </span>
                      </button>
                    )}

                    {/* 3. Download PDF Report */}
                    {onDownloadReport && (
                      <button
                        type="button"
                        onClick={() => handleAction(onDownloadReport)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer group ${
                          hasActiveReport 
                            ? 'hover:bg-slate-800 text-slate-200 hover:text-white' 
                            : 'opacity-70 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            <FileDown className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                              <span>{lang === 'te' ? 'PDF నివేదిక డౌన్‌లోడ్' : 'Download PDF Report'}</span>
                              {hasActiveReport && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'పూర్తి ఎగ్జిక్యూటివ్ ఆడిట్ నివేదిక' : 'Full executive audit breakdown'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-md">
                          PDF
                        </span>
                      </button>
                    )}

                    {/* 4. Refer & Earn (5 ⚡ Credits) */}
                    <button
                      type="button"
                      onClick={() => handleAction(onOpenReferral)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold group-hover:text-amber-300 transition-colors">
                            {lang === 'te' ? '1 రిఫర్ = 1 వెబ్‌సైట్ ఫుల్ పాస్' : '1 Refer = 1 Website Pass'}
                          </div>
                          <div className="text-[10px] text-amber-300/80 font-medium">
                            {lang === 'te' ? '₹799 విలువైన ప్రో ప్లాన్ ఉచితం' : '₹799 Pro Access Free per Refer'}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md shadow-xs">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>{user.credits ?? 0} Credits</span>
                      </span>
                    </button>

                    {/* 5. 5-Star Reviews & Customer Feedback */}
                    {onOpenRating && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenRating)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-amber-300 transition-colors flex items-center gap-1">
                              <span>{lang === 'te' ? 'కస్టమర్ 5-స్టార్ రివ్యూలు' : 'Customer 5★ Reviews'}</span>
                              <span className="text-[10px] text-amber-400 font-bold">4.98/5</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'నిజమైన యూజర్ల టెస్టిమోనియల్స్ & రేటింగ్స్' : '3,450+ Verified Client Reviews'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                          4.98 ★
                        </span>
                      </button>
                    )}

                    {/* 6. Google AdSense Technical Readiness & SEO Kit */}
                    {onOpenAdSenseKit && (
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenAdSenseKit)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold group-hover:text-amber-300 transition-colors flex items-center gap-1">
                              <span>{lang === 'te' ? 'యాడ్‌సెన్స్ టెక్నికల్ కిట్' : 'AdSense Readiness Kit'}</span>
                              <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded">Readiness</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lang === 'te' ? 'ads.txt, 5 లీగల్ పేజీలు, Schema.org' : 'ads.txt, 5 Legal Pages, Schema.org'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                          AdSense
                        </span>
                      </button>
                    )}

                    {/* 7. My Fix Downloads */}
                    <button
                      type="button"
                      onClick={() => handleAction(onOpenDownloads)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-200 hover:text-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold group-hover:text-teal-300 transition-colors">
                            {lang === 'te' ? 'నా డౌన్‌లోడ్‌లు (My Fix Downloads)' : 'My Fix Downloads'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {lang === 'te' ? 'పరిష్కరించిన ప్యాకేజీలు & PR టిక్కెట్లు' : 'Resolved ZIP packages & PR tickets'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md">
                        {t.downloads}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

