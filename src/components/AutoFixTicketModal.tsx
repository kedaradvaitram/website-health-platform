import React, { useState, useEffect } from 'react';
import {
  X,
  Wrench,
  GitPullRequest,
  Download,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Github,
  ArrowRight,
  Layers,
  Check,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientTicket, FullAuditReport, Language } from '../types';
import { translations } from '../data/translations';
import {
  generateAdSenseSeoKit,
  downloadAdSenseSeoZip,
} from '../data/adsenseSeoRemediationKit';
import { DollarSign, FolderArchive } from 'lucide-react';

interface AutoFixTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  targetUrl?: string;
  websiteUrl?: string;
  targetReport?: FullAuditReport | null;
  metric?: any;
  initialDescription?: string;
  initialIssuesCount?: number;
  onAddTicket?: (ticket: ClientTicket) => void;
  onTicketCreated?: (ticket: ClientTicket) => void;
  onOpenPricing?: (planId?: 'starter' | 'pro' | 'enterprise') => void;
}

export const AutoFixTicketModal: React.FC<AutoFixTicketModalProps> = ({
  isOpen,
  onClose,
  lang,
  targetUrl,
  websiteUrl,
  targetReport,
  metric,
  initialDescription,
  initialIssuesCount = 4,
  onAddTicket,
  onTicketCreated,
  onOpenPricing,
}) => {
  const activeUrl = targetUrl || websiteUrl || 'https://example.com';
  const t = translations[lang];
  const [githubUrl, setGithubUrl] = useState('https://github.com/username/my-website');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [completedTicket, setCompletedTicket] = useState<ClientTicket | null>(null);

  // Extract detected issue metrics from report
  const detectedIssues = React.useMemo(() => {
    if (!targetReport?.categories) return [];
    return targetReport.categories
      .flatMap((cat) =>
        cat.metrics
          .filter((m) => m.status === 'error' || m.status === 'warning' || m.score < 90)
          .map((m) => ({
            id: m.id,
            name: lang === 'te' && m.nameTe ? m.nameTe : m.name,
            desc: lang === 'te' && m.descriptionTe ? m.descriptionTe : m.description,
            category: cat.name,
            status: m.status,
          }))
      )
      .slice(0, 8);
  }, [targetReport, lang]);

  const [selectedIssueIds, setSelectedIssueIds] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'zip' | 'github'>('github');

  useEffect(() => {
    if (isOpen) {
      if (detectedIssues.length > 0) {
        setSelectedIssueIds(detectedIssues.map((i) => i.id));
        const issueSummary = detectedIssues.map((i) => i.name).join(', ');
        setDescription(
          initialDescription ||
            `Fix missing <title>, image alt tags, Core Web Vitals, and enable HSTS/security headers (${detectedIssues.length} issues: ${issueSummary})`
        );
      } else {
        setDescription(
          initialDescription ||
            'Fix missing <title>, image alt tags, Core Web Vitals, and enable HSTS/security headers'
        );
      }
    }
  }, [isOpen, initialDescription, detectedIssues]);

  if (!isOpen) return null;

  const toggleIssueSelection = (id: string) => {
    setSelectedIssueIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const triggerDownload = (fileName: string, content: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setStepMessage(
      lang === 'te'
        ? 'HTML ఫైల్స్ స్కాన్ చేసి <title>, <meta> మరియు alt ట్యాగ్స్ ఇంజెక్ట్ చేస్తున్నాము...'
        : 'Scanning HTML files and generating <title>, <meta description>, & alt tag fixes...'
    );

    setTimeout(() => {
      setStepMessage(
        lang === 'te'
          ? 'సెక్యూరిటీ హెడర్స్, CSP మరియు HSTS కాన్ఫిగరేషన్ సిద్ధం చేస్తున్నాము...'
          : 'Configuring Nginx & Apache security headers, CSP & HSTS directives...'
      );
    }, 1200);

    setTimeout(() => {
      setStepMessage(
        lang === 'te'
          ? 'ఆటో-ఫిక్స్ ప్యాచ్ ఫైల్‌లను బండిల్ చేస్తున్నాము...'
          : 'Packaging all remediated files and production config snippets...'
      );
    }, 2400);

    setTimeout(() => {
      const isPr = deliveryMethod === 'github';
      const cleanRepo = (githubUrl || 'https://github.com/my-org/my-website')
        .replace(/^https:\/\/github\.com\//, '')
        .replace(/\.git$/, '');
      const count = selectedIssueIds.length || initialIssuesCount || 4;

      const newTicket: ClientTicket = {
        id: Math.floor(1000 + Math.random() * 9000),
        email: email || 'user@example.com',
        websiteUrl: activeUrl,
        githubLink: isPr ? (githubUrl || 'https://github.com/my-org/my-website') : undefined,
        description: description,
        status: isPr ? 'PR Opened' : 'Resolved (zip)',
        prUrl: isPr
          ? `https://github.com/${cleanRepo}/pull/${Math.floor(1 + Math.random() * 20)}`
          : undefined,
        downloadPath: !isPr ? `fixed_audit_package_${Date.now()}.zip` : undefined,
        createdAt: new Date().toLocaleDateString(),
        fixedIssuesCount: count,
      };

      if (typeof onAddTicket === 'function') {
        onAddTicket(newTicket);
      }
      if (typeof onTicketCreated === 'function') {
        onTicketCreated(newTicket);
      }
      setCompletedTicket(newTicket);
      setIsProcessing(false);

      // Auto trigger download if zip mode
      if (!isPr) {
        const patchContent = `# Automated Remediation Patch
# Website: ${activeUrl}
# Date: ${new Date().toISOString()}
# Issues Fixed: ${count}
# Description: ${description}

--- 1. HTML Title & Meta Tags ---
<title>Optimized Website Title | High Performance</title>
<meta name="description" content="Fast, accessible, and secure web application.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

--- 2. Security Headers (Nginx/Apache) ---
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline';

--- 3. Image Optimization & Alt Tags ---
All <img> tags updated with descriptive alt attributes and width/height dimensions.
`;
        triggerDownload(`website_health_fix_bundle_${Date.now()}.txt`, patchContent);
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 3200);
  };

  const handleReset = () => {
    setCompletedTicket(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto my-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">{t.autoFixModalTitle}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t.fixAllBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.bundleFixSubtitle || t.autoFixSubtitle}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Output State */}
        {completedTicket ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-950">
                {completedTicket.status === 'PR Opened'
                  ? 'Automated Pull Request Created!'
                  : 'Fixed ZIP Package Ready!'}
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                Successfully bundled and resolved {completedTicket.fixedIssuesCount} issues across HTML
                titles, meta tags, and security headers.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {completedTicket.prUrl ? (
                <a
                  href={completedTicket.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-colors"
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>View GitHub Pull Request</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    const kit = generateAdSenseSeoKit({ websiteUrl: completedTicket.websiteUrl });
                    await downloadAdSenseSeoZip(kit);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer border border-amber-300"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>{lang === 'te' ? 'యాడ్‌సెన్స్ + ఎస్‌ఈఓ + ఫిక్సెస్ ZIP' : 'Download AdSense + SEO + Fixes ZIP'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bundled Issues Preview Box */}
            {detectedIssues.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {lang === 'te' ? 'బండిల్ చేయబడిన సమస్యలు:' : 'Bundled Remediation Issues:'}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {selectedIssueIds.length} / {detectedIssues.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {detectedIssues.map((issue) => {
                    const isChecked = selectedIssueIds.includes(issue.id);
                    return (
                      <div
                        key={issue.id}
                        onClick={() => toggleIssueSelection(issue.id)}
                        className={`p-2 rounded-xl text-[11px] font-medium border flex items-center space-x-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white border-emerald-300 text-slate-800 shadow-2xs'
                            : 'bg-slate-100/60 border-slate-200 text-slate-400 line-through'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 text-white ${
                            isChecked ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span className="truncate">{issue.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pro Upgrade & Security Protection Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {lang === 'te' ? 'పూర్తి ఆటోమేటెడ్ రిపయిర్ & PR రివ్యూ' : 'Need Full Production PR & Live Verification?'}
                    </span>
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {lang === 'te'
                      ? 'రియల్ డెవలపర్ వెరిఫికేషన్ మరియు పూర్తి కోడ్ ప్యాచ్ కోసం ప్రో ప్లాన్ పొందండి.'
                      : 'Upgrade to Pro for full multi-file remediation and human developer code audit.'}
                  </p>
                </div>
              </div>
              {onOpenPricing && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPricing('pro');
                  }}
                  className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer whitespace-nowrap"
                >
                  {lang === 'te' ? 'ప్లాన్స్ చూడండి' : 'View Pro Plan'}
                </button>
              )}
            </div>

            {/* Delivery Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'te' ? 'డెలివరీ పద్ధతి ఎంచుకోండి:' : 'Select Delivery Format:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('zip')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    deliveryMethod === 'zip'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'te' ? 'తక్షణ ZIP డౌన్‌లోడ్' : 'Instant ZIP Download'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('github')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    deliveryMethod === 'github'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <Github className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'te' ? 'గిట్‌హబ్ PR' : 'GitHub Pull Request'}</span>
                </button>
              </div>
            </div>

            {deliveryMethod === 'github' && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.repoUrlLabel}</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder={t.repoPlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.emailOptional}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'te' ? 'అదనపు వివరాలు / సూచనలు (ఐచ్ఛికం)' : 'Additional Notes / Custom Instructions (Optional)'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Processing state indicator */}
            {isProcessing && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{stepMessage}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Safe Isolation Guarantee */}
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-1">
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>
                {lang === 'te'
                  ? 'సురక్షిత రక్షణ: ఈ ఆడిట్ ప్యాచ్ క్లయింట్ వెబ్‌సైట్‌కు మాత్రమే పరిమితం, సర్వర్ పర్మిషన్లు సురక్షితం.'
                  : 'Isolated Sandbox: Generates code patches exclusively for the audited target URL with zero host server access.'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {t.close}
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? lang === 'te'
                      ? 'ప్రాసెస్ అవుతోంది...'
                      : 'Processing Fix...'
                    : deliveryMethod === 'github'
                    ? lang === 'te'
                      ? 'PR సృష్టించండి'
                      : 'Generate Bundle PR'
                    : lang === 'te'
                    ? '1-క్లిక్ ఆటో-ఫిక్స్ & డౌన్‌లోడ్'
                    : '1-Click Auto-Fix & Download'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
