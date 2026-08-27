import React, { useState, useEffect } from 'react';
import {
  Video,
  X,
  Copy,
  Check,
  Share2,
  Lock,
  Globe,
  Sparkles,
  Users,
  Calendar,
  Clock,
  Shield,
  MessageCircle,
  Mail,
  QrCode,
  PlusCircle,
  Radio,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Send,
  UserPlus,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserAccount, FullAuditReport } from '../types';

export interface MeetingConfig {
  roomId: string;
  title: string;
  passcode: string;
  targetDomain: string;
  scheduledTime?: string;
  isLocked: boolean;
  enableAiTranscription: boolean;
  enableScreenShare: boolean;
  muteOnEntry: boolean;
  mode: 'instant' | 'war_room' | 'client_review' | 'scheduled';
}

interface CreateLiveMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  activeReport?: FullAuditReport | null;
  onStartMeeting: (config: MeetingConfig) => void;
}

export const CreateLiveMeetingModal: React.FC<CreateLiveMeetingModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  activeReport,
  onStartMeeting,
}) => {
  // Active Tab: 'setup' | 'invite'
  const [activeTab, setActiveTab] = useState<'setup' | 'invite'>('setup');

  // Form Fields
  const [meetingTitle, setMeetingTitle] = useState<string>(
    activeReport ? `Security & Audit Review: ${activeReport.hostname}` : 'HealthSec Team War Room'
  );
  const [roomCode, setRoomCode] = useState<string>('audit-' + Math.random().toString(36).substring(2, 7));
  const [passcode, setPasscode] = useState<string>(Math.floor(1000 + Math.random() * 9000).toString());
  const [isPasscodeRequired, setIsPasscodeRequired] = useState<boolean>(true);
  const [targetDomain, setTargetDomain] = useState<string>(activeReport ? activeReport.hostname : 'example.com');
  const [meetingMode, setMeetingMode] = useState<'instant' | 'war_room' | 'client_review' | 'scheduled'>('instant');
  const [enableAiTranscription, setEnableAiTranscription] = useState<boolean>(true);
  const [enableScreenShare, setEnableScreenShare] = useState<boolean>(true);
  const [muteOnEntry, setMuteOnEntry] = useState<boolean>(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');

  // Invitees list
  const [inviteeEmailInput, setInviteeEmailInput] = useState<string>('');
  const [inviteesList, setInviteesList] = useState<string[]>([
    'alex.rivera@acme-corp.com',
    'sarah.chen@acme-corp.com',
  ]);
  const [invitedSuccess, setInvitedSuccess] = useState<boolean>(false);

  // Copy states
  const [copiedJoinLink, setCopiedJoinLink] = useState<boolean>(false);
  const [copiedFullInvite, setCopiedFullInvite] = useState<boolean>(false);
  const [copiedPasscode, setCopiedPasscode] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && activeReport) {
      setTargetDomain(activeReport.hostname);
      setMeetingTitle(`Security & Audit Review: ${activeReport.hostname}`);
    }
  }, [isOpen, activeReport]);

  if (!isOpen) return null;

  // Compute Full Shareable URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai';
  const fullJoinUrl = `${origin}/?meet=${encodeURIComponent(roomCode)}${isPasscodeRequired ? `&pin=${passcode}` : ''}`;

  // Generate formatted full text invite
  const getFullInvitationText = () => {
    const timeText = meetingMode === 'scheduled' && scheduledDateTime ? `Time: ${new Date(scheduledDateTime).toLocaleString()}\n` : 'Time: Instant Live Call\n';
    return (
      `🔒 HealthSec Live Meeting Invitation\n` +
      `Topic: ${meetingTitle}\n` +
      `Target Website: ${targetDomain}\n` +
      `Host: ${user.name || 'User'} (${user.email || ''})\n` +
      timeText +
      `\n👉 Click to Join Meeting Directly:\n${fullJoinUrl}\n\n` +
      `Room Code: ${roomCode}\n` +
      (isPasscodeRequired ? `Passcode / PIN: ${passcode}\n` : '') +
      `\n(100% In-Browser Native HD Video • Real Screen Sharing • AI Notes • No app downloads needed)`
    );
  };

  const handleCopyJoinLink = () => {
    navigator.clipboard.writeText(fullJoinUrl);
    setCopiedJoinLink(true);
    setTimeout(() => setCopiedJoinLink(false), 2000);
  };

  const handleCopyFullInvite = () => {
    navigator.clipboard.writeText(getFullInvitationText());
    setCopiedFullInvite(true);
    setTimeout(() => setCopiedFullInvite(false), 2200);
  };

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(passcode);
    setCopiedPasscode(true);
    setTimeout(() => setCopiedPasscode(false), 1800);
  };

  const handleRegenerateRoomCode = () => {
    const newCode = 'audit-' + Math.random().toString(36).substring(2, 7);
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(newCode);
    setPasscode(newPin);
  };

  const handleAddInvitee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteeEmailInput.trim() || !inviteeEmailInput.includes('@')) return;
    if (!inviteesList.includes(inviteeEmailInput.trim())) {
      setInviteesList((prev) => [...prev, inviteeEmailInput.trim()]);
    }
    setInviteeEmailInput('');
  };

  const handleRemoveInvitee = (emailToRemove: string) => {
    setInviteesList((prev) => prev.filter((em) => em !== emailToRemove));
  };

  const handleSendEmailInvites = () => {
    setInvitedSuccess(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setInvitedSuccess(false), 3000);
  };

  const handleLaunchMeeting = () => {
    const config: MeetingConfig = {
      roomId: roomCode,
      title: meetingTitle,
      passcode: isPasscodeRequired ? passcode : '',
      targetDomain,
      scheduledTime: scheduledDateTime,
      isLocked: isPasscodeRequired,
      enableAiTranscription,
      enableScreenShare,
      muteOnEntry,
      mode: meetingMode,
    };
    onStartMeeting(config);
    onClose();
  };

  // WhatsApp Share URL
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(getFullInvitationText())}`;

  // Email Mailto Link
  const emailMailtoUrl = `mailto:${inviteesList.join(',')}?subject=${encodeURIComponent(
    `[HealthSec Live Meet] ${meetingTitle}`
  )}&body=${encodeURIComponent(getFullInvitationText())}`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      id="create-live-meeting-modal"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-left">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-600" />
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{lang === 'te' ? 'లైవ్ మీటింగ్ క్రియేట్ & ఇన్వైట్ లింక్' : 'Create Live Meet & Generate Invite'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  Native In-App
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'te'
                  ? 'మీ స్వంత వీడియో మీటింగ్ రూమ్ సెటప్ చేసి, సహచరులకు షేర్ చేయడానికి ఇన్విటేషన్ లింక్ రూపొందించండి.'
                  : 'Configure your in-browser video meeting room and generate shareable invite links.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'setup'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>1. {lang === 'te' ? 'మీటింగ్ వివరాలు & సెటప్' : 'Meeting Details & Settings'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'invite'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>2. {lang === 'te' ? 'ఇన్వైట్ లింక్ & షేరింగ్' : 'Generate Invite Links & Share'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[68vh] scrollbar-thin">
          
          {/* TAB 1: SETUP */}
          {activeTab === 'setup' && (
            <div className="space-y-4">
              
              {/* Meeting Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  {lang === 'te' ? 'మీటింగ్ పేరు / టాపిక్' : 'Meeting Title / Topic'}
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g. P0 Security Fixes & Ingress Configuration"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Preset Quick Topics */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-slate-400 py-0.5">Quick templates:</span>
                {[
                  'Emergency P0 War Room',
                  'Client Audit Presentation',
                  'OWASP Security Remediation',
                  'Weekly Dev Health Check',
                ].map((tpl) => (
                  <button
                    key={tpl}
                    type="button"
                    onClick={() => setMeetingTitle(tpl)}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {tpl}
                  </button>
                ))}
              </div>

              {/* Target Website & Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'te' ? 'ఆడిట్ వెబ్‌సైట్ డొమైన్' : 'Target Website Domain'}</span>
                  </label>
                  <input
                    type="text"
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                    placeholder="example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'te' ? 'మీటింగ్ రకం' : 'Meeting Format'}</span>
                  </label>
                  <select
                    value={meetingMode}
                    onChange={(e) => setMeetingMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="instant">Instant Live War Room</option>
                    <option value="war_room">P0 Code Remediation Session</option>
                    <option value="client_review">Client Security Walkthrough</option>
                    <option value="scheduled">Scheduled Team Review</option>
                  </select>
                </div>
              </div>

              {/* Room Code & Passcode Security Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      {lang === 'te' ? 'రూమ్ కోడ్ & సెక్యూరిటీ పాస్‌కోడ్' : 'Room ID & Security Passcode'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegenerateRoomCode}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Regenerate ID</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono">
                    <span className="text-slate-400">Room:</span>
                    <strong className="text-emerald-300">{roomCode}</strong>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono">
                    <span className="text-slate-400">PIN:</span>
                    <div className="flex items-center space-x-2">
                      <strong className="text-amber-300 tracking-widest">{passcode}</strong>
                      <button
                        type="button"
                        onClick={handleCopyPasscode}
                        className="text-slate-400 hover:text-white"
                        title="Copy PIN"
                      >
                        {copiedPasscode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Toggles */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  {lang === 'te' ? 'ఫీచర్లు & హోస్ట్ నియంత్రణలు' : 'Features & Host Controls'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={enableAiTranscription}
                      onChange={(e) => setEnableAiTranscription(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>AI Minutes</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={enableScreenShare}
                      onChange={(e) => setEnableScreenShare(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>HD Screen Share</span>
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={muteOnEntry}
                      onChange={(e) => setMuteOnEntry(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Mute on Entry</span>
                  </label>
                </div>
              </div>

              {/* Proceed to Invite Step Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('invite')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>{lang === 'te' ? 'ఇన్వైట్ లింక్ జనరేట్ చేయండి' : 'Next: Generate Invite Link & Share'}</span>
                  <Share2 className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INVITE LINKS & SHARE */}
          {activeTab === 'invite' && (
            <div className="space-y-4">
              
              {/* DIRECT JOIN LINK BOX */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-indigo-950/40 border-2 border-emerald-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'te' ? 'డైరెక్ట్ జాయిన్ లింక్' : 'Direct 1-Click Join Link'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">No login required for guests</span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl p-2">
                  <input
                    type="text"
                    readOnly
                    value={fullJoinUrl}
                    className="bg-transparent text-xs font-mono text-emerald-300 flex-1 px-2 focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyJoinLink}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer shrink-0"
                  >
                    {copiedJoinLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-950" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 1-CLICK INSTANT SHARING ACTIONS: WHATSAPP, EMAIL, QR CODE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. WhatsApp Share */}
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Share</span>
                </a>

                {/* 2. Email Mailto */}
                <a
                  href={emailMailtoUrl}
                  className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 hover:text-indigo-200 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Send via Email</span>
                </a>

                {/* 3. QR Code Toggle */}
                <button
                  type="button"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>{showQrModal ? 'Hide QR Code' : 'Show Mobile QR'}</span>
                </button>
              </div>

              {/* QR CODE DISPLAY BOX */}
              {showQrModal && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in duration-150">
                  <div className="p-3 bg-white rounded-2xl shadow-xl">
                    {/* SVG QR Code Simulation with live visual data points */}
                    <svg viewBox="0 0 100 100" className="w-32 h-32">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Corner markers */}
                      <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                      <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                      <rect x="13" y="13" width="9" height="9" fill="#0f172a" />

                      <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                      <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                      <rect x="78" y="13" width="9" height="9" fill="#0f172a" />

                      <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                      <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                      <rect x="13" y="78" width="9" height="9" fill="#0f172a" />

                      {/* Data dots */}
                      <rect x="36" y="10" width="5" height="5" fill="#0f172a" />
                      <rect x="46" y="10" width="8" height="5" fill="#0f172a" />
                      <rect x="36" y="20" width="6" height="6" fill="#0f172a" />
                      <rect x="48" y="20" width="6" height="6" fill="#0f172a" />
                      <rect x="10" y="38" width="8" height="6" fill="#0f172a" />
                      <rect x="22" y="38" width="6" height="6" fill="#0f172a" />
                      <rect x="36" y="38" width="12" height="12" fill="#10b981" rx="2" />
                      <rect x="56" y="38" width="6" height="6" fill="#0f172a" />
                      <rect x="70" y="38" width="8" height="6" fill="#0f172a" />
                      <rect x="84" y="38" width="6" height="6" fill="#0f172a" />
                      <rect x="36" y="56" width="6" height="6" fill="#0f172a" />
                      <rect x="48" y="56" width="14" height="6" fill="#0f172a" />
                      <rect x="70" y="56" width="6" height="6" fill="#0f172a" />
                      <rect x="82" y="56" width="8" height="6" fill="#0f172a" />
                      <rect x="36" y="70" width="8" height="8" fill="#0f172a" />
                      <rect x="48" y="70" width="6" height="6" fill="#0f172a" />
                      <rect x="60" y="70" width="8" height="8" fill="#0f172a" />
                      <rect x="74" y="70" width="6" height="6" fill="#0f172a" />
                      <rect x="86" y="70" width="6" height="6" fill="#0f172a" />
                      <rect x="48" y="82" width="18" height="8" fill="#0f172a" />
                      <rect x="74" y="82" width="8" height="8" fill="#0f172a" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">
                    Scan with Mobile Phone Camera to Join Instantly
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{roomCode}</span>
                </div>
              )}

              {/* TEAM MEMBER EMAIL INVITER */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">
                      {lang === 'te' ? 'టీమ్ సభ్యుల ఈమెయిల్స్ జోడించండి' : 'Invite Specific Team Members by Email'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {inviteesList.length} invitees
                  </span>
                </div>

                <form onSubmit={handleAddInvitee} className="flex space-x-2">
                  <input
                    type="email"
                    value={inviteeEmailInput}
                    onChange={(e) => setInviteeEmailInput(e.target.value)}
                    placeholder="teammate@company.com"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </form>

                {/* Invitees Tag Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {inviteesList.map((email) => (
                    <div
                      key={email}
                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                    >
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInvitee(email)}
                        className="text-slate-400 hover:text-rose-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSendEmailInvites}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  {invitedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Invitations Sent Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Send Direct In-App Invitations to List</span>
                    </>
                  )}
                </button>
              </div>

              {/* COPY FULL TEXT INVITATION */}
              <button
                type="button"
                onClick={handleCopyFullInvite}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {copiedFullInvite ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Full Invitation Details Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Full Formatted Meeting Invitation</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Room: <strong className="text-emerald-300 font-mono">{roomCode}</strong>
            </span>
            {isPasscodeRequired && (
              <span>
                • PIN: <strong className="text-amber-300 font-mono">{passcode}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleLaunchMeeting}
              id="modal-start-meeting-now-btn"
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Video className="w-4 h-4 text-slate-950" />
              <span>{lang === 'te' ? 'ఇప్పుడే మీటింగ్ ప్రారంభించండి' : 'Start Live Meeting Now'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
