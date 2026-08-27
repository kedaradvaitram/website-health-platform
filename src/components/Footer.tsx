import React from 'react';
import {
  Shield,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  Mail,
  Heart,
  ChevronRight,
  ExternalLink,
  Sparkles,
  FileText,
  HelpCircle,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { LegalModalType } from './LegalAndContactModals';
import { AFFILIATE_LINKS } from '../data/affiliateLinks';

interface FooterProps {
  lang: Language;
  onOpenLegalModal: (type: LegalModalType) => void;
  onNavigateSeoPage: (pageKey: string) => void;
  onOpenPricing: () => void;
  onOpenReferral: () => void;
  onOpenDownloads?: () => void;
  onOpenRating?: () => void;
  onOpenApiDocs?: () => void;
  onOpenDeveloperApi?: () => void;
  onOpenStatusPage?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenLegalModal,
  onNavigateSeoPage,
  onOpenPricing,
  onOpenReferral,
  onOpenDownloads,
  onOpenRating,
  onOpenApiDocs,
  onOpenDeveloperApi,
  onOpenStatusPage,
}) => {
  const isTe = lang === 'te';
  const t = translations[lang];

  return (
    <footer
      id="global-footer"
      className="bg-slate-950 border-t border-slate-800/80 text-slate-400 relative overflow-hidden"
    >
      {/* Decorative top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

      {/* Main Footer Container */}
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-14 pb-10 space-y-12">
        {/* Top Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-900">
          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{t.gdprCompliant}</p>
              <p className="text-[11px] text-slate-500">{isTe ? 'గోప్యతా నియమాలకు కట్టుబడి' : 'Privacy-First Architecture'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{t.ssl256Bit}</p>
              <p className="text-[11px] text-slate-500">{isTe ? 'అధునాతన సైఫర్ రక్షణ' : 'End-to-End Encrypted'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{t.supportResponseTime}</p>
              <p className="text-[11px] text-slate-500">{isTe ? 'నిరంతర ఇంజనీరింగ్ సహాయం' : 'Live Expert Support Desk'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenStatusPage}
            className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 hover:border-emerald-500/40 transition-all text-left cursor-pointer group"
            title="View Real-Time API Uptime & Latency Status"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <p className="text-xs font-black text-emerald-400">{t.liveStatus}</p>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">100% Up</span>
              </div>
              <p className="text-[11px] text-slate-500 group-hover:text-slate-400">{isTe ? '99.99% ఆప్-టైమ్ ఇంజిన్' : '100% Probing Engine Uptime'}</p>
            </div>
          </button>
        </div>

        {/* 4-Column Structured Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 text-xs">
          {/* Column 1: Brand & Overview (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-emerald-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight block">
                  WebsiteHealth.AI
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                  Enterprise SEO & Security Engine
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t.footerAboutDesc}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onOpenLegalModal('contact')}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 font-bold transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t.contactUs}</span>
              </button>

              <button
                type="button"
                onClick={onOpenPricing}
                className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold transition-all cursor-pointer"
              >
                <span>{isTe ? 'ప్లాన్‌లు & ధరలు' : 'Pricing Plans'}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={onOpenReferral}
                className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{t.referEarn}</span>
              </button>
            </div>
          </div>

          {/* Column 2: SEO & Diagnostic Tools */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-200">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSeoPage('website-seo-checker')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Technical SEO Checker</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSeoPage('core-web-vitals-test')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Core Web Vitals Test</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSeoPage('ssl-security-scanner')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>SSL & Cipher Audit</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSeoPage('website-performance-checker')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Speed & TTFB Analyzer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSeoPage('website-accessibility-checker')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>WCAG 2.1 Accessibility</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Trust (SEO Authority) */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-200">
              {t.footerCompany}
            </h4>
            <ul className="space-y-2">
              {onOpenRating && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenRating}
                    className="hover:text-amber-400 text-amber-300 transition-colors flex items-center space-x-1.5 cursor-pointer font-bold"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-500" />
                    <span>{isTe ? 'కస్టమర్ 5-స్టార్ రివ్యూలు (4.98★)' : '5-Star Reviews & Feedback (4.98★)'}</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer font-medium"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-slate-300 hover:text-emerald-400 font-bold">{t.privacyPolicy}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t.termsOfService}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('contact')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-emerald-400 font-bold">{t.contactUs} (24/7)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('cookies')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t.cookiePolicy}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('security')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t.securityCompliance}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('disclaimer')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t.disclaimer}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Developers & Webmasters */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-200">
              {t.footerDevelopers}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t.xmlSitemap}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>{t.robotsTxt}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </a>
              </li>
              {onOpenApiDocs && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenApiDocs}
                    className="hover:text-indigo-300 text-indigo-400 font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                    <span>{isTe ? 'API డాక్యుమెంటేషన్ & SDKs (v1)' : 'API Docs & SDK Reference'}</span>
                  </button>
                </li>
              )}
              {onOpenDeveloperApi && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenDeveloperApi}
                    className="hover:text-emerald-400 text-emerald-400 font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                    <span>{isTe ? 'API కీలు & రేట్ లిమిట్స్' : 'API Keys & Playground'}</span>
                  </button>
                </li>
              )}
              {onOpenStatusPage && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenStatusPage}
                    className="hover:text-emerald-300 text-emerald-400 font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                    <span>{isTe ? 'లైవ్ API స్టేటస్ & 90d SLA (100% Up)' : 'API Live Status & 90d SLA (100% Up)'}</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSeoPage('website-health-checker')}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Full Website Health Hub</span>
                </button>
              </li>
              {onOpenDownloads && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenDownloads}
                    className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{t.downloads}</span>
                  </button>
                </li>
              )}
              <li className="pt-2 border-t border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {isTe ? 'అఫీషియల్ హోస్టింగ్ పార్ట్‌నర్స్:' : 'Official Hosting Partners:'}
                </span>
                <div className="flex flex-col space-y-1 text-xs">
                  <a
                    href={AFFILIATE_LINKS.hostingerGermanyMain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                  >
                    <span>🇩🇪 Hostinger (75% OFF Deal)</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                  <a
                    href={AFFILIATE_LINKS.hostingerFranceMain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                  >
                    <span>🇫🇷 Hostinger France (Hébergement)</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                  <a
                    href={AFFILIATE_LINKS.godaddyOfficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 font-bold flex items-center space-x-1"
                  >
                    <span>🌐 GoDaddy Domains & Hosting</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Regulatory Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} WebsiteHealth.AI.</span>
            <span>{t.footerCopyright}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {t.privacyPolicy}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {t.termsOfService}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegalModal('contact')}
              className="hover:text-emerald-400 transition-colors cursor-pointer text-emerald-400"
            >
              {t.contactUs}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegalModal('cookies')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {t.cookiePolicy}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
