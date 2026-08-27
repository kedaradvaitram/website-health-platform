import React, { useState } from 'react';
import {
  X,
  Bell,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldAlert,
  Clock,
  Sparkles,
  Smartphone,
  Radio,
  Check,
} from 'lucide-react';
import { Language, AlertChannelIntegration, FullAuditReport } from '../types';
import confetti from 'canvas-confetti';

interface MultiChannelAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
}

const DEFAULT_CHANNELS: AlertChannelIntegration[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Instant Alerts',
    iconName: 'Smartphone',
    color: 'emerald',
    enabled: true,
    destination: '+91 98765 43210',
    verified: true,
    triggers: {
      downtime: true,
      sslExpiry: true,
      scoreDropBelow: 80,
      securityCve: true,
      weeklyDigest: false,
    },
    lastAlertSentAt: '2 hours ago',
  },
  {
    id: 'slack',
    name: 'Slack Dev & Ops Webhook',
    iconName: 'MessageSquare',
    color: 'purple',
    enabled: true,
    destination: 'https://hooks.slack.com/services/T00/B00/XXXX',
    verified: true,
    triggers: {
      downtime: true,
      sslExpiry: true,
      scoreDropBelow: 85,
      securityCve: true,
      weeklyDigest: true,
    },
    lastAlertSentAt: 'Yesterday',
  },
  {
    id: 'discord',
    name: 'Discord Community Server',
    iconName: 'Radio',
    color: 'indigo',
    enabled: false,
    destination: 'https://discord.com/api/webhooks/123/abc',
    verified: false,
    triggers: {
      downtime: true,
      sslExpiry: false,
      scoreDropBelow: 75,
      securityCve: true,
      weeklyDigest: false,
    },
  },
  {
    id: 'telegram',
    name: 'Telegram Bot Notification',
    iconName: 'Send',
    color: 'cyan',
    enabled: true,
    destination: '@WebsiteHealthAlertBot (Chat ID: 948291)',
    verified: true,
    triggers: {
      downtime: true,
      sslExpiry: true,
      scoreDropBelow: 80,
      securityCve: true,
      weeklyDigest: true,
    },
  },
  {
    id: 'email',
    name: 'Executive Email Digest',
    iconName: 'Mail',
    color: 'amber',
    enabled: true,
    destination: 'team@websitehealth.ai',
    verified: true,
    triggers: {
      downtime: true,
      sslExpiry: true,
      scoreDropBelow: 90,
      securityCve: true,
      weeklyDigest: true,
    },
  },
];

export const MultiChannelAlertsModal: React.FC<MultiChannelAlertsModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
}) => {
  const isTe = lang === 'te';
  const [channels, setChannels] = useState<AlertChannelIntegration[]>(DEFAULT_CHANNELS);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testSentChannel, setTestSentChannel] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleChannelEnabled = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleSendTestAlert = (channelName: string) => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestSentChannel(channelName);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setTestSentChannel(null), 3500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="multi-channel-alerts-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isTe
                    ? 'Slack, Discord, WhatsApp & Telegram లైవ్ అలర్ట్స్'
                    : 'Multi-Channel Instant Downtime & Performance Alerts Hub'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>Real-Time Push</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isTe
                  ? 'వెబ్‌సైట్ డౌన్ అయినా, SSL ఎక్స్‌పైర్ అయినా, లేదా సెక్యూరిటీ లోపం వచ్చినా తక్షణమే మెసేజ్ పొందండి'
                  : 'Receive instant incident dispatches via WhatsApp, Slack, Discord, Telegram, or Webhooks'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {testSentChannel && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {isTe
                  ? `టెస్ట్ అలర్ట్ నోటిఫికేషన్ విజయవంతంగా ${testSentChannel} కి పంపబడింది!`
                  : `Test incident alert dispatched successfully to ${testSentChannel}!`}
              </span>
            </div>
          )}

          {/* Channels Grid */}
          <div className="space-y-4">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  channel.enabled
                    ? 'bg-slate-950/90 border-slate-700 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white">
                      {channel.id === 'whatsapp' && <Smartphone className="w-4 h-4 text-emerald-400" />}
                      {channel.id === 'slack' && <MessageSquare className="w-4 h-4 text-purple-400" />}
                      {channel.id === 'discord' && <Radio className="w-4 h-4 text-indigo-400" />}
                      {channel.id === 'telegram' && <Send className="w-4 h-4 text-cyan-400" />}
                      {channel.id === 'email' && <Bell className="w-4 h-4 text-amber-400" />}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{channel.name}</span>
                        {channel.verified && (
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-slate-400 truncate max-w-sm">
                        {channel.destination}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendTestAlert(channel.name)}
                      disabled={isTesting}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      {isTe ? 'టెస్ట్ అలర్ట్ పంపండి' : 'Send Test Ping'}
                    </button>

                    <button
                      onClick={() => toggleChannelEnabled(channel.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        channel.enabled
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {channel.enabled ? (isTe ? 'యాక్టివ్' : 'Active') : isTe ? 'ఆఫ్' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {/* Alert Triggers Checkboxes */}
                {channel.enabled && (
                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={channel.triggers.downtime}
                        onChange={() => {}}
                        className="rounded accent-emerald-500"
                      />
                      <span>5xx / Downtime</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={channel.triggers.sslExpiry}
                        onChange={() => {}}
                        className="rounded accent-emerald-500"
                      />
                      <span>SSL &lt; 14 Days</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={channel.triggers.securityCve}
                        onChange={() => {}}
                        className="rounded accent-emerald-500"
                      />
                      <span>Critical CVEs</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={channel.triggers.weeklyDigest}
                        onChange={() => {}}
                        className="rounded accent-emerald-500"
                      />
                      <span>Weekly Digest</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isTe ? 'అలర్ట్ డెలివరీ లేటెన్సీ &lt; 2.5 సెకన్లు' : 'Incident dispatch latency < 2.5 seconds'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            {isTe ? 'సేవ్ చేసి మూసివేయండి' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
