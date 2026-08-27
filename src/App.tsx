import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroScanner } from './components/HeroScanner';
import { AuditQueuePanel } from './components/AuditQueuePanel';
import { HealthOverviewCard } from './components/HealthOverviewCard';
import { GlobalAuditStats } from './components/GlobalAuditStats';
import { GoogleAdSlot } from './components/GoogleAdSlot';
import { CategoryDetailTabs } from './components/CategoryDetailTabs';
import { FixCodeModal } from './components/FixCodeModal';
import { AutoFixTicketModal } from './components/AutoFixTicketModal';
import { RemediationPricingModal } from './components/RemediationPricingModal';
import { ReferralModal } from './components/ReferralModal';
import { HistoryAndTicketsDrawer } from './components/HistoryAndTicketsDrawer';
import { PdfExportModal } from './components/PdfExportModal';
import { AuditComparisonModal } from './components/AuditComparisonModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SeoStructuredSections } from './components/SeoStructuredSections';
import { SeoLandingHub, SEO_LANDING_PAGES } from './components/SeoLandingHub';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { RatingFeedbackModal } from './components/RatingFeedbackModal';
import { AdSenseApprovalKitModal } from './components/AdSenseApprovalKitModal';
import { DeepWebsiteCrawlerModal } from './components/DeepWebsiteCrawlerModal';
import { AiGeoAuditModal } from './components/AiGeoAuditModal';
import { WebsiteMonitoringModal } from './components/WebsiteMonitoringModal';
import { CompetitorIntelligenceModal } from './components/CompetitorIntelligenceModal';
import { DeveloperFixCenterModal } from './components/DeveloperFixCenterModal';
import { AgencyWhiteLabelModal } from './components/AgencyWhiteLabelModal';
import { InternationalSeoModal } from './components/InternationalSeoModal';
import { FixAndRescanModal } from './components/FixAndRescanModal';
import { SeoGrowthToolsBar } from './components/SeoGrowthToolsBar';
import { GlobalLatencyModal } from './components/GlobalLatencyModal';
import { GitHubAutoFixModal } from './components/GitHubAutoFixModal';
import { CrUXHistoryModal } from './components/CrUXHistoryModal';
import { OwaspSecurityScannerModal } from './components/OwaspSecurityScannerModal';
import { MultiChannelAlertsModal } from './components/MultiChannelAlertsModal';
import { TeamWorkspaceModal } from './components/TeamWorkspaceModal';
import { DeveloperApiMarketplaceModal } from './components/DeveloperApiMarketplaceModal';
import { ApiDocumentationModal } from './components/ApiDocumentationModal';
import { ApiStatusPageModal } from './components/ApiStatusPageModal';
import { LiveBrowserVideoScanner } from './components/LiveBrowserVideoScanner';
import { JoinMeetingSection } from './components/JoinMeetingSection';
import { TeamGoogleMeetRoom } from './components/TeamGoogleMeetRoom';
import { CreateLiveMeetingModal } from './components/CreateLiveMeetingModal';
import { LiveMeetingHubModal } from './components/LiveMeetingHubModal';
import { CollapsibleSidePanels } from './components/CollapsibleSidePanels';
import { Footer } from './components/Footer';
import { LegalAndContactModals, LegalModalType } from './components/LegalAndContactModals';
import { WorldBestAiEngineModal } from './components/WorldBestAiEngineModal';
import { ActivityFeed } from './components/ActivityFeed';
import { FullAuditReport, Language, AuditMetric, ClientTicket, UserAccount, AuditQueueItem, PricingPlanId, RemediationExecutionResult, UserReview, AuditTargetModule } from './types';
import { generateAuditReport, runLiveAudit } from './data/auditEngine';
import { translations } from './data/translations';
import confetti from 'canvas-confetti';
import { Shield, ShieldCheck, Sparkles, CheckCircle2, Heart, Award, ArrowUp, Globe, Search, Lock, Zap, Eye, FileCode, Check, ChevronDown, ChevronUp, Layers, BookOpen, ArrowLeft, ExternalLink, ArrowRight, RefreshCw, Activity, CheckCircle, Gift, X, LogIn } from 'lucide-react';
import { auth, db, onAuthStateChanged, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp, signOut } from './lib/firebase';
import { presenceService } from './lib/presenceService';

const GUEST_USER: UserAccount = {
  name: '',
  email: '',
  credits: 5,
  referralCode: '',
  isLoggedIn: false,
  referralCount: 0,
  unlockedWebsites: [],
};

const getInitialUser = (): UserAccount => {
  try {
    const saved = localStorage.getItem('website_health_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.isLoggedIn) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Initial user load note:', e);
  }
  return GUEST_USER;
};

export default function App() {
  const [lang, setLang] = useState<Language>('en'); // Defaults to English as requested
  const [activeSeoLanding, setActiveSeoLanding] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isScanningBulk, setIsScanningBulk] = useState<boolean>(false);
  const [queue, setQueue] = useState<AuditQueueItem[]>([]);
  const [activeReport, setActiveReport] = useState<FullAuditReport | null>(null);
  const [history, setHistory] = useState<FullAuditReport[]>([]);
  const [tickets, setTickets] = useState<ClientTicket[]>([]);
  const [selectedFixMetric, setSelectedFixMetric] = useState<AuditMetric | null>(null);
  const [isAutoFixOpen, setIsAutoFixOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [pricingPlanSelection, setPricingPlanSelection] = useState<PricingPlanId>('pro');
  const [isReferralOpen, setIsReferralOpen] = useState<boolean>(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSeoDirectoryExpanded, setIsSeoDirectoryExpanded] = useState<boolean>(false);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  const [isAdSenseKitOpen, setIsAdSenseKitOpen] = useState<boolean>(false);
  const [isDeepCrawlerOpen, setIsDeepCrawlerOpen] = useState<boolean>(false);
  const [isAiGeoModalOpen, setIsAiGeoModalOpen] = useState<boolean>(false);
  const [isMonitoringModalOpen, setIsMonitoringModalOpen] = useState<boolean>(false);
  const [isCompetitorOpen, setIsCompetitorOpen] = useState<boolean>(false);
  const [isDevCenterOpen, setIsDevCenterOpen] = useState<boolean>(false);
  const [isIntlSeoOpen, setIsIntlSeoOpen] = useState<boolean>(false);
  const [isAgencyOpen, setIsAgencyOpen] = useState<boolean>(false);
  const [isFixAndRescanOpen, setIsFixAndRescanOpen] = useState<boolean>(false);
  const [isGlobalLatencyOpen, setIsGlobalLatencyOpen] = useState<boolean>(false);
  const [isGitHubAutoFixOpen, setIsGitHubAutoFixOpen] = useState<boolean>(false);
  const [isCrUXHistoryOpen, setIsCrUXHistoryOpen] = useState<boolean>(false);
  const [isOwaspSecurityOpen, setIsOwaspSecurityOpen] = useState<boolean>(false);
  const [isMultiChannelAlertsOpen, setIsMultiChannelAlertsOpen] = useState<boolean>(false);
  const [isTeamWorkspaceOpen, setIsTeamWorkspaceOpen] = useState<boolean>(false);
  const [isMeetRoomOpen, setIsMeetRoomOpen] = useState<boolean>(false);
  const [isLiveMeetHubOpen, setIsLiveMeetHubOpen] = useState<boolean>(false);
  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState<boolean>(false);
  const [activeMeetingRoomId, setActiveMeetingRoomId] = useState<string>('whs-war-room');
  const [activeMeetingRoomTitle, setActiveMeetingRoomTitle] = useState<string>('HealthSec Security War Room');
  const [activeMeetingPasscode, setActiveMeetingPasscode] = useState<string>('');
  const [isDeveloperApiOpen, setIsDeveloperApiOpen] = useState<boolean>(false);
  const [isApiDocsModalOpen, setIsApiDocsModalOpen] = useState<boolean>(false);
  const [isStatusPageOpen, setIsStatusPageOpen] = useState<boolean>(false);
  const [isLiveScanModalOpen, setIsLiveScanModalOpen] = useState<boolean>(false);
  const [liveScanningUrl, setLiveScanningUrl] = useState<string>('');
  const [pendingReport, setPendingReport] = useState<FullAuditReport | null>(null);
  const [selectedAuditModule, setSelectedAuditModule] = useState<AuditTargetModule>('all');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('performance');
  const [newlySubmittedReview, setNewlySubmittedReview] = useState<UserReview | null>(null);
  const [invitedReferralCode, setInvitedReferralCode] = useState<string>('');
  const [isReferralBannerDismissed, setIsReferralBannerDismissed] = useState<boolean>(false);
  const [isWorldsBestEngineOpen, setIsWorldsBestEngineOpen] = useState<boolean>(false);
  const [pendingAuthReason, setPendingAuthReason] = useState<'referral' | 'general' | null>(null);

  // Permanent Dark Mode initialization
  useEffect(() => {
    try {
      localStorage.setItem('website_health_theme', 'dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200';
    } catch (e) {
      console.warn('Dark mode init note:', e);
    }
  }, []);

  const [user, setUser] = useState<UserAccount>(getInitialUser);

  const t = translations[lang];

  // Initialize real-time global user presence service
  useEffect(() => {
    presenceService.init(user);
    return () => {
      // Don't fully destroy to preserve background listeners across renders
    };
  }, []);

  // Update presence session when user authentication state changes
  useEffect(() => {
    presenceService.updateUser(user);
  }, [user]);

  // Real-time Firebase Auth state change & Firestore 'users' collection sync listener
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);

        // Ensure user document exists in 'users' collection or upsert Google profile details
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const initialUserData = {
              userId: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google User',
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || '',
              credits: 10,
              referralCode: (fbUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') + '789',
              authProvider: fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'firebase',
              role: 'Member',
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              lastSyncedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialUserData, { merge: true });
          } else {
            // Update lastLoginAt and sync Google photo/name if newly available
            const patch: Record<string, any> = {
              lastLoginAt: serverTimestamp(),
              lastSyncedAt: new Date().toISOString(),
            };
            if (fbUser.photoURL && !userDoc.data()?.photoURL) {
              patch.photoURL = fbUser.photoURL;
            }
            if (fbUser.displayName && !userDoc.data()?.name) {
              patch.name = fbUser.displayName;
            }
            await setDoc(userDocRef, patch, { merge: true });
          }
        } catch (e) {
          console.warn('Firebase user doc initialization note:', e);
        }

        // Attach Real-Time onSnapshot listener to the 'users/{uid}' document
        unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const authedUser: UserAccount = {
              name: data.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: data.email || fbUser.email || 'user@example.com',
              photoURL: data.photoURL || fbUser.photoURL || undefined,
              credits: typeof data.credits === 'number' ? data.credits : 10,
              referralCode: data.referralCode || (fbUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') + '789',
              referralCount: typeof data.referralCount === 'number' ? data.referralCount : 0,
              unlockedWebsites: Array.isArray(data.unlockedWebsites) ? data.unlockedWebsites : [],
              isLoggedIn: true,
              role: data.role || 'Member',
              userId: fbUser.uid,
              uid: fbUser.uid,
              authProvider: data.authProvider || (fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'firebase'),
              apiKey: data.apiKey,
              apiKeyName: data.apiKeyName,
              apiKeyCreatedAt: data.apiKeyCreatedAt,
              apiKeyStatus: data.apiKeyStatus,
              apiTier: data.apiTier,
              apiWalletBalance: data.apiWalletBalance,
              apiUsage: data.apiUsage,
              apiKeysList: data.apiKeysList,
              currentApiTier: data.currentApiTier,
              apiCreditsRemaining: data.apiCreditsRemaining,
              lastSyncedAt: new Date().toISOString(),
              isFirebaseSynced: true,
            };
            setUser(authedUser);
            try {
              localStorage.setItem('website_health_user', JSON.stringify(authedUser));
            } catch {}
          } else {
            const fallbackUser: UserAccount = {
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || undefined,
              credits: 10,
              referralCode: (fbUser.displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') + '789',
              referralCount: 0,
              unlockedWebsites: [],
              isLoggedIn: true,
              userId: fbUser.uid,
              uid: fbUser.uid,
              authProvider: fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'firebase',
              isFirebaseSynced: true,
              lastSyncedAt: new Date().toISOString(),
            };
            setUser(fallbackUser);
            try {
              localStorage.setItem('website_health_user', JSON.stringify(fallbackUser));
            } catch {}
          }
        }, (err) => {
          console.warn('Real-time users snapshot listener note:', err);
        });

      } else {
        // No Firebase user - check if we had a manual guest or saved session
        const saved = localStorage.getItem('website_health_user');
        if (!saved) {
          setUser(GUEST_USER);
        } else {
          try {
            const parsed = JSON.parse(saved);
            if (!parsed.isLoggedIn) {
              setUser(GUEST_USER);
            }
          } catch {
            setUser(GUEST_USER);
          }
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  // Clear development-stage test history and initialize live user audits cleanly
  useEffect(() => {
    try {
      // Purge legacy development test keys
      localStorage.removeItem('website_audit_history');
      localStorage.removeItem('whs_team_activity_feed');
      localStorage.removeItem('whs_audit_history');

      const savedLiveHistory = localStorage.getItem('website_health_live_history_v2');
      if (savedLiveHistory) {
        const parsed = JSON.parse(savedLiveHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      // ignore
    }

    try {
      const savedTickets = localStorage.getItem('website_client_tickets');
      if (savedTickets) {
        const parsedTickets = JSON.parse(savedTickets);
        if (Array.isArray(parsedTickets)) {
          setTickets(parsedTickets);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('website_health_live_history_v2');
      localStorage.removeItem('website_audit_history');
      localStorage.removeItem('whs_team_activity_feed');
    } catch {
      // ignore
    }
  };

  // Ensure page refresh always resets to top Home Page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prevent browser from restoring scrolled position on reload
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      // Reset URL hash to empty so refreshed page lands on Home
      if (window.location.hash) {
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch {}
      }

      // Scroll immediately to the top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

      // Clean before unload so subsequent refreshes stay on home
      const handleBeforeUnload = () => {
        if (window.location.hash) {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch {}
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  // Listen to hash changes for deep linking to SEO landing pages (e.g. #website-seo-checker)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && SEO_LANDING_PAGES[hash]) {
        setActiveSeoLanding(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash) {
        setActiveSeoLanding(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Deep link query parameter check for referral links (?ref=code, ?referral=code, ?r=code) and live meetings (?meet=...)
    const checkDeepLinks = () => {
      try {
        if (typeof window !== 'undefined' && window.location.search) {
          const searchParams = new URLSearchParams(window.location.search);

          // 1. Referral Deep Link Check
          const refParam =
            searchParams.get('ref') ||
            searchParams.get('referral') ||
            searchParams.get('r') ||
            searchParams.get('referrer');

          if (refParam) {
            const cleanRef = refParam.trim();
            setInvitedReferralCode(cleanRef);
            try {
              sessionStorage.setItem('pending_referral_code', cleanRef);
            } catch {}

            // If user is guest / not logged in, automatically trigger Auth Modal for sign up
            const saved = localStorage.getItem('website_health_user');
            let isAlreadyLoggedIn = false;
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (parsed?.isLoggedIn && parsed?.name) {
                  isAlreadyLoggedIn = true;
                }
              } catch {}
            }

            if (!isAlreadyLoggedIn) {
              setIsAuthOpen(true);
            }
          }

          // 2. Meeting Deep Link Check
          const meetRoom =
            searchParams.get('meet') ||
            searchParams.get('room') ||
            searchParams.get('meeting') ||
            searchParams.get('meetingId') ||
            searchParams.get('roomId') ||
            searchParams.get('code');
          const meetPin = searchParams.get('pin') || searchParams.get('passcode') || searchParams.get('pwd');
          const meetTitle = searchParams.get('title') || searchParams.get('topic');

          if (meetRoom) {
            setActiveMeetingRoomId(meetRoom);
            if (meetPin) {
              setActiveMeetingPasscode(meetPin);
            }
            if (meetTitle) {
              setActiveMeetingRoomTitle(decodeURIComponent(meetTitle));
            } else {
              setActiveMeetingRoomTitle(`HealthSec Live Meeting: ${meetRoom}`);
            }
            setIsMeetRoomOpen(true);
          }
        }
      } catch (e) {
        console.warn('Deep link check error:', e);
      }
    };

    checkDeepLinks();
    window.addEventListener('popstate', checkDeepLinks);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', checkDeepLinks);
    };
  }, []);

  const scrollToReport = () => {
    setTimeout(() => {
      const element = document.getElementById('report-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const navigateToSeoPage = (slug: string) => {
    if (SEO_LANDING_PAGES[slug]) {
      setActiveSeoLanding(slug);
      window.location.hash = slug;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToHome = () => {
    setActiveSeoLanding(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToReport = (report?: FullAuditReport) => {
    if (report) {
      setActiveReport(report);
    }
    setActiveSeoLanding(null);
    scrollToReport();
  };

  const handleScan = async (url: string, email?: string, optInWeekly?: boolean, targetModule?: AuditTargetModule) => {
    const targetUrl = url && url.trim() ? (url.startsWith('http') ? url : `https://${url}`) : 'https://example.com';
    const chosenModule: AuditTargetModule = targetModule || selectedAuditModule || 'all';
    setSelectedAuditModule(chosenModule);
    setIsScanning(true);
    setLiveScanningUrl(targetUrl);
    setIsLiveScanModalOpen(true);
    setActiveSeoLanding(null);

    try {
      // Execute Real Live Audit via backend in parallel with the live video simulation
      const newReportPromise = runLiveAudit(targetUrl, email, optInWeekly, chosenModule);
      
      newReportPromise.then((newReport) => {
        newReport.targetAuditModule = chosenModule;
        setPendingReport(newReport);
        
        setHistory(prev => {
          const filtered = prev.filter(r => r.url !== newReport.url);
          const updated = [newReport, ...filtered];
          try {
            localStorage.setItem('website_health_live_history_v2', JSON.stringify(updated.slice(0, 30)));
          } catch {
            // ignore
          }
          return updated;
        });

        // If user subscribed to weekly reports or provided email, dispatch registration
        if (email && email.includes('@')) {
          if (optInWeekly) {
            fetch('/api/subscribe-weekly', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, websiteUrl: newReport.url }),
            }).catch(console.warn);
          }

          fetch('/api/send-audit-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, report: newReport }),
          }).catch(console.warn);
        }
      }).catch((err) => {
        console.warn('Live audit fetch note, preparing fallback report:', err);
        const fallbackReport = generateAuditReport(targetUrl, email, optInWeekly, chosenModule);
        fallbackReport.targetAuditModule = chosenModule;
        setPendingReport(fallbackReport);
      });
    } catch (err) {
      console.warn('Scan start note:', err);
      const fallbackReport = generateAuditReport(targetUrl, email, optInWeekly, chosenModule);
      fallbackReport.targetAuditModule = chosenModule;
      setPendingReport(fallbackReport);
    }
  };

  const handleLiveScanComplete = () => {
    setIsLiveScanModalOpen(false);
    setIsScanning(false);
    
    // Switch to active report and scroll to report section
    const reportToUse = pendingReport || generateAuditReport(liveScanningUrl || 'https://example.com', undefined, false, selectedAuditModule);
    reportToUse.targetAuditModule = selectedAuditModule;

    // Check if this website is already unlocked via referral credit or subscription
    const isUnlocked = Boolean(
      user.isProUser ||
      (user.unlockedWebsites || []).some(
        (u) => u === reportToUse.url || reportToUse.url.includes(u) || u.includes(reportToUse.url)
      )
    );
    if (isUnlocked) {
      reportToUse.isPaidUnlocked = true;
    }

    // Automatically align category tab to the focused module to eliminate any confusion
    if (selectedAuditModule && selectedAuditModule !== 'all') {
      if (selectedAuditModule === 'seo') setSelectedCategoryTab('seo');
      else if (selectedAuditModule === 'security' || selectedAuditModule === 'ssl') setSelectedCategoryTab('security');
      else if (selectedAuditModule === 'performance' || selectedAuditModule === 'vitals') setSelectedCategoryTab('performance');
      else if (selectedAuditModule === 'accessibility') setSelectedCategoryTab('accessibility');
    }

    setActiveReport(reportToUse);
    setPendingReport(null);

    setTimeout(() => {
      scrollToReport();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 120);
  };

  // Referral Credit Unlock Handlers
  const handleUnlockWithReferralCredit = async (websiteUrl: string) => {
    if (!websiteUrl) return;
    const currentCredits = user.credits ?? 0;
    if (currentCredits < 1) {
      setIsReferralOpen(true);
      return;
    }

    const updatedUnlocked = Array.from(new Set([...(user.unlockedWebsites || []), websiteUrl]));
    const updatedUser: UserAccount = {
      ...user,
      credits: Math.max(0, currentCredits - 1),
      unlockedWebsites: updatedUnlocked,
    };

    setUser(updatedUser);
    try {
      localStorage.setItem('website_health_user', JSON.stringify(updatedUser));
    } catch {}

    // Update in Firestore if user is authenticated
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          credits: updatedUser.credits,
          unlockedWebsites: updatedUnlocked,
          lastSyncedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore credit unlock sync note:', err);
      }
    }

    // Mark current active report and history items as isPaidUnlocked: true
    if (activeReport && (activeReport.url === websiteUrl || activeReport.url.includes(websiteUrl) || websiteUrl.includes(activeReport.url))) {
      const unlockedReport = { ...activeReport, isPaidUnlocked: true };
      setActiveReport(unlockedReport);
    }

    setHistory((prev) =>
      prev.map((r) =>
        r.url === websiteUrl || r.url.includes(websiteUrl) || websiteUrl.includes(r.url)
          ? { ...r, isPaidUnlocked: true }
          : r
      )
    );

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const handleSimulateReferralReward = async () => {
    const updatedCredits = (user.credits ?? 0) + 1;
    const updatedReferrals = (user.referralCount ?? 0) + 1;
    const updatedUser: UserAccount = {
      ...user,
      credits: updatedCredits,
      referralCount: updatedReferrals,
    };

    setUser(updatedUser);
    try {
      localStorage.setItem('website_health_user', JSON.stringify(updatedUser));
    } catch {}

    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          credits: updatedCredits,
          referralCount: updatedReferrals,
          lastSyncedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore simulated referral sync note:', err);
      }
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Referral Flow Trigger (Checks Auth first before opening referral code)
  const handleOpenReferralFlow = () => {
    if (!user.isLoggedIn) {
      setPendingAuthReason('referral');
      setIsAuthOpen(true);
    } else {
      setIsReferralOpen(true);
    }
  };

  const handleBulkScan = (urls: string[]) => {
    setIsScanningBulk(true);
    const initialQueue: AuditQueueItem[] = urls.map((url, i) => {
      let hostname = url;
      try {
        hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      } catch {
        hostname = url;
      }
      return {
        id: `queue-${Date.now()}-${i}`,
        url,
        hostname,
        status: i === 0 ? 'scanning' : 'pending',
      };
    });
    setQueue(initialQueue);

    let currentIndex = 0;

    const processNext = () => {
      if (currentIndex >= urls.length) {
        setIsScanningBulk(false);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
        });
        return;
      }

      const currentUrl = urls[currentIndex];

      setQueue(prev =>
        prev.map((item, idx) =>
          idx === currentIndex ? { ...item, status: 'scanning', progress: 50 } : item
        )
      );

      setTimeout(() => {
        const report = generateAuditReport(currentUrl);

        setQueue(prev =>
          prev.map((item, idx) =>
            idx === currentIndex
              ? { ...item, status: 'completed', progress: 100, report }
              : item
          )
        );

        setHistory(prev => {
          const filtered = prev.filter(r => r.url !== report.url);
          const updated = [report, ...filtered];
          try {
            localStorage.setItem('website_health_live_history_v2', JSON.stringify(updated.slice(0, 30)));
          } catch {
            // ignore
          }
          return updated;
        });

        if (currentIndex === 0) {
          setActiveReport(report);
        }

        currentIndex++;
        if (currentIndex < urls.length) {
          setQueue(prev =>
            prev.map((item, idx) =>
              idx === currentIndex ? { ...item, status: 'scanning', progress: 20 } : item
            )
          );
          processNext();
        } else {
          setIsScanningBulk(false);
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
          });
        }
      }, 1200);
    };

    processNext();
  };

  const handleOpenFixModal = (metric: AuditMetric) => {
    setSelectedFixMetric(metric);
  };

  const handleOpenAutoFix = (metric?: AuditMetric) => {
    if (metric) {
      setSelectedFixMetric(metric);
    }
    setIsAutoFixOpen(true);
  };

  const handleTicketCreated = (ticket: ClientTicket) => {
    setTickets(prev => [ticket, ...prev]);
    setIsAutoFixOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase logout note:', e);
    }
    try {
      localStorage.removeItem('website_health_user');
    } catch {}
    setUser(GUEST_USER);
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Dynamic Colorful Ambient Background Mesh (Luminous & Deep Cosmos Dark) */}
      <div className="fixed top-0 left-0 w-[45rem] h-[45rem] bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10 animate-float-glow-1" />
      <div className="fixed top-20 right-0 w-[42rem] h-[42rem] bg-gradient-to-bl from-cyan-500/15 via-teal-500/10 to-transparent rounded-full blur-[130px] pointer-events-none -z-10 animate-float-glow-2" />
      <div className="fixed top-1/2 left-1/4 w-[36rem] h-[36rem] bg-gradient-to-tr from-emerald-500/12 via-amber-500/10 to-transparent rounded-full blur-[130px] pointer-events-none -z-10 animate-float-glow-3" />
      <div className="fixed bottom-0 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-tl from-purple-600/15 via-rose-500/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Dynamic Header with Live State, Direct PDF export & User Profile */}
      <Header
        lang={lang}
        onToggleLang={(newLang) => setLang(newLang)}
        user={user}
        historyCount={history.length}
        onOpenReferral={handleOpenReferralFlow}
        onOpenDownloads={() => setIsDownloadsOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onDownloadReport={() => setIsPdfModalOpen(true)}
        onOpenAuth={() => {
          setPendingAuthReason('general');
          setIsAuthOpen(true);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        onOpenPricing={() => {
          setPricingPlanSelection('pro');
          setIsPricingModalOpen(true);
        }}
        onOpenRating={() => setIsRatingModalOpen(true)}
        onOpenAdSenseKit={() => setIsAdSenseKitOpen(true)}
        onOpenDeepCrawler={() => setIsDeepCrawlerOpen(true)}
        onOpenAiGeo={() => setIsAiGeoModalOpen(true)}
        onOpenMonitoring={() => setIsMonitoringModalOpen(true)}
        onOpenCompetitor={() => setIsCompetitorOpen(true)}
        onOpenDevCenter={() => setIsDevCenterOpen(true)}
        onOpenIntlSeo={() => setIsIntlSeoOpen(true)}
        onOpenAgency={() => setIsAgencyOpen(true)}
        onOpenGlobalLatency={() => setIsGlobalLatencyOpen(true)}
        onOpenGitHubAutoFix={() => setIsGitHubAutoFixOpen(true)}
        onOpenCrUXHistory={() => setIsCrUXHistoryOpen(true)}
        onOpenOwaspSecurity={() => setIsOwaspSecurityOpen(true)}
        onOpenMultiChannelAlerts={() => setIsMultiChannelAlertsOpen(true)}
        onOpenTeamWorkspace={() => setIsTeamWorkspaceOpen(true)}
        onOpenDeveloperApi={() => setIsDeveloperApiOpen(true)}
        onOpenApiDocs={() => setIsApiDocsModalOpen(true)}
        onOpenStatusPage={() => setIsStatusPageOpen(true)}
        onOpenAiFix={() => setIsAutoFixOpen(true)}
        onOpenFixAndRescan={() => setIsFixAndRescanOpen(true)}
        onOpenWorldsBestEngine={() => setIsWorldsBestEngineOpen(true)}
        onOpenIssueRoadmap={() => {
          const el = document.getElementById('fix-roadmap-section') || document.getElementById('report-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        hasActiveReport={!!activeReport}
        onNewScan={() => {
          navigateToHome();
          scrollToTop();
        }}
      />

      {/* Referral Link Detected Top Alert Notification Banner */}
      {invitedReferralCode && !isReferralBannerDismissed && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-y border-amber-500/30 backdrop-blur-md text-slate-100 px-4 py-2.5 shadow-lg relative z-30 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-amber-300">
                  {lang === 'te' ? 'రిఫెరల్ ఇన్విటేషన్ లింక్ గుర్తించబడింది:' : 'Referral Invite Link Active:'}{' '}
                </span>
                <span className="bg-amber-400/20 border border-amber-400/40 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">
                  {invitedReferralCode}
                </span>
                <span className="text-slate-300 ml-1.5">
                  {user.isLoggedIn
                    ? (lang === 'te'
                      ? `(మీరు ప్రస్తుతం ${user.name || user.email} గా లాగిన్ అయ్యారు)`
                      : `(You are currently logged in as ${user.name || user.email})`)
                    : (lang === 'te'
                      ? '— 10 ఉచిత డీప్ స్కాన్ క్రెడిట్స్ పొందడానికి ఇప్పుడే రిజిస్టర్ అవ్వండి!'
                      : '— Sign up now to claim 10 Free Deep Audit Scan Credits!')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {user.isLoggedIn ? (
                <button
                  type="button"
                  onClick={async () => {
                    await handleLogout();
                    setIsAuthOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'వేరే ఖాతాతో జాయిన్ అవ్వండి' : 'Switch & Register with Invite'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'క్రెడిట్స్ క్లెయిమ్ చేయండి / సైన్ అప్' : 'Claim Credits & Sign Up'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsReferralBannerDismissed(true)}
                title="Dismiss banner"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeSeoLanding ? (
          <CollapsibleSidePanels
            lang={lang}
            onOpenPricing={() => {
              setPricingPlanSelection('pro');
              setIsPricingModalOpen(true);
            }}
            onOpenDeepCrawler={() => setIsDeepCrawlerOpen(true)}
            onOpenAiGeo={() => setIsAiGeoModalOpen(true)}
          >
            {/* High-ranking programmatic SEO Landing page (Pillar content) */}
            <div className="space-y-10">
              <SeoLandingHub
                currentSlug={activeSeoLanding}
                lang={lang}
                onSelectSlug={(slug) => setActiveSeoLanding(slug)}
                onScanUrl={(sampleUrl, targetModule) => {
                  handleScan(sampleUrl, undefined, false, targetModule);
                  navigateToHome();
                }}
                onBackToHome={navigateToHome}
                onOpenPricing={() => {
                  setPricingPlanSelection('pro');
                  setIsPricingModalOpen(true);
                }}
              />
              {/* Social proof reviews also on SEO landing pages */}
              <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pb-12">
                <CustomerReviewsSection
                  lang={lang}
                  onOpenRatingModal={() => setIsRatingModalOpen(true)}
                  newReview={newlySubmittedReview}
                />
              </div>
            </div>
          </CollapsibleSidePanels>
        ) : (
          /* Primary Live Interactive Diagnosis Home Experience */
          <div className="w-full">
            {/* 1. Full-Width Edge-to-Edge Hero Section (100% Viewport Width with dynamic cosmos aurora canvas) */}
            <HeroScanner
              lang={lang}
              user={user}
              activeUrl={activeReport?.url || ''}
              selectedTargetModule={selectedAuditModule}
              onSelectTargetModule={(mod) => setSelectedAuditModule(mod)}
              onUpdateUser={(updatedUser) => {
                setUser(updatedUser);
                try {
                  localStorage.setItem('website_health_user', JSON.stringify(updatedUser));
                } catch {}
              }}
              onScan={handleScan}
              onBulkScan={handleBulkScan}
              isScanning={isScanning}
              isScanningBulk={isScanningBulk}
              onOpenAiFix={() => {
                setIsAutoFixOpen(true);
              }}
              onOpenFixAndRescan={() => {
                setIsFixAndRescanOpen(true);
              }}
              onOpenIssueRoadmap={() => {
                const el = document.getElementById('fix-roadmap-section') || document.getElementById('report-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAiFeatures={() => {
                setIsAiGeoModalOpen(true);
              }}
              onOpenCrawlerEngine={() => {
                setIsDeepCrawlerOpen(true);
              }}
              onOpenDeveloperApi={() => {
                setIsDeveloperApiOpen(true);
              }}
              onOpenApiDocs={() => {
                setIsApiDocsModalOpen(true);
              }}
              onOpenMeetRoom={() => {
                setIsLiveMeetHubOpen(true);
              }}
              onOpenCreateMeetingModal={() => {
                setIsLiveMeetHubOpen(true);
              }}
              onOpenWorldsBestEngine={() => {
                setIsWorldsBestEngineOpen(true);
              }}
            />

            {/* 2. Collapsible Side Panels framing the interactive tools & reports below Hero */}
            <CollapsibleSidePanels
              lang={lang}
              onOpenPricing={() => {
                setPricingPlanSelection('pro');
                setIsPricingModalOpen(true);
              }}
              onOpenDeepCrawler={() => setIsDeepCrawlerOpen(true)}
              onOpenAiGeo={() => setIsAiGeoModalOpen(true)}
            >
              <div className="space-y-10 sm:space-y-14 pb-16">
                {/* Top Sticky/Prominent 728x90 Leaderboard Affiliate Banner Ads (Desktop >= md) */}
                <div className="hidden md:block w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-3 -mb-4">
                  <GoogleAdSlot
                    slotId="top-leaderboard-728"
                    slotType="horizontal"
                    bannerPreset="auto-rotate"
                    lang={lang}
                  />
                </div>

                {/* 5-Pillar Platform Suite: Quick Launchpad */}
                <SeoGrowthToolsBar
                  lang={lang}
                  onOpenDeepCrawler={() => setIsDeepCrawlerOpen(true)}
                  onOpenAiGeo={() => setIsAiGeoModalOpen(true)}
                  onOpenCompetitor={() => setIsCompetitorOpen(true)}
                  onOpenDevCenter={() => setIsDevCenterOpen(true)}
                  onOpenIntlSeo={() => setIsIntlSeoOpen(true)}
                  onOpenAgency={() => setIsAgencyOpen(true)}
                  onOpenMonitoring={() => setIsMonitoringModalOpen(true)}
                  onOpenExecutiveReport={() => setIsPdfModalOpen(true)}
                  onOpenFixAndRescan={() => setIsFixAndRescanOpen(true)}
                  onOpenAiFix={() => setIsAutoFixOpen(true)}
                />

                {/* Team Real-Time Activity Feed Component (Non-intrusive Live Audit Stream) */}
                <ActivityFeed
                  lang={lang}
                  history={history}
                  user={user}
                  onClearHistory={handleClearHistory}
                  onSelectReport={(report) => {
                    navigateToReport(report);
                  }}
                  onSelectUrl={(url) => {
                    handleScan(url);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  latestUserScan={
                    activeReport
                      ? {
                          url: activeReport.url,
                          score: activeReport.overallScore,
                          grade: activeReport.grade,
                          module: activeReport.targetAuditModule,
                        }
                      : null
                  }
                />

                {/* Bulk Scan Status Queue (Visible when bulk scanning or items in queue) */}
                {queue.length > 0 && (
                  <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
                    <AuditQueuePanel
                      queue={queue}
                      lang={lang}
                      isScanningBulk={isScanningBulk}
                      onSelectReport={(report) => {
                        navigateToReport(report);
                      }}
                      onClearQueue={() => setQueue([])}
                    />
                  </div>
                )}

                {/* Active Audit Report Overview Dashboard (Directly below Hero Scanner) */}
                {(isScanning || activeReport) && (
                  <div id="report-section" className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 space-y-10 scroll-mt-24 animate-in fade-in duration-300">
                    {/* Score cards, Quick Stats, Direct Share & 1-Click PDF */}
                    <HealthOverviewCard
                      report={isScanning ? undefined : (activeReport || undefined)}
                      isLoading={isScanning}
                      lang={lang}
                      onSelectCategory={(catId) => setSelectedCategoryTab(catId)}
                      onOpenAutoFix={(metric) => handleOpenAutoFix(metric)}
                      onOpenFixModal={(metric) => handleOpenFixModal(metric)}
                      onExportPdf={() => setIsPdfModalOpen(true)}
                      onOpenPricing={(plan) => {
                        setPricingPlanSelection(plan || 'pro');
                        setIsPricingModalOpen(true);
                      }}
                      onOpenCompare={() => setIsCompareOpen(true)}
                      onOpenRatingModal={() => setIsRatingModalOpen(true)}
                      onOpenAdSenseKit={() => setIsAdSenseKitOpen(true)}
                      onOpenDeepCrawler={() => setIsDeepCrawlerOpen(true)}
                      onOpenAiGeo={() => setIsAiGeoModalOpen(true)}
                      onOpenMonitoring={() => setIsMonitoringModalOpen(true)}
                      onOpenTeamWorkspace={() => setIsTeamWorkspaceOpen(true)}
                      onSwitchToFullReport={() => {
                        setSelectedAuditModule('all');
                        if (activeReport) {
                          setActiveReport({ ...activeReport, targetAuditModule: 'all' });
                        }
                      }}
                      onSelectAuditModule={(mod) => {
                        setSelectedAuditModule(mod);
                        handleScan(activeReport?.url || 'https://example.com', undefined, false, mod);
                      }}
                    />

                    {/* Top Google AdSense Placement (Native layout) */}
                    {!isScanning && <GoogleAdSlot slotType="horizontal" className="my-6" />}

                    {/* Detailed Category Metric Breakdowns & AI Remediation */}
                    <CategoryDetailTabs
                      report={isScanning ? undefined : (activeReport || undefined)}
                      isLoading={isScanning}
                      lang={lang}
                      activeCategory={selectedCategoryTab}
                      onCategoryChange={(catId) => setSelectedCategoryTab(catId)}
                      onOpenFix={handleOpenFixModal}
                      onOpenAutoFix={handleOpenAutoFix}
                      onOpenPricing={(plan) => {
                        setPricingPlanSelection(plan);
                        setIsPricingModalOpen(true);
                      }}
                      onRescanSection={(mod) => {
                        setSelectedAuditModule(mod);
                        handleScan(activeReport?.url || 'https://example.com', undefined, false, mod);
                      }}
                    />
                  </div>
                )}

                {/* Global Real-time Scanner Stats & Live Web Vitals Benchmark */}
                <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-2">
                  <GlobalAuditStats lang={lang} />
                </div>

                {/* 5-Star Rating & Customer Feedback Social Proof Section */}
                <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-2">
                  <CustomerReviewsSection
                    lang={lang}
                    onOpenRatingModal={() => setIsRatingModalOpen(true)}
                    newReview={newlySubmittedReview}
                  />
                </div>

                {/* Bottom Google AdSense Slot */}
                <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
                  <GoogleAdSlot slotType="infeed" />
                </div>

                {/* Live Google Meet Team Collaboration & War Room Section (Bottom of Home Page) */}
                <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-2">
                  <JoinMeetingSection
                    lang={lang}
                    user={user}
                    activeReport={activeReport}
                    onOpenEmbeddedMeet={() => setIsLiveMeetHubOpen(true)}
                    onOpenTeamWorkspace={() => setIsTeamWorkspaceOpen(true)}
                    onOpenCreateMeetingModal={() => setIsLiveMeetHubOpen(true)}
                  />
                </div>

                {/* Evergreen Programmatic SEO Landing Pages Hub & Directory with Dropdown Accordion */}
                <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-4">
                  <div className="bg-slate-900/80 rounded-3xl border-2 border-slate-800 p-6 sm:p-8 shadow-2xl transition-all">
                    {/* Header with Clickable Dropdown Toggle & Down Arrow */}
                    <div 
                      onClick={() => setIsSeoDirectoryExpanded(!isSeoDirectoryExpanded)}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none group"
                      id="seo-directory-dropdown-toggle"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsSeoDirectoryExpanded(!isSeoDirectoryExpanded);
                        }
                      }}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30">
                            {lang === 'te' ? 'SEO ఆడిట్ హబ్' : 'SEO & Diagnostics Directory'}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            9 {lang === 'te' ? 'పోర్టల్స్' : 'Portals'}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                          <span>{lang === 'te' ? 'ఉచిత వెబ్‌సైట్ టూల్స్ & సమగ్ర గైడ్స్' : 'Specialized SEO & Security Audit Portals'}</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          {lang === 'te'
                            ? 'ఆన్-పేజ్ SEO, కోర్ వెబ్ వైటల్స్, SSL సెక్యూరిటీ & సమగ్ర టెక్నికల్ గైడ్స్'
                            : 'On-Page SEO, Core Web Vitals, SSL Security, WCAG Accessibility & Complete Technical Guides'}
                        </p>
                      </div>

                      {/* Prominent Dropdown Down/Up Arrow Button */}
                      <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSeoDirectoryExpanded(!isSeoDirectoryExpanded);
                          }}
                          className={`inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-lg border-2 ${
                            isSeoDirectoryExpanded
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 shadow-emerald-500/20'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-emerald-500/50'
                          }`}
                        >
                          <span>
                            {isSeoDirectoryExpanded
                              ? (lang === 'te' ? 'డైరెక్టరీని దాచండి' : 'Hide Directory & Guides')
                              : (lang === 'te' ? 'పోర్టల్స్ & గైడ్స్ చూడండి (ఓపెన్ చేయండి)' : 'Explore 9 Portals & Guides')}
                          </span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
                            isSeoDirectoryExpanded ? 'bg-slate-950/20 rotate-180' : 'bg-white/10'
                          }`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Dropdown Content Body */}
                    {isSeoDirectoryExpanded && (
                      <div className="mt-8 pt-6 border-t-2 border-slate-800 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {lang === 'te' ? 'ప్రత్యక్ష ఆడిట్ పోర్టల్స్' : 'Rank-ready deep analysis portals'}
                          </span>
                          <span className="text-xs text-emerald-400 font-semibold">
                            {lang === 'te' ? 'ఏదైనా పోర్టల్‌ను ఎంచుకోండి' : 'Select any audit module below'}
                          </span>
                        </div>

                        {/* 9 Specialized Portals Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {Object.values(SEO_LANDING_PAGES).map((page) => (
                            <button
                              key={page.slug}
                              onClick={() => navigateToSeoPage(page.slug)}
                              className="p-4.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border-2 border-slate-700/80 hover:border-emerald-500 text-left transition-all group flex items-start justify-between cursor-pointer shadow-md hover:shadow-emerald-500/10"
                            >
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-mono font-bold text-emerald-400">
                                    {page.slug.replace(/-/g, ' ').toUpperCase()}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                                  {lang === 'te' ? page.titleTe : page.title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                  {lang === 'te' ? page.metaDescTe : page.metaDesc}
                                </p>
                              </div>
                              <ChevronDown className="w-4 h-4 text-slate-500 -rotate-90 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all shrink-0 mt-1" />
                            </button>
                          ))}
                        </div>

                        {/* Deep SEO Informational & Structured Data Content */}
                        <div className="pt-6 border-t border-slate-800">
                          <SeoStructuredSections lang={lang} onOpenSeoPage={navigateToSeoPage} />
                        </div>

                        {/* Bottom Collapse Button */}
                        <div className="flex justify-center pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSeoDirectoryExpanded(false);
                              const el = document.getElementById('seo-directory-dropdown-toggle');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-2 border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-md"
                          >
                            <ChevronUp className="w-4 h-4 text-emerald-400" />
                            <span>
                              {lang === 'te' ? 'పైకి మడవండి (క్లోజ్ చేయండి)' : 'Collapse Directory & Guides'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleSidePanels>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        lang={lang}
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
        onNavigateSeoPage={(slug) => {
          setActiveSeoLanding(slug);
          scrollToTop();
        }}
        onOpenPricing={() => {
          setPricingPlanSelection('pro');
          setIsPricingModalOpen(true);
        }}
        onOpenReferral={handleOpenReferralFlow}
        onOpenDownloads={() => setIsDownloadsOpen(true)}
        onOpenRating={() => setIsRatingModalOpen(true)}
        onOpenApiDocs={() => setIsApiDocsModalOpen(true)}
        onOpenDeveloperApi={() => setIsDeveloperApiOpen(true)}
        onOpenStatusPage={() => setIsStatusPageOpen(true)}
      />

      {/* Modals & Slide-out Drawers */}
      <FixCodeModal
        metric={selectedFixMetric}
        isOpen={!!selectedFixMetric && !isAutoFixOpen}
        onClose={() => setSelectedFixMetric(null)}
        lang={lang}
        onOpenPricing={(plan) => {
          setSelectedFixMetric(null);
          setPricingPlanSelection((plan as any) || 'quick');
          setIsPricingModalOpen(true);
        }}
        onOpenAutoFix={() => handleOpenAutoFix(selectedFixMetric || undefined)}
      />

      <AutoFixTicketModal
        isOpen={isAutoFixOpen}
        onClose={() => setIsAutoFixOpen(false)}
        lang={lang}
        metric={selectedFixMetric}
        websiteUrl={activeReport?.url || ''}
        targetUrl={activeReport?.url || ''}
        targetReport={activeReport}
        onTicketCreated={handleTicketCreated}
        onAddTicket={handleTicketCreated}
        onOpenPricing={(plan) => {
          setPricingPlanSelection(plan as PricingPlanId || 'pro');
          setIsPricingModalOpen(true);
        }}
      />

      <RemediationPricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        lang={lang}
        report={activeReport}
        user={user}
        defaultPlanId={pricingPlanSelection}
        onUnlockWithReferralCredit={handleUnlockWithReferralCredit}
        onOpenReferral={() => {
          setIsPricingModalOpen(false);
          handleOpenReferralFlow();
        }}
        onRemediationCompleted={(result) => {
          const newTicket: ClientTicket = {
            id: Math.floor(1000 + Math.random() * 9000),
            email: user.email || 'user@example.com',
            websiteUrl: result.websiteUrl,
            githubLink: result.prUrl || result.downloadZipUrl || 'https://github.com/username/project',
            description: `Automated ${result.planId.toUpperCase()} Fix (${result.issuesFixedCount} issues resolved)`,
            status: result.prUrl ? 'PR Opened' : 'Resolved (zip)',
            prUrl: result.prUrl,
            downloadPath: result.downloadZipUrl,
            createdAt: new Date().toLocaleDateString(),
            fixedIssuesCount: result.issuesFixedCount,
          };
          handleTicketCreated(newTicket);
        }}
      />

      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        lang={lang}
        user={user}
        activeWebsiteUrl={activeReport?.url}
        onUnlockWebsiteWithCredit={handleUnlockWithReferralCredit}
        onSimulateReferralReward={handleSimulateReferralReward}
        onOpenAuth={() => {
          setIsReferralOpen(false);
          setPendingAuthReason('referral');
          setIsAuthOpen(true);
        }}
      />

      <HistoryAndTicketsDrawer
        isOpen={isDownloadsOpen}
        onClose={() => setIsDownloadsOpen(false)}
        lang={lang}
        history={history}
        tickets={tickets}
        onClearHistory={handleClearHistory}
        onSelectReport={(report) => {
          setActiveReport(report);
          setIsDownloadsOpen(false);
          navigateToHome();
          const el = document.getElementById('report-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {activeReport && (
        <PdfExportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          lang={lang}
          report={activeReport}
          user={user}
          onOpenAuth={() => {
            setPendingAuthReason('general');
            setIsAuthOpen(true);
          }}
          onOpenRatingModal={() => setIsRatingModalOpen(true)}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingAuthReason(null);
        }}
        lang={lang}
        user={user}
        authReason={pendingAuthReason || undefined}
        initialReferralCode={invitedReferralCode}
        onLoginSuccess={(updatedUser) => {
          setUser(updatedUser);
          try {
            localStorage.setItem('website_health_user', JSON.stringify(updatedUser));
          } catch {}
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          if (pendingAuthReason === 'referral') {
            setPendingAuthReason(null);
            setIsReferralOpen(true);
          }
        }}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        lang={lang}
        user={user}
        historyCount={history.length}
        onUpdateUser={(updatedUser) => {
          setUser(updatedUser);
          try {
            localStorage.setItem('website_health_user', JSON.stringify(updatedUser));
          } catch {}
        }}
        onLogout={handleLogout}
        onOpenReferral={() => {
          setIsProfileOpen(false);
          handleOpenReferralFlow();
        }}
        onOpenPricing={(plan) => {
          setIsProfileOpen(false);
          setPricingPlanSelection(plan || 'pro');
          setIsPricingModalOpen(true);
        }}
        onOpenDeveloperApi={() => {
          setIsProfileOpen(false);
          setIsDeveloperApiOpen(true);
        }}
      />

      {activeReport && (
        <AuditComparisonModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          lang={lang}
          reportA={activeReport}
        />
      )}

      {/* 5-Star Rating & Feedback Submission Modal */}
      <RatingFeedbackModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        lang={lang}
        user={user}
        currentReport={activeReport}
        onReviewSubmitted={(review) => {
          setNewlySubmittedReview(review);
          setUser((prev) => ({
            ...prev,
            credits: prev.credits + 2,
          }));
        }}
      />

      {/* Deep Multi-Page Website Crawler Modal */}
      <DeepWebsiteCrawlerModal
        isOpen={isDeepCrawlerOpen}
        onClose={() => setIsDeepCrawlerOpen(false)}
        lang={lang}
        report={activeReport}
        onOpenFixModal={(metric) => handleOpenFixModal(metric)}
        onOpenPricing={(plan) => {
          setIsDeepCrawlerOpen(false);
          setPricingPlanSelection(plan);
          setIsPricingModalOpen(true);
        }}
      />

      {/* AI SEO & GEO Search Readiness Modal */}
      <AiGeoAuditModal
        isOpen={isAiGeoModalOpen}
        onClose={() => setIsAiGeoModalOpen(false)}
        lang={lang}
        targetUrl={activeReport?.url}
        initialAiScore={activeReport?.aiScore}
      />

      {/* 24/7 Automated Health Monitoring & Alerting Modal */}
      <WebsiteMonitoringModal
        isOpen={isMonitoringModalOpen}
        onClose={() => setIsMonitoringModalOpen(false)}
        lang={lang}
        targetUrl={activeReport?.url}
      />

      {/* Google AdSense 100% Approval & Full SEO Setup Code Kit Modal */}
      <AdSenseApprovalKitModal
        isOpen={isAdSenseKitOpen}
        onClose={() => setIsAdSenseKitOpen(false)}
        lang={lang}
        websiteUrl={activeReport?.url || ''}
      />

      {/* Competitor Intelligence & Benchmarking Modal */}
      <CompetitorIntelligenceModal
        isOpen={isCompetitorOpen}
        onClose={() => setIsCompetitorOpen(false)}
        lang={lang}
        report={activeReport}
        onOpenPricing={() => {
          setIsCompetitorOpen(false);
          setPricingPlanSelection('pro');
          setIsPricingModalOpen(true);
        }}
      />

      {/* Developer Fix Center & Tools Suite */}
      <DeveloperFixCenterModal
        isOpen={isDevCenterOpen}
        onClose={() => setIsDevCenterOpen(false)}
        lang={lang}
        report={activeReport}
      />

      {/* International SEO & Hreflang Inspector Modal */}
      <InternationalSeoModal
        isOpen={isIntlSeoOpen}
        onClose={() => setIsIntlSeoOpen(false)}
        lang={lang}
        report={activeReport}
      />

      {/* Agency & White-Label Suite Modal */}
      <AgencyWhiteLabelModal
        isOpen={isAgencyOpen}
        onClose={() => setIsAgencyOpen(false)}
        lang={lang}
        report={activeReport}
        onOpenPricing={() => {
          setIsAgencyOpen(false);
          setPricingPlanSelection('business');
          setIsPricingModalOpen(true);
        }}
      />

      {/* Fix & Re-scan UI Simulation Modal */}
      <FixAndRescanModal
        isOpen={isFixAndRescanOpen}
        onClose={() => setIsFixAndRescanOpen(false)}
        lang={lang}
        report={activeReport}
        onTriggerRescan={(url) => {
          setIsFixAndRescanOpen(false);
          handleScan(url);
        }}
        onOpenAutoFix={() => {
          setIsFixAndRescanOpen(false);
          setIsAutoFixOpen(true);
        }}
      />

      {/* 1. Global Multi-Region Latency & Edge CDN Tester */}
      <GlobalLatencyModal
        isOpen={isGlobalLatencyOpen}
        onClose={() => setIsGlobalLatencyOpen(false)}
        lang={lang}
        report={activeReport}
      />

      {/* 2. 1-Click GitHub Auto-Fix Pull Request Engine */}
      <GitHubAutoFixModal
        isOpen={isGitHubAutoFixOpen}
        onClose={() => setIsGitHubAutoFixOpen(false)}
        lang={lang}
        report={activeReport}
      />

      {/* 3. Google CrUX Real User Monitoring & Historical Trends */}
      <CrUXHistoryModal
        isOpen={isCrUXHistoryOpen}
        onClose={() => setIsCrUXHistoryOpen(false)}
        lang={lang}
        report={activeReport}
      />

      {/* 4. OWASP Top 10 & CVE Vulnerability Scanner */}
      <OwaspSecurityScannerModal
        isOpen={isOwaspSecurityOpen}
        onClose={() => setIsOwaspSecurityOpen(false)}
        lang={lang}
        report={activeReport}
      />

      {/* 5. Multi-Channel Slack & WhatsApp Live Alerts Hub */}
      <MultiChannelAlertsModal
        isOpen={isMultiChannelAlertsOpen}
        onClose={() => setIsMultiChannelAlertsOpen(false)}
        lang={lang}
        report={activeReport}
      />

      {/* 6. Team Security Workspace & Collaboration Hub */}
      <TeamWorkspaceModal
        isOpen={isTeamWorkspaceOpen}
        onClose={() => setIsTeamWorkspaceOpen(false)}
        lang={lang}
        user={user}
        activeReport={activeReport}
        onOpenReport={(report) => {
          setIsTeamWorkspaceOpen(false);
          navigateToReport(report);
        }}
        onOpenAutoFix={() => {
          setIsTeamWorkspaceOpen(false);
          setIsAutoFixOpen(true);
        }}
      />

      {/* 6.1 Interactive Team Google Meet War Room Modal */}
      <TeamGoogleMeetRoom
        isOpen={isMeetRoomOpen}
        onClose={() => setIsMeetRoomOpen(false)}
        lang={lang}
        user={user}
        activeReport={activeReport}
        initialRoomId={activeMeetingRoomId}
        roomTitle={activeMeetingRoomTitle}
        passcode={activeMeetingPasscode}
        onOpenAutoFix={() => {
          setIsMeetRoomOpen(false);
          setIsAutoFixOpen(true);
        }}
      />

      {/* 6.2 Live Meeting Hub & Scheduler (Instant Meet, Schedule Date/Time, & Shareable Link) */}
      <LiveMeetingHubModal
        isOpen={isLiveMeetHubOpen}
        onClose={() => setIsLiveMeetHubOpen(false)}
        lang={lang}
        user={user}
        activeReport={activeReport}
        onStartInstantMeeting={(roomId, roomTitle, passcode) => {
          if (roomId) setActiveMeetingRoomId(roomId);
          if (roomTitle) setActiveMeetingRoomTitle(roomTitle);
          if (passcode !== undefined) setActiveMeetingPasscode(passcode);
          setIsLiveMeetHubOpen(false);
          setIsMeetRoomOpen(true);
        }}
      />

      {/* 6.3 Create Live Meeting & Shareable Invite Link Generator Modal */}
      <CreateLiveMeetingModal
        isOpen={isCreateMeetingModalOpen}
        onClose={() => setIsCreateMeetingModalOpen(false)}
        lang={lang}
        user={user}
        activeReport={activeReport}
        onStartMeeting={(config) => {
          setActiveMeetingRoomId(config.roomId);
          setActiveMeetingRoomTitle(config.title);
          setActiveMeetingPasscode(config.passcode || '');
          setIsCreateMeetingModalOpen(false);
          setIsMeetRoomOpen(true);
        }}
      />

      {/* 7. Website Audit REST API & Developer Marketplace */}
      <DeveloperApiMarketplaceModal
        isOpen={isDeveloperApiOpen}
        onClose={() => setIsDeveloperApiOpen(false)}
        lang={lang}
        user={user}
        onOpenFullDocs={() => setIsApiDocsModalOpen(true)}
        onOpenStatusPage={() => setIsStatusPageOpen(true)}
        onUpdateUser={(updatedUser) => {
          setUser(updatedUser);
          try {
            localStorage.setItem('website_health_user', JSON.stringify(updatedUser));
          } catch {}
        }}
      />

      {/* 8. API Documentation & SDK Code Generation Modal */}
      <ApiDocumentationModal
        isOpen={isApiDocsModalOpen}
        onClose={() => setIsApiDocsModalOpen(false)}
        lang={lang}
        user={user}
        onOpenPlayground={() => {
          setIsApiDocsModalOpen(false);
          setIsDeveloperApiOpen(true);
        }}
      />

      {/* 9. Dedicated Live API System Status & 90-Day SLA Page */}
      <ApiStatusPageModal
        isOpen={isStatusPageOpen}
        onClose={() => setIsStatusPageOpen(false)}
        lang={lang}
        onOpenDeveloperApi={() => {
          setIsStatusPageOpen(false);
          setIsDeveloperApiOpen(true);
        }}
        onOpenApiDocs={() => {
          setIsStatusPageOpen(false);
          setIsApiDocsModalOpen(true);
        }}
      />

      {/* Live Browser Audit Video Simulation Modal during Website Testing */}
      {isLiveScanModalOpen && (
        <LiveBrowserVideoScanner
          url={liveScanningUrl}
          isScanning={isScanning}
          lang={lang}
          isModal={true}
          onComplete={handleLiveScanComplete}
          onClose={handleLiveScanComplete}
        />
      )}

      {/* World's Best AI Neural Engine Modal (Gemini 3.7 Flash) */}
      <WorldBestAiEngineModal
        isOpen={isWorldsBestEngineOpen}
        onClose={() => setIsWorldsBestEngineOpen(false)}
        lang={lang}
        initialUrl={activeReport?.url || 'https://example.com'}
      />

      {/* Interactive SEO, Legal & Support Modals */}
      <LegalAndContactModals
        isOpen={activeLegalModal !== null}
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
        lang={lang}
      />
    </div>
  );
}
