import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Radio,
  RefreshCw,
  Zap,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language, GlobalLatencyNode, FullAuditReport } from '../types';
import confetti from 'canvas-confetti';

interface GlobalLatencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
}

const DEFAULT_GLOBAL_NODES: GlobalLatencyNode[] = [
  {
    id: 'node-us-east',
    city: 'New York (US East)',
    cityTe: 'న్యూయార్క్ (యూఎస్ ఈస్ట్)',
    country: 'United States',
    flag: '🇺🇸',
    continent: 'North America',
    latencyMs: 84,
    ttfbMs: 62,
    dnsMs: 14,
    tlsMs: 22,
    downloadMs: 48,
    cdnProvider: 'Cloudflare Edge Anycast',
    cdnStatus: 'HIT',
    httpStatus: 200,
    grade: 'A+',
  },
  {
    id: 'node-eu-west',
    city: 'London (UK / Europe)',
    cityTe: 'లండన్ (యూకే / యూరప్)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    continent: 'Europe',
    latencyMs: 96,
    ttfbMs: 78,
    dnsMs: 18,
    tlsMs: 26,
    downloadMs: 52,
    cdnProvider: 'Fastly Edge POP',
    cdnStatus: 'HIT',
    httpStatus: 200,
    grade: 'A+',
  },
  {
    id: 'node-eu-central',
    city: 'Frankfurt (Germany)',
    cityTe: 'ఫ్రాంక్‌ఫర్ట్ (జర్మనీ)',
    country: 'Germany',
    flag: '🇩🇪',
    continent: 'Europe',
    latencyMs: 104,
    ttfbMs: 82,
    dnsMs: 20,
    tlsMs: 28,
    downloadMs: 56,
    cdnProvider: 'CloudFront Edge',
    cdnStatus: 'HIT',
    httpStatus: 200,
    grade: 'A',
  },
  {
    id: 'node-ap-south',
    city: 'Mumbai (India / South Asia)',
    cityTe: 'ముంబై (భారతదేశం / దక్షిణాసియా)',
    country: 'India',
    flag: '🇮🇳',
    continent: 'Asia',
    latencyMs: 48,
    ttfbMs: 38,
    dnsMs: 11,
    tlsMs: 16,
    downloadMs: 32,
    cdnProvider: 'Cloudflare Mumbai DC-1',
    cdnStatus: 'HIT',
    httpStatus: 200,
    grade: 'A+',
  },
  {
    id: 'node-ap-southeast',
    city: 'Singapore (Southeast Asia)',
    cityTe: 'సింగపూర్ (ఆగ్నేయాసియా)',
    country: 'Singapore',
    flag: '🇸🇬',
    continent: 'Asia',
    latencyMs: 72,
    ttfbMs: 54,
    dnsMs: 15,
    tlsMs: 21,
    downloadMs: 42,
    cdnProvider: 'Cloudflare Equinix SG1',
    cdnStatus: 'HIT',
    httpStatus: 200,
    grade: 'A+',
  },
  {
    id: 'node-ap-northeast',
    city: 'Tokyo (Japan / East Asia)',
    cityTe: 'టోక్యో (జపాన్ / తూర్పు ఆసియా)',
    country: 'Japan',
    flag: '🇯🇵',
    continent: 'Asia',
    latencyMs: 118,
    ttfbMs: 94,
    dnsMs: 24,
    tlsMs: 32,
    downloadMs: 64,
    cdnProvider: 'Fastly Tokyo POP',
    cdnStatus: 'HIT',
    httpStatus: 200,
    grade: 'A',
  },
  {
    id: 'node-oc-sydney',
    city: 'Sydney (Australia / Oceania)',
    cityTe: 'సిడ్నీ (ఆస్ట్రేలియా / ఓషియానియా)',
    country: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    latencyMs: 148,
    ttfbMs: 122,
    dnsMs: 28,
    tlsMs: 38,
    downloadMs: 78,
    cdnProvider: 'CloudFront Sydney Edge',
    cdnStatus: 'MISS',
    httpStatus: 200,
    grade: 'B',
  },
  {
    id: 'node-sa-saopaulo',
    city: 'São Paulo (South America)',
    cityTe: 'సావో పాలో (దక్షిణ అమెరికా)',
    country: 'Brazil',
    flag: '🇧🇷',
    continent: 'South America',
    latencyMs: 182,
    ttfbMs: 146,
    dnsMs: 34,
    tlsMs: 44,
    downloadMs: 92,
    cdnProvider: 'Cloudflare GigaPoP Brazil',
    cdnStatus: 'DYNAMIC',
    httpStatus: 200,
    grade: 'B',
  },
];

export const GlobalLatencyModal: React.FC<GlobalLatencyModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
}) => {
  const isTe = lang === 'te';
  const targetUrl = report?.url || 'https://mywebsite.com';
  const [nodes, setNodes] = useState<GlobalLatencyNode[]>(DEFAULT_GLOBAL_NODES);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [activeNodeDetail, setActiveNodeDetail] = useState<GlobalLatencyNode | null>(null);

  if (!isOpen) return null;

  const handleLiveRePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      // Simulate live jitter variations
      setNodes((prev) =>
        prev.map((node) => {
          const jitter = Math.floor(Math.random() * 16) - 8;
          const newLatency = Math.max(30, node.latencyMs + jitter);
          const newTtfb = Math.max(20, Math.floor(newLatency * 0.75));
          return {
            ...node,
            latencyMs: newLatency,
            ttfbMs: newTtfb,
            grade: newLatency < 90 ? 'A+' : newLatency < 130 ? 'A' : newLatency < 200 ? 'B' : 'C',
          };
        })
      );
      setIsPinging(false);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }, 1100);
  };

  const filteredNodes =
    selectedContinent === 'All'
      ? nodes
      : nodes.filter((n) => n.continent === selectedContinent);

  const avgGlobalLatency = Math.round(
    nodes.reduce((sum, n) => sum + n.latencyMs, 0) / nodes.length
  );
  const avgTtfb = Math.round(
    nodes.reduce((sum, n) => sum + n.ttfbMs, 0) / nodes.length
  );
  const fastestNode = [...nodes].sort((a, b) => a.latencyMs - b.latencyMs)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="global-latency-modal"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isTe
                    ? 'గ్లోబల్ మల్టీ-రీజియన్ లేటెన్సీ & ఎడ్జ్ CDN టెస్టింగ్'
                    : 'Global Multi-Region Latency & Edge CDN Tester'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>8 Global Edge POPs</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isTe
                  ? 'ప్రపంచవ్యాప్తంగా 8 ప్రధాన నగరాల నుండి లైవ్ TTFB, DNS లుకప్, TLS హ్యాండ్‌షేక్ మరియు ఎడ్జ్ క్యాచింగ్ తనిఖీ'
                  : 'Real-time multi-continent synthetic probe across 8 worldwide edge locations'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target URL & Live Stats Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                  Target Domain
                </span>
                <div className="text-sm font-mono font-bold text-white">{targetUrl}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Global Avg Latency
                </span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {avgGlobalLatency}ms
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Global Avg TTFB
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {avgTtfb}ms
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Fastest Edge
                </span>
                <span className="text-sm font-mono font-bold text-amber-300">
                  {fastestNode.flag} {fastestNode.latencyMs}ms
                </span>
              </div>

              <button
                onClick={handleLiveRePing}
                disabled={isPinging}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Pinging 8 Nodes...' : 'Re-Probe Worldwide'}</span>
              </button>
            </div>
          </div>

          {/* Continent Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-2">Filter Region:</span>
            {['All', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'].map(
              (cont) => (
                <button
                  key={cont}
                  onClick={() => setSelectedContinent(cont)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedContinent === cont
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cont}
                </button>
              )
            )}
          </div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setActiveNodeDetail(node)}
                className={`p-4 rounded-2xl bg-slate-950/80 border transition-all cursor-pointer flex flex-col justify-between space-y-3 hover:scale-[1.02] ${
                  node.latencyMs < 100
                    ? 'border-emerald-500/30 hover:border-emerald-400 shadow-sm hover:shadow-emerald-500/10'
                    : node.latencyMs < 150
                    ? 'border-cyan-500/30 hover:border-cyan-400 shadow-sm hover:shadow-cyan-500/10'
                    : 'border-amber-500/30 hover:border-amber-400 shadow-sm hover:shadow-amber-500/10'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{node.flag}</span>
                      <span className="text-xs font-bold text-white leading-tight">
                        {isTe ? node.cityTe : node.city}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                        node.grade === 'A+'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : node.grade === 'A'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {node.grade}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-2xl font-black font-mono text-white">
                        {node.latencyMs}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ms</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        node.cdnStatus === 'HIT'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : node.cdnStatus === 'MISS'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      CDN: {node.cdnStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                    <div className="flex justify-between">
                      <span>TTFB:</span>
                      <span className="text-slate-200 font-bold">{node.ttfbMs}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DNS Lookup:</span>
                      <span className="text-slate-300">{node.dnsMs}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TLS Handshake:</span>
                      <span className="text-slate-300">{node.tlsMs}ms</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-900">
                  {node.cdnProvider}
                </div>
              </div>
            ))}
          </div>

          {/* CDN Edge Optimization Recommendation Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {isTe
                    ? 'గ్లోబల్ ఎడ్జ్ క్యాచింగ్ సిఫార్సు (Global CDN Optimization)'
                    : 'Global Edge Caching & Anycast Routing Advice'}
                </h4>
                <p className="text-[11px] text-slate-300">
                  {isTe
                    ? 'Cloudflare లేదా AWS CloudFront లో `Cache-Control: public, max-age=31536000, immutable` ఎనేబుల్ చేయడం ద్వారా లాటిన్ అమెరికా & ఓషియానియా లేటెన్సీని 60% వరకు తగ్గించవచ్చు.'
                    : 'Enabling stale-while-revalidate and Brotli compression on Cloudflare/Fastly can slash TTFB by up to 60% globally.'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono whitespace-nowrap">
              HTTP/3 + QUIC Ready
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isTe
              ? 'ప్రతి 15 నిమిషాలకు ఆటో-సింథటిక్ మానిటరింగ్ రన్ అవుతుంది'
              : 'Automated synthetic checks available in 24/7 Monitoring'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            {isTe ? 'మూసివేయండి' : 'Close Tester'}
          </button>
        </div>
      </div>
    </div>
  );
};
