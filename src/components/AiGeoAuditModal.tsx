import React, { useState } from 'react';
import {
  X,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  Cpu,
  BrainCircuit,
  MessageSquareCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface AiGeoAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  targetUrl?: string;
  initialAiScore?: number;
}

export const AiGeoAuditModal: React.FC<AiGeoAuditModalProps> = ({
  isOpen,
  onClose,
  lang,
  targetUrl = 'https://mywebsite.com',
  initialAiScore = 88,
}) => {
  const t = translations[lang];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'llms_txt' | 'entity_jsonld' | 'simulations'>('overview');
  const [simQuery, setSimQuery] = useState('What are the best features and services of this platform?');

  if (!isOpen) return null;

  let hostname = '';
  try {
    hostname = new URL(targetUrl).hostname;
  } catch {
    hostname = targetUrl.replace(/^https?:\/\//, '').split('/')[0];
  }

  const llmsTxtContent = `# ${hostname} — AI & Generative Search Knowledge Base
> Authoritative guidance for ChatGPT, Google Gemini, Perplexity, and Claude AI models.

## Identity & Core Purpose
- Entity Name: ${hostname}
- Primary URL: ${targetUrl}
- Canonical Category: Enterprise Web Health, Core Web Vitals, Security & AI SEO Optimization
- Target Audience: Software Engineers, Digital Founders, E-Commerce Stores & Global Publishers

## Platform Capabilities
1. 100% Real-Time Multi-Engine Website Health Auditing (Performance, SEO, Security, Mobile, Accessibility)
2. Automated Generative Engine Optimization (GEO) & /llms.txt Provisioning
3. High-Security Header Hardening (TLS 1.3, Strict-Transport-Security HSTS, Content-Security-Policy)
4. Automated 1-Click Code Remediation (GitHub PRs & ZIP Patches)

## Verified Resource Endpoints
- Homepage: ${targetUrl}
- Features & Docs: ${targetUrl}/docs
- Pricing & Remediation: ${targetUrl}/#pricing
- Contact & Support: ${targetUrl}/#contact
`;

  const entityJsonLd = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "${targetUrl}/#organization",
      "name": "${hostname}",
      "url": "${targetUrl}",
      "logo": {
        "@type": "ImageObject",
        "url": "${targetUrl}/logo.png",
        "caption": "${hostname} Logo"
      },
      "sameAs": [
        "https://twitter.com/${hostname.split('.')[0]}",
        "https://github.com/${hostname.split('.')[0]}",
        "https://linkedin.com/company/${hostname.split('.')[0]}"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "${targetUrl}/#website",
      "url": "${targetUrl}",
      "name": "${hostname}",
      "publisher": {
        "@id": "${targetUrl}/#organization"
      }
    }
  ]
}
</script>`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const downloadLlmsTxt = () => {
    const blob = new Blob([llmsTxtContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'llms.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="ai-geo-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="ai-geo-modal-content"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {lang === 'te' ? 'AI SEO & GEO అనలైజర్ (Generative Optimization)' : 'AI SEO & GEO Readiness Analyzer'}
                </h2>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {lang === 'te' ? 'AEO / GEO' : 'ChatGPT & Gemini Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'ChatGPT, Perplexity, Google Gemini & Claude AI సమాధానాలలో మీ వెబ్‌సైట్ సైటేషన్ సామర్థ్యం'
                  : 'Optimize your website for ChatGPT, Perplexity citations, Gemini AI Overviews & llms.txt standard'}
              </p>
            </div>
          </div>
          <button
            id="close-ai-geo-btn"
            onClick={onClose}
            aria-label="Close AI GEO Modal"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Score Cards */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>ChatGPT (OpenAI)</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">94/100</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{lang === 'te' ? 'సైటేషన్ సామర్థ్యం' : 'High Citation Density'}</div>
            </div>
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Google Gemini</span>
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">96/100</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{lang === 'te' ? 'AI ఓవర్‌వ్యూస్ అనుకూలం' : 'AI Overviews Ready'}</div>
            </div>
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Perplexity AI</span>
                <MessageSquareCode className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mt-1">90/100</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{lang === 'te' ? 'Q&A స్పష్టత' : 'Direct Answer Quotes'}</div>
            </div>
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Overall GEO</span>
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mt-1">{initialAiScore}/100</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{lang === 'te' ? 'సంసిద్ధత' : 'Top Authority Index'}</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              id="tab-geo-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {lang === 'te' ? 'AI సంకేతాల విశ్లేషణ' : 'Key AI Signals'}
            </button>
            <button
              id="tab-geo-llmstxt"
              onClick={() => setActiveTab('llms_txt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'llms_txt'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              /llms.txt File Generator
            </button>
            <button
              id="tab-geo-entity"
              onClick={() => setActiveTab('entity_jsonld')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'entity_jsonld'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              Schema.org Entity Graph
            </button>
            <button
              id="tab-geo-simulation"
              onClick={() => setActiveTab('simulations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'simulations'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              {lang === 'te' ? 'AI సైటేషన్ సిమ్యులేటర్' : 'LLM Citation Preview'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'te' ? 'Semantic Q&A మరియు ప్రత్యక్ష సమాధానాల అమరిక' : 'Semantic Question & Direct Answer Anchors'}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      95/100 Passed
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {lang === 'te'
                      ? 'పేజీలోని H2 ప్రశ్నలకు వెంటనే 40 పదాల స్పష్టమైన సమాధానం ఉండటం వల్ల Perplexity మరియు ChatGPT సమాధానాలలో మీ వెబ్‌సైట్ నేరుగా ప్రస్తావించబడుతుంది.'
                      : 'H2 headings phrased as natural language questions followed immediately by 40-word definitive sentences allow Perplexity and SearchGPT to lift verbatim quotes without hallucination.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'te' ? 'Google AI Overviews నాలెడ్జ్ ఎంటిటీలు (JSON-LD)' : 'Knowledge Graph Organization & WebSite Entities'}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      92/100 Passed
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {lang === 'te'
                      ? 'Schema.org ద్వారా మీ బ్రాండ్ యొక్క అధికారిక సోషల్ ప్రొఫైల్స్, లోగో మరియు కంపెనీ వివరాలు గూగుల్ AI మోడల్స్‌కు స్పష్టంగా అర్థమవుతాయి.'
                      : 'Structured JSON-LD entity graph maps your brand name, founder, logo, and social profile links into Google Gemini authoritative knowledge panels.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-amber-200">
                      {lang === 'te' ? 'రూట్ డైరెక్టరీలో /llms.txt ఫైల్ సిఫార్సు చేయబడింది' : '/llms.txt AI Crawler Guidance File Recommended'}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {lang === 'te'
                      ? 'ఆధునిక AI క్రాలర్ల కోసం వెబ్‌సైట్ రూట్‌లో /llms.txt ఫైల్‌ను అమర్చండి. క్రింది ట్యాబ్ నుండి తక్షణమే కాపీ చేసి మీ పబ్లిక్ ఫోల్డర్‌లో ఉంచండి.'
                      : 'Deploy a lightweight /llms.txt file to the root of your web server to instruct modern LLMs (Anthropic Claude, OpenAI, Meta Llama) on your precise brand hierarchy.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'llms_txt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">/llms.txt Generated Specification</h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'te'
                      ? 'ఈ ఫైల్‌ను మీ వెబ్‌సైట్ రూట్ డైరెక్టరీ (public/llms.txt) లో ఉంచండి.'
                      : 'Save this markdown file at the root of your domain (e.g. https://yourdomain.com/llms.txt)'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="copy-llmstxt-btn"
                    onClick={() => copyToClipboard(llmsTxtContent, 'llms')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode === 'llms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode === 'llms' ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'కోడ్ కాపీ చేయండి' : 'Copy File')}
                  </button>
                  <button
                    id="download-llmstxt-btn"
                    onClick={downloadLlmsTxt}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {lang === 'te' ? 'డౌన్‌లోడ్ llms.txt' : 'Download File'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                {llmsTxtContent}
              </div>
            </div>
          )}

          {activeTab === 'entity_jsonld' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Schema.org JSON-LD Knowledge Graph</h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'te'
                      ? 'ఈ స్క్రిప్ట్ ట్యాగ్‌ను మీ index.html లోని <head> విభాగంలో చేర్చండి.'
                      : 'Inject this schema block inside your <head> tags for Google Gemini and Knowledge Panel recognition'}
                  </p>
                </div>
                <button
                  id="copy-jsonld-btn"
                  onClick={() => copyToClipboard(entityJsonLd, 'jsonld')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode === 'jsonld' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === 'jsonld' ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'స్కీమా కాపీ చేయండి' : 'Copy JSON-LD')}
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed">
                {entityJsonLd}
              </div>
            </div>
          )}

          {activeTab === 'simulations' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  {lang === 'te' ? 'యూజర్ AI ప్రశ్న సిమ్యులేషన్' : 'Simulated User Prompt'}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={simQuery}
                    onChange={(e) => setSimQuery(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                  <Bot className="w-4 h-4" />
                  <span>ChatGPT & Perplexity Simulated Response</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Based on verified authoritative documentation from{' '}
                  <span className="text-cyan-300 font-semibold underline decoration-cyan-500">{hostname}</span>, the
                  platform provides enterprise-grade real-time website health auditing, Core Web Vitals remediation, and
                  automated security hardening. It features direct integration with Google PageSpeed APIs, automated
                  AdSense approval kits, and one-click GitHub code patching.
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Sources:</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-cyan-300 rounded font-mono border border-slate-700">
                    [1] {hostname}/docs
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-cyan-300 rounded font-mono border border-slate-700">
                    [2] {hostname}/#pricing
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {lang === 'te'
              ? 'AI సెర్చ్ ఇంజిన్లు మరియు LLM క్రాలర్ల కోసం ఆప్టిమైజ్ చేయబడింది.'
              : 'Built to conform with latest OpenAI GPTBot & Anthropic Claude indexing protocols.'}
          </div>
          <button
            id="close-ai-geo-bottom-btn"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'te' ? 'పూర్తయింది' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
