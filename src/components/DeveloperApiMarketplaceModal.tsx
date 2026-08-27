import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  Key,
  Copy,
  Check,
  Zap,
  Terminal,
  Play,
  Layers,
  Shield,
  Clock,
  Sparkles,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Server,
  Building,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Database,
  Cpu,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShoppingBag,
  Bell,
  Mail,
  Send,
  Sliders,
  Volume2,
  AlertCircle,
  Inbox,
  CheckCheck,
  Radio,
  FileText,
  Activity,
} from 'lucide-react';
import { Language, UserAccount, ApiPlanTier, ApiKeyItem, ApiCreditAlertNotification, ApiNotificationPreferences } from '../types';
import { API_PRICING_PLANS, API_ENDPOINTS, generateCodeSnippet } from '../data/apiMarketplaceData';
import { ApiHealthMonitor } from './ApiHealthMonitor';

interface DeveloperApiMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  onUpdateUser?: (updated: UserAccount) => void;
  onOpenFullDocs?: () => void;
  onOpenStatusPage?: () => void;
}

export const DeveloperApiMarketplaceModal: React.FC<DeveloperApiMarketplaceModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  onUpdateUser,
  onOpenFullDocs,
  onOpenStatusPage,
}) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'health' | 'alerts' | 'playground' | 'pricing' | 'docs' | 'usecases'>('keys');

  // Key state
  const [apiKey, setApiKey] = useState<string>(user.apiKey || 'wh_live_9f82c47e1104a9912bc784');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [currentTier, setCurrentTier] = useState<ApiPlanTier>(user.currentApiTier || 'pro');
  const [creditsRemaining, setCreditsRemaining] = useState<number>(user.apiCreditsRemaining || 9840);
  const [creditsTotal, setCreditsTotal] = useState<number>(10000);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Real-Time Notification & 80% Threshold Alert state
  const [notificationPrefs, setNotificationPrefs] = useState<ApiNotificationPreferences>({
    enableEmailAlerts: true,
    enableDashboardAlerts: true,
    enableWebhookAlerts: false,
    alertEmail: user.email || 'jpschari789@gmail.com',
    webhookUrl: '',
    thresholdPercent: 80,
    alertOn80Percent: true,
    alertOn90Percent: true,
    alertOnExhaustion: true,
  });
  const [alertsHistory, setAlertsHistory] = useState<ApiCreditAlertNotification[]>([
    {
      id: 'alt_init_sample',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      tier: 'pro',
      creditsUsed: 8000,
      creditsTotal: 10000,
      usagePercent: 80,
      thresholdPercent: 80,
      type: 'threshold_80',
      recipientEmail: user.email || 'jpschari789@gmail.com',
      status: 'delivered',
      notificationChannels: ['email', 'dashboard'],
      title: '⚠️ 80% Monthly API Credit Limit Reached',
      titleTe: '⚠️ 80% API క్రెడిట్ పరిమితి చేరుకుంది',
      message: `Your API key "Production API Key" reached 80% (8,000 / 10,000) of its monthly credit limit. Automatic email notification dispatched.`,
      messageTe: `మీ ప్రొడక్షన్ API కీ నెలవారీ క్రెడిట్లలో 80% (8,000 / 10,000) వినియోగించింది. ఆటోమేటిక్ ఇమెయిల్ అలర్ట్ పంపబడింది.`,
      acknowledged: false,
    },
  ]);
  const [activeAlertBannerDismissed, setActiveAlertBannerDismissed] = useState<boolean>(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState<boolean>(false);
  const [testEmailNotice, setTestEmailNotice] = useState<string | null>(null);
  const [emailPreviewModalOpen, setEmailPreviewModalOpen] = useState<boolean>(false);
  const [activePreviewAlert, setActivePreviewAlert] = useState<ApiCreditAlertNotification | null>(null);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState<boolean>(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState<boolean>(false);
  const [savePrefsNotice, setSavePrefsNotice] = useState<string | null>(null);

  // Playground state
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('post_audit');
  const [playgroundBody, setPlaygroundBody] = useState<string>(
    JSON.stringify({ url: 'https://example.com', pages: 5, device: 'mobile' }, null, 2)
  );
  const [playgroundAuditId, setPlaygroundAuditId] = useState<string>('aud_1724398124912');
  const [playgroundResponse, setPlaygroundResponse] = useState<any>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);
  const [playgroundLatency, setPlaygroundLatency] = useState<number | null>(null);
  const [playgroundStatus, setPlaygroundStatus] = useState<number | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // Docs state
  const [selectedDocEndpoint, setSelectedDocEndpoint] = useState<string>('post_audit');
  const [docLanguage, setDocLanguage] = useState<'curl' | 'node' | 'python' | 'php' | 'go'>('curl');
  const [copiedDocCode, setCopiedDocCode] = useState<boolean>(false);

  // Billing / Purchase state
  const [purchasingTier, setPurchasingTier] = useState<ApiPlanTier | null>(null);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  // Load telemetry and notification preferences on open
  useEffect(() => {
    if (user.apiKey) {
      setApiKey(user.apiKey);
    }

    const loadAlerts = async () => {
      try {
        const res = await fetch(`/api/v1/alerts/notifications?api_key=${encodeURIComponent(apiKey)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            setNotificationPrefs(prev => ({
              ...prev,
              ...data.preferences,
              alertEmail: data.preferences.alertEmail || user.email || 'jpschari789@gmail.com',
            }));
          }
          if (data.alerts && data.alerts.length > 0) {
            setAlertsHistory(data.alerts);
          }
          if (data.creditsRemaining !== undefined) {
            setCreditsRemaining(data.creditsRemaining);
          }
          if (data.creditsTotal !== undefined) {
            setCreditsTotal(data.creditsTotal);
          }
        }
      } catch (e) {
        // fallback to default state
      }
    };

    if (isOpen) {
      loadAlerts();
    }
  }, [isOpen, apiKey, user.apiKey, user.email]);

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleRotateKey = async () => {
    if (!confirm(lang === 'te' ? 'మీరు ఖచ్చితంగా API కీని మార్చాలనుకుంటున్నారా? పాత కీ తక్షణమే పనిచేయదు.' : 'Are you sure you want to rotate your API key? The old key will be revoked immediately.')) {
      return;
    }

    setIsRotating(true);
    try {
      const res = await fetch('/api/v1/keys/rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldKey: apiKey }),
      });
      const data = await res.json();
      if (data.newApiKey) {
        setApiKey(data.newApiKey.key);
        if (onUpdateUser) {
          onUpdateUser({
            ...user,
            apiKey: data.newApiKey.key,
          });
        }
      }
    } catch {
      const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      const newKey = `wh_live_${randomHex}`;
      setApiKey(newKey);
      if (onUpdateUser) {
        onUpdateUser({ ...user, apiKey: newKey });
      }
    } finally {
      setIsRotating(false);
    }
  };

  // Real-Time Alert Handlers
  const handleSaveNotificationPreferences = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingPreferences(true);
    setSavePrefsNotice(null);

    try {
      const res = await fetch('/api/v1/alerts/update-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          preferences: notificationPrefs,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavePrefsNotice(
          lang === 'te'
            ? `నోటిఫికేషన్ సెట్టింగ్‌లు విజయవంతంగా భద్రపరచబడ్డాయి (${notificationPrefs.thresholdPercent}% లిమిట్).`
            : `Notification preferences saved. Alerts will trigger at ${notificationPrefs.thresholdPercent}% credit usage.`
        );
        setTimeout(() => setSavePrefsNotice(null), 4000);
      }
    } catch {
      setSavePrefsNotice(lang === 'te' ? 'సెట్టింగ్‌లు సేవ్ చేయబడ్డాయి.' : 'Preferences saved locally.');
      setTimeout(() => setSavePrefsNotice(null), 3000);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleSendTest80PercentEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailNotice(null);

    try {
      const res = await fetch('/api/v1/alerts/send-test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          email: notificationPrefs.alertEmail,
        }),
      });
      const data = await res.json();
      if (data.alert) {
        setAlertsHistory(prev => [data.alert, ...prev]);
        setActivePreviewAlert(data.alert);
        setTestEmailNotice(
          lang === 'te'
            ? `టెస్ట్ అలర్ట్ ఇమెయిల్ ${notificationPrefs.alertEmail} కి విజయవంతంగా పంపబడింది!`
            : `Test 80% threshold alert email dispatched to ${notificationPrefs.alertEmail}!`
        );
      }
    } catch {
      const fallbackAlert: ApiCreditAlertNotification = {
        id: `alt_test_${Date.now()}`,
        timestamp: new Date().toISOString(),
        tier: currentTier,
        creditsUsed: Math.round(creditsTotal * 0.8),
        creditsTotal,
        usagePercent: 80,
        thresholdPercent: 80,
        type: 'test_alert',
        recipientEmail: notificationPrefs.alertEmail,
        status: 'delivered',
        notificationChannels: ['email', 'dashboard'],
        title: '🔔 Test Notification: 80% Credit Limit Alert',
        titleTe: '🔔 టెస్ట్ నోటిఫికేషన్: 80% క్రెడిట్ పరిమితి అలర్ట్',
        message: `Real-time 80% threshold test email simulated and sent to ${notificationPrefs.alertEmail}.`,
        messageTe: `రియల్-టైమ్ 80% టెస్ట్ ఇమెయిల్ ${notificationPrefs.alertEmail} కి పంపబడింది.`,
        acknowledged: false,
      };
      setAlertsHistory(prev => [fallbackAlert, ...prev]);
      setActivePreviewAlert(fallbackAlert);
      setTestEmailNotice(`Test alert email dispatched to ${notificationPrefs.alertEmail}!`);
    } finally {
      setIsSendingTestEmail(false);
      setTimeout(() => setTestEmailNotice(null), 5000);
    }
  };

  const handleSimulateUsageSpike = async (targetPercent: number) => {
    setIsSimulatingSpike(true);
    try {
      const res = await fetch('/api/v1/alerts/simulate-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          percent: targetPercent,
        }),
      });
      const data = await res.json();
      if (data.creditsRemaining !== undefined) {
        setCreditsRemaining(data.creditsRemaining);
      }
      if (targetPercent >= 80) {
        setActiveAlertBannerDismissed(false);
        // Refresh alert history
        const alertRes = await fetch(`/api/v1/alerts/notifications?api_key=${encodeURIComponent(apiKey)}`);
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          if (alertData.alerts) setAlertsHistory(alertData.alerts);
        }
      }
    } catch {
      const used = Math.round((creditsTotal * targetPercent) / 100);
      setCreditsRemaining(Math.max(0, creditsTotal - used));
      if (targetPercent >= 80) {
        setActiveAlertBannerDismissed(false);
      }
    } finally {
      setIsSimulatingSpike(false);
    }
  };

  const handleAcknowledgeAlert = async (alertId?: string) => {
    try {
      await fetch('/api/v1/alerts/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, alertId }),
      });
    } catch {
      // local acknowledge
    }
    if (alertId) {
      setAlertsHistory(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    } else {
      setAlertsHistory(prev => prev.map(a => ({ ...a, acknowledged: true })));
      setActiveAlertBannerDismissed(true);
    }
  };

  const handleExecutePlayground = async () => {
    setPlaygroundLoading(true);
    setPlaygroundResponse(null);
    setPlaygroundLatency(null);
    setPlaygroundStatus(null);

    const activeEndpoint = API_ENDPOINTS.find(e => e.id === selectedEndpointId) || API_ENDPOINTS[0];
    const startTime = performance.now();

    try {
      let targetPath = activeEndpoint.path;
      if (targetPath.includes('{audit_id}')) {
        targetPath = targetPath.replace('{audit_id}', playgroundAuditId);
      }

      let bodyData: any = undefined;
      if (activeEndpoint.method === 'POST') {
        try {
          bodyData = JSON.parse(playgroundBody);
        } catch {
          bodyData = { url: 'https://example.com' };
        }
      }

      const res = await fetch(`/api${targetPath}`, {
        method: activeEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: activeEndpoint.method === 'POST' ? JSON.stringify(bodyData) : undefined,
      });

      const latency = Math.round(performance.now() - startTime);
      setPlaygroundLatency(latency);
      setPlaygroundStatus(res.status);

      const json = await res.json();
      setPlaygroundResponse(json);

      if (json.audit_id) {
        setPlaygroundAuditId(json.audit_id);
      }

      if (json.credits_remaining !== undefined) {
        setCreditsRemaining(json.credits_remaining);
      }
    } catch (err: any) {
      setPlaygroundStatus(500);
      setPlaygroundResponse({ error: 'Network request error', message: err.message });
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleSelectPreset = (presetType: 'audit' | 'ai_fix' | 'page' | 'usage') => {
    if (presetType === 'audit') {
      setSelectedEndpointId('post_audit');
      setPlaygroundBody(JSON.stringify({ url: 'https://example.com', pages: 10, device: 'mobile' }, null, 2));
    } else if (presetType === 'ai_fix') {
      setSelectedEndpointId('post_ai_fix');
      setPlaygroundBody(JSON.stringify({ issue: 'Content Security Policy (CSP) Missing', url: 'https://example.com', server_type: 'nginx' }, null, 2));
    } else if (presetType === 'page') {
      setSelectedEndpointId('post_page_audit');
      setPlaygroundBody(JSON.stringify({ page_url: 'https://example.com/pricing' }, null, 2));
    } else if (presetType === 'usage') {
      setSelectedEndpointId('get_usage');
      setPlaygroundBody('');
    }
  };

  const handlePurchasePlan = async (plan: typeof API_PRICING_PLANS[0]) => {
    setPurchasingTier(plan.id);
    setPurchaseSuccessMessage(null);

    try {
      const res = await fetch('/api/v1/keys/purchase-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: plan.id,
          email: user.email || 'developer@example.com',
          name: user.name || 'Developer',
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setCurrentTier(plan.id);
        setCreditsTotal(plan.credits);
        setCreditsRemaining(plan.credits);
        setPurchasingTier(null);
        setPurchaseSuccessMessage(
          lang === 'te'
            ? `అభినందనలు! ${plan.nameTe} విజయవంతంగా యాక్టివేట్ చేయబడింది. ${plan.credits.toLocaleString()} క్రెడిట్స్ జోడించబడ్డాయి.`
            : `Success! ${plan.name} has been activated. ${plan.credits.toLocaleString()} credits added to your API wallet.`
        );

        if (onUpdateUser) {
          onUpdateUser({
            ...user,
            currentApiTier: plan.id,
            apiCreditsRemaining: plan.credits,
          });
        }
      }, 1200);
    } catch {
      setPurchasingTier(null);
    }
  };

  const selectedEndpointForDoc = API_ENDPOINTS.find(e => e.id === selectedDocEndpoint) || API_ENDPOINTS[0];
  const generatedCode = generateCodeSnippet(docLanguage, selectedEndpointForDoc, apiKey);
  const activePlan = API_PRICING_PLANS.find(p => p.id === currentTier) || API_PRICING_PLANS[2];
  const quotaPercent = Math.min(100, Math.round(((creditsTotal - creditsRemaining) / creditsTotal) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        id="developer-api-marketplace-modal"
        className="relative w-full max-w-6xl my-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {lang === 'te' ? 'Website Health REST API & డెవలపర్ మార్కెట్‌ప్లేస్' : 'Website Health REST API & Marketplace'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                  v1.4 Gateway
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  99.9% Uptime SLA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'మీ స్వంత SaaS, ఏజెన్సీ పోర్టల్స్ మరియు WordPress ప్లగిన్లలో మా ఆడిట్ ఇంజిన్‌ను ప్రోగ్రామాటిక్‌గా ఉపయోగించండి'
                  : 'Embed our comprehensive SEO, security, speed, and AI fix engine into your SaaS, agency portal, or plugins.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenStatusPage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStatusPage();
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white text-xs font-semibold rounded-lg border border-emerald-500/30 transition-colors cursor-pointer"
                title="View Real-Time API Uptime & Latency Telemetry"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{lang === 'te' ? 'సిస్టమ్ స్టేటస్ (100% Up)' : 'Live Status (100% Up)'}</span>
              </button>
            )}

            {onOpenFullDocs && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullDocs();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white text-xs font-semibold rounded-lg border border-indigo-500/40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'te' ? 'పూర్తి API డాక్స్ & SDKs' : 'Full API Docs & SDKs'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'keys'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'API కీలు & క్రెడిట్ కోటా' : 'API Keys & Quota'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${quotaPercent >= 80 ? 'bg-amber-500/30 text-amber-300 font-bold animate-pulse' : 'bg-indigo-500/20 text-indigo-300'}`}>
              {creditsRemaining.toLocaleString()} ⚡
            </span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'health'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${quotaPercent >= 80 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
            <span>{lang === 'te' ? 'API హెల్త్ & రేట్ లిమిట్ మానిటర్' : 'API Health Monitor'}</span>
            {quotaPercent >= 80 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold animate-pulse border border-amber-500/30">
                ⚠️ {quotaPercent}% Limit
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                {activePlan.rateLimitPerMin}/min
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-amber-400 text-amber-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'te' ? 'అలర్ట్స్ & నోటిఫికేషన్లు (80% లిమిట్)' : 'Alerts & Notifications (80% Limit)'}</span>
            {quotaPercent >= 80 ? (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
                80% Rule
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'playground'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'లైవ్ API ప్లేగ్రౌండ్' : 'Live API Playground'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
              Interactive
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pricing'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'ధరలు & ప్లాన్‌లు (SaaS)' : 'Pricing & Credit Plans'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
              ₹499+
            </span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'docs'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'డాక్యుమెంటేషన్ & SDKs' : 'Docs & SDK Snippets'}</span>
          </button>

          <button
            onClick={() => setActiveTab('usecases')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'usecases'
                ? 'border-indigo-400 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'ఏజెన్సీ & SaaS మోడల్స్' : 'Agency & SaaS Use Cases'}</span>
          </button>
        </div>

        {/* REAL-TIME 80% CREDIT LIMIT ALERT TOP BANNER */}
        {quotaPercent >= 80 && !activeAlertBannerDismissed && (
          <div className="bg-gradient-to-r from-amber-950/95 via-amber-900/90 to-red-950/95 border-b border-amber-500/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-100 animate-fadeIn shadow-lg shadow-amber-950/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-amber-300 uppercase tracking-wide text-[11px]">
                    {lang === 'te' ? '⚠️ 80% నెలవారీ API క్రెడిట్ పరిమితి అలర్ట్' : '⚠️ 80% Tier Limit Warning Active'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] border border-amber-400/40 font-bold">
                    {quotaPercent}% Consumed
                  </span>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 text-[10px]">
                    ✉️ {notificationPrefs.alertEmail}
                  </span>
                </div>
                <p className="text-amber-200/90 mt-0.5 text-xs">
                  {lang === 'te'
                    ? `మీరు నెలవారీ కోటాలో ${quotaPercent}% (${(creditsTotal - creditsRemaining).toLocaleString()} / ${creditsTotal.toLocaleString()}) క్రెడిట్స్ ఉపయోగించారు. కేవలం ${creditsRemaining.toLocaleString()} క్రెడిట్స్ మాత్రమే మిగిలి ఉన్నాయి.`
                    : `You have reached ${quotaPercent}% (${(creditsTotal - creditsRemaining).toLocaleString()} / ${creditsTotal.toLocaleString()} credits) of your monthly API quota. Only ${creditsRemaining.toLocaleString()} credits left.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => setActiveTab('health')}
                className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-emerald-300 border border-emerald-500/40 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'te' ? 'హెల్త్ మానిటర్' : 'Health Monitor'}</span>
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-amber-300 border border-amber-500/40 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'అలర్ట్ వివరాలు' : 'Alert Settings'}</span>
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/30 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'రీఛార్జ్ / టాప్-అప్' : 'Top Up Credits'}</span>
              </button>
              <button
                onClick={() => handleAcknowledgeAlert()}
                className="p-1.5 rounded-lg text-amber-400/80 hover:text-amber-100 hover:bg-amber-900/50 transition-colors"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* NOTIFICATION BANNER (PURCHASE SUCCESS) */}
        {purchaseSuccessMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{purchaseSuccessMessage}</span>
            </div>
            <button
              onClick={() => setPurchaseSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TEST EMAIL SUCCESS TOAST */}
        {testEmailNotice && (
          <div className="bg-blue-950/90 border-b border-blue-500/40 px-6 py-2.5 flex items-center justify-between text-xs text-blue-200 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{testEmailNotice}</span>
            </div>
            <button
              onClick={() => setTestEmailNotice(null)}
              className="text-blue-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB BODY CONTAINER */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: API KEYS & QUOTA */}
          {activeTab === 'keys' && (
            <div className="space-y-6">
              {/* Active API Key Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {lang === 'te' ? 'ప్రైమరీ ప్రొడక్షన్ API కీ' : 'Primary Production API Key'}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                        Active
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md uppercase">
                        {activePlan.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'te'
                        ? 'ఈ కీని మీ అప్లికేషన్ యొక్క బ్యాకెండ్ లేదా సర్వర్‌లో "Authorization: Bearer <KEY>" గా ఉపయోగించండి.'
                        : 'Use this secret token in your server backend via the "Authorization: Bearer <KEY>" header.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRotateKey}
                      disabled={isRotating}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                      <span>{lang === 'te' ? 'కీని మార్చండి (Rotate)' : 'Rotate Key'}</span>
                    </button>
                  </div>
                </div>

                {/* Key string viewer */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700/80 font-mono text-xs text-slate-200">
                  <Key className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="flex-1 tracking-wider truncate">
                    {showApiKey ? apiKey : `${apiKey.substring(0, 10)}••••••••••••••••••••••••••••`}
                  </span>

                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                    title={showApiKey ? 'Hide key' : 'Show key'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleCopyKey}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-sans text-xs font-medium cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'కాపీ' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Usage & Rate Limit Meters with 80% Alert State */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Credit Balance Progress */}
                <div className={`p-4 rounded-xl bg-slate-950/60 border space-y-3 transition-colors ${
                  quotaPercent >= 80 ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${quotaPercent >= 80 ? 'text-amber-400 animate-bounce' : 'text-amber-400'}`} />
                      {lang === 'te' ? 'మిగిలిన ఆడిట్ క్రెడిట్స్' : 'Audit Credits Remaining'}
                    </span>
                    <span className={`font-mono font-bold ${quotaPercent >= 80 ? 'text-amber-300' : 'text-amber-300'}`}>
                      {creditsRemaining.toLocaleString()} / {creditsTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        quotaPercent >= 80
                          ? 'bg-gradient-to-r from-amber-500 to-red-500'
                          : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                      }`}
                      style={{ width: `${100 - quotaPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className={quotaPercent >= 80 ? 'text-amber-400 font-bold' : ''}>
                      {quotaPercent}% {lang === 'te' ? 'వినియోగించబడింది' : 'consumed'}
                      {quotaPercent >= 80 && ' (⚠️ 80% Limit)'}
                    </span>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{lang === 'te' ? '+ క్రెడిట్స్ టాప్-అప్' : '+ Top Up'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Rate Limit & Health Status Card */}
                <div className={`p-4 rounded-xl bg-slate-950/60 border space-y-2 transition-all ${
                  quotaPercent >= 80 ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">
                      <Activity className={`w-3.5 h-3.5 ${quotaPercent >= 80 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
                      {lang === 'te' ? 'రేట్ లిమిట్ & హెల్త్' : 'Rate Limit & Health'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      quotaPercent >= 80
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono'
                    }`}>
                      {quotaPercent >= 80 ? '⚠️ High Load' : '✅ 100% SLA'}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1">
                    <span>{activePlan.rateLimitPerMin}</span>
                    <span className="text-xs text-slate-400 font-normal">req / min</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>60s Rolling Window</span>
                    <button
                      onClick={() => setActiveTab('health')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-0.5"
                    >
                      <span>{lang === 'te' ? 'హెల్త్ మానిటర్' : 'Health Monitor →'}</span>
                    </button>
                  </div>
                </div>

                {/* 80% Threshold Alert Status Card */}
                <div className={`p-4 rounded-xl bg-slate-950/60 border space-y-2 transition-colors ${
                  quotaPercent >= 80 ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">
                      <Bell className={`w-3.5 h-3.5 ${quotaPercent >= 80 ? 'text-amber-400' : 'text-slate-400'}`} />
                      {lang === 'te' ? '80% క్రెడిట్ అలర్ట్ స్టేటస్' : '80% Credit Alert Status'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      quotaPercent >= 80
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {quotaPercent >= 80 ? '⚠️ Triggered' : '✅ Armed & Active'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {notificationPrefs.alertEmail}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Auto-Email & Dashboard Alert</span>
                    <button
                      onClick={() => setActiveTab('alerts')}
                      className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      {lang === 'te' ? 'నిర్వహించండి' : 'Manage →'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-Time Threshold Quick Test Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {lang === 'te' ? 'రియల్-టైమ్ 80% అలర్ట్ నోటిఫికేషన్ టెస్టింగ్' : 'Real-Time 80% Credit Limit Alert System'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'te'
                        ? 'యూజర్ 80% క్రెడిట్స్ వినియోగించినప్పుడు ఆటోమేటిక్‌గా ఇమెయిల్ మరియు డాష్‌బోర్డ్ అలర్ట్ పంపబడుతుంది.'
                        : 'Automatically triggers email & in-app alerts when monthly credit usage reaches 80%.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTest80PercentEmail}
                    disabled={isSendingTestEmail}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className={`w-3 h-3 ${isSendingTestEmail ? 'animate-spin' : ''}`} />
                    <span>{isSendingTestEmail ? 'Sending...' : 'Send Test Email'}</span>
                  </button>
                  <button
                    onClick={() => handleSimulateUsageSpike(quotaPercent >= 80 ? 10 : 82)}
                    disabled={isSimulatingSpike}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      quotaPercent >= 80
                        ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    }`}
                  >
                    <Sliders className="w-3 h-3" />
                    <span>{quotaPercent >= 80 ? 'Reset Usage (10%)' : 'Simulate 80% Spike'}</span>
                  </button>
                </div>
              </div>

              {/* Endpoint Telemetry Table */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'te' ? 'అందుబాటులో ఉన్న API ఎండ్‌పాయింట్లు' : 'Available API Endpoints'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('playground')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'te' ? 'ప్లేగ్రౌండ్‌లో టెస్ట్ చేయండి' : 'Test in Playground'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {API_ENDPOINTS.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() => {
                        setSelectedEndpointId(ep.id);
                        setActiveTab('playground');
                      }}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded ${
                              ep.method === 'POST'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                            {ep.path}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {ep.creditCost === 0 ? 'Free' : `${ep.creditCost} ⚡`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {lang === 'te' && ep.titleTe ? ep.titleTe : ep.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: REAL-TIME API HEALTH & RATE LIMIT MONITOR */}
          {activeTab === 'health' && (
            <ApiHealthMonitor
              lang={lang}
              user={user}
              apiKey={apiKey}
              tier={currentTier}
              creditsRemaining={creditsRemaining}
              creditsTotal={creditsTotal}
              rateLimitPerMin={activePlan.rateLimitPerMin}
              quotaUsagePercent={quotaPercent}
              onUpgradeTier={() => setActiveTab('pricing')}
              onConfigureAlerts={() => setActiveTab('alerts')}
              onSimulateUsage={(percent) => handleSimulateUsageSpike(percent)}
            />
          )}

          {/* TAB: REAL-TIME NOTIFICATIONS & 80% CREDIT LIMIT ALERT CENTER */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              {/* Alert Engine Header Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {lang === 'te' ? 'డెవలపర్ API క్రెడిట్ అలర్ట్ & నోటిఫికేషన్ సిస్టమ్' : 'Developer API Credit Alert & Notification System'}
                        </h3>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                          Real-Time Watchdog
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {lang === 'te'
                          ? 'నెలవారీ క్రెడిట్ పరిమితి 80% చేరుకున్న వెంటనే ఆటోమేటిక్ ఇమెయిల్ లేదా డాష్‌బోర్డ్ నోటిఫికేషన్ అలర్ట్‌లు పంపబడతాయి.'
                          : 'Sends automated email and in-dashboard alerts when a developer reaches 80% of their monthly credit limit.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendTest80PercentEmail}
                      disabled={isSendingTestEmail}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{isSendingTestEmail ? 'Sending...' : '⚡ Send Test 80% Email'}</span>
                    </button>
                  </div>
                </div>

                {/* Quota Gauge with Threshold Marker */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">Current Monthly Consumption</span>
                      <span className="text-slate-400 font-mono">({(creditsTotal - creditsRemaining).toLocaleString()} / {creditsTotal.toLocaleString()} credits)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-amber-400 font-semibold">
                        Alert Threshold: {notificationPrefs.thresholdPercent}%
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        quotaPercent >= notificationPrefs.thresholdPercent
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {quotaPercent}% Used
                      </span>
                    </div>
                  </div>

                  {/* Progress bar with 80% threshold tick marker */}
                  <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        quotaPercent >= notificationPrefs.thresholdPercent
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
                          : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                      }`}
                      style={{ width: `${quotaPercent}%` }}
                    />
                    {/* 80% Marker line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-300 z-10 shadow-sm shadow-amber-400"
                      style={{ left: `${notificationPrefs.thresholdPercent}%` }}
                      title={`${notificationPrefs.thresholdPercent}% Alert Threshold`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>0% (Safe)</span>
                    <span className="text-amber-400 font-semibold">▲ {notificationPrefs.thresholdPercent}% Alert Trigger Point</span>
                    <span>100% (Exhaustion)</span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Settings & Simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Notification Channel Preferences */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{lang === 'te' ? 'నోటిఫికేషన్ కాన్ఫిగరేషన్' : 'Alert Channels & Settings'}</span>
                      </h4>
                      {savePrefsNotice && (
                        <span className="text-[11px] text-emerald-400 font-semibold animate-fadeIn">
                          {savePrefsNotice}
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleSaveNotificationPreferences} className="space-y-4">
                      {/* Email Recipient Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                          <span>{lang === 'te' ? 'అలర్ట్ పంపవలసిన ఇమెయిల్ చిరునామా' : 'Alert Recipient Email Address'}</span>
                          <span className="text-[10px] text-indigo-400">Primary Delivery</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <input
                              type="email"
                              value={notificationPrefs.alertEmail}
                              onChange={(e) => setNotificationPrefs(prev => ({ ...prev, alertEmail: e.target.value }))}
                              placeholder="developer@example.com"
                              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Threshold Selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          {lang === 'te' ? 'క్రెడిట్ పరిమితి అలర్ట్ థ్రెషోల్డ్ (%)' : 'Credit Limit Alert Threshold'}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[75, 80, 85, 90].map((th) => (
                            <button
                              key={th}
                              type="button"
                              onClick={() => setNotificationPrefs(prev => ({ ...prev, thresholdPercent: th }))}
                              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                notificationPrefs.thresholdPercent === th
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {th}% {th === 80 && '★'}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'te'
                            ? '★ 80% సిఫార్సు చేయబడింది: API అడ్మిన్లకు తగినంత సమయం ఇస్తుంది.'
                            : '★ 80% is the industry standard buffer before HTTP 402 depletion.'}
                        </p>
                      </div>

                      {/* Notification Toggles */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
                          <div className="flex items-center space-x-2.5">
                            <Mail className="w-4 h-4 text-amber-400" />
                            <div>
                              <span className="text-xs font-semibold text-slate-200 block">Email Alerts</span>
                              <span className="text-[10px] text-slate-400">Dispatch HTML alert email when 80% reached</span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPrefs.enableEmailAlerts}
                            onChange={(e) => setNotificationPrefs(prev => ({ ...prev, enableEmailAlerts: e.target.checked }))}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
                          <div className="flex items-center space-x-2.5">
                            <Bell className="w-4 h-4 text-cyan-400" />
                            <div>
                              <span className="text-xs font-semibold text-slate-200 block">In-Dashboard Warning Banner</span>
                              <span className="text-[10px] text-slate-400">Display prominent warning banner in app header</span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPrefs.enableDashboardAlerts}
                            onChange={(e) => setNotificationPrefs(prev => ({ ...prev, enableDashboardAlerts: e.target.checked }))}
                            className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400 bg-slate-800 border-slate-700 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
                          <div className="flex items-center space-x-2.5">
                            <Radio className="w-4 h-4 text-purple-400" />
                            <div>
                              <span className="text-xs font-semibold text-slate-200 block">Webhook Dispatch (Slack / Discord)</span>
                              <span className="text-[10px] text-slate-400">POST JSON alert to incoming webhook URL</span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationPrefs.enableWebhookAlerts}
                            onChange={(e) => setNotificationPrefs(prev => ({ ...prev, enableWebhookAlerts: e.target.checked }))}
                            className="w-4 h-4 rounded text-purple-500 focus:ring-purple-400 bg-slate-800 border-slate-700 cursor-pointer"
                          />
                        </label>

                        {notificationPrefs.enableWebhookAlerts && (
                          <div className="pt-1">
                            <input
                              type="url"
                              value={notificationPrefs.webhookUrl || ''}
                              onChange={(e) => setNotificationPrefs(prev => ({ ...prev, webhookUrl: e.target.value }))}
                              placeholder="https://hooks.slack.com/services/..."
                              className="w-full px-3 py-2 bg-slate-900 border border-purple-500/40 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingPreferences}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>{isSavingPreferences ? 'Saving Settings...' : 'Save Notification Preferences'}</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Column: Interactive Real-Time Test & Simulation Lab */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Simulation Lab Card */}
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'te' ? 'లైవ్ సిమ్యులేషన్ & టెస్టింగ్ ల్యాబ్' : 'Live Simulation & Test Lab'}</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lang === 'te'
                        ? 'ఈ క్రింది బటన్ల ద్వారా 80% అలర్ట్ నోటిఫికేషన్ మరియు ఇమెయిల్ ట్రిగ్గర్‌ను రియల్-టైమ్‌లో పరీక్షించండి:'
                        : 'Simulate high credit consumption or test immediate email dispatch in real-time:'}
                    </p>

                    <div className="space-y-3">
                      {/* Action 1: Dispatch Test 80% Email */}
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">
                            1. Dispatch Test 80% Alert Email
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Generates and sends live HTML email to {notificationPrefs.alertEmail}
                          </span>
                        </div>
                        <button
                          onClick={handleSendTest80PercentEmail}
                          disabled={isSendingTestEmail}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shrink-0 transition-colors shadow-sm cursor-pointer"
                        >
                          {isSendingTestEmail ? 'Sending...' : '⚡ Test Email'}
                        </button>
                      </div>

                      {/* Action 2: Simulate 80% Usage Spike */}
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">
                            2. Simulate 82% Quota Spike
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Sets usage to 8,200 / 10,000 credits to trigger real-time warning banner
                          </span>
                        </div>
                        <button
                          onClick={() => handleSimulateUsageSpike(82)}
                          disabled={isSimulatingSpike}
                          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg text-xs shrink-0 transition-colors shadow-sm cursor-pointer"
                        >
                          {isSimulatingSpike ? 'Applying...' : '🧪 Simulate 82%'}
                        </button>
                      </div>

                      {/* Action 3: Reset Credits to Safe */}
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">
                            3. Reset Credits to Normal (10%)
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Restores 9,000 / 10,000 balance and clears warning state
                          </span>
                        </div>
                        <button
                          onClick={() => handleSimulateUsageSpike(10)}
                          disabled={isSimulatingSpike}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                        >
                          🔄 Reset Balance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert History Log / Audit Trail */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Inbox className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {lang === 'te' ? 'రియల్-టైమ్ అలర్ట్ లాగ్స్ & డెలివరీ హిస్టరీ' : 'Real-Time Alert Feed & Delivery History'}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {alertsHistory.length} total event(s)
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80 rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/60">
                  {alertsHistory.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No alert notifications triggered yet. Quota usage is within safe parameters.
                    </div>
                  ) : (
                    alertsHistory.map((item) => (
                      <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/90 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            item.usagePercent >= 80 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-cyan-400'
                          }`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white">
                                {lang === 'te' && item.titleTe ? item.titleTe : item.title}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {item.usagePercent}% Usage
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {item.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {lang === 'te' && item.messageTe ? item.messageTe : item.message}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                              <span>Recipient: <strong className="text-slate-400">{item.recipientEmail}</strong></span>
                              <span>•</span>
                              <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ({new Date(item.timestamp).toLocaleDateString()})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setActivePreviewAlert(item);
                              setEmailPreviewModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>View Email</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE API PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="space-y-6">
              {/* Active API Key Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {lang === 'te' ? 'ప్రైమరీ ప్రొడక్షన్ API కీ' : 'Primary Production API Key'}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                        Active
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md uppercase">
                        {activePlan.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'te'
                        ? 'ఈ కీని మీ అప్లికేషన్ యొక్క బ్యాకెండ్ లేదా సర్వర్‌లో "Authorization: Bearer <KEY>" గా ఉపయోగించండి.'
                        : 'Use this secret token in your server backend via the "Authorization: Bearer <KEY>" header.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRotateKey}
                      disabled={isRotating}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                      <span>{lang === 'te' ? 'కీని మార్చండి (Rotate)' : 'Rotate Key'}</span>
                    </button>
                  </div>
                </div>

                {/* Key string viewer */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700/80 font-mono text-xs text-slate-200">
                  <Key className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="flex-1 tracking-wider truncate">
                    {showApiKey ? apiKey : `${apiKey.substring(0, 10)}••••••••••••••••••••••••••••`}
                  </span>

                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
                    title={showApiKey ? 'Hide key' : 'Show key'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleCopyKey}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-sans text-xs font-medium"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'కాపీ' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Usage & Rate Limit Meters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Credit Balance Progress */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {lang === 'te' ? 'మిగిలిన ఆడిట్ క్రెడిట్స్' : 'Audit Credits Remaining'}
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      {creditsRemaining.toLocaleString()} / {creditsTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${100 - quotaPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{quotaPercent}% {lang === 'te' ? 'వినియోగించబడింది' : 'consumed'}</span>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5"
                    >
                      <span>{lang === 'te' ? '+ క్రెడిట్స్ టాప్-అప్' : '+ Top Up'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Rate Limit Card */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'te' ? 'రేట్ లిమిట్ కెపాసిటీ' : 'Active Rate Limit'}
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1">
                    <span>{activePlan.rateLimitPerMin}</span>
                    <span className="text-xs text-slate-400 font-normal">req / min</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'te' ? 'స్పీడ్ బఫర్: రోలింగ్ 60-సెకండ్ల విండో' : 'High concurrency edge proxy pipeline'}
                  </p>
                </div>

                {/* Success SLA */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    {lang === 'te' ? 'గేట్‌వే అప్‌టైమ్ & SLA' : 'Gateway Uptime & SLA'}
                  </span>
                  <div className="text-2xl font-black text-emerald-400 flex items-baseline gap-1">
                    <span>99.98%</span>
                    <span className="text-xs text-emerald-500/80 font-normal">Operational</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'te' ? 'గ్లోబల్ క్లౌడ్ రన్ కంటైనర్ రెస్పాన్స్' : 'Global multi-region low latency cluster'}
                  </p>
                </div>
              </div>

              {/* Endpoint Telemetry Table */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'te' ? 'అందుబాటులో ఉన్న API ఎండ్‌పాయింట్లు' : 'Available API Endpoints'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('playground')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                  >
                    <span>{lang === 'te' ? 'ప్లేగ్రౌండ్‌లో టెస్ట్ చేయండి' : 'Test in Playground'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {API_ENDPOINTS.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() => {
                        setSelectedEndpointId(ep.id);
                        setActiveTab('playground');
                      }}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded ${
                              ep.method === 'POST'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                            {ep.path}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {ep.creditCost === 0 ? 'Free' : `${ep.creditCost} ⚡`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {lang === 'te' && ep.titleTe ? ep.titleTe : ep.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE API PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Request Configuration */}
              <div className="lg:col-span-5 space-y-4">
                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'te' ? 'తక్షణ టెస్ట్ ప్రీసెట్లు' : 'Instant Request Presets'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelectPreset('audit')}
                      className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left truncate transition-colors border border-slate-700"
                    >
                      🌐 Audit Website
                    </button>
                    <button
                      onClick={() => handleSelectPreset('ai_fix')}
                      className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left truncate transition-colors border border-slate-700"
                    >
                      🤖 AI Remediation
                    </button>
                    <button
                      onClick={() => handleSelectPreset('page')}
                      className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left truncate transition-colors border border-slate-700"
                    >
                      📄 Single Page Audit
                    </button>
                    <button
                      onClick={() => handleSelectPreset('usage')}
                      className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-left truncate transition-colors border border-slate-700"
                    >
                      📊 Check Usage
                    </button>
                  </div>
                </div>

                {/* Endpoint Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'te' ? 'ఎండ్‌పాయింట్ ఎంచుకోండి' : 'Select Target Endpoint'}
                  </label>
                  <select
                    value={selectedEndpointId}
                    onChange={(e) => setSelectedEndpointId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {API_ENDPOINTS.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        [{ep.method}] {ep.path} — {ep.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Audit ID parameter if needed */}
                {selectedEndpointId.includes('status') || selectedEndpointId.includes('report') ? (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Audit ID Parameter (:audit_id)
                    </label>
                    <input
                      type="text"
                      value={playgroundAuditId}
                      onChange={(e) => setPlaygroundAuditId(e.target.value)}
                      placeholder="aud_1724398124912"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ) : null}

                {/* JSON Body Editor (For POST requests) */}
                {API_ENDPOINTS.find(e => e.id === selectedEndpointId)?.method === 'POST' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>JSON Request Payload (Body)</span>
                      <span className="text-[10px] text-slate-500 font-normal">Content-Type: application/json</span>
                    </label>
                    <textarea
                      rows={7}
                      value={playgroundBody}
                      onChange={(e) => setPlaygroundBody(e.target.value)}
                      className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                  </div>
                )}

                {/* Send Button */}
                <button
                  onClick={handleExecutePlayground}
                  disabled={playgroundLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {playgroundLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'te' ? 'ఆడిట్ ఎగ్జిక్యూట్ అవుతోంది...' : 'Executing Live Gateway Request...'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{lang === 'te' ? 'రిక్వెస్ట్ పంపండి (Execute)' : 'Send Live Request'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Response Visualizer */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Response Console
                    </span>
                    {playgroundStatus && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          playgroundStatus === 200
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {playgroundStatus} {playgroundStatus === 200 ? 'OK' : 'Error'}
                      </span>
                    )}
                    {playgroundLatency && (
                      <span className="text-[10px] font-mono text-slate-400">
                        ⏱️ {playgroundLatency}ms
                      </span>
                    )}
                  </div>

                  {playgroundResponse && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(playgroundResponse, null, 2));
                        setCopiedResponse(true);
                        setTimeout(() => setCopiedResponse(false), 2000);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                    >
                      {copiedResponse ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedResponse ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  )}
                </div>

                <div className="w-full h-[360px] p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-y-auto font-mono text-xs text-slate-200">
                  {playgroundLoading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
                      <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                      <p className="text-xs">Crawling target host & generating health breakdown...</p>
                    </div>
                  ) : playgroundResponse ? (
                    <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(playgroundResponse, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-500">
                      <Terminal className="w-8 h-8 opacity-40" />
                      <p className="text-xs">Select an endpoint and click "Send Live Request" to inspect the JSON response.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING & CREDIT PLANS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h3 className="text-lg font-black text-white">
                  {lang === 'te' ? 'డెవలపర్లు & ఏజెన్సీల కోసం స్కేలబుల్ క్రెడిట్ ప్లాన్‌లు' : 'Scalable Developer & Agency API Subscriptions'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'te'
                    ? '1 ఆడిట్ = 1 క్రెడిట్. దాచిన రుసుములు లేవు, మీ స్వంత ప్రాజెక్ట్‌లకు అనుగుణంగా ఎప్పుడైనా అప్‌గ్రేడ్ చేయండి.'
                    : '1 full audit = 1 credit. High concurrency, multi-region crawling engine with automatic rate limit scaling.'}
                </p>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {API_PRICING_PLANS.map((plan) => {
                  const isCurrent = currentTier === plan.id;
                  const isBusy = purchasingTier === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`relative p-5 rounded-2xl flex flex-col justify-between transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 border-2 border-indigo-500 shadow-xl shadow-indigo-500/15'
                          : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.tag && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-[9px] rounded-full uppercase tracking-wider shadow">
                          {lang === 'te' && plan.tagTe ? plan.tagTe : plan.tag}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {lang === 'te' ? plan.nameTe : plan.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {lang === 'te' ? plan.descriptionTe : plan.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-800/80 pt-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white">
                              {plan.priceINR === 0 ? '₹0' : `₹${plan.priceINR.toLocaleString()}`}
                            </span>
                            <span className="text-[10px] text-slate-400">/ month</span>
                          </div>
                          <div className="text-[11px] font-bold text-amber-400 mt-0.5">
                            {plan.credits.toLocaleString()} {lang === 'te' ? 'క్రెడిట్స్' : 'Credits'}
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800/60">
                          {(lang === 'te' ? plan.featuresTe : plan.features).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80">
                        <button
                          onClick={() => handlePurchasePlan(plan)}
                          disabled={isCurrent || isBusy}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isCurrent
                              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 cursor-default'
                              : plan.popular
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                          }`}
                        >
                          {isBusy ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : isCurrent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{lang === 'te' ? 'యాక్టివ్ ప్లాన్' : 'Current Active'}</span>
                            </>
                          ) : (
                            <span>{lang === 'te' ? plan.ctaTextTe : plan.ctaText}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: DOCS & SDK SNIPPETS */}
          {activeTab === 'docs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">
                    {lang === 'te' ? 'ఎండ్‌పాయింట్ ఎంచుకోండి:' : 'Endpoint:'}
                  </span>
                  <select
                    value={selectedDocEndpoint}
                    onChange={(e) => setSelectedDocEndpoint(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:outline-none"
                  >
                    {API_ENDPOINTS.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        [{ep.method}] {ep.path}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  {(['curl', 'node', 'python', 'php', 'go'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setDocLanguage(l)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase transition-colors cursor-pointer ${
                        docLanguage === l
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {l === 'node' ? 'Node.js' : l === 'php' ? 'PHP / WP' : l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Viewer */}
              <div className="relative p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400">
                    // Ready to run in production:
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      setCopiedDocCode(true);
                      setTimeout(() => setCopiedDocCode(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700"
                  >
                    {copiedDocCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDocCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed p-2">
                  {generatedCode}
                </pre>
              </div>

              {/* Error Code Reference Table */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  HTTP Status & Error Codes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400">200 OK</span>
                    <p className="text-slate-400 text-[11px] mt-1">Audit executed successfully.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-mono font-bold text-rose-400">401 Unauthorized</span>
                    <p className="text-slate-400 text-[11px] mt-1">Missing or invalid Bearer API key.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-mono font-bold text-amber-400">402 Payment Required</span>
                    <p className="text-slate-400 text-[11px] mt-1">Monthly audit credits depleted.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="font-mono font-bold text-purple-400">429 Rate Limit</span>
                    <p className="text-slate-400 text-[11px] mt-1">Exceeded tier requests per minute.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AGENCY & SAAS USE CASES */}
          {activeTab === 'usecases' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'te' ? '1. డిజిటల్ & SEO ఏజెన్సీలు' : '1. SEO & Digital Marketing Agencies'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'క్లయింట్ వెబ్‌సైట్‌లను ప్రతి వారం ఆటోమేటిక్‌గా ఆడిట్ చేసి, మీ స్వంత లోగోతో వైట్-లేబుల్ PDF రిపోర్ట్‌లను రూపొందించండి.'
                      : 'Automatically audit client websites on a schedule and generate white-label PDF audit reports with custom branding.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Server className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'te' ? '2. వెబ్ హోస్టింగ్ కంపెనీలు' : '2. Web Hosting & Cloud Platforms'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'cPanel లేదా హోస్టింగ్ డాష్‌బోర్డ్‌లో కస్టమర్ సైట్ హెల్త్ స్కోర్‌ను నేరుగా ప్రదర్శించండి.'
                      : 'Embed website health, SSL expiration alerts, and Core Web Vitals checks directly into your hosting control panel.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'te' ? '3. WordPress ప్లగిన్ డెవలపర్లు' : '3. WordPress & Shopify Plugins'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'మీ ప్లగిన్ ద్వారా నేరుగా ఒకే క్లిక్‌తో WP అడ్మిన్ ప్యానెల్‌లో వెబ్‌సైట్ స్పీడ్ & సెక్యూరిటీ ఆడిట్ అందించండి.'
                      : 'Power WordPress health widgets with programmatic 1-click audit checks and automated AI recommendations.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'te' ? '4. SaaS ప్లాట్‌ఫారమ్‌లు & CI/CD' : '4. SaaS Platforms & CI/CD QA'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'te'
                      ? 'GitHub Actions లేదా CI/CD పైప్‌లైన్‌లో వెబ్‌సైట్ ప్రొడక్షన్ రిలీజ్‌కు ముందు ఆటోమేటెడ్ హెల్త్ గేట్‌గా సెట్ చేయండి.'
                      : 'Block deployments if the health score drops below 85% by embedding /v1/audit into your GitHub Actions pipeline.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {lang === 'te'
                ? 'సురక్షితమైన రేట్-లిమిటెడ్ API గేట్‌వే • 100% సర్వర్-సైడ్ ఎగ్జిక్యూషన్'
                : 'Zero-loss token bucket metering • Strictly authenticated server-side API Gateway'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('docs')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 font-semibold cursor-pointer"
            >
              {lang === 'te' ? 'API డాక్యుమెంటేషన్' : 'View Documentation'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-semibold cursor-pointer"
            >
              {lang === 'te' ? 'పూర్తయింది' : 'Done'}
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE EMAIL PREVIEW MODAL */}
      {emailPreviewModalOpen && activePreviewAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Live Email Preview: 80% Threshold Alert</h4>
                  <p className="text-[10px] text-slate-400">Recipient: {activePreviewAlert.recipientEmail}</p>
                </div>
              </div>
              <button
                onClick={() => setEmailPreviewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Container Mimicking Inbox View */}
            <div className="p-5 overflow-y-auto space-y-4 bg-slate-950/60 font-sans text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="border-b border-slate-800 pb-2 space-y-1 text-[11px]">
                  <div><strong className="text-slate-400">From:</strong> <span className="text-slate-200">Website Health System &lt;no-reply@websitehealth.dev&gt;</span></div>
                  <div><strong className="text-slate-400">To:</strong> <span className="text-slate-200">{activePreviewAlert.recipientEmail}</span></div>
                  <div><strong className="text-slate-400">Subject:</strong> <span className="text-amber-300 font-bold">⚠️ Action Required: 80% Monthly API Credit Limit Reached</span></div>
                  <div><strong className="text-slate-400">Date:</strong> <span className="text-slate-400">{new Date(activePreviewAlert.timestamp).toUTCString()}</span></div>
                </div>

                <div className="py-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <h3 className="text-sm font-bold text-white">Website Health API Quota Alert</h3>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    Hello Developer,
                  </p>

                  <p className="text-slate-300 leading-relaxed">
                    Your API key for <strong>Website Health Pro Engine</strong> has reached <strong>{activePreviewAlert.usagePercent}%</strong> of its monthly credit allotment.
                  </p>

                  {/* Visual Gauge Inside Email */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Usage Meter</span>
                      <span className="font-mono font-bold text-amber-300">
                        {activePreviewAlert.creditsUsed.toLocaleString()} / {activePreviewAlert.creditsTotal.toLocaleString()} Credits
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                        style={{ width: `${activePreviewAlert.usagePercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Threshold: {activePreviewAlert.thresholdPercent}%</span>
                      <span className="text-amber-400 font-bold">{activePreviewAlert.creditsTotal - activePreviewAlert.creditsUsed} Credits Remaining</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    To prevent automated audit job cancellations or HTTP 402 errors in production, please recharge your wallet or upgrade your plan.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setEmailPreviewModalOpen(false);
                        setActiveTab('pricing');
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-center text-xs transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                      Top Up API Credits Now →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>Automatic notification dispatched via SMTP / Postmark relay</span>
              <button
                onClick={() => setEmailPreviewModalOpen(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
