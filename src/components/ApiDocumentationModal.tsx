import React, { useState } from 'react';
import {
  X,
  Code2,
  Terminal,
  BookOpen,
  Key,
  Copy,
  Check,
  Zap,
  Play,
  Download,
  Search,
  ExternalLink,
  Shield,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Server,
  FileCode,
  Globe,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Cpu,
  ChevronRight,
  Database,
  Lock,
} from 'lucide-react';
import { Language, UserAccount, ApiDocumentationEndpoint } from '../types';
import { API_ENDPOINTS, generateCodeSnippet, generateOpenApiSpec } from '../data/apiMarketplaceData';

interface ApiDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  onOpenPlayground?: () => void;
}

type DocTab = 'getting_started' | 'endpoints' | 'sdks' | 'auth_security' | 'errors';

export const ApiDocumentationModal: React.FC<ApiDocumentationModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  onOpenPlayground,
}) => {
  const [activeTab, setActiveTab] = useState<DocTab>('getting_started');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('post_audit');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'node' | 'python' | 'php' | 'go' | 'java' | 'ruby'>('curl');
  
  // Custom API key for snippet interpolation
  const [customApiKey, setCustomApiKey] = useState<string>(user.apiKey || 'wh_live_9f82c47e1104a9912bc784');
  
  // Copy state trackers
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedOpenApi, setCopiedOpenApi] = useState<boolean>(false);
  const [copiedPostman, setCopiedPostman] = useState<boolean>(false);

  // Interactive Quick Start test URL
  const [quickStartUrl, setQuickStartUrl] = useState<string>('https://mywebsite.com');

  if (!isOpen) return null;

  const currentEndpoint = API_ENDPOINTS.find((e) => e.id === selectedEndpointId) || API_ENDPOINTS[0];

  const filteredEndpoints = API_ENDPOINTS.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSnippet = generateCodeSnippet(selectedLanguage, currentEndpoint, customApiKey);

  const handleCopy = (text: string, setFn: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const handleDownloadOpenApi = () => {
    const spec = generateOpenApiSpec();
    const blob = new Blob([spec], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-health-openapi-v1.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPostman = () => {
    const postmanCollection = {
      info: {
        name: 'Website Health REST API v1',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: API_ENDPOINTS.map((ep) => ({
        name: ep.title,
        request: {
          method: ep.method,
          header: [
            { key: 'Authorization', value: `Bearer ${customApiKey}` },
            { key: 'Content-Type', value: 'application/json' },
          ],
          url: {
            raw: `https://websitehealth.ai/api${ep.path}`,
            host: ['https://websitehealth.ai'],
            path: ['api', ...ep.path.split('/').filter(Boolean)],
          },
          body:
            ep.method === 'POST'
              ? {
                  mode: 'raw',
                  raw: JSON.stringify(ep.requestBodySample || { url: 'https://example.com' }, null, 2),
                }
              : undefined,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(postmanCollection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-health-postman-collection.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        id="api-documentation-modal"
        className="relative w-full max-w-6xl my-auto bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* TOP HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {lang === 'te' ? 'API డాక్యుమెంటేషన్ & SDK ఉదాహరణలు' : 'API Documentation & SDK Reference'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                  v1.4 REST
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
                  OpenAPI 3.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'మీ స్వంత కోడ్ లేదా SaaS ప్లాట్‌ఫారమ్‌లో Website Health ఇంజిన్‌ను ప్రోగ్రామాటిక్‌గా ఇంటిగ్రేట్ చేయడానికి పూర్తి గైడ్'
                  : 'Everything you need to integrate automated audits, security scans, and AI fixes into your own apps.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenPlayground && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPlayground();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white text-xs font-semibold rounded-lg border border-indigo-500/40 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-300" />
                <span>{lang === 'te' ? 'లైవ్ ప్లేగ్రౌండ్' : 'Live Sandbox'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRIMARY NAVIGATION TABS */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('getting_started')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'getting_started'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'te' ? 'గెట్టింగ్ స్టార్టెడ్ (త్వరిత గైడ్)' : 'Getting Started Guide'}</span>
          </button>

          <button
            onClick={() => setActiveTab('endpoints')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'endpoints'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'te' ? 'ఎండ్‌పాయింట్స్ రెఫరెన్స్' : 'Endpoints Reference'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {API_ENDPOINTS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sdks')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'sdks'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'te' ? 'SDKs & కోడ్ స్నిప్పెట్లు' : 'SDKs & Code Snippets'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
              7 Languages
            </span>
          </button>

          <button
            onClick={() => setActiveTab('auth_security')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'auth_security'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'te' ? 'ఆథెంటికేషన్ & సెక్యూరిటీ' : 'Auth & Security'}</span>
          </button>

          <button
            onClick={() => setActiveTab('errors')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'errors'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'te' ? 'ఎర్రర్ కోడ్‌లు & రేట్ లిమిట్స్' : 'Errors & Rate Limits'}</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: GETTING STARTED GUIDE */}
          {activeTab === 'getting_started' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Quick Start in 3 Minutes
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'te' ? 'మీ అప్లికేషన్‌లో ఆడిట్ ఇంజిన్‌ను ప్రారంభించండి' : 'Integrate Automated Website Audits into your Stack'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'te'
                      ? 'మా REST API ద్వారా ఏదైనా వెబ్‌సైట్‌ను ప్రోగ్రామాటిక్‌గా స్కాన్ చేయండి, SEO, OWASP సెక్యూరిటీ హెడర్‌లు, కోర్ వెబ్ వైటల్స్ మరియు AI కోడ్ ఫిక్స్‌లను తక్షణమే పొందండి.'
                      : 'Send a single POST request with a target URL to receive instantaneous multi-category scores, Core Web Vitals, and copy-paste remediation patches.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadPostman}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>Postman Collection</span>
                  </button>

                  <button
                    onClick={handleDownloadOpenApi}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>OpenAPI JSON</span>
                  </button>
                </div>
              </div>

              {/* 4-Step Visual Onboarding Workflow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-500/40">
                      1
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Authentication</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {lang === 'te' ? '1. API కీని ఆథెంటికేట్ చేయండి' : '1. Authenticate with Bearer Token'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'అన్ని రిక్వెస్ట్‌లకు "Authorization: Bearer <YOUR_API_KEY>" హెడర్ అవసరం.'
                      : 'Pass your secret production API key in the HTTP Authorization header of all API calls.'}
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-indigo-300 flex items-center justify-between">
                    <span>Authorization: Bearer {customApiKey}</span>
                    <button
                      onClick={() => handleCopy(`Authorization: Bearer ${customApiKey}`, setCopiedKey)}
                      className="text-slate-400 hover:text-white"
                      title="Copy Header"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                      2
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Endpoint: /v1/audit</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {lang === 'te' ? '2. ఆడిట్ రిక్వెస్ట్ పంపండి' : '2. Send Audit Execution Request'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'టార్గెట్ డొమైన్‌ను ఆడిట్ చేయడానికి JSON బాడీతో POST రిక్వెస్ట్ పంపండి.'
                      : 'Submit a target domain and number of crawled pages to start the multi-region audit.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={quickStartUrl}
                      onChange={(e) => setQuickStartUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        setSelectedEndpointId('post_audit');
                        setActiveTab('sdks');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                    >
                      View Code
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/40">
                      3
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Status: 200 OK</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {lang === 'te' ? '3. JSON రెస్పాన్స్ స్వీకరించండి' : '3. Parse the Unified Health JSON'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'ఓవరాల్ స్కోర్, SEO, OWASP హెడర్స్, SSL గ్రేడ్ మరియు నిర్దిష్ట సమస్యల విభజనను ప్రాసెస్ చేయండి.'
                      : 'Extract overall score (0-100), Core Web Vitals (LCP, CLS, INP), and prioritize P0/P1 fixes.'}
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300">
                    score: 88, seo: 92, security: 95, cwv: &quot;pass&quot;
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center border border-purple-500/40">
                      4
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Automation & Webhooks</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    {lang === 'te' ? '4. వెబ్‌హుక్స్ & ఆటోమేషన్' : '4. Webhooks & CI/CD Pipelines'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'GitHub Actions లేదా మీ స్వంత వెబ్‌హుక్ ఎండ్‌పాయింట్‌కు ఆటోమేటిక్ అలర్ట్స్ పంపండి.'
                      : 'Provide a webhook_url to receive instant event payloads when deep crawls finish.'}
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-purple-300">
                    event: &quot;audit.completed&quot;, audit_id: &quot;aud_172...&quot;
                  </div>
                </div>
              </div>

              {/* Ready-to-run Interactive Curl Snippet */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Copy-Paste Terminal Command (cURL):
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `curl -X POST "https://websitehealth.ai/api/v1/audit" \\\n  -H "Authorization: Bearer ${customApiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url": "${quickStartUrl}", "pages": 5, "device": "mobile"}'`,
                        setCopiedSnippet
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied to Clipboard' : 'Copy cURL'}</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-slate-900 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
{`curl -X POST "https://websitehealth.ai/api/v1/audit" \\
  -H "Authorization: Bearer ${customApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "${quickStartUrl}",
    "pages": 5,
    "device": "mobile"
  }'`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: ENDPOINTS REFERENCE */}
          {activeTab === 'endpoints' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Endpoints Directory with Search */}
              <div className="lg:col-span-4 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'te' ? 'ఎండ్‌పాయింట్‌లను వెతకండి...' : 'Filter endpoints (e.g. /v1/audit)...'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {filteredEndpoints.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpointId(ep.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all border cursor-pointer ${
                        selectedEndpointId === ep.id
                          ? 'bg-indigo-950/60 border-indigo-500/60 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-black rounded font-mono ${
                            ep.method === 'POST'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {ep.creditCost === 0 ? 'Free' : `${ep.creditCost} ⚡`}
                        </span>
                      </div>
                      <div className="font-mono text-xs font-semibold truncate text-slate-200">
                        {ep.path}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {lang === 'te' && ep.titleTe ? ep.titleTe : ep.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Selected Endpoint Granular Specs */}
              <div className="lg:col-span-8 space-y-4">
                {/* Endpoint Header */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-black rounded-md font-mono ${
                          currentEndpoint.method === 'POST'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {currentEndpoint.method}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {currentEndpoint.path}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg">
                      Cost: {currentEndpoint.creditCost === 0 ? '0 Credits' : `${currentEndpoint.creditCost} Credit`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'te' && currentEndpoint.descriptionTe
                      ? currentEndpoint.descriptionTe
                      : currentEndpoint.description}
                  </p>
                </div>

                {/* Parameters Table */}
                {currentEndpoint.params && currentEndpoint.params.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Request Parameters
                    </h4>
                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                          <tr>
                            <th className="p-2.5">Field</th>
                            <th className="p-2.5">Type</th>
                            <th className="p-2.5">Required</th>
                            <th className="p-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
                          {currentEndpoint.params.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40">
                              <td className="p-2.5 text-indigo-300 font-bold">{p.name}</td>
                              <td className="p-2.5 text-cyan-300">{p.type}</td>
                              <td className="p-2.5">
                                {p.required ? (
                                  <span className="text-rose-400 font-bold">Required</span>
                                ) : (
                                  <span className="text-slate-500 font-normal">Optional</span>
                                )}
                              </td>
                              <td className="p-2.5 font-sans text-slate-400">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sample Request Payload (if POST) */}
                {currentEndpoint.requestBodySample && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Sample Request Body (JSON)
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">Content-Type: application/json</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
                      {JSON.stringify(currentEndpoint.requestBodySample, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Sample Response Payload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Response Schema & Example
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded font-mono">
                        200 OK
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(JSON.stringify(currentEndpoint.responseSample, null, 2), setCopiedSnippet)
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-60 leading-relaxed">
                    {JSON.stringify(currentEndpoint.responseSample, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SDKs & CODE SNIPPETS */}
          {activeTab === 'sdks' && (
            <div className="space-y-6">
              {/* Endpoint & Language Control Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Endpoint:</span>
                  <select
                    value={selectedEndpointId}
                    onChange={(e) => setSelectedEndpointId(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {API_ENDPOINTS.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        [{ep.method}] {ep.path}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                  {(['curl', 'node', 'python', 'php', 'go', 'java', 'ruby'] as const).map((langKey) => (
                    <button
                      key={langKey}
                      onClick={() => setSelectedLanguage(langKey)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer whitespace-nowrap ${
                        selectedLanguage === langKey
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {langKey === 'node'
                        ? 'Node.js'
                        : langKey === 'php'
                        ? 'PHP / WP'
                        : langKey === 'go'
                        ? 'Go'
                        : langKey === 'java'
                        ? 'Java'
                        : langKey === 'ruby'
                        ? 'Ruby'
                        : langKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable API Key for dynamic substitution */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-slate-300 font-medium">Interpolate with Secret API Key:</span>
                </div>
                <input
                  type="text"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="wh_live_..."
                  className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                />
              </div>

              {/* Code Snippet Viewer */}
              <div className="relative p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>
                      {selectedLanguage === 'curl'
                        ? 'terminal.sh'
                        : selectedLanguage === 'node'
                        ? 'auditClient.ts'
                        : selectedLanguage === 'python'
                        ? 'audit_client.py'
                        : selectedLanguage === 'php'
                        ? 'website-health-plugin.php'
                        : selectedLanguage === 'go'
                        ? 'main.go'
                        : selectedLanguage === 'java'
                        ? 'WebsiteHealthApiDemo.java'
                        : 'audit.rb'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(activeSnippet, setCopiedSnippet)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied Code' : 'Copy Code Snippet'}</span>
                  </button>
                </div>

                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed p-2 max-h-[400px]">
                  {activeSnippet}
                </pre>
              </div>

              {/* Package Installation Quick Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-white">Node.js (NPM)</span>
                  <div className="p-1.5 rounded bg-slate-900 font-mono text-[11px] text-cyan-300 select-all">
                    npm install axios
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-white">Python (Pip)</span>
                  <div className="p-1.5 rounded bg-slate-900 font-mono text-[11px] text-cyan-300 select-all">
                    pip install requests
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-white">Go (Module)</span>
                  <div className="p-1.5 rounded bg-slate-900 font-mono text-[11px] text-cyan-300 select-all">
                    go get net/http
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUTHENTICATION & SECURITY */}
          {activeTab === 'auth_security' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'te' ? 'API ఆథెంటికేషన్ మరియు బెస్ట్ ప్రాక్టీసెస్' : 'API Authentication & Secret Management'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'te'
                        ? 'మీ API కీని సురక్షితంగా నిల్వ చేయడానికి మరియు వాడటానికి మార్గదర్శకాలు'
                        : 'Secure your API credentials and ensure zero downtime key rotations in production.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Bearer Token Format:</strong>{' '}
                      All REST requests must include the header{' '}
                      <code className="px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 font-mono text-[11px]">
                        Authorization: Bearer wh_live_...
                      </code>
                      . Requests without this header or with invalid keys receive a <code>401 Unauthorized</code> response.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Keep Secret on the Server:</strong>{' '}
                      Never commit your live API keys to Git repositories or expose them in client-side browser JavaScript (React/Vue). Always use a backend server route (Node, Python, Go, PHP) or Cloudflare Worker to proxy calls.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Environment Variable Standard:</strong>{' '}
                      Store your key in a server environment variable such as{' '}
                      <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[11px]">
                        WEBSITE_HEALTH_API_KEY
                      </code>
                      .
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Zero-Downtime Key Rotation:</strong>{' '}
                      When you rotate keys in the portal, the old key remains operational for 60 seconds to allow in-flight requests to finish before being permanently revoked.
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Limit Response Headers Card */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Telemetry & Rate-Limit Response Headers
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                      <tr>
                        <th className="p-2.5">HTTP Header</th>
                        <th className="p-2.5">Example Value</th>
                        <th className="p-2.5 font-sans">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                      <tr>
                        <td className="p-2.5 text-indigo-300 font-bold">X-RateLimit-Limit</td>
                        <td className="p-2.5 text-slate-400">60</td>
                        <td className="p-2.5 font-sans text-slate-300">Maximum requests allowed per minute in your current plan.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-indigo-300 font-bold">X-RateLimit-Remaining</td>
                        <td className="p-2.5 text-slate-400">58</td>
                        <td className="p-2.5 font-sans text-slate-300">Number of requests left in the current rolling 60-second window.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-indigo-300 font-bold">X-RateLimit-Reset</td>
                        <td className="p-2.5 text-slate-400">42</td>
                        <td className="p-2.5 font-sans text-slate-300">Seconds remaining until the current rate limit window resets.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-indigo-300 font-bold">X-Credits-Remaining</td>
                        <td className="p-2.5 text-amber-300 font-bold">8,752</td>
                        <td className="p-2.5 font-sans text-slate-300">Live credit balance available in your API wallet.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ERRORS & RATE LIMITS */}
          {activeTab === 'errors' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'te' ? 'HTTP రెస్పాన్స్ స్టేటస్ & ఎర్రర్ కోడ్‌లు' : 'HTTP Status Codes & Error Handling'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'te'
                        ? 'మా గేట్‌వే ప్రామాణిక HTTP స్టేటస్ కోడ్‌లను మరియు JSON ఎర్రర్ బాడీలను అందిస్తుంది'
                        : 'The Website Health API uses standard HTTP error codes and structured JSON messages.'}
                    </p>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                      <tr>
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 font-sans">Cause & Remediation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                      <tr>
                        <td className="p-2.5 text-emerald-400 font-bold">200</td>
                        <td className="p-2.5 text-emerald-300">OK</td>
                        <td className="p-2.5 font-sans text-slate-300">Audit or diagnostic query executed successfully.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-cyan-400 font-bold">202</td>
                        <td className="p-2.5 text-cyan-300">Accepted</td>
                        <td className="p-2.5 font-sans text-slate-300">Asynchronous deep crawl queued in edge pipeline.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">400</td>
                        <td className="p-2.5 text-amber-300">Bad Request</td>
                        <td className="p-2.5 font-sans text-slate-300">Invalid URL format or missing required JSON parameters.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-rose-400 font-bold">401</td>
                        <td className="p-2.5 text-rose-300">Unauthorized</td>
                        <td className="p-2.5 font-sans text-slate-300">Missing or revoked Bearer token. Check your API key.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-amber-400 font-bold">402</td>
                        <td className="p-2.5 text-amber-300">Payment Required</td>
                        <td className="p-2.5 font-sans text-slate-300">Credits depleted. Top up your subscription or upgrade tier.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-purple-400 font-bold">429</td>
                        <td className="p-2.5 text-purple-300">Too Many Requests</td>
                        <td className="p-2.5 font-sans text-slate-300">Concurrency rate limit exceeded. Retry after <code>X-RateLimit-Reset</code> seconds.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-rose-400 font-bold">500</td>
                        <td className="p-2.5 text-rose-300">Internal Error</td>
                        <td className="p-2.5 font-sans text-slate-300">Target host was unreachable or timed out during DNS resolution.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Structured JSON Error Payload Example */}
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Structured Error Response Payload (JSON)
                  </h4>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto leading-relaxed">
{`{
  "error": "rate_limit_exceeded",
  "message": "You have exceeded your plan limit of 60 requests/min. Please retry in 18 seconds.",
  "status_code": 429,
  "retry_after_seconds": 18,
  "documentation_url": "https://websitehealth.ai/api/docs#rate-limits"
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Need enterprise high-throughput SLA?</span>
            <a
              href="mailto:api-sales@websitehealth.ai"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              Contact Solutions Team
            </a>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenPlayground && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPlayground();
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{lang === 'te' ? 'ప్లేగ్రౌండ్‌లో టెస్ట్ చేయండి' : 'Test in Live Playground'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-semibold border border-slate-700 transition-colors"
            >
              {lang === 'te' ? 'మూసివేయండి' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
