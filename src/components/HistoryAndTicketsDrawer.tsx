import React, { useState } from 'react';
import {
  X,
  Download,
  GitPullRequest,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  Globe,
  ArrowRightLeft,
  CheckSquare,
  Square,
  Sparkles,
  FileSpreadsheet,
  Check,
  Trash2,
} from 'lucide-react';
import { ClientTicket, FullAuditReport, Language } from '../types';
import { translations } from '../data/translations';
import { AuditComparisonModal } from './AuditComparisonModal';

interface HistoryAndTicketsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  tickets: ClientTicket[];
  history: FullAuditReport[];
  onSelectReport: (report: FullAuditReport) => void;
  onClearHistory?: () => void;
}

export const HistoryAndTicketsDrawer: React.FC<HistoryAndTicketsDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  tickets,
  history,
  onSelectReport,
  onClearHistory,
}) => {
  const t = translations[lang];

  // Compare selection state
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [isExportingCsv, setIsExportingCsv] = useState<boolean>(false);
  const [csvExportSuccess, setCsvExportSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSelectForCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // Keep the latest 2
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const selectedReports = history.filter((h) => selectedForCompare.includes(h.id));

  const handleLaunchComparison = () => {
    if (selectedReports.length === 2) {
      setIsComparisonModalOpen(true);
    }
  };

  const escapeCsvValue = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const handleExportCsv = () => {
    setIsExportingCsv(true);

    try {
      const dateStamp = new Date().toISOString().slice(0, 10);
      const csvLines: string[] = [];

      // UTF-8 BOM for Excel / Google Sheets compatibility
      csvLines.push('\uFEFF# ============================================================');
      csvLines.push('# WEBSITE HEALTH & SECURITY PLATFORM - AUDIT & TICKETS REPORT');
      csvLines.push(`# Generated At: ${new Date().toISOString()}`);
      csvLines.push(`# Total Audit Records: ${history.length} | Total Fix Tickets: ${tickets.length}`);
      csvLines.push('# ============================================================');
      csvLines.push('');

      // --- SECTION 1: AUDIT HISTORY ---
      csvLines.push('# --- 1. AUDIT HISTORY & DIAGNOSTIC METRICS ---');
      const auditHeaders = [
        'Audit ID',
        'Website URL',
        'Hostname',
        'Scan Timestamp',
        'Overall Health Score',
        'Grade',
        'Performance Score',
        'SEO Score',
        'Security Score',
        'SSL Grade',
        'Accessibility Score',
        'Best Practices Score',
        'Latency (ms)',
        'Confidence Score (%)',
        'Critical Issues',
        'High Issues',
        'Medium Issues',
        'Total Issues',
        'Target Module',
        'Technologies Detected',
      ];
      csvLines.push(auditHeaders.map(escapeCsvValue).join(','));

      if (history.length === 0) {
        csvLines.push(escapeCsvValue('No audit history recorded yet'));
      } else {
        history.forEach((h) => {
          const techList = h.technologies?.map((tech) => tech.name).join('; ') || 'N/A';
          const row = [
            h.id || 'N/A',
            h.url || 'N/A',
            h.hostname || 'N/A',
            h.timestamp || 'N/A',
            h.overallScore ?? 'N/A',
            h.grade || 'N/A',
            h.perfScore ?? h.performanceScore ?? 'N/A',
            h.seoScore ?? 'N/A',
            h.secScore ?? h.securityScore ?? 'N/A',
            h.ssl?.grade || 'N/A',
            h.accScore ?? 'N/A',
            h.bestPracticesScore ?? 'N/A',
            h.latencyMs ?? 'N/A',
            h.confidenceScore ?? 'N/A',
            h.issueCounts?.critical ?? 0,
            h.issueCounts?.high ?? 0,
            h.issueCounts?.medium ?? 0,
            h.issueCounts?.total ?? 0,
            h.targetAuditModule || 'all',
            techList,
          ];
          csvLines.push(row.map(escapeCsvValue).join(','));
        });
      }

      csvLines.push('');
      csvLines.push('');

      // --- SECTION 2: ACTIVE TICKETS & PRS ---
      csvLines.push('# --- 2. AUTOMATED FIX REQUESTS & GITHUB PRS ---');
      const ticketHeaders = [
        'Ticket ID',
        'Repository / Website URL',
        'Status',
        'Created At',
        'Pull Request URL',
        'Download Patch Path',
      ];
      csvLines.push(ticketHeaders.map(escapeCsvValue).join(','));

      if (tickets.length === 0) {
        csvLines.push(escapeCsvValue('No active fix tickets submitted yet'));
      } else {
        tickets.forEach((t) => {
          const row = [
            t.id || 'N/A',
            t.githubLink || 'N/A',
            t.status || 'Pending',
            t.createdAt || 'N/A',
            t.prUrl || 'N/A',
            t.downloadPath || `Automated_Fix_Patch_${t.id}.json`,
          ];
          csvLines.push(row.map(escapeCsvValue).join(','));
        });
      }

      const csvContent = csvLines.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `WebsiteHealth_AuditHistory_Tickets_${dateStamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setCsvExportSuccess(true);
      setTimeout(() => setCsvExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleDownloadTicketZip = (ticket: ClientTicket) => {
    const filename = ticket.downloadPath || `Automated_Fix_Patch_${ticket.id}.json`;
    const patchContent = JSON.stringify(
      {
        ticketId: ticket.id,
        createdAt: ticket.createdAt,
        websiteUrl: ticket.githubLink,
        status: ticket.status,
        remediatedRules: [
          'Enable Gzip & Brotli Compression (.htaccess / nginx.conf)',
          'Add Security Headers (HSTS, CSP, X-Frame-Options)',
          'Convert Images to Next-Gen WebP with exact width/height attributes',
          'Defer non-critical scripts and inline critical CSS',
        ],
      },
      null,
      2
    );
    const blob = new Blob([patchContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-slideLeft">
          <div className="space-y-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">{t.downloads}</h3>
                <p className="text-xs text-slate-400">Automated PRs & Scanned History</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  id="export-csv-header-btn"
                  onClick={handleExportCsv}
                  disabled={isExportingCsv}
                  title="Export Audit History & Active Tickets as CSV"
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    csvExportSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {csvExportSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'te' ? 'ఎగుమతి అయింది!' : 'Exported!'}</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'te' ? 'CSV ఎగుమతి' : 'Export CSV'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Section 1: Automated PRs / Download Tickets */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Fix Requests & PRs ({tickets.length})
              </h4>

              {tickets.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400">
                  No fix tickets submitted yet. Click &quot;Request Automated GitHub Fix&quot; from any audit.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-slate-900">#{ticket.id}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ticket.status === 'PR Opened'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium truncate max-w-xs">
                          {ticket.githubLink}
                        </p>
                        <span className="text-[10px] text-slate-400">{ticket.createdAt}</span>
                      </div>

                      <div className="shrink-0">
                        {ticket.prUrl ? (
                          <a
                            href={ticket.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-colors"
                          >
                            <GitPullRequest className="w-3.5 h-3.5" />
                            <span>View PR</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => handleDownloadTicketZip(ticket)}
                            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>ZIP</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Scanned URLs History & Compare Mode */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.history} ({history.length})
                </h4>

                <div className="flex items-center space-x-2">
                  {history.length > 0 && onClearHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(lang === 'te' ? 'పాత ఆడిట్ రికార్డులన్నింటినీ క్లియర్ చేయాలా?' : 'Clear all audit history records?')) {
                          onClearHistory();
                        }
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                      title={lang === 'te' ? 'హిస్టరీని పూర్తిగా క్లియర్ చేయండి' : 'Clear All Audit History'}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{lang === 'te' ? 'క్లియర్' : 'Clear'}</span>
                    </button>
                  )}

                  {history.length >= 2 && (
                    <button
                      onClick={() => {
                        setIsCompareMode(!isCompareMode);
                        if (isCompareMode) setSelectedForCompare([]);
                      }}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCompareMode
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>{isCompareMode ? 'Cancel Compare' : 'Compare Audits'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Compare instruction bar */}
              {isCompareMode && (
                <div className="bg-indigo-50/80 border border-indigo-200/90 rounded-2xl p-3 flex items-center justify-between text-xs animate-fadeIn">
                  <span className="text-indigo-900 font-semibold">
                    Select 2 audits to compare ({selectedForCompare.length}/2 selected)
                  </span>

                  <button
                    disabled={selectedForCompare.length !== 2}
                    onClick={handleLaunchComparison}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
                  >
                    <span>View Comparison</span>
                    <ArrowRightLeft className="w-3 h-3" />
                  </button>
                </div>
              )}

              {history.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-xs text-slate-400">
                  {t.noScansYet}
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => {
                    const isSelected = selectedForCompare.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isCompareMode) {
                            toggleSelectForCompare(item.id);
                          } else {
                            onSelectReport(item);
                            onClose();
                          }
                        }}
                        className={`w-full text-left rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {isCompareMode ? (
                            <button
                              type="button"
                              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'border-2 border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <CheckSquare className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                              {item.overallScore}
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px] sm:max-w-xs">
                              {item.hostname}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                          </div>
                        </div>

                        {!isCompareMode && (
                          <span className="text-xs font-semibold text-emerald-600">
                            {t.viewDetails} →
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="export-csv-footer-btn"
              onClick={handleExportCsv}
              disabled={isExportingCsv}
              className={`flex-1 w-full font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm ${
                csvExportSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {csvExportSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'te' ? 'CSV ఫైల్ డౌన్‌లోడ్ అయింది!' : 'CSV Report Downloaded!'}</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'te'
                      ? `రిపోర్ట్ CSV ఎగుమతి చేయండి (${history.length + tickets.length} రికార్డులు)`
                      : `Export History & Tickets (${history.length + tickets.length} records as CSV)`}
                  </span>
                </>
              )}
            </button>
            <button
              id="close-drawer-footer-btn"
              onClick={onClose}
              className="w-full sm:w-auto px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {selectedReports.length === 2 && (
        <AuditComparisonModal
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
          lang={lang}
          reportA={selectedReports[0]}
          reportB={selectedReports[1]}
        />
      )}
    </>
  );
};
