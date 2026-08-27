import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  FileCheck2,
  Sparkles,
  Globe,
  Plus,
  Trash2,
  Download,
  Mail,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, FullAuditReport } from '../types';
import { translations } from '../data/translations';

interface AgencyWhiteLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
  onOpenPricing?: () => void;
}

interface ClientAccount {
  id: string;
  clientName: string;
  domain: string;
  healthScore: number;
  lastScanned: string;
  frequency: 'Weekly' | 'Monthly' | 'Daily';
  status: 'active' | 'warning';
}

export const AgencyWhiteLabelModal: React.FC<AgencyWhiteLabelModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
  onOpenPricing,
}) => {
  const t = translations[lang];

  // Agency branding state
  const [agencyName, setAgencyName] = useState('Apex Digital Growth Agency');
  const [customDomain, setCustomDomain] = useState('audit.apexdigital.com');
  const [supportEmail, setSupportEmail] = useState('reports@apexdigital.com');
  const [hidePlatformBadge, setHidePlatformBadge] = useState(true);
  const [activeTab, setActiveTab] = useState<'clients' | 'branding' | 'bulk' | 'schedule'>('clients');

  // Client accounts list
  const [clients, setClients] = useState<ClientAccount[]>([
    {
      id: 'c1',
      clientName: 'Acme SaaS Corp',
      domain: 'acmesaas.com',
      healthScore: 92,
      lastScanned: '2 hours ago',
      frequency: 'Weekly',
      status: 'active',
    },
    {
      id: 'c2',
      clientName: 'Nova Health Clinics',
      domain: 'novahealth.org',
      healthScore: 68,
      lastScanned: 'Yesterday',
      frequency: 'Monthly',
      status: 'warning',
    },
    {
      id: 'c3',
      clientName: 'Veloce E-Commerce',
      domain: 'veloceapparel.store',
      healthScore: 84,
      lastScanned: '3 days ago',
      frequency: 'Weekly',
      status: 'active',
    },
  ]);

  const [newClientName, setNewClientName] = useState('');
  const [newClientDomain, setNewClientDomain] = useState('');
  const [bulkUrls, setBulkUrls] = useState('https://client1.com\nhttps://client2.com\nhttps://client3.com');
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  if (!isOpen) return null;

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientDomain.trim()) return;
    const newEntry: ClientAccount = {
      id: `c-${Date.now()}`,
      clientName: newClientName.trim(),
      domain: newClientDomain.trim().replace(/^https?:\/\//, ''),
      healthScore: 85,
      lastScanned: 'Just now',
      frequency: 'Weekly',
      status: 'active',
    };
    setClients([...clients, newEntry]);
    setNewClientName('');
    setNewClientDomain('');
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  const handleSaveBranding = () => {
    setSavedSettings(true);
    confetti({ particleCount: 40, spread: 60 });
    setTimeout(() => setSavedSettings(false), 2500);
  };

  const handleRunBulk = () => {
    setIsBulkRunning(true);
    setTimeout(() => {
      setIsBulkRunning(false);
      confetti({ particleCount: 50, spread: 70 });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        id="agency-white-label-modal"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {lang === 'te' ? 'ఏజెన్సీ & వైట్-లేబుల్ క్లయింట్ పోర్టల్' : 'Agency & White-Label Client Suite'}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Agency Tier
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'te'
                  ? 'కస్టమ్ బ్రాండ్ లోగో, వైట్-లేబుల్ PDF రిపోర్ట్‌లు, క్లయింట్ ఖాతాలు & బల్క్ ఆడిట్ ఆటోమేషన్'
                  : 'Custom branded CNAME portals, white-label client PDF exports, multi-client monitoring & bulk audits'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-agency-modal"
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          {[
            { id: 'clients', label: 'Client Accounts', icon: Users },
            { id: 'branding', label: 'White-Label Branding', icon: Sliders },
            { id: 'bulk', label: 'Bulk Audits', icon: Zap },
            { id: 'schedule', label: 'Scheduled Dispatch', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Clients */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              {/* Add Client Form */}
              <form onSubmit={handleAddClient} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'te' ? 'కొత్త క్లయింట్ ఖాతాను జతచేయండి' : 'Add New Client Workspace'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Client / Company Name"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Website Domain (e.g. client.com)"
                    value={newClientDomain}
                    onChange={(e) => setNewClientDomain(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'te' ? 'ఖాతా సృష్టించు' : 'Add Client'}</span>
                  </button>
                </div>
              </form>

              {/* Clients Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Domain</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Schedule</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {clients.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-400" />
                          <span>{c.clientName}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{c.domain}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono font-bold ${
                              c.healthScore >= 90
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {c.healthScore}/100
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{c.frequency}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteClient(c.id)}
                            className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Branding */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Agency Legal / Display Name</label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Custom CNAME Domain</label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Report Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700 mt-6">
                  <div>
                    <p className="text-xs font-bold text-white">Hide WebsiteHealth AI Watermarks</p>
                    <p className="text-[11px] text-slate-400">Exports will feature ONLY your agency logo and custom branding</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hidePlatformBadge}
                    onChange={(e) => setHidePlatformBadge(e.target.checked)}
                    className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={handleSaveBranding}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savedSettings ? 'Branding Saved!' : 'Save Agency Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Bulk */}
          {activeTab === 'bulk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
                <h4 className="text-sm font-bold text-white mb-1">Queue Multi-Domain Audit (Up to 20 Sites)</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Enter one website URL per line to run simultaneous 360° health audits in the background.
                </p>
                <textarea
                  rows={4}
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleRunBulk}
                    disabled={isBulkRunning}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Zap className={`w-4 h-4 ${isBulkRunning ? 'animate-spin' : ''}`} />
                    <span>{isBulkRunning ? 'Auditing Batch...' : 'Start Bulk Queue'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Schedule */}
          {activeTab === 'schedule' && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
              <h4 className="text-sm font-bold text-white">Automated Client Email Reports</h4>
              <p className="text-xs text-slate-400">
                Deliver branded executive health digests automatically to client inboxes with zero manual effort.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Weekly Summary Digest</span>
                  <span className="text-purple-400 font-mono font-bold">Mondays at 09:00 AM UTC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Critical Drop Alert Threshold</span>
                  <span className="text-red-400 font-mono font-bold">If score drops &gt; 5 points</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
