import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ExternalLink,
  Tag,
  Server,
  Globe,
  Flame,
  Zap,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Gift,
  Clock,
} from 'lucide-react';
import { Language } from '../types';
import { AFFILIATE_LINKS, HOSTING_AFFILIATE_OPTIONS } from '../data/affiliateLinks';

export interface GoogleAdSlotProps {
  slotId?: string;
  slotType?: string;
  adClient?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed' | 'leaderboard' | 'banner';
  bannerPreset?: 'hostinger-france' | 'hostinger-germany' | 'hostinger-ext' | 'godaddy' | 'auto-rotate';
  lang?: Language;
  className?: string;
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  slotId = '1234567890',
  slotType = 'horizontal',
  adClient = 'ca-pub-7081584031410000',
  format = 'horizontal',
  bannerPreset = 'auto-rotate',
  lang = 'te',
  className = '',
}) => {
  const isTe = lang === 'te';
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const banners = [
    {
      id: 'hostinger-france-728',
      type: 'hostinger-fr',
      brand: 'Hostinger France',
      flag: '🇫🇷',
      badge: isTe ? '75% తగ్గింపు ఆఫర్' : '75% OFF + Domaine Gratuit',
      badgeColor: 'from-amber-400 to-orange-500 text-slate-950',
      title: isTe
        ? 'Hostinger France: సూపర్-ఫాస్ట్ లైట్‌స్పీడ్ వెబ్ హోస్టింగ్ + ఫ్రీ డొమైన్'
        : 'Hostinger France: Hébergement Web Haute Performance + Domaine Offert',
      subtitle: isTe
        ? 'FR 728x90f అఫీషియల్ బ్యానర్ (13631420) • 99.9% అప్‌టైమ్ • ఉచిత SSL'
        : 'Official 728x90 Banner (13631420) • NVMe Ultra Rapide • Support 24/7',
      price: '€2.89 / mo',
      ctaText: isTe ? 'ఫ్రాన్స్ డీల్ పొందండి' : "Profiter de l'offre (75% OFF)",
      url: AFFILIATE_LINKS.hostingerFranceBanner728x90,
      gradient: 'from-indigo-950 via-purple-950/90 to-slate-900 border-indigo-500/40 hover:border-indigo-400',
      buttonGradient: 'from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500',
      icon: Server,
      iconBg: 'bg-indigo-600',
      trackingRef: 'FR 728x90f (13631420 / 13690177)',
    },
    {
      id: 'hostinger-germany-728',
      type: 'hostinger-de',
      brand: 'Hostinger Germany',
      flag: '🇩🇪',
      badge: isTe ? '75% డిస్కౌంట్ డీల్' : '75% Rabatt + Gratis Domain',
      badgeColor: 'from-emerald-400 to-teal-500 text-slate-950',
      title: isTe
        ? 'Hostinger Germany: అల్ట్రా-ఫాస్ట్ క్లౌడ్ & వర్డ్‌ప్రెస్ హోస్టింగ్'
        : 'Hostinger Deutschland: Turbo Webhosting & Cloud Server für Profis',
      subtitle: isTe
        ? 'జర్మనీ లీడర్‌బోర్డ్ బ్యానర్ (13695204) • 30-రోజుల మనీ-బ్యాక్ గ్యారెంటీ'
        : 'Germany Official Banner (13695204) • 30 Tage Geld-zurück-Garantie',
      price: '€2.99 / mo',
      ctaText: isTe ? 'జర్మనీ ఆఫర్ పొందండి' : 'Jetzt 75% Sparen',
      url: AFFILIATE_LINKS.hostingerGermanyMain,
      gradient: 'from-blue-950 via-slate-900 to-indigo-950 border-blue-500/40 hover:border-blue-400',
      buttonGradient: 'from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
      icon: Zap,
      iconBg: 'bg-blue-600',
      trackingRef: 'Hostinger Germany (Text 13695204)',
    },
    {
      id: 'hostinger-ext-728',
      type: 'hostinger-ext',
      brand: 'Hostinger Extensions',
      flag: '🌐',
      badge: isTe ? '80% వరకు సేవ్ చేయండి' : 'Bis zu 80% auf Domains & VPS',
      badgeColor: 'from-purple-400 to-pink-500 text-slate-950',
      title: isTe
        ? 'Hostinger Extensions Germany: .DE, .COM, .ORG డొమైన్స్ & హోస్టింగ్'
        : 'Hostinger Extensions: Günstige Domains, VPS & Cloud Erweiterungen',
      subtitle: isTe
        ? 'Extensions Germany బ్యానర్ (14344621) • తక్షణ ఆక్టివేషన్ • DNSSEC'
        : 'Extensions Germany (14344621) • Schnelle Bereitstellung • Gratis DNS',
      price: '€1.99 / mo',
      ctaText: isTe ? 'ఎక్స్‌టెన్షన్స్ డీల్' : 'Domains Sichern',
      url: AFFILIATE_LINKS.hostingerGermanyExtensions,
      gradient: 'from-purple-950 via-slate-900 to-fuchsia-950 border-purple-500/40 hover:border-purple-400',
      buttonGradient: 'from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500',
      icon: Gift,
      iconBg: 'bg-purple-600',
      trackingRef: 'Extensions Germany (Text 14344621)',
    },
    {
      id: 'godaddy-website-builder-728',
      type: 'godaddy',
      brand: 'GoDaddy Website Builder',
      flag: '🚀',
      badge: isTe ? 'GoDaddy వెబ్‌సైట్ బిల్డర్ ఆఫర్' : 'GoDaddy Website Builder',
      badgeColor: 'from-emerald-400 to-teal-400 text-slate-950',
      title: isTe
        ? 'GoDaddy Website Builder: నిమిషాల్లో ప్రొఫెషనల్ వెబ్‌సైట్ + ఉచిత AI టూల్స్'
        : 'GoDaddy Website Builder: Build Professional AI Websites in Minutes',
      subtitle: isTe
        ? 'అఫీషియల్ GoDaddy బిల్డర్ ఆఫర్ (isc=cjcfos1) • రెస్పాన్సివ్ డిజైన్ • ఉచిత SSL & హోస్టింగ్'
        : 'Official Partner Deal (isc=cjcfos1) • Responsive Mobile Design • Free SSL & Domain Hosting',
      price: isTe ? 'ఉచితంగా ప్రారంభించండి' : 'Start for Free',
      ctaText: isTe ? 'వెబ్‌సైట్ ప్రారంభించండి' : 'Try Website Builder Free',
      url: AFFILIATE_LINKS.godaddyWebsiteBuilder,
      gradient: 'from-teal-950 via-slate-900 to-emerald-950 border-teal-500/40 hover:border-teal-400',
      buttonGradient: 'from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500',
      icon: Globe,
      iconBg: 'bg-teal-600',
      trackingRef: 'GoDaddy Website Builder (isc=cjcfos1)',
    },
  ];

  // Auto-rotate banners every 5 seconds if not hovered
  useEffect(() => {
    if (bannerPreset !== 'auto-rotate' || isHovered) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [bannerPreset, isHovered, banners.length]);

  const currentBanner = banners[activeBannerIndex];
  const IconComponent = currentBanner.icon;

  return (
    <div
      id={`banner-ad-container-${slotId}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl bg-slate-900/90 border-2 shadow-2xl transition-all duration-300 my-6 max-w-5xl mx-auto backdrop-blur-md ${currentBanner.gradient} ${className}`}
    >
      {/* Top Banner Control Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 text-[10px] sm:text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 font-bold text-amber-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{isTe ? 'స్పాన్సర్డ్ స్పెషల్ ఆఫర్ / SPONSORED BANNER' : 'SPONSORED PARTNER BANNER'}</span>
          </span>
          <span className="hidden sm:inline-block text-slate-500">•</span>
          <span className="hidden sm:inline-block font-mono text-slate-400">
            {currentBanner.trackingRef}
          </span>
        </div>

        {/* Banner Switcher Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {banners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveBannerIndex(idx)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                activeBannerIndex === idx
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs scale-105'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={b.brand}
            >
              <span className="mr-0.5">{b.flag}</span>
              <span className="hidden md:inline">{b.brand.split(' ')[1] || b.brand}</span>
            </button>
          ))}
          <a
            href={currentBanner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-0.5 text-slate-400 hover:text-white ml-2 cursor-pointer"
            title="Ad Choices & Verified Partner Info"
          >
            <span className="text-[10px]">Ad</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main 728x90 Style Banner Body */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Left Side: Brand Logo & Offer Description */}
        <div className="flex items-center space-x-4 min-w-0 z-10 w-full md:w-auto">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${currentBanner.iconBg} text-white flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-indigo-600/30 border border-white/20`}
          >
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-white text-base sm:text-lg tracking-tight">
                {currentBanner.brand}
              </span>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-gradient-to-r ${currentBanner.badgeColor} shadow-xs`}
              >
                {currentBanner.badge}
              </span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md hidden lg:inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{isTe ? 'పరిమిత కాల ఆఫర్' : 'Limited Time'}</span>
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-200 leading-snug line-clamp-1">
              {currentBanner.title}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              {currentBanner.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Pricing & 1-Click Action Button */}
        <div className="flex items-center justify-between md:justify-end space-x-3 sm:space-x-4 w-full md:w-auto shrink-0 z-10 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 block font-medium">
              {isTe ? 'ప్రారంభ ధర' : 'Starting at'}
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
              {currentBanner.price}
            </span>
          </div>

          <motion.a
            href={currentBanner.url}
            target="_blank"
            rel="noopener noreferrer"
            id={`btn-banner-click-${currentBanner.id}`}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.65), 0 0 10px rgba(99, 102, 241, 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`inline-flex items-center justify-center space-x-2 bg-gradient-to-r ${currentBanner.buttonGradient} text-white font-black py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer border border-white/30 shrink-0 group relative overflow-hidden`}
          >
            {/* Shimmer line */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none"
            />
            <span>{currentBanner.ctaText}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>
      </div>

      {/* Hidden Live AdSense Tag for future production automatic fulfillment */}
      <ins
        className="adsbygoogle"
        style={{ display: 'none' }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
