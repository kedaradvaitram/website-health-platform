import React, { useState } from 'react';
import {
  X as LucideX,
  Gift as LucideGift,
  Copy as LucideCopy,
  Check as LucideCheck,
  Sparkles as LucideSparkles,
  Users as LucideUsers,
  Zap as LucideZap,
  Globe as LucideGlobe,
  CheckCircle2 as LucideCheckCircle2,
  ShieldCheck as LucideShieldCheck,
  ArrowRight as LucideArrowRight,
  LogIn as LucideLogIn,
  Mail as LucideMail,
  UserCheck as LucideUserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserAccount } from '../types';
import { translations } from '../data/translations';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  onSimulateReferralReward?: () => void;
  onUnlockWebsiteWithCredit?: (url: string) => void;
  activeWebsiteUrl?: string;
  onOpenAuth?: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  onSimulateReferralReward,
  onUnlockWebsiteWithCredit,
  activeWebsiteUrl,
  onOpenAuth,
}) => {
  const [copied, setCopied] = useState(false);
  const [simulatedCount, setSimulatedCount] = useState(0);
  const t = translations[lang] || translations.en;

  if (!isOpen) return null;

  // Determine user's real email-based referral code
  const isAuthed = Boolean(user.isLoggedIn && (user.email || user.name));
  
  const getGmailBasedRefCode = () => {
    if (user.referralCode) return user.referralCode;
    if (user.email && user.email.includes('@')) {
      const prefix = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      return prefix.length >= 3 ? prefix : `${prefix}789`;
    }
    if (user.name) {
      const cleanName = user.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return `${cleanName}789`;
    }
    return '';
  };

  const currentRefCode = isAuthed ? getGmailBasedRefCode() : '';
  const referralLink = currentRefCode ? `${window.location.origin}/?ref=${currentRefCode}` : '';

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!referralLink) return;
    const text =
      lang === 'te'
        ? `🚀 మీ వెబ్‌సైట్ స్పీడ్, ఎస్‌ఈఓ & సెక్యూరిటీని ఉచితంగా టెస్ట్ చేసుకోండి! ఈ లింక్ ద్వారా ఆడిట్ చేయండి: ${referralLink}`
        : `🚀 Test your website health, Core Web Vitals & Security for free! Run an instant audit here: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    if (!referralLink) return;
    const text =
      lang === 'te'
        ? `🚀 వెబ్‌సైట్ ఆడిట్ & ఆటో-ఫిక్స్ టూల్! ఉచితంగా స్కాన్ చేయండి: ${referralLink}`
        : `🚀 Complete Website Health Audit & Auto-Fix Tool. Test your website free: ${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    if (!referralLink) return;
    const text = `Audit and fix website SEO, Security & Speed in 1 click! Free report: ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleSimulate = () => {
    setSimulatedCount((prev) => prev + 1);
    if (onSimulateReferralReward) {
      onSimulateReferralReward();
    }
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const unlockedList = user.unlockedWebsites || [];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 relative max-h-[90vh] overflow-y-auto my-auto divide-y-2 divide-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 border-2 border-amber-400">
              <LucideGift className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {lang === 'te'
                    ? '1 రిఫర్ = 1 వెబ్‌సైట్ ఫుల్ పాస్ ఉచితం'
                    : '1 Refer = 1 Full Website Pro Pass Free'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  ₹799 Free Value
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {lang === 'te'
                  ? 'మీ లింక్ ద్వారా స్నేహితుడు సైన్ ఇన్ లేదా స్కాన్ చేసిన ప్రతిసారి మీకు 1 ఉచిత వెబ్‌సైట్ పాస్ లభిస్తుంది.'
                  : 'Earn 1 Website Credit per referral to unlock 100% Pro Code Fixes for 1 full website!'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 shrink-0 ml-2"
            title="Close"
          >
            <LucideX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="pt-4 space-y-4">
          
          {/* If NOT logged in: Direct Login Requirement Callout */}
          {!isAuthed ? (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-300 shadow-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                <LucideLogIn className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-black text-slate-900">
                  {lang === 'te'
                    ? 'రిఫరల్ కోడ్ కోసం ముందుగా మీ Gmail తో లాగిన్ అవ్వండి'
                    : 'Sign in with your Gmail to get your Referral Code'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {lang === 'te'
                    ? 'మీరు మీ Google (Gmail) ఖాతాతో లాగిన్ అయిన తర్వాత మాత్రమే మీ ఈమెయిల్ ఆధారంగా ప్రత్యేకమైన రిఫరల్ లింక్ యాక్టివేట్ చేయబడుతుంది మరియు మీ క్రెడిట్స్ నేరుగా మీ అకౌంట్‌కు క్రెడిట్ అవుతాయి.'
                    : 'Your unique referral link is personalized using your authenticated Google account so all earned free website passes are safely saved to your profile.'}
                </p>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer border border-amber-300 active:scale-95"
                >
                  <LucideMail className="w-4 h-4" />
                  <span>
                    {lang === 'te' ? 'Google / Gmail తో లాగిన్ అవ్వండి' : 'Sign In with Google (Gmail)'}
                  </span>
                  <LucideArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Logged in User View - Active Personalized Referral Hub */
            <>
              {/* Authenticated Gmail Info Pill */}
              <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                    <LucideUserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 mr-1.5">
                      {lang === 'te' ? 'యాక్టివ్ ఖాతా:' : 'Connected Gmail:'}
                    </span>
                    <span className="font-bold text-amber-300 truncate">
                      {user.email || user.name}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                  VERIFIED
                </span>
              </div>

              {/* Credit Stat Card & Value Proposition */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-100">
                      {lang === 'te' ? 'మీ అందుబాటులో ఉన్న రిఫరల్ క్రెడిట్స్' : 'YOUR AVAILABLE REFERRAL CREDITS'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black flex items-center justify-center sm:justify-start gap-2">
                      <span>{user.credits ?? 0}</span>
                      <span className="text-amber-200 text-lg font-bold">Credits</span>
                      <LucideZap className="w-5 h-5 fill-amber-300 text-amber-300" />
                    </div>
                    <p className="text-[11px] text-amber-100 font-medium">
                      {lang === 'te'
                        ? `1 క్రెడిట్ = 1 వెబ్‌సైట్‌కు ఫుల్ ప్రో ఫిక్స్ యాక్సెస్ (₹799 ఉచితం)`
                        : `1 Credit = 1 Full Website Access Pass (Unlocks ₹799 value)`}
                    </p>
                  </div>

                  {/* Sandbox test button */}
                  <div className="shrink-0 flex flex-col items-center sm:items-end gap-1">
                    <button
                      type="button"
                      onClick={handleSimulate}
                      className="inline-flex items-center space-x-1.5 bg-white hover:bg-amber-50 text-amber-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer border border-amber-200 active:scale-95"
                    >
                      <LucideSparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lang === 'te' ? '⚡ డెమో: +1 క్రెడిట్ టెస్ట్' : '⚡ Simulate (+1 Credit)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Active Website Unlock CTA if user has credits */}
              {activeWebsiteUrl && (user.credits ?? 0) > 0 && onUnlockWebsiteWithCredit && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                      <LucideZap className="w-4 h-4 fill-emerald-600 text-emerald-600 shrink-0" />
                      <span>{lang === 'te' ? 'ఈ వెబ్‌సైట్‌ను ఇప్పుడే అన్‌లాక్ చేయండి' : 'Unlock Current Website Now'}</span>
                    </div>
                    <p className="text-xs text-emerald-800 font-mono font-bold truncate">
                      {activeWebsiteUrl}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onUnlockWebsiteWithCredit(activeWebsiteUrl);
                      onClose();
                    }}
                    className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-all cursor-pointer border border-emerald-700 shrink-0"
                  >
                    <span>{lang === 'te' ? '⚡ 1 క్రెడిట్‌తో అన్‌లాక్ చేయండి' : '⚡ Unlock with 1 Credit'}</span>
                    <LucideArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Referral Link & Social Sharing */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="block text-xs font-bold text-slate-800">
                    {t.yourRefLink || 'Your Personal Referral Link:'}
                  </label>
                  <span className="text-[11px] font-mono text-slate-600 font-bold">
                    Code: <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{currentRefCode}</span>
                  </span>
                </div>

                <div className="flex items-center bg-white border-2 border-slate-300 rounded-xl p-1.5 shadow-inner">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="bg-transparent text-xs text-slate-700 font-mono w-full px-2.5 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    {copied ? (
                      <>
                        <LucideCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t.copied || 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <LucideCopy className="w-3.5 h-3.5 text-slate-300" />
                        <span>{t.copyRefLink || 'Copy Link'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-600 mr-1">
                    {lang === 'te' ? 'నేరుగా షేర్ చేయండి:' : 'Share via:'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center space-x-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer border border-emerald-400"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareTelegram}
                    className="inline-flex items-center space-x-1.5 bg-[#0088cc] hover:bg-[#0077b5] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer border border-sky-400"
                  >
                    <span>Telegram</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer border border-slate-700"
                  >
                    <span>X (Twitter)</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* What 1 Referral Credit Unlocks (Same as Paid Pro ₹799) */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <LucideShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'te' ? '1 క్రెడిట్‌తో మీకు లభించే పూర్తి ఫీచర్లు (ప్రో ప్లాన్ సమానం):' : 'What You Get with 1 Referral Credit (Full Pro Access):'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <LucideCheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === 'te' ? 'అన్ని ఆటోమేటెడ్ కోడ్ ఫిక్సెస్ & స్నిప్పెట్స్' : 'All Automated Code Patches (SEO, Speed, Security)'}</span>
              </div>

              <div className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <LucideCheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === 'te' ? '1-క్లిక్ ఫిక్స్‌డ్ ZIP డౌన్‌లోడ్ & గిట్‌హబ్ PR' : '1-Click Fixed ZIP Bundle & GitHub PR'}</span>
              </div>

              <div className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <LucideCheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === 'te' ? 'గూగుల్ యాడ్‌సెన్స్ 100% అప్రూవల్ కిట్' : 'Google AdSense 100% Approval Kit'}</span>
              </div>

              <div className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <LucideCheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === 'te' ? 'లైవ్ రీ-స్కాన్ వెరిఫికేషన్ & VIP PDF రిపోర్ట్' : 'Live Re-Scan & VIP PDF Export'}</span>
              </div>
            </div>
          </div>

          {/* Unlocked Websites List */}
          {unlockedList.length > 0 && (
            <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <LucideGlobe className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'te' ? 'మీ అన్‌లాక్ చేయబడిన వెబ్‌సైట్‌లు:' : 'Your Unlocked Websites:'}</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {unlockedList.map((site, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-emerald-900 border-2 border-emerald-300 shadow-2xs"
                  >
                    <LucideCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate max-w-[200px]">{site}</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-100 px-1 py-0.2 rounded font-sans font-black">
                      PRO
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3 Step Simple Guide */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-0.5">
              <span className="font-black text-slate-900 block text-xs">1. Sign In / Share</span>
              <span className="text-slate-500 text-[10px]">Get your Gmail link</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-0.5">
              <span className="font-black text-slate-900 block text-xs">2. Friends Test</span>
              <span className="text-slate-500 text-[10px]">Run free audits</span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200 space-y-0.5">
              <span className="font-black text-emerald-900 block text-xs">3. Unlock Free</span>
              <span className="text-emerald-700 font-bold text-[10px]">+1 Pro Website Pass</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
