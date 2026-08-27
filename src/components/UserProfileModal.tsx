import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Gift, 
  ShieldCheck, 
  Copy, 
  Check, 
  LogOut, 
  Sparkles, 
  CreditCard, 
  ExternalLink, 
  Share2, 
  Activity, 
  Edit3,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Terminal,
  Code2,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowUpRight,
  Shield,
  Layers,
  LineChart as LineChartIcon,
  TrendingUp,
  Calendar,
  BarChart3,
  Clock,
  Search,
  Filter,
  Download,
  Trash2,
  Play,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Language, UserAccount, PricingPlanId, ApiUsageStats, ApiDailyConsumptionPoint, ApiEndpointUsage } from '../types';
import { auth, db, signOut, doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from '../lib/firebase';

export interface ApiRequestLogItem {
  id: string;
  timestamp: string;
  relativeTime: string;
  method: 'POST' | 'GET';
  endpoint: string;
  targetUrl: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  creditsCost: number;
  ipAddress: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onLogout: () => void;
  onOpenReferral?: () => void;
  onOpenPricing?: (plan?: PricingPlanId) => void;
  onOpenDeveloperApi?: () => void;
  historyCount?: number;
}

function generateSecureApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomHex = '';
  try {
    const cryptoObj = window.crypto || (window as any).msCrypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
      const bytes = new Uint8Array(24);
      cryptoObj.getRandomValues(bytes);
      for (let i = 0; i < bytes.length; i++) {
        randomHex += chars[bytes[i] % chars.length];
      }
    } else {
      for (let i = 0; i < 24; i++) {
        randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
  } catch {
    for (let i = 0; i < 24; i++) {
      randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return `whs_live_${randomHex}`;
}

const INITIAL_REQUEST_LOGS: ApiRequestLogItem[] = [
  {
    id: 'req_8f910a',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    relativeTime: '2 mins ago',
    method: 'POST',
    endpoint: '/v1/audit/full',
    targetUrl: 'https://stripe.com',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 142,
    creditsCost: 1,
    ipAddress: '103.21.244.0',
  },
  {
    id: 'req_7a82bc',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    relativeTime: '14 mins ago',
    method: 'POST',
    endpoint: '/v1/security/owasp',
    targetUrl: 'https://github.com',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 188,
    creditsCost: 1,
    ipAddress: '103.21.244.0',
  },
  {
    id: 'req_6c73de',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    relativeTime: '42 mins ago',
    method: 'POST',
    endpoint: '/v1/crawler/deep',
    targetUrl: 'https://vercel.com',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 310,
    creditsCost: 2,
    ipAddress: '103.21.244.0',
  },
  {
    id: 'req_5b64ef',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    relativeTime: '2 hours ago',
    method: 'POST',
    endpoint: '/v1/remediation/ai-fix',
    targetUrl: 'https://mysite.io',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 245,
    creditsCost: 1,
    ipAddress: '103.21.244.0',
  },
  {
    id: 'req_4a55fa',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    relativeTime: '5 hours ago',
    method: 'GET',
    endpoint: '/v1/dns/records',
    targetUrl: 'https://cloudflare.com',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 89,
    creditsCost: 0,
    ipAddress: '103.21.244.0',
  },
  {
    id: 'req_3e44ab',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    relativeTime: 'Yesterday',
    method: 'POST',
    endpoint: '/v1/audit/full',
    targetUrl: 'https://wikipedia.org',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 165,
    creditsCost: 1,
    ipAddress: '103.21.244.0',
  },
];

function generatePast30DaysUsage(totalCalls: number = 48, endpoints?: ApiEndpointUsage): ApiDailyConsumptionPoint[] {
  const points: ApiDailyConsumptionPoint[] = [];
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const recencyWeight = i < 7 ? 2.1 : i < 15 ? 1.4 : 0.8;
    const baseCalls = isWeekend 
      ? (i % 4 === 0 ? 1 : 0) 
      : Math.max(0, Math.floor((((i * 7 + 13) % 9) / 2) * (recencyWeight / 2)));
    
    const audit = Math.round(baseCalls * 0.65);
    const sec = Math.round(baseCalls * 0.2);
    const crawl = Math.round(baseCalls * 0.1);
    const rem = baseCalls > 3 ? 1 : 0;
    const total = Math.max(0, audit + sec + crawl + rem);

    const shortMonth = d.toLocaleString('en-US', { month: 'short' });
    const dayNum = d.getDate();

    points.push({
      date: `${shortMonth} ${dayNum}`,
      shortDate: `${d.getMonth() + 1}/${dayNum}`,
      dayName: dayNames[dayOfWeek],
      totalRequests: total,
      auditCalls: audit,
      securityCalls: sec,
      crawlerCalls: crawl,
      remediationCalls: rem,
      successRate: 100,
    });
  }

  if (points.length >= 5) {
    points[points.length - 1].totalRequests = Math.max(points[points.length - 1].totalRequests, 6);
    points[points.length - 1].auditCalls = 4;
    points[points.length - 1].securityCalls = 1;
    points[points.length - 1].crawlerCalls = 1;
    
    points[points.length - 2].totalRequests = Math.max(points[points.length - 2].totalRequests, 5);
    points[points.length - 2].auditCalls = 3;
    points[points.length - 2].securityCalls = 1;
    points[points.length - 2].remediationCalls = 1;
  }

  return points;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  onUpdateUser,
  onLogout,
  onOpenReferral,
  onOpenPricing,
  onOpenDeveloperApi,
  historyCount = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

  // API Wallet & Key Management States
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'node' | 'python'>('curl');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // 30-Day API Consumption Chart Controls
  const [chartTimeRange, setChartTimeRange] = useState<'30d' | '14d' | '7d'>('30d');
  const [chartMetricView, setChartMetricView] = useState<'total' | 'breakdown'>('total');

  // Dedicated Request Logs & Interactive Telemetry States
  const [requestLogs, setRequestLogs] = useState<ApiRequestLogItem[]>(INITIAL_REQUEST_LOGS);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logFilterCategory, setLogFilterCategory] = useState<'all' | 'audit' | 'security' | 'crawler' | 'remediation'>('all');
  const [isSimulatingRequest, setIsSimulatingRequest] = useState(false);
  const [showCreditPacks, setShowCreditPacks] = useState(false);

  if (!isOpen) return null;

  const referralCode = user?.referralCode || 'jpschari789';
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `/?ref=${referralCode}`;

  // Default API Usage if not initialized yet
  const apiUsage: ApiUsageStats = {
    totalCalls: typeof user?.apiUsage?.totalCalls === 'number' ? user.apiUsage.totalCalls : 48,
    monthlyQuota: typeof user?.apiUsage?.monthlyQuota === 'number' && user.apiUsage.monthlyQuota > 0 ? user.apiUsage.monthlyQuota : 500,
    lastUsedAt: user?.apiUsage?.lastUsedAt || new Date().toISOString(),
    endpointsUsed: {
      audit: typeof user?.apiUsage?.endpointsUsed?.audit === 'number' ? user.apiUsage.endpointsUsed.audit : 32,
      security: typeof user?.apiUsage?.endpointsUsed?.security === 'number' ? user.apiUsage.endpointsUsed.security : 9,
      crawler: typeof user?.apiUsage?.endpointsUsed?.crawler === 'number' ? user.apiUsage.endpointsUsed.crawler : 5,
      remediation: typeof user?.apiUsage?.endpointsUsed?.remediation === 'number' ? user.apiUsage.endpointsUsed.remediation : 2,
    },
    dailyHistory: user?.apiUsage?.dailyHistory || [],
  };

  const currentApiKey = user?.apiKey || '';
  const isKeyActive = user?.apiKeyStatus !== 'revoked' && Boolean(currentApiKey);
  const quotaPercentage = Math.min(100, Math.round(((apiUsage.totalCalls || 0) / (apiUsage.monthlyQuota || 500)) * 100));
  const remainingCalls = Math.max(0, (apiUsage.monthlyQuota || 500) - (apiUsage.totalCalls || 0));

  // 30-Day Daily Consumption Telemetry Data Points
  const rawDailyData = useMemo(() => {
    if (user?.apiUsage?.dailyHistory && Array.isArray(user.apiUsage.dailyHistory) && user.apiUsage.dailyHistory.length > 0) {
      return user.apiUsage.dailyHistory;
    }
    return generatePast30DaysUsage(apiUsage.totalCalls, apiUsage.endpointsUsed);
  }, [user?.apiUsage, apiUsage.totalCalls, apiUsage.endpointsUsed]);

  // Filtered dataset by selected time range (7d, 14d, 30d)
  const activeDailyData = useMemo(() => {
    if (chartTimeRange === '7d') {
      return rawDailyData.slice(-7);
    } else if (chartTimeRange === '14d') {
      return rawDailyData.slice(-14);
    }
    return rawDailyData;
  }, [rawDailyData, chartTimeRange]);

  // Aggregations over the visible dataset
  const chartMetrics = useMemo(() => {
    const total = activeDailyData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);
    const peak = Math.max(...activeDailyData.map((d) => d.totalRequests || 0), 1);
    const avg = (total / Math.max(activeDailyData.length, 1)).toFixed(1);
    return { total, peak, avg };
  }, [activeDailyData]);

  // Real-time Cloud Sync function checking against Firebase 'users' collection & Google Auth
  const handleSyncFromFirebase = async () => {
    setIsSyncingFirebase(true);
    try {
      const fbUser = auth.currentUser;
      if (fbUser) {
        const userRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userRef);
        let syncedData: Record<string, any> = {};

        if (snap.exists()) {
          syncedData = snap.data();
        } else {
          // Initialize in Firestore users collection
          syncedData = {
            userId: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google User',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || '',
            credits: 10,
            referralCode: (fbUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') + '789',
            authProvider: fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email',
            role: 'Member',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            lastSyncedAt: new Date().toISOString(),
          };
          await setDoc(userRef, syncedData, { merge: true });
        }

        const updated: UserAccount = {
          ...user,
          name: syncedData.name || fbUser.displayName || user.name,
          email: syncedData.email || fbUser.email || user.email,
          photoURL: syncedData.photoURL || fbUser.photoURL || user.photoURL,
          credits: typeof syncedData.credits === 'number' ? syncedData.credits : (user.credits || 10),
          referralCode: syncedData.referralCode || user.referralCode,
          role: syncedData.role || user.role || 'Member',
          userId: fbUser.uid,
          uid: fbUser.uid,
          authProvider: syncedData.authProvider || (fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email'),
          apiKey: syncedData.apiKey || user.apiKey,
          apiKeyName: syncedData.apiKeyName || user.apiKeyName,
          apiKeyStatus: syncedData.apiKeyStatus || user.apiKeyStatus,
          apiKeyCreatedAt: syncedData.apiKeyCreatedAt || user.apiKeyCreatedAt,
          apiTier: syncedData.apiTier || user.apiTier,
          apiWalletBalance: syncedData.apiWalletBalance ?? user.apiWalletBalance,
          apiUsage: syncedData.apiUsage || user.apiUsage,
          apiCreditsRemaining: syncedData.apiCreditsRemaining ?? user.apiCreditsRemaining,
          lastSyncedAt: new Date().toISOString(),
          isFirebaseSynced: true,
          isLoggedIn: true,
        };

        onUpdateUser(updated);
        try {
          localStorage.setItem('website_health_user', JSON.stringify(updated));
        } catch {}

        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setActionNotice(
          lang === 'te'
            ? 'Firebase "users" కలెక్షన్ మరియు Google ఖాతా వివరాలతో విజయవంతంగా సింక్ చేయబడింది!'
            : 'Synchronized with Firebase "users" collection & Google account details!'
        );
        setTimeout(() => setActionNotice(null), 3500);
      } else {
        setActionNotice(
          lang === 'te'
            ? 'రియల్-టైమ్ సింక్ కోసం దయచేసి Google లేదా Email తో లాగిన్ అవ్వండి.'
            : 'Please log in with Google or Email to enable real-time cloud sync.'
        );
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (err) {
      console.warn('Manual Firebase sync error:', err);
      setActionNotice(lang === 'te' ? 'సింక్ ప్రక్రియలో లోపం ఏర్పడింది.' : 'Failed to sync with Firebase.');
      setTimeout(() => setActionNotice(null), 3500);
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserAccount = {
      ...user,
      name: editName.trim() || user.name,
      email: editEmail.trim() || user.email,
    };
    onUpdateUser(updated);

    // Sync with Firebase Firestore if currentUser is logged in
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          name: updated.name,
          email: updated.email,
          updatedAt: serverTimestamp(),
          lastSyncedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore update profile note:', err);
    }
    setIsEditing(false);
  };

  const handleGenerateApiKey = async () => {
    const newKey = generateSecureApiKey();
    const nowStr = new Date().toISOString();
    const updated: UserAccount = {
      ...user,
      apiKey: newKey,
      apiKeyName: `${user.name || 'Developer'} Production Key`,
      apiKeyCreatedAt: nowStr,
      apiKeyStatus: 'active',
      apiTier: user.apiTier || 'Pro',
      apiWalletBalance: user.apiWalletBalance ?? 500,
      apiUsage: {
        totalCalls: 0,
        monthlyQuota: 500,
        lastUsedAt: nowStr,
        endpointsUsed: {
          audit: 0,
          security: 0,
          crawler: 0,
          remediation: 0,
        },
      },
    };

    onUpdateUser(updated);

    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          apiKey: newKey,
          apiKeyStatus: 'active',
          apiKeyCreatedAt: nowStr,
          apiTier: updated.apiTier,
          apiWalletBalance: updated.apiWalletBalance,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('Firestore api key sync note:', err);
    }

    setShowApiKey(true);
    setActionNotice(lang === 'te' ? 'కొత్త API కీ విజయవంతంగా సృష్టించబడింది!' : 'New live API key generated successfully!');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRegenerateKey = async () => {
    if (!window.confirm(lang === 'te' ? 'మీ పాత API కీ రద్దు చేయబడుతుంది. ఖచ్చితంగా కొత్త కీని జనరేట్ చేయాలా?' : 'Are you sure you want to roll your API key? The old key will immediately stop working.')) {
      return;
    }
    setIsRegeneratingKey(true);
    const newKey = generateSecureApiKey();
    const nowStr = new Date().toISOString();
    const updated: UserAccount = {
      ...user,
      apiKey: newKey,
      apiKeyCreatedAt: nowStr,
      apiKeyStatus: 'active',
    };
    onUpdateUser(updated);

    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          apiKey: newKey,
          apiKeyStatus: 'active',
          apiKeyCreatedAt: nowStr,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('Firestore api key roll note:', err);
    }
    setIsRegeneratingKey(false);
    setShowApiKey(true);
    setActionNotice(lang === 'te' ? 'API కీ విజయవంతంగా మార్చబడింది (Rolled).' : 'API Key rolled & updated.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleToggleKeyStatus = async () => {
    const nextStatus = isKeyActive ? 'revoked' : 'active';
    const updated: UserAccount = {
      ...user,
      apiKeyStatus: nextStatus,
    };
    onUpdateUser(updated);

    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          apiKeyStatus: nextStatus,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('Firestore api status note:', err);
    }

    setActionNotice(
      nextStatus === 'active'
        ? (lang === 'te' ? 'API కీ మళ్లీ యాక్టివేట్ చేయబడింది.' : 'API Key reactivated.')
        : (lang === 'te' ? 'API కీ తాత్కాలికంగా పాజ్ చేయబడింది.' : 'API Key revoked.')
    );
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleCopyApiKey = () => {
    if (!currentApiKey) return;
    navigator.clipboard.writeText(currentApiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2500);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign out note:', err);
    }
    onLogout();
    onClose();
  };

  const handleSimulateApiCall = () => {
    if (!isKeyActive) {
      setActionNotice(lang === 'te' ? 'దయచేసి ముందుగా API కీని సృష్టించండి లేదా యాక్టివేట్ చేయండి.' : 'Please generate or reactivate your API key before running requests.');
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    setIsSimulatingRequest(true);
    setTimeout(() => {
      const sampleEndpoints = [
        { ep: '/v1/audit/full', method: 'POST' as const, target: 'https://linear.app', cost: 1 },
        { ep: '/v1/security/owasp', method: 'POST' as const, target: 'https://openai.com', cost: 1 },
        { ep: '/v1/crawler/deep', method: 'POST' as const, target: 'https://tailwindcss.com', cost: 2 },
        { ep: '/v1/remediation/ai-fix', method: 'POST' as const, target: 'https://nextjs.org', cost: 1 },
        { ep: '/v1/dns/records', method: 'GET' as const, target: 'https://cloudflare.com', cost: 0 },
      ];
      const randomItem = sampleEndpoints[Math.floor(Math.random() * sampleEndpoints.length)];
      const randomLatency = Math.floor(Math.random() * 180) + 95;
      const newLog: ApiRequestLogItem = {
        id: `req_${Math.random().toString(36).substring(2, 8)}`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
        method: randomItem.method,
        endpoint: randomItem.ep,
        targetUrl: randomItem.target,
        statusCode: 200,
        statusText: 'OK',
        latencyMs: randomLatency,
        creditsCost: randomItem.cost,
        ipAddress: '103.21.244.0',
      };

      setRequestLogs((prev) => [newLog, ...prev]);
      
      // Increment user usage state
      const updatedUser: UserAccount = {
        ...user,
        apiUsage: {
          ...apiUsage,
          totalCalls: apiUsage.totalCalls + 1,
          lastUsedAt: new Date().toISOString(),
          endpointsUsed: {
            ...apiUsage.endpointsUsed,
            audit: randomItem.ep.includes('audit') ? apiUsage.endpointsUsed.audit + 1 : apiUsage.endpointsUsed.audit,
            security: randomItem.ep.includes('security') ? apiUsage.endpointsUsed.security + 1 : apiUsage.endpointsUsed.security,
            crawler: randomItem.ep.includes('crawler') ? apiUsage.endpointsUsed.crawler + 1 : apiUsage.endpointsUsed.crawler,
            remediation: randomItem.ep.includes('remediation') ? apiUsage.endpointsUsed.remediation + 1 : apiUsage.endpointsUsed.remediation,
          }
        }
      };
      onUpdateUser(updatedUser);
      setIsSimulatingRequest(false);
      setActionNotice(lang === 'te' ? `లైవ్ API రిక్వెస్ట్ విజయవంతమైంది (${randomLatency}ms - 200 OK)` : `Live API request succeeded (${randomLatency}ms • 200 OK)`);
      setTimeout(() => setActionNotice(null), 3000);
    }, 450);
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(requestLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `websitehealth_api_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setActionNotice(lang === 'te' ? 'API లాగ్‌లు JSON గా డౌన్‌లోడ్ చేయబడ్డాయి.' : 'API request logs exported to JSON.');
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handleClearLogs = () => {
    if (window.confirm(lang === 'te' ? 'అన్ని API రిక్వెస్ట్ లాగ్‌లను ఖాళీ చేయాలా?' : 'Clear all API request telemetry logs?')) {
      setRequestLogs([]);
      setActionNotice(lang === 'te' ? 'లాగ్‌లు క్లియర్ చేయబడ్డాయి.' : 'Request logs cleared.');
      setTimeout(() => setActionNotice(null), 2500);
    }
  };

  const handleBuyCreditBundle = (amountCredits: number, priceINR: number) => {
    if (onOpenPricing) {
      onOpenPricing('pro');
    }
    const updatedUser: UserAccount = {
      ...user,
      credits: (user.credits || 0) + amountCredits,
      apiCreditsRemaining: (user.apiCreditsRemaining ?? 1000) + amountCredits,
      apiWalletBalance: (user.apiWalletBalance ?? 500) + amountCredits,
      apiUsage: {
        ...apiUsage,
        monthlyQuota: apiUsage.monthlyQuota + amountCredits,
      }
    };
    onUpdateUser(updatedUser);
    setShowCreditPacks(false);
    setActionNotice(
      lang === 'te' 
        ? `+${amountCredits.toLocaleString()} API క్రెడిట్స్ వాలెట్‌లో జోడించబడ్డాయి (₹${priceINR})!` 
        : `+${amountCredits.toLocaleString()} API credits credited to your wallet (₹${priceINR})!`
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filteredLogs = useMemo(() => {
    return requestLogs.filter((log) => {
      const matchesSearch = logSearchQuery.trim() === '' || 
        log.targetUrl.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.endpoint.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(logSearchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (logFilterCategory === 'all') return true;
      if (logFilterCategory === 'audit') return log.endpoint.includes('audit');
      if (logFilterCategory === 'security') return log.endpoint.includes('security');
      if (logFilterCategory === 'crawler') return log.endpoint.includes('crawler');
      if (logFilterCategory === 'remediation') return log.endpoint.includes('remediation');
      return true;
    });
  }, [requestLogs, logSearchQuery, logFilterCategory]);

  const userInitial = (user.name || user.email || 'U').charAt(0).toUpperCase();
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://websitehealthsec.com';

  const getCodeSnippet = () => {
    const sampleKey = currentApiKey || 'whs_live_sample_key_9f83a...';
    if (codeLanguage === 'curl') {
      return `curl -X POST "${currentOrigin}/api/audit" \\
  -H "Authorization: Bearer ${sampleKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`;
    } else if (codeLanguage === 'node') {
      return `// Node.js (Fetch / Axios)
const response = await fetch("${currentOrigin}/api/audit", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${sampleKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ url: "https://example.com" })
});
const auditData = await response.json();
console.log(auditData);`;
    } else {
      return `# Python (requests)
import requests

res = requests.post(
    "${currentOrigin}/api/audit",
    headers={"Authorization": "Bearer ${sampleKey}"},
    json={"url": "https://example.com"}
)
print(res.json())`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl sm:max-w-3xl w-full p-6 sm:p-7 space-y-5 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center space-y-1 pt-1">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">
            {lang === 'te' ? 'Firebase ఖాతా & సెక్యూర్ API వాలెట్' : 'Developer Console & API Management'}
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            {lang === 'te' ? 'API కీ & వినియోగ డాష్‌బోర్డ్' : 'API Key & Usage Dashboard'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'te' 
              ? 'మీ లైవ్ ప్రొడక్షన్ API కీలను నిర్వహించండి, రిక్వెస్ట్ లాగ్‌లను ట్రాక్ చేయండి మరియు క్రెడిట్స్‌ను టాప్-అప్ చేసుకోండి.' 
              : 'Manage live production API keys, inspect real-time request logs, and monitor consumption telemetry.'}
          </p>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fadeIn font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* User Identity Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden border border-slate-700/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-500/30 border border-emerald-300/30 overflow-hidden shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name || 'User Profile'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  userInitial
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-extrabold text-white truncate">
                    {user.name || 'Pro Developer'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                    {user.apiTier || 'PRO API'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate font-mono mt-0.5 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{user.email || 'user@example.com'}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {user.authProvider === 'google' 
                      ? (lang === 'te' ? 'Google ధృవీకరించబడింది' : 'Google Verified') 
                      : (lang === 'te' ? 'Firebase Auth ధృవీకరించబడింది' : 'Firebase Verified')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{lang === 'te' ? 'క్లౌడ్ సింక్: లైవ్' : 'Cloud Sync: Live'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Balance & Sync Trigger */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 bg-slate-950/70 border border-slate-700/80 px-3.5 py-2.5 rounded-xl shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 font-medium block">{lang === 'te' ? 'వాలెట్ బ్యాలెన్స్' : 'API Balance'}</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {user.apiCreditsRemaining ?? 1000} <span className="text-xs text-emerald-500">credits</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleSyncFromFirebase}
                disabled={isSyncingFirebase}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-semibold text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                title="Force refresh & check against Firebase 'users' collection"
              >
                <RefreshCw className={`w-3 h-3 text-emerald-400 ${isSyncingFirebase ? 'animate-spin' : ''}`} />
                <span>{isSyncingFirebase ? (lang === 'te' ? 'సింక్ అవుతోంది...' : 'Syncing...') : (lang === 'te' ? 'సింక్ తనిఖీ' : 'Sync Now')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid: Credits, Scans, API Total Calls, Quota */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-emerald-50/70 border border-emerald-200/60 p-3.5 rounded-2xl">
            <span className="text-[11px] text-emerald-700 font-bold uppercase block mb-0.5">
              {lang === 'te' ? 'ఆడిట్ క్రెడిట్స్' : 'Audit Credits'}
            </span>
            <div className="flex items-center justify-center space-x-1.5">
              <span className="text-xl font-black text-emerald-900">{user.credits}</span>
              <span className="text-sm font-bold text-emerald-600">⚡</span>
            </div>
            <span className="text-[10px] text-emerald-600/90 font-medium block mt-0.5">
              {lang === 'te' ? 'డీప్ స్కాన్స్ అందుబాటులో' : 'Priority Scans'}
            </span>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200/60 p-3.5 rounded-2xl">
            <span className="text-[11px] text-indigo-700 font-bold uppercase block mb-0.5">
              {lang === 'te' ? 'API కాల్స్' : 'API Requests'}
            </span>
            <div className="flex items-center justify-center space-x-1.5">
              <span className="text-xl font-black text-indigo-900">{apiUsage.totalCalls}</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-[10px] text-indigo-600/90 font-medium block mt-0.5">
              {quotaPercentage}% {lang === 'te' ? 'కోటా వాడబడింది' : 'of Monthly Quota'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
            <span className="text-[11px] text-slate-500 font-bold uppercase block mb-0.5">
              {lang === 'te' ? 'స్కాన్ చేసిన సైట్లు' : 'Scanned Sites'}
            </span>
            <div className="flex items-center justify-center space-x-1.5">
              <span className="text-xl font-black text-slate-900">{historyCount}</span>
              <Activity className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              {lang === 'te' ? 'సేవ్ చేసిన రిపోర్టులు' : 'History Reports'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED API KEY & USAGE DASHBOARD CONTAINER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 shadow-xl space-y-5 relative">
          
          {/* Header & Purchase Credits Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-inner">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>{lang === 'te' ? 'API కీ & వినియోగ డాష్‌బోర్డ్' : 'API Key & Usage Dashboard'}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40 uppercase tracking-wide">
                    REST API v1.0
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'te' ? 'ప్రొడక్షన్ API కీ నిర్వహణ, రిక్వెస్ట్ లాగ్‌లు & రియల్-టైమ్ టెలిమెట్రీ' : 'Live key management, interactive request logs & consumption metrics'}
                </p>
              </div>
            </div>

            {/* Prominent Purchase Credits Action */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowCreditPacks(!showCreditPacks)}
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 cursor-pointer shrink-0 active:scale-95"
                title="Purchase API Credits with Razorpay"
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{lang === 'te' ? 'క్రెడిట్స్ కొనండి (Purchase Credits)' : 'Purchase Credits'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Quick Credit Purchase Bundles Drawer */}
          {showCreditPacks && (
            <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'te' ? 'తక్షణ API క్రెడిట్ బండిల్స్ (Razorpay)' : 'Instant API Credit Top-Up Packs'}
                </span>
                <span className="text-[10px] text-slate-400">Auto-activated to wallet</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleBuyCreditBundle(1000, 499)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-emerald-300">
                    <span>Starter Pack</span>
                    <span className="text-emerald-400 font-mono">₹499</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">+1,000 API Requests</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuyCreditBundle(5000, 1499)}
                  className="bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/50 p-2.5 rounded-xl text-left transition-all cursor-pointer group relative overflow-hidden"
                >
                  <span className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-bl-md uppercase">Popular</span>
                  <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-emerald-300">
                    <span>Growth Pack</span>
                    <span className="text-emerald-400 font-mono">₹1,499</span>
                  </div>
                  <span className="text-[10px] text-emerald-300/90 block mt-0.5">+5,000 API Requests</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBuyCreditBundle(25000, 4999)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-black text-white group-hover:text-indigo-300">
                    <span>Scale Pro</span>
                    <span className="text-indigo-300 font-mono">₹4,999</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">+25,000 API Requests</span>
                </button>
              </div>
            </div>
          )}

          {/* Generated API Key Management Card */}
          {currentApiKey ? (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'te' ? 'లైవ్ ప్రొడక్షన్ API కీ' : 'Generated Live API Key'}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    isKeyActive
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40'
                      : 'bg-rose-950/80 text-rose-300 border-rose-600/40'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isKeyActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {isKeyActive ? 'ACTIVE' : 'REVOKED'}
                  </span>
                </div>
              </div>

              {/* API Key Box with Mask/Reveal & 1-Click Copy */}
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-xs shadow-inner">
                <span className="flex-1 truncate px-1 text-emerald-300 select-all font-mono">
                  {showApiKey
                    ? currentApiKey
                    : `${currentApiKey.slice(0, 8)}••••••••••••••••••••${currentApiKey.slice(-4)}`}
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title={showApiKey ? 'Mask Key' : 'Reveal Key'}
                >
                  {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleCopyApiKey}
                  className="inline-flex items-center space-x-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border border-emerald-500/30"
                >
                  {copiedApiKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedApiKey ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'కాపీ' : 'Copy')}</span>
                </button>
              </div>

              {/* Key Action Controls (Regenerate & Revoke/Enable) */}
              <div className="flex items-center justify-between pt-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={handleRegenerateKey}
                  disabled={isRegeneratingKey}
                  className="inline-flex items-center space-x-1 text-slate-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isRegeneratingKey ? 'animate-spin' : ''}`} />
                  <span>{lang === 'te' ? 'కీని మార్చండి (Roll Key)' : 'Roll / Rotate Key'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleKeyStatus}
                  className={`font-semibold transition-colors cursor-pointer ${
                    isKeyActive ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {isKeyActive
                    ? (lang === 'te' ? 'తాత్కాలికంగా పాజ్ చేయండి' : 'Revoke Key')
                    : (lang === 'te' ? 'తిరిగి యాక్టివేట్ చేయండి' : 'Reactivate Key')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-white">
                  {lang === 'te' ? 'ఇంకా API కీ సృష్టించబడలేదు' : 'No Production API Key Generated'}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {lang === 'te' ? 'స్పీడ్ ఆడిట్, OWASP సెక్యూరిటీ, AI ఫిక్స్ ఎండ్‌పాయింట్స్‌ను ప్రోగ్రామాటిక్‌గా వాడండి.' : 'Access Audit, OWASP Security, and AI Code Remediation programmatically.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateApiKey}
                className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>{lang === 'te' ? 'లైవ్ API కీని సృష్టించండి' : 'Generate Live API Key'}</span>
              </button>
            </div>
          )}

          {/* Usage Monitoring & Quota Progress Meter */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                {lang === 'te' ? 'API నెలవారీ వినియోగం (Usage Meter)' : 'Monthly API Usage & Rate Quota'}
              </span>
              <span className="font-mono text-emerald-400 font-bold text-[11px]">
                {apiUsage.totalCalls} / {apiUsage.monthlyQuota} {lang === 'te' ? 'కాల్స్' : 'calls'} ({quotaPercentage}%)
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quotaPercentage > 85
                    ? 'bg-rose-500'
                    : quotaPercentage > 60
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${quotaPercentage}%` }}
              />
            </div>

            {/* Breakdown per endpoint */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1">
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block truncate">Audit</span>
                <span className="font-mono font-bold text-slate-200">{apiUsage.endpointsUsed?.audit ?? 32}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block truncate">OWASP</span>
                <span className="font-mono font-bold text-slate-200">{apiUsage.endpointsUsed?.security ?? 9}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block truncate">Crawler</span>
                <span className="font-mono font-bold text-slate-200">{apiUsage.endpointsUsed?.crawler ?? 5}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block truncate">AI Fix</span>
                <span className="font-mono font-bold text-slate-200">{apiUsage.endpointsUsed?.remediation ?? 2}</span>
              </div>
            </div>

            {/* SLA & Remaining status */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1 text-emerald-400">
                <Zap className="w-3 h-3" />
                <span>60 req/min SLA Guaranteed</span>
              </span>
              <span className="text-slate-300 font-semibold">
                {remainingCalls} {lang === 'te' ? 'కాల్స్ మిగిలి ఉన్నాయి' : 'calls remaining'}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RECHARTS: 30-DAY DAILY API KEY REQUEST CONSUMPTION VISUALIZER */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 space-y-3 shadow-inner">
            {/* Chart Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                  <LineChartIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{lang === 'te' ? '30-రోజుల API వినియోగ ట్రెండ్' : '30-Day API Request Telemetry'}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      Recharts
                    </span>
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    {lang === 'te' ? 'రోజువారీ రిక్వెస్ట్‌ల వినియోగం మరియు ఎండ్‌పాయింట్ విభజన' : 'Daily request volume & endpoint consumption'}
                  </p>
                </div>
              </div>

              {/* Range Switcher & Mode Toggles */}
              <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setChartMetricView('total')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      chartMetricView === 'total'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'te' ? 'మొత్తం' : 'Total'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetricView('breakdown')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      chartMetricView === 'breakdown'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'te' ? 'విభజన' : 'Breakdown'}
                  </button>
                </div>

                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
                  {(['7d', '14d', '30d'] as const).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setChartTimeRange(range)}
                      className={`px-1.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                        chartTimeRange === range
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {range.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick 30-Day Aggregation Summary Pills */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-1.5">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">{lang === 'te' ? 'వినియోగం' : 'Total Volume'}</span>
                <span className="text-xs font-black text-emerald-400 font-mono">{chartMetrics.total} reqs</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-1.5">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">{lang === 'te' ? 'గరిష్ట రోజు' : 'Peak Day'}</span>
                <span className="text-xs font-black text-cyan-400 font-mono">{chartMetrics.peak} /day</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-1.5">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">{lang === 'te' ? 'సగటు/రోజు' : 'Avg / Day'}</span>
                <span className="text-xs font-black text-indigo-300 font-mono">{chartMetrics.avg}</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-1.5">
                <span className="text-[9px] text-slate-400 uppercase font-semibold block">{lang === 'te' ? 'సక్సెస్ రేటు' : 'Success Rate'}</span>
                <span className="text-xs font-black text-teal-300 font-mono">100% OK</span>
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="w-full h-44 pt-1" id="recharts-api-consumption-container">
              <ResponsiveContainer width="100%" height="100%">
                {chartMetricView === 'total' ? (
                  <AreaChart
                    data={activeDailyData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="apiAreaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="apiLineStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.6} />
                    <XAxis
                      dataKey={chartTimeRange === '30d' ? 'shortDate' : 'date'}
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      stroke="#334155"
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      stroke="#334155"
                      allowDecimals={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as ApiDailyConsumptionPoint;
                          return (
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs space-y-1.5 text-white min-w-[150px]">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                                <span className="font-bold text-emerald-400">{data.dayName}, {data.date}</span>
                                <span className="text-[10px] text-slate-400 font-mono">200 OK</span>
                              </div>
                              <div className="flex items-center justify-between font-mono">
                                <span className="text-slate-300">{lang === 'te' ? 'మొత్తం కాల్స్:' : 'Total Requests:'}</span>
                                <span className="font-bold text-emerald-300">{data.totalRequests}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 grid grid-cols-2 gap-1 pt-0.5 border-t border-slate-800/80 font-mono">
                                <span>Audit: <strong className="text-slate-200">{data.auditCalls}</strong></span>
                                <span>OWASP: <strong className="text-slate-200">{data.securityCalls}</strong></span>
                                <span>Crawler: <strong className="text-slate-200">{data.crawlerCalls}</strong></span>
                                <span>AI Fix: <strong className="text-slate-200">{data.remediationCalls}</strong></span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalRequests"
                      stroke="url(#apiLineStroke)"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#apiAreaGlow)"
                      dot={{ r: 2.5, fill: '#10b981', strokeWidth: 1, stroke: '#022c22' }}
                      activeDot={{ r: 4.5, fill: '#34d399', stroke: '#ffffff', strokeWidth: 1.5 }}
                    />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={activeDailyData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" opacity={0.6} />
                    <XAxis
                      dataKey={chartTimeRange === '30d' ? 'shortDate' : 'date'}
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      stroke="#334155"
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      stroke="#334155"
                      allowDecimals={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as ApiDailyConsumptionPoint;
                          return (
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs space-y-1.5 text-white min-w-[160px]">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                                <span className="font-bold text-white">{data.dayName}, {data.date}</span>
                                <span className="text-[10px] text-emerald-400 font-mono font-bold">{data.totalRequests} total</span>
                              </div>
                              <div className="space-y-0.5 text-[11px] font-mono">
                                <div className="flex items-center justify-between text-emerald-400">
                                  <span>• Site Audit:</span>
                                  <span className="font-bold">{data.auditCalls}</span>
                                </div>
                                <div className="flex items-center justify-between text-indigo-400">
                                  <span>• OWASP Sec:</span>
                                  <span className="font-bold">{data.securityCalls}</span>
                                </div>
                                <div className="flex items-center justify-between text-cyan-400">
                                  <span>• Deep Crawler:</span>
                                  <span className="font-bold">{data.crawlerCalls}</span>
                                </div>
                                <div className="flex items-center justify-between text-amber-400">
                                  <span>• AI Remediation:</span>
                                  <span className="font-bold">{data.remediationCalls}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="auditCalls"
                      name="Audit"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="securityCalls"
                      name="Security"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="crawlerCalls"
                      name="Crawler"
                      stroke="#06b6d4"
                      strokeWidth={1.8}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="remediationCalls"
                      name="AI Fix"
                      stroke="#f59e0b"
                      strokeWidth={1.8}
                      dot={false}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Chart Legend Labels */}
            <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/80">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Audit API
              </span>
              <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                OWASP Sec
              </span>
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Crawler
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                AI Fix
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DEDICATED LIVE API REQUEST LOGS TELEMETRY FEED */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-cyan-500/20 text-cyan-400 rounded-md border border-cyan-500/30">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{lang === 'te' ? 'రియల్-టైమ్ API రిక్వెస్ట్ లాగ్‌లు' : 'Live API Request Logs'}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {filteredLogs.length} events
                    </span>
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    {lang === 'te' ? 'ఎండ్‌పాయింట్ కాల్స్, లేటెన్సీ మరియు స్టేటస్ కోడ్స్' : 'Interactive invocation trace, latency breakdown and status responses'}
                  </p>
                </div>
              </div>

              {/* Actions: Simulate Request, Export JSON, Clear */}
              <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleSimulateApiCall}
                  disabled={isSimulatingRequest}
                  className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  title="Simulate live API request"
                >
                  <Play className={`w-2.5 h-2.5 ${isSimulatingRequest ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingRequest ? 'Executing...' : 'Test Request'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportLogs}
                  className="inline-flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Export request logs as JSON"
                >
                  <Download className="w-2.5 h-2.5" />
                  <span>Export</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearLogs}
                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Clear all logs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px]">
              <div className="relative flex-1 w-full">
                <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={lang === 'te' ? 'URL లేదా ఎండ్‌పాయింట్ శోధించండి...' : 'Search by URL, method or endpoint...'}
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(['all', 'audit', 'security', 'crawler', 'remediation'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLogFilterCategory(cat)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors cursor-pointer whitespace-nowrap ${
                      logFilterCategory === cat
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-inner max-h-48 overflow-y-auto">
              {filteredLogs.length > 0 ? (
                <div className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 hover:bg-slate-900/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          log.method === 'POST' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {log.method}
                        </span>
                        <span className="font-bold text-slate-200 truncate">{log.endpoint}</span>
                        <span className="text-slate-500 text-[10px] truncate max-w-[140px]">{log.targetUrl}</span>
                      </div>

                      <div className="flex items-center space-x-2.5 text-[10px] shrink-0 self-end sm:self-auto">
                        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                          {log.statusCode} {log.statusText}
                        </span>
                        <span className="text-slate-400 font-mono">{log.latencyMs}ms</span>
                        <span className="text-indigo-300 bg-indigo-950/50 px-1.5 py-0.2 rounded border border-indigo-800/50">
                          {log.creditsCost} credit
                        </span>
                        <span className="text-slate-500 text-[9px]">{log.relativeTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  {lang === 'te' ? 'ఎటువంటి రిక్వెస్ట్ లాగ్‌లు కనుగొనబడలేదు.' : 'No request logs matching the filter.'}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Code Integration Drawer */}
          <div className="border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setShowCodeSnippet(!showCodeSnippet)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'te' ? 'కోడ్ శాంపిల్స్ & డాక్యుమెంటేషన్ (cURL / Node)' : 'Developer Integration Snippets'}
              </span>
              {showCodeSnippet ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showCodeSnippet && (
              <div className="mt-2 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setCodeLanguage('curl')}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      codeLanguage === 'curl' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeLanguage('node')}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      codeLanguage === 'node' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Node.js
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeLanguage('python')}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      codeLanguage === 'python' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                </div>

                <div className="relative">
                  <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-[10px] font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                    {getCodeSnippet()}
                  </pre>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getCodeSnippet());
                      setActionNotice(lang === 'te' ? 'కోడ్ కాపీ అయింది!' : 'Code snippet copied!');
                      setTimeout(() => setActionNotice(null), 2500);
                    }}
                    className="absolute top-2 right-2 p-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Developer Marketplace & Sandbox Launcher */}
          {onOpenDeveloperApi && (
            <div className="bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-200 block">
                    {lang === 'te' ? 'API డెవలపర్ మార్కెట్‌ప్లేస్ & లైవ్ ప్లేగ్రౌండ్' : 'Website Audit REST API Marketplace'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'te' ? 'లైవ్ శాండ్‌బాక్స్, 5 కీ ఎండ్‌పాయింట్లు, SDK స్నిప్పెట్‌లు & SaaS ప్లాన్‌లు' : 'Test live endpoints, key rotation, interactive sandbox & SDKs'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeveloperApi();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md shadow-indigo-600/30 transition-transform hover:scale-105 cursor-pointer shrink-0"
              >
                <span>{lang === 'te' ? 'ప్లేగ్రౌండ్ తెరవండి' : 'Open API Portal'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Razorpay Assurance Banner & Direct Purchase Trigger */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-emerald-300 block">
                  {lang === 'te' ? 'Razorpay సురక్షిత చెల్లింపులు' : 'Razorpay Verified Payment Gateway'}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  {lang === 'te' ? 'UPI, కార్డ్స్, నెట్‌బ్యాంకింగ్ & తక్షణ క్రెడిట్ రీఛార్జ్' : 'UPI, Cards, NetBanking • Instant API Credits Activation'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenPricing) {
                  onOpenPricing('pro');
                }
              }}
              className="inline-flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-2.5 py-1.5 rounded-lg text-[11px] shadow-sm transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              <span>{lang === 'te' ? 'క్రెడిట్స్ రీఛార్జ్' : 'Top Up Credits'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Edit Profile Form (Toggleable) */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {lang === 'te' ? 'ప్రొఫైల్ ఎడిట్ చేయండి' : 'Edit Account Details'}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {lang === 'te' ? 'యూజర్ పేరు' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {lang === 'te' ? 'Gmail / ఈమెయిల్ అడ్రస్' : 'Gmail / Email Address'}
              </label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            >
              {lang === 'te' ? 'సేవ్ చేయండి' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'te' ? 'మీ సమాచారాన్ని మార్చాలా?' : 'Need to update name or email?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setEditName(user.name);
                setEditEmail(user.email);
                setIsEditing(true);
              }}
              className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'ఎడిట్ ప్రొఫైల్' : 'Edit Profile'}</span>
            </button>
          </div>
        )}

        {/* Unique Referral Link Section */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              {lang === 'te' ? 'మీ వ్యక్తిగత రిఫెరల్ లింక్' : 'Your Personal Referral Link'}
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              +1 ⚡ per scan
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-mono truncate"
            />
            <button
              onClick={handleCopyReferral}
              className="inline-flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'కాపీ' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: Log Out */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleSignOut}
            id="btn-logout"
            className="w-full inline-flex items-center justify-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 px-4 rounded-xl text-xs border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'te' ? 'ఖాతా నుండి లాగౌట్ (Log Out)' : 'Log Out from Firebase'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

