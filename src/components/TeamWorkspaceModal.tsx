import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Copy,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  FolderLock,
  Plus,
  MessageSquare,
  Code2,
  Share2,
  FileText,
  Lock,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Video,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeamGoogleMeetRoom } from './TeamGoogleMeetRoom';
import {
  Language,
  UserAccount,
  FullAuditReport,
  TeamWorkspace,
  WorkspaceMember,
  WorkspaceInvitation,
  CollaborativeSecurityIssue,
  SharedWorkspaceReport,
  WorkspaceMemberRole,
  WorkspaceIssueComment,
} from '../types';
import { auth, db, doc, setDoc, getDoc, updateDoc, collection, getDocs, serverTimestamp } from '../lib/firebase';

interface TeamWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  activeReport: FullAuditReport | null;
  onOpenReport?: (report: FullAuditReport) => void;
  onOpenAutoFix?: () => void;
}

// Initial Default Workspace with high quality sample collaboration data
const DEFAULT_WORKSPACE_DATA: TeamWorkspace = {
  id: 'ws_prod_sec_01',
  name: 'Acme Security & DevOps Team',
  domainOrOrg: 'acme-corp.com',
  ownerId: 'user_owner_01',
  ownerEmail: 'jpschari789@gmail.com',
  createdAt: '2026-08-15T10:00:00.000Z',
  updatedAt: new Date().toISOString(),
  members: [
    {
      userId: 'user_owner_01',
      email: 'jpschari789@gmail.com',
      name: 'Praveen S. (You)',
      role: 'owner',
      joinedAt: '2026-08-15',
      avatarBg: 'bg-emerald-500',
      status: 'active',
    },
    {
      userId: 'user_sec_02',
      email: 'alex.rivera@acme-corp.com',
      name: 'Alex Rivera',
      role: 'security_lead',
      joinedAt: '2026-08-16',
      avatarBg: 'bg-indigo-500',
      status: 'active',
    },
    {
      userId: 'user_dev_03',
      email: 'sarah.chen@acme-corp.com',
      name: 'Sarah Chen',
      role: 'developer',
      joinedAt: '2026-08-18',
      avatarBg: 'bg-cyan-500',
      status: 'active',
    },
    {
      userId: 'user_auditor_04',
      email: 'michael.k@auditfirm.io',
      name: 'Michael Klein',
      role: 'viewer',
      joinedAt: '2026-08-20',
      avatarBg: 'bg-amber-500',
      status: 'active',
    },
  ],
  invitations: [
    {
      id: 'inv_01',
      workspaceId: 'ws_prod_sec_01',
      email: 'devops-lead@acme-corp.com',
      role: 'developer',
      invitedBy: 'jpschari789@gmail.com',
      invitedByName: 'Praveen S.',
      invitedAt: '2026-08-22',
      expiresAt: '2026-08-29',
      status: 'pending',
      token: 'inv_token_9921a',
      note: 'Need help deploying CSP and HSTS Nginx configurations across staging.',
    },
  ],
  sharedReports: [
    {
      id: 'rep_01',
      workspaceId: 'ws_prod_sec_01',
      url: 'https://acme-corp.com',
      hostname: 'acme-corp.com',
      overallScore: 88,
      perfScore: 92,
      secScore: 84,
      seoScore: 88,
      sharedByEmail: 'jpschari789@gmail.com',
      sharedByName: 'Praveen S.',
      sharedAt: '2026-08-22 14:30',
      tag: 'production',
      issuesCount: 3,
      resolvedCount: 2,
      notes: 'Q3 Main production portal health audit after Kubernetes v1.29 migration.',
    },
    {
      id: 'rep_02',
      workspaceId: 'ws_prod_sec_01',
      url: 'https://checkout.acme-corp.com',
      hostname: 'checkout.acme-corp.com',
      overallScore: 94,
      perfScore: 96,
      secScore: 98,
      seoScore: 88,
      sharedByEmail: 'sarah.chen@acme-corp.com',
      sharedByName: 'Sarah Chen',
      sharedAt: '2026-08-21 09:15',
      tag: 'critical',
      issuesCount: 1,
      resolvedCount: 1,
      notes: 'PCI-DSS Compliance and SSL grade verification report.',
    },
  ],
  issues: [
    {
      id: 'iss_01',
      workspaceId: 'ws_prod_sec_01',
      reportHostname: 'acme-corp.com',
      reportUrl: 'https://acme-corp.com',
      metricId: 'sec_csp',
      title: 'Content Security Policy (CSP) Header Missing',
      titleTe: 'కంటెంట్ సెక్యూరిటీ పాలసీ (CSP) హెడర్ లోపించింది',
      category: 'Security & OWASP',
      severity: 'critical',
      priority: 'P0',
      status: 'in_progress',
      assignedToEmail: 'alex.rivera@acme-corp.com',
      assignedToName: 'Alex Rivera',
      assignedToRole: 'Security Lead',
      remediationSnippet: "add_header Content-Security-Policy \"default-src 'self'; script-src 'self' https:; style-src 'self' 'unsafe-inline';\" always;",
      createdAt: '2026-08-22 14:35',
      updatedAt: '2026-08-22 16:40',
      comments: [
        {
          id: 'c_01',
          authorEmail: 'alex.rivera@acme-corp.com',
          authorName: 'Alex Rivera',
          authorRole: 'Security Lead',
          content: 'I drafted the CSP policy in our staging ingress. Testing with Report-Only mode first.',
          timestamp: '2026-08-22 15:10',
        },
        {
          id: 'c_02',
          authorEmail: 'sarah.chen@acme-corp.com',
          authorName: 'Sarah Chen',
          authorRole: 'Developer',
          content: 'Confirmed no inline scripts break on the checkout flow. Safe to enforce.',
          timestamp: '2026-08-22 16:35',
        },
      ],
    },
    {
      id: 'iss_02',
      workspaceId: 'ws_prod_sec_01',
      reportHostname: 'acme-corp.com',
      reportUrl: 'https://acme-corp.com',
      metricId: 'sec_hsts',
      title: 'HTTP Strict Transport Security (HSTS) Preload Missing',
      titleTe: 'HSTS ప్రీలోడ్ హెడర్ కాన్ఫిగరేషన్ లోపించింది',
      category: 'Security & OWASP',
      severity: 'high',
      priority: 'P1',
      status: 'resolved',
      assignedToEmail: 'sarah.chen@acme-corp.com',
      assignedToName: 'Sarah Chen',
      assignedToRole: 'Developer',
      remediationSnippet: 'add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;',
      createdAt: '2026-08-21 11:20',
      updatedAt: '2026-08-22 10:15',
      comments: [
        {
          id: 'c_03',
          authorEmail: 'sarah.chen@acme-corp.com',
          authorName: 'Sarah Chen',
          authorRole: 'Developer',
          content: 'Enabled max-age 2 years and submitted domain to hstspreload.org directory.',
          timestamp: '2026-08-22 10:15',
        },
      ],
    },
    {
      id: 'iss_03',
      workspaceId: 'ws_prod_sec_01',
      reportHostname: 'checkout.acme-corp.com',
      reportUrl: 'https://checkout.acme-corp.com',
      metricId: 'perf_lcp',
      title: 'Largest Contentful Paint (LCP) > 2.5s on Mobile',
      titleTe: 'మొబైల్‌లో LCP వేగం 2.5 సెకన్ల కంటే ఎక్కువ సమయం తీసుకుంటోంది',
      category: 'Performance',
      severity: 'medium',
      priority: 'P2',
      status: 'open',
      assignedToEmail: 'jpschari789@gmail.com',
      assignedToName: 'Praveen S.',
      assignedToRole: 'Owner',
      remediationSnippet: '<link rel="preload" fetchpriority="high" as="image" href="/hero-checkout.avif" type="image/avif">',
      createdAt: '2026-08-22 17:00',
      updatedAt: '2026-08-22 17:00',
      comments: [],
    },
  ],
};

export const TeamWorkspaceModal: React.FC<TeamWorkspaceModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  activeReport,
  onOpenReport,
  onOpenAutoFix,
}) => {
  const [workspace, setWorkspace] = useState<TeamWorkspace>(DEFAULT_WORKSPACE_DATA);
  const [activeTab, setActiveTab] = useState<'reports' | 'issues' | 'members' | 'activity' | 'meet'>('reports');
  const [isMeetRoomOpen, setIsMeetRoomOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Invite Member Form State
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<WorkspaceMemberRole>('security_lead');
  const [inviteNote, setInviteNote] = useState<string>('');
  const [isSendingInvite, setIsSendingInvite] = useState<boolean>(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false);

  // Share Current Report to Workspace State
  const [shareNote, setShareNote] = useState<string>('');
  const [shareTag, setShareTag] = useState<'production' | 'staging' | 'client_audit' | 'critical'>('production');
  const [isSharingReport, setIsSharingReport] = useState<boolean>(false);

  // Selected Issue for Live Collaboration Discussion
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(workspace.issues[0]?.id || null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCodeSnippet, setNewCodeSnippet] = useState<string>('');
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Filter Issues
  const [issueStatusFilter, setIssueStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'review' | 'resolved'>('all');

  // Load / Sync Workspace from Firestore and LocalStorage
  useEffect(() => {
    if (!isOpen) return;

    const loadWorkspace = async () => {
      try {
        const saved = localStorage.getItem('website_health_team_workspace');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            setWorkspace(parsed);
          }
        }

        // Try reading Firestore workspace document
        const wsDocRef = doc(db, 'workspaces', 'ws_prod_sec_01');
        const snap = await getDoc(wsDocRef);
        if (snap.exists()) {
          const data = snap.data() as TeamWorkspace;
          setWorkspace((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Workspace sync notice:', err);
      }
    };

    loadWorkspace();
  }, [isOpen]);

  // Persist Workspace helper
  const saveWorkspaceState = async (updatedWs: TeamWorkspace) => {
    setWorkspace(updatedWs);
    try {
      localStorage.setItem('website_health_team_workspace', JSON.stringify(updatedWs));
      const wsDocRef = doc(db, 'workspaces', updatedWs.id);
      await setDoc(wsDocRef, {
        ...updatedWs,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Local persist note:', e);
    }
  };

  if (!isOpen) return null;

  const currentMember = workspace.members.find((m) => m.email.toLowerCase() === user.email.toLowerCase()) || {
    userId: user.isLoggedIn ? 'user_current' : 'guest_01',
    email: user.email || 'jpschari789@gmail.com',
    name: user.name || 'Praveen S. (Owner)',
    role: 'owner' as WorkspaceMemberRole,
    joinedAt: '2026-08-15',
    status: 'active' as const,
  };

  const isOwnerOrAdmin = currentMember.role === 'owner' || currentMember.role === 'admin';

  // Issue Counts
  const openIssuesCount = workspace.issues.filter((i) => i.status !== 'resolved').length;
  const resolvedIssuesCount = workspace.issues.filter((i) => i.status === 'resolved').length;
  const activeSelectedIssue = workspace.issues.find((i) => i.id === selectedIssueId) || workspace.issues[0];

  // Filtered Issues list
  const filteredIssues = workspace.issues.filter((iss) => {
    if (issueStatusFilter === 'all') return true;
    return iss.status === issueStatusFilter;
  });

  // Handle Send Email Invitation
  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      alert('Please provide a valid team member email address.');
      return;
    }

    setIsSendingInvite(true);
    try {
      // Call server endpoint
      const response = await fetch('/api/workspaces/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.id,
          workspaceName: workspace.name,
          inviterName: user.name || 'Team Admin',
          inviterEmail: user.email || 'jpschari789@gmail.com',
          inviteeEmail: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
          note: inviteNote,
        }),
      });

      const resData = await response.json();
      const newInv: WorkspaceInvitation = {
        id: `inv_${Date.now()}`,
        workspaceId: workspace.id,
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        invitedBy: user.email || 'jpschari789@gmail.com',
        invitedByName: user.name || 'Team Admin',
        invitedAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        token: resData.inviteToken || `tok_${Math.random().toString(36).substring(2, 9)}`,
        note: inviteNote,
      };

      const updatedInvitations = [newInv, ...workspace.invitations];
      const updatedWs = { ...workspace, invitations: updatedInvitations };
      await saveWorkspaceState(updatedWs);

      setGeneratedInviteLink(resData.joinUrl || `https://websitehealth.ai/?join_workspace=${workspace.id}&token=${newInv.token}`);
      setActionSuccess(`Invitation email dispatched to ${inviteEmail}!`);
      setInviteEmail('');
      setInviteNote('');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(err);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsSendingInvite(false);
    }
  };

  // Handle Share Current Report to Workspace
  const handleShareCurrentReport = async () => {
    if (!activeReport) {
      alert('No active audit report is loaded. Please run a site scan first.');
      return;
    }

    setIsSharingReport(true);
    try {
      const newSharedReport: SharedWorkspaceReport = {
        id: `rep_${Date.now()}`,
        workspaceId: workspace.id,
        url: activeReport.url,
        hostname: activeReport.hostname,
        overallScore: activeReport.overallScore,
        perfScore: activeReport.performanceScore,
        secScore: activeReport.securityScore,
        seoScore: activeReport.seoScore,
        sharedByEmail: user.email || 'jpschari789@gmail.com',
        sharedByName: user.name || 'Praveen S.',
        sharedAt: new Date().toLocaleString(),
        tag: shareTag,
        issuesCount: activeReport.categories?.reduce((acc, cat) => acc + cat.metrics.filter((m) => m.status === 'error' || m.status === 'warning').length, 0) || 4,
        resolvedCount: 0,
        notes: shareNote || `Shared live audit report for ${activeReport.hostname} with team.`,
      };

      // Automatically generate collaborative security issue tasks from the report errors
      const reportIssues: CollaborativeSecurityIssue[] = [];
      activeReport.categories?.forEach((cat) => {
        cat.metrics.forEach((m) => {
          if (m.status === 'error' || m.priority === 'P0' || m.priority === 'P1') {
            reportIssues.push({
              id: `iss_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              workspaceId: workspace.id,
              reportHostname: activeReport.hostname,
              reportUrl: activeReport.url,
              metricId: m.id,
              title: m.name,
              titleTe: m.nameTe,
              category: cat.name,
              severity: m.priority === 'P0' ? 'critical' : 'high',
              priority: m.priority || 'P1',
              status: 'open',
              assignedToEmail: user.email || 'jpschari789@gmail.com',
              assignedToName: user.name || 'Praveen S.',
              assignedToRole: 'Lead',
              remediationSnippet: m.fixSnippet?.code || m.solution || 'Inspect header configuration and SSL certificates.',
              createdAt: new Date().toLocaleString(),
              updatedAt: new Date().toLocaleString(),
              comments: [],
            });
          }
        });
      });

      const updatedReports = [newSharedReport, ...workspace.sharedReports.filter((r) => r.hostname !== activeReport.hostname)];
      const updatedIssues = [...reportIssues, ...workspace.issues];

      const updatedWs = {
        ...workspace,
        sharedReports: updatedReports,
        issues: updatedIssues,
      };

      await saveWorkspaceState(updatedWs);
      setActionSuccess(`Report for ${activeReport.hostname} shared with the team! Added ${reportIssues.length} collaborative issue tasks.`);
      setShareNote('');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
    } catch (err: any) {
      console.error(err);
      alert('Failed to share report.');
    } finally {
      setIsSharingReport(false);
    }
  };

  // Handle Post Comment / Remediation Suggestion
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSelectedIssue || !newCommentText.trim()) return;

    setIsPostingComment(true);
    try {
      const commentObj: WorkspaceIssueComment = {
        id: `c_${Date.now()}`,
        authorEmail: user.email || 'jpschari789@gmail.com',
        authorName: user.name || 'Praveen S.',
        authorRole: currentMember.role === 'owner' ? 'Owner' : currentMember.role === 'security_lead' ? 'Security Lead' : 'Developer',
        content: newCommentText.trim(),
        codeSnippet: newCodeSnippet.trim() || undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Call collaboration endpoint for AI assistance
      try {
        await fetch('/api/workspaces/collaborate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            issueTitle: activeSelectedIssue.title,
            reportHostname: activeSelectedIssue.reportHostname,
            currentStatus: activeSelectedIssue.status,
            category: activeSelectedIssue.category,
            comment: newCommentText,
            authorName: commentObj.authorName,
            authorRole: commentObj.authorRole,
          }),
        });
      } catch (err) {
        console.warn('AI collaboration note:', err);
      }

      const updatedIssues = workspace.issues.map((iss) => {
        if (iss.id === activeSelectedIssue.id) {
          return {
            ...iss,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            comments: [...iss.comments, commentObj],
          };
        }
        return iss;
      });

      const updatedWs = { ...workspace, issues: updatedIssues };
      await saveWorkspaceState(updatedWs);

      setNewCommentText('');
      setNewCodeSnippet('');
      setActionSuccess('Collaboration comment recorded.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingComment(false);
    }
  };

  // Handle Change Issue Status
  const handleUpdateIssueStatus = async (issueId: string, newStatus: 'open' | 'in_progress' | 'review' | 'resolved') => {
    const updatedIssues = workspace.issues.map((iss) => {
      if (iss.id === issueId) {
        return {
          ...iss,
          status: newStatus,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return iss;
    });

    const updatedWs = { ...workspace, issues: updatedIssues };
    await saveWorkspaceState(updatedWs);

    if (newStatus === 'resolved') {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      setActionSuccess(`Issue marked as Resolved & Verified!`);
    }
  };

  // Handle Assign Issue Member
  const handleAssignIssue = async (issueId: string, memberEmail: string) => {
    const assignedMember = workspace.members.find((m) => m.email === memberEmail);
    const updatedIssues = workspace.issues.map((iss) => {
      if (iss.id === issueId) {
        return {
          ...iss,
          assignedToEmail: memberEmail,
          assignedToName: assignedMember?.name || memberEmail.split('@')[0],
          assignedToRole: assignedMember?.role || 'Lead',
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return iss;
    });

    const updatedWs = { ...workspace, issues: updatedIssues };
    await saveWorkspaceState(updatedWs);
    setActionSuccess(`Assigned to ${assignedMember?.name || memberEmail}!`);
  };

  // Handle Revoke Invitation
  const handleRevokeInvitation = async (invId: string) => {
    const updatedInvitations = workspace.invitations.filter((i) => i.id !== invId);
    const updatedWs = { ...workspace, invitations: updatedInvitations };
    await saveWorkspaceState(updatedWs);
    setActionSuccess('Invitation revoked.');
  };

  const copyToClipboard = (text: string, type: 'link' | 'snippet', id?: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setIsCopiedLink(true);
      setTimeout(() => setIsCopiedLink(false), 2000);
    } else if (type === 'snippet' && id) {
      setCopiedSnippetId(id);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      id="modal-team-workspace"
    >
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Workspace Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {workspace.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                  {workspace.domainOrOrg || 'acme-corp.com'}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {lang === 'te' ? 'టీమ్ యాక్టివ్' : 'Team Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'ఆడిట్ రిపోర్టులను పంచుకోండి మరియు సెక్యూరిటీ సమస్యలపై సహకరించండి'
                  : 'Collaborate on security audits, assign remediation tasks, and share live reports'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsMeetRoomOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 border border-emerald-400/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              title="Launch Native In-App Video Meeting"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'లైవ్ మీట్ ప్రారంభించండి' : 'HealthSec Live Meet'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'సభ్యుడిని ఆహ్వానించండి' : 'Invite Member'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Action Notification Banner */}
        {actionSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 animate-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-400 hover:text-white cursor-pointer ml-4 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Workspace Quick Stat Pills */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto text-xs scrollbar-none py-0.5">
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">{lang === 'te' ? 'సభ్యులు:' : 'Members:'}</span>
              <strong className="text-white font-mono">{workspace.members.length}</strong>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">{lang === 'te' ? 'షేర్డ్ రిపోర్టులు:' : 'Reports:'}</span>
              <strong className="text-white font-mono">{workspace.sharedReports.length}</strong>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">{lang === 'te' ? 'పెండింగ్ ఫిక్సెస్:' : 'Open Tasks:'}</span>
              <strong className="text-amber-400 font-mono">{openIssuesCount}</strong>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">{lang === 'te' ? 'పరిష్కరించబడినవి:' : 'Resolved:'}</span>
              <strong className="text-emerald-400 font-mono">{resolvedIssuesCount}</strong>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">{lang === 'te' ? 'మీ పాత్ర:' : 'Your Role:'}</span>
            <span className="px-2 py-0.5 rounded-md font-bold uppercase text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentMember.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 shrink-0">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none py-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'te' ? 'షేర్డ్ ఆడిట్ రిపోర్ట్‌లు' : 'Shared Reports'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/60 font-mono">
                {workspace.sharedReports.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('issues')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'issues'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'te' ? 'సెక్యూరిటీ టాస్క్‌లు & కొలాబరేషన్' : 'Security Issues Hub'}</span>
              {openIssuesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold font-mono">
                  {openIssuesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'te' ? 'టీమ్ సభ్యులు & ఆహ్వానాలు' : 'Team & Invites'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/60 font-mono">
                {workspace.members.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{lang === 'te' ? 'యాక్టివిటీ లాగ్' : 'Activity Audit'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin bg-slate-900/50">
          
          {/* TAB 1: SHARED AUDIT REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Share Current Live Report Banner */}
              {activeReport && (
                <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{lang === 'te' ? 'ప్రస్తుత ఆడిట్‌ను టీమ్‌తో పంచుకోండి:' : 'Publish Current Report to Workspace:'}</span>
                          <span className="font-mono text-emerald-400 font-bold">{activeReport.hostname}</span>
                        </h4>
                        <p className="text-xs text-slate-300">
                          {lang === 'te'
                            ? `స్కోర్: ${activeReport.overallScore}/100 • సెక్యూరిటీ: ${activeReport.securityScore}/100 • పెర్ఫార్మెన్స్: ${activeReport.performanceScore}/100`
                            : `Overall Score: ${activeReport.overallScore}/100 • Security: ${activeReport.securityScore}/100 • Performance: ${activeReport.performanceScore}/100`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={shareTag}
                        onChange={(e) => setShareTag(e.target.value as any)}
                        className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="production">Tag: Production</option>
                        <option value="staging">Tag: Staging</option>
                        <option value="client_audit">Tag: Client Portal</option>
                        <option value="critical">Tag: Critical Priority</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleShareCurrentReport}
                        disabled={isSharingReport}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        {isSharingReport ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>{lang === 'te' ? 'టీమ్‌కి షేర్ చేయండి' : 'Share to Team'}</span>
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={shareNote}
                    onChange={(e) => setShareNote(e.target.value)}
                    placeholder={lang === 'te' ? 'టీమ్ సభ్యులకు గమనిక రాయండి (ఉదా. "Q3 సెక్యూరిటీ రివ్యూ")' : 'Add context or notes for the team (e.g. "Pre-release OWASP hardening sprint")...'}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Shared Reports Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {lang === 'te' ? 'టీమ్ వర్క్‌స్పేస్‌లో షేర్ చేయబడిన రిపోర్ట్‌లు' : 'Shared Audit Reports in Workspace'}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {workspace.sharedReports.length} {lang === 'te' ? 'రిపోర్టులు' : 'Reports'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspace.sharedReports.map((report) => {
                    const scoreColor =
                      report.overallScore >= 90
                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                        : report.overallScore >= 70
                        ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                        : 'text-rose-400 border-rose-500/40 bg-rose-500/10';

                    return (
                      <div
                        key={report.id}
                        className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md space-y-3 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
                                {report.hostname}
                              </h5>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                                {report.tag || 'production'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-[280px] mt-0.5">
                              {report.url}
                            </p>
                          </div>

                          <div className={`px-2.5 py-1 rounded-xl border text-center font-mono ${scoreColor}`}>
                            <span className="text-xs font-black block leading-none">{report.overallScore}</span>
                            <span className="text-[8px] uppercase tracking-wider opacity-80">/ 100</span>
                          </div>
                        </div>

                        {/* Pillar Scores Pill Bar */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-850 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Security</span>
                            <span className="font-bold text-indigo-400 font-mono">{report.secScore}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Performance</span>
                            <span className="font-bold text-emerald-400 font-mono">{report.perfScore}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">SEO & GEO</span>
                            <span className="font-bold text-cyan-400 font-mono">{report.seoScore}</span>
                          </div>
                        </div>

                        {report.notes && (
                          <p className="text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 italic">
                            "{report.notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Shared by <strong className="text-slate-200">{report.sharedByName}</strong></span>
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">{report.sharedAt}</span>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('issues');
                              setIssueStatusFilter('all');
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
                          >
                            {lang === 'te' ? 'టాస్క్‌లు చూడండి' : 'View Security Issues'}
                          </button>
                          
                          {activeReport && activeReport.hostname === report.hostname && onOpenReport && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenReport(activeReport);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <span>{lang === 'te' ? 'ఆడిట్ తెరవండి' : 'Open Live'}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLLABORATIVE SECURITY FIXES & ISSUES HUB */}
          {activeTab === 'issues' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Issues List */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {lang === 'te' ? 'కొలాబరేటివ్ సెక్యూరిటీ టాస్క్‌లు' : 'Collaborative Security Tasks'}
                  </h4>

                  {/* Status Filter Tabs */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px] font-bold">
                    {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setIssueStatusFilter(st)}
                        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                          issueStatusFilter === st
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {st === 'all' ? 'All' : st === 'in_progress' ? 'In Progress' : st.charAt(0).toUpperCase() + st.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredIssues.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                      <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                      <h5 className="text-sm font-bold text-white">{lang === 'te' ? 'సమస్యలు ఏవీ లేవు' : 'No issues found'}</h5>
                      <p className="text-xs text-slate-400">All security tasks matching this filter are resolved.</p>
                    </div>
                  ) : (
                    filteredIssues.map((issue) => {
                      const isSelected = activeSelectedIssue?.id === issue.id;
                      const priorityColor =
                        issue.priority === 'P0'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : issue.priority === 'P1'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';

                      const statusColor =
                        issue.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : issue.status === 'in_progress'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700';

                      return (
                        <div
                          key={issue.id}
                          onClick={() => setSelectedIssueId(issue.id)}
                          className={`bg-slate-900 border rounded-2xl p-4 transition-all duration-200 cursor-pointer space-y-3 ${
                            isSelected
                              ? 'border-indigo-500 bg-slate-850/90 ring-1 ring-indigo-500/50 shadow-md'
                              : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 flex-wrap gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border font-mono ${priorityColor}`}>
                                  {issue.priority} {issue.severity.toUpperCase()}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {issue.reportHostname}
                                </span>
                              </div>
                              <h5 className="text-xs sm:text-sm font-bold text-white leading-tight">
                                {lang === 'te' && issue.titleTe ? issue.titleTe : issue.title}
                              </h5>
                            </div>

                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${statusColor}`}>
                              {issue.status === 'in_progress' ? 'In Progress' : issue.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                            <div className="flex items-center space-x-1.5">
                              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                {issue.assignedToName ? issue.assignedToName.charAt(0) : 'U'}
                              </div>
                              <span>Assigned: <strong className="text-slate-200">{issue.assignedToName || 'Unassigned'}</strong></span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                                <MessageSquare className="w-3 h-3 text-indigo-400" />
                                {issue.comments.length}
                              </span>
                              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : ''}`} />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Selected Issue Discussion & Remediation Collaboration Thread */}
              <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-inner">
                {activeSelectedIssue ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                              {activeSelectedIssue.priority} {activeSelectedIssue.severity.toUpperCase()}
                            </span>
                            <span className="text-xs text-indigo-400 font-semibold font-mono">
                              {activeSelectedIssue.reportHostname}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-black text-white">
                            {lang === 'te' && activeSelectedIssue.titleTe ? activeSelectedIssue.titleTe : activeSelectedIssue.title}
                          </h4>
                        </div>

                        {/* Status Updater Select */}
                        <select
                          value={activeSelectedIssue.status}
                          onChange={(e) => handleUpdateIssueStatus(activeSelectedIssue.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="open">Status: Open</option>
                          <option value="in_progress">Status: In Progress</option>
                          <option value="review">Status: Review</option>
                          <option value="resolved">Status: Resolved & Verified</option>
                        </select>
                      </div>

                      {/* Assignment & Metadata Bar */}
                      <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Assignee:</span>
                          <select
                            value={activeSelectedIssue.assignedToEmail || ''}
                            onChange={(e) => handleAssignIssue(activeSelectedIssue.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
                          >
                            {workspace.members.map((m) => (
                              <option key={m.email} value={m.email}>
                                {m.name} ({m.role})
                              </option>
                            ))}
                          </select>
                        </div>

                        {onOpenAutoFix && (
                          <button
                            type="button"
                            onClick={() => {
                              onOpenAutoFix();
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold hover:bg-amber-500/30 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>1-Click PR Fix</span>
                          </button>
                        )}
                      </div>

                      {/* Remediation Blueprint Snippet */}
                      {activeSelectedIssue.remediationSnippet && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 font-bold text-slate-300">
                              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Team Remediation Blueprint:</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(activeSelectedIssue.remediationSnippet!, 'snippet', activeSelectedIssue.id)}
                              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedSnippetId === activeSelectedIssue.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Snippet</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                            <code>{activeSelectedIssue.remediationSnippet}</code>
                          </div>
                        </div>
                      )}

                      {/* Collaborative Comments Discussion Feed */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          {lang === 'te' ? 'టీమ్ చర్చలు & గమనికలు' : 'Team Collaboration Notes & Discussion'} ({activeSelectedIssue.comments.length})
                        </span>

                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                          {activeSelectedIssue.comments.length === 0 ? (
                            <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-xl text-center border border-slate-800/60">
                              No team comments yet. Add the first note or code suggestion below!
                            </p>
                          ) : (
                            activeSelectedIssue.comments.map((comm) => (
                              <div
                                key={comm.id}
                                className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-1 text-xs"
                              >
                                <div className="flex items-center justify-between border-b border-slate-800/60 pb-1 text-[11px]">
                                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                                    <span>{comm.authorName}</span>
                                    <span className="text-[9px] font-normal text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800 font-mono">
                                      {comm.authorRole}
                                    </span>
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">{comm.timestamp}</span>
                                </div>
                                <p className="text-slate-200 leading-relaxed pt-0.5">{comm.content}</p>
                                {comm.codeSnippet && (
                                  <div className="mt-1 bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto border border-slate-800">
                                    <code>{comm.codeSnippet}</code>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* New Comment Input Box */}
                    <form onSubmit={handlePostComment} className="pt-2 border-t border-slate-800 space-y-2">
                      <textarea
                        rows={2}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={lang === 'te' ? 'టీమ్ కోసం గమనికను రాయండి...' : 'Add a collaboration note, review feedback, or fix verification...'}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        required
                      />

                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={newCodeSnippet}
                          onChange={(e) => setNewCodeSnippet(e.target.value)}
                          placeholder="Optional code snippet or header directive..."
                          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                        />

                        <button
                          type="submit"
                          disabled={isPostingComment || !newCommentText.trim()}
                          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{lang === 'te' ? 'పోస్ట్ చేయండి' : 'Post Note'}</span>
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-8 text-slate-400">
                    <p className="text-xs">Select a security issue from the left list to view collaboration discussions.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TEAM MEMBERS & EMAIL INVITATIONS */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              
              {/* Invite Form Card */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      {lang === 'te' ? 'ఈమెయిల్ ద్వారా టీమ్ సభ్యుడిని ఆహ్వానించండి' : 'Invite Team Member via Email'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'te'
                        ? 'ఆడిట్ నివేదికలను పంచుకోవడానికి మరియు పరిష్కారాలపై కలిసి పనిచేయడానికి ఆహ్వానించండి'
                        : 'Send an email invite with automated access to audit reports and collaborative security boards.'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendInvitation} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {lang === 'te' ? 'సభ్యుడి ఈమెయిల్ చిరునామా' : 'Team Member Email Address'} *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="developer@acme-corp.com"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {lang === 'te' ? 'పాత్ర & అనుమతులు' : 'Role & Permissions'} *
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as WorkspaceMemberRole)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="security_lead">Security Lead (OWASP / Fixes)</option>
                        <option value="developer">Developer (PR Auto-Fix)</option>
                        <option value="admin">Admin (Full Access)</option>
                        <option value="viewer">Auditor / Viewer (Read-Only)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex items-end">
                      <button
                        type="submit"
                        disabled={isSendingInvite || !inviteEmail}
                        className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
                      >
                        {isSendingInvite ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>{lang === 'te' ? 'ఆహ్వానం పంపండి' : 'Send Invite'}</span>
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={inviteNote}
                    onChange={(e) => setInviteNote(e.target.value)}
                    placeholder={lang === 'te' ? 'ఆహ్వాన సందేశం (ఐచ్ఛికం)' : 'Personal note or sprint scope (e.g., "Join us to review SSL and CSP headers for production deployment")...'}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </form>

                {/* Copyable Invitation Link Banner */}
                {generatedInviteLink && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/40 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Direct Workspace Join URL:</span>
                      <span className="text-emerald-400 font-mono truncate block text-[11px]">{generatedInviteLink}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedInviteLink, 'link')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center space-x-1"
                    >
                      {isCopiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Active Members & Pending Invites Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Members List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lang === 'te' ? 'యాక్టివ్ టీమ్ సభ్యులు' : 'Enrolled Team Members'} ({workspace.members.length})</span>
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {workspace.members.map((member) => (
                      <div
                        key={member.email}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full ${member.avatarBg || 'bg-indigo-600'} text-white flex items-center justify-center text-xs font-black shadow-xs`}>
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {member.role === 'owner' && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 rounded font-mono font-bold">
                                  Owner
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{member.email}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 border border-slate-700 block">
                            {member.role.replace('_', ' ')}
                          </span>
                          <span className="text-[9px] text-slate-500 mt-0.5 block font-mono">Joined {member.joinedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Email Invitations List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'te' ? 'పెండింగ్ ఆహ్వానాలు' : 'Pending Email Invitations'} ({workspace.invitations.length})</span>
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {workspace.invitations.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                        No pending invitations. All invited members have joined!
                      </p>
                    ) : (
                      workspace.invitations.map((inv) => (
                        <div
                          key={inv.id}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white font-mono">{inv.email}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Pending
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Role: <strong className="text-indigo-300">{inv.role}</strong> • Sent by {inv.invitedByName}
                            </div>
                            {inv.note && (
                              <p className="text-[10px] text-slate-400 italic">"{inv.note}"</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                copyToClipboard(`https://websitehealth.ai/?join_workspace=${workspace.id}&token=${inv.token}`, 'link');
                                setActionSuccess(`Invitation link copied for ${inv.email}!`);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Copy Invite Link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRevokeInvitation(inv.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Revoke Invitation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY AUDIT TRAIL */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'te' ? 'టీమ్ వర్క్‌స్పేస్ యాక్టివిటీ & ఆడిట్ లాగ్' : 'Team Workspace Security & Collaboration Activity'}
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  Real-time Stream
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    user: 'Alex Rivera',
                    role: 'Security Lead',
                    action: 'Assigned Content-Security-Policy (CSP) Missing task to self and added Nginx snippet.',
                    time: '12 minutes ago',
                    icon: Code2,
                    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
                  },
                  {
                    user: 'Sarah Chen',
                    role: 'Developer',
                    action: 'Marked HSTS Preload Header as Resolved & Verified on checkout.acme-corp.com.',
                    time: '1 hour ago',
                    icon: CheckCircle2,
                    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  },
                  {
                    user: 'Praveen S.',
                    role: 'Owner',
                    action: 'Published live audit report for acme-corp.com (Score 88/100) to Team Workspace.',
                    time: '3 hours ago',
                    icon: Share2,
                    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
                  },
                  {
                    user: 'Praveen S.',
                    role: 'Owner',
                    action: 'Invited devops-lead@acme-corp.com to join workspace as Developer.',
                    time: 'Yesterday at 16:20',
                    icon: Mail,
                    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                  },
                  {
                    user: 'Michael Klein',
                    role: 'Viewer',
                    action: 'Exported executive white-label compliance PDF for checkout.acme-corp.com.',
                    time: '2 days ago',
                    icon: FileText,
                    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-start space-x-3 text-xs"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span>{item.user}</span>
                            <span className="text-[9px] font-normal text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded font-mono">
                              {item.role}
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                        </div>
                        <p className="text-slate-300 mt-0.5 leading-relaxed">{item.action}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>{lang === 'te' ? 'ఎండ్‌-టు-ఎండ్‌ ఎన్‌క్రిప్టెడ్ వర్క్‌స్పేస్' : 'End-to-End Encrypted Team Security Workspace'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
            >
              {lang === 'te' ? 'మూసివేయి' : 'Close'}
            </button>
          </div>
        </div>

      </div>

      {/* Embedded Live Google Meet Room Modal */}
      {isMeetRoomOpen && (
        <TeamGoogleMeetRoom
          isOpen={isMeetRoomOpen}
          onClose={() => setIsMeetRoomOpen(false)}
          lang={lang}
          user={user}
          activeReport={activeReport}
          onOpenAutoFix={() => {
            setIsMeetRoomOpen(false);
            if (onOpenAutoFix) onOpenAutoFix();
          }}
        />
      )}
    </div>
  );
};
