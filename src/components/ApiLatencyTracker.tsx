import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Zap,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Server,
  Clock,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

import { Language } from '../types';

export interface EndpointMetric {
  id: string;
  method: 'GET' | 'POST' | 'OPTIONS' | 'PUT';
  path: string;
  name: string;
  nameTe?: string;
  category: 'core' | 'auth' | 'data' | 'edge' | 'static';
  protocol: 'HTTP/2' | 'HTTP/3 (QUIC)' | 'HTTP/1.1';
  status: number;
  statusText: string;
  currentLatency: number; // ms
  baselineLatency: number;
  history: number[]; // array of last 10 latency numbers
  payloadSize: string;
  breakdown: {
    dns: number;
    tcp: number;
    tls: number;
    ttfb: number;
    download: number;
  };
  lastChecked: string;
  state: 'optimal' | 'good' | 'warning';
}

export interface ApiLatencyTrackerProps {
  hostname: string;
  isScanning?: boolean;
  activeProgress?: number;
  lang?: Language;
}

const REGIONS = [
  { id: 'anycast', name: 'Global Anycast Edge', flag: '🌐', latencyMultiplier: 1.0, pop: 'IAD / Global Anycast' },
  { id: 'us-east', name: 'US East (N. Virginia)', flag: '🇺🇸', latencyMultiplier: 1.1, pop: 'IAD - AWS us-east-1' },
  { id: 'eu-central', name: 'EU Central (Frankfurt)', flag: '🇩🇪', latencyMultiplier: 1.35, pop: 'FRA - Cloudflare PoP' },
  { id: 'ap-south', name: 'Asia (Mumbai / India)', flag: '🇮🇳', latencyMultiplier: 1.25, pop: 'BOM - Edge Gateway' },
  { id: 'ap-east', name: 'Asia East (Tokyo)', flag: '🇯🇵', latencyMultiplier: 1.4, pop: 'NRT - EdgeCDN' },
];

const INITIAL_ENDPOINTS: EndpointMetric[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/health',
    name: 'Server Liveness Probe',
    nameTe: 'సర్వర్ లైవ్‌నెస్ ప్రోబ్',
    category: 'core',
    protocol: 'HTTP/3 (QUIC)',
    status: 200,
    statusText: 'OK',
    currentLatency: 22,
    baselineLatency: 20,
    history: [24, 22, 21, 25, 23, 20, 22, 21, 24, 22],
    payloadSize: '0.4 KB',
    breakdown: { dns: 2, tcp: 3, tls: 4, ttfb: 11, download: 2 },
    lastChecked: 'Just now',
    state: 'optimal'
  },
  {
    id: 'auth-session',
    method: 'POST',
    path: '/api/auth/session',
    name: 'JWT & Session Token Verification',
    nameTe: 'JWT మరియు సెషన్ ప్రామాణీకరణ',
    category: 'auth',
    protocol: 'HTTP/2',
    status: 200,
    statusText: 'OK',
    currentLatency: 38,
    baselineLatency: 35,
    history: [42, 39, 36, 40, 38, 35, 37, 41, 38, 38],
    payloadSize: '1.2 KB',
    breakdown: { dns: 3, tcp: 4, tls: 6, ttfb: 22, download: 3 },
    lastChecked: 'Just now',
    state: 'optimal'
  },
  {
    id: 'graphql-data',
    method: 'POST',
    path: '/graphql',
    name: 'Core GraphQL Data Gateway',
    nameTe: 'కోర్ GraphQL డేటా గేట్‌వే',
    category: 'data',
    protocol: 'HTTP/2',
    status: 200,
    statusText: 'OK',
    currentLatency: 54,
    baselineLatency: 50,
    history: [58, 52, 60, 55, 49, 54, 56, 51, 53, 54],
    payloadSize: '8.4 KB',
    breakdown: { dns: 4, tcp: 5, tls: 7, ttfb: 32, download: 6 },
    lastChecked: 'Just now',
    state: 'good'
  },
  {
    id: 'edge-trace',
    method: 'GET',
    path: '/cdn-cgi/trace',
    name: 'Edge PoP Routing & SSL Trace',
    nameTe: 'ఎడ్జ్ రూటింగ్ మరియు SSL ట్రేస్',
    category: 'edge',
    protocol: 'HTTP/3 (QUIC)',
    status: 200,
    statusText: 'OK',
    currentLatency: 16,
    baselineLatency: 15,
    history: [18, 15, 17, 16, 15, 14, 16, 17, 15, 16],
    payloadSize: '0.2 KB',
    breakdown: { dns: 1, tcp: 2, tls: 3, ttfb: 9, download: 1 },
    lastChecked: 'Just now',
    state: 'optimal'
  },
  {
    id: 'user-profile',
    method: 'GET',
    path: '/api/v1/user/profile',
    name: 'User Data & Preferences Cache',
    nameTe: 'వినియోగదారు డేటా మరియు ప్రాధాన్యతలు',
    category: 'core',
    protocol: 'HTTP/2',
    status: 200,
    statusText: 'OK',
    currentLatency: 31,
    baselineLatency: 30,
    history: [34, 30, 33, 29, 32, 31, 35, 30, 28, 31],
    payloadSize: '3.6 KB',
    breakdown: { dns: 2, tcp: 4, tls: 5, ttfb: 17, download: 3 },
    lastChecked: 'Just now',
    state: 'optimal'
  },
  {
    id: 'static-chunk',
    method: 'GET',
    path: '/_next/static/chunks/app.js',
    name: 'Compressed Static Asset (Brotli)',
    nameTe: 'కంప్రెస్డ్ స్టాటిక్ అసెట్ (Brotli)',
    category: 'static',
    protocol: 'HTTP/3 (QUIC)',
    status: 200,
    statusText: '200 (Cache HIT)',
    currentLatency: 19,
    baselineLatency: 18,
    history: [20, 19, 18, 22, 19, 17, 18, 21, 19, 19],
    payloadSize: '24.8 KB',
    breakdown: { dns: 1, tcp: 2, tls: 3, ttfb: 8, download: 5 },
    lastChecked: 'Just now',
    state: 'optimal'
  },
  {
    id: 'cors-preflight',
    method: 'OPTIONS',
    path: '/api/v1/cors-preflight',
    name: 'CORS Security Preflight Cache',
    nameTe: 'CORS సెక్యూరిటీ ప్రీఫ్లైట్ కాష్',
    category: 'edge',
    protocol: 'HTTP/2',
    status: 204,
    statusText: 'No Content',
    currentLatency: 14,
    baselineLatency: 12,
    history: [15, 13, 14, 12, 16, 14, 13, 15, 12, 14],
    payloadSize: '0.1 KB',
    breakdown: { dns: 1, tcp: 2, tls: 3, ttfb: 7, download: 1 },
    lastChecked: 'Just now',
    state: 'optimal'
  }
];

export const ApiLatencyTracker: React.FC<ApiLatencyTrackerProps> = ({
  hostname,
  isScanning = true,
  activeProgress = 100,
  lang = 'en'
}) => {
  const [endpoints, setEndpoints] = useState<EndpointMetric[]>(INITIAL_ENDPOINTS);
  const [selectedRegion, setSelectedRegion] = useState<string>('anycast');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointMetric | null>(null);
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [totalRequestsCount, setTotalRequestsCount] = useState<number>(0);

  const activeRegionObj = useMemo(() => {
    return REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];
  }, [selectedRegion]);

  // Real-time live jitter simulation interval to mimic live server telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setEndpoints((prev) =>
        prev.map((ep) => {
          // slight random latency fluctuation around baseline multiplied by regional factor
          const regionalBase = ep.baselineLatency * activeRegionObj.latencyMultiplier;
          const jitter = (Math.random() - 0.48) * 6;
          const newLatency = Math.max(8, Math.round(regionalBase + jitter));
          const updatedHistory = [...ep.history.slice(1), newLatency];

          let state: 'optimal' | 'good' | 'warning' = 'optimal';
          if (newLatency > 80) state = 'warning';
          else if (newLatency > 45) state = 'good';

          // scale breakdown proportionally
          const scale = newLatency / (ep.breakdown.dns + ep.breakdown.tcp + ep.breakdown.tls + ep.breakdown.ttfb + ep.breakdown.download);
          const breakdown = {
            dns: Math.max(1, Math.round(ep.breakdown.dns * scale)),
            tcp: Math.max(1, Math.round(ep.breakdown.tcp * scale)),
            tls: Math.max(2, Math.round(ep.breakdown.tls * scale)),
            ttfb: Math.max(4, Math.round(ep.breakdown.ttfb * scale)),
            download: Math.max(1, Math.round(ep.breakdown.download * scale)),
          };

          return {
            ...ep,
            currentLatency: newLatency,
            history: updatedHistory,
            state,
            breakdown,
            lastChecked: 'Live'
          };
        })
      );

      setTotalRequestsCount((prev) => prev + Math.floor(Math.random() * 5 + 2));
    }, 1500);

    return () => clearInterval(interval);
  }, [activeRegionObj]);

  // Manual Trigger to re-probe all endpoints
  const handleProbeAll = () => {
    setIsProbing(true);
    setTimeout(() => {
      setEndpoints((prev) =>
        prev.map((ep) => {
          const regionalBase = ep.baselineLatency * activeRegionObj.latencyMultiplier;
          const ping = Math.max(7, Math.round(regionalBase + (Math.random() - 0.5) * 4));
          return {
            ...ep,
            currentLatency: ping,
            history: [...ep.history.slice(1), ping],
            lastChecked: 'Just now'
          };
        })
      );
      setIsProbing(false);
    }, 600);
  };

  // Filtered Endpoints
  const filteredEndpoints = useMemo(() => {
    if (selectedCategory === 'all') return endpoints;
    return endpoints.filter((ep) => ep.category === selectedCategory);
  }, [endpoints, selectedCategory]);

  // Calculations for Aggregate Summary
  const avgLatency = useMemo(() => {
    const sum = endpoints.reduce((acc, curr) => acc + curr.currentLatency, 0);
    return Math.round(sum / endpoints.length);
  }, [endpoints]);

  const p95Latency = useMemo(() => {
    const sorted = [...endpoints].map((e) => e.currentLatency).sort((a, b) => a - b);
    const index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
    return sorted[index];
  }, [endpoints]);

  const p99Latency = useMemo(() => {
    const sorted = [...endpoints].map((e) => e.currentLatency).sort((a, b) => a - b);
    return sorted[sorted.length - 1];
  }, [endpoints]);

  // Mini SVG Sparkline Component
  const renderSparkline = (data: number[]) => {
    const min = Math.min(...data, 5);
    const max = Math.max(...data, 70);
    const range = max - min || 1;
    const width = 64;
    const height = 18;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="#34d399"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {data.length > 0 && (
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
            r="2"
            className="fill-emerald-400 animate-ping"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans text-xs">
      {/* 1. Header Toolbar */}
      <div className="bg-slate-900 px-3.5 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-[12px] flex items-center gap-1.5">
              <span>{lang === 'te' ? 'రియల్-టైమ్ API లేటెన్సీ డాష్‌బోర్డ్' : 'Real-Time API Latency Monitor'}</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                <Radio className="w-2.5 h-2.5 mr-0.5 animate-pulse text-emerald-400" />
                LIVE
              </span>
            </h4>
          </div>
        </div>

        {/* Action Controls: Region Selector + Probe Trigger */}
        <div className="flex items-center space-x-2">
          {/* Region Dropdown */}
          <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px]">
            <Globe className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.flag} {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleProbeAll}
            disabled={isProbing}
            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer flex items-center space-x-1"
            title="Probe All Endpoints Now"
          >
            <RefreshCw className={`w-3 h-3 ${isProbing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline text-[10px] font-bold">Ping</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Telemetry Summary Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-925 border-b border-slate-800">
        {/* Avg Latency */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>{lang === 'te' ? 'సగటు వేగం' : 'Avg Latency'}</span>
            <Zap className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-base font-black text-white font-mono">{avgLatency}</span>
            <span className="text-[10px] text-emerald-400 font-bold">ms</span>
          </div>
          <span className="text-[9px] text-emerald-400/90 font-medium">Sub-50ms Optimal</span>
        </div>

        {/* p95 Response Time */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>p95 Latency</span>
            <TrendingUp className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-base font-black text-cyan-300 font-mono">{p95Latency}</span>
            <span className="text-[10px] text-cyan-400 font-bold">ms</span>
          </div>
          <span className="text-[9px] text-slate-400">95% under SLA</span>
        </div>

        {/* p99 Tail Latency */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>p99 Tail</span>
            <Clock className="w-3 h-3 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-base font-black text-amber-300 font-mono">{p99Latency}</span>
            <span className="text-[10px] text-amber-400 font-bold">ms</span>
          </div>
          <span className="text-[9px] text-slate-400">Tail response bound</span>
        </div>

        {/* Health / Uptime */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>Edge Status</span>
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-base font-black text-emerald-400 font-mono">100%</span>
            <span className="text-[10px] text-slate-400">7/7</span>
          </div>
          <span className="text-[9px] text-emerald-300 truncate">{activeRegionObj.pop}</span>
        </div>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="px-3 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-[10px]">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Endpoints ({endpoints.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('core')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            selectedCategory === 'core'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Core APIs
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('auth')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            selectedCategory === 'auth'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Auth & Token
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('data')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            selectedCategory === 'data'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          GraphQL
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('edge')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            selectedCategory === 'edge'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Edge PoP & CORS
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('static')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            selectedCategory === 'static'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Static Assets
        </button>
      </div>

      {/* 4. Endpoints List & Latency Waterfall Table */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[300px] lg:max-h-[340px] scrollbar-thin">
        {filteredEndpoints.map((ep) => {
          const isSelected = selectedEndpoint?.id === ep.id;

          // Total time for percentage bar in breakdown
          const totalTime = ep.breakdown.dns + ep.breakdown.tcp + ep.breakdown.tls + ep.breakdown.ttfb + ep.breakdown.download;

          return (
            <div
              key={ep.id}
              onClick={() => setSelectedEndpoint(isSelected ? null : ep)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              {/* Row Header: Method, Path, Status, Latency & Sparkline */}
              <div className="flex items-center justify-between gap-2">
                {/* Left: Method + Path */}
                <div className="flex items-center space-x-2 truncate min-w-0">
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono font-bold text-[9px] ${
                      ep.method === 'GET'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : ep.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-slate-100 font-semibold truncate text-[11px]">
                    {ep.path}
                  </span>
                </div>

                {/* Right: Latency Badge, Sparkline & Status */}
                <div className="flex items-center space-x-2.5 shrink-0">
                  <div className="hidden sm:block">
                    {renderSparkline(ep.history)}
                  </div>

                  {/* Current Latency Pill */}
                  <div className="flex items-center space-x-1 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        ep.state === 'optimal'
                          ? 'bg-emerald-400'
                          : ep.state === 'good'
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span className="font-mono font-bold text-white text-[11px]">{ep.currentLatency}ms</span>
                  </div>

                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                      ep.status === 200 || ep.status === 204
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {ep.status}
                  </span>
                </div>
              </div>

              {/* Description & Protocol */}
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate">
                  {lang === 'te' && ep.nameTe ? ep.nameTe : ep.name} • {ep.payloadSize}
                </span>
                <span className="font-mono text-[9px] text-slate-400 shrink-0 pl-1">{ep.protocol}</span>
              </div>

              {/* Expanded Waterfall Breakdown View */}
              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span>TTFB & Network Waterfall Breakdown</span>
                    <span className="font-mono text-emerald-400">{ep.currentLatency}ms Total</span>
                  </div>

                  {/* Multi-segmented timing bar */}
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 shadow-inner">
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${(ep.breakdown.dns / totalTime) * 100}%` }}
                      title={`DNS: ${ep.breakdown.dns}ms`}
                    />
                    <div
                      className="bg-sky-500 h-full"
                      style={{ width: `${(ep.breakdown.tcp / totalTime) * 100}%` }}
                      title={`TCP: ${ep.breakdown.tcp}ms`}
                    />
                    <div
                      className="bg-purple-500 h-full"
                      style={{ width: `${(ep.breakdown.tls / totalTime) * 100}%` }}
                      title={`TLS Handshake: ${ep.breakdown.tls}ms`}
                    />
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(ep.breakdown.ttfb / totalTime) * 100}%` }}
                      title={`TTFB (Server Processing): ${ep.breakdown.ttfb}ms`}
                    />
                    <div
                      className="bg-teal-400 h-full"
                      style={{ width: `${(ep.breakdown.download / totalTime) * 100}%` }}
                      title={`Download: ${ep.breakdown.download}ms`}
                    />
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> DNS: {ep.breakdown.dns}ms
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> TCP: {ep.breakdown.tcp}ms
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> TLS: {ep.breakdown.tls}ms
                    </span>
                    <span className="flex items-center gap-1 truncate font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> TTFB: {ep.breakdown.ttfb}ms
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> DL: {ep.breakdown.download}ms
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Bottom Live Telemetry Status */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Server className="w-3 h-3 text-emerald-400" />
          <span>PoP: {activeRegionObj.pop}</span>
        </span>
        <span>{totalRequestsCount.toLocaleString()} Probes Dispatched</span>
      </div>
    </div>
  );
};
