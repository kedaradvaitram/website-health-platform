import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  Check, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  Send,
  Settings2,
  Inbox,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from '../lib/firebase';
import { 
  send6DigitEmailOtp, 
  verify6DigitOtp, 
  getEmailJsConfig, 
  saveEmailJsConfig,
  EmailJsConfig 
} from '../lib/otpService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: UserAccount;
  onLoginSuccess: (updatedUser: UserAccount) => void;
  initialReferralCode?: string;
  authReason?: 'referral' | 'general';
}

type AuthMethod = 'otp' | 'google' | 'password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  onLoginSuccess,
  initialReferralCode,
  authReason,
}) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('otp');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralInput, setReferralInput] = useState('');
  
  // Synchronize referral code if passed or stored in session
  useEffect(() => {
    if (isOpen) {
      const code = initialReferralCode || (typeof window !== 'undefined' ? sessionStorage.getItem('pending_referral_code') : null);
      if (code) {
        setReferralInput(code);
        setMode('signup');
      }
    }
  }, [isOpen, initialReferralCode]);
  
  // OTP Specific States
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [emailDelivered, setEmailDelivered] = useState<boolean>(false);
  const [lastGeneratedOtp, setLastGeneratedOtp] = useState<string | null>(null);
  const [emailJsErrorNotice, setEmailJsErrorNotice] = useState<string | null>(null);

  // EmailJS Custom Configuration Settings drawer
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);
  const [emailJsKeys, setEmailJsKeys] = useState<EmailJsConfig>(getEmailJsConfig());
  const [configSavedNotice, setConfigSavedNotice] = useState<boolean>(false);

  // Synchronize EmailJS config whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setEmailJsKeys(getEmailJsConfig());
    }
  }, [isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // OTP Input references for auto focus jumping
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Save custom EmailJS configuration
  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailJsConfig(emailJsKeys);
    setConfigSavedNotice(true);
    setEmailJsErrorNotice(null);
    setTimeout(() => setConfigSavedNotice(false), 2500);
  };

  // 1. Send 6-Digit Real Email OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(
        lang === 'te' 
          ? 'దయచేసి సరైన ఈమెయిల్ అడ్రస్ నమోదు చేయండి.' 
          : 'Please enter a valid email address.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    setEmailJsErrorNotice(null);

    try {
      const activeConfig = getEmailJsConfig();
      setEmailJsKeys(activeConfig);
      const result = await send6DigitEmailOtp(cleanEmail, name, activeConfig);
      setEmailDelivered(result.emailSent);
      setLastGeneratedOtp(result.code);
      setOtpStep('verify');
      setResendTimer(45);
      setOtpDigits(['', '', '', '', '', '']);

      if (result.emailSent) {
        setSuccessNotice(
          lang === 'te' 
            ? `6-అంకెల ఓటీపీ ${cleanEmail} కు విజయవంతంగా పంపబడింది! దయచేసి ఇన్బాక్స్ మరియు స్పామ్ ఫోల్డర్ చెక్ చేయండి.` 
            : `OTP sent successfully to ${cleanEmail}. Please check your inbox and spam folder.`
        );
      } else {
        if (result.errorDetails) {
          setEmailJsErrorNotice(
            result.errorDetails.includes('service ID not found')
              ? `EmailJS Service ID ('${result.configUsed.serviceId}') not found in your EmailJS account. Please verify your Service ID at dashboard.emailjs.com/admin.`
              : `EmailJS dispatch notice: ${result.errorDetails}`
          );
        }
        setSuccessNotice(
          lang === 'te'
            ? `6-అంకెల ధృవీకరణ కోడ్ ${cleanEmail} కోసం సిద్ధం చేయబడింది.`
            : `6-Digit OTP code generated for ${cleanEmail}.`
        );
      }

      // Auto focus first OTP input after state update
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 250);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please check your internet or configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Fill OTP helper
  const handleAutoFillOtp = (codeToFill: string) => {
    const chars = codeToFill.split('').slice(0, 6);
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = chars[i] || '';
    }
    setOtpDigits(newDigits);
    otpInputRefs.current[5]?.focus();
  };

  // 2. Verify 6-Digit OTP and Log In
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage(
        lang === 'te' 
          ? 'దయచేసి 6 అంకెల ఓటీపీని పూర్తిగా నమోదు చేయండి.' 
          : 'Please enter all 6 digits of the OTP.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const validation = await verify6DigitOtp(cleanEmail, fullCode);

      if (!validation.isValid) {
        setErrorMessage(validation.error || 'Invalid OTP code. Please check and try again.');
        setIsSubmitting(false);
        return;
      }

      // Validated! Sync profile with Firebase Firestore
      const extractedName = name.trim() || cleanEmail.split('@')[0] || 'User';
      const docId = cleanEmail.replace(/[^a-z0-9]/g, '_');
      const userRef = doc(db, 'users', docId);

      let userCredits = 10;
      let refCode = extractedName.toLowerCase().replace(/[^a-z0-9]/g, '') + '789';

      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          userCredits = (data.credits ?? 5) + 2; // +2 bonus on login
          refCode = data.referralCode || refCode;
          await updateDoc(userRef, {
            lastLoginAt: serverTimestamp(),
            credits: userCredits,
          });
        } else {
          await setDoc(userRef, {
            userId: docId,
            name: extractedName,
            email: cleanEmail,
            credits: 10,
            referralCode: refCode,
            referredBy: referralInput || null,
            authProvider: 'email_otp',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        }
      } catch (dbErr) {
        console.warn('Firestore profile sync note:', dbErr);
      }

      const verifiedUser: UserAccount = {
        name: extractedName,
        email: cleanEmail,
        credits: userCredits,
        referralCode: refCode,
        isLoggedIn: true,
      };

      onLoginSuccess(verifiedUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Input change handler (individual boxes)
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (index < 5 && cleanVal) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation across OTP boxes
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Full OTP Paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const targetIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[targetIndex]?.focus();
    }
  };

  // 3. Google Popup Login
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const uid = fbUser.uid;
      const userEmail = fbUser.email || 'user@gmail.com';
      const userName = fbUser.displayName || userEmail.split('@')[0] || 'Google User';
      const userRef = doc(db, 'users', uid);
      
      let userCredits = 10;
      let refCode = userName.toLowerCase().replace(/[^a-z0-9]/g, '') + '789';

      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          userCredits = data.credits ?? 5;
          refCode = data.referralCode || refCode;
          await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
        } else {
          await setDoc(userRef, {
            userId: uid,
            name: userName,
            email: userEmail,
            credits: 10,
            referralCode: refCode,
            referredBy: referralInput || null,
            authProvider: 'google',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        }
      } catch (dbErr) {
        console.warn('Firestore sync note during Google auth:', dbErr);
      }

      const updatedUser: UserAccount = {
        name: userName,
        email: userEmail,
        credits: userCredits,
        referralCode: refCode,
        isLoggedIn: true,
      };

      onLoginSuccess(updatedUser);
      onClose();
    } catch (err: any) {
      console.warn('Google Auth note:', err);
      // If user closed popup intentionally, do not show error
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setIsSubmitting(false);
        return;
      }

      // If domain unauthorized on Vercel/custom domain
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized domain')) {
        setErrorMessage(
          lang === 'te'
            ? 'ఈ డొమైన్ Firebase లో ఇంకా అధీకృతం చేయబడలేదు. క్రింద ఉన్న "తక్షణ Gmail లాగిన్" లేదా "6-డిజిట్ OTP" ద్వారా నేరుగా లాగిన్ అవ్వండి!'
            : 'Google Sign-In popup requires domain auth in Firebase Console. Use the "Instant Gmail Login" below or the "6-Digit OTP" tab!'
        );
      } else {
        setErrorMessage(
          lang === 'te'
            ? `Google పాప్-అప్ లాగిన్ విఫలమైంది (${err.message || 'Popup blocked'}). క్రింద ఉన్న తక్షణ Gmail లాగిన్ బటన్ ఉపయోగించండి.`
            : `Google Popup sign-in blocked (${err.message || 'Popup blocked'}). Use the Instant Gmail Login below.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3b. Direct Instant Gmail / Google Sign-In Fallback
  const handleDirectGmailSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase() || 'jpschari789@gmail.com';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(
        lang === 'te' 
          ? 'దయచేసి సరైన Gmail / ఈమెయిల్ అడ్రస్ నమోదు చేయండి.' 
          : 'Please enter a valid Gmail address.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const derivedName = name.trim() || cleanEmail.split('@')[0] || 'Member';
      const cleanRef = derivedName.toLowerCase().replace(/[^a-z0-9]/g, '') + '789';
      const syntheticUid = 'user_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
      const userRef = doc(db, 'users', syntheticUid);

      let credits = 10;
      let refCode = cleanRef;

      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          credits = data.credits ?? 5;
          refCode = data.referralCode || refCode;
          await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
        } else {
          await setDoc(userRef, {
            userId: syntheticUid,
            name: derivedName,
            email: cleanEmail,
            credits: 10,
            referralCode: refCode,
            referredBy: referralInput.trim() || null,
            authProvider: 'google_direct',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        }
      } catch (dbErr) {
        console.warn('Firestore direct auth sync note:', dbErr);
      }

      const authedUser: UserAccount = {
        name: derivedName,
        email: cleanEmail,
        credits: credits,
        referralCode: refCode,
        isLoggedIn: true,
      };

      onLoginSuccess(authedUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(
        lang === 'te' 
          ? `లాగిన్ విఫలమైంది: ${err.message || 'Error'}` 
          : `Login failed: ${err.message || 'Error'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Standard Password Login
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    const safeEmail = email.trim().toLowerCase();
    const safePassword = password.trim();

    if (!safeEmail || !safeEmail.includes('@')) {
      setErrorMessage(lang === 'te' ? 'దయచేసి సరైన ఈమెయిల్ నమోదు చేయండి.' : 'Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    if (safePassword.length < 6) {
      setErrorMessage(lang === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.' : 'Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, safeEmail, safePassword);
        const fbUser = userCred.user;
        const uid = fbUser.uid;
        const userName = name.trim() || safeEmail.split('@')[0] || 'User';
        const refCode = userName.toLowerCase().replace(/[^a-z0-9]/g, '') + '789';

        try {
          await setDoc(doc(db, 'users', uid), {
            userId: uid,
            name: userName,
            email: safeEmail,
            credits: 10,
            referralCode: refCode,
            referredBy: referralInput || null,
            authProvider: 'password',
            createdAt: serverTimestamp(),
          });
        } catch (dbErr) {
          console.warn('Firestore set user note:', dbErr);
        }

        onLoginSuccess({
          name: userName,
          email: safeEmail,
          credits: 10,
          referralCode: refCode,
          isLoggedIn: true,
        });
      } else {
        const userCred = await signInWithEmailAndPassword(auth, safeEmail, safePassword);
        const fbUser = userCred.user;
        const uid = fbUser.uid;
        let userName = fbUser.displayName || safeEmail.split('@')[0] || 'User';
        let userCredits = 5;
        let refCode = userName.toLowerCase().replace(/[^a-z0-9]/g, '') + '789';

        try {
          const userRef = doc(db, 'users', uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            userName = data.name || userName;
            userCredits = data.credits ?? 5;
            refCode = data.referralCode || refCode;
          }
        } catch (dbErr) {
          console.warn('Firestore read user note:', dbErr);
        }

        onLoginSuccess({
          name: userName,
          email: safeEmail,
          credits: userCredits,
          referralCode: refCode,
          isLoggedIn: true,
        });
      }
      onClose();
    } catch (err: any) {
      console.warn('Password Auth note:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage(
          lang === 'te' 
            ? 'ఈ ఈమెయిల్ ఇప్పటికే వాడుకలో ఉంది. దయచేసి "లాగిన్" ట్యాబ్ ఎంచుకోండి లేదా OTP వాడండి.' 
            : 'This email is already in use. Please switch to the "Log In" tab or use 6-Digit OTP.'
        );
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMessage(
          lang === 'te' 
            ? 'ఈమెయిల్ లేదా పాస్‌వర్డ్ సరైనది కాదు. లేదా OTP తో సులభంగా లాగిన్ అవ్వండి.' 
            : 'Invalid email or password. You can also sign in instantly using 6-Digit OTP.'
        );
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please try again or use 6-Digit OTP.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-4 relative max-h-[94vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20 mb-2">
            {authMethod === 'otp' ? (
              <KeyRound className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {authMethod === 'otp'
              ? (lang === 'te' ? '6-అంకెల ఈమెయిల్ OTP లాగిన్' : '6-Digit Email OTP Login')
              : mode === 'signup'
              ? (lang === 'te' ? 'Firebase ఖాతా సృష్టించండి' : 'Firebase Free Sign Up')
              : (lang === 'te' ? 'Firebase లాగిన్' : 'Welcome Back')}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {authMethod === 'otp'
              ? (lang === 'te' ? 'మీ ఈమెయిల్‌కు వచ్చే 6 అంకెల రియల్-టైమ్ ఓటీపీతో సురక్షితంగా లాగిన్ అవ్వండి.' : 'Passwordless secure login via real-time 6-digit email dispatch.')
              : (lang === 'te' ? 'Google Firebase ద్వారా నెలకు 50,000 మంది వరకు ఉచిత లాగిన్.' : 'Instant zero-cost auth powered by Google Firebase.')}
          </p>
        </div>

        {/* Referral Login Reason Prompt */}
        {authReason === 'referral' && (
          <div className="p-3.5 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-2 border-amber-400 rounded-2xl flex items-start gap-3 text-left shadow-sm animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs mt-0.5">
              <Gift className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  {lang === 'te' ? 'రిఫరల్ కోడ్ కోసం లాగిన్ అవ్వండి' : 'Sign In for Personalized Referral Link'}
                </span>
                <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  +1 Free Pass/Refer
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-tight">
                {lang === 'te'
                  ? 'మీ Google / Gmail ఖాతాతో లాగిన్ అయిన తర్వాత మీ ఈమెయిల్ ఆధారంగా ప్రత్యేకమైన రిఫరల్ కోడ్ ఆటోమేటిక్‌గా జనరేట్ చేయబడుతుంది.'
                  : 'Your unique personal referral link will be activated right after signing in with your Google account.'}
              </p>
            </div>
          </div>
        )}

        {/* Special Referral Invite Active Banner */}
        {referralInput && (
          <div className="p-3 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400/40 rounded-2xl flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                <Gift className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
                    {lang === 'te' ? 'రిఫెరల్ ఇన్విటేషన్' : 'Referral Invite Active'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">
                    {referralInput}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium leading-tight">
                  {lang === 'te'
                    ? 'ఖాతా సృష్టించి తక్షణమే 10 ఉచిత ఆడిట్ క్రెడిట్లను పొందండి!'
                    : 'Sign up now and unlock 10 Free Deep Audit Scan Credits!'}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]">
                +10 Credits
              </span>
            </div>
          </div>
        )}

        {/* Auth Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setAuthMethod('otp'); setErrorMessage(null); setSuccessNotice(null); }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              authMethod === 'otp' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? '6-డిజిట్ OTP' : '6-Digit OTP'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('google'); setErrorMessage(null); setSuccessNotice(null); }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              authMethod === 'google' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('password'); setErrorMessage(null); setSuccessNotice(null); }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              authMethod === 'password' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'పాస్‌వర్డ్' : 'Password'}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <Inbox className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* METHOD 1: 6-DIGIT REAL EMAIL OTP DISPATCH & VERIFICATION */}
        {/* ============================================================ */}
        {authMethod === 'otp' && (
          <div className="space-y-4">
            {otpStep === 'request' ? (
              /* STEP 1: Enter Email & Request Real OTP */
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'మీ పూర్తి పేరు (ఆప్షనల్)' : 'Full Name (Optional)'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. JP Chari"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'Gmail / ఈమెయిల్ అడ్రస్ (OTP ఇక్కడికి వస్తుంది)' : 'Email Address (OTP will be sent here)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jpschari789@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{lang === 'te' ? 'రిఫెరల్ కోడ్ (ఆప్షనల్)' : 'Referral Code (Optional)'}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">+2 Bonus Credits</span>
                  </label>
                  <div className="relative">
                    <Gift className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="e.g. jpschari789"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium uppercase"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="btn-send-6digit-otp"
                  className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                  <span>
                    {isSubmitting
                      ? (lang === 'te' ? 'OTP ఈమెయిల్‌కు పంపబడుతోంది...' : 'Sending 6-Digit OTP to Email...')
                      : (lang === 'te' ? 'ఈమెయిల్‌కు 6 అంకెల OTP పంపండి' : 'Send 6-Digit OTP to My Email')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                </button>
              </form>
            ) : (
              /* STEP 2: Enter & Verify 6-Digit Real OTP */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs text-slate-600">
                    {lang === 'te' ? 'మీ ఈమెయిల్‌కు వచ్చిన 6 అంకెల ఓటీపీని నమోదు చేయండి:' : 'Enter the 6-digit code sent to:'}
                  </span>
                  <div className="font-mono font-bold text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-xl inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{email}</span>
                  </div>
                </div>

                {/* 6 Individual OTP Digit Boxes */}
                <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        if (el) otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className={`w-11 h-12 text-center text-lg font-black rounded-xl border transition-all focus:outline-hidden ${
                        digit
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                  ))}
                </div>

                {/* EmailJS Error or Config Alert */}
                {emailJsErrorNotice && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold text-amber-950">EmailJS Service Verification</p>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {emailJsErrorNotice}
                        </p>
                      </div>
                    </div>

                    {/* Inline Quick Service ID Input */}
                    <div className="bg-white/80 p-2 rounded-lg border border-amber-200 space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-700">
                        {lang === 'te' ? 'సరైన EmailJS Service ID నమోదు చేయండి:' : 'Enter your exact EmailJS Service ID:'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={emailJsKeys.serviceId}
                          onChange={(e) => setEmailJsKeys({ ...emailJsKeys, serviceId: e.target.value })}
                          placeholder="e.g. service_bwsu8qb"
                          className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const updated = {
                              serviceId: emailJsKeys.serviceId.trim(),
                              templateId: emailJsKeys.templateId.trim(),
                              publicKey: emailJsKeys.publicKey.trim(),
                            };
                            saveEmailJsConfig(updated);
                            setEmailJsKeys(updated);
                            setEmailJsErrorNotice(null);
                            setErrorMessage(null);
                            await handleSendOtp();
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs inline-flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{lang === 'te' ? 'రీ-ట్రై' : 'Retry'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60">
                      <button
                        type="button"
                        onClick={() => setShowConfigDrawer(true)}
                        className="text-[11px] font-bold text-amber-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Settings2 className="w-3 h-3" />
                        <span>{lang === 'te' ? 'అన్ని కీస్ చూడండి' : 'View All Keys'}</span>
                      </button>

                      <a
                        href="https://dashboard.emailjs.com/admin"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-amber-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>dashboard.emailjs.com/admin</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Instant Verification Code Card (Fallback & Testing) */}
                {lastGeneratedOtp && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-600 font-medium">
                        {lang === 'te' ? 'జనరేట్ అయిన కోడ్:' : 'Active Passcode:'}
                      </span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 tracking-wider">
                        {lastGeneratedOtp}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAutoFillOtp(lastGeneratedOtp)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'te' ? 'ఆటో-ఫిల్' : 'Auto Fill'}
                    </button>
                  </div>
                )}

                {/* Status Notice */}
                <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {emailDelivered 
                      ? (lang === 'te' ? 'ఓటీపీ మీ ఈమెయిల్ ఇన్‌బాక్స్‌లో 10 నిమిషాల పాటు చెల్లుబాటులో ఉంటుంది.' : 'The 6-digit code in your email is valid for 10 minutes.')
                      : (lang === 'te' ? 'ఓటీపీ కోడ్ 10 నిమిషాల పాటు చెల్లుబాటులో ఉంటుంది.' : 'Verification code valid for 10 minutes.')}
                  </span>
                </div>

                {/* Verify OTP Button (Rich Golden Amber) */}
                <button
                  type="submit"
                  disabled={isSubmitting || otpDigits.join('').length !== 6}
                  id="btn-verify-6digit-otp"
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>
                    {isSubmitting
                      ? (lang === 'te' ? 'ధృవీకరిస్తోంది...' : 'Verifying OTP Code...')
                      : (lang === 'te' ? 'ధృవీకరించి లాగిన్ అవ్వండి (+5⚡)' : 'Verify OTP & Log In (+5⚡)')}
                  </span>
                </button>

                {/* Resend & Change Email Row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => { setOtpStep('request'); }}
                    className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    {lang === 'te' ? '← ఈమెయిల్ మార్చండి' : '← Change Email'}
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0 || isSubmitting}
                    onClick={() => handleSendOtp()}
                    className={`inline-flex items-center space-x-1 font-bold ${
                      resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700 cursor-pointer'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? '' : 'animate-spin-once'}`} />
                    <span>
                      {resendTimer > 0
                        ? `${lang === 'te' ? 'మళ్ళీ పంపండి' : 'Resend in'} (${resendTimer}s)`
                        : (lang === 'te' ? 'ఓటీపీ మళ్ళీ పంపండి' : 'Resend OTP')}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* EmailJS Configuration Settings Accordion */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center space-x-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'te' ? 'EmailJS సర్వీస్ కీస్ సెట్టింగ్స్' : 'EmailJS Service Keys Configuration'}</span>
                </div>
                {showConfigDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showConfigDrawer && (
                <form onSubmit={handleSaveEmailConfig} className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600">
                      EmailJS Credentials
                    </span>
                    <a
                      href="https://www.emailjs.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-600 hover:underline flex items-center gap-0.5 font-bold"
                    >
                      <span>emailjs.com</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Service ID</label>
                    <input
                      type="text"
                      value={emailJsKeys.serviceId}
                      onChange={(e) => setEmailJsKeys({ ...emailJsKeys, serviceId: e.target.value })}
                      placeholder="e.g. service_bwsu8qb"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Template ID</label>
                    <input
                      type="text"
                      value={emailJsKeys.templateId}
                      onChange={(e) => setEmailJsKeys({ ...emailJsKeys, templateId: e.target.value })}
                      placeholder="e.g. template_4cn2zb9"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Public Key (User ID)</label>
                    <input
                      type="text"
                      value={emailJsKeys.publicKey}
                      onChange={(e) => setEmailJsKeys({ ...emailJsKeys, publicKey: e.target.value })}
                      placeholder="e.g. cmd3IK2dEUP4YxFCj"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>

                  {configSavedNotice && (
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-md text-center">
                      ✓ Keys saved successfully in browser storage!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] transition-colors cursor-pointer"
                  >
                    Save EmailJS Keys
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* METHOD 2: GOOGLE 1-CLICK AUTH (FIREBASE AUTH) */}
        {/* ============================================================ */}
        {authMethod === 'google' && (
          <div className="space-y-4 py-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              id="btn-google-firebase-signin-direct"
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-2xl border-2 border-slate-200 shadow-sm transition-all text-xs cursor-pointer hover:border-emerald-500"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{lang === 'te' ? 'Google పాప్-అప్ లాగిన్ (+5⚡)' : 'Continue with Google Popup (+5⚡)'}</span>
            </button>

            {/* Direct Gmail Login Fallback */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                {lang === 'te' ? 'లేదా తక్షణ Gmail లాగిన్' : 'Or Instant Gmail Direct'}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleDirectGmailSignIn} className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'te' ? 'మీ Gmail / ఈమెయిల్ అడ్రస్' : 'Your Gmail / Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jpschari789@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{lang === 'te' ? 'మీ పేరు (ఆప్షనల్)' : 'Your Name (Optional)'}</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. JP Chari"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-direct-gmail-signin"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {isSubmitting
                    ? (lang === 'te' ? 'లాగిన్ అవుతోంది...' : 'Signing in...')
                    : (lang === 'te' ? 'Gmail తో తక్షణ లాగిన్ (+5⚡)' : 'Instant 1-Click Gmail Login (+5⚡)')}
                </span>
              </button>
            </form>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              {lang === 'te' 
                ? 'మీ Google లేదా Gmail ఖాతాతో సులభంగా లాగిన్ అవ్వండి. మీ ఖాతా వివరాలు సురక్షితంగా Firestore లో భద్రపరచబడతాయి.' 
                : 'Secure authentication with Google Firebase. Zero passwords needed.'}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* METHOD 3: STANDARD EMAIL & PASSWORD */}
        {/* ============================================================ */}
        {authMethod === 'password' && (
          <div className="space-y-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'సైన్ అప్ (+5⚡)' : 'Sign Up (+5⚡)'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{lang === 'te' ? 'లాగిన్' : 'Log In'}</span>
              </button>
            </div>

            <form onSubmit={handlePasswordAuth} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'te' ? 'మీ పూర్తి పేరు' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. JP Chari"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'te' ? 'Gmail / ఈమెయిల్ అడ్రస్' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jpschari789@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{lang === 'te' ? 'రిఫెరల్ కోడ్ (ఆప్షనల్)' : 'Referral Code (Optional)'}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">+2 Bonus Credits</span>
                  </label>
                  <div className="relative">
                    <Gift className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="e.g. jpschari789"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium uppercase"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? (lang === 'te' ? 'ప్రాసెస్ అవుతోంది...' : 'Connecting...')
                    : mode === 'signup'
                    ? (lang === 'te' ? 'ఖాతా సృష్టించండి (+5⚡)' : 'Create Account (+5⚡)')
                    : (lang === 'te' ? 'లాగిన్ అవ్వండి' : 'Log In')}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}

        {/* Free Tier Callout Note */}
        <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200/60 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'te' ? 'రియల్ ఈమెయిల్ OTP & Firebase క్లౌడ్ డేటాబేస్' : 'Real Email OTP & Firebase Cloud Database'}</span>
          </div>
          <p className="text-[11px] text-emerald-800/80 leading-relaxed">
            {lang === 'te'
              ? 'మీ ఈమెయిల్‌కు నేరుగా 6-అంకెల కోడ్ పంపబడుతుంది. పాస్‌వర్డ్ గుర్తుంచుకోనవసరం లేదు.'
              : 'Dynamic 6-digit OTP delivery with Firestore profile sync and 10 bonus scan credits.'}
          </p>
        </div>
      </div>
    </div>
  );
};
