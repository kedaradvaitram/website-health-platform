import React, { useState, useEffect } from 'react';
import {
  Video,
  X,
  Calendar,
  Clock,
  Link as LinkIcon,
  Plus,
  Copy,
  Check,
  Share2,
  Lock,
  Globe,
  Sparkles,
  Users,
  MessageCircle,
  Mail,
  QrCode,
  ArrowRight,
  Shield,
  Play,
  CalendarCheck,
  Trash2,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FullAuditReport, Language, UserAccount } from '../types';

export interface ScheduledMeeting {
  id: string;
  roomId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  passcode: string;
  targetDomain?: string;
  createdAt: string;
  hostName: string;
  hostEmail: string;
}

interface LiveMeetingHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  activeReport?: FullAuditReport | null;
  onStartInstantMeeting: (roomId?: string, roomTitle?: string, passcode?: string) => void;
}

const STORAGE_KEY = 'healthsec_scheduled_meetings_v1';

export const LiveMeetingHubModal: React.FC<LiveMeetingHubModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  activeReport,
  onStartInstantMeeting,
}) => {
  // Navigation mode: 'hub' | 'schedule_form' | 'link_created'
  const [viewMode, setViewMode] = useState<'hub' | 'schedule_form' | 'link_created'>('hub');

  // Input to join existing meeting
  const [joinInputCode, setJoinInputCode] = useState<string>('');
  const [joinPinInput, setJoinPinInput] = useState<string>('');
  const [showJoinPin, setShowJoinPin] = useState<boolean>(false);

  // Scheduling Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [schedTitle, setSchedTitle] = useState<string>(
    activeReport ? `Security Review: ${activeReport.hostname}` : 'HealthSec Team Review'
  );
  const [schedDate, setSchedDate] = useState<string>(todayStr);
  const [schedTime, setSchedTime] = useState<string>('15:00');
  const [schedDuration, setSchedDuration] = useState<number>(30);
  const [schedDomain, setSchedDomain] = useState<string>(activeReport ? activeReport.hostname : 'example.com');
  const [schedPasscode, setSchedPasscode] = useState<string>(Math.floor(1000 + Math.random() * 9000).toString());
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState<boolean>(true);

  // Generated Link for "Create for Later"
  const [createdRoomId, setCreatedRoomId] = useState<string>('');
  const [createdPasscode, setCreatedPasscode] = useState<string>('');
  const [createdTitle, setCreatedTitle] = useState<string>('');
  const [createdDateInfo, setCreatedDateInfo] = useState<string>('');

  // Scheduled Meetings Store
  const [scheduledList, setScheduledList] = useState<ScheduledMeeting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sched-1',
        roomId: 'audit-sec-review',
        title: 'Weekly Production Security Audit',
        date: todayStr,
        time: '18:00',
        durationMinutes: 45,
        passcode: '8821',
        targetDomain: 'healthsec.live',
        createdAt: new Date().toISOString(),
        hostName: 'Security Lead',
        hostEmail: 'lead@healthsec.live',
      },
    ];
  });

  // Copy feedbacks
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduledList));
    } catch {}
  }, [scheduledList]);

  // Reset or update on open
  useEffect(() => {
    if (isOpen) {
      setViewMode('hub');
      if (activeReport) {
        setSchedDomain(activeReport.hostname);
        setSchedTitle(`Security Review: ${activeReport.hostname}`);
      }
    }
  }, [isOpen, activeReport]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai';

  const getMeetingUrl = (roomId: string, pin?: string) => {
    return `${origin}/?meet=${encodeURIComponent(roomId)}${pin ? `&pin=${pin}` : ''}`;
  };

  const handleCopy = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Instant Meeting Action
  const handleLaunchInstant = () => {
    const instantId = 'audit-' + Math.random().toString(36).substring(2, 7);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    onStartInstantMeeting(instantId, schedTitle || 'Instant Live War Room', pin);
    onClose();
  };

  // 2. Create Meeting for Later (Instant Link)
  const handleCreateMeetingForLater = () => {
    const newRoomId = 'audit-' + Math.random().toString(36).substring(2, 7);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const title = schedTitle || 'HealthSec Live Meeting';

    setCreatedRoomId(newRoomId);
    setCreatedPasscode(pin);
    setCreatedTitle(title);
    setCreatedDateInfo('Instant Shareable Link (Join Anytime)');

    const newMeeting: ScheduledMeeting = {
      id: 'sched-' + Date.now(),
      roomId: newRoomId,
      title,
      date: todayStr,
      time: 'Anytime',
      durationMinutes: 60,
      passcode: pin,
      targetDomain: schedDomain,
      createdAt: new Date().toISOString(),
      hostName: user.name || 'Host',
      hostEmail: user.email || '',
    };

    setScheduledList((prev) => [newMeeting, ...prev]);
    setViewMode('link_created');
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
  };

  // 3. Submit Scheduled Meeting
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim() || !schedDate || !schedTime) return;

    const newRoomId = 'sched-' + Math.random().toString(36).substring(2, 7);
    const pin = isPasscodeEnabled ? schedPasscode : '';

    const newMeeting: ScheduledMeeting = {
      id: 'sched-' + Date.now(),
      roomId: newRoomId,
      title: schedTitle.trim(),
      date: schedDate,
      time: schedTime,
      durationMinutes: schedDuration,
      passcode: pin,
      targetDomain: schedDomain,
      createdAt: new Date().toISOString(),
      hostName: user.name || 'Host',
      hostEmail: user.email || '',
    };

    setScheduledList((prev) => [newMeeting, ...prev]);
    setCreatedRoomId(newRoomId);
    setCreatedPasscode(pin);
    setCreatedTitle(schedTitle.trim());
    setCreatedDateInfo(`${schedDate} at ${schedTime} (${schedDuration} mins)`);
    setViewMode('link_created');
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
  };

  // 4. Join via code
  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    let code = joinInputCode.trim();
    if (!code) return;

    // Handle full URL pasted
    if (code.includes('?meet=')) {
      try {
        const url = new URL(code);
        const m = url.searchParams.get('meet');
        const p = url.searchParams.get('pin');
        if (m) code = m;
        if (p && !joinPinInput) setJoinPinInput(p);
      } catch {}
    }

    code = code.replace(/[^a-zA-Z0-9-_]/g, '');
    onStartInstantMeeting(code, `Live Meeting: ${code}`, joinPinInput || undefined);
    onClose();
  };

  const handleDeleteMeeting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScheduledList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      id="live-meeting-hub-modal"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-left">
        
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-600" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{lang === 'te' ? 'లైవ్ మీట్ డాష్‌బోర్డ్' : 'HealthSec Live Meet'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  Native In-App
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'te'
                  ? 'తక్షణ మీటింగ్ ప్రారంభించండి లేదా భవిష్యత్ తేదీ & సమయానికి షెడ్యూల్ చేసి ఇన్వైట్ లింక్ పొందండి.'
                  : 'Start an instant meeting, schedule for a specific date & time, or join with a code.'}
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

        {/* ========================================================= */}
        {/* VIEW 1: MAIN HUB (Instant, Schedule, Create Later & List) */}
        {/* ========================================================= */}
        {viewMode === 'hub' && (
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-thin">
            
            {/* Top 3 Core Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Action 1: Start Instant Meeting */}
              <button
                type="button"
                onClick={handleLaunchInstant}
                id="hub-start-instant-meet-btn"
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/60 hover:border-emerald-400 text-left transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/15 group cursor-pointer flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:rotate-6 transition-transform">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                    1-Click
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <span>{lang === 'te' ? 'తక్షణ మీటింగ్' : 'Instant Meeting'}</span>
                    <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                    {lang === 'te' ? 'ఇప్పుడే లైవ్ వీడియో రూమ్ ప్రారంభించండి' : 'Start a live meeting call right now'}
                  </p>
                </div>
              </button>

              {/* Action 2: Schedule Meeting for Later */}
              <button
                type="button"
                onClick={() => setViewMode('schedule_form')}
                id="hub-schedule-meet-btn"
                className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border-2 border-indigo-500/60 hover:border-indigo-400 text-left transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/15 group cursor-pointer flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase">
                    Date & Time
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                    <span>{lang === 'te' ? 'షెడ్యూల్ మీటింగ్' : 'Schedule Meeting'}</span>
                    <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                    {lang === 'te' ? 'తేదీ, సమయం సెట్ చేసి ఇన్వైట్ లింక్ పొందండి' : 'Pick date & time and invite team'}
                  </p>
                </div>
              </button>

              {/* Action 3: Create Meeting Link for Later */}
              <button
                type="button"
                onClick={handleCreateMeetingForLater}
                id="hub-create-link-later-btn"
                className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-900 border-2 border-cyan-500/60 hover:border-cyan-400 text-left transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-500/15 group cursor-pointer flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                    + Link
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                    <span>{lang === 'te' ? 'ఇన్వైట్ లింక్ క్రియేట్' : 'Create Meeting Link'}</span>
                    <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                    {lang === 'te' ? 'ఎప్పుడైనా జాయిన్ అవ్వగల లింక్ పొందండి' : 'Get a link you can share & join anytime'}
                  </p>
                </div>
              </button>

            </div>

            {/* Middle: Join with a code input bar */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {lang === 'te' ? 'కోడ్ లేదా లింక్‌తో జాయిన్ అవ్వండి' : 'Join an Existing Meeting'}
              </span>
              <form onSubmit={handleJoinWithCode} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={joinInputCode}
                    onChange={(e) => setJoinInputCode(e.target.value)}
                    placeholder="Enter meeting code or paste link (e.g. audit-war-room)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!joinInputCode.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
                >
                  {lang === 'te' ? 'జాయిన్ అవ్వండి' : 'Join Call'}
                </button>
              </form>
            </div>

            {/* Bottom: Scheduled Meetings List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'te' ? 'షెడ్యూల్ చేసిన మీటింగ్‌లు' : 'Your Scheduled & Saved Meetings'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {scheduledList.length} meetings
                </span>
              </div>

              {scheduledList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No scheduled meetings yet.</p>
                  <button
                    type="button"
                    onClick={() => setViewMode('schedule_form')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    + Schedule your first meeting
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {scheduledList.map((meet) => {
                    const fullUrl = getMeetingUrl(meet.roomId, meet.passcode);
                    const isCopied = copiedId === meet.id;

                    return (
                      <div
                        key={meet.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{meet.title}</h4>
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                              {meet.date} • {meet.time}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                            <span>
                              Room: <strong className="text-emerald-300">{meet.roomId}</strong>
                            </span>
                            {meet.passcode && (
                              <span>
                                PIN: <strong className="text-amber-300">{meet.passcode}</strong>
                              </span>
                            )}
                            {meet.targetDomain && (
                              <span className="text-cyan-400">({meet.targetDomain})</span>
                            )}
                          </div>
                        </div>

                        {/* Actions: Copy Link, Join, Delete */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => handleCopy(fullUrl, meet.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                            title="Copy Meeting Invite Link"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onStartInstantMeeting(meet.roomId, meet.title, meet.passcode);
                              onClose();
                            }}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Join</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteMeeting(meet.id, e)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                            title="Delete meeting"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SCHEDULE MEETING FORM (Pick Date & Time)          */}
        {/* ========================================================= */}
        {viewMode === 'schedule_form' && (
          <form onSubmit={handleSaveSchedule} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh] scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setViewMode('hub')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold"
              >
                ← {lang === 'te' ? 'వెనుకకు' : 'Back to Live Meet Hub'}
              </button>
              <span className="text-xs font-mono text-indigo-400 font-bold">
                {lang === 'te' ? 'కొత్త మీటింగ్ షెడ్యూలర్' : 'Meeting Scheduler'}
              </span>
            </div>

            {/* Topic Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {lang === 'te' ? 'మీటింగ్ పేరు / టాపిక్' : 'Meeting Topic / Title'} *
              </label>
              <input
                type="text"
                required
                value={schedTitle}
                onChange={(e) => setSchedTitle(e.target.value)}
                placeholder="e.g. Website Security & CSP Remediation Walkthrough"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Date & Time Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'te' ? 'తేదీ (Date)' : 'Date'} *</span>
                </label>
                <input
                  type="date"
                  required
                  value={schedDate}
                  min={todayStr}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'te' ? 'సమయం (Time)' : 'Time'} *</span>
                </label>
                <input
                  type="time"
                  required
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  {lang === 'te' ? 'వ్యవధి (Duration)' : 'Duration'}
                </label>
                <select
                  value={schedDuration}
                  onChange={(e) => setSchedDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={90}>1.5 Hours</option>
                </select>
              </div>

            </div>

            {/* Target Domain & Passcode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'te' ? 'టార్గెట్ డొమైన్' : 'Target Website Domain'}</span>
                </label>
                <input
                  type="text"
                  value={schedDomain}
                  onChange={(e) => setSchedDomain(e.target.value)}
                  placeholder="example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'te' ? 'సెక్యూరిటీ పిన్ (PIN)' : 'Passcode PIN'}</span>
                  </label>
                  <label className="text-[11px] text-slate-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPasscodeEnabled}
                      onChange={(e) => setIsPasscodeEnabled(e.target.checked)}
                      className="rounded text-indigo-500"
                    />
                    <span>Required</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={!isPasscodeEnabled}
                  value={schedPasscode}
                  onChange={(e) => setSchedPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                />
              </div>
            </div>

            {/* Submit Scheduling Button */}
            <div className="pt-3">
              <button
                type="submit"
                id="submit-schedule-meeting-btn"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-white font-black text-sm transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-95"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>
                  {lang === 'te'
                    ? 'మీటింగ్ షెడ్యూల్ చేయండి & ఇన్వైట్ లింక్ పొందండి'
                    : 'Schedule Meeting & Generate Shareable Link'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: LINK CREATED & SHARING DIALOG                     */}
        {/* ========================================================= */}
        {viewMode === 'link_created' && (
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh] scrollbar-thin text-left">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {lang === 'te' ? 'మీటింగ్ విజయవంతంగా షెడ్యూల్ చేయబడింది!' : 'Meeting Successfully Created!'}
                </h3>
                <p className="text-xs text-emerald-300">{createdDateInfo}</p>
              </div>
            </div>

            {/* Direct Link Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {lang === 'te' ? 'షేర్ చేయదగిన ఇన్వైట్ లింక్' : 'Shareable Meeting Link'}
              </label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700 rounded-xl p-2">
                <input
                  type="text"
                  readOnly
                  value={getMeetingUrl(createdRoomId, createdPasscode)}
                  className="bg-transparent text-xs font-mono text-emerald-300 flex-1 px-2 focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(getMeetingUrl(createdRoomId, createdPasscode), 'created-link')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {copiedId === 'created-link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'created-link' ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* WhatsApp / Email / Calendar Sharing Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🔒 HealthSec Live Meeting Invitation\nTopic: ${createdTitle}\nWhen: ${createdDateInfo}\nJoin here: ${getMeetingUrl(
                    createdRoomId,
                    createdPasscode
                  )}\nRoom: ${createdRoomId}${createdPasscode ? `\nPIN: ${createdPasscode}` : ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50 text-xs font-bold transition-all text-center cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Share</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Invitation: ${createdTitle}`
                )}&body=${encodeURIComponent(
                  `You are invited to a HealthSec Live Video Meeting.\n\nTopic: ${createdTitle}\nWhen: ${createdDateInfo}\n\nClick to join directly:\n${getMeetingUrl(
                    createdRoomId,
                    createdPasscode
                  )}\n\nRoom ID: ${createdRoomId}\nPIN: ${createdPasscode || 'None'}`
                )}`}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-indigo-950 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50 text-xs font-bold transition-all text-center cursor-pointer"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    createdTitle
                  )}&details=${encodeURIComponent(
                    `HealthSec Live Video Meeting:\n${getMeetingUrl(createdRoomId, createdPasscode)}`
                  )}&location=${encodeURIComponent(getMeetingUrl(createdRoomId, createdPasscode))}`;
                  window.open(googleCalUrl, '_blank');
                }}
                className="flex items-center justify-center space-x-1.5 p-3 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300 hover:bg-purple-900/50 text-xs font-bold transition-all text-center cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Google Calendar</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('hub')}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                ← {lang === 'te' ? 'మీటింగ్ జాబితాకు వెళ్ళండి' : 'Go to Meetings List'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onStartInstantMeeting(createdRoomId, createdTitle, createdPasscode);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer flex items-center space-x-1.5"
              >
                <Video className="w-4 h-4" />
                <span>{lang === 'te' ? 'ఇప్పుడే రూమ్‌లోకి వెళ్ళండి' : 'Join This Room Now'}</span>
              </button>
            </div>

          </div>
        )}

        {/* Modal Footer Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% In-Browser WebRTC • No external plugins needed</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
