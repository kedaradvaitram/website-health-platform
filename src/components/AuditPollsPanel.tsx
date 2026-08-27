import React, { useState } from 'react';
import {
  Vote,
  Plus,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  BarChart3,
  Flame,
  Shield,
  Zap,
  Server,
  Layers,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Trophy,
  Share2,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { AuditPoll, AuditPollOption } from './TeamGoogleMeetRoom';

export interface AuditPollPresetTemplate {
  title: string;
  category: 'Security' | 'Performance' | 'Infrastructure' | 'Architecture' | 'General';
  type: 'yes_no' | 'multiple_choice';
  question: string;
  options: string[];
}

export const AUDIT_POLL_TEMPLATES: AuditPollPresetTemplate[] = [
  {
    title: 'Strict CSP & HSTS Deployment',
    category: 'Security',
    type: 'yes_no',
    question: 'Approve immediate deployment of Strict CSP & 1-Year HSTS Headers to production?',
    options: ['Yes, Deploy to Production (P0)', 'No, Validate on Staging First', 'Abstain / Need Discussion'],
  },
  {
    title: 'TLS 1.3 Cipher Hardening',
    category: 'Security',
    type: 'multiple_choice',
    question: 'Should we deprecate TLS 1.0/1.1 and enforce TLS 1.3 only?',
    options: ['Enforce TLS 1.3 Immediately', 'Provide 30-Day Client Warning', 'Reject / Keep TLS 1.2+'],
  },
  {
    title: 'Edge Caching & Brotli Compression',
    category: 'Performance',
    type: 'yes_no',
    question: 'Enable CDN Edge Caching and Brotli level 6 compression for static assets?',
    options: ['Approve Immediately', 'Reject / Staging Benchmark First'],
  },
  {
    title: 'WAF Rate Limiting & Bot Shield',
    category: 'Infrastructure',
    type: 'yes_no',
    question: 'Enable Cloudflare WAF rate limiting at 120 req/min for crawler subnets?',
    options: ['Yes, Block Aggressive Bots', 'Switch to Managed Challenge', 'Log & Monitor Only'],
  },
  {
    title: 'Largest Contentful Paint (LCP) Fix',
    category: 'Performance',
    type: 'yes_no',
    question: 'Prioritize Largest Contentful Paint (LCP) hero image optimization in Next Sprint?',
    options: ['Yes, P1 High Priority', 'No, P2 Medium Priority', 'Deprioritize'],
  },
];

interface AuditPollsPanelProps {
  polls: AuditPoll[];
  lang: Language;
  user: UserAccount;
  isCreatingPoll: boolean;
  setIsCreatingPoll: (val: boolean) => void;
  newPollQuestion: string;
  setNewPollQuestion: (val: string) => void;
  newPollType: 'yes_no' | 'multiple_choice';
  setNewPollType: (val: 'yes_no' | 'multiple_choice') => void;
  newPollCategory: 'Security' | 'Performance' | 'Infrastructure' | 'Architecture' | 'General';
  setNewPollCategory: (val: 'Security' | 'Performance' | 'Infrastructure' | 'Architecture' | 'General') => void;
  newPollOptions: string[];
  setNewPollOptions: (val: string[]) => void;
  newPollIsAnonymous: boolean;
  setNewPollIsAnonymous: (val: boolean) => void;
  pollFilterTab: 'ALL' | 'active' | 'closed';
  setPollFilterTab: (val: 'ALL' | 'active' | 'closed') => void;
  onApplyPresetTemplate: (template: AuditPollPresetTemplate) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (index: number, val: string) => void;
  onCreatePoll: (e?: React.FormEvent) => void;
  onVotePoll: (pollId: string, optionId: string) => void;
  onClosePoll: (pollId: string) => void;
  onReopenPoll: (pollId: string) => void;
  onDeletePoll: (pollId: string) => void;
  onAnnouncePollResult: (poll: AuditPoll) => void;
}

export const AuditPollsPanel: React.FC<AuditPollsPanelProps> = ({
  polls,
  lang,
  user,
  isCreatingPoll,
  setIsCreatingPoll,
  newPollQuestion,
  setNewPollQuestion,
  newPollType,
  setNewPollType,
  newPollCategory,
  setNewPollCategory,
  newPollOptions,
  setNewPollOptions,
  newPollIsAnonymous,
  setNewPollIsAnonymous,
  pollFilterTab,
  setPollFilterTab,
  onApplyPresetTemplate,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onCreatePoll,
  onVotePoll,
  onClosePoll,
  onReopenPoll,
  onDeletePoll,
  onAnnouncePollResult,
}) => {
  const [expandedVotersPollId, setExpandedVotersPollId] = useState<string | null>(null);

  const filteredPolls = polls.filter((p) => {
    if (pollFilterTab === 'active') return p.status === 'active';
    if (pollFilterTab === 'closed') return p.status === 'closed';
    return true;
  });

  const getCategoryBadge = (category: AuditPoll['category']) => {
    switch (category) {
      case 'Security':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase">
            <Shield className="w-3 h-3" /> Security
          </span>
        );
      case 'Performance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
            <Zap className="w-3 h-3" /> Performance
          </span>
        );
      case 'Infrastructure':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase">
            <Server className="w-3 h-3" /> Infra
          </span>
        );
      case 'Architecture':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
            <Layers className="w-3 h-3" /> Architecture
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600 text-[10px] font-bold uppercase">
            <HelpCircle className="w-3 h-3" /> General
          </span>
        );
    }
  };

  const formatElapsed = (timestamp: number) => {
    const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diffSec < 60) return `${diffSec}s ago`;
    const mins = Math.floor(diffSec / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-slate-200">
      
      {/* Top Header & Filter Bar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/70 space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Vote className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">
                {lang === 'te' ? 'టీమ్ ఆడిట్ పోల్స్' : 'Audit Decision Polls'}
              </h4>
              <p className="text-[10px] text-slate-400">
                {lang === 'te' ? 'నిర్ణయాల కోసం లైవ్ ఓటింగ్' : 'Real-time consensus & team voting'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatingPoll(!isCreatingPoll)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
              isCreatingPoll
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20 border border-purple-400/40'
            }`}
          >
            <Plus className={`w-3.5 h-3.5 transition-transform ${isCreatingPoll ? 'rotate-45' : ''}`} />
            <span>{isCreatingPoll ? (lang === 'te' ? 'రద్దు' : 'Cancel') : (lang === 'te' ? 'కొత్త పోల్' : 'New Poll')}</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setPollFilterTab('ALL')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold text-center transition-colors cursor-pointer ${
              pollFilterTab === 'ALL'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'te' ? 'అన్నీ' : 'All'} ({polls.length})
          </button>
          <button
            type="button"
            onClick={() => setPollFilterTab('active')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              pollFilterTab === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {lang === 'te' ? 'యాక్టివ్' : 'Active'} ({polls.filter((p) => p.status === 'active').length})
          </button>
          <button
            type="button"
            onClick={() => setPollFilterTab('closed')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold text-center transition-colors cursor-pointer ${
              pollFilterTab === 'closed'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'te' ? 'ముగిసినవి' : 'Closed'} ({polls.filter((p) => p.status === 'closed').length})
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-4 scrollbar-thin">
        
        {/* CREATE POLL FORM ACCORDION */}
        {isCreatingPoll && (
          <form
            onSubmit={onCreatePoll}
            className="p-3.5 rounded-2xl bg-slate-950 border-2 border-purple-500/40 shadow-xl space-y-3.5 animate-in slide-in-from-top-3 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-bold text-xs text-white">
                  {lang === 'te' ? 'ఆడిట్ డెసిషన్ పోల్ సృష్టించండి' : 'Create Team Audit Poll'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-300 uppercase bg-purple-500/20 px-2 py-0.5 rounded">
                Live Sync
              </span>
            </div>

            {/* Quick Preset Templates Chips */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'te' ? 'త్వరిత టెంప్లేట్‌లు (1-క్లిక్)' : '⚡ Quick Audit Presets (1-Click Fill)'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AUDIT_POLL_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onApplyPresetTemplate(tpl)}
                    className="px-2 py-1 rounded-md bg-slate-900 hover:bg-purple-900/40 border border-slate-800 hover:border-purple-500/50 text-[10px] text-slate-300 hover:text-purple-200 font-medium transition-colors cursor-pointer text-left"
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Type Selectors */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={newPollCategory}
                  onChange={(e) => setNewPollCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="Security">Security (P0/P1)</option>
                  <option value="Performance">Performance (LCP/CWV)</option>
                  <option value="Infrastructure">Infrastructure (DNS/WAF)</option>
                  <option value="Architecture">Architecture</option>
                  <option value="General">General Decision</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Poll Format
                </label>
                <select
                  value={newPollType}
                  onChange={(e) => {
                    const nextType = e.target.value as any;
                    setNewPollType(nextType);
                    if (nextType === 'yes_no') {
                      setNewPollOptions(['Yes, Approve (P0)', 'No, Reject / Needs Review']);
                    } else if (newPollOptions.length < 3) {
                      setNewPollOptions([...newPollOptions, 'Third Option']);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="yes_no">Yes / No Consensus</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>
            </div>

            {/* Question Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'te' ? 'పోల్ ప్రశ్న' : 'Audit Decision Question *'}
              </label>
              <textarea
                value={newPollQuestion}
                onChange={(e) => setNewPollQuestion(e.target.value)}
                placeholder="e.g. Approve immediate deployment of Strict CSP & HSTS to production?"
                rows={2}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              />
            </div>

            {/* Options List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'te' ? 'ఎంపికలు (Options)' : 'Ballot Options *'}
                </label>
                {newPollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={onAddOption}
                    className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Choice
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {newPollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5">
                    <span className="w-5 text-center text-[10px] font-mono font-bold text-slate-500">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => onOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      required
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-400"
                    />
                    {newPollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => onRemoveOption(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Remove Option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPollIsAnonymous}
                  onChange={(e) => setNewPollIsAnonymous(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                />
                <span>{lang === 'te' ? 'అనామక ఓటింగ్ (Anonymous Votes)' : 'Anonymous Voting (Hide names)'}</span>
              </label>
            </div>

            {/* Launch Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer border border-purple-400/40"
            >
              <Vote className="w-4 h-4" />
              <span>{lang === 'te' ? 'టీమ్‌కి పోల్ ప్రారంభించండి 🚀' : 'Launch Audit Poll to Team 🚀'}</span>
            </button>
          </form>
        )}

        {/* LIST OF AUDIT POLLS */}
        {filteredPolls.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-200">
                {pollFilterTab === 'active'
                  ? (lang === 'te' ? 'యాక్టివ్ పోల్స్ ఏవీ లేవు' : 'No Active Polls')
                  : pollFilterTab === 'closed'
                  ? (lang === 'te' ? 'ముగిసిన పోల్స్ లేవు' : 'No Closed Polls')
                  : (lang === 'te' ? 'ఇంకా పోల్స్ సృష్టించబడలేదు' : 'No Audit Polls Yet')}
              </h5>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                {lang === 'te'
                  ? 'సెక్యూరిటీ ప్యాచ్‌లు మరియు డెప్లాయ్‌మెంట్ నిర్ణయాల కోసం మీటింగ్ సభ్యుల నుండి ఓట్లను సేకరించండి.'
                  : 'Gather team votes on critical security headers, cache policies, and architecture decisions.'}
              </p>
            </div>
            {!isCreatingPoll && (
              <button
                type="button"
                onClick={() => setIsCreatingPoll(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'te' ? 'మొదటి పోల్ ప్రారంభించండి' : 'Launch First Audit Poll'}</span>
              </button>
            )}
          </div>
        ) : (
          filteredPolls.map((poll) => {
            const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
            const myName = user.name || (user.email ? user.email.split('@')[0] : 'Team Member');
            const myVotedOption = poll.options.find((opt) => opt.votes.includes(myName));
            const isHost = poll.creatorName.includes('Host') || poll.creatorId.includes('host') || user.role === 'Admin';
            const sortedByVotes = [...poll.options].sort((a, b) => b.votes.length - a.votes.length);
            const topOption = sortedByVotes[0];
            const isWinnerDefined = totalVotes > 0 && poll.status === 'closed';

            return (
              <div
                key={poll.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 space-y-3 ${
                  poll.status === 'active'
                    ? 'bg-slate-950/90 border-purple-500/40 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-950/50 border-slate-800 opacity-90'
                }`}
              >
                {/* Poll Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      {getCategoryBadge(poll.category)}

                      {poll.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">
                          <Lock className="w-3 h-3" /> CLOSED
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-slate-500">
                        {formatElapsed(poll.createdAt)}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white leading-snug pt-0.5">
                      {poll.question}
                    </h4>
                  </div>
                </div>

                {/* Creator Meta */}
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                  <User className="w-3 h-3 text-slate-500" />
                  <span>By <strong className="text-slate-300">{poll.creatorName}</strong></span>
                  {poll.isAnonymous && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px]">
                      🔒 Anonymous Ballot
                    </span>
                  )}
                </div>

                {/* Closed Winner Banner */}
                {isWinnerDefined && topOption && (
                  <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                          Winning Decision
                        </span>
                        <strong className="text-emerald-200 text-xs">{topOption.text}</strong>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-xs px-2 py-1 rounded bg-emerald-500/20">
                      {totalVotes > 0 ? Math.round((topOption.votes.length / totalVotes) * 100) : 0}%
                    </span>
                  </div>
                )}

                {/* Interactive Voting Options List */}
                <div className="space-y-2">
                  {poll.options.map((option) => {
                    const voteCount = option.votes.length;
                    const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                    const hasUserVotedThis = option.votes.includes(myName);
                    const isTopVote = totalVotes > 0 && voteCount === topOption.votes.length;

                    return (
                      <div
                        key={option.id}
                        onClick={() => {
                          if (poll.status === 'active') {
                            onVotePoll(poll.id, option.id);
                          }
                        }}
                        className={`group relative p-2.5 rounded-xl border transition-all ${
                          poll.status === 'active' ? 'cursor-pointer hover:border-purple-400' : 'cursor-default'
                        } ${
                          hasUserVotedThis
                            ? 'bg-purple-950/40 border-purple-500/80 shadow-md ring-1 ring-purple-500/50'
                            : 'bg-slate-900/80 border-slate-800 hover:bg-slate-900'
                        }`}
                      >
                        {/* Background Progress Bar */}
                        <div
                          className={`absolute inset-0 rounded-xl transition-all duration-500 opacity-20 pointer-events-none ${
                            isTopVote && totalVotes > 0
                              ? 'bg-emerald-500'
                              : hasUserVotedThis
                              ? 'bg-purple-500'
                              : 'bg-slate-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />

                        <div className="relative flex items-center justify-between z-10">
                          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                            {/* Vote Radio Indicator */}
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                                hasUserVotedThis
                                  ? 'bg-purple-500 border-purple-400 text-white'
                                  : 'border-slate-600 group-hover:border-purple-400'
                              }`}
                            >
                              {hasUserVotedThis && <CheckCircle2 className="w-3 h-3" />}
                            </div>

                            <span className={`text-xs font-semibold break-words ${hasUserVotedThis ? 'text-white' : 'text-slate-200'}`}>
                              {option.text}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-[11px] font-mono text-slate-400">
                              {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                            </span>
                            <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                              hasUserVotedThis ? 'bg-purple-500/30 text-purple-300' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {percent}%
                            </span>
                          </div>
                        </div>

                        {/* Voter attendee chips list (when not anonymous) */}
                        {!poll.isAnonymous && option.votes.length > 0 && (
                          <div className="relative mt-2 pt-1.5 border-t border-slate-800/60 flex items-center flex-wrap gap-1 z-10">
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Voted:</span>
                            {option.votes.map((voter, vIdx) => (
                              <span
                                key={vIdx}
                                className="px-1.5 py-0.2 rounded-md bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/60 font-medium"
                              >
                                {voter}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls & Stats */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Total: <strong className="text-white font-mono">{totalVotes}</strong> votes</span>
                    {myVotedOption && (
                      <span className="text-purple-300 font-semibold ml-1">
                        • You voted
                      </span>
                    )}
                  </div>

                  {/* Host Action Buttons */}
                  <div className="flex items-center space-x-1.5">
                    {/* Announce to Chat */}
                    <button
                      type="button"
                      onClick={() => onAnnouncePollResult(poll)}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Announce results in team chat"
                    >
                      <Share2 className="w-3 h-3 text-cyan-400" />
                      <span>{lang === 'te' ? 'చాట్‌లో ప్రకటించు' : 'Announce'}</span>
                    </button>

                    {/* Close / Reopen */}
                    {poll.status === 'active' ? (
                      <button
                        type="button"
                        onClick={() => onClosePoll(poll.id)}
                        className="px-2 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-[10px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                        title="End poll and finalize results"
                      >
                        <Lock className="w-3 h-3 text-rose-400" />
                        <span>{lang === 'te' ? 'ముగించు' : 'End Poll'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onReopenPoll(poll.id)}
                        className="px-2 py-1 rounded-md bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                        title="Reopen poll for voting"
                      >
                        <Unlock className="w-3 h-3 text-emerald-400" />
                        <span>{lang === 'te' ? 'పునఃప్రారంభించు' : 'Re-open'}</span>
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeletePoll(poll.id)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Poll"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
