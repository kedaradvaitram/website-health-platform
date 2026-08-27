import React, { useRef, useState } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Sparkles, ExternalLink, Lock, Share2, Copy, Check, FileDown, Star, Heart } from 'lucide-react';
import { FullAuditReport, Language, UserAccount } from '../types';
import { translations } from '../data/translations';
import { downloadAuditPdf } from '../utils/pdfGenerator';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report: FullAuditReport;
  user?: UserAccount;
  onOpenAuth?: () => void;
  onOpenRatingModal?: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
  user,
  onOpenAuth,
  onOpenRatingModal,
}) => {
  const t = translations[lang];
  const printRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const referralCode = user?.referralCode || 'axis789';
  const shareUrl = `${window.location.origin}/?ref=${referralCode}#url=${encodeURIComponent(report.url)}`;
  const shareMessage = `🚀 Check out the Health & Security Audit Score (${report.overallScore}/100) for ${report.hostname}! Test your website free here: ${shareUrl}`;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await downloadAuditPdf(report, lang);
    } catch (err) {
      console.error('PDF Generation error:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadText = () => {
    const textReport = `=====================================================
Enterprise Master Audit Report - Website Health & Security
=====================================================
Target URL: ${report.url}
Hostname: ${report.hostname}
Audit Timestamp: ${report.timestamp}
Overall Health Score: ${report.overallScore}/100

KEY METRIC SCORES:
- Performance: ${report.perfScore}/100
- SEO: ${report.seoScore}/100
- Security: ${report.secScore}/100 (SSL Grade: ${report.ssl.grade})
- Accessibility: ${report.accScore}/100
- Best Practices: ${report.bestPracticesScore}/100

DIAGNOSTIC FINDINGS:
${report.summaryItems.map(item => `• ${item}`).join('\n')}

DNS & NETWORKING:
${report.dns.map(d => `• ${d.recordType}: ${d.value} (${d.status.toUpperCase()}) - ${d.details}`).join('\n')}

TECHNOLOGIES DETECTED:
${report.technologies.map(t => `• ${t.name} (${t.category})`).join('\n')}

=====================================================
Powered by WebsiteHealth.AI - Website Health Intelligence
Referral Link: ${shareUrl}
=====================================================`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Enterprise_Audit_Report_${report.hostname.replace(/[^a-zA-Z0-9.-]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`Website Audit Score: ${report.overallScore}/100 for ${report.hostname}`)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 relative max-h-[92vh] overflow-y-auto">
        
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 no-print">
          <div>
            <span className="text-base font-black text-slate-900 block">
              {lang === 'te' ? 'ఆడిట్ రిపోర్ట్ డౌన్‌లోడ్ & షేర్' : 'Audit Report Download & Share'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {report.hostname} • {report.overallScore}/100 Health Score
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Direct PDF Download Button (Rich Golden Amber) */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              id="btn-download-pdf-modal"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-95 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/80"
              title="Download Full Formatted PDF File"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>{isGeneratingPdf ? (lang === 'te' ? 'సేవ్ అవుతోంది...' : 'Generating PDF...') : (lang === 'te' ? 'PDF సేవ్ చేయండి' : 'Save PDF')}</span>
            </button>

            {/* Save Text File Button */}
            <button
              onClick={handleDownloadText}
              id="btn-save-text-modal"
              className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              title="Save Plain Text Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'టెక్స్ట్ సేవ్ (Save Text)' : 'Save Text'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Social Sharing Bar: WhatsApp, Facebook, Copy Link */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 rounded-2xl text-white space-y-3 no-print shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'te' ? 'స్నేహితులు & సోషల్ మీడియాలో షేర్ చేయండి:' : 'Share Score with Colleagues & Clients:'}
            </span>
            {user?.isLoggedIn && (
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                ⚡ Earn +1 Credit per Referral
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-3 py-2 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </button>

            {/* Facebook Share Button */}
            <button
              onClick={handleShareFacebook}
              className="inline-flex items-center justify-center space-x-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold px-3 py-2 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>

            {/* Copy Referral Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2 rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedLink ? (lang === 'te' ? 'కాపీ అయింది!' : 'Link Copied!') : (lang === 'te' ? 'లింక్ కాపీ చేయండి' : 'Copy Link')}</span>
            </button>
          </div>
        </div>

        {/* 5-Star Rating & Customer Feedback Prompt Banner */}
        {onOpenRatingModal && (
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 no-print">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{lang === 'te' ? 'ఈ రిపోర్ట్ మీకు ఉపయోగపడిందా?' : 'Loved your diagnostic report?'}</span>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded">+2 Credits</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {lang === 'te' ? 'మీ 5-స్టార్ రేటింగ్ & ఫీడ్‌బ్యాక్ ఇచ్చి ఇతరులను ఇంప్రెస్ చేయండి' : 'Leave your 5-star rating & feedback to help other webmasters'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRatingModal();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>{lang === 'te' ? 'రేట్ చేయండి (5★)' : 'Rate Us (5★)'}</span>
            </button>
          </div>
        )}

        {/* The PDF Document Layout */}
        <div
          ref={printRef}
          className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs p-5 sm:p-6 space-y-5 print:border-none print:shadow-none"
        >
          {/* Header Banner - #10B981 */}
          <div className="bg-emerald-500 text-white p-4 sm:p-5 rounded-xl text-center shadow-sm">
            <h1 className="text-lg sm:text-xl font-black tracking-wide">Enterprise Master Audit Report</h1>
            <p className="text-xs text-emerald-100 mt-0.5">Automated Website Health, Security & Performance Intelligence</p>
          </div>

          {/* Target URL banner */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] text-slate-500 font-bold uppercase block">Scanned Target URL:</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-600 break-all">{report.url}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">{report.timestamp}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 inline-block mt-0.5">
                Health Score: {report.overallScore}/100
              </span>
            </div>
          </div>

          {/* Diagnostic Findings */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-1.5">
              Diagnostic Results & Findings:
            </h3>
            <div className="space-y-1.5">
              {report.summaryItems.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars mini scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Performance</span>
              <span className="font-extrabold text-slate-900">{report.perfScore}/100</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">SEO</span>
              <span className="font-extrabold text-slate-900">{report.seoScore}/100</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Security</span>
              <span className="font-extrabold text-emerald-600">Grade {report.ssl.grade}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Accessibility</span>
              <span className="font-extrabold text-slate-900">{report.accScore}/100</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block font-semibold">Best Practices</span>
              <span className="font-extrabold text-slate-900">{report.bestPracticesScore}/100</span>
            </div>
          </div>

          {/* Footer referral message */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-xs font-bold text-emerald-700">
              📢 Share with your friends & colleagues to help them secure their websites!
            </p>
            <p className="text-[11px] font-bold text-indigo-600">
              Powered by WebsiteHealth.AI Intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

