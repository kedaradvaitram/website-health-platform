import React, { useState } from 'react';
import {
  X,
  Bell,
  Clock,
  Mail,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Activity,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Language, MonitoringConfig, MonitoringAlertRecord } from '../types';
import { translations } from '../data/translations';

interface WebsiteMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  targetUrl?: string;
  initialConfig?: MonitoringConfig;
}

export const WebsiteMonitoringModal: React.FC<WebsiteMonitoringModalProps> = ({
  isOpen,
  onClose,
  lang,
  targetUrl = 'https://mywebsite.com',
  initialConfig,
}) => {
  const t = translations[lang];
  const [email, setEmail] = useState(initialConfig?.email || 'admin@example.com');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(initialConfig?.frequency || 'weekly');
  const [threshold, setThreshold] = useState<number>(initialConfig?.alertThreshold || 80);
  const [sslExpiryAlert, setSslExpiryAlert] = useState(initialConfig?.alertOnSslExpiry ?? true);
  const [speedDropAlert, setSpeedDropAlert] = useState(initialConfig?.alertOnSpeedDrop ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/monitoring/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: targetUrl,
          email,
          frequency,
          alertThreshold: threshold,
          alertOnSslExpiry: sslExpiryAlert,
          alertOnSpeedDrop: speedDropAlert,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to schedule monitoring:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestAlert = async () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div
      id="website-monitoring-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="website-monitoring-modal-content"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {lang === 'te' ? 'ఆటోమేటిక్ హెల్త్ మానిటరింగ్ & అలర్ట్స్' : 'Automated Website Monitoring'}
                </h2>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  24/7 Shield
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'స్కోరు తగ్గినా, SSL గడువు ముగిసినా తక్షణ ఈమెయిల్ అలర్ట్స్'
                  : 'Automated recurring health audits, threshold drop alerts, and SSL expiration warnings'}
              </p>
            </div>
          </div>
          <button
            id="close-monitoring-btn"
            onClick={onClose}
            aria-label="Close Monitoring"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {lang === 'te'
                  ? `స్వయంచాలక ${frequency} మానిటరింగ్ విజయవంతంగా యాక్టివేట్ చేయబడింది! అలర్ట్స్ ${email} కు పంపబడతాయి.`
                  : `Automated ${frequency} monitoring activated for ${targetUrl}! Alerts will dispatch to ${email}.`}
              </span>
            </div>
          )}

          {/* Email Recipient */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              {lang === 'te' ? 'అలర్ట్ నోటిఫికేషన్ ఈమెయిల్' : 'Alert Recipient Email'}
            </label>
            <input
              id="monitoring-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alerts@yourdomain.com"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Scan Frequency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {lang === 'te' ? 'స్కాన్ ఫ్రీక్వెన్సీ (తరచుదనం)' : 'Scan Frequency'}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['daily', 'weekly', 'monthly'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  id={`frequency-${f}-btn`}
                  onClick={() => setFrequency(f)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                    frequency === f
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {f === 'daily'
                    ? lang === 'te'
                      ? 'రోజువారీ (Daily)'
                      : 'Daily'
                    : f === 'weekly'
                    ? lang === 'te'
                      ? 'ప్రతి వారం (Weekly)'
                      : 'Weekly'
                    : lang === 'te'
                    ? 'నెలవారీ (Monthly)'
                    : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Threshold Slider */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                {lang === 'te' ? 'హెచ్చరిక స్కోరు పరిమితి' : 'Score Drop Alert Threshold'}
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Below {threshold}/100
              </span>
            </div>
            <input
              id="monitoring-threshold-slider"
              type="range"
              min="50"
              max="95"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              {lang === 'te'
                ? `వెబ్‌సైట్ మొత్తం స్కోరు ${threshold} కంటే తక్కువకు పడిపోయిన వెంటనే తక్షణ ఈమెయిల్ అలర్ట్ పంపబడుతుంది.`
                : `Trigger instant notification if overall health score drops below ${threshold}/100 during scheduled scan.`}
            </p>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl cursor-pointer hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    {lang === 'te' ? 'SSL సర్టిఫికేట్ గడువు అలర్ట్' : 'SSL Certificate Expiration Warning'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {lang === 'te' ? 'గడువుకు 14 రోజుల ముందు ఈమెయిల్ రిమైండర్' : 'Alert 14 days before certificate expiry'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sslExpiryAlert}
                onChange={(e) => setSslExpiryAlert(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl cursor-pointer hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    {lang === 'te' ? 'సర్వర్ వేగం ఆలస్య అలర్ట్ (TTFB Spike)' : 'Server Latency (TTFB) Spike Alert'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {lang === 'te' ? 'రెస్పాన్స్ సమయం 400ms కంటే పెరిగితే సమాచారం' : 'Alert if origin response latency exceeds 400ms'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={speedDropAlert}
                onChange={(e) => setSpeedDropAlert(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Test Alert Button */}
          <div className="pt-2">
            <button
              id="send-test-alert-btn"
              type="button"
              onClick={handleSendTestAlert}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {testSent
                ? lang === 'te'
                  ? 'టెస్ట్ ఈమెయిల్ పంపబడింది!'
                  : 'Test Alert Dispatched to ' + email
                : lang === 'te'
                ? 'టెస్ట్ ఈమెయిల్ అలర్ట్ పంపండి'
                : 'Send Test Alert Email'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            id="cancel-monitoring-btn"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'te' ? 'రద్దు చేయండి' : 'Cancel'}
          </button>
          <button
            id="save-monitoring-schedule-btn"
            onClick={handleSaveSchedule}
            disabled={isSaving}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            {isSaving
              ? lang === 'te'
                ? 'సేవ్ అవుతోంది...'
                : 'Saving...'
              : lang === 'te'
              ? 'మానిటరింగ్ యాక్టివేట్ చేయండి'
              : 'Save & Activate Monitoring'}
          </button>
        </div>
      </div>
    </div>
  );
};
