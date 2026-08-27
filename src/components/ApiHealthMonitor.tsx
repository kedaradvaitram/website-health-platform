import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Radio,
  Sliders,
  ChevronRight,
  Bell,
  Sparkles,
  Terminal,
  Cpu,
  Check,
  Lock,
  Flame,
  Layers,
  Info,
} from 'lucide-react';
import { Language, ApiPlanTier, UserAccount } from '../types';

export interface ApiHealthMonitorProps {
  lang: Language;
  user: UserAccount;
  apiKey: string;
  tier: ApiPlanTier;
  creditsRemaining: number;
  creditsTotal: number;
  rateLimitPerMin: number;
  quotaUsagePercent: number;
  onUpgradeTier?: () => void;
  onConfigureAlerts?: () => void;
  onSimulateUsage?: (percent: number) => void;
}

export const ApiHealthMonitor: React.FC<ApiHealthMonitorProps> = ({
  lang,
  user,
  apiKey,
  tier,
  creditsRemaining,
  creditsTotal,
  rateLimitPerMin,
  quotaUsagePercent,
  onUpgradeTier,
  onConfigureAlerts,
  onSimulateUsage,
}) => {
  const isTe = lang === 'te';

  // Live rate limit telemetry state
  const [currentMinuteReqs, setCurrentMinuteReqs] = useState<number>(() => {
    // Default proportional to quota or realistic live requests
    return quotaUsagePercent >= 80 ? Math.round(rateLimitPerMin * 0.82) : Math.round(rateLimitPerMin * 0.25);
  });
  const [secondsUntilReset, setSecondsUntilReset] = useState<number>(42);
  const [isSimulatingBurst, setIsSimulatingBurst] = useState<boolean>(false);
  const [lastBurstResponse, setLastBurstResponse] = useState<string | null>(null);
  const [copiedHeader, setCopiedHeader] = useState<boolean>(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '5m' | '1h' | '24h'>('1m');

  // Rolling 1-minute rate limit utilization percentage
  const rateLimitPercent = Math.min(100, Math.round((currentMinuteReqs / Math.max(1, rateLimitPerMin)) * 100));
  const rateLimitRemaining = Math.max(0, rateLimitPerMin - currentMinuteReqs);

  // Overall Health Status: 'healthy' | 'warning' (>=80%) | 'critical' (>=95%)
  const isApproachingLimit = rateLimitPercent >= 80 || quotaUsagePercent >= 80;
  const isCriticalLimit = rateLimitPercent >= 95 || quotaUsagePercent >= 95;

  const healthStatus: 'healthy' | 'warning' | 'critical' = isCriticalLimit
    ? 'critical'
    : isApproachingLimit
    ? 'warning'
    : 'healthy';

  // Live countdown timer for rolling 60-second window reset
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilReset((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update minute requests when quota percentage changes dynamically via simulations
  useEffect(() => {
    if (quotaUsagePercent >= 80 && currentMinuteReqs < Math.round(rateLimitPerMin * 0.8)) {
      setCurrentMinuteReqs(Math.round(rateLimitPerMin * 0.82));
    }
  }, [quotaUsagePercent, rateLimitPerMin]);

  // Endpoint specific rate-limit utilization breakdown
  const endpointUtilization = [
    {
      endpoint: 'POST /v1/audit',
      name: isTe ? 'పూర్తి వెబ్‌సైట్ ఆడిట్ ఇంజిన్' : 'Full Health & SEO Audit Engine',
      weight: 1,
      currentReqs: Math.round(currentMinuteReqs * 0.45),
      limit: Math.round(rateLimitPerMin * 0.5),
      avgLatencyMs: 38,
      status: currentMinuteReqs >= rateLimitPerMin * 0.8 ? 'warning' : 'optimal',
    },
    {
      endpoint: 'GET /v1/audit/{id}/report',
      name: isTe ? 'వివరణాత్మక ఆడిట్ రిపోర్ట్ పోలర్' : 'Granular Audit Report Stream',
      weight: 0,
      currentReqs: Math.round(currentMinuteReqs * 0.3),
      limit: Math.round(rateLimitPerMin * 0.7),
      avgLatencyMs: 18,
      status: 'optimal',
    },
    {
      endpoint: 'POST /v1/page-audit',
      name: isTe ? 'సింగిల్ పేజీ DOM & టెక్నికల్ SEO' : 'Single Page Deep DOM Inspector',
      weight: 1,
      currentReqs: Math.round(currentMinuteReqs * 0.15),
      limit: Math.round(rateLimitPerMin * 0.4),
      avgLatencyMs: 42,
      status: 'optimal',
    },
    {
      endpoint: 'POST /v1/ai/fix',
      name: isTe ? 'AI ఆటోమేటెడ్ కోడ్ పరిష్కార ఇంజిన్' : 'AI Code Remediation Generator',
      weight: 1,
      currentReqs: Math.round(currentMinuteReqs * 0.1),
      limit: Math.round(rateLimitPerMin * 0.3),
      avgLatencyMs: 48,
      status: 'optimal',
    },
  ];

  // Quick preset rate limit simulations
  const handleSetSimulatedRate = (targetRate: number) => {
    setIsSimulatingBurst(true);
    setCurrentMinuteReqs(targetRate);

    const calculatedPercent = Math.round((targetRate / rateLimitPerMin) * 100);

    setTimeout(() => {
      setIsSimulatingBurst(false);
      setLastBurstResponse(
        targetRate >= rateLimitPerMin * 0.8
          ? `HTTP 200 OK | X-RateLimit-Limit: ${rateLimitPerMin} | X-RateLimit-Remaining: ${Math.max(0, rateLimitPerMin - targetRate)} | X-Credit-Alert: threshold_80_reached (⚠️ ${calculatedPercent}% Used)`
          : `HTTP 200 OK | X-RateLimit-Limit: ${rateLimitPerMin} | X-RateLimit-Remaining: ${rateLimitPerMin - targetRate} | X-RateLimit-Reset: ${secondsUntilReset}s (Optimal)`
      );
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="developer-api-health-monitor">
      {/* 1. TOP REAL-TIME 80% USAGE THRESHOLD WARNING BANNER */}
      {isApproachingLimit && (
        <div
          id="api-health-approaching-limit-banner"
          className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-lg animate-pulse ${
            isCriticalLimit
              ? 'bg-gradient-to-r from-red-950/90 via-red-900/80 to-slate-950 border-red-500/60 shadow-red-950/50 text-red-100'
              : 'bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-slate-950 border-amber-500/60 shadow-amber-950/50 text-amber-100'
          }`}
        >
          <div className="flex items-start space-x-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isCriticalLimit
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm uppercase tracking-wide">
                  {isCriticalLimit
                    ? (isTe ? '🚨 అత్యవసర అలర్ట్: 95%+ రేట్ లిమిట్ పరిమితి చేరుకుంది' : '🚨 Critical Warning: 95%+ Tier Capacity Reached')
                    : (isTe ? '⚠️ రేట్ లిమిట్ & కోటా అలర్ట్: 80% సామర్థ్యం వినియోగించబడింది' : '⚠️ Visual Warning: Approaching 80% Tier Limit')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black border ${
                    isCriticalLimit
                      ? 'bg-red-500/30 text-red-200 border-red-400/50'
                      : 'bg-amber-500/30 text-amber-200 border-amber-400/50'
                  }`}
                >
                  {Math.max(rateLimitPercent, quotaUsagePercent)}% Utilized
                </span>
              </div>

              <p className="text-xs opacity-90 mt-1 leading-relaxed max-w-3xl">
                {isTe
                  ? `మీరు మీ ${tier.toUpperCase()} ప్లాన్ పరిమితిలో ${Math.max(rateLimitPercent, quotaUsagePercent)}% వినియోగించారు (${currentMinuteReqs}/${rateLimitPerMin} req/min & ${(creditsTotal - creditsRemaining).toLocaleString()}/${creditsTotal.toLocaleString()} క్రెడిట్స్). మీ యాప్‌లో 429 / 402 ఎర్రర్లు రాకుండా వెంటనే టాప్-అప్ చేయండి.`
                  : `Your API traffic has reached ${Math.max(rateLimitPercent, quotaUsagePercent)}% of your ${tier.toUpperCase()} tier ceiling (${currentMinuteReqs}/${rateLimitPerMin} req/min rolling rate & ${(creditsTotal - creditsRemaining).toLocaleString()}/${creditsTotal.toLocaleString()} monthly credits). Only ${rateLimitRemaining} req/min headroom remaining.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
            {onConfigureAlerts && (
              <button
                type="button"
                onClick={onConfigureAlerts}
                className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>{isTe ? 'అలర్ట్ నియమాలు' : 'Alert Rules'}</span>
              </button>
            )}

            {onUpgradeTier && (
              <button
                type="button"
                onClick={onUpgradeTier}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  isCriticalLimit
                    ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isTe ? 'అప్‌గ్రేడ్ / టాప్-అప్' : 'Upgrade & Top Up'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. REAL-TIME RATE LIMIT & CAPACITY TELEMETRY HERO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Rate Limit Window Utilization */}
        <div
          className={`p-5 rounded-2xl bg-slate-950/80 border transition-all ${
            rateLimitPercent >= 80
              ? 'border-amber-500/50 bg-amber-950/15 shadow-md shadow-amber-950/30'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Activity className={`w-4 h-4 ${rateLimitPercent >= 80 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
              <span>{isTe ? 'రేట్ లిమిట్ వినియోగం' : 'Rate Limit Utilization'}</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">60s Window</span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${rateLimitPercent >= 80 ? 'text-amber-300' : 'text-white'}`}>
                {currentMinuteReqs}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {rateLimitPerMin} req/min</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                rateLimitPercent >= 80
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {rateLimitPercent}%
            </span>
          </div>

          {/* Progress Bar with Color Shift */}
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                rateLimitPercent >= 90
                  ? 'bg-gradient-to-r from-amber-500 to-red-500 animate-pulse'
                  : rateLimitPercent >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(100, rateLimitPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
            <span>{isTe ? 'మిగిలిన కెపాసిటీ:' : 'Remaining capacity:'}</span>
            <span className={`font-mono font-bold ${rateLimitRemaining <= 5 ? 'text-red-400' : 'text-slate-200'}`}>
              {rateLimitRemaining} req/min
            </span>
          </div>
        </div>

        {/* Metric 2: Rolling 60s Window Reset Countdown */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{isTe ? 'విండో రీసెట్ కౌంట్‌డౌన్' : 'Window Reset Timer'}</span>
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-cyan-300">{secondsUntilReset}</span>
              <span className="text-xs text-slate-400 font-mono">seconds</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">HTTP 429 Shield</span>
          </div>

          {/* Countdown Bar */}
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000"
              style={{ width: `${(secondsUntilReset / 60) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
            <span>{isTe ? 'లీకీ బకెట్ అల్గోరిథం:' : 'Leaky bucket refill:'}</span>
            <span className="font-mono text-cyan-300 font-bold">{(rateLimitPerMin / 60).toFixed(2)} req/sec</span>
          </div>
        </div>

        {/* Metric 3: Monthly Credit Quota Utilization */}
        <div
          className={`p-5 rounded-2xl bg-slate-950/80 border transition-all ${
            quotaUsagePercent >= 80
              ? 'border-amber-500/50 bg-amber-950/15 shadow-md shadow-amber-950/30'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Zap className={`w-4 h-4 ${quotaUsagePercent >= 80 ? 'text-amber-400' : 'text-amber-400'}`} />
              <span>{isTe ? 'నెలవారీ కోటా బ్యాలెన్స్' : 'Monthly Quota Balance'}</span>
            </span>
            <span className="font-mono text-[11px] uppercase text-indigo-400">{tier} Tier</span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${quotaUsagePercent >= 80 ? 'text-amber-300' : 'text-white'}`}>
                {creditsRemaining.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {creditsTotal.toLocaleString()}</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                quotaUsagePercent >= 80
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {quotaUsagePercent}% used
            </span>
          </div>

          {/* Quota Progress */}
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                quotaUsagePercent >= 80
                  ? 'bg-gradient-to-r from-amber-500 to-red-500'
                  : 'bg-gradient-to-r from-indigo-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(100, quotaUsagePercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
            <span>{isTe ? '80% అలర్ట్ ట్రిగ్గర్:' : '80% Alert Trigger:'}</span>
            <span className="font-semibold text-amber-400">
              {quotaUsagePercent >= 80 ? '⚠️ Active Dispatched' : '✅ Armed & Monitored'}
            </span>
          </div>
        </div>

        {/* Metric 4: Live Gateway Health & Latency */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{isTe ? 'గేట్‌వే హెల్త్ & రెస్పాన్స్' : 'Gateway Health & SLA'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              100% Up
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-emerald-400">24</span>
              <span className="text-xs text-slate-400 font-mono">ms avg TTFB</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0 Throttled</span>
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
            <span>{isTe ? 'ఎడ్జ్ క్యాషింగ్:' : 'Edge Ingress POP:'}</span>
            <span className="font-mono text-slate-200 font-semibold">BOM1 / Anycast QUIC</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE REAL-TIME RATE LIMIT BURST SIMULATOR & TEST LAB */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                {isTe ? 'లైవ్ రేట్ లిమిట్ బరస్ట్ & స్పైక్ సిమ్యులేటర్' : 'Live Rate Limit Burst & Spike Simulator'}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Developer Lab
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTe
                ? 'మీ అప్లికేషన్ 80% రేట్ లిమిట్ వద్ద హెడర్లు మరియు హెచ్చరికలను ఎలా హ్యాండిల్ చేస్తుందో తక్షణమే పరీక్షించండి.'
                : 'Simulate high traffic loads to test how your client application handles X-RateLimit headers and 80% usage threshold warnings.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                handleSetSimulatedRate(Math.round(rateLimitPerMin * 0.15));
                if (onSimulateUsage) onSimulateUsage(15);
              }}
              disabled={isSimulatingBurst}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <span>{isTe ? 'సాధారణ లోడ్ (15%)' : 'Normal (15%)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSetSimulatedRate(Math.round(rateLimitPerMin * 0.82));
                if (onSimulateUsage) onSimulateUsage(82);
              }}
              disabled={isSimulatingBurst}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 transition-colors shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{isTe ? '⚠️ 80% స్పైక్ సిమ్యులేట్ చేయండి' : '⚠️ Simulate 80% Spike'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSetSimulatedRate(Math.round(rateLimitPerMin * 0.96));
                if (onSimulateUsage) onSimulateUsage(96);
              }}
              disabled={isSimulatingBurst}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Flame className="w-3 h-3" />
              <span>{isTe ? '🚨 95% క్రిటికల్ లోడ్' : '🚨 95% Critical'}</span>
            </button>
          </div>
        </div>

        {/* Live Response Headers Inspector */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time Gateway HTTP Response Headers</span>
            </span>
            <span className={rateLimitPercent >= 80 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
              {rateLimitPercent >= 80 ? '⚠️ WARNING: Threshold Active' : '● Status: 200 OK'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300 pt-1">
            <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">X-RateLimit-Limit: </span>
              <span className="text-indigo-300 font-bold">{rateLimitPerMin}</span>
              <span className="text-slate-400 text-[11px]"> (requests per 60s)</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">X-RateLimit-Remaining: </span>
              <span className={`font-bold ${rateLimitRemaining <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {rateLimitRemaining}
              </span>
              <span className="text-slate-400 text-[11px]"> (headroom in window)</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">X-RateLimit-Reset: </span>
              <span className="text-cyan-300 font-bold">{secondsUntilReset}</span>
              <span className="text-slate-400 text-[11px]"> (seconds until refill)</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">X-Credit-Usage-Percent: </span>
              <span className={`font-bold ${quotaUsagePercent >= 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {quotaUsagePercent}%
              </span>
              {quotaUsagePercent >= 80 && (
                <span className="text-amber-300 text-[10px] ml-1.5 px-1.5 py-0.2 bg-amber-500/20 rounded border border-amber-500/40">
                  ALERT TRIGGERED
                </span>
              )}
            </div>
          </div>

          {lastBurstResponse && (
            <div className="p-2.5 rounded-lg bg-slate-900 text-[11px] text-slate-300 border border-indigo-500/30 flex items-center justify-between mt-2">
              <span className="truncate">{lastBurstResponse}</span>
              <span className="text-indigo-400 shrink-0 ml-2 font-sans font-semibold text-[10px]">Live Probed</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. PER-ENDPOINT RATE LIMIT & THROUGHPUT BREAKDOWN */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              {isTe ? 'ఎండ్‌పాయింట్ ఆధారిత రేట్ లిమిట్ & లేటెన్సీ బ్రేక్‌డౌన్' : 'Per-Endpoint Rate Limit & Throughput Breakdown'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTe
                ? 'ప్రతి API ఎండ్‌పాయింట్ వద్ద లైవ్ రిక్వెస్ట్ వాల్యూమ్ మరియు సగటు రెస్పాన్స్ సమయం'
                : 'Real-time concurrency, latency, and consumption velocity mapped across individual API endpoints'}
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
            {endpointUtilization.length} Monitored Routes
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {endpointUtilization.map((item, idx) => {
            const epPercent = Math.min(100, Math.round((item.currentReqs / Math.max(1, item.limit)) * 100));
            return (
              <div key={idx} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-black rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-mono">
                      {item.endpoint.split(' ')[0]}
                    </span>
                    <span className="font-mono text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {item.endpoint.split(' ')[1]}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">— {item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>
                      {isTe ? 'క్రెడిట్ కాస్ట్:' : 'Cost:'}{' '}
                      <strong className="text-slate-200">{item.weight} credit/req</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {isTe ? 'సగటు లేటెన్సీ:' : 'Avg Latency:'}{' '}
                      <strong className="text-emerald-400">{item.avgLatencyMs}ms</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-36 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">
                        {item.currentReqs}/{item.limit} req
                      </span>
                      <span className={epPercent >= 80 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {epPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          epPercent >= 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                        }`}
                        style={{ width: `${epPercent}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      epPercent >= 80
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {epPercent >= 80 ? '⚠️ High Load' : '✅ Optimal'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. RATE LIMIT HANDLING BEST PRACTICES & OPTIMIZATION SNIPPETS */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {isTe ? 'రేట్ లిమిట్ నిర్వహణ & బెస్ట్ ప్రాక్టీసెస్' : 'Rate Limit Handling & Exponential Backoff Guide'}
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {isTe
            ? 'మీ అప్లికేషన్‌లో HTTP 429 ఎర్రర్‌లను నివారించడానికి రెస్పాన్స్ హెడర్లలోని "X-RateLimit-Reset" విలువను ఉపయోగించి ఎక్స్‌పోనెన్షియల్ బ్యాక్-ఆఫ్ రిట్రై లాజిక్‌ను అమలు చేయండి.'
            : 'To guarantee 100% reliability in high-concurrency production applications, parse the "X-RateLimit-Remaining" and "X-RateLimit-Reset" headers to implement automatic exponential backoff before sending additional requests.'}
        </p>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre className="text-[11px] leading-relaxed text-indigo-200">
{`// Production Exponential Backoff Handler for Website Health REST API
async function executeApiAudit(targetUrl, apiKey) {
  const response = await fetch('https://websitehealth.ai/api/v1/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: JSON.stringify({ url: targetUrl, pages: 1 })
  });

  // Handle 80% threshold warning or 429 rate limit exceeded
  const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '10');
  const resetSeconds = parseInt(response.headers.get('x-ratelimit-reset') || '1');

  if (response.status === 429) {
    console.warn(\`⚠️ Rate limit exceeded. Backing off for \${resetSeconds}s...\`);
    await new Promise(r => setTimeout(r, resetSeconds * 1000));
    return executeApiAudit(targetUrl, apiKey); // Auto-retry
  }

  if (remaining < 5) {
    console.info(\`⚠️ Approaching rate limit ceiling (\${remaining} remaining). Pacing requests.\`);
  }

  return response.json();
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
