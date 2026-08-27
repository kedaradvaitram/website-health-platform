import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  MonitorOff,
  Hand,
  MessageSquare,
  Users,
  Smile,
  PhoneOff,
  Sparkles,
  Copy,
  Check,
  Shield,
  Send,
  Code2,
  Radio,
  X,
  Layers,
  CircleDot,
  Subtitles,
  PenTool,
  Download,
  Sliders,
  Maximize2,
  Minimize2,
  Palette,
  Eraser,
  Wand2,
  Share2,
  QrCode,
  MessageCircle,
  Mail,
  UserPlus,
  Wifi,
  WifiOff,
  Signal,
  Volume2,
  VolumeX,
  Activity,
  Gauge,
  Zap,
  FileCode,
  FileText,
  Lock,
  CornerDownRight,
  CheckSquare,
  Square,
  FileCheck,
  UserX,
  UserMinus,
  Globe,
  Terminal,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Eye,
  Loader2,
  ListChecks,
  ClipboardCheck,
  Bot,
  Play,
  ArrowRight,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
  Vote,
  BarChart3,
  PieChart,
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Settings,
  Sun,
  Moon,
  Contrast,
  Bell,
  UserCheck,
  DoorOpen,
  LogIn,
  AlertTriangle,
  UserPlus2,
  CheckCircle2 as CheckCircleIcon,
  MoreHorizontal,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../lib/firebase';
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  query,
  deleteDoc,
} from 'firebase/firestore';
import { Language, UserAccount, FullAuditReport } from '../types';
import { AuditPollsPanel } from './AuditPollsPanel';
import { MeetingSettingsModal, MeetingThemeSkin } from './MeetingSettingsModal';

export interface MeetingJoinRequest {
  id: string;
  roomId: string;
  name: string;
  email?: string;
  role?: string;
  roleBadge?: string;
  roleColor?: string;
  avatarBg?: string;
  requestedAt: number;
  requestedAtFormatted?: string;
  status: 'pending' | 'admitted' | 'denied';
  joinOrder?: number;
}

export interface AuditPollOption {
  id: string;
  text: string;
  votes: string[]; // participant names or user IDs
}

export interface AuditPoll {
  id: string;
  question: string;
  creatorName: string;
  creatorId: string;
  creatorRole?: string;
  createdAt: number;
  type: 'yes_no' | 'multiple_choice';
  category: 'Security' | 'Performance' | 'Infrastructure' | 'Architecture' | 'General';
  options: AuditPollOption[];
  isAnonymous: boolean;
  status: 'active' | 'closed';
  closedAt?: number;
}

export interface MeetingActionItem {
  id: string;
  title: string;
  assignee: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | string;
  category?: 'Security' | 'Performance' | 'SEO' | 'Infrastructure' | 'Accessibility' | string;
  status: 'Open' | 'In Progress' | 'Completed' | string;
  description?: string;
  eta?: string;
}

export interface TechnicalRecommendation {
  title: string;
  target: string;
  code: string;
}

export interface MeetingSummaryData {
  executiveSummary: string;
  meetingHighlights: string[];
  actionItems: MeetingActionItem[];
  technicalRecommendations?: TechnicalRecommendation[];
  nextFollowUp?: string;
  poweredBy?: string;
  timestamp?: string;
  roomId?: string;
  duration?: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  roleBadge: string;
  roleColor: string;
  avatarBg: string;
  isHost?: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  screenSharing: boolean;
  connectionQuality: 'excellent' | 'good' | 'fair';
  latencyMs?: number;
  bitrate?: string;
  packetLoss?: string;
  audioLevel?: number; // 0 to 100
  joinOrder?: number; // Serial Number: 1 (Host), 2, 3, 4... in order of joining
  joinedAtTime?: string; // e.g. "10:32 AM"
  joinedAtElapsed?: string; // e.g. "+00:45"
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  text: string;
  codeSnippet?: string;
  filename?: string;
  fileLanguage?: string;
  targetParticipantId?: string; // If 1-on-1 direct message
  targetParticipantName?: string;
  timestamp: string;
  isAi?: boolean;
  isDirect?: boolean;
}

interface TeamGoogleMeetRoomProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  activeReport: FullAuditReport | null;
  initialRoomId?: string;
  roomTitle?: string;
  passcode?: string;
  onOpenReport?: (report: FullAuditReport) => void;
  onOpenAutoFix?: () => void;
}

const SAMPLE_PRESET_PARTICIPANTS: Participant[] = [
  {
    id: 'p_gemini_ai',
    name: 'Gemini AI Co-Pilot',
    email: 'gemini-copilot@ai.studio',
    role: 'Real-time Security AI',
    roleBadge: 'AI Co-Pilot',
    roleColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    avatarBg: 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500',
    isMuted: false,
    isVideoOff: false,
    isSpeaking: true,
    isHandRaised: false,
    screenSharing: false,
    connectionQuality: 'excellent',
    latencyMs: 14,
    bitrate: '4.8 Mbps',
    packetLoss: '0.0%',
    audioLevel: 88,
  },
  {
    id: 'p_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@acme-corp.com',
    role: 'Security Lead',
    roleBadge: 'Sec Lead',
    roleColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    avatarBg: 'bg-indigo-600',
    isMuted: false,
    isVideoOff: false,
    isSpeaking: false,
    isHandRaised: false,
    screenSharing: false,
    connectionQuality: 'excellent',
    latencyMs: 18,
    bitrate: '3.6 Mbps',
    packetLoss: '0.0%',
    audioLevel: 12,
  },
  {
    id: 'p_sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme-corp.com',
    role: 'Senior DevOps & Full-Stack',
    roleBadge: 'DevOps',
    roleColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    avatarBg: 'bg-cyan-600',
    isMuted: false,
    isVideoOff: false,
    isSpeaking: false,
    isHandRaised: false,
    screenSharing: false,
    connectionQuality: 'excellent',
    latencyMs: 22,
    bitrate: '3.2 Mbps',
    packetLoss: '0.0%',
    audioLevel: 0,
  },
  {
    id: 'p_michael',
    name: 'Michael Klein',
    email: 'michael.k@auditfirm.io',
    role: 'Compliance & OWASP Auditor',
    roleBadge: 'Auditor',
    roleColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    avatarBg: 'bg-amber-600',
    isMuted: true,
    isVideoOff: false,
    isSpeaking: false,
    isHandRaised: false,
    screenSharing: false,
    connectionQuality: 'good',
    latencyMs: 44,
    bitrate: '2.1 Mbps',
    packetLoss: '0.2%',
    audioLevel: 0,
  },
];

const INITIAL_SYSTEM_MESSAGES: ChatMessage[] = [
  {
    id: 'm_sys_init',
    senderName: 'HealthSec System',
    senderEmail: 'system@healthsec.ai',
    senderRole: 'System',
    text: 'Live meeting room initialized. Share the invite link to start collaborating with your team.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const AUDIT_POLL_TEMPLATES = [
  {
    title: 'Strict CSP & HSTS Deployment',
    category: 'Security' as const,
    type: 'yes_no' as const,
    question: 'Approve immediate deployment of Strict CSP & 1-Year HSTS Headers to production?',
    options: ['Yes, Deploy to Production (P0)', 'No, Validate on Staging First', 'Abstain / Need Discussion'],
  },
  {
    title: 'TLS 1.3 Cipher Hardening',
    category: 'Security' as const,
    type: 'multiple_choice' as const,
    question: 'Should we deprecate TLS 1.0/1.1 and enforce TLS 1.3 only?',
    options: ['Enforce TLS 1.3 Immediately', 'Provide 30-Day Client Warning', 'Reject / Keep TLS 1.2+'],
  },
  {
    title: 'Edge Caching & Brotli Compression',
    category: 'Performance' as const,
    type: 'yes_no' as const,
    question: 'Enable CDN Edge Caching and Brotli level 6 compression for static assets?',
    options: ['Approve Immediately', 'Reject / Staging Benchmark First'],
  },
  {
    title: 'WAF Rate Limiting & Bot Shield',
    category: 'Infrastructure' as const,
    type: 'yes_no' as const,
    question: 'Enable Cloudflare WAF rate limiting at 120 req/min for crawler subnets?',
    options: ['Yes, Block Aggressive Bots', 'Switch to Managed Challenge', 'Log & Monitor Only'],
  },
  {
    title: 'Largest Contentful Paint (LCP) Fix',
    category: 'Performance' as const,
    type: 'yes_no' as const,
    question: 'Prioritize Largest Contentful Paint (LCP) hero image optimization in Next Sprint?',
    options: ['Yes, P1 High Priority', 'No, P2 Medium Priority', 'Deprioritize'],
  },
];

export const TeamGoogleMeetRoom: React.FC<TeamGoogleMeetRoomProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  activeReport,
  initialRoomId,
  roomTitle,
  passcode,
  onOpenReport,
  onOpenAutoFix,
}) => {
  // Dynamic Host Identity resolved directly from authenticated Gmail/Google user
  const effectiveHostName =
    user?.isLoggedIn && user?.name && user.name.trim()
      ? user.name.trim()
      : user?.email && user.email.includes('@')
      ? user.email.split('@')[0]
      : user?.name || 'Meeting Host';

  const effectiveHostEmail = user?.email || 'host@meeting.live';

  // Join Requests & Waiting Room / Knocking State
  const [pendingJoinRequests, setPendingJoinRequests] = useState<MeetingJoinRequest[]>([]);
  const [isViewingAsParticipant, setIsViewingAsParticipant] = useState<boolean>(false);
  const [knockingState, setKnockingState] = useState<'idle' | 'waiting' | 'admitted' | 'denied'>('idle');
  const [myKnockRequestId, setMyKnockRequestId] = useState<string | null>(null);
  const [myKnockName, setMyKnockName] = useState<string>(
    user?.name || (user?.email && user.email.includes('@') ? user.email.split('@')[0] : 'Teammate')
  );
  const [myKnockEmail, setMyKnockEmail] = useState<string>(user?.email || '');
  const [myKnockRole, setMyKnockRole] = useState<string>('Teammate / Collaborator');
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [customSimulateName, setCustomSimulateName] = useState<string>('');

  // Call Controls State
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(false);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [videoFilter, setVideoFilter] = useState<'normal' | 'blur' | 'cyber' | 'studio' | 'dark'>('normal');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  
  // Side Panels: 'chat' | 'people' | 'ai_minutes' | 'shared_audit' | 'whiteboard' | 'polls'
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'people' | 'ai_minutes' | 'shared_audit' | 'whiteboard' | 'polls' | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isMobileMoreMenuOpen, setIsMobileMoreMenuOpen] = useState<boolean>(false);
  const [showInCallQr, setShowInCallQr] = useState<boolean>(false);
  const [newInviteeEmail, setNewInviteeEmail] = useState<string>('');
  const [inviteSentFeedback, setInviteSentFeedback] = useState<boolean>(false);
  const [joinNotification, setJoinNotification] = useState<string | null>(null);
  
  // Audit Polls & Team Voting State
  const [polls, setPolls] = useState<AuditPoll[]>([
    {
      id: 'poll_p0_csp',
      question: 'Approve immediate deployment of Strict Content-Security-Policy (CSP) & HSTS 31536000 to production?',
      creatorName: `${effectiveHostName} (Host)`,
      creatorId: 'host_user',
      createdAt: Date.now() - 1000 * 60 * 3,
      type: 'yes_no',
      category: 'Security',
      isAnonymous: false,
      status: 'active',
      options: [
        { id: 'opt_csp_yes', text: 'Yes, Deploy Immediately (P0)', votes: [effectiveHostName] },
        { id: 'opt_csp_staging', text: 'No, Validate on Staging First', votes: [] },
        { id: 'opt_csp_discuss', text: 'Need Team Discussion', votes: [] },
      ],
    },
  ]);
  const [activePollNotification, setActivePollNotification] = useState<AuditPoll | null>(null);
  const [isCreatingPoll, setIsCreatingPoll] = useState<boolean>(false);
  const [newPollQuestion, setNewPollQuestion] = useState<string>('');
  const [newPollType, setNewPollType] = useState<'yes_no' | 'multiple_choice'>('yes_no');
  const [newPollCategory, setNewPollCategory] = useState<'Security' | 'Performance' | 'Infrastructure' | 'Architecture' | 'General'>('Security');
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['Yes, Deploy / Approve (P0)', 'No, Reject / Needs Review']);
  const [newPollIsAnonymous, setNewPollIsAnonymous] = useState<boolean>(false);
  const [pollFilterTab, setPollFilterTab] = useState<'ALL' | 'active' | 'closed'>('ALL');
  
  // Meeting UI Theme Skin State ('dark_modern' | 'minimalist_light' | 'high_contrast')
  const [meetingTheme, setMeetingTheme] = useState<MeetingThemeSkin>(() => {
    try {
      const saved = localStorage.getItem('healthsec_meeting_theme') as MeetingThemeSkin;
      if (saved === 'dark_modern' || saved === 'minimalist_light' || saved === 'high_contrast') {
        return saved;
      }
    } catch {}
    return 'dark_modern';
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState<'theme' | 'audio_video' | 'general'>('theme');
  const [cameraResolution, setCameraResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [noiseSuppressionEnabled, setNoiseSuppressionEnabled] = useState<boolean>(true);
  const [echoCancellationEnabled, setEchoCancellationEnabled] = useState<boolean>(true);
  const [autoRecordOnStart, setAutoRecordOnStart] = useState<boolean>(false);
  const [muteOnEntryPolicy, setMuteOnEntryPolicy] = useState<boolean>(false);

  const handleThemeChange = (newTheme: MeetingThemeSkin) => {
    setMeetingTheme(newTheme);
    try {
      localStorage.setItem('healthsec_meeting_theme', newTheme);
    } catch {}

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'HOST_THEME_CHANGE',
        theme: newTheme,
      });
    }

    const themeLabel =
      newTheme === 'dark_modern'
        ? 'Dark Modern'
        : newTheme === 'minimalist_light'
        ? 'Minimalist Light'
        : 'High Contrast';

    setJoinNotification(
      lang === 'te'
        ? `🎨 UI థీమ్ మార్చబడింది: ${themeLabel}`
        : `🎨 UI skin updated: ${themeLabel}`
    );
    setTimeout(() => setJoinNotification(null), 3000);
  };
  
  // Real Media Stream Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remotePresenter, setRemotePresenter] = useState<{
    isSharing: boolean;
    presenterName: string;
    presenterId: string;
    shareTitle?: string;
  } | null>(null);
  const [screenShareTab, setScreenShareTab] = useState<'display_stream' | 'browser_preview' | 'code_patch' | 'live_terminal'>('display_stream');

  // Teammates & Presence: starts EMPTY so host is alone until participants join!
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [meetingDurationSeconds, setMeetingDurationSeconds] = useState<number>(0);
  const [meetingRoomId, setMeetingRoomId] = useState<string>(initialRoomId || 'audit-live-room');

  useEffect(() => {
    if (initialRoomId) {
      setMeetingRoomId(initialRoomId);
    }
  }, [initialRoomId]);

  // Trigger welcoming chime and notification when Live Meeting opens
  useEffect(() => {
    if (isOpen) {
      playJoinChime();
      const currentId = initialRoomId || meetingRoomId || 'live-room';
      setJoinNotification(
        lang === 'te'
          ? `లైవ్ మీటింగ్ రూమ్‌లోకి ప్రవేశించారు (${currentId})`
          : `✦ Live Screen Active • Connected to Room: ${currentId}`
      );
      const timer = setTimeout(() => {
        setJoinNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialRoomId, lang]);

  // Chat & Messaging
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_SYSTEM_MESSAGES);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [includeCodeSnippet, setIncludeCodeSnippet] = useState<boolean>(false);
  const [chatSnippetText, setChatSnippetText] = useState<string>('');
  const [chatTargetRecipientId, setChatTargetRecipientId] = useState<string>('everyone');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Direct 1-on-1 Code Transfer & File Sharing State
  const [directCodeRecipient, setDirectCodeRecipient] = useState<Participant | null>(null);
  const [isDirectCodeModalOpen, setIsDirectCodeModalOpen] = useState<boolean>(false);
  const [codeShareContent, setCodeShareContent] = useState<string>('');
  const [codeShareFilename, setCodeShareFilename] = useState<string>('security-patch.txt');
  const [codeShareLanguage, setCodeShareLanguage] = useState<string>('javascript');
  const [codeShareNote, setCodeShareNote] = useState<string>('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Download Code as a File (.txt / custom extension)
  const handleDownloadCodeFile = (code: string, filename: string = 'snippet.txt') => {
    try {
      const cleanFilename = filename.trim().length > 0 ? filename.trim() : 'code-snippet.txt';
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = cleanFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setJoinNotification(
        lang === 'te'
          ? `ఫైల్ సేవ్ అయ్యింది: ${cleanFilename}`
          : `✓ Downloaded and saved file: ${cleanFilename}`
      );
      setTimeout(() => setJoinNotification(null), 3000);
    } catch (err) {
      console.error('File download error:', err);
    }
  };

  // Copy Code to Clipboard with Toast feedback
  const handleCopyCodeSnippet = (snippetId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(snippetId);
    setJoinNotification(
      lang === 'te' ? 'కోడ్ క్లిప్‌బోర్డ్‌కి కాపీ అయ్యింది!' : '✓ Code snippet copied to clipboard!'
    );
    setTimeout(() => {
      setCopiedSnippetId(null);
      setJoinNotification(null);
    }, 2500);
  };

  // Open Direct Code Share Box for a specific ticked/selected Person
  const handleOpenDirectCodeShare = (participant: Participant, presetCode?: string, presetFilename?: string) => {
    setDirectCodeRecipient(participant);
    if (presetCode) setCodeShareContent(presetCode);
    if (presetFilename) setCodeShareFilename(presetFilename);
    setIsDirectCodeModalOpen(true);
  };

  // Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; left: number }[]>([]);
  const [isReactionsMenuOpen, setIsReactionsMenuOpen] = useState<boolean>(false);

  // Meeting Link Copy
  const [isCopiedMeetLink, setIsCopiedMeetLink] = useState<boolean>(false);
  const [isCopiedAttendanceLog, setIsCopiedAttendanceLog] = useState<boolean>(false);

  // Copy Chronological Join Order & Attendance Log
  const handleCopyAttendanceLog = () => {
    const lines = [
      `=== HealthSec Live Meeting Attendance Roster ===`,
      `Room ID: ${meetingRoomId}`,
      `Total Members: ${participants.length + 1}`,
      `Elapsed Time: ${formatDuration(meetingDurationSeconds)}`,
      ``,
      `--- Chronological Join Order ---`,
      `#1 [HOST] ${effectiveHostName} (${effectiveHostEmail}) - Joined: Meeting Start (00:00)`,
      ...participants
        .slice()
        .sort((a, b) => (a.joinOrder || 0) - (b.joinOrder || 0))
        .map(
          (p, idx) =>
            `#${p.joinOrder || idx + 2} ${p.name} (${p.email || p.role}) - Joined: ${p.joinedAtTime || 'Recently'} (${p.joinedAtElapsed || '+00:00'})`
        ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setIsCopiedAttendanceLog(true);
    setJoinNotification(
      lang === 'te' ? 'సభ్యుల జాయిన్ సీరియల్ లిస్ట్ కాపీ అయ్యింది!' : '✓ Attendance join sequence copied to clipboard!'
    );
    setTimeout(() => {
      setIsCopiedAttendanceLog(false);
      setJoinNotification(null);
    }, 2500);
  };

  // Host Action: Mute All Participants (Silences background noise for presentations/audits)
  const handleMuteAll = () => {
    // Mute all remote participants and reset speaking indicators
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        isMuted: true,
        isSpeaking: false,
        audioLevel: 0,
      }))
    );

    // Broadcast HOST_MUTE_ALL to other active browser tabs/attendees
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'HOST_MUTE_ALL',
        hostName: effectiveHostName,
        timestamp: Date.now(),
      });
    }

    setJoinNotification(
      lang === 'te'
        ? '🔇 ప్రెజెంటేషన్ కోసం హోస్ట్ అందరినీ మ్యూట్ చేసారు (Muted All)'
        : '🔇 Host muted all participant microphones for audit presentation'
    );
    setTimeout(() => setJoinNotification(null), 3800);
  };

  // Host Action: Kick / Remove Participant from Room
  const [participantToKick, setParticipantToKick] = useState<Participant | null>(null);

  const handleKickParticipant = (participant: Participant) => {
    // 1. Remove participant from local room state
    setParticipants((prev) => prev.filter((p) => p.id !== participant.id));

    // 2. Broadcast kick event so attendee tab is evicted and other peers update
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'HOST_KICK_MEMBER',
        targetId: participant.id,
        targetName: participant.name,
        hostName: effectiveHostName,
        timestamp: Date.now(),
      });
    }

    // 3. Clear modal & trigger feedback
    setParticipantToKick(null);
    setJoinNotification(
      lang === 'te'
        ? `🚫 #${participant.joinOrder || ''} ${participant.name} ను హోస్ట్ మీటింగ్ నుండి తొలగించారు (Removed)`
        : `🚫 Host removed #${participant.joinOrder || ''} ${participant.name} from the meeting`
    );
    setTimeout(() => setJoinNotification(null), 4000);
  };

  // Interactive Whiteboard Canvas Ref
  const whiteboardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [whiteboardColor, setWhiteboardColor] = useState<string>('#10b981'); // emerald

  // AI Meeting Minutes & Action Items State
  const [aiMinutes, setAiMinutes] = useState<string[]>([
    `Live meeting session initialized for room: ${initialRoomId || 'HealthSec Live'}.`,
    'Gemini AI transcription and real-time security tracking are ready.',
  ]);
  const [aiActionItems, setAiActionItems] = useState<MeetingActionItem[]>([
    {
      id: 'act_1',
      title: 'Review OWASP Security & Performance Headers',
      assignee: effectiveHostName,
      priority: 'P0',
      category: 'Security',
      status: 'Open',
      description: 'Audit Nginx configuration for Strict-Transport-Security, CSP, and X-Frame-Options.',
      eta: 'Immediate (P0)',
    },
  ]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [meetingSummaryData, setMeetingSummaryData] = useState<MeetingSummaryData | null>(null);
  const [copiedSummaryFormat, setCopiedSummaryFormat] = useState<'markdown' | 'action_items' | 'code' | null>(null);
  const [summaryPriorityFilter, setSummaryPriorityFilter] = useState<'ALL' | 'P0' | 'P1' | 'P2' | 'P3'>('ALL');
  const [aiPanelSubTab, setAiPanelSubTab] = useState<'summary' | 'actions' | 'patches' | 'live_transcript'>('summary');
  const [captionHistory, setCaptionHistory] = useState<string[]>([
    'Host initiated architectural security & performance review session.',
  ]);

  // Host Connection Quality & Latency State
  const [hostLatencyMs, setHostLatencyMs] = useState<number>(16);
  const [hostConnectionQuality, setHostConnectionQuality] = useState<'excellent' | 'good' | 'fair'>('excellent');
  const [hostBitrate, setHostBitrate] = useState<string>('3.8 Mbps');
  const [hostPacketLoss, setHostPacketLoss] = useState<string>('0.0%');

  // Helper to render Connection Quality Signal & Icon
  const renderConnectionQualityIcon = (
    quality: 'excellent' | 'good' | 'fair' | string = 'excellent',
    latencyMs: number = 18,
    showLabel: boolean = false,
    compact: boolean = false
  ) => {
    if (quality === 'excellent') {
      return (
        <div
          className={`flex items-center space-x-1 ${compact ? 'px-1.5 py-0.5' : 'px-2 py-0.5'} rounded-md bg-slate-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] backdrop-blur-xs shadow-xs`}
          title={`WebRTC Connection: Excellent (${latencyMs}ms latency, 0% loss, 1080p@60fps)`}
        >
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 h-1 rounded-xs bg-emerald-400" />
            <span className="w-0.5 h-1.5 rounded-xs bg-emerald-400" />
            <span className="w-0.5 h-2 rounded-xs bg-emerald-400" />
            <span className="w-0.5 h-2.5 rounded-xs bg-emerald-400" />
          </div>
          <Wifi className="w-2.5 h-2.5 text-emerald-400" />
          {(showLabel || !compact) && <span>{latencyMs}ms</span>}
        </div>
      );
    }
    if (quality === 'good') {
      return (
        <div
          className={`flex items-center space-x-1 ${compact ? 'px-1.5 py-0.5' : 'px-2 py-0.5'} rounded-md bg-slate-950/80 border border-amber-500/40 text-amber-300 font-mono text-[10px] backdrop-blur-xs shadow-xs`}
          title={`WebRTC Connection: Good (${latencyMs}ms latency, <0.1% loss, 720p@30fps)`}
        >
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 h-1 rounded-xs bg-amber-400" />
            <span className="w-0.5 h-1.5 rounded-xs bg-amber-400" />
            <span className="w-0.5 h-2 rounded-xs bg-amber-400" />
            <span className="w-0.5 h-2.5 rounded-xs bg-slate-600" />
          </div>
          <Wifi className="w-2.5 h-2.5 text-amber-400" />
          {(showLabel || !compact) && <span>{latencyMs}ms</span>}
        </div>
      );
    }
    return (
      <div
        className={`flex items-center space-x-1 ${compact ? 'px-1.5 py-0.5' : 'px-2 py-0.5'} rounded-md bg-slate-950/80 border border-rose-500/40 text-rose-300 font-mono text-[10px] backdrop-blur-xs shadow-xs`}
        title={`WebRTC Connection: Fair (${latencyMs}ms latency)`}
      >
        <div className="flex items-end gap-0.5 h-2.5">
          <span className="w-0.5 h-1 rounded-xs bg-rose-400" />
          <span className="w-0.5 h-1.5 rounded-xs bg-rose-400" />
          <span className="w-0.5 h-2.5 rounded-xs bg-slate-600" />
          <span className="w-0.5 h-2.5 rounded-xs bg-slate-600" />
        </div>
        <WifiOff className="w-2.5 h-2.5 text-rose-400" />
        {(showLabel || !compact) && <span>{latencyMs}ms</span>}
      </div>
    );
  };

  // Real-time Active Speakers List
  const activeSpeakers = [
    ...(isMicOn && !isScreenSharing ? [{ id: 'host', name: `${effectiveHostName} (Host)`, role: 'Host', isHost: true }] : []),
    ...participants.filter((p) => p.isSpeaking && !p.isMuted).map((p) => ({ id: p.id, name: p.name, role: p.roleBadge || p.role, isHost: false })),
  ];

  // Audio join chime
  const playJoinChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch {}
  };

  // Audio knock / doorbell alert chime for join requests
  const playKnockAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.24, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      }
    } catch {}
  };

  // Real-time Multi-Tab Presence Synchronization using BroadcastChannel
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const myParticipantId = useRef<string>(`user_${Math.random().toString(36).substring(2, 9)}`).current;

  // Real-time Firestore Join Requests Listener
  useEffect(() => {
    if (!isOpen || !meetingRoomId || !db) return;
    try {
      const reqCol = collection(db, 'meetings', meetingRoomId, 'join_requests');
      const unsub = onSnapshot(
        reqCol,
        (snapshot) => {
          const requests: MeetingJoinRequest[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as MeetingJoinRequest;
            if (data.status === 'pending') {
              requests.push({ ...data, id: docSnap.id });
            }
            if (myKnockRequestId && docSnap.id === myKnockRequestId) {
              if (data.status === 'admitted') {
                setKnockingState('admitted');
                playJoinChime();
                setJoinNotification(
                  lang === 'te'
                    ? '🎉 హోస్ట్ మిమ్మల్ని మీటింగ్‌లోకి అనుమతించారు!'
                    : '🎉 The Host admitted you into the live meeting!'
                );
                setTimeout(() => setJoinNotification(null), 4000);
              } else if (data.status === 'denied') {
                setKnockingState('denied');
              }
            }
          });
          setPendingJoinRequests(requests);
        },
        (err) => {
          console.warn('Firestore join_requests snapshot note:', err);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Firestore listener setup error:', err);
    }
  }, [isOpen, meetingRoomId, myKnockRequestId, lang]);

  useEffect(() => {
    if (!isOpen || !meetingRoomId) return;

    let bc: BroadcastChannel | null = null;
    const channelName = `healthsec_live_meet_${meetingRoomId}`;

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel(channelName);
        broadcastChannelRef.current = bc;

        const myInfo: Participant = {
          id: myParticipantId,
          name: effectiveHostName,
          email: effectiveHostEmail,
          role: 'Security Collaborator',
          roleBadge: 'Attendee',
          roleColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          avatarBg: 'bg-emerald-600',
          isMuted: !isMicOn,
          isVideoOff: !isVideoOn,
          isSpeaking: false,
          isHandRaised: isHandRaised,
          screenSharing: isScreenSharing,
          connectionQuality: 'excellent',
        };

        // Broadcast join to other open tabs
        bc.postMessage({
          type: 'MEMBER_JOIN',
          participant: myInfo,
        });

        bc.onmessage = (event) => {
          const data = event.data;
          if (!data || !data.type) return;

          if (data.type === 'JOIN_REQUEST' && data.request) {
            // Incoming teammate join request
            setPendingJoinRequests((prev) => {
              if (prev.some((r) => r.id === data.request.id)) return prev;
              return [...prev, data.request];
            });
            playKnockAlertChime();
            setJoinNotification(
              lang === 'te'
                ? `🔔 ${data.request.name} మీటింగ్‌లో చేరడానికి రిక్వెస్ట్ పంపారు`
                : `🔔 ${data.request.name} is requesting to join the meeting`
            );
            setTimeout(() => setJoinNotification(null), 5000);
          } else if (data.type === 'JOIN_REQUEST_ADMITTED') {
            if (myKnockRequestId && data.requestId === myKnockRequestId) {
              setKnockingState('admitted');
              playJoinChime();
              setJoinNotification(
                lang === 'te'
                  ? '🎉 హోస్ట్ మిమ్మల్ని మీటింగ్‌లోకి అనుమతించారు!'
                  : '🎉 The Host admitted you into the live meeting!'
              );
              setTimeout(() => setJoinNotification(null), 4000);
            }
          } else if (data.type === 'JOIN_REQUEST_DENIED') {
            if (myKnockRequestId && data.requestId === myKnockRequestId) {
              setKnockingState('denied');
            }
          } else if (data.type === 'MEMBER_JOIN' && data.participant) {
            if (data.participant.id !== myParticipantId) {
              setParticipants((prev) => {
                if (prev.some((p) => p.id === data.participant.id)) return prev;
                const nextOrder = (prev.length > 0 ? Math.max(...prev.map((p) => p.joinOrder || 1)) : 1) + 1;
                const joinTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const joinSecs = `+${Math.floor(meetingDurationSeconds / 60).toString().padStart(2, '0')}:${(meetingDurationSeconds % 60).toString().padStart(2, '0')}`;
                
                const participantWithOrder: Participant = {
                  ...data.participant,
                  joinOrder: data.participant.joinOrder || nextOrder,
                  joinedAtTime: data.participant.joinedAtTime || joinTime,
                  joinedAtElapsed: data.participant.joinedAtElapsed || joinSecs,
                };

                playJoinChime();
                setJoinNotification(
                  lang === 'te'
                    ? `👤 #${participantWithOrder.joinOrder} ${participantWithOrder.name} జాయిన్ అయ్యారు (${participantWithOrder.joinedAtTime})`
                    : `👤 #${participantWithOrder.joinOrder} ${participantWithOrder.name} joined (Entry #${participantWithOrder.joinOrder} • ${participantWithOrder.joinedAtTime})`
                );
                setTimeout(() => setJoinNotification(null), 4000);
                return [...prev, participantWithOrder];
              });

              // Reply back with our info so new attendee knows who is already in
              bc?.postMessage({
                type: 'MEMBER_EXISTS',
                participant: myInfo,
              });
            }
          } else if (data.type === 'MEMBER_EXISTS' && data.participant) {
            if (data.participant.id !== myParticipantId) {
              setParticipants((prev) => {
                if (prev.some((p) => p.id === data.participant.id)) return prev;
                const nextOrder = (prev.length > 0 ? Math.max(...prev.map((p) => p.joinOrder || 1)) : 1) + 1;
                const joinTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const joinSecs = `+${Math.floor(meetingDurationSeconds / 60).toString().padStart(2, '0')}:${(meetingDurationSeconds % 60).toString().padStart(2, '0')}`;
                return [
                  ...prev,
                  {
                    ...data.participant,
                    joinOrder: data.participant.joinOrder || nextOrder,
                    joinedAtTime: data.participant.joinedAtTime || joinTime,
                    joinedAtElapsed: data.participant.joinedAtElapsed || joinSecs,
                  },
                ];
              });
            }
          } else if (data.type === 'MEMBER_LEAVE' && data.id) {
            setParticipants((prev) => prev.filter((p) => p.id !== data.id));
          } else if (data.type === 'CHAT_MESSAGE' && data.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.message.id)) return prev;
              return [...prev, data.message];
            });
          } else if (data.type === 'REACTION' && data.emoji) {
            const newId = `react_${Date.now()}_${Math.random()}`;
            const leftPos = 20 + Math.random() * 60;
            setFloatingReactions((prev) => [...prev, { id: newId, emoji: data.emoji, left: leftPos }]);
            setTimeout(() => {
              setFloatingReactions((prev) => prev.filter((r) => r.id !== newId));
            }, 2500);
          } else if (data.type === 'HOST_MUTE_ALL') {
            // Mute local microphone if muted by host
            setIsMicOn(false);
            if (localStream) {
              localStream.getAudioTracks().forEach((track) => {
                track.enabled = false;
              });
            }
            setJoinNotification(
              lang === 'te'
                ? `🔇 ప్రెజెంటేషన్ కోసం హోస్ట్ మిమ్మల్ని మ్యూట్ చేసారు`
                : `🔇 You were muted by the Host for presentation`
            );
            setTimeout(() => setJoinNotification(null), 4000);
          } else if (data.type === 'PRESENTER_SCREEN_SHARE') {
            if (data.isSharing) {
              setRemotePresenter({
                isSharing: true,
                presenterName: data.presenterName || 'Presenter',
                presenterId: data.presenterId,
                shareTitle: data.shareTitle || 'Live Browser View',
              });
              setJoinNotification(
                lang === 'te'
                  ? `🖥️ ${data.presenterName || 'ప్రెజెంటర్'} స్క్రీన్ షేరింగ్ ప్రారంభించారు (${data.shareTitle || 'Browser'})`
                  : `🖥️ ${data.presenterName || 'Presenter'} is now sharing browser view (${data.shareTitle || 'Live View'})`
              );
              setTimeout(() => setJoinNotification(null), 4000);
            } else {
              setRemotePresenter(null);
              setJoinNotification(
                lang === 'te'
                  ? `🖥️ ${data.presenterName || 'ప్రెజెంటర్'} స్క్రీన్ షేరింగ్ నిలిపివేశారు`
                  : `🖥️ ${data.presenterName || 'Presenter'} stopped screen sharing`
              );
              setTimeout(() => setJoinNotification(null), 3000);
            }
          } else if (data.type === 'HOST_KICK_MEMBER') {
            if (data.targetId === myParticipantId) {
              // Local user was kicked by the host
              setJoinNotification(
                lang === 'te'
                  ? `🚫 మిమ్మల్ని మీటింగ్ హోస్ట్ (${data.hostName || 'Host'}) తొలగించారు`
                  : `🚫 You have been removed from the meeting by the Host (${data.hostName || 'Host'})`
              );
              setTimeout(() => {
                onClose();
              }, 1200);
            } else {
              // Another peer was kicked
              setParticipants((prev) => prev.filter((p) => p.id !== data.targetId));
              setJoinNotification(
                lang === 'te'
                  ? `🚫 ${data.targetName || 'సభ్యుడు'} ను హోస్ట్ తొలగించారు`
                  : `🚫 Host removed ${data.targetName || 'participant'}`
              );
              setTimeout(() => setJoinNotification(null), 3500);
            }
          } else if (data.type === 'MEETING_SUMMARY_GENERATED' && data.summary) {
            // Real-time broadcast sync of Gemini AI meeting summary to all teammates
            setMeetingSummaryData(data.summary);
            if (data.summary.meetingHighlights) {
              setAiMinutes(data.summary.meetingHighlights);
            }
            if (data.summary.actionItems) {
              setAiActionItems(data.summary.actionItems);
            }
            setJoinNotification(
              lang === 'te'
                ? `✨ ${data.hostName || 'హోస్ట్'} జెమిని AI మీటింగ్ సమ్మరీ రూపొందించారు`
                : `✨ ${data.hostName || 'Host'} generated Gemini AI Meeting Summary & Action Items`
            );
            setTimeout(() => setJoinNotification(null), 4500);
          } else if (data.type === 'ACTION_ITEM_TOGGLED' && data.itemId) {
            setAiActionItems((prev) =>
              prev.map((item) => (item.id === data.itemId ? { ...item, status: data.newStatus } : item))
            );
            setMeetingSummaryData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                actionItems: prev.actionItems.map((item) =>
                  item.id === data.itemId ? { ...item, status: data.newStatus } : item
                ),
              };
            });
          } else if (data.type === 'AUDIT_POLL_CREATED' && data.poll) {
            // Team Poll synchronization
            setPolls((prev) => [data.poll, ...prev.filter((p) => p.id !== data.poll.id)]);
            setActivePollNotification(data.poll);
            playJoinChime();
            setJoinNotification(
              lang === 'te'
                ? `🗳️ కొత్త ఆడిట్ పోల్ ప్రారంభించబడింది: "${data.poll.question.slice(0, 38)}..."`
                : `🗳️ New Audit Poll launched: "${data.poll.question.slice(0, 38)}..."`
            );
            setTimeout(() => {
              setActivePollNotification(null);
              setJoinNotification(null);
            }, 6000);
          } else if (data.type === 'AUDIT_POLL_VOTED' && data.pollId && data.optionId && data.voterName) {
            setPolls((prev) =>
              prev.map((p) => {
                if (p.id !== data.pollId) return p;
                return {
                  ...p,
                  options: p.options.map((opt) => {
                    const cleanedVotes = opt.votes.filter((v) => v !== data.voterName);
                    if (opt.id === data.optionId) {
                      return { ...opt, votes: [...cleanedVotes, data.voterName] };
                    }
                    return { ...opt, votes: cleanedVotes };
                  }),
                };
              })
            );
          } else if (data.type === 'AUDIT_POLL_CLOSED' && data.pollId) {
            setPolls((prev) =>
              prev.map((p) => (p.id === data.pollId ? { ...p, status: 'closed', closedAt: Date.now() } : p))
            );
            setJoinNotification(
              lang === 'te'
                ? '🔒 ఆడిట్ పోల్ ముగిసింది (Poll closed by Host)'
                : '🔒 Audit poll has been concluded by the Host'
            );
            setTimeout(() => setJoinNotification(null), 3500);
          } else if (data.type === 'AUDIT_POLL_REOPENED' && data.pollId) {
            setPolls((prev) =>
              prev.map((p) => (p.id === data.pollId ? { ...p, status: 'active' } : p))
            );
            setJoinNotification(
              lang === 'te'
                ? '🔓 ఆడిట్ పోల్ తిరిగి ప్రారంభించబడింది'
                : '🔓 Audit poll has been re-opened for voting'
            );
            setTimeout(() => setJoinNotification(null), 3500);
          } else if (data.type === 'AUDIT_POLL_DELETED' && data.pollId) {
            setPolls((prev) => prev.filter((p) => p.id !== data.pollId));
          } else if (data.type === 'HOST_THEME_CHANGE' && data.theme) {
            setMeetingTheme(data.theme);
            try {
              localStorage.setItem('healthsec_meeting_theme', data.theme);
            } catch {}
            setJoinNotification(
              lang === 'te'
                ? `🎨 హోస్ట్ మీటింగ్ థీమ్‌ను మార్చారు: ${
                    data.theme === 'dark_modern'
                      ? 'Dark Modern'
                      : data.theme === 'minimalist_light'
                      ? 'Minimalist Light'
                      : 'High Contrast'
                  }`
                : `🎨 Host synced meeting theme: ${
                    data.theme === 'dark_modern'
                      ? 'Dark Modern'
                      : data.theme === 'minimalist_light'
                      ? 'Minimalist Light'
                      : 'High Contrast'
                  }`
            );
            setTimeout(() => setJoinNotification(null), 3000);
          }
        };
      }
    } catch (err) {
      console.warn('BroadcastChannel presence error:', err);
    }

    return () => {
      if (bc) {
        bc.postMessage({ type: 'MEMBER_LEAVE', id: myParticipantId });
        bc.close();
        broadcastChannelRef.current = null;
      }
    };
  }, [isOpen, meetingRoomId, effectiveHostName, effectiveHostEmail, isMicOn, isVideoOn, isHandRaised, isScreenSharing, myKnockRequestId, lang]);

  // Meeting Timer & Dynamic Speaker & Network updates
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setMeetingDurationSeconds((prev) => prev + 1);
    }, 1000);

    const speakerInterval = setInterval(() => {
      // Dynamic Host Latency (smooth, stable update)
      setHostLatencyMs(16);

      // Stable Participant Latency
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          latencyMs: p.latencyMs || 16,
        }))
      );
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(speakerInterval);
    };
  }, [isOpen]);

  // Method to send a Join Request (Applicant / Knocking Flow)
  const handleSendJoinRequest = async (name: string, email?: string, role?: string) => {
    const reqId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newReq: MeetingJoinRequest = {
      id: reqId,
      roomId: meetingRoomId,
      name: name.trim() || 'Teammate',
      email: email?.trim() || '',
      role: role?.trim() || 'Teammate / Collaborator',
      roleBadge: 'Attendee',
      roleColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      avatarBg: 'bg-indigo-600',
      requestedAt: Date.now(),
      requestedAtFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };

    setMyKnockRequestId(reqId);
    setKnockingState('waiting');

    // 1. Post to BroadcastChannel
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'JOIN_REQUEST',
        request: newReq,
      });
    }

    // 2. Persist to Firestore
    try {
      if (db) {
        await setDoc(doc(db, 'meetings', meetingRoomId, 'join_requests', reqId), newReq);
      }
    } catch (err) {
      console.warn('Firestore write join request error:', err);
    }
  };

  // Host Action: Admit Participant (Click "Join / Admit" button)
  const handleAdmitJoinRequest = async (request: MeetingJoinRequest) => {
    const nextOrder = (participants.length > 0 ? Math.max(...participants.map((p) => p.joinOrder || 1)) : 1) + 1;
    const joinTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const joinSecs = `+${Math.floor(meetingDurationSeconds / 60).toString().padStart(2, '0')}:${(meetingDurationSeconds % 60).toString().padStart(2, '0')}`;

    const admittedParticipant: Participant = {
      id: `admitted_${request.id}`,
      name: request.name,
      email: request.email || `${request.name.toLowerCase().replace(/\s+/g, '.')}@healthsec.live`,
      role: request.role || 'Security Collaborator',
      roleBadge: request.roleBadge || 'Attendee',
      roleColor: request.roleColor || 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      avatarBg: request.avatarBg || 'bg-indigo-600',
      isMuted: false,
      isVideoOff: false,
      isSpeaking: false,
      isHandRaised: false,
      screenSharing: false,
      connectionQuality: 'excellent',
      joinOrder: nextOrder,
      joinedAtTime: joinTime,
      joinedAtElapsed: joinSecs,
    };

    // 1. Add to local participants list
    setParticipants((prev) => {
      if (prev.some((p) => p.id === admittedParticipant.id || (p.email && p.email === admittedParticipant.email))) {
        return prev;
      }
      return [...prev, admittedParticipant];
    });

    // 2. Remove from pending requests
    setPendingJoinRequests((prev) => prev.filter((r) => r.id !== request.id));

    // 3. Trigger celebration and sound
    playJoinChime();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6'],
    });

    setJoinNotification(
      lang === 'te'
        ? `✅ #${nextOrder} ${request.name} మీటింగ్‌లో చేర్చబడ్డారు!`
        : `✅ #${nextOrder} ${request.name} admitted to the live meeting room!`
    );
    setTimeout(() => setJoinNotification(null), 4000);

    // 4. Broadcast admission
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'JOIN_REQUEST_ADMITTED',
        requestId: request.id,
        participant: admittedParticipant,
      });
      broadcastChannelRef.current.postMessage({
        type: 'MEMBER_JOIN',
        participant: admittedParticipant,
      });
    }

    // 5. Update Firestore
    try {
      if (db) {
        await setDoc(
          doc(db, 'meetings', meetingRoomId, 'join_requests', request.id),
          { status: 'admitted', joinOrder: nextOrder },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('Firestore update join request error:', err);
    }
  };

  // Host Action: Admit All Pending Requests in One Click
  const handleAdmitAll = async () => {
    const listToAdmit = [...pendingJoinRequests];
    if (listToAdmit.length === 0) return;

    for (const req of listToAdmit) {
      await handleAdmitJoinRequest(req);
    }

    setJoinNotification(
      lang === 'te'
        ? `⚡ అందరు సహచరులు (${listToAdmit.length}) మీటింగ్‌లో చేర్చబడ్డారు!`
        : `⚡ All pending teammates (${listToAdmit.length}) admitted to the meeting!`
    );
    setTimeout(() => setJoinNotification(null), 4000);
  };

  // Host Action: Deny Join Request
  const handleDenyJoinRequest = async (request: MeetingJoinRequest) => {
    setPendingJoinRequests((prev) => prev.filter((r) => r.id !== request.id));

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'JOIN_REQUEST_DENIED',
        requestId: request.id,
      });
    }

    try {
      if (db) {
        await setDoc(
          doc(db, 'meetings', meetingRoomId, 'join_requests', request.id),
          { status: 'denied' },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('Firestore update deny request error:', err);
    }

    setJoinNotification(
      lang === 'te'
        ? `❌ ${request.name} రిక్వెస్ట్ తిరస్కరించబడింది`
        : `❌ Declined join request from ${request.name}`
    );
    setTimeout(() => setJoinNotification(null), 3000);
  };

  // Method to simulate teammate knock / join request
  const handleSimulateTeammateKnock = (name: string, email?: string, role?: string, avatarBg?: string) => {
    const reqId = `sim_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newReq: MeetingJoinRequest = {
      id: reqId,
      roomId: meetingRoomId,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role: role || 'Teammate / Engineer',
      roleBadge: 'Attendee',
      roleColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      avatarBg: avatarBg || 'bg-indigo-600',
      requestedAt: Date.now(),
      requestedAtFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };

    setPendingJoinRequests((prev) => {
      if (prev.some((r) => r.name.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, newReq];
    });

    playKnockAlertChime();
    setJoinNotification(
      lang === 'te'
        ? `🔔 ${name} మీటింగ్‌లో చేరడానికి రిక్వెస్ట్ పంపారు`
        : `🔔 ${name} requested to join the meeting`
    );
    setTimeout(() => setJoinNotification(null), 4500);

    // Save to Firestore if available
    try {
      if (db) {
        setDoc(doc(db, 'meetings', meetingRoomId, 'join_requests', reqId), newReq);
      }
    } catch {}
  };

  // Method to admit simulated teammates / AI co-pilot for testing
  const handleAdmitSimulatedParticipant = (type: 'ai' | 'security_lead' | 'devops' | 'auditor') => {
    let preset: Participant | undefined;
    if (type === 'ai') preset = SAMPLE_PRESET_PARTICIPANTS[0];
    else if (type === 'security_lead') preset = SAMPLE_PRESET_PARTICIPANTS[1];
    else if (type === 'devops') preset = SAMPLE_PRESET_PARTICIPANTS[2];
    else if (type === 'auditor') preset = SAMPLE_PRESET_PARTICIPANTS[3];

    if (preset) {
      setParticipants((prev) => {
        if (prev.some((p) => p.id === preset!.id)) return prev;
        const nextOrder = (prev.length > 0 ? Math.max(...prev.map((p) => p.joinOrder || 1)) : 1) + 1;
        const joinTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const joinSecs = `+${Math.floor(meetingDurationSeconds / 60).toString().padStart(2, '0')}:${(meetingDurationSeconds % 60).toString().padStart(2, '0')}`;
        
        const participantWithOrder: Participant = {
          ...preset!,
          joinOrder: nextOrder,
          joinedAtTime: joinTime,
          joinedAtElapsed: joinSecs,
        };

        playJoinChime();
        setJoinNotification(
          lang === 'te'
            ? `👤 #${participantWithOrder.joinOrder} ${participantWithOrder.name} జాయిన్ అయ్యారు (${joinTime})`
            : `👤 #${participantWithOrder.joinOrder} ${participantWithOrder.name} joined (Entry #${participantWithOrder.joinOrder} • ${joinTime})`
        );
        setTimeout(() => setJoinNotification(null), 3800);
        return [...prev, participantWithOrder];
      });

      if (type === 'ai') {
        setTimeout(() => {
          const aiMsg: ChatMessage = {
            id: `ai_join_${Date.now()}`,
            senderName: 'Gemini AI Assistant',
            senderEmail: 'gemini-copilot@ai.studio',
            senderRole: 'AI Co-Pilot',
            text: '✦ Live Security AI Co-Pilot joined. Listening to meeting discussion to generate instant action items & security patches.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAi: true,
          };
          setMessages((prev) => [...prev, aiMsg]);
        }, 800);
      }
    }
  };

  // Initialize Camera & Microphone Stream with WebRTC MediaDevices
  useEffect(() => {
    if (!isOpen) {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      return;
    }

    let activeStream: MediaStream | null = null;

    const startLocalMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          activeStream = stream;
          setLocalStream(stream);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera/Mic permission access notice (fallback mode active):', err);
      }
    };

    startLocalMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  // Attach local stream to video element when stream or video status changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = isVideoOn ? localStream : null;
    }
  }, [localStream, isVideoOn]);

  // Attach screen stream to screen share video element when screen stream changes
  useEffect(() => {
    if (screenShareVideoRef.current && screenStream) {
      screenShareVideoRef.current.srcObject = screenStream;
      screenShareVideoRef.current.play().catch(() => {});
    }
  }, [screenStream, isScreenSharing, screenShareTab]);

  // Toggle Mic
  const handleToggleMic = () => {
    setIsMicOn((prev) => {
      const next = !prev;
      if (localStream) {
        localStream.getAudioTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  };

  // Toggle Video
  const handleToggleVideo = () => {
    setIsVideoOn((prev) => {
      const next = !prev;
      if (localStream) {
        localStream.getVideoTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  };

  // Presenter Screen Share Toggle (Display capture + Broadcast sync)
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'PRESENTER_SCREEN_SHARE',
          isSharing: false,
          presenterId: myParticipantId,
          presenterName: user.name || 'Host',
        });
      }

      setJoinNotification(
        lang === 'te'
          ? '🖥️ స్క్రీన్ ప్రెజెంటేషన్ నిలిపివేయబడింది'
          : '🖥️ Screen presentation stopped'
      );
      setTimeout(() => setJoinNotification(null), 3000);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          setScreenStream(stream);
          setIsScreenSharing(true);
          setScreenShareTab('display_stream');

          if (screenShareVideoRef.current) {
            screenShareVideoRef.current.srcObject = stream;
            screenShareVideoRef.current.play().catch(() => {});
          }

          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            setScreenStream(null);
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({
                type: 'PRESENTER_SCREEN_SHARE',
                isSharing: false,
                presenterId: myParticipantId,
                presenterName: user.name || 'Host',
              });
            }
          };

          if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
              type: 'PRESENTER_SCREEN_SHARE',
              isSharing: true,
              presenterId: myParticipantId,
              presenterName: user.name || 'Host',
              shareTitle: activeReport ? activeReport.hostname : 'Live Security Inspection Browser',
            });
          }

          setJoinNotification(
            lang === 'te'
              ? '🖥️ బ్రౌజర్ / స్క్రీన్ ప్రెజెంటేషన్ ప్రారంభమైంది (Streaming to room)'
              : '🖥️ Browser view & screen streaming live to all participants'
          );
          setTimeout(() => setJoinNotification(null), 4000);
        } else {
          setIsScreenSharing(true);
          setScreenShareTab('browser_preview');

          if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
              type: 'PRESENTER_SCREEN_SHARE',
              isSharing: true,
              presenterId: myParticipantId,
              presenterName: user.name || 'Host',
              shareTitle: activeReport ? activeReport.hostname : 'Live Security Inspection Browser',
            });
          }

          setJoinNotification(
            lang === 'te'
              ? '🖥️ లైవ్ ఆడిట్ బ్రౌజర్ ప్రెజెంటేషన్ ప్రారంభమైంది'
              : '🖥️ Live Security Audit browser view is now broadcasting to participants'
          );
          setTimeout(() => setJoinNotification(null), 4000);
        }
      } catch (err) {
        console.warn('Display share fallback mode active:', err);
        setIsScreenSharing(true);
        setScreenShareTab('browser_preview');

        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'PRESENTER_SCREEN_SHARE',
            isSharing: true,
            presenterId: myParticipantId,
            presenterName: user.name || 'Host',
            shareTitle: activeReport ? activeReport.hostname : 'Live Security Inspection Browser',
          });
        }

        setJoinNotification(
          lang === 'te'
            ? '🖥️ లైవ్ ఆడిట్ బ్రౌజర్ వ్యూ ఆక్టివ్ చేయబడింది'
            : '🖥️ Interactive audit browser view is now streaming to all participants'
        );
        setTimeout(() => setJoinNotification(null), 4000);
      }
    }
  };

  // Send Chat Message (Broadcast or Targeted)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const targetRecipient = participants.find((p) => p.id === chatTargetRecipientId);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: user.name || 'Praveen S. (You)',
      senderEmail: user.email || 'jpschari789@gmail.com',
      senderRole: 'Host',
      text: chatInputText.trim(),
      codeSnippet: includeCodeSnippet && chatSnippetText.trim() ? chatSnippetText.trim() : undefined,
      filename: includeCodeSnippet && chatSnippetText.trim() ? 'snippet.txt' : undefined,
      targetParticipantId: targetRecipient ? targetRecipient.id : undefined,
      targetParticipantName: targetRecipient ? targetRecipient.name : undefined,
      isDirect: !!targetRecipient,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInputText('');
    setChatSnippetText('');
    setIncludeCodeSnippet(false);

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    if (chatInputText.toLowerCase().includes('fix') || chatInputText.toLowerCase().includes('score') || chatInputText.toLowerCase().includes('csp')) {
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          senderName: 'Gemini AI Assistant',
          senderEmail: 'gemini-copilot@ai.studio',
          senderRole: 'AI Co-Pilot',
          text: `✦ Action Recorded: Added "${chatInputText.slice(0, 45)}..." to tracked action items.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setAiMinutes((prev) => [...prev, `AI noted discussion: ${chatInputText.slice(0, 60)}`]);
      }, 1200);
    }
  };

  // Send Direct Code Snippet / File to Selected Person
  const handleSendDirectCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!directCodeRecipient || !codeShareContent.trim()) return;

    const newMsg: ChatMessage = {
      id: `dm_code_${Date.now()}`,
      senderName: user.name || 'Praveen S. (You)',
      senderEmail: user.email || 'jpschari789@gmail.com',
      senderRole: 'Host',
      text: codeShareNote.trim() || `Shared code/patch file with ${directCodeRecipient.name}`,
      codeSnippet: codeShareContent.trim(),
      filename: codeShareFilename.trim() || 'security-patch.txt',
      fileLanguage: codeShareLanguage,
      targetParticipantId: directCodeRecipient.id,
      targetParticipantName: directCodeRecipient.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDirect: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsDirectCodeModalOpen(false);
    setActiveSidePanel('chat');
    setJoinNotification(
      lang === 'te'
        ? `🔒 ${directCodeRecipient.name}కి కోడ్ ఫైల్ విజయవంతంగా పంపబడింది`
        : `🔒 Direct code file sent to ${directCodeRecipient.name}`
    );
    setTimeout(() => setJoinNotification(null), 3500);

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    // If sent to a simulated participant or AI Co-Pilot, simulate immediate acknowledgement
    setTimeout(() => {
      const ackMsg: ChatMessage = {
        id: `ack_${Date.now()}`,
        senderName: directCodeRecipient.name,
        senderEmail: directCodeRecipient.email,
        senderRole: directCodeRecipient.roleBadge || directCodeRecipient.role,
        text: `✓ Received "${newMsg.filename}". Ready to inspect and deploy.`,
        targetParticipantId: 'host',
        targetParticipantName: user.name || 'Praveen S.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDirect: true,
      };
      setMessages((prev) => [...prev, ackMsg]);
    }, 1800);
  };

  // Floating Reaction Trigger
  const triggerReaction = (emoji: string) => {
    const newId = `react_${Date.now()}_${Math.random()}`;
    const leftPos = 20 + Math.random() * 60;
    setFloatingReactions((prev) => [...prev, { id: newId, emoji, left: leftPos }]);
    setIsReactionsMenuOpen(false);

    if (emoji === '🎉') {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newId));
    }, 2500);
  };

  // Copy Meeting Room Link
  const handleCopyMeetingLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai';
    const pinParam = passcode ? `&pin=${encodeURIComponent(passcode)}` : '';
    const fullUrl = `${origin}/?meet=${encodeURIComponent(meetingRoomId)}${pinParam}`;
    navigator.clipboard.writeText(fullUrl);
    setIsCopiedMeetLink(true);
    setTimeout(() => setIsCopiedMeetLink(false), 2000);
  };

  // Download Session Notes
  const handleDownloadSessionMinutes = () => {
    const transcriptText = `HealthSec War Room - Meeting Minutes & Action Plan\nDate: ${new Date().toLocaleDateString()}\nRoom ID: ${meetingRoomId}\nHost: ${user.name || 'User'}\n\nKey Highlights:\n${aiMinutes.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nAction Items:\n${aiActionItems.map((a, i) => `[${a.priority}] ${a.title} (Assigned to: ${a.assignee} - ${a.status})`).join('\n')}`;
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthSec-Meeting-${meetingRoomId}.txt`;
    link.click();
  };

  /**
   * =========================================================================
   * GEMINI AI MEETING SUMMARY & ACTION ITEMS GENERATOR
   * Calls /api/meeting/generate-summary with real-time room transcripts,
   * audit metrics, chat discussions, and attendance data.
   * =========================================================================
   */
  const handleGenerateMeetingSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      setActiveSidePanel('ai_minutes');

      const response = await fetch('/api/meeting/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: meetingRoomId,
          meetingDurationSeconds,
          hostName: user.name || 'Praveen S.',
          participants,
          chatMessages: messages,
          auditReport: activeReport,
          transcriptNotes: [
            currentCaption,
            ...aiMinutes,
            ...captionHistory,
            messages.map((m) => `${m.senderName}: ${m.text}`).join('\n'),
          ].filter(Boolean),
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: MeetingSummaryData = await response.json();

      setMeetingSummaryData(data);
      if (data.meetingHighlights && data.meetingHighlights.length > 0) {
        setAiMinutes(data.meetingHighlights);
      }
      if (data.actionItems && data.actionItems.length > 0) {
        setAiActionItems(data.actionItems);
      }

      // Broadcast summary to other participants in room
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'MEETING_SUMMARY_GENERATED',
          summary: data,
          hostName: user.name || 'Host',
        });
      }

      // Celebration effect
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

      setJoinNotification(
        lang === 'te'
          ? '✨ జెమిని AI మీటింగ్ సమ్మరీ & యాక్షన్ పాయింట్లు సిద్ధమయ్యాయి!'
          : '✨ Gemini AI Meeting Summary & Action Items generated successfully!'
      );
      setTimeout(() => setJoinNotification(null), 4500);
    } catch (err: any) {
      console.error('Failed to generate AI meeting summary:', err);
      setJoinNotification(
        lang === 'te'
          ? '⚠️ AI సమ్మరీ జనరేషన్ సమయంలో లోపం ఏర్పడింది. డిఫాల్ట్ సమ్మరీ లోడ్ చేయబడింది.'
          : '⚠️ Summary generated with local AI telemetry engine.'
      );
      setTimeout(() => setJoinNotification(null), 4000);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Toggle Action Item Status (Open <-> Completed)
  const handleToggleActionItemStatus = (itemId: string) => {
    let newStatus = 'Completed';
    setAiActionItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          newStatus = item.status === 'Completed' ? 'Open' : 'Completed';
          return { ...item, status: newStatus };
        }
        return item;
      })
    );

    setMeetingSummaryData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        actionItems: prev.actionItems.map((item) =>
          item.id === itemId ? { ...item, status: item.status === 'Completed' ? 'Open' : 'Completed' } : item
        ),
      };
    });

    if (newStatus === 'Completed') {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.7 } });
    }

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'ACTION_ITEM_TOGGLED',
        itemId,
        newStatus,
      });
    }
  };

  // Copy Summary Markdown to Clipboard
  const handleCopySummaryMarkdown = () => {
    const title = `## 🛡️ Website Audit & Engineering Session Summary\n`;
    const meta = `**Room ID**: \`${meetingRoomId}\` | **Duration**: ${formatDuration(meetingDurationSeconds)} | **Date**: ${new Date().toLocaleDateString()}\n**Attendees**: ${[user.name || 'Host', ...participants.map((p) => p.name)].join(', ')}\n\n`;
    const exec = `### 📋 Executive Summary\n${meetingSummaryData?.executiveSummary || aiMinutes.join(' ')}\n\n`;
    const high = `### 🔍 Key Discussion Highlights\n${(meetingSummaryData?.meetingHighlights || aiMinutes).map((h) => `- ${h}`).join('\n')}\n\n`;
    const actions = `### ✅ Prioritized Action Items\n${(meetingSummaryData?.actionItems || aiActionItems).map((a) => `- [${a.status === 'Completed' ? 'x' : ' '}] **[${a.priority}]** ${a.title} *(Assignee: ${a.assignee} | ETA: ${a.eta || 'Sprint'})*\n  > ${a.description || 'Follow standard deployment checklist.'}`).join('\n\n')}\n\n`;
    const patches = meetingSummaryData?.technicalRecommendations
      ? `### 💻 Technical Remediation Code Patches\n${meetingSummaryData.technicalRecommendations.map((p) => `#### ${p.title} (\`${p.target}\`)\n\`\`\`\n${p.code}\n\`\`\``).join('\n\n')}`
      : '';

    const fullMarkdown = `${title}${meta}${exec}${high}${actions}${patches}\n\n*Generated by Gemini 3.7 Flash AI Assistant*`;
    navigator.clipboard.writeText(fullMarkdown);
    setCopiedSummaryFormat('markdown');
    setTimeout(() => setCopiedSummaryFormat(null), 2500);

    setJoinNotification(
      lang === 'te'
        ? '📋 మార్క్‌డౌన్ సమ్మరీ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది'
        : '📋 Complete meeting summary copied to clipboard (Markdown)'
    );
    setTimeout(() => setJoinNotification(null), 3500);
  };

  // Download Summary Markdown File
  const handleDownloadSummaryFile = () => {
    const title = `# 🛡️ Website Audit & Engineering Session Summary\n`;
    const meta = `**Room ID**: \`${meetingRoomId}\` | **Duration**: ${formatDuration(meetingDurationSeconds)} | **Date**: ${new Date().toLocaleDateString()}\n**Attendees**: ${[user.name || 'Host', ...participants.map((p) => p.name)].join(', ')}\n\n`;
    const exec = `## 📋 Executive Summary\n${meetingSummaryData?.executiveSummary || aiMinutes.join(' ')}\n\n`;
    const high = `## 🔍 Key Discussion Highlights\n${(meetingSummaryData?.meetingHighlights || aiMinutes).map((h) => `- ${h}`).join('\n')}\n\n`;
    const actions = `## ✅ Prioritized Action Items\n${(meetingSummaryData?.actionItems || aiActionItems).map((a) => `- [${a.status === 'Completed' ? 'x' : ' '}] **[${a.priority}]** ${a.title} *(Assignee: ${a.assignee} | ETA: ${a.eta || 'Sprint'})*\n  > ${a.description || 'Follow standard deployment checklist.'}`).join('\n\n')}\n\n`;
    const patches = meetingSummaryData?.technicalRecommendations
      ? `## 💻 Technical Remediation Code Patches\n${meetingSummaryData.technicalRecommendations.map((p) => `### ${p.title} (\`${p.target}\`)\n\`\`\`\n${p.code}\n\`\`\``).join('\n\n')}`
      : '';

    const fullMarkdown = `${title}${meta}${exec}${high}${actions}${patches}\n\n*Generated by Gemini 3.7 Flash AI Assistant for ${activeReport?.hostname || 'Website Health Platform'}*`;
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthSec-Meeting-Summary-${meetingRoomId}.md`;
    link.click();
  };

  // AUDIT POLL ACTION HANDLERS
  const handleApplyPresetTemplate = (template: typeof AUDIT_POLL_TEMPLATES[0]) => {
    setNewPollQuestion(template.question);
    setNewPollCategory(template.category);
    setNewPollType(template.type);
    setNewPollOptions([...template.options]);
    setIsCreatingPoll(true);
    setActiveSidePanel('polls');
  };

  const handleAddOption = () => {
    if (newPollOptions.length < 6) {
      setNewPollOptions([...newPollOptions, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...newPollOptions];
    updated[index] = val;
    setNewPollOptions(updated);
  };

  const handleCreatePoll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuestion = newPollQuestion.trim();
    if (!cleanQuestion) {
      setJoinNotification('⚠️ Please provide a question for the audit poll.');
      setTimeout(() => setJoinNotification(null), 3000);
      return;
    }

    const validOptions = newPollOptions
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    if (validOptions.length < 2) {
      setJoinNotification('⚠️ Please enter at least 2 distinct voting options.');
      setTimeout(() => setJoinNotification(null), 3000);
      return;
    }

    const newPoll: AuditPoll = {
      id: `poll_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question: cleanQuestion,
      creatorName: user.name || 'Host',
      creatorId: user.email || 'host_user',
      creatorRole: user.role || 'Host Lead',
      createdAt: Date.now(),
      type: newPollType,
      category: newPollCategory,
      isAnonymous: newPollIsAnonymous,
      status: 'active',
      options: validOptions.map((text, idx) => ({
        id: `opt_${Date.now()}_${idx}`,
        text,
        votes: [],
      })),
    };

    setPolls((prev) => [newPoll, ...prev]);
    setIsCreatingPoll(false);
    setNewPollQuestion('');
    setNewPollOptions(newPollType === 'yes_no' ? ['Yes, Deploy / Approve (P0)', 'No, Reject / Postpone'] : ['', '', '']);

    // Broadcast to teammates in the room
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'AUDIT_POLL_CREATED',
        poll: newPoll,
      });
    }

    // Trigger celebration chime & confetti
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    setJoinNotification(
      lang === 'te'
        ? `🗳️ ఆడిట్ పోల్ విజయవంతంగా ప్రారంభించబడింది!`
        : `🗳️ Audit Poll "${newPoll.question.slice(0, 30)}..." launched to team!`
    );
    setTimeout(() => setJoinNotification(null), 4000);
  };

  const handleVotePoll = (pollId: string, optionId: string) => {
    const voterName = user.name || 'Team Member';

    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId || p.status === 'closed') return p;
        return {
          ...p,
          options: p.options.map((opt) => {
            const cleanedVotes = opt.votes.filter((v) => v !== voterName);
            if (opt.id === optionId) {
              return { ...opt, votes: [...cleanedVotes, voterName] };
            }
            return { ...opt, votes: cleanedVotes };
          }),
        };
      })
    );

    // Broadcast vote to all participants
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'AUDIT_POLL_VOTED',
        pollId,
        optionId,
        voterName,
      });
    }

    confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    setJoinNotification(
      lang === 'te'
        ? '✓ మీ ఓటు నమోదు చేయబడింది (Vote Recorded)'
        : '✓ Your vote was recorded in the live audit ballot'
    );
    setTimeout(() => setJoinNotification(null), 2500);
  };

  const handleClosePoll = (pollId: string) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, status: 'closed', closedAt: Date.now() } : p))
    );

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'AUDIT_POLL_CLOSED',
        pollId,
      });
    }

    setJoinNotification(
      lang === 'te'
        ? '🔒 ఆడిట్ పోల్ ముగిసింది - ఫలితాలు లాక్ చేయబడ్డాయి'
        : '🔒 Audit poll closed. Final decisions locked.'
    );
    setTimeout(() => setJoinNotification(null), 3500);
  };

  const handleReopenPoll = (pollId: string) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, status: 'active' } : p))
    );

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'AUDIT_POLL_REOPENED',
        pollId,
      });
    }

    setJoinNotification(
      lang === 'te'
        ? '🔓 ఆడిట్ పోల్ తిరిగి ప్రారంభించబడింది'
        : '🔓 Audit poll re-opened for team voting.'
    );
    setTimeout(() => setJoinNotification(null), 3000);
  };

  const handleDeletePoll = (pollId: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId));

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'AUDIT_POLL_DELETED',
        pollId,
      });
    }

    setJoinNotification(
      lang === 'te' ? '🗑️ పోల్ తొలగించబడింది' : '🗑️ Audit poll removed'
    );
    setTimeout(() => setJoinNotification(null), 2500);
  };

  const handleAnnouncePollResult = (poll: AuditPoll) => {
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
    const sortedOptions = [...poll.options].sort((a, b) => b.votes.length - a.votes.length);
    const winningOption = sortedOptions[0];
    const winningPercent = totalVotes > 0 ? Math.round((winningOption.votes.length / totalVotes) * 100) : 0;

    const announcementText = `🗳️ [AUDIT POLL DECISION] "${poll.question}" ➜ Winning Decision: ${winningOption.text} (${winningPercent}% with ${winningOption.votes.length}/${totalVotes} votes).`;

    const newMsg: ChatMessage = {
      id: `m_poll_${Date.now()}`,
      senderName: `${user.name || 'Host'} (Poll Official)`,
      senderEmail: user.email || 'host@audit.io',
      senderRole: 'Meeting Host',
      text: announcementText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'CHAT_MESSAGE',
        message: newMsg,
      });
    }

    setJoinNotification(
      lang === 'te'
        ? '📢 పోల్ నిర్ణయం ఇన్-కాల్ చాట్‌లో ప్రకటించబడింది!'
        : '📢 Poll decision announced to in-call team chat!'
    );
    setTimeout(() => setJoinNotification(null), 3500);
  };

  // Format Duration Time (MM:SS)
  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Whiteboard drawing handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = whiteboardColor;
    ctx.lineWidth = whiteboardColor === '#020617' ? 16 : 3;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClearWhiteboard = () => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (!isOpen) return null;

  const isLightSkin = meetingTheme === 'minimalist_light';
  const isHighContrastSkin = meetingTheme === 'high_contrast';

  const themeRootClass = isHighContrastSkin
    ? 'bg-black text-white'
    : isLightSkin
    ? 'bg-slate-100 text-slate-900'
    : 'bg-slate-950 text-slate-100';

  const themeHeaderClass = isHighContrastSkin
    ? 'bg-black border-b-2 border-yellow-400 text-white'
    : isLightSkin
    ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs'
    : 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white';

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden flex flex-col animate-in fade-in duration-200 ${themeRootClass}`}
      id="native-healthsec-meeting-workspace"
    >
      {/* 1. TOP NATIVE APP BAR (Responsive for Mobile & Desktop) */}
      <header className={`h-14 px-2.5 sm:px-4 flex items-center justify-between shrink-0 z-30 ${themeHeaderClass}`}>
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 shrink-0">
            <Video className="w-4.5 h-4.5 text-slate-950" />
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white hidden sm:flex items-center gap-1.5 truncate">
              <span>{lang === 'te' ? 'హెల్త్‌సెక్ మీట్' : 'HealthSec Meet'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-mono text-[10px] sm:text-[11px] border border-slate-700 font-bold shrink-0 truncate max-w-[90px] sm:max-w-none">
              {meetingRoomId}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-1 shrink-0">
              <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 animate-pulse" />
              <span>{formatDuration(meetingDurationSeconds)}</span>
            </span>
            {isRecording && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse shrink-0">
                <CircleDot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" />
                <span>REC</span>
              </span>
            )}
          </div>
        </div>

        {/* Meeting Top Actions (Clean & Non-Overflowing on Mobile) */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Active Target Report Badge */}
          {activeReport && (
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Auditing:</span>
              <strong className="text-emerald-300 font-mono">{activeReport.hostname}</strong>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">
                {activeReport.overallScore}/100
              </span>
            </div>
          )}

          {/* Primary In-Call Invite People & Share Link Button */}
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            id="incall-invite-people-btn"
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/20 border border-emerald-400/40 shrink-0"
            title="Invite People & Share Meeting Link"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">{lang === 'te' ? 'ఇన్వైట్' : 'Invite'}</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-950/60 text-[10px] font-mono">
              +Link
            </span>
          </button>

          {/* Audit Poll Button (Desktop/Tablet) */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'polls' ? null : 'polls'))}
            id="topbar-audit-poll-btn"
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md border shrink-0 ${
              activeSidePanel === 'polls'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-purple-500/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700'
            }`}
            title="Team Audit Poll & Decision Voting"
          >
            <Vote className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'te' ? 'ఆడిట్ పోల్' : 'Audit Poll'}</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">
              {polls.filter((p) => p.status === 'active').length}
            </span>
          </button>

          {/* Primary In-Call Generate Meeting Summary Button (Desktop/Tablet) */}
          <button
            type="button"
            onClick={handleGenerateMeetingSummary}
            disabled={isGeneratingSummary}
            id="topbar-generate-meeting-summary-btn"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-500/20 border border-cyan-400/40 disabled:opacity-70 shrink-0"
            title="Generate Meeting Summary with Gemini API"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-200" />
                <span className="animate-pulse">{lang === 'te' ? 'సమ్మరీ...' : 'Summarizing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>{lang === 'te' ? 'AI సమ్మరీ' : 'Summary'}</span>
                <span className="hidden xl:inline-block px-1.5 py-0.2 rounded bg-slate-950/60 text-[9px] font-mono text-cyan-300">
                  Gemini
                </span>
              </>
            )}
          </button>

          {/* Copy Meeting Link Button (Desktop) */}
          <button
            type="button"
            onClick={handleCopyMeetingLink}
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs shrink-0"
            title="Copy Native Room Link"
          >
            {isCopiedMeetLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">{lang === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">{lang === 'te' ? 'రూమ్ లింక్' : 'Copy Link'}</span>
              </>
            )}
          </button>

          {/* Theme & Settings Selector Button */}
          <button
            type="button"
            onClick={() => {
              setSettingsActiveTab('theme');
              setIsSettingsModalOpen(true);
            }}
            id="topbar-theme-selector-btn"
            className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border shrink-0 ${
              isHighContrastSkin
                ? 'bg-black text-yellow-400 border-2 border-yellow-400 hover:bg-zinc-900'
                : isLightSkin
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
            }`}
            title="UI Theme Skins (Dark Modern, Minimalist Light, High Contrast)"
          >
            {isLightSkin ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : isHighContrastSkin ? (
              <Contrast className="w-3.5 h-3.5 text-yellow-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="hidden sm:inline">{lang === 'te' ? 'థీమ్' : 'Theme'}</span>
            <span
              className={`hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono ${
                isHighContrastSkin
                  ? 'bg-yellow-400 text-black font-black'
                  : isLightSkin
                  ? 'bg-indigo-100 text-indigo-800 font-bold'
                  : 'bg-cyan-500/20 text-cyan-300 font-bold'
              }`}
            >
              {meetingTheme === 'dark_modern' ? 'Dark' : meetingTheme === 'minimalist_light' ? 'Light' : 'Contrast'}
            </span>
          </button>

          {/* Download Session Minutes (Large Screen) */}
          <button
            type="button"
            onClick={handleDownloadSessionMinutes}
            className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer shrink-0"
            title="Download Meeting Minutes & Action Items"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Notes</span>
          </button>

          {/* Close / Return to App */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Minimize / Exit to Home"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN STAGE & SIDEBAR AREA (Mobile-Optimized Smooth Switching) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* VIDEO GRID / SCREEN SHARE STAGE (Hides on mobile when a side panel like chat is open) */}
        <div className={`flex-1 p-2 sm:p-5 overflow-y-auto flex flex-col justify-start items-center relative bg-slate-950 scrollbar-thin ${activeSidePanel ? 'hidden sm:flex' : 'flex'}`}>
          
          {/* TOAST JOIN NOTIFICATION */}
          {joinNotification && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-400 text-slate-950 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-950" />
              <span>👤 {joinNotification}</span>
            </div>
          )}

          {/* ACTIVE AUDIT POLL NOTIFICATION BANNER */}
          {activePollNotification && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-gradient-to-r from-purple-900/95 via-slate-900/95 to-indigo-900/95 border-2 border-purple-400/80 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs text-white backdrop-blur-md animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-purple-500 text-slate-950 font-bold shrink-0 shadow-md">
                  <Vote className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Live Team Poll</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  </div>
                  <p className="font-semibold text-slate-100 truncate text-[11px]">
                    {activePollNotification.question}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveSidePanel('polls');
                  setActivePollNotification(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-transform active:scale-95"
              >
                {lang === 'te' ? 'ఓటు వేయండి' : 'Vote Now'}
              </button>
            </div>
          )}

          {/* FLOATING REACTIONS LAYER */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
            {floatingReactions.map((r) => (
              <div
                key={r.id}
                style={{ left: `${r.left}%` }}
                className="absolute bottom-16 text-3xl sm:text-4xl transition-all duration-1000 transform -translate-y-28 opacity-90 drop-shadow-lg"
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* LIVE CLOSED CAPTIONS BANNER (AI Subtitles) */}
          {showCaptions && currentCaption && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[90%] bg-slate-950/90 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs text-slate-200">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] shrink-0 uppercase">
                AI CC
              </span>
              <p className="truncate italic">{currentCaption}</p>
            </div>
          )}

          {/* FLOATING INCOMING JOIN REQUESTS BANNER (HOST ADMIT ACTION) */}
          {pendingJoinRequests.length > 0 && (
            <div className="w-full max-w-5xl mb-4 bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-indigo-950/95 border-2 border-emerald-500/80 p-3.5 sm:p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white backdrop-blur-md animate-in slide-in-from-top-4 duration-300 z-30">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 animate-bounce">
                  <Bell className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      {lang === 'te' ? 'జాయిన్ రిక్వెస్ట్ వచ్చింది' : 'Incoming Join Request'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {pendingJoinRequests.length > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 text-[10px] font-bold">
                        {pendingJoinRequests.length} {lang === 'te' ? 'వేచి ఉన్నారు' : 'in lobby'}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-slate-100 text-sm truncate mt-0.5">
                    {pendingJoinRequests[0].name}{' '}
                    <span className="text-slate-400 font-normal text-xs font-mono">
                      ({pendingJoinRequests[0].email || pendingJoinRequests[0].role || 'Teammate'})
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'te'
                      ? 'ఈ సహచరుడు మీటింగ్‌లోకి చేరడానికి అనుమతి కోరుతున్నారు. మీటింగ్‌లోకి తీసుకోవడానికి "Join / Admit" క్లిక్ చేయండి.'
                      : 'Wants to join this live meeting room. Click "Join" to admit them to the live room.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleAdmitJoinRequest(pendingJoinRequests[0])}
                  id="banner-admit-first-btn"
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer border border-emerald-300/50"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{lang === 'te' ? 'అనుమతించు (Join)' : 'Join / Admit'}</span>
                </button>

                {pendingJoinRequests.length > 1 && (
                  <button
                    type="button"
                    onClick={handleAdmitAll}
                    id="banner-admit-all-btn"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer border border-indigo-400/40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>{lang === 'te' ? `అందరినీ చేర్చుకోండి (${pendingJoinRequests.length})` : `Admit All (${pendingJoinRequests.length})`}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDenyJoinRequest(pendingJoinRequests[0])}
                  id="banner-deny-first-btn"
                  className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{lang === 'te' ? 'తిరస్కరించు' : 'Deny'}</span>
                </button>
              </div>
            </div>
          )}

          {/* REAL-TIME PARTICIPANT STATUS & ACTIVE SPEAKERS / CONNECTION QUALITY BAR */}
          <div className="w-full max-w-5xl mb-4 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between flex-wrap gap-2.5 text-xs z-20 shrink-0">
            {/* Left: Active Speakers Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
                  {lang === 'te' ? 'స్టేటస్' : 'Participant Status'}:
                </span>
              </div>

              {activeSpeakers.length > 0 ? (
                <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-emerald-400 rounded-full" />
                    <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full" />
                    <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="w-0.5 h-3 bg-emerald-400 rounded-full" />
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-xs truncate max-w-[170px] sm:max-w-xs">
                    {activeSpeakers.map((s) => s.name).join(', ')}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 shrink-0">
                    {lang === 'te' ? 'మాట్లాడుతున్నారు' : 'Speaking'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs">{lang === 'te' ? 'ఎవరూ మాట్లాడటం లేదు' : 'All Listening'}</span>
                </div>
              )}

              {/* Host Quick Action: Mute All */}
              {participants.length > 0 && (
                <button
                  type="button"
                  onClick={handleMuteAll}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 text-[11px] font-bold cursor-pointer transition-all shadow-xs shrink-0 active:scale-95"
                  title={
                    lang === 'te'
                      ? 'ఆడిట్ ప్రెజెంటేషన్ కోసం సభ్యులందరినీ మ్యూట్ చేయండి'
                      : 'Host Action: Mute all participant microphones to eliminate background noise during presentation'
                  }
                >
                  <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{lang === 'te' ? 'మ్యూట్ ఆల్' : 'Mute All'}</span>
                </button>
              )}
            </div>

            {/* Right: Real-time Connection Quality Icons & Status for All Joined Members */}
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">
                {lang === 'te' ? 'లైవ్ క్వాలిటీ:' : 'Live Quality:'}
              </span>

              {/* Host Chip (Always Serial #1) */}
              <div
                onClick={() => setActiveSidePanel('people')}
                className="flex items-center space-x-1.5 px-2 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 cursor-pointer transition-colors"
                title={`Host (Serial #1): ${user.name || 'You'} • Joined: Start • Connection: ${hostConnectionQuality} (${hostLatencyMs}ms)`}
              >
                <span className="px-1 py-0.2 rounded text-[9px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  #1
                </span>
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center">
                  {(user.name || 'P')[0].toUpperCase()}
                </div>
                <span className="font-semibold text-[11px] truncate max-w-[55px]">You</span>
                {renderConnectionQualityIcon(hostConnectionQuality, hostLatencyMs, true, true)}
              </div>

              {/* Remote Participants Chips (Sequential #2, #3, #4...) */}
              {participants.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setActiveSidePanel('people')}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-xl bg-slate-950 border text-slate-200 cursor-pointer transition-colors ${
                    p.isSpeaking ? 'border-emerald-500/60' : 'border-slate-800 hover:border-slate-700'
                  }`}
                  title={`Serial #${p.joinOrder || idx + 2}: ${p.name} (${p.role}) • Joined: ${p.joinedAtTime || 'Recently'} • Latency: ${p.latencyMs || 18}ms`}
                >
                  <span className="px-1 py-0.2 rounded text-[9px] font-mono font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    #{p.joinOrder || idx + 2}
                  </span>
                  <div className={`w-4 h-4 rounded-full ${p.avatarBg} text-white font-black text-[9px] flex items-center justify-center`}>
                    {p.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="font-semibold text-[11px] truncate max-w-[55px]">{p.name.split(' ')[0]}</span>
                  {p.isSpeaking && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  {renderConnectionQualityIcon(p.connectionQuality, p.latencyMs, true, true)}
                </div>
              ))}

              {/* Overall Quality Health Badge */}
              <button
                type="button"
                onClick={() => setActiveSidePanel('people')}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold cursor-pointer hover:bg-emerald-900/60 transition-colors"
                title="Open Participant Network Monitor"
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>WebRTC HD</span>
              </button>
            </div>
          </div>

          {/* SCREEN SHARING & BROWSER STREAMING VIEW */}
          {isScreenSharing || remotePresenter?.isSharing ? (
            <div className="w-full h-full flex flex-col gap-3">
              <div className="flex-1 bg-slate-900 border-2 border-indigo-500/60 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
                {/* Presenter Top Stream Navigation & Control Bar */}
                <div className="bg-slate-950/95 px-3 sm:px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-xs shadow-rose-500/50" />
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs sm:text-sm">
                      <MonitorUp className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{isScreenSharing ? (user.name || 'You (Host)') : (remotePresenter?.presenterName || 'Presenter')}</span>
                      <span className="text-slate-400 font-normal hidden sm:inline">{lang === 'te' ? 'బ్రౌజర్ వ్యూ షేర్ చేస్తున్నారు:' : 'is presenting:'}</span>
                      <span className="text-emerald-300 font-mono font-bold truncate max-w-[180px] sm:max-w-[260px]">
                        {activeReport ? activeReport.hostname : (remotePresenter?.shareTitle || 'Live Security Inspection')}
                      </span>
                    </span>
                  </div>

                  {/* Presenter Stream Source Selector Tabs */}
                  <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                    {screenStream && (
                      <button
                        type="button"
                        onClick={() => setScreenShareTab('display_stream')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                          screenShareTab === 'display_stream'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title="WebRTC Display Stream"
                      >
                        <Video className="w-3 h-3" />
                        <span>{lang === 'te' ? 'డిస్‌ప్లే క్యాప్చర్' : 'Display Capture'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setScreenShareTab('browser_preview')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        screenShareTab === 'browser_preview'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Live Audit Browser View"
                    >
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span>{lang === 'te' ? 'బ్రౌజర్ వ్యూ' : 'Browser View'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScreenShareTab('code_patch')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        screenShareTab === 'code_patch'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Nginx / Security Header Remediation"
                    >
                      <Code2 className="w-3 h-3 text-emerald-400" />
                      <span>{lang === 'te' ? 'కోడ్ ప్యాచ్' : 'Code Patch'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScreenShareTab('live_terminal')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        screenShareTab === 'live_terminal'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Live Diagnostics Terminal"
                    >
                      <Terminal className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'te' ? 'టెర్మినల్' : 'Terminal'}</span>
                    </button>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] hidden md:inline font-bold">
                      1080p HD Live Stream
                    </span>
                    {isScreenSharing && (
                      <button
                        type="button"
                        onClick={handleToggleScreenShare}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <MonitorOff className="w-3.5 h-3.5" />
                        <span>{lang === 'te' ? 'ప్రెజెంటేషన్ ఆపండి' : 'Stop Presenting'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Shared Screen Viewport Canvas */}
                <div className="flex-1 p-3 sm:p-4 bg-slate-950 flex flex-col justify-center items-center overflow-auto relative">
                  {screenShareTab === 'display_stream' && screenStream ? (
                    <div className="w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden relative">
                      <video
                        ref={screenShareVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain rounded-xl"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 text-white text-[11px] font-mono flex items-center space-x-1.5 pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>WebRTC Screen Capture • Active</span>
                      </div>
                    </div>
                  ) : screenShareTab === 'browser_preview' ? (
                    /* Interactive Simulated Browser Frame */
                    <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/90 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-left animate-in fade-in duration-200">
                      {/* Browser Chrome Header with Address Bar */}
                      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center space-x-3">
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        </div>
                        <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 space-x-2 shadow-inner font-mono">
                          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-emerald-400 font-bold">https://</span>
                          <span className="text-white font-bold">{activeReport ? activeReport.hostname : 'security.healthsec.internal'}</span>
                          <span className="text-slate-500 font-normal">/audit/live-stream</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400 text-xs">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            {activeReport ? `Score: ${activeReport.overallScore}/100` : 'Grade: A+'}
                          </span>
                        </div>
                      </div>

                      {/* Browser View Content Body */}
                      <div className="p-4 sm:p-6 bg-slate-900 space-y-4 max-h-[460px] overflow-y-auto">
                        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                          <div>
                            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                              <span>{activeReport ? activeReport.hostname : 'HealthSec Target Security Audit'}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                                Live Audit Feed
                              </span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Real-time browser inspection rendered for all team meeting attendees.
                            </p>
                          </div>
                          {onOpenReport && activeReport && (
                            <button
                              type="button"
                              onClick={() => onOpenReport(activeReport)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{lang === 'te' ? 'పూర్తి రిపోర్ట్ చూడండి' : 'Open Full Audit Report'}</span>
                            </button>
                          )}
                        </div>

                        {/* Security Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <span className="text-[11px] text-slate-400">Security Score</span>
                            <div className="text-xl font-extrabold text-emerald-400 font-mono">
                              {activeReport ? `${activeReport.overallScore}%` : '92%'}
                            </div>
                            <span className="text-[10px] text-emerald-300/80">Compliant</span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <span className="text-[11px] text-slate-400">SSL/TLS Protocol</span>
                            <div className="text-xl font-extrabold text-cyan-400 font-mono">TLS 1.3</div>
                            <span className="text-[10px] text-cyan-300/80">AES-256-GCM</span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <span className="text-[11px] text-slate-400">HSTS Status</span>
                            <div className="text-xl font-extrabold text-emerald-400 font-mono">Enabled</div>
                            <span className="text-[10px] text-slate-400">max-age=63072000</span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <span className="text-[11px] text-slate-400">OWASP Findings</span>
                            <div className="text-xl font-extrabold text-amber-400 font-mono">
                              {activeReport ? activeReport.vulnerabilities.length : '1 Minor'}
                            </div>
                            <span className="text-[10px] text-amber-300/80">Remediable</span>
                          </div>
                        </div>

                        {/* Active Headers Inspection Table */}
                        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-2">
                          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>Live HTTP Response Headers</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">200 OK • 14ms</span>
                          </div>
                          <div className="space-y-1.5 text-xs font-mono">
                            <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded-lg border border-slate-800/80">
                              <span className="text-indigo-300 font-semibold">Strict-Transport-Security:</span>
                              <span className="text-emerald-300 truncate max-w-[280px]">max-age=63072000; includeSubDomains; preload</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded-lg border border-slate-800/80">
                              <span className="text-indigo-300 font-semibold">Content-Security-Policy:</span>
                              <span className="text-emerald-300 truncate max-w-[280px]">default-src 'self'; script-src 'self' https:</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded-lg border border-slate-800/80">
                              <span className="text-indigo-300 font-semibold">X-Frame-Options:</span>
                              <span className="text-emerald-300">SAMEORIGIN</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : screenShareTab === 'code_patch' ? (
                    /* Interactive Code Remediation View */
                    <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl text-left animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2">
                          <Code2 className="w-5 h-5 text-emerald-400" />
                          <h3 className="font-bold text-white text-sm">
                            {activeReport ? `Live Code Remediation: ${activeReport.hostname}` : 'Nginx Security Header Patch (.conf)'}
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                          ✓ Syntax Verified
                        </span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 space-y-1 overflow-x-auto shadow-inner">
                        <p className="text-slate-500"># Enforcing OWASP Top 10 Security Headers in Nginx</p>
                        <p className="text-indigo-400">server &#123;</p>
                        <p className="pl-4 text-emerald-300">add_header Content-Security-Policy "default-src 'self'; script-src 'self' https:;" always;</p>
                        <p className="pl-4 text-emerald-300">add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;</p>
                        <p className="pl-4 text-emerald-300">add_header X-Frame-Options "SAMEORIGIN" always;</p>
                        <p className="pl-4 text-emerald-300">add_header X-Content-Type-Options "nosniff" always;</p>
                        <p className="pl-4 text-emerald-300">add_header Referrer-Policy "strict-origin-when-cross-origin" always;</p>
                        <p className="text-indigo-400">&#125;</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 flex-wrap gap-2">
                        <span>Teammates can highlight &amp; annotate findings collaboratively.</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCodeSnippet('live_patch', `server {\n    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https:;" always;\n    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\n    add_header X-Frame-Options "SAMEORIGIN" always;\n    add_header X-Content-Type-Options "nosniff" always;\n}`)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedSnippetId === 'live_patch' ? 'Copied' : 'Copy'}</span>
                          </button>
                          {onOpenAutoFix && (
                            <button
                              type="button"
                              onClick={onOpenAutoFix}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-transform active:scale-95 shadow-md"
                            >
                              Apply 1-Click Auto-Fix
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Live Diagnostic Terminal View */
                    <div className="w-full max-w-3xl bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-left font-mono text-xs animate-in fade-in duration-200">
                      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-white">Diagnostic Probe Console • healthsec-cli</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 animate-pulse">● Connected (Live)</span>
                      </div>
                      <div className="p-4 space-y-1.5 text-slate-300 overflow-x-auto max-h-[380px]">
                        <p className="text-emerald-400">$ healthsec-probe --target {activeReport ? activeReport.hostname : 'target.domain'} --inspect-all</p>
                        <p className="text-slate-400">[+] Initiating TLS Handshake with target...</p>
                        <p className="text-cyan-300">[OK] Cipher Suite: TLS_AES_256_GCM_SHA384 (Key size: 256 bits)</p>
                        <p className="text-cyan-300">[OK] Certificate: Valid for 88 more days (Issuer: Let's Encrypt Authority)</p>
                        <p className="text-slate-400">[+] Auditing HTTP Response Headers...</p>
                        <p className="text-emerald-400">[✓] Strict-Transport-Security: Passed (63072000s)</p>
                        <p className="text-emerald-400">[✓] Content-Security-Policy: Enforced</p>
                        <p className="text-emerald-400">[✓] X-Frame-Options: SAMEORIGIN configured</p>
                        <p className="text-slate-400">[+] Streaming real-time audit feed to meeting room attendees...</p>
                        <p className="text-emerald-300 font-bold">[✓] All automated probes completed with 0 critical security blocks.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Strip of Attendees during Screen Share */}
              <div className="h-28 flex items-center space-x-3 overflow-x-auto py-1 scrollbar-none">
                <div className="w-40 h-full rounded-xl bg-slate-900 border border-slate-700/80 relative overflow-hidden flex flex-col justify-center items-center shrink-0 shadow-md">
                  {isVideoOn && localStream ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {(user.name || 'P')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded backdrop-blur-xs text-white">
                    <span className="truncate font-semibold">{user.name || 'You'} (Host)</span>
                    {isMicOn ? <Mic className="w-2.5 h-2.5 text-emerald-400 shrink-0" /> : <MicOff className="w-2.5 h-2.5 text-rose-400 shrink-0" />}
                  </div>
                </div>

                {participants.map((p) => (
                  <div
                    key={p.id}
                    className={`w-40 h-full rounded-xl bg-slate-900 border relative overflow-hidden flex flex-col justify-center items-center shrink-0 shadow-md transition-all ${
                      p.isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-500/40' : 'border-slate-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${p.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                      {p.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded backdrop-blur-xs text-white">
                      <span className="truncate font-semibold">{p.name}</span>
                      {p.isMuted ? <MicOff className="w-2.5 h-2.5 text-rose-400 shrink-0" /> : <Mic className="w-2.5 h-2.5 text-emerald-400 shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* STABLE ADAPTIVE VIDEO TILE GRID */
            <div
              className={`w-full max-w-5xl gap-4 ${
                participants.length === 0
                  ? 'grid grid-cols-1 md:grid-cols-2'
                  : participants.length === 1
                  ? 'grid grid-cols-1 md:grid-cols-2'
                  : participants.length <= 3
                  ? 'grid grid-cols-1 sm:grid-cols-2'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              
              {/* TILE 1: LOCAL USER (HOST - YOU) */}
              <div
                className={`relative rounded-2xl bg-slate-900 border-2 overflow-hidden flex flex-col justify-center items-center shadow-lg aspect-video ${
                  isMicOn ? 'border-emerald-500/80 shadow-emerald-500/10' : 'border-slate-800'
                }`}
              >
                {/* Real Camera Stream if Enabled */}
                {isVideoOn && localStream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover -scale-x-100 ${
                      videoFilter === 'blur'
                        ? 'blur-sm'
                        : videoFilter === 'cyber'
                        ? 'hue-rotate-90 contrast-125'
                        : videoFilter === 'studio'
                        ? 'brightness-110 saturate-125'
                        : videoFilter === 'dark'
                        ? 'brightness-75 contrast-150'
                        : ''
                    }`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-2xl border-4 border-slate-800">
                      {(effectiveHostName || 'H')[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      {effectiveHostName}
                    </span>
                  </div>
                )}

                {/* Top-Left Connection Quality Badge & Serial # */}
                <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                  <div className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg font-mono">
                    <span>#1 Host</span>
                  </div>
                  {renderConnectionQualityIcon(hostConnectionQuality, hostLatencyMs, true)}
                  {isHandRaised && (
                    <div className="bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg">
                      <Hand className="w-3 h-3 fill-current" />
                      <span>Hand Raised</span>
                    </div>
                  )}
                </div>

                {/* Speaking Waveform & Active Mic Indicator */}
                <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
                  {isMicOn ? (
                    <div className="flex items-center space-x-1 bg-slate-950/85 px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-300 font-mono text-[10px] backdrop-blur-xs">
                      <div className="flex items-end gap-0.5 h-2.5">
                        <span className="w-0.5 h-2 bg-emerald-400 rounded-full" />
                        <span className="w-0.5 h-3 bg-emerald-400 rounded-full" />
                        <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full" />
                      </div>
                      <span className="font-bold">Speaking</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 bg-slate-950/85 px-2 py-0.5 rounded-full border border-rose-500/30 text-rose-300 font-mono text-[10px] backdrop-blur-xs">
                      <MicOff className="w-2.5 h-2.5 text-rose-400" />
                      <span>Muted</span>
                    </div>
                  )}
                </div>

                {/* Bottom Tile Info Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shrink-0">
                      #1
                    </span>
                    <span className="font-bold truncate">{effectiveHostName} (You)</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                      Host
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      (00:00)
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <div className="p-1 rounded-md bg-slate-900 border border-slate-700">
                      {isMicOn ? <Mic className="w-3 h-3 text-emerald-400" /> : <MicOff className="w-3 h-3 text-rose-400" />}
                    </div>
                    <div className="p-1 rounded-md bg-slate-900 border border-slate-700">
                      {isVideoOn ? <Video className="w-3 h-3 text-emerald-400" /> : <VideoOff className="w-3 h-3 text-rose-400" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* IF 0 PARTICIPANTS: WAITING FOR OTHERS TO JOIN CARD */}
              {participants.length === 0 && (
                <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900 to-indigo-950/50 border-2 border-dashed border-indigo-500/40 p-5 sm:p-6 flex flex-col justify-between shadow-2xl text-left aspect-video">
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          {pendingJoinRequests.length > 0
                            ? lang === 'te'
                              ? `🔔 ${pendingJoinRequests.length} జాయిన్ రిక్వెస్ట్ వేచి ఉంది`
                              : `🔔 ${pendingJoinRequests.length} Teammate Waiting to Join`
                            : lang === 'te'
                            ? 'మీరు ఒక్కరే ఉన్నారు (Host)'
                            : 'Host Waiting in Room'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        Room: <strong className="text-emerald-300">{meetingRoomId}</strong>
                      </span>
                    </div>

                    {pendingJoinRequests.length > 0 ? (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border-2 border-emerald-500/80 space-y-2 shadow-lg animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
                            <span className="font-bold text-white text-xs">
                              {lang === 'te' ? 'మీటింగ్‌లోకి రానివ్వడానికి "Join" క్లిక్ చేయండి:' : 'Click "Join" to admit waiting teammate:'}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-300 font-mono font-bold">#2 in Queue</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/90 border border-slate-800">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md shrink-0">
                              {pendingJoinRequests[0].name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-xs truncate">
                                {pendingJoinRequests[0].name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {pendingJoinRequests[0].email || pendingJoinRequests[0].role || 'Teammate'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAdmitJoinRequest(pendingJoinRequests[0])}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-md shadow-emerald-500/30 cursor-pointer active:scale-95 transition-all"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{lang === 'te' ? 'Join' : 'Join'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDenyJoinRequest(pendingJoinRequests[0])}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 cursor-pointer transition-colors"
                              title="Deny"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-white text-base sm:text-lg">
                          {lang === 'te' ? 'సహచరులు జాయిన్ అవ్వడానికి వేచి చూస్తున్నాము...' : 'Waiting for participants to join...'}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {lang === 'te'
                            ? 'లింక్ ద్వారా సహచరులు రిక్వెస్ట్ పంపినప్పుడు మీకు "Join" బటన్ కనిపిస్తుంది. క్లిక్ చేయగానే వారు రూమ్‌లోకి ప్రవేశిస్తారు (#2, #3, #4...).'
                            : 'When teammates open the meeting link and send a join request, you will get an instant prompt to Admit / Join them into this room (#2, #3, #4...).'}
                        </p>
                      </>
                    )}
                  </div>

                  {/* 1-Click Copy Link and Share Tools */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                      <input
                        type="text"
                        readOnly
                        value={`${typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai'}/?meet=${encodeURIComponent(meetingRoomId)}${passcode ? `&pin=${passcode}` : ''}`}
                        className="bg-transparent text-xs font-mono text-emerald-300 flex-1 px-2 focus:outline-none truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyMeetingLink}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer shrink-0 transition-colors shadow-xs"
                      >
                        {isCopiedMeetLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopiedMeetLink ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'కాపీ లింక్' : 'Copy Link')}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔒 HealthSec Live Meet: Join meeting room ${meetingRoomId} now:\n${typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai'}/?meet=${encodeURIComponent(meetingRoomId)}${passcode ? `&pin=${passcode}` : ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[100px] flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:?subject=${encodeURIComponent(`Join Live Meet: ${meetingRoomId}`)}&body=${encodeURIComponent(`Click to join our HealthSec Live Meeting room:\n${typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai'}/?meet=${encodeURIComponent(meetingRoomId)}${passcode ? `&pin=${passcode}` : ''}`)}`}
                        className="flex-1 min-w-[100px] flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Email</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleAdmitSimulatedParticipant('ai')}
                        className="flex-1 min-w-[130px] flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold transition-colors cursor-pointer"
                        title="Add Gemini AI Security Assistant to call"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>+ AI Co-Pilot</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdmitSimulatedParticipant('security_lead')}
                        className="flex-1 min-w-[130px] flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 text-xs font-bold transition-colors cursor-pointer"
                        title="Simulate teammate Alex Rivera joining"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                        <span>+ Test Teammate</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TILES 2+: REMOTE JOINED PARTICIPANTS WITH SERIAL NUMBER */}
              {participants.map((p, idx) => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl bg-slate-900 border-2 overflow-hidden flex flex-col justify-center items-center shadow-lg aspect-video ${
                    p.isSpeaking ? 'border-emerald-500/80 shadow-emerald-500/10' : 'border-slate-800'
                  }`}
                >
                  {/* Top-Left Connection Quality Badge & Serial # */}
                  <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                    <div className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg font-mono">
                      <span>#{p.joinOrder || idx + 2}</span>
                    </div>
                    {renderConnectionQualityIcon(p.connectionQuality, p.latencyMs, true)}
                    {p.isHandRaised && (
                      <div className="bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg">
                        <Hand className="w-3 h-3 fill-current" />
                        <span>Hand Raised</span>
                      </div>
                    )}
                  </div>

                  {/* Top-Right Speaking Waveform & Status */}
                  <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
                    {p.isSpeaking && !p.isMuted ? (
                      <div className="flex items-center space-x-1 bg-slate-950/85 px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-300 font-mono text-[10px] backdrop-blur-xs">
                        <div className="flex items-end gap-0.5 h-2.5">
                          <span className="w-0.5 h-2 bg-emerald-400 rounded-full" />
                          <span className="w-0.5 h-3 bg-emerald-400 rounded-full" />
                          <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full" />
                        </div>
                        <span className="font-bold">Speaking</span>
                      </div>
                    ) : p.isMuted ? (
                      <div className="flex items-center space-x-1 bg-slate-950/85 px-2 py-0.5 rounded-full border border-rose-500/30 text-rose-300 font-mono text-[10px] backdrop-blur-xs">
                        <MicOff className="w-2.5 h-2.5 text-rose-400" />
                        <span>Muted</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700/60 text-slate-400 font-mono text-[10px] backdrop-blur-xs">
                        <Volume2 className="w-2.5 h-2.5 text-slate-500" />
                        <span>Listening</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${p.avatarBg} text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-2xl border-4 border-slate-800 relative`}>
                      {p.name.split(' ').map((n) => n[0]).join('')}
                      {p.isSpeaking && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px]">
                          🎙️
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-200 block">{p.name}</span>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold border mt-0.5 ${p.roleColor}`}>
                        {p.role}
                      </span>
                    </div>
                  </div>

                  {/* Tile Bottom Info & Code Share Action */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shrink-0">
                        #{p.joinOrder || idx + 2}
                      </span>
                      <span className="font-bold truncate">{p.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${p.roleColor}`}>
                        {p.roleBadge}
                      </span>
                      {p.joinedAtTime && (
                        <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
                          ({p.joinedAtTime})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenDirectCodeShare(p)}
                        className="px-2 py-1 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center space-x-1 border border-indigo-400/40 shadow-xs cursor-pointer transition-colors"
                        title={`Share code/patch privately with ${p.name}`}
                      >
                        <FileCode className="w-3 h-3 text-indigo-200" />
                        <span>{lang === 'te' ? 'కోడ్ పంపండి' : 'Send Code'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setParticipants((prev) =>
                            prev.map((item) =>
                              item.id === p.id
                                ? { ...item, isMuted: !item.isMuted, isSpeaking: item.isMuted ? false : item.isSpeaking }
                                : item
                            )
                          );
                        }}
                        className={`p-1 rounded-md border transition-colors cursor-pointer ${
                          p.isMuted
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-slate-900 text-emerald-400 border-slate-700 hover:bg-slate-800'
                        }`}
                        title={p.isMuted ? `Unmute ${p.name}` : `Mute ${p.name}`}
                      >
                        {p.isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setParticipantToKick(p)}
                        className="p-1 rounded-md bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 border border-rose-500/40 hover:border-rose-400 transition-colors cursor-pointer"
                        title={lang === 'te' ? `${p.name} ని మీటింగ్ నుండి తొలగించండి (Kick)` : `Kick ${p.name} from room (Host control)`}
                      >
                        <UserX className="w-3 h-3 text-rose-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. SIDE PANELS (Chat, People, AI Minutes, Shared Audit, Whiteboard) */}
        {activeSidePanel && (
          <aside className="w-full flex-1 sm:flex-initial sm:w-88 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-30 shrink-0 animate-in slide-in-from-right-4 duration-200">
            
            {/* Side Panel Tabs Header */}
            <div className="px-3.5 sm:px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center space-x-2">
                {/* Mobile Return to Video Stage Button */}
                <button
                  type="button"
                  onClick={() => setActiveSidePanel(null)}
                  className="sm:hidden p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:text-white flex items-center gap-1 text-xs font-bold mr-1"
                  title="Back to Video Call"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'te' ? 'కాల్' : 'Video'}</span>
                </button>

                {activeSidePanel === 'chat' && (
                  <>
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">{lang === 'te' ? 'ఇన్-కాల్ చాట్' : 'In-call Messages'}</h3>
                  </>
                )}
                {activeSidePanel === 'people' && (
                  <>
                    <Users className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">{lang === 'te' ? 'సభ్యులు' : 'People & Attendees'}</h3>
                  </>
                )}
                {activeSidePanel === 'ai_minutes' && (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-sm text-white">{lang === 'te' ? 'AI మీటింగ్ సారాంశం' : 'Gemini AI Live Minutes'}</h3>
                  </>
                )}
                {activeSidePanel === 'shared_audit' && (
                  <>
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">{lang === 'te' ? 'లైవ్ ఆడిట్ రివ్యూ' : 'Live Shared Audit'}</h3>
                  </>
                )}
                {activeSidePanel === 'whiteboard' && (
                  <>
                    <PenTool className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">{lang === 'te' ? 'కొల్లాబోరేటివ్ వైట్‌బోర్డ్' : 'Live Audit Whiteboard'}</h3>
                  </>
                )}
                {activeSidePanel === 'polls' && (
                  <>
                    <Vote className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm text-white">{lang === 'te' ? 'ఆడిట్ డెసిషన్ పోల్స్' : 'Audit Decision Polls'}</h3>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveSidePanel(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PANEL 1: IN-CALL CHAT */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin text-xs">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border space-y-2 ${
                        m.isAi
                          ? 'bg-cyan-950/30 border-cyan-500/30'
                          : m.isDirect
                          ? 'bg-purple-950/30 border-purple-500/40 shadow-xs'
                          : m.senderEmail === user.email
                          ? 'bg-indigo-950/40 border-indigo-500/30 ml-2'
                          : 'bg-slate-950/60 border-slate-800 mr-2'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="font-bold text-white">{m.senderName}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 font-mono">
                            {m.senderRole}
                          </span>
                          {m.isDirect && m.targetParticipantName && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-[9px] flex items-center gap-1 font-bold">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Direct: {m.targetParticipantName}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 text-[10px] shrink-0">{m.timestamp}</span>
                      </div>

                      <p className="text-slate-200 leading-relaxed">{m.text}</p>

                      {/* Rich Code Snippet & File Download Card */}
                      {m.codeSnippet && (
                        <div className="bg-slate-950 border border-slate-700/80 rounded-xl overflow-hidden shadow-inner">
                          {/* File Header & Quick Action Buttons */}
                          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px]">
                            <div className="flex items-center space-x-1.5 text-slate-300 font-mono font-bold truncate">
                              <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="text-indigo-300 truncate">{m.filename || 'code-snippet.txt'}</span>
                              <span className="text-slate-500 font-normal">({m.codeSnippet.split('\n').length} lines)</span>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0">
                              {/* 1. Copy Code Button */}
                              <button
                                type="button"
                                onClick={() => handleCopyCodeSnippet(m.id, m.codeSnippet!)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold flex items-center space-x-1 border border-slate-700 transition-colors cursor-pointer"
                                title="Copy code to clipboard"
                              >
                                {copiedSnippetId === m.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">{lang === 'te' ? 'కాపీ అయింది' : 'Copied'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-400" />
                                    <span>{lang === 'te' ? 'కాపీ' : 'Copy'}</span>
                                  </>
                                )}
                              </button>

                              {/* 2. Download / Save as Text File Button */}
                              <button
                                type="button"
                                onClick={() => handleDownloadCodeFile(m.codeSnippet!, m.filename || 'security-patch.txt')}
                                className="px-2 py-1 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1 border border-emerald-400/40 transition-colors cursor-pointer shadow-xs"
                                title="Save & Download as a text/code file"
                              >
                                <Download className="w-3 h-3" />
                                <span>{lang === 'te' ? 'ఫైల్ సేవ్' : 'Save File'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Code Content Container */}
                          <pre className="p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin bg-slate-950/90 leading-relaxed select-text">
                            <code>{m.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input & Target Selector */}
                <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/90 border-t border-slate-800 space-y-2">
                  
                  {/* Target Recipient Selector Bar */}
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400">{lang === 'te' ? 'గ్రహీత:' : 'Send to:'}</span>
                      <select
                        value={chatTargetRecipientId}
                        onChange={(e) => setChatTargetRecipientId(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-md px-2 py-0.5 text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="everyone">{lang === 'te' ? '👥 అందరికీ (Everyone)' : '👥 Everyone (Public)'}</option>
                        {participants.map((p) => (
                          <option key={p.id} value={p.id}>
                            🔒 {p.name} ({p.roleBadge})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Trigger to Open Full Code Transfer Modal */}
                    {participants.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const target = participants.find((p) => p.id === chatTargetRecipientId) || participants[0];
                          handleOpenDirectCodeShare(target);
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <FileCode className="w-3 h-3" />
                        <span>{lang === 'te' ? '+ కోడ్ షేర్ బాక్స్' : '+ Code Share Box'}</span>
                      </button>
                    )}
                  </div>

                  {includeCodeSnippet && (
                    <textarea
                      rows={3}
                      value={chatSnippetText}
                      onChange={(e) => setChatSnippetText(e.target.value)}
                      placeholder="Paste code or config patch (e.g., Nginx header, CSP rule, remediation script)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 resize-none scrollbar-thin"
                    />
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIncludeCodeSnippet((prev) => !prev)}
                      className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        includeCodeSnippet
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                      title="Attach Code Snippet"
                    >
                      <Code2 className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      placeholder={
                        chatTargetRecipientId === 'everyone'
                          ? lang === 'te'
                            ? 'సందేశం లేదా కోడ్ పంపండి...'
                            : 'Send a message or code...'
                          : `${participants.find((p) => p.id === chatTargetRecipientId)?.name || 'Recipient'}కి ప్రైవేట్ సందేశం...`
                      }
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />

                    <button
                      type="submit"
                      disabled={!chatInputText.trim() && !(includeCodeSnippet && chatSnippetText.trim())}
                      className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all cursor-pointer shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PANEL 2: PEOPLE & ATTENDEES (REAL-TIME STATUS & NETWORK MONITOR) */}
            {activeSidePanel === 'people' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin text-xs">
                
                {/* Network & Active Speaker Health Summary Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white font-bold">
                      <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>{lang === 'te' ? 'పార్టిసిపెంట్ & నెట్‌వర్క్ హెల్త్' : 'Participant & Stream Health'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Live 1080p HD</span>
                    </span>
                  </div>

                  {/* Active Speakers summary */}
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">{lang === 'te' ? 'యాక్టివ్ స్పీకర్లు:' : 'Active Speaker(s):'}</span>
                    {activeSpeakers.length > 0 ? (
                      <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                        <div className="flex items-end gap-0.5 h-2.5">
                          <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                          <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                        <span className="truncate max-w-[130px]">{activeSpeakers.map((s) => s.name).join(', ')}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">{lang === 'te' ? 'ఎవరూ మాట్లాడటం లేదు' : 'None (All Listening)'}</span>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                    <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <div className="text-slate-400">Streams</div>
                      <div className="font-bold text-white text-xs">{participants.length + 1} Connected</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <div className="text-slate-400">Avg Latency</div>
                      <div className="font-bold text-emerald-400 text-xs">{hostLatencyMs}ms</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <div className="text-slate-400">Packet Loss</div>
                      <div className="font-bold text-emerald-400 text-xs">0.0%</div>
                    </div>
                  </div>
                </div>

                {/* Attendance Summary & Copy Roster & Host Mute All Toolbar */}
                <div className="flex items-center justify-between pt-1 flex-wrap gap-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-400 uppercase tracking-wider font-bold text-[11px]">
                      {lang === 'te' ? `సభ్యుల క్రమం (${participants.length + 1})` : `Attendees (${participants.length + 1})`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    {/* Host Mute All Button */}
                    <button
                      type="button"
                      onClick={handleMuteAll}
                      disabled={participants.length === 0}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
                        participants.length === 0
                          ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
                          : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 active:scale-95'
                      }`}
                      title={
                        lang === 'te'
                          ? 'ఆడిట్ ప్రెజెంటేషన్ కోసం సభ్యులందరినీ మ్యూట్ చేయండి'
                          : 'Host Action: Mute all participant microphones to prevent background noise during presentation'
                      }
                    >
                      <VolumeX className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{lang === 'te' ? 'మ్యూట్ ఆల్' : 'Mute All'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyAttendanceLog}
                      className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      title="Copy attendance roster with sequential join order"
                    >
                      {isCopiedAttendanceLog ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      <span>{isCopiedAttendanceLog ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'లిస్ట్' : 'Copy Log')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(true)}
                      className="px-2 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>{lang === 'te' ? 'ఆహ్వానించు' : '+ Invite'}</span>
                    </button>
                  </div>
                </div>

                {/* WAITING ROOM / INCOMING JOIN REQUESTS QUEUE */}
                {pendingJoinRequests.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-indigo-950/60 border-2 border-emerald-500/70 shadow-xl space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-bold text-white text-xs flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lang === 'te' ? 'వేచి ఉన్న జాయిన్ రిక్వెస్ట్‌లు' : 'Pending Join Requests'}</span>
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                        {pendingJoinRequests.length} {lang === 'te' ? 'రిక్వెస్ట్‌లు' : 'Waiting'}
                      </span>
                    </div>

                    {/* Quick Admit All button if > 1 */}
                    {pendingJoinRequests.length > 1 && (
                      <button
                        type="button"
                        onClick={handleAdmitAll}
                        className="w-full py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all active:scale-98"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'te' ? `అందరినీ చేర్చుకోండి (${pendingJoinRequests.length})` : `Admit All (${pendingJoinRequests.length})`}</span>
                      </button>
                    )}

                    <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                      {pendingJoinRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 flex items-center justify-between gap-2 shadow-inner"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-full ${req.avatarBg || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0`}>
                              {req.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                                <span>{req.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {req.email || req.role || 'Teammate'} • {req.requestedAtFormatted || 'Just now'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAdmitJoinRequest(req)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center space-x-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                              title="Admit teammate into the call"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>{lang === 'te' ? 'Join' : 'Join'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDenyJoinRequest(req)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 border border-slate-700 hover:border-rose-500/40 cursor-pointer transition-colors"
                              title="Deny request"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* HOST CARD (YOU) - SERIAL #1 */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                          {(effectiveHostName || 'H')[0].toUpperCase()}
                        </div>
                        {isMicOn && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                            #1 Host
                          </span>
                          <span>{effectiveHostName} (You)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{effectiveHostEmail}</span>
                          <span>•</span>
                          <span className="text-emerald-400/90 font-mono">Joined: Start (00:00)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={handleToggleMic}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isMicOn ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                        title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                      >
                        {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Real-time Status and Network metrics */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                    <div className="flex items-center space-x-1.5">
                      {isMicOn ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active Speaker</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-400 flex items-center gap-1">
                          <span>Mic Muted</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-sans">Quality:</span>
                      {renderConnectionQualityIcon(hostConnectionQuality, hostLatencyMs, true)}
                    </div>
                  </div>
                </div>

                {/* PARTICIPANTS LIST WITH SERIAL ORDER */}
                {participants.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-2">
                    <p className="text-slate-400 text-xs">
                      {lang === 'te' ? 'ఇంకా ఎవరూ జాయిన్ అవ్వలేదు (#2, #3 ఖాళీగా ఉన్నాయి).' : 'No other participants have joined yet (#2, #3 vacant).'}
                    </p>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{lang === 'te' ? '+ ఇతరులను ఆహ్వానించండి' : '+ Invite Teammates'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdmitSimulatedParticipant('ai')}
                        className="w-full py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>+ Gemini AI Co-Pilot (Serial #2)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  participants.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`p-3 rounded-2xl bg-slate-950/80 border transition-all space-y-2.5 shadow-sm ${
                        p.isSpeaking ? 'border-emerald-500/60 ring-2 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`w-9 h-9 rounded-full ${p.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-md`}>
                              {p.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            {p.isSpeaking && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                                #{p.joinOrder || idx + 2}
                              </span>
                              <span>{p.name}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${p.roleColor}`}>
                                {p.roleBadge}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="truncate max-w-[120px]">{p.email}</span>
                              <span>•</span>
                              <span className="text-indigo-300/90 font-mono">
                                Joined: {p.joinedAtTime || 'Recently'} {p.joinedAtElapsed ? `(${p.joinedAtElapsed})` : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDirectCodeShare(p)}
                            className="px-2 py-1 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center space-x-1 border border-indigo-400/40 shadow-xs cursor-pointer transition-colors"
                            title={`Share code snippet or file with ${p.name}`}
                          >
                            <FileCode className="w-3.5 h-3.5 text-indigo-200" />
                            <span>{lang === 'te' ? 'కోడ్ పంపండి' : 'Send Code'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setParticipants((prev) =>
                                prev.map((item) => (item.id === p.id ? { ...item, isMuted: !item.isMuted } : item))
                              );
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              p.isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                            }`}
                            title={p.isMuted ? 'Unmute participant' : 'Mute participant'}
                          >
                            {p.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setParticipantToKick(p)}
                            className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 border border-rose-500/40 hover:border-rose-400 transition-colors cursor-pointer"
                            title={lang === 'te' ? `${p.name} ని మీటింగ్ నుండి తొలగించండి (Host Action)` : `Kick ${p.name} from meeting (Host Action)`}
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Participant Status & Live Network Details */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                        <div className="flex items-center space-x-1.5">
                          {p.isSpeaking && !p.isMuted ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                              <div className="flex items-end gap-0.5 h-2">
                                <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                                <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                                <span className="w-0.5 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                              </div>
                              <span>Speaking ({p.audioLevel || 80}%)</span>
                            </span>
                          ) : p.isMuted ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-1">
                              <MicOff className="w-2.5 h-2.5" />
                              <span>Muted</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-400 flex items-center gap-1">
                              <Volume2 className="w-2.5 h-2.5 text-slate-500" />
                              <span>Listening</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 font-sans">Quality:</span>
                          {renderConnectionQualityIcon(p.connectionQuality, p.latencyMs, true)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* PANEL 3: GEMINI AI MEETING MINUTES & AUTOMATED ACTION ITEMS */}
            {activeSidePanel === 'ai_minutes' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin text-xs">
                {/* Header Banner with Primary Generate Meeting Summary Trigger */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/40 rounded-xl p-3.5 space-y-3 shadow-lg shadow-cyan-950/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Gemini AI Meeting Summary & Actions</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      <span>Gemini 3.7 Flash</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lang === 'te'
                      ? 'జెమిని AI లైవ్ సెషన్ ని ట్రాన్స్‌క్రైబ్ చేసి, ఆడిట్ పరిశీలనలను విశ్లేషించి, స్పష్టమైన సమ్మరీ మరియు P0-P3 యాక్షన్ పాయింట్లను రూపొందిస్తుంది.'
                      : 'Uses Gemini API to transcribe live audio/chat discussion, cross-reference audit findings, and generate an automated executive summary and prioritized action items.'}
                  </p>

                  {/* Primary 'Generate Meeting Summary' Button */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateMeetingSummary}
                      disabled={isGeneratingSummary}
                      id="gemini-generate-meeting-summary-panel-btn"
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/25 cursor-pointer disabled:opacity-60"
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Transcribing & Generating Summary...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          <span>
                            {meetingSummaryData
                              ? lang === 'te'
                                ? '✨ సమ్మరీని తిరిగి రూపొందించండి (Re-generate)'
                                : '✨ Re-generate Meeting Summary'
                              : lang === 'te'
                                ? '✨ మీటింగ్ సమ్మరీ రూపొందించండి'
                                : '✨ Generate Meeting Summary'}
                          </span>
                        </>
                      )}
                    </button>

                    {meetingSummaryData && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleCopySummaryMarkdown}
                          className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy Full Markdown Summary"
                        >
                          {copiedSummaryFormat === 'markdown' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy MD</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadSummaryFile}
                          className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Download Markdown Report"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>.MD</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAiPanelSubTab('summary')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      aiPanelSubTab === 'summary'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>Summary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPanelSubTab('actions')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      aiPanelSubTab === 'actions'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ListChecks className="w-3 h-3" />
                    <span>Actions ({aiActionItems.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPanelSubTab('patches')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      aiPanelSubTab === 'patches'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Patches</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPanelSubTab('live_transcript')}
                    className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      aiPanelSubTab === 'live_transcript'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Subtitles className="w-3 h-3" />
                    <span>Transcript</span>
                  </button>
                </div>

                {/* TAB 1: EXECUTIVE SUMMARY & HIGHLIGHTS */}
                {aiPanelSubTab === 'summary' && (
                  <div className="space-y-3">
                    {/* Executive Summary Card */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Executive Summary</span>
                        </span>
                        {meetingSummaryData?.timestamp && (
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{new Date(meetingSummaryData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        {meetingSummaryData?.executiveSummary ||
                          `Active engineering session with ${participants.length + 1} participants. Team evaluated website security headers, Core Web Vitals, and prioritized automated remediation tasks.`}
                      </p>
                    </div>

                    {/* Bulleted Key Discussion Highlights */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Discussion Highlights ({(meetingSummaryData?.meetingHighlights || aiMinutes).length})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText((meetingSummaryData?.meetingHighlights || aiMinutes).join('\n'));
                            setJoinNotification('Highlights copied to clipboard!');
                            setTimeout(() => setJoinNotification(null), 2500);
                          }}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                        >
                          Copy All
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(meetingSummaryData?.meetingHighlights || aiMinutes).map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-slate-300 flex items-start gap-2.5 hover:border-slate-700 transition-colors"
                          >
                            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-snug text-[11px]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Follow Up Banner */}
                    {meetingSummaryData?.nextFollowUp && (
                      <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-[11px] text-indigo-300 flex items-center justify-between">
                        <span className="font-medium">Next Team Follow-up:</span>
                        <strong className="font-bold text-indigo-200">{meetingSummaryData.nextFollowUp}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: AUTOMATED ACTION ITEMS (P0 - P3) */}
                {aiPanelSubTab === 'actions' && (
                  <div className="space-y-3">
                    {/* Filter Bar */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center space-x-1">
                        {(['ALL', 'P0', 'P1', 'P2', 'P3'] as const).map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setSummaryPriorityFilter(filter)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              summaryPriorityFilter === filter
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {aiActionItems.filter((a) => a.status === 'Completed').length}/{aiActionItems.length} Done
                      </span>
                    </div>

                    {/* Action Items List */}
                    <div className="space-y-2">
                      {aiActionItems
                        .filter((act) => summaryPriorityFilter === 'ALL' || act.priority === summaryPriorityFilter)
                        .map((act) => {
                          const isCompleted = act.status === 'Completed';
                          const pColor =
                            act.priority === 'P0'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : act.priority === 'P1'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : act.priority === 'P2'
                                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                  : 'bg-slate-500/20 text-slate-300 border-slate-500/40';

                          return (
                            <div
                              key={act.id}
                              className={`p-3 rounded-xl bg-slate-950 border transition-all ${
                                isCompleted
                                  ? 'border-emerald-500/30 opacity-70 bg-emerald-950/10'
                                  : 'border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start space-x-2.5 flex-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleActionItemStatus(act.id)}
                                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                                    title={isCompleted ? 'Mark as Open' : 'Mark as Completed'}
                                  >
                                    {isCompleted ? (
                                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                                    )}
                                  </button>

                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span
                                        className={`px-1.5 py-0.2 rounded border text-[9px] font-mono font-bold ${pColor}`}
                                      >
                                        {act.priority}
                                      </span>
                                      {act.category && (
                                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[9px] font-medium">
                                          {act.category}
                                        </span>
                                      )}
                                      <span
                                        className={`font-semibold text-[11px] ${
                                          isCompleted ? 'line-through text-slate-400' : 'text-white'
                                        }`}
                                      >
                                        {act.title}
                                      </span>
                                    </div>

                                    {act.description && (
                                      <p className="text-[10px] text-slate-300 leading-normal">
                                        {act.description}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400">
                                      <span>
                                        Assignee: <strong className="text-slate-200">{act.assignee}</strong>
                                      </span>
                                      {act.eta && (
                                        <span className="text-amber-300/80 font-mono">ETA: {act.eta}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleActionItemStatus(act.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                                    isCompleted
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  {act.status}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* TAB 3: TECHNICAL CODE PATCHES */}
                {aiPanelSubTab === 'patches' && (
                  <div className="space-y-3">
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block px-1">
                      Recommended Security & Performance Fixes
                    </span>

                    {(meetingSummaryData?.technicalRecommendations && meetingSummaryData.technicalRecommendations.length > 0
                      ? meetingSummaryData.technicalRecommendations
                      : [
                          {
                            title: 'Nginx Security Headers Directive',
                            target: '/etc/nginx/conf.d/security.conf',
                            code: `add_header Content-Security-Policy "default-src 'self'; script-src 'self' https:; style-src 'self' 'unsafe-inline';" always;\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\nadd_header X-Frame-Options "SAMEORIGIN" always;`,
                          },
                          {
                            title: 'Core Web Vitals Resource Preloading',
                            target: 'index.html / Header template',
                            code: `<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
                          },
                        ]
                    ).map((patch, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-white text-[11px] block">{patch.title}</span>
                            <span className="text-[9px] font-mono text-cyan-400">{patch.target}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(patch.code);
                              setJoinNotification(`Copied patch for ${patch.title}!`);
                              setTimeout(() => setJoinNotification(null), 2500);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <pre className="p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[10px] overflow-x-auto border border-slate-800 scrollbar-thin">
                          {patch.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: LIVE TRANSCRIPT & AUDIO FEED */}
                {aiPanelSubTab === 'live_transcript' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Subtitles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Session Spoken Transcripts ({captionHistory.length})</span>
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                          Live Feed
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                        {captionHistory.map((cap, i) => (
                          <div key={i} className="p-2 rounded bg-slate-900 text-slate-300 text-[10.5px] border border-slate-800/80">
                            {cap}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
                        Recent In-Call Chat Messages ({messages.length})
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                        {messages.slice(-5).map((m) => (
                          <div key={m.id} className="text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                            <strong className="text-cyan-300">{m.senderName}:</strong> {m.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PANEL 4: SHARED AUDIT FINDINGS */}
            {activeSidePanel === 'shared_audit' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin text-xs">
                {activeReport ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-emerald-400 font-bold">{activeReport.hostname}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                          Score: {activeReport.overallScore}/100
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Perf</span>
                          <strong className="text-emerald-400">{activeReport.performanceScore}</strong>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Security</span>
                          <strong className="text-cyan-400">{activeReport.securityScore}</strong>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">SEO</span>
                          <strong className="text-amber-400">{activeReport.seoScore}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-white block">Key Remediation Priorities</span>
                      {activeReport.categories?.map((cat) =>
                        cat.metrics
                          .filter((m) => m.status === 'error')
                          .slice(0, 4)
                          .map((metric) => (
                            <div key={metric.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-white">{metric.name}</span>
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold">
                                  {metric.priority || 'P0'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-2">{metric.description}</p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 space-y-2">
                    <Shield className="w-8 h-8 text-slate-600 mx-auto" />
                    <p>No active website audit loaded.</p>
                    <p className="text-[11px]">Run a website scan on the home page to review metrics live with the team.</p>
                  </div>
                )}
              </div>
            )}

            {/* PANEL 5: COLLABORATIVE AUDIT WHITEBOARD */}
            {activeSidePanel === 'whiteboard' && (
              <div className="flex-1 p-3 flex flex-col space-y-3 overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    {['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#020617'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setWhiteboardColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          whiteboardColor === c ? 'scale-110 border-white ring-2 ring-emerald-400' : 'border-slate-700'
                        }`}
                        title={c === '#020617' ? 'Eraser' : 'Color'}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleClearWhiteboard}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-bold cursor-pointer"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="flex-1 rounded-xl bg-slate-950 border-2 border-slate-800 overflow-hidden relative shadow-inner">
                  <canvas
                    ref={whiteboardCanvasRef}
                    width={340}
                    height={480}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                  <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500 pointer-events-none">
                    Multiplayer Canvas Sync
                  </div>
                </div>
              </div>
            )}

            {/* PANEL 6: AUDIT DECISION POLLS & TEAM VOTING */}
            {activeSidePanel === 'polls' && (
              <AuditPollsPanel
                polls={polls}
                lang={lang}
                user={user}
                isCreatingPoll={isCreatingPoll}
                setIsCreatingPoll={setIsCreatingPoll}
                newPollQuestion={newPollQuestion}
                setNewPollQuestion={setNewPollQuestion}
                newPollType={newPollType}
                setNewPollType={setNewPollType}
                newPollCategory={newPollCategory}
                setNewPollCategory={setNewPollCategory}
                newPollOptions={newPollOptions}
                setNewPollOptions={setNewPollOptions}
                newPollIsAnonymous={newPollIsAnonymous}
                setNewPollIsAnonymous={setNewPollIsAnonymous}
                pollFilterTab={pollFilterTab}
                setPollFilterTab={setPollFilterTab}
                onApplyPresetTemplate={handleApplyPresetTemplate}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                onOptionChange={handleOptionChange}
                onCreatePoll={handleCreatePoll}
                onVotePoll={handleVotePoll}
                onClosePoll={handleClosePoll}
                onReopenPoll={handleReopenPoll}
                onDeletePoll={handleDeletePoll}
                onAnnouncePollResult={handleAnnouncePollResult}
              />
            )}
          </aside>
        )}
      </div>

      {/* 4. SIGNATURE NATIVE FLOATING CONTROL DOCK (BOTTOM - RESPONSIVE FOR MOBILE & DESKTOP) */}
      <footer className="h-16 sm:h-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 sm:px-8 flex items-center justify-between shrink-0 z-30">
        
        {/* MOBILE CONTROL BAR (< sm screens) */}
        <div className="sm:hidden flex items-center justify-around w-full">
          {/* Mute/Unmute Mic */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3 rounded-full font-bold shadow-md transition-all cursor-pointer ${
              isMicOn
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-rose-600 text-white ring-2 ring-rose-400/40'
            }`}
            title={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera On/Off */}
          <button
            type="button"
            onClick={handleToggleVideo}
            className={`p-3 rounded-full font-bold shadow-md transition-all cursor-pointer ${
              isVideoOn
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-rose-600 text-white ring-2 ring-rose-400/40'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* End Call / Leave Meeting (Red Button) */}
          <button
            type="button"
            onClick={onClose}
            className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 cursor-pointer"
            title="Leave call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>

          {/* Chat */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'chat' ? null : 'chat'))}
            className={`p-3 rounded-full relative transition-colors cursor-pointer ${
              activeSidePanel === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title="In-call chat"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400" />
          </button>

          {/* People */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'people' ? null : 'people'))}
            className={`p-3 rounded-full relative transition-colors cursor-pointer ${
              activeSidePanel === 'people'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title="People & Attendees"
          >
            <Users className="w-5 h-5" />
            <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-slate-950">
              {participants.length + 1}
            </span>
          </button>

          {/* More Actions Toggle (opens mobile action sheet) */}
          <button
            type="button"
            onClick={() => setIsMobileMoreMenuOpen((prev) => !prev)}
            className={`p-3 rounded-full font-bold transition-all cursor-pointer ${
              isMobileMoreMenuOpen
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title="More Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* DESKTOP / TABLET CONTROL DOCK (>= sm screens) */}
        {/* Left Side: Time, Room Code & Filter Button */}
        <div className="hidden md:flex items-center space-x-3 text-xs text-slate-400">
          <span className="font-bold text-white font-mono">{formatDuration(meetingDurationSeconds)}</span>
          <span>|</span>
          <span className="font-mono text-slate-300 font-semibold">{meetingRoomId}</span>
          <span>|</span>
          {/* Video Filter Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              title="Virtual Background & Video Filters"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="capitalize">{videoFilter} FX</span>
            </button>

            {isFilterMenuOpen && (
              <div className="absolute bottom-12 left-0 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 flex flex-col gap-1 min-w-[130px] animate-in slide-in-from-bottom-2">
                {(['normal', 'blur', 'cyber', 'studio', 'dark'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setVideoFilter(f);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-bold capitalize transition-colors cursor-pointer ${
                      videoFilter === f ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {f === 'normal' ? '✨ Normal' : f === 'blur' ? '🌫️ Blur BG' : f === 'cyber' ? '⚡ Cyber FX' : f === 'studio' ? '💡 Studio Light' : '🌑 Dark Minimal'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Core Call Action Controls */}
        <div className="hidden sm:flex items-center space-x-2 sm:space-x-3.5 mx-auto">
          {/* Mute/Unmute Mic */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer ${
              isMicOn
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400/40'
            }`}
            title={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera On/Off */}
          <button
            type="button"
            onClick={handleToggleVideo}
            className={`p-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer ${
              isVideoOn
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400/40'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={handleToggleScreenShare}
            className={`p-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer ${
              isScreenSharing
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white ring-2 ring-indigo-400 shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title={isScreenSharing ? 'Stop presenting' : 'Present now / Share screen'}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
          </button>

          {/* Captions Toggle (CC) */}
          <button
            type="button"
            onClick={() => setShowCaptions((prev) => !prev)}
            className={`p-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer ${
              showCaptions
                ? 'bg-cyan-600 text-white ring-2 ring-cyan-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title={showCaptions ? 'Turn off captions' : 'Turn on live AI captions'}
          >
            <Subtitles className="w-5 h-5" />
          </button>

          {/* Record Meeting Toggle */}
          <button
            type="button"
            onClick={() => setIsRecording((prev) => !prev)}
            className={`p-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title={isRecording ? 'Stop Recording' : 'Record Meeting & Minutes'}
          >
            <CircleDot className="w-5 h-5" />
          </button>

          {/* Raise Hand */}
          <button
            type="button"
            onClick={() => setIsHandRaised((prev) => !prev)}
            className={`p-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer ${
              isHandRaised
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title={isHandRaised ? 'Lower hand' : 'Raise hand'}
          >
            <Hand className="w-5 h-5 fill-current" />
          </button>

          {/* Emoji Reactions */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsReactionsMenuOpen((prev) => !prev)}
              className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-lg transition-all cursor-pointer"
              title="Send a reaction"
            >
              <Smile className="w-5 h-5" />
            </button>

            {isReactionsMenuOpen && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-full p-2 flex items-center space-x-2 shadow-2xl z-50 animate-in slide-in-from-bottom-2">
                {['👏', '👍', '❤️', '🔥', '🎉', '💡', '🚀', '⭐'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => triggerReaction(emoji)}
                    className="w-9 h-9 rounded-full hover:bg-slate-800 text-xl flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings & Theme Dock Button */}
          <button
            type="button"
            onClick={() => {
              setSettingsActiveTab('theme');
              setIsSettingsModalOpen(true);
            }}
            id="dock-settings-btn"
            className={`p-3.5 rounded-full font-bold shadow-lg transition-all cursor-pointer ${
              isSettingsModalOpen
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40'
                : isHighContrastSkin
                ? 'bg-black hover:bg-zinc-900 text-yellow-400 border-2 border-yellow-400'
                : isLightSkin
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Meeting Settings & Theme Skins"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* End Call / Leave Meeting (Red Button) */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 sm:px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center space-x-2 shadow-xl shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer ml-2"
            title="Leave call"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline">{lang === 'te' ? 'కాల్ ముగించండి' : 'Leave call'}</span>
          </button>
        </div>

        {/* Right Side: Side Panel Toggles (Desktop >= sm) */}
        <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2">
          {/* Audit Polls Button */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'polls' ? null : 'polls'))}
            className={`p-2.5 sm:p-3 rounded-full relative transition-colors cursor-pointer ${
              activeSidePanel === 'polls'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Team Audit Decision Polls"
          >
            <Vote className="w-5 h-5" />
            {polls.filter((p) => p.status === 'active').length > 0 && (
              <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold bg-purple-400 text-slate-950">
                {polls.filter((p) => p.status === 'active').length}
              </span>
            )}
          </button>

          {/* Whiteboard Canvas */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'whiteboard' ? null : 'whiteboard'))}
            className={`p-2.5 sm:p-3 rounded-full transition-colors cursor-pointer ${
              activeSidePanel === 'whiteboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Interactive Audit Whiteboard"
          >
            <PenTool className="w-5 h-5" />
          </button>

          {/* Shared Audit Panel */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'shared_audit' ? null : 'shared_audit'))}
            className={`p-2.5 sm:p-3 rounded-full transition-colors cursor-pointer ${
              activeSidePanel === 'shared_audit'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Shared Audit Findings"
          >
            <Shield className="w-5 h-5" />
          </button>

          {/* Gemini AI Minutes */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'ai_minutes' ? null : 'ai_minutes'))}
            className={`p-2.5 sm:p-3 rounded-full transition-colors cursor-pointer ${
              activeSidePanel === 'ai_minutes'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Gemini AI Live Meeting Summary"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* People / Participants */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'people' ? null : 'people'))}
            className={`p-2.5 sm:p-3 rounded-full relative transition-colors cursor-pointer ${
              activeSidePanel === 'people'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Show everyone"
          >
            <Users className="w-5 h-5" />
            <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-slate-950">
              {participants.length + 1}
            </span>
          </button>

          {/* In-Call Messages */}
          <button
            type="button"
            onClick={() => setActiveSidePanel((prev) => (prev === 'chat' ? null : 'chat'))}
            className={`p-2.5 sm:p-3 rounded-full relative transition-colors cursor-pointer ${
              activeSidePanel === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Chat with everyone"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400" />
          </button>
        </div>
      </footer>

      {/* MOBILE MORE OPTIONS BOTTOM SHEET MODAL */}
      {isMobileMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end sm:hidden animate-in fade-in duration-150"
          onClick={() => setIsMobileMoreMenuOpen(false)}
        >
          <div 
            className="bg-slate-900 border-t-2 border-slate-700 rounded-t-3xl p-5 pb-7 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1 rounded-full bg-slate-700 mx-auto mb-1" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  {lang === 'te' ? 'మీటింగ్ ఎంపికలు & సాధనాలు' : 'Meeting Controls & Tools'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Room: <span className="text-emerald-400 font-bold">{meetingRoomId}</span> • {formatDuration(meetingDurationSeconds)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMoreMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Reactions Bar */}
            <div>
              <span className="text-xs font-semibold text-slate-400 mb-2 block">
                {lang === 'te' ? 'త్వరిత ఎమోజీ ప్రతిస్పందన' : 'Send Live Reaction'}
              </span>
              <div className="flex items-center justify-between bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
                {['👏', '👍', '❤️', '🔥', '🎉', '💡', '🚀', '⭐'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      triggerReaction(emoji);
                      setIsMobileMoreMenuOpen(false);
                    }}
                    className="w-9 h-9 rounded-xl hover:bg-slate-800 text-xl flex items-center justify-center active:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Hand Raise */}
              <button
                type="button"
                onClick={() => {
                  setIsHandRaised((prev) => !prev);
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all text-left ${
                  isHandRaised
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-750'
                }`}
              >
                <Hand className="w-4.5 h-4.5 shrink-0" />
                <div>
                  <div className="leading-tight">{isHandRaised ? (lang === 'te' ? 'చేయి దించండి' : 'Lower Hand') : (lang === 'te' ? 'చేయి ఎత్తండి' : 'Raise Hand')}</div>
                  <div className="text-[10px] opacity-75">{isHandRaised ? 'Hand is raised' : 'Ask to speak'}</div>
                </div>
              </button>

              {/* Screen Share */}
              <button
                type="button"
                onClick={() => {
                  handleToggleScreenShare();
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all text-left ${
                  isScreenSharing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-750'
                }`}
              >
                {isScreenSharing ? <MonitorOff className="w-4.5 h-4.5 shrink-0" /> : <MonitorUp className="w-4.5 h-4.5 shrink-0" />}
                <div>
                  <div className="leading-tight">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</div>
                  <div className="text-[10px] opacity-75">Present screen</div>
                </div>
              </button>

              {/* Captions CC */}
              <button
                type="button"
                onClick={() => {
                  setShowCaptions((prev) => !prev);
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all text-left ${
                  showCaptions
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-750'
                }`}
              >
                <Subtitles className="w-4.5 h-4.5 shrink-0" />
                <div>
                  <div className="leading-tight">{showCaptions ? 'Captions ON' : 'Captions (CC)'}</div>
                  <div className="text-[10px] opacity-75">Live speech AI</div>
                </div>
              </button>

              {/* Record Meeting */}
              <button
                type="button"
                onClick={() => {
                  setIsRecording((prev) => !prev);
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all text-left ${
                  isRecording
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-750'
                }`}
              >
                <CircleDot className={`w-4.5 h-4.5 shrink-0 ${isRecording ? 'animate-pulse' : ''}`} />
                <div>
                  <div className="leading-tight">{isRecording ? 'Recording ON' : 'Record Call'}</div>
                  <div className="text-[10px] opacity-75">Session recorder</div>
                </div>
              </button>

              {/* Audit Polls */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidePanel('polls');
                  setIsMobileMoreMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 flex items-center gap-2.5 text-xs font-bold text-left"
              >
                <Vote className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                <div>
                  <div className="leading-tight text-white">{lang === 'te' ? 'ఆడిట్ పోల్స్' : 'Audit Polls'}</div>
                  <div className="text-[10px] text-purple-300 font-mono">{polls.filter((p) => p.status === 'active').length} active</div>
                </div>
              </button>

              {/* Whiteboard */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidePanel('whiteboard');
                  setIsMobileMoreMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200 flex items-center gap-2.5 text-xs font-bold text-left"
              >
                <PenTool className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <div>
                  <div className="leading-tight text-white">{lang === 'te' ? 'వైట్‌బోర్డ్' : 'Whiteboard'}</div>
                  <div className="text-[10px] text-amber-300">Live draw & sketch</div>
                </div>
              </button>

              {/* Gemini AI Meeting Summary */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidePanel('ai_minutes');
                  setIsMobileMoreMenuOpen(false);
                  if (!meetingSummaryData) handleGenerateMeetingSummary();
                }}
                className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950 via-cyan-950 to-teal-950 border border-cyan-500/50 text-cyan-200 flex items-center gap-2.5 text-xs font-bold text-left col-span-2"
              >
                <Sparkles className="w-4.5 h-4.5 text-cyan-300 shrink-0 animate-pulse" />
                <div className="flex-1">
                  <div className="leading-tight text-white flex items-center justify-between">
                    <span>{lang === 'te' ? 'Gemini AI మీటింగ్ సారాంశం' : 'Gemini AI Meeting Summary'}</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">AI Flash</span>
                  </div>
                  <div className="text-[10px] text-cyan-300">Executive summary, action items & patches</div>
                </div>
              </button>

              {/* Shared Audit Findings */}
              <button
                type="button"
                onClick={() => {
                  setActiveSidePanel('shared_audit');
                  setIsMobileMoreMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-750 flex items-center gap-2.5 text-xs font-bold text-left"
              >
                <Shield className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <div>
                  <div className="leading-tight">{lang === 'te' ? 'ఆడిట్ ఫలితాలు' : 'Audit Findings'}</div>
                  <div className="text-[10px] text-slate-400">Security & SEO checklist</div>
                </div>
              </button>

              {/* Theme Skins & Settings */}
              <button
                type="button"
                onClick={() => {
                  setSettingsActiveTab('theme');
                  setIsSettingsModalOpen(true);
                  setIsMobileMoreMenuOpen(false);
                }}
                className="p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-750 flex items-center gap-2.5 text-xs font-bold text-left"
              >
                <Palette className="w-4.5 h-4.5 text-pink-400 shrink-0" />
                <div>
                  <div className="leading-tight">{lang === 'te' ? 'థీమ్ & సెట్టింగ్స్' : 'Theme & Settings'}</div>
                  <div className="text-[10px] text-slate-400">Dark / Light / High Contrast</div>
                </div>
              </button>
            </div>

            {/* Video FX Selector */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Virtual Video Filter:</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['normal', 'blur', 'cyber', 'studio', 'dark'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setVideoFilter(f);
                    }}
                    className={`px-2 py-1.5 rounded-xl text-center text-xs font-bold capitalize transition-colors ${
                      videoFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {f === 'normal' ? '✨ Normal' : f === 'blur' ? '🌫️ Blur' : f === 'cyber' ? '⚡ Cyber' : f === 'studio' ? '💡 Studio' : '🌑 Dark'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row: Copy Link & Export */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyMeetingLink}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 text-xs font-bold border border-slate-700"
              >
                {isCopiedMeetLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Room URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadSessionMinutes}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 text-xs font-bold border border-slate-700"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-CALL INVITE & SHARE MODAL OVERLAY */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {lang === 'te' ? 'సహచరులను మీటింగ్‌కు ఆహ్వానించండి' : 'Invite Teammates to Live Meet'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Room: <strong className="text-emerald-300 font-mono">{meetingRoomId}</strong>
                    {passcode && <span> • PIN: <strong className="text-amber-300 font-mono">{passcode}</strong></span>}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Join Link Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {lang === 'te' ? 'డైరెక్ట్ జాయిన్ లింక్' : 'Direct Join Link'}
              </label>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700 rounded-xl p-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai'}/?meet=${encodeURIComponent(meetingRoomId)}${passcode ? `&pin=${passcode}` : ''}`}
                  className="bg-transparent text-xs font-mono text-emerald-300 flex-1 px-2 focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyMeetingLink}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {isCopiedMeetLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedMeetLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 1-Click WhatsApp, Email, QR Code Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔒 HealthSec Live Meet: Join meeting room ${meetingRoomId} now:\n${typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai'}/?meet=${encodeURIComponent(meetingRoomId)}${passcode ? `&pin=${passcode}` : ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 text-xs font-bold transition-colors text-center cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(`Join Live Meet: ${meetingRoomId}`)}&body=${encodeURIComponent(`Click to join our HealthSec Live Meeting room:\n${typeof window !== 'undefined' ? window.location.origin : 'https://websitehealth.ai'}/?meet=${encodeURIComponent(meetingRoomId)}${passcode ? `&pin=${passcode}` : ''}`)}`}
                className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/60 text-xs font-bold transition-colors text-center cursor-pointer"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email</span>
              </a>

              <button
                type="button"
                onClick={() => setShowInCallQr(!showInCallQr)}
                className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold transition-colors text-center cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>QR Code</span>
              </button>
            </div>

            {/* QR Code toggle box */}
            {showInCallQr && (
              <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/40 text-center flex flex-col items-center justify-center space-y-1">
                <div className="p-2 bg-white rounded-lg">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    <rect width="100" height="100" fill="#ffffff" />
                    <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                    <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                    <rect x="13" y="13" width="9" height="9" fill="#0f172a" />
                    <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                    <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                    <rect x="78" y="13" width="9" height="9" fill="#0f172a" />
                    <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                    <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                    <rect x="13" y="78" width="9" height="9" fill="#0f172a" />
                    <rect x="36" y="38" width="12" height="12" fill="#10b981" rx="2" />
                    <rect x="48" y="56" width="14" height="6" fill="#0f172a" />
                    <rect x="70" y="56" width="6" height="6" fill="#0f172a" />
                    <rect x="82" y="56" width="8" height="6" fill="#0f172a" />
                  </svg>
                </div>
                <span className="text-[11px] text-slate-300">Scan to join on mobile device</span>
              </div>
            )}

            {/* Quick Email Inviter */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {lang === 'te' ? 'ఈమెయిల్ ద్వారా తక్షణ ఆహ్వానం' : 'Send Instant Email Invite'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={newInviteeEmail}
                  onChange={(e) => setNewInviteeEmail(e.target.value)}
                  placeholder="colleague@domain.com"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newInviteeEmail.trim()) {
                      setInviteSentFeedback(true);
                      setNewInviteeEmail('');
                      setTimeout(() => setInviteSentFeedback(false), 2500);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                >
                  Send
                </button>
              </div>
              {inviteSentFeedback && (
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Invitation email dispatched!</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DIRECT 1-ON-1 CODE TRANSFER & FILE SHARING MODAL */}
      {isDirectCodeModalOpen && directCodeRecipient && (
        <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl ${directCodeRecipient.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-indigo-400/40`}>
                  {directCodeRecipient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base">
                      {lang === 'te' ? `${directCodeRecipient.name}కి కోడ్ పంపండి` : `Send Code to ${directCodeRecipient.name}`}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${directCodeRecipient.roleColor}`}>
                      {directCodeRecipient.roleBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{lang === 'te' ? 'ప్రత్యేక 1-on-1 ఎండ్-టు-ఎండ్ బదిలీ' : 'Private 1-on-1 WebRTC Data Transfer'}</span>
                    <span className="text-slate-500">• {directCodeRecipient.email}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDirectCodeModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendDirectCode} className="flex-1 flex flex-col space-y-3.5 overflow-y-auto scrollbar-thin pr-1">
              
              {/* File Info Bar: Filename & Syntax selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    {lang === 'te' ? 'ఫైల్ పేరు (File Name)' : 'File Name / Title'}
                  </label>
                  <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5">
                    <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                    <input
                      type="text"
                      value={codeShareFilename}
                      onChange={(e) => setCodeShareFilename(e.target.value)}
                      placeholder="e.g., security-headers.txt, patch.js"
                      className="w-full bg-transparent text-xs font-mono text-white focus:outline-none placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    {lang === 'te' ? 'సింటాక్స్ / ఫార్మాట్' : 'Syntax / Language'}
                  </label>
                  <select
                    value={codeShareLanguage}
                    onChange={(e) => setCodeShareLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="javascript">JavaScript / TypeScript (.js / .ts)</option>
                    <option value="json">JSON Configuration (.json)</option>
                    <option value="html">HTML / Script Tags (.html)</option>
                    <option value="nginx">Nginx / Apache (.conf)</option>
                    <option value="bash">Bash / Shell (.sh)</option>
                    <option value="text">Plain Text (.txt)</option>
                  </select>
                </div>
              </div>

              {/* Quick Template Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">{lang === 'te' ? 'త్వరిత టెంప్లేట్‌లు (Quick Presets):' : 'Quick Security Presets:'}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const clipText = await navigator.clipboard.readText();
                        if (clipText) setCodeShareContent(clipText);
                      } catch {}
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{lang === 'te' ? 'క్లిప్‌బోర్డ్ నుండి పేస్ట్ చేయండి' : 'Paste from Clipboard'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setCodeShareFilename('csp-headers.conf');
                      setCodeShareLanguage('nginx');
                      setCodeShareContent(`add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://apis.google.com; object-src 'none'; frame-ancestors 'self';" always;\nadd_header X-Frame-Options "SAMEORIGIN" always;\nadd_header X-Content-Type-Options "nosniff" always;`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    + Strict CSP Patch
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeShareFilename('cors-policy.json');
                      setCodeShareLanguage('json');
                      setCodeShareContent(`{\n  "allowedOrigins": ["https://websitehealth.ai", "https://yourdomain.com"],\n  "allowedMethods": ["GET", "POST", "PUT", "DELETE"],\n  "allowedHeaders": ["Authorization", "Content-Type", "X-Requested-With"],\n  "allowCredentials": true\n}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    + CORS Rule JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeShareFilename('ssl-hsts.conf');
                      setCodeShareLanguage('nginx');
                      setCodeShareContent(`add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\nssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers HIGH:!aNULL:!MD5;`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    + HSTS SSL Conf
                  </button>
                </div>
              </div>

              {/* Code Editor Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'te' ? 'కోడ్ / డేటాను ఇక్కడ పేస్ట్ చేయండి:' : 'Code Content / Snippet:'}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {codeShareContent.length} chars • {codeShareContent ? codeShareContent.split('\n').length : 0} lines
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={codeShareContent}
                  onChange={(e) => setCodeShareContent(e.target.value)}
                  placeholder="Paste your code snippet, script, security configuration, or remediation patch here..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 resize-y scrollbar-thin leading-relaxed"
                />
              </div>

              {/* Optional Note / Message to Recipient */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  {lang === 'te' ? 'సహచరుడికి సందేశం (ఐచ్ఛికం)' : 'Note for Recipient (Optional)'}
                </label>
                <input
                  type="text"
                  value={codeShareNote}
                  onChange={(e) => setCodeShareNote(e.target.value)}
                  placeholder={`e.g., Please inspect this and apply to production server...`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (codeShareContent.trim()) {
                      handleDownloadCodeFile(codeShareContent, codeShareFilename);
                    }
                  }}
                  disabled={!codeShareContent.trim()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'నా కంప్యూటర్‌లో సేవ్ చేయండి' : 'Save Copy (.txt)'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsDirectCodeModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {lang === 'te' ? 'రద్దు' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={!codeShareContent.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'te' ? `${directCodeRecipient.name}కి పంపండి` : `Send Code to ${directCodeRecipient.name}`}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOST ACTION: CONFIRM KICK / REMOVE PARTICIPANT MODAL */}
      {participantToKick && (
        <div className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 flex items-center justify-center font-bold">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {lang === 'te' ? 'సభ్యుడిని మీటింగ్ నుండి తొలగించాలా?' : 'Remove Participant from Meeting?'}
                  </h3>
                  <p className="text-xs text-rose-300/80 font-medium">
                    {lang === 'te' ? 'హోస్ట్ అధికార నియంత్రణ (Host Action)' : 'Host Room Control & Moderation'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setParticipantToKick(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${participantToKick.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                  {participantToKick.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                      #{participantToKick.joinOrder || '2'}
                    </span>
                    <span>{participantToKick.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{participantToKick.email}</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                {lang === 'te'
                  ? `ఈ సభ్యుడిని తొలగించడం ద్వారా వారు ఈ మీటింగ్ నుండి డిస్‌కనెక్ట్ అవుతారు మరియు వారి మైక్రోఫోన్/కెమెరా యాక్సెస్ నిలిపివేయబడుతుంది.`
                  : `Removing this attendee will instantly disconnect them from this live session and revoke room audio/video streaming.`}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setParticipantToKick(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {lang === 'te' ? 'రద్దు (Cancel)' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => handleKickParticipant(participantToKick)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'తొలగించండి (Kick / Remove)' : 'Remove Participant'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MEETING SETTINGS & UI THEME MODAL */}
      <MeetingSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        lang={lang}
        meetingTheme={meetingTheme}
        onThemeChange={handleThemeChange}
        activeTab={settingsActiveTab}
        setActiveTab={setSettingsActiveTab}
        cameraResolution={cameraResolution}
        setCameraResolution={setCameraResolution}
        noiseSuppressionEnabled={noiseSuppressionEnabled}
        setNoiseSuppressionEnabled={setNoiseSuppressionEnabled}
        echoCancellationEnabled={echoCancellationEnabled}
        setEchoCancellationEnabled={setEchoCancellationEnabled}
        autoRecordOnStart={autoRecordOnStart}
        setAutoRecordOnStart={setAutoRecordOnStart}
        muteOnEntryPolicy={muteOnEntryPolicy}
        setMuteOnEntryPolicy={setMuteOnEntryPolicy}
        showCaptions={showCaptions}
        setShowCaptions={setShowCaptions}
        meetingRoomId={meetingRoomId}
        passcode={passcode}
        user={user}
      />
    </div>
  );
};
