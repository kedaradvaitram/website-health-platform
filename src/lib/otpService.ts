import emailjs from '@emailjs/browser';
import { db, doc, setDoc, getDoc, serverTimestamp } from './firebase';

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  isUsed: boolean;
  createdAt: number;
}

export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

const OTP_STORAGE_KEY_PREFIX = 'website_health_otp_';
const EMAILJS_CONFIG_KEY = 'website_health_emailjs_config';

/**
 * Retrieves configured EmailJS keys (from LocalStorage or Vite Env)
 */
export function getEmailJsConfig(): EmailJsConfig {
  let savedConfig: Partial<EmailJsConfig> = {};
  try {
    const raw = localStorage.getItem(EMAILJS_CONFIG_KEY);
    if (raw) {
      savedConfig = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('EmailJS config read note:', e);
  }

  const env = (import.meta as any).env || {};

  // If savedConfig has legacy/placeholder or invalid service ID, discard it in favor of actual active key
  const invalidServiceIds = ['service_websitehealth', 'service_6r7f7pt', ''];
  const isInvalidSaved = savedConfig.serviceId && invalidServiceIds.includes(savedConfig.serviceId);

  const resolvedServiceId = (!savedConfig.serviceId || isInvalidSaved)
    ? (env.VITE_EMAILJS_SERVICE_ID || 'service_bwsu8qb')
    : savedConfig.serviceId;

  const resolvedTemplateId = 
    (savedConfig.templateId && savedConfig.templateId !== 'template_otp' && savedConfig.templateId !== '')
      ? savedConfig.templateId
      : (env.VITE_EMAILJS_TEMPLATE_ID || 'template_4cn2zb9');

  const resolvedPublicKey = 
    (savedConfig.publicKey && savedConfig.publicKey !== '')
      ? savedConfig.publicKey
      : (env.VITE_EMAILJS_PUBLIC_KEY || 'cmd3IK2dEUP4YxFCj');

  const finalConfig = {
    serviceId: resolvedServiceId,
    templateId: resolvedTemplateId,
    publicKey: resolvedPublicKey,
  };

  // If localStorage had invalid old keys, overwrite with clean config
  if (isInvalidSaved) {
    try {
      localStorage.setItem(EMAILJS_CONFIG_KEY, JSON.stringify(finalConfig));
    } catch (_) {}
  }

  return finalConfig;
}

/**
 * Saves user EmailJS credentials locally for browser persistence
 */
export function saveEmailJsConfig(config: EmailJsConfig): void {
  try {
    localStorage.setItem(EMAILJS_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('EmailJS config save note:', e);
  }
}

/**
 * Generates a cryptographic / cryptographically randomized 6-digit OTP
 */
export function generateRandom6DigitOtp(): string {
  const array = new Uint32Array(1);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
    const code = (array[0] % 900000) + 100000;
    return code.toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Dispatches a real 6-digit OTP code to the recipient email address via EmailJS
 * Persists the verification payload in Firestore + SessionStorage with a 10-minute validity.
 */
export async function send6DigitEmailOtp(
  email: string,
  name?: string,
  overrideConfig?: EmailJsConfig
): Promise<{ 
  success: boolean; 
  code: string; 
  message: string; 
  emailSent: boolean;
  errorDetails?: string;
  configUsed: EmailJsConfig;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const code = generateRandom6DigitOtp();
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

  const otpData: OtpRecord = {
    email: normalizedEmail,
    code,
    expiresAt,
    attempts: 0,
    isUsed: false,
    createdAt: now,
  };

  // 1. Save in SessionStorage for zero-latency client verification
  try {
    sessionStorage.setItem(`${OTP_STORAGE_KEY_PREFIX}${normalizedEmail}`, JSON.stringify(otpData));
  } catch (e) {
    console.warn('SessionStorage OTP save note:', e);
  }

  // 2. Persist in Firebase Cloud Firestore
  try {
    const docId = normalizedEmail.replace(/[^a-z0-9]/g, '_');
    const otpRef = doc(db, 'otp_verifications', docId);
    await setDoc(otpRef, {
      email: normalizedEmail,
      code,
      expiresAt,
      isUsed: false,
      createdAt: serverTimestamp(),
      recipientName: name || normalizedEmail.split('@')[0],
    });
  } catch (err) {
    console.warn('Firestore OTP persistence warning:', err);
  }

  // 3. Dispatch real email via EmailJS
  let emailSent = false;
  let errorDetails: string | undefined = undefined;
  const config = overrideConfig || getEmailJsConfig();

  if (config.publicKey && config.serviceId && config.templateId) {
    try {
      const cleanServiceId = config.serviceId.trim();
      const cleanTemplateId = config.templateId.trim();
      const cleanPublicKey = config.publicKey.trim();

      // Explicitly initialize EmailJS with the public key
      emailjs.init({ publicKey: cleanPublicKey });

      const templateParams = {
        to_email: normalizedEmail,
        email: normalizedEmail,
        user_email: normalizedEmail,
        recipient_email: normalizedEmail,
        reply_to: normalizedEmail,
        to_name: name || normalizedEmail.split('@')[0] || 'Valued User',
        user_name: name || normalizedEmail.split('@')[0] || 'Valued User',
        name: name || normalizedEmail.split('@')[0] || 'Valued User',
        otp_code: code,
        otp: code,
        code: code,
        passcode: code,
        verification_code: code,
        token: code,
        message: `Your secure 6-digit verification code for WebsiteHealth.AI is ${code}. It expires in 10 minutes.`,
        app_name: 'WebsiteHealth.AI',
        valid_mins: '10',
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      };

      console.log(`[EmailJS] Dispatching OTP email to ${normalizedEmail} using Service: ${cleanServiceId}, Template: ${cleanTemplateId}`);

      const response = await emailjs.send(
        cleanServiceId,
        cleanTemplateId,
        templateParams,
        cleanPublicKey
      );

      console.log('[EmailJS] Dispatch Response:', response);

      if (response.status === 200 || response.text === 'OK') {
        emailSent = true;
      }
    } catch (emailErr: any) {
      console.error('[EmailJS] Transmission error:', emailErr);
      errorDetails = emailErr?.text || emailErr?.message || (typeof emailErr === 'object' ? JSON.stringify(emailErr) : String(emailErr));
    }
  } else {
    console.warn('[EmailJS] Missing credentials:', config);
    errorDetails = 'Missing EmailJS configuration credentials.';
  }

  return {
    success: true,
    code,
    emailSent,
    errorDetails,
    configUsed: config,
    message: emailSent
      ? `A real 6-digit OTP has been sent to ${normalizedEmail}. Please check your inbox and spam folder.`
      : `Verification code generated for ${normalizedEmail}.`,
  };
}

/**
 * Validates the entered 6-digit OTP code against stored records
 */
export async function verify6DigitOtp(
  email: string,
  inputCode: string
): Promise<{ isValid: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanInput = inputCode.trim();

  if (cleanInput.length !== 6 || !/^\d{6}$/.test(cleanInput)) {
    return { isValid: false, error: 'Please enter a valid 6-digit numeric OTP.' };
  }

  // Check 1: Session Storage verification
  try {
    const raw = sessionStorage.getItem(`${OTP_STORAGE_KEY_PREFIX}${normalizedEmail}`);
    if (raw) {
      const parsed: OtpRecord = JSON.parse(raw);
      if (parsed.isUsed) {
        return { isValid: false, error: 'This OTP has already been used. Please request a new code.' };
      }
      if (Date.now() > parsed.expiresAt) {
        return { isValid: false, error: 'OTP code has expired (10 minute limit). Please request a new code.' };
      }
      if (parsed.code === cleanInput) {
        parsed.isUsed = true;
        sessionStorage.setItem(`${OTP_STORAGE_KEY_PREFIX}${normalizedEmail}`, JSON.stringify(parsed));
        return { isValid: true };
      }
    }
  } catch (e) {
    console.warn('Session verification note:', e);
  }

  // Check 2: Firestore Database verification
  try {
    const docId = normalizedEmail.replace(/[^a-z0-9]/g, '_');
    const otpRef = doc(db, 'otp_verifications', docId);
    const snap = await getDoc(otpRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data.isUsed) {
        return { isValid: false, error: 'This OTP has already been used.' };
      }
      if (Date.now() > data.expiresAt) {
        return { isValid: false, error: 'OTP code has expired.' };
      }
      if (data.code === cleanInput) {
        await setDoc(otpRef, { ...data, isUsed: true }, { merge: true });
        return { isValid: true };
      }
    }
  } catch (err) {
    console.warn('Firestore OTP verification note:', err);
  }

  return { isValid: false, error: 'Invalid 6-digit OTP code. Please check your email and try again.' };
}
