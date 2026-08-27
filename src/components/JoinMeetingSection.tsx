import React, { useState } from 'react';
import {
  Video,
  Users,
  Copy,
  Check,
  Shield,
  Sparkles,
  Radio,
  Mic,
  MonitorUp,
  Code2,
  Lock,
  PlusCircle,
  LogIn,
  Layers,
  FileCheck,
  Share2,
  QrCode,
  MessageCircle,
  Mail,
  UserPlus,
} from 'lucide-react';
import { FullAuditReport, Language, UserAccount } from '../types';

interface JoinMeetingSectionProps {
  lang: Language;
  user: UserAccount;
  activeReport?: FullAuditReport | null;
  onOpenEmbeddedMeet?: () => void;
  onOpenTeamWorkspace?: () => void;
  onOpenCreateMeetingModal?: () => void;
}

export const JoinMeetingSection: React.FC<JoinMeetingSectionProps> = ({
  lang,
  user,
  activeReport,
  onOpenEmbeddedMeet,
  onOpenTeamWorkspace,
  onOpenCreateMeetingModal,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [customRoomCode, setCustomRoomCode] = useState<string>('whs-war-room');
  const [isGeneratingNewCode, setIsGeneratingNewCode] = useState<boolean>(false);

  const getFullShareableUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai';
    return `${origin}/?meet=${encodeURIComponent(customRoomCode)}`;
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(getFullShareableUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const handleGenerateNewRoom = () => {
    setIsGeneratingNewCode(true);
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    setCustomRoomCode(`audit-${randomSuffix}`);
    setTimeout(() => {
      setIsGeneratingNewCode(false);
    }, 400);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🔒 HealthSec Live Meet Invitation\nRoom: ${customRoomCode}\nJoin here: ${getFullShareableUrl()}\n(100% In-Browser HD Video & Screen Share)`
  )}`;

  return (
    <section
      id="live-meeting-collaboration-section"
      className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 p-6 sm:p-8 shadow-2xl transition-all"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Column: Heading, Badges, Context Description */}
        <div className="space-y-3.5 max-w-2xl text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-xs font-black font-mono uppercase tracking-wider shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'te' ? 'మన స్వంత లైవ్ మీటింగ్' : 'Native In-App Video Meet'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>WebRTC 1080p HD (No External Apps)</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono">
              <Lock className="w-3 h-3 text-indigo-400" />
              <span>P2P Encrypted</span>
            </span>

            {activeReport && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span className="truncate max-w-[150px]">{activeReport.hostname}</span>
                <span className="text-emerald-300 font-bold">({activeReport.overallScore}/100)</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>
              {lang === 'te'
                ? 'స్వంత వీడియో కాన్ఫరెన్స్ & ఆడిట్ వార్ రూమ్'
                : 'HealthSec Live Meet & War Room'}
            </span>
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'te'
              ? 'బయటి యాప్స్ (Google Meet / Zoom) అవసరం లేకుండా, నేరుగా మన వెబ్‌సైట్‌లోనే లైవ్ వీడియో కాల్, స్క్రీన్ షేర్, AI మీటింగ్ నోట్స్ మరియు ఆడిట్ రిపోర్ట్ పరిష్కారాలను బృందంతో కలిసి రియల్-టైమ్‌లో పూర్తి చేయండి. కొత్త మీటింగ్ క్రియేట్ చేసి వాట్సాప్/ఈమెయిల్ ఇన్వైట్ లింక్‌ను పంపవచ్చు.'
              : 'Our native in-browser video meeting platform built directly for security engineers and developers. Zero downloads or third-party meeting redirects needed. Includes multi-party HD video, real screen sharing, live chat with code snippets, AI meeting minutes, and 1-click Auto-Fix.'}
          </p>

          {/* Quick Features Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Instant 1-Click Call</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <MonitorUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Live Screen Share</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Pair Code Fixes</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">AI Action Items</span>
            </div>
          </div>
        </div>

        {/* Right Column: Room Controls, 1-Click Launch Button & Share */}
        <div className="w-full lg:w-auto flex flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          
          {/* PRIMARY ACTION: Opens OUR OWN IN-APP Video & Scheduler Hub */}
          <button
            type="button"
            onClick={onOpenEmbeddedMeet}
            id="start-native-live-meeting-btn"
            className="w-full sm:w-80 inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 border-2 border-emerald-300 group cursor-pointer"
            title="Launch Live Meet: Instant Call, Schedule Date/Time, or Share Link"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
              <Video className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-extrabold text-sm sm:text-base leading-tight">
                {lang === 'te' ? 'లైవ్ మీట్ & షెడ్యూలర్' : 'Open Live Meet & Schedule'}
              </span>
              <span className="text-emerald-200 text-[10px] font-mono font-medium">
                {lang === 'te' ? 'తక్షణ కాల్ • తేదీ & సమయం షెడ్యూల్ • ఇన్వైట్ లింక్' : 'Instant • Schedule Date/Time • Invite Link'}
              </span>
            </div>
            <LogIn className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform ml-auto" />
          </button>

          {/* Quick Schedule & Link Buttons Row */}
          <div className="grid grid-cols-2 gap-2 w-full sm:w-80">
            <button
              type="button"
              onClick={onOpenEmbeddedMeet}
              id="quick-schedule-meet-btn"
              className="px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'te' ? 'షెడ్యూల్ మీటింగ్' : 'Schedule Meet'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              id="copy-native-meet-link-btn"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              title="Copy Native Meeting Room URL"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">{lang === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'te' ? 'లింక్ కాపీ' : 'Copy Link'}</span>
                </>
              )}
            </button>
          </div>

          {/* WhatsApp Share & Team Space Row */}
          <div className="flex items-center gap-2 w-full sm:w-80 justify-between">
            {/* WhatsApp Share */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Share Room on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Invite</span>
            </a>

            {/* Team Space */}
            {onOpenTeamWorkspace && (
              <button
                type="button"
                onClick={onOpenTeamWorkspace}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1"
                title="Open Team Workspace"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'te' ? 'టీమ్ స్పేస్' : 'Workspace'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full sm:w-80 text-[11px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Server Active
            </span>
            <span>
              Room: <strong className="text-white">{customRoomCode}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
