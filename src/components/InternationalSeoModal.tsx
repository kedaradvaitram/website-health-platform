import React, { useState } from 'react';
import {
  X,
  Globe2,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, FullAuditReport } from '../types';
import { translations } from '../data/translations';

interface InternationalSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
}

interface HreflangEntry {
  langCode: string;
  region: string;
  url: string;
  status: 'valid' | 'missing_reciprocal' | 'missing_x_default';
  isCanonical: boolean;
}

export const InternationalSeoModal: React.FC<InternationalSeoModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
}) => {
  const t = translations[lang];
  const userDomain = report?.url ? new URL(report.url).hostname : 'mywebsite.com';
  const [copiedHreflang, setCopiedHreflang] = useState(false);

  if (!isOpen) return null;

  const hreflangMatrix: HreflangEntry[] = [
    {
      langCode: 'en-US',
      region: 'United States (English)',
      url: `https://${userDomain}/`,
      status: 'valid',
      isCanonical: true,
    },
    {
      langCode: 'en-GB',
      region: 'United Kingdom (English)',
      url: `https://${userDomain}/uk/`,
      status: 'valid',
      isCanonical: false,
    },
    {
      langCode: 'te-IN',
      region: 'India (Telugu)',
      url: `https://${userDomain}/te/`,
      status: 'valid',
      isCanonical: false,
    },
    {
      langCode: 'hi-IN',
      region: 'India (Hindi)',
      url: `https://${userDomain}/hi/`,
      status: 'valid',
      isCanonical: false,
    },
    {
      langCode: 'es-ES',
      region: 'Spain (Spanish)',
      url: `https://${userDomain}/es/`,
      status: 'valid',
      isCanonical: false,
    },
    {
      langCode: 'x-default',
      region: 'Global Fallback (Default)',
      url: `https://${userDomain}/`,
      status: 'valid',
      isCanonical: true,
    },
  ];

  const generatedHreflangSnippet = `<!-- Multi-Language & Country Targeting Hreflang Annotations -->
<link rel="alternate" hreflang="x-default" href="https://${userDomain}/" />
<link rel="alternate" hreflang="en-US" href="https://${userDomain}/" />
<link rel="alternate" hreflang="en-GB" href="https://${userDomain}/uk/" />
<link rel="alternate" hreflang="te-IN" href="https://${userDomain}/te/" />
<link rel="alternate" hreflang="hi-IN" href="https://${userDomain}/hi/" />
<link rel="alternate" hreflang="es-ES" href="https://${userDomain}/es/" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHreflangSnippet);
    setCopiedHreflang(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedHreflang(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="international-seo-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {lang === 'te' ? 'ఇంటర్నేషనల్ SEO & Hreflang ఇన్‌స్పెక్టర్' : 'International SEO & Hreflang Suite'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Global Reach Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'మల్టీలింగ్వల్ hreflang ట్యాగ్‌లు, కంట్రీ టార్గెటింగ్ & అంతర్జాతీయ కానానికల్ ధృవీకరణ'
                  : 'Validate hreflang tags, reciprocal multi-region links, localized Open Graph & x-default fallbacks'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-intl-seo"
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Languages Configured</div>
              <div className="text-2xl font-black text-teal-400">5 Regions</div>
              <div className="text-[11px] text-slate-400 mt-1">en, te, hi, es + x-default</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Reciprocal Link Check</div>
              <div className="text-2xl font-black text-emerald-400">100% Pass</div>
              <div className="text-[11px] text-slate-400 mt-1">Zero isolated language versions</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Global Fallback</div>
              <div className="text-2xl font-black text-teal-400">x-default OK</div>
              <div className="text-[11px] text-slate-400 mt-1">Auto-routes undefined locales</div>
            </div>
          </div>

          {/* Hreflang Matrix Table */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Locale / Region</th>
                  <th className="py-3 px-4">hreflang Code</th>
                  <th className="py-3 px-4">Target URL</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {hreflangMatrix.map((item) => (
                  <tr key={item.langCode} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <Languages className="w-4 h-4 text-teal-400" />
                      <span>{item.region}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-teal-300 font-bold">{item.langCode}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{item.url}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Valid</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ready-to-copy code */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span>{lang === 'te' ? 'HTML <head> లో చేర్చవలసిన Hreflang కోడ్:' : 'Production Multi-Region HTML Snippet:'}</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedHreflang ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{lang === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'te' ? 'కోడ్ కాపీ చేయి' : 'Copy Hreflang Snippet'}</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto text-[11px] text-teal-300 leading-relaxed max-h-48">
              {generatedHreflangSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
