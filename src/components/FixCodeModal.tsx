import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  Download,
  Code2,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
  Lock,
  Wrench,
  User,
  Terminal,
  HelpCircle,
  AlertTriangle,
  FileCode,
  CheckCircle,
  ExternalLink,
  Layers,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuditMetric, FixSkillPersona, Language, PricingPlanId } from '../types';
import { translations } from '../data/translations';

interface FixCodeModalProps {
  metric: AuditMetric | null;
  isOpen?: boolean;
  lang: Language;
  onClose: () => void;
  onOpenPricing?: (planId?: PricingPlanId) => void;
  onOpenAutoFix?: () => void;
  onAutoVerify?: (metric: AuditMetric) => void;
}

export const FixCodeModal: React.FC<FixCodeModalProps> = ({
  metric,
  isOpen = true,
  lang,
  onClose,
  onOpenPricing,
  onOpenAutoFix,
  onAutoVerify,
}) => {
  const [activePersona, setActivePersona] = useState<FixSkillPersona>('developer');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const t = translations[lang];

  if (!isOpen || !metric) return null;

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleLaunchAutoFix = () => {
    onClose();
    if (onOpenPricing) {
      onOpenPricing('quick');
    } else if (onOpenAutoFix) {
      onOpenAutoFix();
    }
  };

  const handleVerifyInModal = () => {
    if (isVerifying || !onAutoVerify) return;
    setIsVerifying(true);
    setTimeout(() => {
      onAutoVerify(metric);
      setIsVerifying(false);
      onClose();
    }, 800);
  };

  // Extract structured Problem -> Why -> Fix values
  const problemText =
    lang === 'te' && metric.problemTe
      ? metric.problemTe
      : metric.problem || metric.descriptionTe || metric.description;

  const impactText =
    lang === 'te' && metric.impactTe
      ? metric.impactTe
      : metric.impact ||
        (lang === 'te'
          ? 'ఈ సమస్య సెర్చ్ ఇంజిన్ ర్యాంకింగ్స్‌ను తగ్గిస్తుంది మరియు యూజర్ అనుభవాన్ని ప్రభావితం చేస్తుంది.'
          : 'Degrades search crawl efficiency, Core Web Vitals, conversion rates, and mobile user experience.');

  const solutionText =
    lang === 'te' && metric.solutionTe
      ? metric.solutionTe
      : metric.solution || metric.recommendationTe || metric.recommendation || metric.description;

  const whereToAddText =
    lang === 'te' && metric.whereToAddTe
      ? metric.whereToAddTe
      : metric.whereToAdd ||
        (metric.fixSnippet?.fileTarget ? `File: ${metric.fixSnippet.fileTarget}` : 'Site HTML <head> or Web Server Config');

  const verificationMethodText =
    lang === 'te' && metric.verificationMethodTe
      ? metric.verificationMethodTe
      : metric.verificationMethod ||
        (lang === 'te'
          ? 'ఈ ఆడిట్ టూల్‌లో "ఆటో-వెరిఫై" బటన్ నొక్కండి లేదా గూగుల్ లైట్‌హౌస్ టెస్ట్ రన్ చేయండి.'
          : 'Click "Auto-Verify Fix" below or run Chrome DevTools Lighthouse / curl audit.');

  // Persona-specific fallback data
  const personaData = metric.personaFixes || {};

  const beginnerSteps =
    (lang === 'te' ? personaData.beginner?.stepsTe : personaData.beginner?.steps) || [
      lang === 'te'
        ? 'మీ వెబ్‌సైట్ హోస్టింగ్ కంట్రోల్ ప్యానెల్ (cPanel / Vercel / Netlify) లేదా CMS అడ్మిన్‌కి లాగిన్ అవ్వండి.'
        : 'Log in to your website hosting dashboard (cPanel / Vercel / Netlify) or CMS admin.',
      lang === 'te'
        ? `"${whereToAddText}" ఫైల్‌ను గుర్తించి కింద ఇచ్చిన సరళమైన కోడ్‌ను పేస్ట్ చేయండి.`
        : `Locate the target configuration file (${whereToAddText}) and paste the recommended snippet.`,
      lang === 'te'
        ? 'మార్పులను సేవ్ చేసి, కింద ఉన్న "ఆటో-వెరిఫై ఫిక్స్" బటన్ నొక్కి చెక్ చేయండి.'
        : 'Save changes and click "Auto-Verify Fix" below to confirm the resolution.',
    ];

  const wpSteps =
    (lang === 'te' ? personaData.wordpress?.stepsTe : personaData.wordpress?.steps) || [
      lang === 'te'
        ? 'మీ వర్డ్‌ప్రెస్ డ్యాష్‌బోర్డ్‌లోకి వెళ్లి Plugins -> Add New ఎంచుకోండి.'
        : 'Navigate to WordPress Dashboard -> Plugins -> Add New.',
      lang === 'te'
        ? `సిఫార్సు చేయబడిన ప్లగిన్ (${personaData.wordpress?.pluginOrTool || 'Rank Math / Yoast SEO / WP Rocket'}) ను ఇన్‌స్టాల్ చేసి యాక్టివేట్ చేయండి.`
        : `Install and activate the recommended plugin: ${personaData.wordpress?.pluginOrTool || 'Rank Math / Yoast SEO / WP Rocket / Really Simple SSL'}.`,
      lang === 'te'
        ? 'ప్లగిన్ సెట్టింగ్స్‌లో సంబంధిత ఫీచర్‌ను ఎనేబుల్ చేసి సేవ్ చేయండి.'
        : 'Enable the automated optimization toggle in plugin settings and purge the site cache.',
    ];

  const codeSnippet =
    personaData.developer?.codeSnippet ||
    metric.fixSnippet?.code ||
    `<!-- Recommended Fix for ${metric.name} -->\n<meta name="description" content="Fast, secure website" />`;

  const fileTarget =
    personaData.developer?.fileTarget || metric.fixSnippet?.fileTarget || 'index.html / server.conf';

  const testCommand =
    personaData.developer?.testCommand || `curl -I https://example.com | grep -i "${metric.id.split('-')[1] || 'security'}"`;

  const priorityColor =
    metric.priority === 'P0'
      ? 'bg-rose-50 text-rose-800 border-rose-200'
      : metric.priority === 'P1'
      ? 'bg-orange-50 text-orange-800 border-orange-200'
      : metric.priority === 'P2'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  const priorityLabel =
    metric.priority === 'P0'
      ? lang === 'te' ? '🔴 అత్యవసర సమస్య (P0 Critical)' : '🔴 Critical Issue (P0)'
      : metric.priority === 'P1'
      ? lang === 'te' ? '🟠 అధిక ప్రాధాన్యత (P1 High)' : '🟠 High Priority (P1)'
      : metric.priority === 'P2'
      ? lang === 'te' ? '🟡 మధ్యస్థ ప్రాధాన్యత (P2 Medium)' : '🟡 Medium Priority (P2)'
      : lang === 'te' ? '🟢 సాధారణం (P3 Low)' : '🟢 Low Priority (P3)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border-2 border-amber-300 shrink-0 mt-0.5 shadow-xs">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${priorityColor}`}>
                  {priorityLabel}
                </span>
                {metric.scoreImpact && metric.scoreImpact > 0 && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    +{metric.scoreImpact} {lang === 'te' ? 'పాయింట్లు పెరుగుతాయి' : 'Score Points Gain'}
                  </span>
                )}
                {metric.isVerified && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {lang === 'te' ? 'పరిష్కరించబడింది' : 'Verified Fixed'}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {lang === 'te' && metric.nameTe ? metric.nameTe : metric.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {lang === 'te' ? 'ప్రస్తుత విలువ:' : 'Current Value:'} <span className="font-bold text-slate-800">{metric.value}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-STAGE PROBLEM -> WHY -> SOLUTION BREAKDOWN */}
        <div className="space-y-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl p-4 text-xs">
          {/* 1. Problem */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-rose-700 font-black">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === 'te' ? '1. ప్రస్తుత సమస్య (Problem):' : '1. Current Problem:'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-5 font-medium">{problemText}</p>
          </div>

          {/* 2. Why it matters (Impact) */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="flex items-center space-x-1.5 text-amber-700 font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'te' ? '2. ఎందుకు పరిష్కరించాలి? (Why it matters):' : '2. Why it matters:'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-5 font-medium">{impactText}</p>
          </div>

          {/* 3. Solution */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-black">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'te' ? '3. సరైన పరిష్కారం (Exact Solution):' : '3. Exact Solution:'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-5 font-medium">{solutionText}</p>
          </div>

          {/* 4. Where to add */}
          <div className="flex items-start space-x-2 pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-800 shrink-0">📍 {lang === 'te' ? 'ఎక్కడ చేర్చాలి:' : 'Where to Add:'}</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-slate-300 text-slate-800 text-[11px]">
              {whereToAddText}
            </span>
          </div>

          {/* 5. How to verify */}
          <div className="flex items-start space-x-2 pt-1.5 border-t border-slate-200">
            <span className="font-bold text-slate-800 shrink-0">🔍 {lang === 'te' ? 'ఎలా తనిఖీ చేయాలి:' : 'How to Verify:'}</span>
            <span className="text-slate-700 font-medium text-[11px]">{verificationMethodText}</span>
          </div>
        </div>

        {/* 3-PERSONA FIX SELECTOR TABS (Beginner, Developer, WordPress) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'te' ? 'మీ నైపుణ్య స్థాయిని ఎంచుకోండి:' : 'Choose Your Implementation Role:'}</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {/* Beginner / No-Code Button */}
            <button
              type="button"
              onClick={() => setActivePersona('beginner')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePersona === 'beginner'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="truncate">{lang === 'te' ? 'బిగినర్ / నో-కోడ్' : 'Beginner / No-Code'}</span>
            </button>

            {/* Developer Button */}
            <button
              type="button"
              onClick={() => setActivePersona('developer')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePersona === 'developer'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="truncate">{lang === 'te' ? 'డెవలపర్ (Code)' : 'Developer'}</span>
            </button>

            {/* WordPress Button */}
            <button
              type="button"
              onClick={() => setActivePersona('wordpress')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePersona === 'wordpress'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="truncate">WordPress / CMS</span>
            </button>
          </div>

          {/* TAB 1: BEGINNER / NO-CODE VIEW */}
          {activePersona === 'beginner' && (
            <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{lang === 'te' ? 'సరళమైన 3-దశల గైడ్ (కోడింగ్ అవసరం లేదు):' : 'Easy 3-Step No-Code Action Plan:'}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  {lang === 'te' ? 'సులువైన పద్ధతి' : 'Zero Code Required'}
                </span>
              </div>
              <ol className="space-y-2 text-xs text-emerald-900 list-decimal list-inside font-medium leading-relaxed">
                {beginnerSteps.map((step, idx) => (
                  <li key={idx} className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                    <span className="font-bold">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* TAB 2: DEVELOPER VIEW */}
          {activePersona === 'developer' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Code Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-mono font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Target: {fileTarget}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([codeSnippet], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileTarget.includes('/') ? fileTarget.split('/').pop() || 'fix.txt' : fileTarget;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border border-slate-300"
                      title="Download fix code directly as a file"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-700" />
                      <span>{lang === 'te' ? 'ఫైల్ డౌన్‌లోడ్' : 'Download File'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeSnippet)}
                      className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-300" />
                          <span>{t.copyCode}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative bg-slate-950 text-emerald-300 p-3.5 rounded-2xl font-mono text-xs overflow-x-auto border-2 border-slate-800 shadow-inner max-h-48">
                  <pre className="whitespace-pre-wrap leading-relaxed">{codeSnippet}</pre>
                </div>
              </div>

              {/* CLI Test Command */}
              <div className="bg-slate-900 text-slate-200 rounded-xl p-3 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    <span>{lang === 'te' ? 'టెర్మినల్ టెస్ట్ కమాండ్:' : 'Terminal Verification Command:'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(testCommand)}
                    className="text-[10px] text-amber-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer font-mono"
                  >
                    {copiedCommand ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <code className="text-[11px] font-mono text-amber-300 block truncate">{testCommand}</code>
              </div>
            </div>
          )}

          {/* TAB 3: WORDPRESS / CMS VIEW */}
          {activePersona === 'wordpress' && (
            <div className="bg-indigo-50/70 border-2 border-indigo-300 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-700" />
                  <span>{lang === 'te' ? 'వర్డ్‌ప్రెస్ ప్లగిన్ & సెట్టింగ్స్ పరిష్కారం:' : 'WordPress Plugin & Admin Fix:'}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                  {personaData.wordpress?.pluginOrTool || 'Rank Math / Yoast'}
                </span>
              </div>
              <ol className="space-y-2 text-xs text-indigo-900 list-decimal list-inside font-medium leading-relaxed">
                {wpSteps.map((step, idx) => (
                  <li key={idx} className="bg-white/80 p-2.5 rounded-xl border border-indigo-200">
                    <span className="font-bold">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* 1-Click Automated Auto-Fix CTA Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 border-2 border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-black text-xs">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>{lang === 'te' ? 'ఆటోమేటిక్ GitHub PR / ZIP పరిష్కారం' : 'Instant Automated PR / ZIP Patch'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              {lang === 'te'
                ? 'మీ వెబ్‌సైట్ కోడ్‌ను మా AI ఆటోమేటిక్‌గా సరిచేసి GitHub PR లేదా డౌన్‌లోడ్ ప్యాచ్ సిద్ధం చేస్తుంది.'
                : 'Our AI engine writes and verifies the exact fix code directly for your production repository.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunchAutoFix}
            className="shrink-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/25 cursor-pointer whitespace-nowrap border border-amber-300/80"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            <span>{lang === 'te' ? 'ఆటో-ఫిక్స్ ప్లాన్ (₹299+)' : 'Fix Automatically (₹299+)'}</span>
            <ArrowRight className="w-3 h-3 text-slate-950 stroke-[2.5]" />
          </button>
        </div>

        {/* Footer with Auto-Verify Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-slate-200">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{lang === 'te' ? 'ప్రామాణిక సెక్యూరిటీ ప్రమాణాలు పరీక్షించబడ్డాయి' : 'Production-ready & verified for zero regression'}</span>
          </span>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {onAutoVerify && !metric.isVerified && (
              <button
                type="button"
                onClick={handleVerifyInModal}
                disabled={isVerifying}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/25 disabled:opacity-75"
              >
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
                <span>{isVerifying ? (t.autoVerifying || 'Verifying...') : (lang === 'te' ? 'ఆటో-వెరిఫై ఫిక్స్' : 'Auto-Verify Fix')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer border border-slate-300"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

