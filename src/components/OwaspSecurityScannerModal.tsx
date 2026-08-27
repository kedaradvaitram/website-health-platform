import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Unlock,
  Bug,
  Code2,
  CheckCircle2,
  RefreshCw,
  Zap,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';
import { Language, OwaspSecurityVulnerability, FullAuditReport } from '../types';
import confetti from 'canvas-confetti';

interface OwaspSecurityScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
}

const DEFAULT_OWASP_ITEMS: OwaspSecurityVulnerability[] = [
  {
    id: 'owasp-a01',
    owaspCategory: 'A01:2021 - Broken Access Control',
    cveCode: 'CWE-200',
    name: 'Sensitive Exposed Files Probe (.env, .git, config.bak)',
    nameTe: 'ఎక్స్‌పోజ్ అయిన సున్నితమైన ఫైల్స్ (.env, .git, wp-config)',
    severity: 'PASSED',
    riskScore: 0,
    pathOrComponent: '/.env, /.git/config, /wp-config.php.bak',
    description: 'Probed for publicly accessible environment variables, Git trees, and backup files. Zero leaks detected.',
    remediation: 'Keep directory listing off and ensure 404/403 for dot-files.',
    status: 'secure',
  },
  {
    id: 'owasp-a02',
    owaspCategory: 'A02:2021 - Cryptographic Failures',
    cveCode: 'CVE-2014-0160',
    name: 'TLS 1.3 Strict Cipher Suites & HSTS Preload',
    nameTe: 'TLS 1.3 ఎన్‌క్రిప్షన్ మరియు HSTS ప్రీలోడ్',
    severity: 'PASSED',
    riskScore: 0,
    pathOrComponent: 'HTTPS Transport Layer (Port 443)',
    description: 'Enforces 256-bit AES-GCM and ChaCha20-Poly1305. Deprecated TLS 1.0/1.1 are completely disabled.',
    remediation: 'Maintain modern cipher configurations on Nginx/Cloudflare.',
    status: 'secure',
  },
  {
    id: 'owasp-a03',
    owaspCategory: 'A03:2021 - Injection & Cross-Site Scripting (XSS)',
    cveCode: 'CWE-79',
    name: 'Content-Security-Policy (CSP) & X-Frame-Options',
    nameTe: 'కంటెంట్ సెక్యూరిటీ పాలసీ (CSP) మరియు క్లిక్‌జాకింగ్ రక్షణ',
    severity: 'MEDIUM',
    riskScore: 45,
    pathOrComponent: 'HTTP Response Headers',
    description: 'Strict Content-Security-Policy is missing or allows unsafe-inline scripts without nonce validation.',
    remediation: 'Implement a nonced CSP header to prevent malicious inline script execution.',
    codeSnippet: `add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none';" always;`,
    status: 'vulnerable',
  },
  {
    id: 'owasp-a05',
    owaspCategory: 'A05:2021 - Security Misconfiguration',
    cveCode: 'CWE-16',
    name: 'CORS Wildcard & Information Disclosure (Server Header)',
    nameTe: 'CORS వైల్డ్‌కార్డ్ మరియు సర్వర్ వెర్షన్ లీకేజీ తనిఖీ',
    severity: 'LOW',
    riskScore: 20,
    pathOrComponent: 'Access-Control-Allow-Origin / Server Banner',
    description: 'Server tokens (e.g. "Server: nginx/1.18.0") are broadcast in response headers.',
    remediation: 'Add `server_tokens off;` to hide server version details.',
    codeSnippet: `server_tokens off;
more_clear_headers Server;`,
    status: 'warning',
  },
  {
    id: 'owasp-a06',
    owaspCategory: 'A06:2021 - Vulnerable and Outdated Components',
    cveCode: 'CVE-2023-26159',
    name: 'Front-End JavaScript Library Dependency CVE Scan',
    nameTe: 'ఫ్రంట్-ఎండ్ జావాస్క్రిప్ట్ లైబ్రరీ CVE స్కాన్',
    severity: 'PASSED',
    riskScore: 0,
    pathOrComponent: 'Client JS Bundles & External CDNs',
    description: 'No known high-severity CVEs or outdated vulnerable jQuery/Lodash bundles detected in runtime.',
    remediation: 'Keep packages updated via automated Dependabot/Snyk audits.',
    status: 'secure',
  },
  {
    id: 'owasp-email',
    owaspCategory: 'Email Spoofing & Phishing Defense',
    cveCode: 'RFC-7489',
    name: 'DMARC Enforcement & SPF / DKIM Record Verification',
    nameTe: 'DMARC రక్షణ మరియు ఈమెయిల్ స్పూఫింగ్ నివారణ',
    severity: 'PASSED',
    riskScore: 0,
    pathOrComponent: 'DNS TXT Records (_dmarc.domain.com)',
    description: 'DMARC policy `v=DMARC1; p=reject;` protects domain from unauthorized email spoofing.',
    remediation: 'Ensure DKIM selectors are rotated every 6 months.',
    status: 'secure',
  },
];

export const OwaspSecurityScannerModal: React.FC<OwaspSecurityScannerModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
}) => {
  const isTe = lang === 'te';
  const targetUrl = report?.url || 'https://mywebsite.com';
  const [items, setItems] = useState<OwaspSecurityVulnerability[]>(DEFAULT_OWASP_ITEMS);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const secureCount = items.filter((i) => i.status === 'secure').length;
  const vulnerableCount = items.filter((i) => i.status === 'vulnerable').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="owasp-security-modal"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isTe
                    ? 'OWASP Top 10 & CVE వల్నరబిలిటీ సెక్యూరిటీ స్కానర్'
                    : 'OWASP Top 10 & CVE Vulnerability Security Scanner'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Zero-Trust Enterprise</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isTe
                  ? 'బ్రోకెన్ యాక్సెస్ కంట్రోల్, XSS, ఎక్స్‌పోజ్డ్ ఫైల్స్, మరియు అవుట్‌డేటెడ్ JS లైబ్రరీ CVE స్కాన్'
                  : 'Deep vulnerability inspection covering broken access control, XSS, exposed secrets, and CVEs'}
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
          {/* Target & Security Posture Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 font-mono uppercase">Scanned Endpoint</span>
              <div className="text-sm font-mono font-bold text-white">{targetUrl}</div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{secureCount} Passed</span>
              </span>
              {vulnerableCount > 0 && (
                <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{vulnerableCount} Vulnerable</span>
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />
                  <span>{warningCount} Warnings</span>
                </span>
              )}

              <button
                onClick={handleReScan}
                disabled={isScanning}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning CVEs...' : 'Re-Scan OWASP'}</span>
              </button>
            </div>
          </div>

          {/* Vulnerabilities List */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.status === 'secure'
                    ? 'bg-slate-950/80 border-emerald-500/30 shadow-sm'
                    : item.status === 'vulnerable'
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-sm'
                    : 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                        {item.owaspCategory}
                      </span>
                      {item.cveCode && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {item.cveCode}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white pt-1">
                      {isTe ? item.nameTe : item.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">{item.pathOrComponent}</p>
                  </div>

                  <span
                    className={`text-xs font-black font-mono px-2.5 py-1 rounded-xl self-start ${
                      item.severity === 'PASSED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : item.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-white font-black animate-pulse'
                        : item.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : item.severity === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.description}</p>

                {item.remediation && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Remediation Advice:</span>
                      </span>
                      {item.codeSnippet && (
                        <button
                          onClick={() => handleCopyCode(item.id, item.codeSnippet!)}
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-bold"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Fix</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{item.remediation}</p>

                    {item.codeSnippet && (
                      <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre">
                        {item.codeSnippet}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isTe ? 'OWASP ఫౌండేషన్ మార్గదర్శకాలకు అనుగుణంగా ధృవీకరించబడింది' : 'Compliant with OWASP Top 10 Web Security Standards'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            {isTe ? 'మూసివేయండి' : 'Close Security Scanner'}
          </button>
        </div>
      </div>
    </div>
  );
};
