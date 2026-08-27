import React from 'react';
import {
  ListOrdered,
  CheckCircle2,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Trash2,
  Globe,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AuditQueueItem, FullAuditReport, Language } from '../types';
import { translations } from '../data/translations';

interface AuditQueuePanelProps {
  queue: AuditQueueItem[];
  activeReportId?: string;
  onSelectReport: (report: FullAuditReport) => void;
  onClearQueue: () => void;
  isScanningBulk: boolean;
  lang: Language;
}

export const AuditQueuePanel: React.FC<AuditQueuePanelProps> = ({
  queue,
  activeReportId,
  onSelectReport,
  onClearQueue,
  isScanningBulk,
  lang,
}) => {
  const t = translations[lang];

  if (queue.length === 0) return null;

  const completedCount = queue.filter((item) => item.status === 'completed').length;
  const inProgressCount = queue.filter((item) => item.status === 'scanning').length;
  const pendingCount = queue.filter((item) => item.status === 'pending').length;
  const progressPercent = Math.round((completedCount / queue.length) * 100);

  const completedItems = queue.filter((item) => item.status === 'completed' && item.report);
  const avgScore =
    completedItems.length > 0
      ? Math.round(
          completedItems.reduce((acc, item) => acc + (item.report?.overallScore || 0), 0) /
            completedItems.length
        )
      : null;

  return (
    <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-5 animate-fadeIn w-full mt-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {t.queueTitle}
              </h3>
              {isScanningBulk && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>{t.scanningBulk}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {t.queueSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isScanningBulk && (
            <button
              onClick={onClearQueue}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearQueue}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3">
          <p className="text-[10px] uppercase font-bold text-slate-400">{t.totalInQueue}</p>
          <p className="text-xl font-black text-white">{queue.length}</p>
        </div>
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3">
          <p className="text-[10px] uppercase font-bold text-slate-400">{t.completedQueue}</p>
          <p className="text-xl font-black text-emerald-400">{completedCount}</p>
        </div>
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3">
          <p className="text-[10px] uppercase font-bold text-slate-400">{t.processingQueue}</p>
          <p className="text-xl font-black text-teal-300">{inProgressCount}</p>
        </div>
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3">
          <p className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'te' ? 'సగటు స్కోర్' : 'Batch Avg Score'}
          </p>
          <p className="text-xl font-black text-cyan-300">
            {avgScore !== null ? `${avgScore}/100` : '--'}
          </p>
        </div>
      </div>

      {/* Overall Queue Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-2">
            {lang === 'te'
              ? `పూర్తయినవి: ${completedCount} / ${queue.length} వెబ్‌సైట్లు`
              : `Processed ${completedCount} of ${queue.length} targets`}
            {inProgressCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-normal text-teal-300 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                {lang === 'te' ? 'ఆడిట్ కొనసాగుతోంది...' : 'Audit in progress...'}
              </span>
            )}
          </span>
          <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="relative w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700 shadow-inner">
          {/* Base Completed Progress Fill */}
          <div
            className="relative bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out overflow-hidden"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer sweep effect during active scanning */}
            {(isScanningBulk || inProgressCount > 0) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer" />
            )}
          </div>
          
          {/* Subtle indeterminate pulse when queue is active but completed is 0% */}
          {(isScanningBulk || inProgressCount > 0) && progressPercent === 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/40 to-transparent animate-shimmer" />
          )}
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {queue.map((item, index) => {
          const isCurrentActive = item.report && activeReportId === item.report.id;
          const isScanning = item.status === 'scanning';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative overflow-hidden ${
                isCurrentActive
                  ? 'bg-slate-800 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                  : isScanning
                  ? 'bg-slate-800/90 border-teal-500/60 shadow-lg shadow-teal-500/10'
                  : item.status === 'completed'
                  ? 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-70'
              }`}
            >
              {/* Subtle top accent bar for scanning items */}
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 animate-pulse" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isScanning
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isScanning ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                      <p className="text-sm font-bold text-white truncate">{item.hostname}</p>
                      {isCurrentActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {t.activeViewing}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{item.url}</p>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-end space-x-3 shrink-0">
                  {item.status === 'completed' && item.report && (
                    <>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                          item.report.overallScore >= 90
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : item.report.overallScore >= 75
                            ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.report.overallScore}/100
                      </span>

                      <button
                        onClick={() => onSelectReport(item.report!)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isCurrentActive
                            ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/25'
                            : 'bg-slate-700 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-slate-950 text-white'
                        }`}
                      >
                        <span>{t.viewReportBtn}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {isScanning && (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/40">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>{t.processingQueue}</span>
                    </span>
                  )}

                  {item.status === 'pending' && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      <Clock className="w-3 h-3" />
                      <span>{t.pendingQueue}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Smooth Fill Progress Bar for Active Scanning Item */}
              {isScanning && (
                <div className="pt-2 border-t border-slate-700/50 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-teal-300 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                      {lang === 'te'
                        ? 'భద్రత, SEO & పెర్ఫార్మెన్స్ ఆడిట్ నడుస్తోంది...'
                        : 'Auditing SSL, Core Web Vitals, Security & SEO...'}
                    </span>
                    <span className="text-[10px] font-mono text-teal-400/90 font-semibold tracking-wide">
                      {lang === 'te' ? 'లైవ్ చెకింగ్' : 'LIVE SCAN'}
                    </span>
                  </div>
                  
                  <div className="relative w-full h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-teal-500/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full animate-indeterminate" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
