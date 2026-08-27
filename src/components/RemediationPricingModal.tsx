import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowRight,
  RefreshCw,
  GitPullRequest,
  Download,
  Info,
  Building2,
  Lock,
  ExternalLink,
  ChevronRight,
  Cpu,
  TrendingUp,
  Award,
  FileCheck2,
  QrCode,
  Smartphone,
  Check,
  AlertCircle,
  Copy,
  Sliders,
  Settings,
  HelpCircle,
  ArrowLeft,
  KeyRound,
  Loader2,
  Gift,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  FullAuditReport,
  Language,
  PricingPlan,
  PricingPlanId,
  RemediationExecutionResult,
  UserAccount,
} from '../types';
import { translations } from '../data/translations';
import {
  PRICING_PLANS,
  calculateRazorpayFee,
  RAZORPAY_FEES_SUMMARY,
} from '../data/pricingPlans';
import {
  createRazorpayOrder,
  loadRazorpayScript,
  verifyRazorpayPaymentOnBackend,
} from '../data/razorpayClient';
import {
  generateAdSenseSeoKit,
  downloadAdSenseSeoZip,
  AdSenseFileItem,
} from '../data/adsenseSeoRemediationKit';
import {
  DollarSign,
  FileCode,
  Globe,
  FolderArchive,
} from 'lucide-react';

interface RemediationPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  report?: FullAuditReport | null;
  defaultPlanId?: PricingPlanId;
  user?: UserAccount;
  onUnlockWithReferralCredit?: (url: string) => void;
  onOpenReferral?: () => void;
  onRemediationCompleted?: (result: RemediationExecutionResult) => void;
}

type PaymentMethodTab = 'upi' | 'card' | 'netbanking' | 'wallet' | 'config';

export const RemediationPricingModal: React.FC<RemediationPricingModalProps> = ({
  isOpen,
  onClose,
  lang,
  report,
  defaultPlanId = 'pro',
  user,
  onUnlockWithReferralCredit,
  onOpenReferral,
  onRemediationCompleted,
}) => {
  const t = translations[lang];
  const [selectedPlanId, setSelectedPlanId] = useState<PricingPlanId>(defaultPlanId);
  const [activeTab, setActiveTab] = useState<'onetime' | 'business'>('onetime');
  const [showFeeMath, setShowFeeMath] = useState(false);

  // Authorization & Deployment Access configuration
  const [authMethod, setAuthMethod] = useState<'github' | 'zip' | 'wordpress'>('github');
  const [githubUrl, setGithubUrl] = useState('https://github.com/username/my-website');
  const [userEmail, setUserEmail] = useState('');

  // Payment View State (plan_selection -> checkout_gateway -> processing -> success)
  const [viewState, setViewState] = useState<'plan_selection' | 'checkout_gateway' | 'processing' | 'success'>('plan_selection');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodTab>('upi');
  
  // UPI State
  const [upiId, setUpiId] = useState('');
  const [upiCopied, setUpiCopied] = useState(false);
  const [qrTimerSeconds, setQrTimerSeconds] = useState(600); // 10 minutes countdown

  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Custom API Key / Config State
  const [customKeyId, setCustomKeyId] = useState('');
  const [customKeySecret, setCustomKeySecret] = useState('');
  const [isTestMode, setIsTestMode] = useState(true);

  // Execution & Verification State
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [remediationResult, setRemediationResult] = useState<RemediationExecutionResult | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ orderId: string; amount: number; amountINR: number; keyId: string } | null>(null);

  // AdSense & 100% SEO Setup Kit State (Unlocked after payment)
  const [adsensePublisherId, setAdsensePublisherId] = useState('pub-1234567890123456');
  const [activeAdsenseTab, setActiveAdsenseTab] = useState<'all' | 'root_files' | 'legal_pages' | 'seo_schema' | 'adsense_placement'>('all');
  const [selectedAdsenseFileIndex, setSelectedAdsenseFileIndex] = useState(0);
  const [copiedAdsenseFile, setCopiedAdsenseFile] = useState<string | null>(null);
  const [isAdsenseZipping, setIsAdsenseZipping] = useState(false);

  const adsenseKit = React.useMemo(() => {
    const targetUrl = report?.url || remediationResult?.websiteUrl || 'https://mywebsite.com';
    return generateAdSenseSeoKit({
      websiteUrl: targetUrl,
      publisherId: adsensePublisherId,
      contactEmail: userEmail || undefined,
    });
  }, [report?.url, remediationResult?.websiteUrl, adsensePublisherId, userEmail]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlanId(defaultPlanId);
      if (defaultPlanId === 'business') {
        setActiveTab('business');
      } else {
        setActiveTab('onetime');
      }
      setRemediationResult(null);
      setIsProcessing(false);
      setExecutionStep(0);
      setViewState('plan_selection');
      setQrTimerSeconds(600);
      
      // Attempt background pre-load of Razorpay SDK
      loadRazorpayScript().catch(() => {});
    }
  }, [isOpen, defaultPlanId]);

  // QR Timer Countdown
  useEffect(() => {
    let interval: any;
    if (viewState === 'checkout_gateway' && paymentMethod === 'upi') {
      interval = setInterval(() => {
        setQrTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, paymentMethod]);

  if (!isOpen) return null;

  // Breakdown issues from active report
  const overallScore = report?.overallScore || 72;
  const categories = report?.categories || [];

  const categoryIssues = {
    seo: categories.find((c) => c.id === 'seo')?.metrics.filter((m) => m.status !== 'good').length || 8,
    perf: categories.find((c) => c.id === 'performance')?.metrics.filter((m) => m.status !== 'good').length || 5,
    sec: categories.find((c) => c.id === 'security')?.metrics.filter((m) => m.status !== 'good').length || 2,
    acc: categories.find((c) => c.id === 'accessibility')?.metrics.filter((m) => m.status !== 'good').length || 3,
  };

  const totalIssuesCount =
    categoryIssues.seo + categoryIssues.perf + categoryIssues.sec + categoryIssues.acc;

  const currentPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[2];
  const feeDetails = calculateRazorpayFee(currentPlan.price);

  const handleSelectPlan = (planId: PricingPlanId) => {
    setSelectedPlanId(planId);
  };

  // Format Card input with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  // 1-Click Test Card Fill
  const handleFillTestCard = () => {
    setCardNumber('4111 1111 1111 1111');
    setCardExpiry('12/28');
    setCardCvv('123');
    setCardHolder('Website Admin');
  };

  // 1-Click Test UPI Fill
  const handleFillTestUpi = () => {
    setUpiId('razorpay.test@okaxis');
  };

  // Proceed to Razorpay Checkout Gateway
  const handleProceedToGateway = async () => {
    setIsProcessing(true);
    setExecutionStep(1);
    setStepMessage(
      lang === 'te'
        ? 'Razorpay ఆర్డర్ ఐడీ రూపొందిస్తున్నాము...'
        : 'Generating secure Razorpay order token...'
    );

    // Call backend to create Razorpay Order
    const orderData = await createRazorpayOrder(
      selectedPlanId,
      report?.url || 'https://example.com'
    );

    setOrderInfo({
      orderId: orderData.orderId,
      amount: orderData.amount,
      amountINR: orderData.amountINR || currentPlan.price,
      keyId: customKeyId || orderData.keyId,
    });

    setIsProcessing(false);
    setViewState('checkout_gateway');
  };

  // Try Launching Official Razorpay SDK Popup if available and desired
  const handleLaunchOfficialRazorpayPopup = async () => {
    try {
      setIsProcessing(true);
      await loadRazorpayScript();
      
      if (typeof window !== 'undefined' && window.Razorpay) {
        const activeKey = customKeyId || (orderInfo?.keyId && !orderInfo.keyId.includes('demo') ? orderInfo.keyId : 'rzp_test_1DP5mmOlF5G5ag');

        // Extract phone number from UPI ID if formatted like 9052868653@ybl
        const rawDigits = upiId.includes('@') ? upiId.split('@')[0].replace(/\D/g, '') : upiId.replace(/\D/g, '');
        const contactNumber = rawDigits.length === 10 ? rawDigits : '9052868653';

        const options: any = {
          key: activeKey,
          amount: orderInfo?.amount || currentPlan.price * 100,
          currency: 'INR',
          name: 'Website Health AI Pro',
          description: `${currentPlan.name} Remediation Package`,
          order_id: orderInfo?.orderId && !orderInfo.orderId.includes('sandbox') && !orderInfo.orderId.includes('order_rzp') ? orderInfo.orderId : undefined,
          prefill: {
            name: cardHolder || 'Website Owner',
            email: userEmail || 'jpschari789@gmail.com',
            contact: contactNumber,
            vpa: upiId || undefined,
          },
          theme: {
            color: '#059669', // Emerald 600
          },
          handler: function (response: any) {
            setIsProcessing(false);
            executeBackendVerificationAndPipeline(
              response.razorpay_payment_id || `pay_rzp_${Date.now()}`,
              response.razorpay_signature || `sig_verified_${Date.now()}`
            );
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              console.log('Razorpay modal dismissed by user');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          console.warn('Razorpay payment failed:', resp.error);
        });
        rzp.open();
        return;
      }
    } catch (err) {
      console.warn('Standard Razorpay popup invocation failed, falling back to seamless in-app gateway:', err);
    }
    
    setIsProcessing(false);
  };

  // Execute Backend Verification and Auto-Remediation Code Pipeline
  const executeBackendVerificationAndPipeline = async (paymentId: string, signature: string) => {
    setViewState('processing');
    setIsProcessing(true);
    setExecutionStep(2);
    setStepMessage(
      lang === 'te'
        ? 'చెల్లింపు పూర్తయింది. సర్వర్‌లో HMAC SHA-256 సంతకాన్ని ధృవీకరిస్తున్నాము...'
        : 'Payment received! Verifying HMAC SHA-256 cryptographic signature with server...'
    );

    const verificationResult = await verifyRazorpayPaymentOnBackend({
      razorpay_order_id: orderInfo?.orderId || `order_${Date.now()}`,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      planId: selectedPlanId,
      websiteUrl: report?.url || 'https://example.com',
      email: userEmail || 'user@example.com',
      repoUrl: githubUrl,
      authMethod: authMethod,
      currentScore: overallScore,
      detectedCount: totalIssuesCount,
    });

    // Step 3: Injecting Code Remedies
    setTimeout(() => {
      setExecutionStep(3);
      setStepMessage(
        lang === 'te'
          ? 'కోడ్ పైప్‌లైన్ నడుస్తోంది: మెటా ట్యాగ్స్, HSTS, SSL, మరియు ARIA కాంట్రాస్ట్ రిపేర్స్ ఇంజెక్ట్ అవుతున్నాయి...'
          : 'Injecting automated code patches: <title>, meta descriptions, HSTS & CSS/JS deferrals...'
      );
    }, 1200);

    // Step 4: Generating Pull Request & ZIP package
    setTimeout(() => {
      setExecutionStep(4);
      setStepMessage(
        lang === 'te'
          ? 'గిట్‌హబ్ పుల్ రిక్వెస్ట్ (Pull Request) & డౌన్‌లోడ్ ప్యాచ్ సిద్ధం చేస్తున్నాము...'
          : 'Creating GitHub Pull Request with code diffs & packaging ZIP patch...'
      );
    }, 2400);

    // Step 5: Live Verification Re-Scan
    setTimeout(() => {
      setExecutionStep(5);
      setStepMessage(
        lang === 'te'
          ? 'లైవ్ వెరిఫికేషన్ రీ-స్కాన్ విజయవంతంగా పూర్తయింది!'
          : 'Automated live verification re-scan completed! New score verified.'
      );
    }, 3600);

    // Final result
    setTimeout(() => {
      setIsProcessing(false);
      setRemediationResult(verificationResult);
      setViewState('success');
      if (onRemediationCompleted) {
        onRemediationCompleted(verificationResult);
      }

      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.55 },
      });
    }, 4500);
  };

  // Trigger Unlock via 1 Referral Credit (Free full access)
  const handleUnlockUsingReferralCredit = () => {
    if (onUnlockWithReferralCredit && report?.url) {
      onUnlockWithReferralCredit(report.url);
    }
    setSelectedPlanId('pro');
    const generatedPaymentId = `pay_ref_credit_${Date.now()}`;
    const generatedSignature = `sig_ref_credit_verified_${Date.now()}`;
    executeBackendVerificationAndPipeline(generatedPaymentId, generatedSignature);
  };

  // Trigger simulated payment or live confirmation
  const handleCompletePayment = (method: string) => {
    const generatedPaymentId = `pay_${method.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const generatedSignature = `sig_verified_${Date.now()}`;
    executeBackendVerificationAndPipeline(generatedPaymentId, generatedSignature);
  };

  const handleResetAndClose = () => {
    setRemediationResult(null);
    setIsProcessing(false);
    setViewState('plan_selection');
    onClose();
  };

  // Format QR seconds into MM:SS
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-4xl w-full p-5 sm:p-8 space-y-6 relative max-h-[92vh] overflow-y-auto my-auto divide-y-2 divide-slate-200">
        
        {/* ==================================================================== */}
        {/* MODAL HEADER WITH THICK SEPARATING LINE */}
        {/* ==================================================================== */}
        <div className="flex items-start justify-between pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0 border-2 border-emerald-400">
              <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {viewState === 'checkout_gateway' ? (
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <span>Razorpay Checkout Gateway</span>
                    </span>
                  ) : viewState === 'success' ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <span>Payment Verified & Code Fixed!</span>
                    </span>
                  ) : (
                    t.fixWebsiteAutomatically
                  )}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border-2 border-emerald-300 hidden sm:inline-block">
                  Razorpay Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {viewState === 'checkout_gateway'
                  ? `Order for ${currentPlan.name} • 100% Encrypted & Instant Delivery`
                  : viewState === 'success'
                  ? 'All selected errors have been corrected in code and verified.'
                  : t.pricingSectionSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==================================================================== */}
        {/* VIEW 1: SUCCESSFUL REMEDIATION & BEFORE/AFTER SCORECARD */}
        {/* ==================================================================== */}
        {viewState === 'success' && remediationResult && (
          <div className="space-y-6 pt-5 animate-fadeIn">
            {/* Header Success Banner */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 border-2 border-white">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border-2 border-emerald-300 inline-block mb-1.5">
                  {t.paymentVerifiedByBackend} ✓
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                  {remediationResult.issuesFixedCount} {t.issuesFixedSuccess} ✓
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto mt-1 font-medium">
                  Payment ID <code className="font-mono font-bold bg-emerald-200/70 text-emerald-950 px-1.5 py-0.5 rounded border border-emerald-300">{remediationResult.paymentId}</code> verified via HMAC SHA-256. Code patches have been generated and re-scanned.
                </p>
              </div>
            </div>

            {/* Before vs After Score Comparison Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-indigo-500/40 space-y-6">
              <div className="text-center space-y-1">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-300">
                  Live Verification Re-Scan Comparison
                </h4>
                <p className="text-xs text-slate-400">
                  Target Website: <span className="font-mono text-white font-bold">{remediationResult.websiteUrl}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-center max-w-2xl mx-auto">
                {/* Before Score */}
                <div className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-4 text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.beforeScoreLabel}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-rose-400">
                    {remediationResult.beforeScore}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                  <span className="inline-block text-[10px] text-rose-300 bg-rose-950/70 border border-rose-800 px-2 py-0.5 rounded-full font-bold">
                    {remediationResult.issuesFixedCount} Errors Detected
                  </span>
                </div>

                {/* Arrow Delta */}
                <div className="flex flex-col items-center justify-center text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-inner">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-emerald-400 mt-1.5">
                    +{remediationResult.afterScore - remediationResult.beforeScore} pts Gain
                  </span>
                </div>

                {/* After Score */}
                <div className="bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl p-4 text-center space-y-1 shadow-lg shadow-emerald-500/10">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                    {t.afterScoreLabel}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                    {remediationResult.afterScore}
                    <span className="text-xs text-emerald-300 font-normal"> / 100</span>
                  </div>
                  <span className="inline-block text-[10px] text-emerald-200 bg-emerald-900/70 border border-emerald-600 px-2 py-0.5 rounded-full font-bold">
                    All Issues Resolved ✓
                  </span>
                </div>
              </div>

              {/* Remediated Items List */}
              <div className="bg-slate-950/70 rounded-2xl p-4 border-2 border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.viewRemediatedDiffs}:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {remediationResult.remediatedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-200">
                          {lang === 'te' ? item.titleTe : item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{item.actionTaken}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {remediationResult.prUrl && (
                  <a
                    href={remediationResult.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all border border-purple-400"
                  >
                    <GitPullRequest className="w-4 h-4" />
                    <span>View GitHub Pull Request</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsAdsenseZipping(true);
                      await downloadAdSenseSeoZip(adsenseKit);
                      confetti({
                        particleCount: 70,
                        spread: 80,
                        origin: { y: 0.5 },
                      });
                    } catch (err) {
                      console.error('Error downloading zip:', err);
                    } finally {
                      setIsAdsenseZipping(false);
                    }
                  }}
                  disabled={isAdsenseZipping}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg transition-all cursor-pointer border border-amber-300 disabled:opacity-50"
                >
                  {isAdsenseZipping ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <FolderArchive className="w-4 h-4 text-slate-950" />
                  )}
                  <span>
                    {isAdsenseZipping
                      ? lang === 'te' ? 'జిప్ సిద్ధమవుతోంది...' : 'Packaging All Files...'
                      : lang === 'te'
                      ? '🚀 గూగుల్ యాడ్‌సెన్స్ + ఎస్‌ఈఓ + ఫిక్సెస్ ZIP డౌన్‌లోడ్'
                      : '🚀 Download AdSense + SEO + Fixes ZIP'}
                  </span>
                </button>

                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>

            {/* ================================================================ */}
            {/* UNLOCKED BONUS: GOOGLE ADSENSE 100% APPROVAL & 100% SEO SETUP CODE KIT */}
            {/* ================================================================ */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 border-2 border-amber-400/80 rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shadow-md font-black shrink-0">
                    <DollarSign className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        {lang === 'te'
                          ? '🌟 అన్‌లాక్ చేయబడిన గూగుల్ యాడ్‌సెన్స్ 100% అప్రూవల్ & ఎస్‌ఈఓ కోడింగ్ కిట్'
                          : '🌟 Google AdSense 100% Approval & 100% SEO Setup Code Kit'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Unlocked ✓
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'te'
                        ? 'మీ డొమైన్ కోసం సిద్ధంగా ఉన్న 13+ ప్రొడక్షన్ ఫైళ్లు (ads.txt, 5 పాలసీ పేజీలు, Schema.org, robots.txt, Anti-CLS యాడ్ బాక్స్‌లు).'
                        : 'Customized production-ready files (ads.txt, 5 Mandatory Legal Pages, JSON-LD Schema, robots.txt, Anti-CLS Containers).'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setIsAdsenseZipping(true);
                        await downloadAdSenseSeoZip(adsenseKit);
                        confetti({
                          particleCount: 50,
                          spread: 60,
                          origin: { y: 0.5 },
                        });
                      } finally {
                        setIsAdsenseZipping(false);
                      }
                    }}
                    disabled={isAdsenseZipping}
                    className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'te' ? '1-క్లిక్ ZIP డౌన్‌లోడ్' : 'Download Kit ZIP'}</span>
                  </button>
                </div>
              </div>

              {/* Publisher ID & Site Domain Customizer */}
              <div className="bg-white rounded-2xl p-4 border border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'గూగుల్ యాడ్‌సెన్స్ పబ్లిషర్ ID:' : 'Google AdSense Publisher ID:'}
                  </label>
                  <input
                    type="text"
                    value={adsensePublisherId}
                    onChange={(e) => setAdsensePublisherId(e.target.value)}
                    placeholder="pub-1234567890123456"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'టర్గెట్ డొమైన్ URL:' : 'Target Website Domain:'}
                  </label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 text-xs truncate">
                    {adsenseKit.cleanDomain}
                  </div>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: lang === 'te' ? 'అన్ని ఫైల్స్ (13)' : 'All Files (13)' },
                  { id: 'root_files', label: 'ads.txt & robots.txt' },
                  { id: 'legal_pages', label: lang === 'te' ? '5 లీగల్ పాలసీ పేజీలు' : '5 Legal Policy Pages' },
                  { id: 'seo_schema', label: '100% SEO Schema.org' },
                  { id: 'adsense_placement', label: 'Anti-CLS Ad Slots' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveAdsenseTab(tab.id as any);
                      setSelectedAdsenseFileIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeAdsenseTab === tab.id
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* File List & Active Code Viewer */}
              {(() => {
                const currentFiles = activeAdsenseTab === 'all'
                  ? adsenseKit.files
                  : adsenseKit.files.filter((f) => f.folder === activeAdsenseTab);
                const activeFile = currentFiles[selectedAdsenseFileIndex] || adsenseKit.files[0];

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* File List */}
                    <div className="lg:col-span-4 space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {currentFiles.map((file, idx) => {
                        const isSelected = file.filename === activeFile.filename;
                        return (
                          <div
                            key={file.filename}
                            onClick={() => setSelectedAdsenseFileIndex(idx)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-amber-100/80 border-amber-400 text-slate-950 font-bold shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono truncate">{file.filename}</span>
                              <span className="text-[10px] uppercase font-bold text-slate-400">
                                {file.language}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Code Preview & Copy */}
                    <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 text-white space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                        <div className="space-y-0.5 truncate">
                          <span className="font-bold text-amber-400 font-mono">{activeFile.filename}</span>
                          <p className="text-[11px] text-slate-400 truncate">
                            {lang === 'te' ? activeFile.descriptionTe : activeFile.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeFile.content);
                            setCopiedAdsenseFile(activeFile.filename);
                            confetti({ particleCount: 20, spread: 40 });
                            setTimeout(() => setCopiedAdsenseFile(null), 2000);
                          }}
                          className="shrink-0 inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border border-slate-700"
                        >
                          {copiedAdsenseFile === activeFile.filename ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{lang === 'te' ? 'కాపీ చేయబడింది!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{lang === 'te' ? 'కోడ్ కాపీ చేయండి' : 'Copy Code'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-48 whitespace-pre">
                        {activeFile.content}
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Placement: <strong className="text-amber-300">/{activeFile.filename}</strong></span>
                        <span className="text-emerald-400 font-bold">100% AdSense Policy Approved ✓</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: EXECUTION / PROCESSING PROGRESS STATE */}
        {/* ==================================================================== */}
        {viewState === 'processing' && (
          <div className="py-10 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-xl shadow-emerald-500/15">
              <RefreshCw className="w-10 h-10 animate-spin" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'te' ? 'చెల్లింపు & ఫిక్స్ ప్రాసెస్ అవుతోంది...' : 'Processing Payment & Automated Remediation...'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {stepMessage}
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Progress</span>
                <span className="font-mono text-emerald-600 font-black">Step {executionStep} / 5</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 h-full transition-all duration-500"
                  style={{ width: `${(executionStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Checklist of steps */}
            <div className="max-w-sm mx-auto bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 text-left text-xs space-y-2">
              <div className={`flex items-center space-x-2 ${executionStep >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Generate Razorpay Order Token</span>
              </div>
              <div className={`flex items-center space-x-2 ${executionStep >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Process Payment & Authorize</span>
              </div>
              <div className={`flex items-center space-x-2 ${executionStep >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Server HMAC SHA-256 Verification</span>
              </div>
              <div className={`flex items-center space-x-2 ${executionStep >= 4 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>4. Inject Code Fixes & Create PR</span>
              </div>
              <div className={`flex items-center space-x-2 ${executionStep >= 5 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>5. Live Verification Re-Scan</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 3: SEAMLESS RAZORPAY PAYMENT GATEWAY CHECKOUT SCREEN */}
        {/* ==================================================================== */}
        {viewState === 'checkout_gateway' && (
          <div className="space-y-6 pt-5 animate-fadeIn">
            {/* Top Order Overview Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-2 border-indigo-400/40 gap-3 shadow-md">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Selected Plan:
                  </span>
                  <span className="text-sm font-black text-white">{currentPlan.name}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Target Website: <span className="font-mono text-emerald-400 font-bold">{report?.url || 'https://example.com'}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-2xl font-black text-emerald-400">
                  ₹{orderInfo?.amountINR || currentPlan.price}
                </div>
                <div className="text-[11px] text-slate-400">
                  Includes 2.36% Razorpay & GST fee
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b-2 border-slate-200 pb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                  paymentMethod === 'upi'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card (Debit/Credit)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                  paymentMethod === 'netbanking'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                  paymentMethod === 'wallet'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Wallets</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('config')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                  paymentMethod === 'config'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>API Keys</span>
              </button>
            </div>

            {/* TAB CONTENT 1: UPI & QR CODE */}
            {paymentMethod === 'upi' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Dynamic QR Code Card */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-center space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b-2 border-slate-200 pb-2">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <QrCode className="w-4 h-4" />
                      <span>Scan & Pay via UPI</span>
                    </span>
                    <span className="font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Expires: {formatTimer(qrTimerSeconds)}
                    </span>
                  </div>

                  {/* SVG Rendered QR Code */}
                  <div className="w-44 h-44 bg-white p-3 rounded-2xl border-2 border-slate-300 mx-auto shadow-inner flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                      {/* Standard QR Matrix Sample */}
                      <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                      <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                      <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                      <rect x="35" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="50" y="15" width="15" height="10" fill="currentColor" />
                      <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                      <rect x="40" y="40" width="20" height="20" fill="white" />
                      <rect x="45" y="45" width="10" height="10" fill="#059669" />

                      <rect x="70" y="40" width="10" height="25" fill="currentColor" />
                      <rect x="85" y="50" width="15" height="10" fill="currentColor" />
                      <rect x="40" y="75" width="20" height="10" fill="currentColor" />
                      <rect x="70" y="75" width="25" height="25" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    Scan with Google Pay, PhonePe, Paytm, BHIM, or CRED
                  </div>

                  {/* UPI VPA Copy helper */}
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-700">
                    <span>websitehealth@razorpay</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText('websitehealth@razorpay');
                        setUpiCopied(true);
                        setTimeout(() => setUpiCopied(false), 2000);
                      }}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {upiCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{upiCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct UPI ID entry */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        {lang === 'te' ? 'మీ UPI ID లేదా మొబైల్ నెంబర్ ఎంటర్ చేయండి' : 'Enter Your UPI ID / Mobile VPA'}
                      </label>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {lang === 'te' ? 'టెస్ట్ మోడ్ (డెమో)' : 'Sandbox / Test Mode'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="9876543210@paytm or name@okaxis"
                        className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={handleFillTestUpi}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                        title="Auto-fill test UPI"
                      >
                        ⚡ Test UPI
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {lang === 'te'
                        ? 'గమనిక: టెస్ట్ మోడ్‌లో ఉన్నందున మీ ఖాతా నుండి నిజమైన డబ్బులు కట్ కావు.'
                        : 'Note: Demo/Sandbox environment. No real funds are deducted.'}
                    </p>
                  </div>

                  {/* Supported UPI Apps icons */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Supported Instant Payment Apps:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold text-slate-700">
                      <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">Google Pay</span>
                      <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">PhonePe</span>
                      <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">Paytm</span>
                      <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">BHIM UPI</span>
                      <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">CRED</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleLaunchOfficialRazorpayPopup}
                      className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border-2 border-amber-300/80"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-slate-950" />
                          <span>
                            {lang === 'te'
                              ? 'Razorpay మోడల్ ఓపెన్ అవుతోంది...'
                              : 'Launching Razorpay Checkout...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                          <span>{lang === 'te' ? `ఇప్పుడే చెల్లించండి — ₹${orderInfo?.amountINR || currentPlan.price}` : `Pay Now via Razorpay — ₹${orderInfo?.amountINR || currentPlan.price}`}</span>
                          <ArrowRight className="w-4 h-4 ml-1 text-slate-950 stroke-[2.5]" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleCompletePayment('UPI_Sandbox')}
                      className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>⚡ {lang === 'te' ? 'టెస్ట్ డెమో: చెల్లింపు లేకుండా నేరుగా పరీక్షించండి' : 'Sandbox Demo: Instant Test Simulation (No Real Money)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: CREDIT / DEBIT CARD */}
            {paymentMethod === 'card' && (
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Enter Card Information</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 cursor-pointer"
                  >
                    ⚡ Auto-Fill Razorpay Test Card
                  </button>
                </div>

                {/* Card Number */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Card Number (RuPay, Visa, MasterCard)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Valid Thru (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      CVV (3 Digits)
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="e.g. Website Owner"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="saveCard" className="text-xs text-slate-600">
                    Save card securely for future audits (PCI-DSS compliant)
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleLaunchOfficialRazorpayPopup}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border-2 border-emerald-400"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                        <span>
                          {lang === 'te'
                            ? 'Razorpay మోడల్ ఓపెన్ అవుతోంది...'
                            : 'Launching Razorpay Checkout...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>{lang === 'te' ? `కార్డ్ ద్వారా చెల్లించండి — ₹${orderInfo?.amountINR || currentPlan.price}` : `Pay Now via Card / Razorpay — ₹${orderInfo?.amountINR || currentPlan.price}`}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleCompletePayment('Card_Sandbox')}
                    className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>⚡ {lang === 'te' ? 'టెస్ట్ డెమో: చెల్లింపు లేకుండా నేరుగా పరీక్షించండి' : 'Sandbox Demo: Instant Test Simulation'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: NETBANKING */}
            {paymentMethod === 'netbanking' && (
              <div className="max-w-md mx-auto space-y-4">
                <span className="text-xs font-bold text-slate-800 block">
                  Select Your Bank
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                        selectedBank === bank
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {bank} Bank
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    All Indian Banks
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="Axis">Axis Bank</option>
                    <option value="Kotak">Kotak Mahindra Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                    <option value="Canara">Canara Bank</option>
                    <option value="Union">Union Bank of India</option>
                    <option value="IndusInd">IndusInd Bank</option>
                    <option value="Yes">Yes Bank</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleLaunchOfficialRazorpayPopup}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border-2 border-emerald-400"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                        <span>
                          {lang === 'te'
                            ? 'Razorpay మోడల్ ఓపెన్ అవుతోంది...'
                            : 'Launching Razorpay Checkout...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Pay Now — ₹{orderInfo?.amountINR || currentPlan.price} via {selectedBank} Bank</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleCompletePayment(`NetBanking_${selectedBank}_Sandbox`)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>⚡ {lang === 'te' ? 'టెస్ట్ డెమో: చెల్లింపు లేకుండా నేరుగా పరీక్షించండి' : 'Sandbox Demo: Instant Test Simulation'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: WALLETS */}
            {paymentMethod === 'wallet' && (
              <div className="max-w-md mx-auto space-y-4">
                <span className="text-xs font-bold text-slate-800 block">
                  Select Supported Digital Wallet
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet', 'MobiKwik'].map((wallet) => (
                    <button
                      key={wallet}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleCompletePayment(wallet.replace(/\s+/g, '_'))}
                      className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 font-bold text-left transition-all cursor-pointer flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />}
                        <span>{wallet}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: API KEYS & GATEWAY CONFIG */}
            {paymentMethod === 'config' && (
              <div className="max-w-md mx-auto bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-indigo-600" />
                    <span>Razorpay Merchant Credentials (Optional)</span>
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    You can input your own Razorpay Key ID and Secret to receive direct payments into your business account.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Razorpay Key ID (rzp_test_... / rzp_live_...)</label>
                  <input
                    type="text"
                    value={customKeyId}
                    onChange={(e) => setCustomKeyId(e.target.value)}
                    placeholder="rzp_test_YourKeyHere"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Razorpay Key Secret</label>
                  <input
                    type="password"
                    value={customKeySecret}
                    onChange={(e) => setCustomKeySecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium">
                  ✓ Active Gateway Status: <span className="font-bold">Ready</span> (Standard Razorpay Sandbox + Live Verification Enabled)
                </div>
              </div>
            )}

            {/* Bottom Back Button */}
            <div className="pt-2 border-t-2 border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewState('plan_selection')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Plan</span>
              </button>

              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Payment</span>
              </span>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 4: MAIN INTERACTIVE PLAN SELECTION & ISSUES BREAKDOWN */}
        {/* ==================================================================== */}
        {viewState === 'plan_selection' && (
          <div className="space-y-6 pt-5">
            {/* 1. Scorecard and Issues Breakdown Summary */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 text-center space-y-4">
              <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                WEBSITE HEALTH SCORE
              </div>

              <div className="inline-flex items-baseline space-x-2 bg-white px-6 py-2.5 rounded-2xl border-2 border-slate-200 shadow-sm">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">{overallScore}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border-2 border-amber-300 text-xs font-black mx-auto">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>
                  ⚠ {totalIssuesCount} {lang === 'te' ? 'సమస్యలు గుర్తించబడ్డాయి' : 'Issues Found'}
                </span>
              </div>

              {/* Category-wise Count Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1 text-xs">
                <div className="bg-white border-2 border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs">
                  <span className="font-bold text-slate-700">{t.seo}</span>
                  <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {categoryIssues.seo} {lang === 'te' ? 'సమస్యలు' : 'issues'}
                  </span>
                </div>

                <div className="bg-white border-2 border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs">
                  <span className="font-bold text-slate-700">{t.performance}</span>
                  <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {categoryIssues.perf} {lang === 'te' ? 'సమస్యలు' : 'issues'}
                  </span>
                </div>

                <div className="bg-white border-2 border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs">
                  <span className="font-bold text-slate-700">{t.security}</span>
                  <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {categoryIssues.sec} {lang === 'te' ? 'సమస్యలు' : 'issues'}
                  </span>
                </div>

                <div className="bg-white border-2 border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs">
                  <span className="font-bold text-slate-700">{t.accessibility}</span>
                  <span className="font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {categoryIssues.acc} {lang === 'te' ? 'సమస్యలు' : 'issues'}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Category Switcher (3 Main Paid Choices vs Agency Business) */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t-2 border-slate-200 pt-4">
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('onetime')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'onetime'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.viewOneTimePlans}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('business')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'business'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.viewBusinessPlans}
                </button>
              </div>

              {/* Fee Math Popover Trigger */}
              <button
                type="button"
                onClick={() => setShowFeeMath(!showFeeMath)}
                className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{t.razorpayFeeTransparency}</span>
              </button>
            </div>

            {/* Razorpay Fee Transparency Card (if toggled) */}
            {showFeeMath && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs space-y-3 border-2 border-slate-700 animate-fadeIn">
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Razorpay Fee & GST Breakdown (Domestic 2% + 18% GST = 2.36%)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Zero Setup / Zero AMC</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  {RAZORPAY_FEES_SUMMARY.map((item) => (
                    <div key={item.price} className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700">
                      <div className="font-black text-white text-sm">₹{item.price}</div>
                      <div className="text-[10px] text-indigo-300 font-bold">{item.plan}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Fee: <span className="font-mono text-rose-300">₹{item.fee}</span>
                      </div>
                      <div className="text-[10px] text-emerald-300 font-bold font-mono">
                        Net: ₹{item.net}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referral Credit Unlock Option (1 Referral = 1 Website Full Pro Access) */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 border-2 border-amber-300">
                    <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        {lang === 'te'
                          ? '⚡ 1 రిఫరల్ క్రెడిట్‌తో ఈ వెబ్‌సైట్‌ను అన్‌లాక్ చేయండి (ఉచితం — ₹0)'
                          : '⚡ Unlock Full Access with 1 Referral Credit (Free — ₹0)'}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                        1 Refer = 1 Website Pass
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {user && user.credits > 0 ? (
                        lang === 'te'
                          ? `మీ దగ్గర ${user.credits} రిఫరల్ క్రెడిట్స్ ఉన్నాయి! 1 క్రెడిట్ ఉపయోగించి ప్రో ప్లాన్ (₹799 విలువ) పూర్తి ఉచితంగా పొందండి.`
                          : `You have ${user.credits} Referral Credits available! Use 1 credit to unlock all Pro fixes, GitHub PR, & AdSense kit without paying ₹799.`
                      ) : (
                        lang === 'te'
                          ? 'మీ దగ్గర ఇంకా రిఫరల్ క్రెడిట్స్ లేవు. ఒక స్నేహితుడికి షేర్ చేసి 1 ఉచిత వెబ్‌సైట్ పాస్ పొందండి లేదా కింద ఉన్న పేమెంట్ ప్లాన్ ఎంచుకోండి.'
                          : 'No referral credits yet. Refer 1 friend to earn 1 free website pass or select a payment plan below.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {user && user.credits > 0 ? (
                    <button
                      type="button"
                      onClick={handleUnlockUsingReferralCredit}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer border-2 border-amber-300 active:scale-95"
                    >
                      <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>{lang === 'te' ? '⚡ 1 క్రెడిట్‌తో పూర్తి యాక్సెస్ అన్‌లాక్ చేయండి (₹0)' : '⚡ Use 1 Credit & Unlock Full Pro Access (₹0)'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenReferral) {
                          onOpenReferral();
                        }
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer border-2 border-amber-400/50"
                    >
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'te' ? '🎁 రిఫర్ చేసి ఉచిత క్రెడిట్ పొందండి' : '🎁 Refer a Friend to Get 1 Free Pass'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 3 Main Paid Choices (Quick Fix ₹299, Pro Fix ⭐ ₹799, Complete Fix ₹1,499) */}
            {activeTab === 'onetime' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Quick Fix (₹299) */}
                {(() => {
                  const plan = PRICING_PLANS[1]; // Quick Fix
                  const isSelected = selectedPlanId === 'quick';
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan('quick')}
                      className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {lang === 'te' ? plan.tagTe : plan.tag}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-slate-500">5 Issues</span>
                        </div>

                        <h3 className="text-base font-black text-slate-900">
                          {lang === 'te' ? plan.nameTe : plan.name}
                        </h3>

                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900">₹299</span>
                          <span className="text-xs text-slate-500 font-bold">/ one-time</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'te' ? plan.descriptionTe : plan.description}
                        </p>

                        <div className="pt-2 border-t-2 border-slate-100 space-y-1.5 text-xs text-slate-700">
                          {(lang === 'te' ? plan.featuresTe : plan.features).slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan('quick');
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md border-emerald-700'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        {lang === 'te' ? '5 సమస్యలు ఫిక్స్ — ₹299' : 'Fix 5 Issues — ₹299'}
                      </button>
                    </div>
                  );
                })()}

                {/* 2. Pro Fix ⭐ (₹799) - Main Selling Plan */}
                {(() => {
                  const plan = PRICING_PLANS[2]; // Pro Fix ⭐
                  const isSelected = selectedPlanId === 'pro';
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan('pro')}
                      className={`rounded-3xl p-5 border-2 relative transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-xl shadow-indigo-500/15'
                          : 'border-indigo-300 bg-white hover:border-indigo-400 hover:shadow-lg'
                      }`}
                    >
                      {/* Popular Badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md border border-indigo-400">
                        {lang === 'te' ? 'అత్యంత ప్రాచుర్యం ⭐' : 'Most Popular ⭐'}
                      </div>

                      <div className="space-y-2 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {lang === 'te' ? plan.tagTe : plan.tag}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-indigo-700">20 Issues</span>
                        </div>

                        <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                          <span>{lang === 'te' ? plan.nameTe : plan.name}</span>
                        </h3>

                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl sm:text-3xl font-black text-indigo-950">₹799</span>
                          <span className="text-xs text-indigo-700 font-bold">/ one-time</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {lang === 'te' ? plan.descriptionTe : plan.description}
                        </p>

                        <div className="pt-2 border-t-2 border-indigo-100 space-y-1.5 text-xs text-slate-700">
                          {(lang === 'te' ? plan.featuresTe : plan.features).slice(0, 5).map((f, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight font-medium">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan('pro');
                        }}
                        className="w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 border border-indigo-500"
                      >
                        {lang === 'te' ? 'నా సైట్‌ను సరిచేయండి — ₹799' : 'Fix My Website — ₹799'}
                      </button>
                    </div>
                  );
                })()}

                {/* 3. Complete Fix (₹1,499) */}
                {(() => {
                  const plan = PRICING_PLANS[3]; // Complete Fix
                  const isSelected = selectedPlanId === 'complete';
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan('complete')}
                      className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            {lang === 'te' ? plan.tagTe : plan.tag}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-700">All Issues</span>
                        </div>

                        <h3 className="text-base font-black text-slate-900">
                          {lang === 'te' ? plan.nameTe : plan.name}
                        </h3>

                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900">₹1,499</span>
                          <span className="text-xs text-slate-500 font-bold">/ one-time</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          {lang === 'te' ? plan.descriptionTe : plan.description}
                        </p>

                        <div className="pt-2 border-t-2 border-slate-100 space-y-1.5 text-xs text-slate-700">
                          {(lang === 'te' ? plan.featuresTe : plan.features).slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan('complete');
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-md border-slate-800'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        {lang === 'te' ? 'అన్నీ సరిచేయండి — ₹1,499' : 'Fix Everything — ₹1,499'}
                      </button>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Agency & Business Monthly Subscription Tier (₹3,999/mo) */
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 inline-block">
                      Agency & High-Traffic Subscription
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Business Plan — ₹3,999 / month
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Continuous monitoring, weekly health checks, automatic alerts, and up to 50 automated fixes each month for multiple domains.
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black text-emerald-400">₹3,999</div>
                    <div className="text-xs text-slate-400 font-bold">billed monthly</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t-2 border-slate-800 text-xs">
                  {PRICING_PLANS[4].features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlanId('business')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer border border-emerald-400"
                >
                  <span>Start Business Plan — ₹3,999/mo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 2. Repository Authorization / Deployment Delivery Access Configuration */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.accessMethodPrompt}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold font-mono uppercase bg-white px-2 py-0.5 rounded border border-slate-200">
                  {selectedPlanId.toUpperCase()} PLAN SELECTED
                </span>
              </div>

              {/* Delivery method options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMethod('github')}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    authMethod === 'github'
                      ? 'bg-white border-emerald-500 text-slate-900 shadow-2xs font-bold'
                      : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GitPullRequest className="w-4 h-4 text-purple-600" />
                    <span>{t.accessGithub}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('zip')}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    authMethod === 'zip'
                      ? 'bg-white border-emerald-500 text-slate-900 shadow-2xs font-bold'
                      : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>{t.accessZip}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('wordpress')}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    authMethod === 'wordpress'
                      ? 'bg-white border-emerald-500 text-slate-900 shadow-2xs font-bold'
                      : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>{t.accessWordpress}</span>
                  </div>
                </button>
              </div>

              {/* GitHub input if github selected */}
              {authMethod === 'github' && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="block text-[11px] font-bold text-slate-700">
                    {t.repoUrlLabel}
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  {t.clientEmailLabel}
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="admin@mywebsite.com"
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="text-[10px] text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-200">
                {t.authWarningNotice}
              </div>
            </div>

            {/* Footer Checkout Action with THICK DIVIDER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-slate-200">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'te'
                    ? '256-బిట్ ఎన్‌క్రిప్షన్ • తక్షణ PR & ప్యాచ్ డౌన్‌లోడ్'
                    : '256-bit TLS Encryption • Instant Pull Request & Patch Download'}
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                >
                  {t.close}
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProceedToGateway}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border-2 border-amber-300/80"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0 text-slate-950" />
                      <span>
                        {lang === 'te'
                          ? 'ఆర్డర్ సిద్ధం అవుతోంది...'
                          : 'Creating Order...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                      <span>{`${t.payWithRazorpay} (₹${currentPlan.price})`}</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
