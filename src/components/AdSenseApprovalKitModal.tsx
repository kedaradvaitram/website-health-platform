import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Globe,
  DollarSign,
  Search,
  Code2,
  Lock,
  Layers,
  FolderArchive,
  RefreshCw,
  Info,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  generateAdSenseSeoKit,
  downloadAdSenseSeoZip,
  AdSenseFileItem,
  AdSenseChecklistItem,
} from '../data/adsenseSeoRemediationKit';

interface AdSenseApprovalKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  websiteUrl?: string;
  defaultPublisherId?: string;
  onOpenPricing?: () => void;
}

export const AdSenseApprovalKitModal: React.FC<AdSenseApprovalKitModalProps> = ({
  isOpen,
  onClose,
  lang,
  websiteUrl = 'https://example.com',
  defaultPublisherId = '',
  onOpenPricing,
}) => {
  const t = translations[lang];
  const isTe = lang === 'te';

  const [inputUrl, setInputUrl] = useState(websiteUrl);
  const [publisherId, setPublisherId] = useState(defaultPublisherId);
  const [siteName, setSiteName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'root_files' | 'legal_pages' | 'seo_schema' | 'adsense_placement'>('all');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Synchronize when websiteUrl prop changes
  React.useEffect(() => {
    if (websiteUrl) {
      setInputUrl(websiteUrl);
    }
  }, [websiteUrl]);

  const kit = useMemo(() => {
    return generateAdSenseSeoKit({
      websiteUrl: inputUrl || 'https://example.com',
      publisherId: publisherId.trim() || undefined,
      siteName: siteName.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
    });
  }, [inputUrl, publisherId, siteName, contactEmail]);

  const filteredFiles = useMemo(() => {
    if (activeCategory === 'all') return kit.files;
    return kit.files.filter((f) => f.folder === activeCategory);
  }, [kit.files, activeCategory]);

  const activeFile: AdSenseFileItem = filteredFiles[selectedFileIndex] || filteredFiles[0] || kit.files[0];

  if (!isOpen) return null;

  const handleCopyCode = (file: AdSenseFileItem) => {
    navigator.clipboard.writeText(file.content);
    setCopiedFile(file.filename);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setCopiedFile(null);
    }, 2200);
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      await downloadAdSenseSeoZip(kit);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getStatusBadge = (status: AdSenseChecklistItem['status'], label: string) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{label}</span>
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            <span>{label}</span>
          </span>
        );
      case 'needs_action':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>{label}</span>
          </span>
        );
      case 'recommended':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Info className="w-3 h-3 text-slate-500" />
            <span>{label}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full p-5 sm:p-7 space-y-6 relative max-h-[92vh] overflow-y-auto my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {isTe
                    ? 'గూగుల్ యాడ్‌సెన్స్ టెక్నికల్ రెడీనెస్ & ఎస్‌ఈఓ కిట్'
                    : 'AdSense Technical Readiness & SEO Pack'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {kit.technicalReadinessScore}/100 Score
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTe
                  ? 'మీ వెబ్‌సైట్ టెక్నికల్ అవసరాల కోసం ads.txt, 5 రికమండెడ్ లీగల్ పేజీలు, robots.txt మరియు Schema.org కోడ్ టెంప్లేట్లు.'
                  : 'Technical readiness files: ads.txt, 5 Recommended Legal Pages, robots.txt, Schema.org & Anti-CLS Ad Slots.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Customization Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>{isTe ? 'సైట్ వివరాలు మరియు పబ్లిషర్ ఐడీని నమోదు చేయండి:' : 'Customize Domain & AdSense Publisher ID:'}</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Domain: <strong className="text-slate-800">{kit.cleanDomain}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {isTe ? 'వెబ్‌సైట్ డొమైన్ / URL' : 'Website Domain / URL'}
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-600">
                  {isTe ? 'యాడ్‌సెన్స్ పబ్లిషర్ ID' : 'AdSense Publisher ID'}
                </label>
                {kit.hasValidPublisherId ? (
                  <span className="text-[10px] text-emerald-600 font-bold">✓ Valid ID</span>
                ) : (
                  <span className="text-[10px] text-amber-600 font-bold">Required for ads.txt</span>
                )}
              </div>
              <input
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="e.g. pub-1234567890123456"
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 ${
                  kit.hasValidPublisherId
                    ? 'border-emerald-300 focus:ring-emerald-500'
                    : 'border-amber-300 focus:ring-amber-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {isTe ? 'కాంటాక్ట్ ఈమెయిల్' : 'Official Contact Email'}
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={`contact@${kit.cleanDomain}`}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {!kit.hasValidPublisherId && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isTe
                  ? 'మీ 16-అంకెల AdSense Publisher ID (ఉదా: pub-1234567890123456) ఇస్తే, ads.txt ఆటోమేటిక్‌గా మీ వాస్తవ ఖాతాతో కాన్ఫిగర్ అవుతుంది.'
                  : 'Enter your 16-digit AdSense Publisher ID above so ads.txt is configured with your real account instead of a placeholder.'}
              </span>
            </div>
          )}
        </div>

        {/* Technical Readiness Checklist Summary Panel */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isTe ? 'టెక్నికల్ రెడీనెస్ & ఫైల్ స్టేటస్ చెక్‌లిస్ట్' : 'Technical Readiness & File Checklist'}</span>
              </div>
              <p className="text-xs text-slate-300">
                {isTe
                  ? 'టెక్నికల్ అంశాలు మరియు పాలసీ పేజీల సన్నద్ధత స్థితి (Detected / Generated / Needs Review).'
                  : 'Automated status for web crawlers, search indexers, transparency pages, and ad containers.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="shrink-0 inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isZipping ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FolderArchive className="w-4 h-4" />
              )}
              <span>
                {isZipping
                  ? isTe ? 'ZIP సిద్ధమవుతోంది...' : 'Packaging ZIP...'
                  : isTe ? 'అన్ని ఫైల్స్ ZIP డౌన్‌లోడ్' : 'Download Complete ZIP Pack'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
            {kit.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-850/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="space-y-0.5 pr-2">
                  <div className="font-bold text-slate-200">
                    {isTe ? item.nameTe : item.name}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {isTe ? item.notesTe : item.notes}
                  </div>
                </div>
                <div className="shrink-0">
                  {getStatusBadge(item.status, isTe ? item.statusLabelTe : item.statusLabel)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'all', label: isTe ? 'అన్ని ఫైల్స్ (13)' : 'All Files (13)' },
            { id: 'root_files', label: isTe ? 'రూట్ ఫైల్స్ (ads.txt, robots, sitemap)' : 'Root Files (ads.txt, robots, sitemap)' },
            { id: 'legal_pages', label: isTe ? '5 రికమండెడ్ లీగల్ పేజీలు' : '5 Recommended Legal Pages' },
            { id: 'seo_schema', label: isTe ? 'ఎస్‌ఈఓ & Schema.org' : 'SEO & Schema Validation' },
            { id: 'adsense_placement', label: isTe ? 'Anti-CLS యాడ్ కంటైనర్లు & CMP' : 'Anti-CLS Ad Slots & CMP' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setSelectedFileIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Two-Column Code & File Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* File Selector Column */}
          <div className="lg:col-span-4 space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredFiles.map((file, idx) => {
              const isSelected = file.filename === activeFile.filename;
              return (
                <div
                  key={file.filename}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileCode className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold font-mono">{file.filename}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {file.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {isTe ? file.titleTe : file.title}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(file.status, isTe ? file.statusLabelTe : file.statusLabel)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active File Preview Column */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-4 text-white space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-amber-400 font-mono">{activeFile.filename}</span>
                  <span className="text-[10px] text-slate-400">
                    ({activeFile.folder === 'root_files' ? 'Root public_html/' : activeFile.folder})
                  </span>
                  {getStatusBadge(activeFile.status, isTe ? activeFile.statusLabelTe : activeFile.statusLabel)}
                </div>
                <p className="text-[11px] text-slate-300">
                  {isTe ? activeFile.descriptionTe : activeFile.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(activeFile)}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-700 shrink-0"
              >
                {copiedFile === activeFile.filename ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isTe ? 'కాపీ చేయబడింది!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isTe ? 'కోడ్ కాపీ చేయండి' : 'Copy Code'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Syntax Code Container */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-64 whitespace-pre">
              {activeFile.content}
            </div>

            {/* Bottom Target Placement Helper */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>
                Placement: <code className="text-amber-300 font-bold">/{activeFile.filename}</code>
              </span>
              <span className="text-slate-400">
                {isTe ? 'టెక్నికల్ సన్నద్ధత కోడ్ ప్యాక్' : 'AdSense Technical Readiness Pack'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {isTe
                ? 'ఈ ఫైల్స్ మీ వెబ్‌సైట్ రూట్ మరియు లీగల్ సెక్షన్ల కోసం అనుకూలీకరించబడ్డాయి.'
                : 'Custom-generated files ready for manual or automated server deployment.'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t.close}
            </button>
            <button
              type="button"
              onClick={handleDownloadAllZip}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isTe ? 'అన్ని ఫైల్స్ డౌన్‌లోడ్ చేయండి' : 'Download Complete ZIP'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
