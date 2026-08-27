import React from 'react';
import {
  X,
  Palette,
  Mic,
  Video,
  Settings,
  Sun,
  Moon,
  Contrast,
  Check,
  Sparkles,
  Shield,
  Volume2,
  Sliders,
  Radio,
  Lock,
  Subtitles,
  CircleDot,
  Layers,
  Monitor,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Language, UserAccount } from '../types';

export type MeetingThemeSkin = 'dark_modern' | 'minimalist_light' | 'high_contrast';

export interface MeetingThemeOption {
  id: MeetingThemeSkin;
  name: string;
  nameTe: string;
  badge: string;
  badgeTe: string;
  description: string;
  descriptionTe: string;
  bgHex: string;
  surfaceHex: string;
  borderHex: string;
  accentHex: string;
  swatches: { label: string; color: string }[];
  features: string[];
  featuresTe: string[];
}

export const MEETING_THEME_OPTIONS: MeetingThemeOption[] = [
  {
    id: 'dark_modern',
    name: 'Dark Modern',
    nameTe: 'డార్క్ మోడరన్',
    badge: 'Cyber Slate • Default',
    badgeTe: 'సైబర్ స్లేట్ • డిఫాల్ట్',
    description:
      'Deep obsidian & slate-950 canvas with cyber emerald and cyan neon accents. Minimizes eye fatigue in low-light auditing sessions.',
    descriptionTe:
      'తక్కువ కంటి ఒత్తిడికి అనువైన స్లీక్ డార్క్ స్లేట్ ఇంటర్‌ఫేస్ మరియు సైబర్ ఎమరాల్డ్ గ్లోస్.',
    bgHex: '#020617', // slate-950
    surfaceHex: '#0f172a', // slate-900
    borderHex: '#334155', // slate-700
    accentHex: '#06b6d4', // cyan-500
    swatches: [
      { label: 'Canvas', color: '#020617' },
      { label: 'Tile', color: '#0f172a' },
      { label: 'Border', color: '#334155' },
      { label: 'Accent', color: '#10b981' },
    ],
    features: [
      'Low blue-light eye protection',
      'Cyber neon active speaker glows',
      'High density dark layout for developer audits',
    ],
    featuresTe: [
      'తక్కువ బ్లూ-లైట్ కంటి రక్షణ',
      'లైవ్ స్పీకర్ నియాన్ గ్లో బోర్డర్లు',
      'డెవలపర్ ఆడిట్‌లకు అనువైన డార్క్ లేఅవుట్',
    ],
  },
  {
    id: 'minimalist_light',
    name: 'Minimalist Light',
    nameTe: 'మినిమలిస్ట్ లైట్',
    badge: 'Daylight Office • Clean',
    badgeTe: 'డేలైట్ ఆఫీస్ • క్లీన్',
    description:
      'Pristine off-white canvas with soft slate borders and ultra-crisp dark typography. Ideal for daylight office environments and client reviews.',
    descriptionTe:
      'స్పష్టమైన తెల్లటి నేపథ్యం, సాఫ్ట్ స్లేట్ బోర్డర్లు మరియు డార్క్ టైపోగ్రఫీతో క్లీన్ ప్రెజెంటేషన్ లుక్.',
    bgHex: '#f8fafc', // slate-50
    surfaceHex: '#ffffff', // white
    borderHex: '#cbd5e1', // slate-300
    accentHex: '#4f46e5', // indigo-600
    swatches: [
      { label: 'Canvas', color: '#f8fafc' },
      { label: 'Tile', color: '#ffffff' },
      { label: 'Border', color: '#cbd5e1' },
      { label: 'Accent', color: '#4f46e5' },
    ],
    features: [
      'Daylight readability & high typographic contrast',
      'Soft drop shadows & clean participant borders',
      'Professional executive presentation format',
    ],
    featuresTe: [
      'పగటి వెలుతురులో స్పష్టమైన రీడబిలిటీ',
      'సాఫ్ట్ షాడోలు మరియు క్లీన్ పార్టిసిపెంట్ కార్డ్స్',
      'ప్రొఫెషనల్ ఎగ్జిక్యూటివ్ ప్రెజెంటేషన్ ఫార్మాట్',
    ],
  },
  {
    id: 'high_contrast',
    name: 'High Contrast',
    nameTe: 'హై కాంట్రాస్ట్',
    badge: 'WCAG AAA • Maximum Clarity',
    badgeTe: 'WCAG AAA • గరిష్ట స్పష్టత',
    description:
      'Pure #000000 background paired with high-contrast #facc15 yellow borders and bright white text. Designed for maximum accessibility.',
    descriptionTe:
      'గరిష్ట రీడబిలిటీ మరియు యాక్సెసిబిలిటీ కోసం ప్యూర్ బ్లాక్ మరియు బ్రైట్ ఎల్లో (#facc15) బోర్డర్లు.',
    bgHex: '#000000', // black
    surfaceHex: '#09090b', // zinc-950
    borderHex: '#facc15', // yellow-400
    accentHex: '#facc15', // yellow-400
    swatches: [
      { label: 'Canvas', color: '#000000' },
      { label: 'Tile', color: '#09090b' },
      { label: 'Border', color: '#facc15' },
      { label: 'Accent', color: '#ffffff' },
    ],
    features: [
      '100% black level contrast ratio (>21:1)',
      '2px vivid yellow active borders & focus rings',
      'Maximized font weights & glare-resistant display',
    ],
    featuresTe: [
      '100% బ్లాక్ లెవల్ కాంట్రాస్ట్ రేషియో (>21:1)',
      '2px బ్రైట్ ఎల్లో యాక్టివ్ బోర్డర్లు & ఫోకస్ రింగ్స్',
      'అధిక రీడబిలిటీ మరియు గ్లేర్-రెసిస్టెంట్ డిస్‌ప్లే',
    ],
  },
];

interface MeetingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  meetingTheme: MeetingThemeSkin;
  onThemeChange: (theme: MeetingThemeSkin) => void;
  activeTab: 'theme' | 'audio_video' | 'general';
  setActiveTab: (tab: 'theme' | 'audio_video' | 'general') => void;
  cameraResolution: '1080p' | '720p' | '480p';
  setCameraResolution: (res: '1080p' | '720p' | '480p') => void;
  noiseSuppressionEnabled: boolean;
  setNoiseSuppressionEnabled: (val: boolean) => void;
  echoCancellationEnabled: boolean;
  setEchoCancellationEnabled: (val: boolean) => void;
  autoRecordOnStart: boolean;
  setAutoRecordOnStart: (val: boolean) => void;
  muteOnEntryPolicy: boolean;
  setMuteOnEntryPolicy: (val: boolean) => void;
  showCaptions: boolean;
  setShowCaptions: (val: boolean) => void;
  meetingRoomId: string;
  passcode?: string;
  user: UserAccount;
}

export const MeetingSettingsModal: React.FC<MeetingSettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  meetingTheme,
  onThemeChange,
  activeTab,
  setActiveTab,
  cameraResolution,
  setCameraResolution,
  noiseSuppressionEnabled,
  setNoiseSuppressionEnabled,
  echoCancellationEnabled,
  setEchoCancellationEnabled,
  autoRecordOnStart,
  setAutoRecordOnStart,
  muteOnEntryPolicy,
  setMuteOnEntryPolicy,
  showCaptions,
  setShowCaptions,
  meetingRoomId,
  passcode,
  user,
}) => {
  if (!isOpen) return null;

  // Theme-adaptive modal wrapper styling
  const isLight = meetingTheme === 'minimalist_light';
  const isHighContrast = meetingTheme === 'high_contrast';

  const modalBgClass = isHighContrast
    ? 'bg-black border-2 border-yellow-400 text-white'
    : isLight
    ? 'bg-white border-2 border-slate-300 text-slate-900'
    : 'bg-slate-900 border-2 border-indigo-500/50 text-white';

  const subPanelClass = isHighContrast
    ? 'bg-zinc-950 border border-yellow-400/70 text-white'
    : isLight
    ? 'bg-slate-50 border border-slate-200 text-slate-800'
    : 'bg-slate-950/80 border border-slate-800 text-slate-200';

  const tabActiveBg = isHighContrast
    ? 'bg-yellow-400 text-black font-black border-2 border-yellow-400'
    : isLight
    ? 'bg-indigo-600 text-white font-bold shadow-md'
    : 'bg-indigo-600 text-white font-bold shadow-md';

  const tabInactiveBg = isHighContrast
    ? 'text-yellow-400 hover:bg-zinc-900 border border-yellow-400/40'
    : isLight
    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800';

  return (
    <div className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-3xl rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left relative max-h-[92vh] flex flex-col ${modalBgClass}`}
        id="meeting-settings-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3 shrink-0 border-current/15">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                isHighContrast
                  ? 'bg-yellow-400 text-black'
                  : isLight
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-tr from-indigo-500 via-cyan-500 to-emerald-500 text-slate-950'
              }`}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg">
                  {lang === 'te' ? 'మీటింగ్ సెట్టింగ్స్ & UI థీమ్‌లు' : 'Meeting Settings & UI Skins'}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isHighContrast
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : isLight
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  {meetingTheme === 'dark_modern'
                    ? 'Dark Modern'
                    : meetingTheme === 'minimalist_light'
                    ? 'Minimalist Light'
                    : 'High Contrast'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : isHighContrast ? 'text-zinc-300' : 'text-slate-400'}`}>
                {lang === 'te'
                  ? 'ఇంటర్‌ఫేస్ థీమ్ స్కిన్స్, ఆడియో/వీడియో ప్రాధాన్యతలు మరియు హోస్ట్ నియంత్రణలు'
                  : 'Customize room aesthetics, audio/video configurations, and host controls'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl cursor-pointer transition-colors ${
              isHighContrast
                ? 'text-yellow-400 hover:bg-zinc-900 border border-yellow-400/50'
                : isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl border border-current/15 shrink-0 bg-current/5">
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            id="tab-theme-selector"
            className={`flex-1 py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'theme' ? tabActiveBg : tabInactiveBg
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span className="font-bold">{lang === 'te' ? 'UI థీమ్ స్కిన్స్' : 'UI Theme Skins'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio_video')}
            id="tab-audio-video"
            className={`flex-1 py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'audio_video' ? tabActiveBg : tabInactiveBg
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span className="font-bold">{lang === 'te' ? 'ఆడియో & వీడియో' : 'Audio & Video'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            id="tab-room-preferences"
            className={`flex-1 py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'general' ? tabActiveBg : tabInactiveBg
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span className="font-bold">{lang === 'te' ? 'రూమ్ నియంత్రణలు' : 'Host Preferences'}</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 space-y-4">
          {/* TAB 1: UI THEME SKINS SELECTOR */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <span>{lang === 'te' ? 'మీటింగ్ ఇంటర్‌ఫేస్ థీమ్ స్కిన్ ఎంచుకోండి' : 'Select Meeting UI Skin'}</span>
                  </h4>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : isHighContrast ? 'text-zinc-300' : 'text-slate-400'}`}>
                    {lang === 'te'
                      ? 'హోస్ట్ ఎంచుకున్న థీమ్ మొత్తం మీటింగ్ విజువల్స్, వీడియో గ్రిడ్ మరియు కంట్రోల్ బార్‌పై వర్తిస్తుంది.'
                      : 'Switch the complete visual aesthetic of video tiles, top bars, docks, and side panels.'}
                  </p>
                </div>

                {/* Quick 1-Click Current Theme Indicator */}
                <div
                  className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    isHighContrast
                      ? 'bg-black text-yellow-400 border-yellow-400'
                      : isLight
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-800 text-cyan-300 border-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Active: {meetingTheme.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>

              {/* 3 Theme Skin Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {MEETING_THEME_OPTIONS.map((themeOption) => {
                  const isSelected = meetingTheme === themeOption.id;

                  return (
                    <div
                      key={themeOption.id}
                      onClick={() => onThemeChange(themeOption.id)}
                      className={`rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer relative text-left border-2 ${
                        isSelected
                          ? isHighContrast
                            ? 'bg-zinc-950 border-yellow-400 ring-2 ring-yellow-400/50 shadow-xl'
                            : isLight
                            ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/30 shadow-lg'
                            : 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-500/10'
                          : isHighContrast
                          ? 'bg-black border-zinc-800 hover:border-yellow-400/70'
                          : isLight
                          ? 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Selection Radio / Badge */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                              isSelected
                                ? isHighContrast
                                  ? 'bg-yellow-400 text-black border-yellow-400'
                                  : isLight
                                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                                : isHighContrast
                                ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                                : isLight
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            {lang === 'te' ? themeOption.badgeTe : themeOption.badge}
                          </span>

                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected
                                ? isHighContrast
                                  ? 'bg-yellow-400 border-yellow-400 text-black'
                                  : isLight
                                  ? 'bg-indigo-600 border-indigo-600 text-white'
                                  : 'bg-cyan-500 border-cyan-500 text-slate-950 font-bold'
                                : 'border-slate-600 bg-transparent'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Theme Mockup Visual Preview Box */}
                        <div
                          className="w-full h-24 rounded-xl p-2 flex flex-col justify-between border shadow-inner relative overflow-hidden transition-transform hover:scale-[1.02]"
                          style={{
                            backgroundColor: themeOption.bgHex,
                            borderColor: isSelected ? themeOption.accentHex : themeOption.borderHex,
                          }}
                        >
                          {/* Mini Header simulation */}
                          <div
                            className="h-4 rounded-md px-2 flex items-center justify-between text-[8px] font-bold border shrink-0"
                            style={{
                              backgroundColor: themeOption.surfaceHex,
                              borderColor: themeOption.borderHex,
                              color: themeOption.id === 'minimalist_light' ? '#0f172a' : '#ffffff',
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: themeOption.accentHex }}
                              />
                              <span className="truncate">HealthSec Meet</span>
                            </div>
                            <span className="font-mono text-[7px] opacity-80">04:18</span>
                          </div>

                          {/* Mini Video Grid: 2 Tiles simulation */}
                          <div className="flex-1 grid grid-cols-2 gap-1.5 my-1">
                            {/* Tile 1: Host */}
                            <div
                              className="rounded-lg p-1 flex flex-col justify-between border text-[7px]"
                              style={{
                                backgroundColor: themeOption.surfaceHex,
                                borderColor: themeOption.accentHex,
                                color: themeOption.id === 'minimalist_light' ? '#0f172a' : '#ffffff',
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold truncate">Host (You)</span>
                                <span
                                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                                  style={{ backgroundColor: themeOption.accentHex }}
                                />
                              </div>
                              <div className="flex items-center space-x-0.5 opacity-75">
                                <Mic className="w-2 h-2" />
                                <Video className="w-2 h-2" />
                              </div>
                            </div>

                            {/* Tile 2: Peer */}
                            <div
                              className="rounded-lg p-1 flex flex-col justify-between border text-[7px]"
                              style={{
                                backgroundColor: themeOption.surfaceHex,
                                borderColor: themeOption.borderHex,
                                color: themeOption.id === 'minimalist_light' ? '#0f172a' : '#ffffff',
                              }}
                            >
                              <span className="font-bold truncate">Teammate</span>
                              <div className="flex items-center space-x-0.5 opacity-75">
                                <Mic className="w-2 h-2" />
                              </div>
                            </div>
                          </div>

                          {/* Mini Dock simulation */}
                          <div
                            className="h-3 rounded-md px-1.5 flex items-center justify-center space-x-1 border shrink-0"
                            style={{
                              backgroundColor: themeOption.surfaceHex,
                              borderColor: themeOption.borderHex,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: themeOption.accentHex }}
                            />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h5 className="font-bold text-sm flex items-center gap-1.5">
                            {themeOption.id === 'dark_modern' ? (
                              <Moon className="w-4 h-4 text-cyan-400" />
                            ) : themeOption.id === 'minimalist_light' ? (
                              <Sun className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Contrast className="w-4 h-4 text-yellow-400" />
                            )}
                            <span>{lang === 'te' ? themeOption.nameTe : themeOption.name}</span>
                          </h5>
                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              isLight ? 'text-slate-600' : isHighContrast ? 'text-zinc-300' : 'text-slate-400'
                            }`}
                          >
                            {lang === 'te' ? themeOption.descriptionTe : themeOption.description}
                          </p>
                        </div>

                        {/* Color Swatches */}
                        <div className="space-y-1 pt-1 border-t border-current/10">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider block ${
                              isLight ? 'text-slate-500' : isHighContrast ? 'text-zinc-400' : 'text-slate-500'
                            }`}
                          >
                            Palette Swatches:
                          </span>
                          <div className="flex items-center space-x-1.5">
                            {themeOption.swatches.map((swatch, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md border border-slate-700/50 bg-current/5 text-[9px] font-mono"
                                title={`${swatch.label}: ${swatch.color}`}
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
                                  style={{ backgroundColor: swatch.color }}
                                />
                                <span className="opacity-80">{swatch.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Feature Bullets */}
                        <ul className="space-y-1 text-[11px] pt-1">
                          {(lang === 'te' ? themeOption.featuresTe : themeOption.features).map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start space-x-1.5 opacity-90">
                              <CheckCircle2
                                className="w-3 h-3 shrink-0 mt-0.5"
                                style={{ color: themeOption.accentHex }}
                              />
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onThemeChange(themeOption.id);
                        }}
                        className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                          isSelected
                            ? isHighContrast
                              ? 'bg-yellow-400 text-black font-black shadow-md'
                              : isLight
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-cyan-500 text-slate-950 shadow-md font-black'
                            : isHighContrast
                            ? 'bg-zinc-900 hover:bg-zinc-800 text-yellow-400 border border-yellow-400/50'
                            : isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{lang === 'te' ? 'ప్రస్తుత థీమ్ (Active)' : 'Active Theme'}</span>
                          </>
                        ) : (
                          <span>{lang === 'te' ? 'ఈ థీమ్‌కి మారండి' : `Apply ${themeOption.name}`}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO & VIDEO SETTINGS */}
          {activeTab === 'audio_video' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className={`p-4 rounded-2xl space-y-3.5 ${subPanelClass}`}>
                <div className="flex items-center space-x-2 border-b border-current/15 pb-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm">
                    {lang === 'te' ? 'కెమెరా & వీడియో రిజల్యూషన్' : 'Camera & Video Stream Quality'}
                  </h4>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider block opacity-80">
                    {lang === 'te' ? 'వీడియో ప్రసార రిజల్యూషన్' : 'Outbound Camera Resolution'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '1080p', label: '1080p FHD @ 60fps', desc: 'Crisp Studio Clarity' },
                      { id: '720p', label: '720p HD @ 30fps', desc: 'Standard Balanced' },
                      { id: '480p', label: '480p SD Eco', desc: 'Low Bandwidth Mode' },
                    ].map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => setCameraResolution(res.id as '1080p' | '720p' | '480p')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          cameraResolution === res.id
                            ? isHighContrast
                              ? 'bg-yellow-400 text-black border-yellow-400 font-bold'
                              : isLight
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold'
                              : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                            : isHighContrast
                            ? 'bg-black border-zinc-800 text-zinc-300'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-700'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-xs">{res.label}</div>
                        <div className="text-[10px] opacity-75">{res.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl space-y-3.5 ${subPanelClass}`}>
                <div className="flex items-center space-x-2 border-b border-current/15 pb-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-sm">
                    {lang === 'te' ? 'ఆడియో ప్రాసెసింగ్ & శబ్దం నివారణ' : 'Microphone Processing & Noise Filters'}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs">
                        {lang === 'te' ? 'AI బ్యాక్‌గ్రౌండ్ నాయిస్ సప్రెషన్' : 'AI DeepFilter Noise Suppression'}
                      </div>
                      <p className="text-[11px] opacity-70">
                        {lang === 'te' ? 'కీబోర్డ్ శబ్దాలు మరియు ఫ్యాన్ హమ్ తగ్గిస్తుంది' : 'Filters typing clicks, air conditioning, and ambient office noise.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNoiseSuppressionEnabled(!noiseSuppressionEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        noiseSuppressionEnabled
                          ? isHighContrast
                            ? 'bg-yellow-400'
                            : 'bg-emerald-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                          isHighContrast && noiseSuppressionEnabled ? 'bg-black' : 'bg-white'
                        } ${noiseSuppressionEnabled ? 'right-0.5' : 'left-0.5'}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-current/10 pt-2.5">
                    <div>
                      <div className="font-bold text-xs">
                        {lang === 'te' ? 'అకౌస్టిక్ ఎకో క్యాన్సిలేషన్' : 'Acoustic Echo Cancellation (AEC)'}
                      </div>
                      <p className="text-[11px] opacity-70">
                        {lang === 'te' ? 'లౌడ్‌స్పీకర్ మైక్రోఫోన్ ఫీడ్‌బ్యాక్ నివారిస్తుంది' : 'Prevents speaker feedback loops during group discussions.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEchoCancellationEnabled(!echoCancellationEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        echoCancellationEnabled
                          ? isHighContrast
                            ? 'bg-yellow-400'
                            : 'bg-emerald-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                          isHighContrast && echoCancellationEnabled ? 'bg-black' : 'bg-white'
                        } ${echoCancellationEnabled ? 'right-0.5' : 'left-0.5'}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOM PREFERENCES & HOST CONTROLS */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className={`p-4 rounded-2xl space-y-3.5 ${subPanelClass}`}>
                <div className="flex items-center space-x-2 border-b border-current/15 pb-2">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-sm">
                    {lang === 'te' ? 'హోస్ట్ రూమ్ సెట్టింగ్స్ & పాలసీలు' : 'Room Security & Entry Policies'}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Subtitles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{lang === 'te' ? 'లైవ్ AI సబ్‌టైటిల్స్ (Captions)' : 'Live AI Closed Captions'}</span>
                      </div>
                      <p className="text-[11px] opacity-70">
                        {lang === 'te' ? 'మీటింగ్‌లో మాట్లాడే మాటలను స్వయంచాలకంగా స్క్రీన్‌పై చూపిస్తుంది' : 'Transcribes real-time speech during meetings.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCaptions(!showCaptions)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        showCaptions
                          ? isHighContrast
                            ? 'bg-yellow-400'
                            : 'bg-cyan-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                          isHighContrast && showCaptions ? 'bg-black' : 'bg-white'
                        } ${showCaptions ? 'right-0.5' : 'left-0.5'}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-current/10 pt-2.5">
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'te' ? 'జాయిన్ అయినప్పుడు మ్యూట్ చేయండి (Mute on Entry)' : 'Mute Participants on Entry'}</span>
                      </div>
                      <p className="text-[11px] opacity-70">
                        {lang === 'te' ? 'కొత్త సభ్యులు రూమ్‌లోకి వచ్చినప్పుడు మైక్రోఫోన్ ఆటో-మ్యూట్ అవుతుంది' : 'Ensures new attendees enter with muted microphones.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMuteOnEntryPolicy(!muteOnEntryPolicy)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        muteOnEntryPolicy
                          ? isHighContrast
                            ? 'bg-yellow-400'
                            : 'bg-amber-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                          isHighContrast && muteOnEntryPolicy ? 'bg-black' : 'bg-white'
                        } ${muteOnEntryPolicy ? 'right-0.5' : 'left-0.5'}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-current/10 pt-2.5">
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <CircleDot className="w-3.5 h-3.5 text-rose-400" />
                        <span>{lang === 'te' ? 'స్వయంచాలక రికార్డింగ్ (Auto-Record)' : 'Auto-Record Meeting on Start'}</span>
                      </div>
                      <p className="text-[11px] opacity-70">
                        {lang === 'te' ? 'మీటింగ్ ప్రారంభం కాగానే AI మినిట్స్ రికార్డింగ్ మొదలవుతుంది' : 'Automatically begins tracking minutes and code snippets.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoRecordOnStart(!autoRecordOnStart)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        autoRecordOnStart
                          ? isHighContrast
                            ? 'bg-yellow-400'
                            : 'bg-rose-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                          isHighContrast && autoRecordOnStart ? 'bg-black' : 'bg-white'
                        } ${autoRecordOnStart ? 'right-0.5' : 'left-0.5'}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Identifier Box */}
              <div className={`p-4 rounded-2xl flex items-center justify-between ${subPanelClass}`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 block">
                    {lang === 'te' ? 'రూమ్ వివరాలు' : 'Live Room Credentials'}
                  </span>
                  <div className="font-mono text-xs font-bold mt-0.5">
                    Room: <strong className="text-emerald-400">{meetingRoomId}</strong>
                    {passcode && <span> • PIN: <strong className="text-amber-400">{passcode}</strong></span>}
                  </div>
                </div>
                <div className="text-[11px] opacity-80">
                  Host: <strong className="underline">{user.name || (user.email ? user.email.split('@')[0] : 'Meeting Host')}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-current/15 shrink-0">
          <div className="text-xs opacity-75 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {lang === 'te'
                ? 'థీమ్ ప్రాధాన్యత మీ బ్రౌజర్‌లో సేవ్ చేయబడింది'
                : 'Theme preference saved automatically to local storage'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isHighContrast
                ? 'bg-yellow-400 text-black font-black hover:bg-yellow-300'
                : isLight
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
            }`}
          >
            {lang === 'te' ? 'పూర్తయింది (Done)' : 'Done & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
