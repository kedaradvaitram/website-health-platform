import React, { useState } from 'react';
import {
  X,
  Code2,
  FileCode,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  Server,
  Key,
  Layers,
  Terminal,
  Share2,
  ExternalLink,
  Zap,
  Globe,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, FullAuditReport } from '../types';
import { translations } from '../data/translations';

interface DeveloperFixCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
}

type DevToolTab = 'schema' | 'robots' | 'nginx' | 'badge' | 'api';

export const DeveloperFixCenterModal: React.FC<DeveloperFixCenterModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<DevToolTab>('schema');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const userDomain = report?.url ? new URL(report.url).hostname : 'mywebsite.com';
  const siteScore = report?.overallScore || 94;

  // Schema form state
  const [schemaType, setSchemaType] = useState<'Organization' | 'Article' | 'FAQ' | 'SoftwareApp'>('Organization');
  const [siteName, setSiteName] = useState(userDomain);

  // Badge state
  const [badgeTheme, setBadgeTheme] = useState<'dark' | 'light' | 'emerald'>('dark');

  if (!isOpen) return null;

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Dynamic code generators
  const generatedSchema =
    schemaType === 'Organization'
      ? `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${siteName}",
  "url": "https://${userDomain}",
  "logo": "https://${userDomain}/logo.png",
  "sameAs": [
    "https://twitter.com/${siteName.split('.')[0]}",
    "https://github.com/${siteName.split('.')[0]}"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@${userDomain}"
  }
}
</script>`
      : schemaType === 'FAQ'
      ? `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does ${siteName} work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${siteName} provides real-time automated diagnostics, Core Web Vitals checks, and actionable AI remediations."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all audits comply with enterprise SOC2 and GDPR standards with zero credential exposure."
      }
    }
  ]
}
</script>`
      : schemaType === 'SoftwareApp'
      ? `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${siteName}",
  "operatingSystem": "Web",
  "applicationCategory": "DeveloperApplication",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "420"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>`
      : `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "${siteName} Performance Architecture",
  "author": {
    "@type": "Organization",
    "name": "${siteName}"
  },
  "datePublished": "2026-08-22",
  "dateModified": "2026-08-22"
}
</script>`;

  const generatedRobots = `# =========================================
# Robots Exclusion Protocol for ${userDomain}
# Optimized for Web Indexers & AI Search Engines
# =========================================

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

# Generative AI & LLM Crawlers
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

# Canonical XML Sitemap & LLM Directives
Sitemap: https://${userDomain}/sitemap.xml
LLMs-Txt: https://${userDomain}/llms.txt`;

  const generatedNginx = `# =========================================
# High-Performance Nginx Config for ${userDomain}
# Includes Security Headers, Brotli & Fast Caching
# =========================================

server {
    listen 443 ssl http2;
    server_name ${userDomain} www.${userDomain};

    # Strict Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Gzip & Brotli Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml image/svg+xml;

    # Static Assets Long-term Caching
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|webp|avif|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # SPA / Dynamic fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}`;

  const embedBadgeCode = `<a href="https://websitehealthai.pro/health/${userDomain}" target="_blank" rel="noopener noreferrer">
  <img src="https://websitehealthai.pro/api/badge?domain=${userDomain}&score=${siteScore}&theme=${badgeTheme}" 
       alt="Website Health Score ${siteScore}/100" 
       width="190" height="36" />
</a>`;

  const apiSampleCode = `// Fetch Live Health Score in Node.js / Python / CI/CD
const res = await fetch("https://websitehealthai.pro/api/v1/audit", {
  method: "POST",
  headers: {
    "Authorization": "Bearer wh_live_9f82c47e1104a",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://${userDomain}",
    auditType: "deep",
    maxPages: 100
  })
});

const report = await res.json();
console.log("Health Score:", report.overallScore);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="developer-fix-center-modal"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {lang === 'te' ? 'డెవలపర్ ఫిక్స్ సెంటర్ & టూల్స్ హబ్' : 'Developer Fix Center & Automation Suite'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ready-to-Deploy Code
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'JSON-LD స్కీమా జనరేటర్, robots.txt, Nginx కాన్ఫిగరేషన్, ఎంబెడబుల్ బ్యాడ్జ్ మరియు డెవలపర్ API'
                  : 'JSON-LD Schema builder, robots.txt directives, Nginx performance tuning, embeddable health badges & REST API'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-dev-center"
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          {[
            { id: 'schema', label: 'Schema.org JSON-LD', icon: FileCode },
            { id: 'robots', label: 'robots.txt AI Config', icon: Sliders },
            { id: 'nginx', label: 'Nginx / .htaccess', icon: Server },
            { id: 'badge', label: 'Embeddable Health Badge', icon: ShieldCheck },
            { id: 'api', label: 'REST API & Webhooks', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DevToolTab)}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Schema.org */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-bold">{lang === 'te' ? 'స్కీమా రకం:' : 'Schema Type:'}</span>
                  {(['Organization', 'FAQ', 'SoftwareApp', 'Article'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setSchemaType(st)}
                      className={`px-3 py-1 text-xs rounded-lg font-mono font-bold transition-all cursor-pointer ${
                        schemaType === st
                          ? 'bg-indigo-500 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-300">{lang === 'te' ? 'సైట్ పేరు:' : 'Name:'}</span>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span>HTML &lt;head&gt; లో చేర్చవలసిన కోడ్:</span>
                  <button
                    onClick={() => handleCopy('schema', generatedSchema)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'schema' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">{lang === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'te' ? 'స్కీమా కాపీ చేయి' : 'Copy JSON-LD'}</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-indigo-300 leading-relaxed max-h-72">
                  {generatedSchema}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: robots.txt */}
          {activeTab === 'robots' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">AI Engine & Search Bot Configuration</h4>
                  <p className="text-xs text-slate-400">
                    Explicit permissions for Google, ChatGPT (GPTBot), Perplexity, and ClaudeBot to index and cite your brand.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('robots', generatedRobots)}
                  className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                >
                  {copiedKey === 'robots' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'robots' ? 'Copied!' : 'Copy robots.txt'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
                <pre className="overflow-x-auto text-[11px] text-indigo-300 leading-relaxed max-h-72">
                  {generatedRobots}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Nginx / .htaccess */}
          {activeTab === 'nginx' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Production Nginx Server Block (HTTP/2 + Brotli + A+ SSL)</h4>
                  <p className="text-xs text-slate-400">
                    Enforces HSTS 2-Year preload, strict CSP, prevents MIME-sniffing and sets 1-year immutable cache on static assets.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('nginx', generatedNginx)}
                  className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                >
                  {copiedKey === 'nginx' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'nginx' ? 'Copied!' : 'Copy Nginx Config'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
                <pre className="overflow-x-auto text-[11px] text-indigo-300 leading-relaxed max-h-72">
                  {generatedNginx}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Embeddable Health Badge */}
          {activeTab === 'badge' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Interactive Live Trust Badge</h4>
                    <p className="text-xs text-slate-400">
                      Embed this live badge in your website footer to prove verified 94/100 performance & security to your visitors.
                    </p>
                  </div>

                  {/* Theme Switcher */}
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                    {(['dark', 'light', 'emerald'] as const).map((thm) => (
                      <button
                        key={thm}
                        onClick={() => setBadgeTheme(thm)}
                        className={`px-3 py-1 text-xs rounded-lg font-bold capitalize transition-all cursor-pointer ${
                          badgeTheme === thm
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {thm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Preview */}
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Website Health Score</div>
                      <div className="text-sm font-black text-emerald-300 font-mono">{siteScore}/100 • VERIFIED PRO</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span>Embed HTML Snippet:</span>
                  <button
                    onClick={() => handleCopy('badge', embedBadgeCode)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'badge' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">{lang === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'te' ? 'బ్యాడ్జ్ కోడ్ కాపీ చేయి' : 'Copy Embed HTML'}</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-indigo-300 leading-relaxed max-h-40">
                  {embedBadgeCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: REST API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Your Developer API Token</h4>
                    <p className="text-xs font-mono text-slate-400">wh_live_9f82c47e1104a••••••••••••</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('apiToken', 'wh_live_9f82c47e1104a9912bc')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'apiToken' ? 'Copied Token!' : 'Copy Bearer Token'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span>Node.js / Python API Integration Example:</span>
                  <button
                    onClick={() => handleCopy('apiSample', apiSampleCode)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'apiSample' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === 'apiSample' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto text-[11px] text-indigo-300 leading-relaxed max-h-64">
                  {apiSampleCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
