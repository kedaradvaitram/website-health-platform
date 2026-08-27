import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Lock,
  Globe,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Layers,
  Sparkles,
  Server,
  KeyRound,
  FileCode2,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

export type LegalModalType =
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'cookies'
  | 'security'
  | 'disclaimer'
  | null;

interface LegalAndContactModalsProps {
  isOpen: boolean;
  type: LegalModalType;
  onClose: () => void;
  lang: Language;
}

export const LegalAndContactModals: React.FC<LegalAndContactModalsProps> = ({
  isOpen,
  type,
  onClose,
  lang,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');
  const [contactInquiryType, setContactInquiryType] = useState('technical');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cookie preference states
  const [essentialCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [marketingCookies, setMarketingCookies] = useState(false);
  const [cookieSaved, setCookieSaved] = useState(false);

  if (!isOpen || !type) return null;

  const isTe = lang === 'te';
  const t = translations[lang];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setSubmitError(
        isTe
          ? 'దయచేసి మీ పేరు, ఈమెయిల్ మరియు సందేశాన్ని నమోదు చేయండి.'
          : 'Please fill in your name, email, and message.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          websiteUrl: contactWebsite,
          inquiryType: contactInquiryType,
          message: contactMessage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitSuccess(
          isTe
            ? `మీ సందేశం విజయవంతంగా చేరింది! టికెట్ ID: ${data.ticketId}. మా ఇంజనీరింగ్ బృందం 15 నిమిషాల్లో ${contactEmail} కు స్పందిస్తుంది.`
            : `Inquiry submitted successfully! Ticket ID: ${data.ticketId}. Our engineering team will reply within 15 minutes to ${contactEmail}.`
        );
        setContactName('');
        setContactEmail('');
        setContactWebsite('');
        setContactMessage('');
      } else {
        setSubmitError(data.error || 'Failed to send message. Please email support@websitehealth.ai');
      }
    } catch (err: any) {
      setSubmitError('Network connection error. Please email directly to support@websitehealth.ai');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCookiePreferences = () => {
    try {
      localStorage.setItem(
        'website_health_cookie_consent',
        JSON.stringify({
          essential: essentialCookies,
          analytics: analyticsCookies,
          marketing: marketingCookies,
          updatedAt: new Date().toISOString(),
        })
      );
      setCookieSaved(true);
      setTimeout(() => setCookieSaved(false), 3000);
    } catch {}
  };

  return (
    <div
      id="legal-and-contact-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="legal-and-contact-modal-card"
        className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-emerald-950/30 overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              {type === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {type === 'terms' && <FileText className="w-5 h-5" />}
              {type === 'contact' && <Mail className="w-5 h-5" />}
              {type === 'cookies' && <Lock className="w-5 h-5" />}
              {type === 'security' && <Server className="w-5 h-5" />}
              {type === 'disclaimer' && <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {type === 'privacy' && (isTe ? 'గోప్యతా విధానం (Privacy Policy)' : 'Privacy Policy')}
                {type === 'terms' && (isTe ? 'నిబంధనలు & షరతులు (Terms of Service)' : 'Terms of Service')}
                {type === 'contact' && (isTe ? 'మమ్మల్ని సంప్రదించండి (Contact & 24/7 Support)' : 'Contact & 24/7 Support')}
                {type === 'cookies' && (isTe ? 'కుకీల విధానం (Cookie Policy & Consent)' : 'Cookie Policy & Consent')}
                {type === 'security' && (isTe ? 'సెక్యూరిటీ & వర్తింపు (Security & Compliance)' : 'Security & Compliance')}
                {type === 'disclaimer' && (isTe ? 'డిస్క్లైమర్ & ఆడిట్ ప్రమాణాలు (Disclaimer & Standards)' : 'Disclaimer & Audit Standards')}
              </h2>
              <p className="text-xs text-slate-400">
                {type === 'privacy' && (isTe ? 'GDPR, CCPA & IT చట్టం 2000 కు అనుగుణంగా డేటా రక్షణ' : 'GDPR, CCPA & IT Act 2000 Compliant Data Protection')}
                {type === 'terms' && (isTe ? 'సేవలు, చెల్లింపులు & ఆటోమేటెడ్ రిపేర్ లైసెన్స్ నిబంధనలు' : 'Platform Scope, Razorpay Terms & Auto-Fix License')}
                {type === 'contact' && (isTe ? '15 నిమిషాల్లో స్పందించే సాంకేతిక మరియు ఎంటర్‌ప్రైజ్ సపోర్ట్' : '15-min Guaranteed Response • Hyderabad, Bengaluru & Global')}
                {type === 'cookies' && (isTe ? 'మీ కుకీ మరియు అనలిటిక్స్ ప్రాధాన్యతలను నిర్వహించండి' : 'Manage your telemetry & analytics preferences')}
                {type === 'security' && (isTe ? 'ISO 27001 readiness & 256-బిట్ TLS ఎన్‌క్రిప్షన్' : 'ISO 27001 Readiness & TLS 1.3 End-to-End Encryption')}
                {type === 'disclaimer' && (isTe ? 'ఆడిట్ పద్ధతులు మరియు స్వతంత్ర విశ్లేషణ ప్రమాణాలు' : 'Independent scoring algorithms & non-intrusive scanning')}
              </p>
            </div>
          </div>

          <button
            id="close-legal-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
          {/* 1. CONTACT US TAB */}
          {type === 'contact' && (
            <div className="space-y-8">
              {/* Top Contact Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>{isTe ? 'స్పందన సమయం' : 'Response Guarantee'}</span>
                  </div>
                  <p className="text-white font-extrabold text-sm">{isTe ? '15 నిమిషాల్లోపు' : '< 15 Minutes (24/7)'}</p>
                  <p className="text-xs text-slate-400">{isTe ? 'లైవ్ ఇంజనీరింగ్ సపోర్ట్' : 'Direct Engineering On-Call'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                    <Mail className="w-4 h-4" />
                    <span>{isTe ? 'ఈమెయిల్ డెస్క్' : 'Direct Email'}</span>
                  </div>
                  <a href="mailto:support@websitehealth.ai" className="text-emerald-400 hover:underline font-bold text-xs sm:text-sm block truncate">
                    support@websitehealth.ai
                  </a>
                  <p className="text-xs text-slate-400">{isTe ? 'సెక్యూరిటీ: security@websitehealth.ai' : 'Security: security@websitehealth.ai'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>{isTe ? 'హెడ్‌క్వార్టర్స్' : 'Global Hubs'}</span>
                  </div>
                  <p className="text-white font-extrabold text-xs sm:text-sm">HITEC City, Hyderabad</p>
                  <p className="text-xs text-slate-400">Bengaluru & San Francisco, CA</p>
                </div>
              </div>

              {/* Direct Support Form */}
              <div className="bg-slate-950/90 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-white text-base">
                      {isTe ? 'మా ఇంజనీరింగ్ బృందానికి సందేశం పంపండి' : 'Send Message to Senior Diagnostics Team'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isTe
                        ? 'ఆడిట్ సమస్యలు, Razorpay చెల్లింపులు, API యాక్సెస్ లేదా కస్టమ్ పరిష్కారాల కోసం'
                        : 'Inquire about audit findings, Razorpay billing, API access, or enterprise PR pipelines'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black">
                    Live SLA Active
                  </span>
                </div>

                {submitSuccess ? (
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 space-y-3 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                    <h4 className="font-black text-white text-base">
                      {isTe ? 'ధన్యవాదాలు! మీ విచారణ నమోదు చేయబడింది' : 'Inquiry Successfully Dispatched!'}
                    </h4>
                    <p className="text-xs text-emerald-300 max-w-lg mx-auto">{submitSuccess}</p>
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(null)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {isTe ? 'మరొక సందేశం పంపండి' : 'Send Another Inquiry'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {submitError && (
                      <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          {isTe ? 'మీ పూర్తి పేరు *' : 'Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={isTe ? 'ఉదా: శ్రీనివాస్ రాజు' : 'e.g. John Doe'}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          {isTe ? 'ఈమెయిల్ అడ్రస్ *' : 'Email Address *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="you@domain.com"
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          {isTe ? 'వెబ్‌సైట్ URL (ఐచ్ఛికం)' : 'Website URL (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={contactWebsite}
                          onChange={(e) => setContactWebsite(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          {isTe ? 'విచారణ రకం' : 'Inquiry Category'}
                        </label>
                        <select
                          value={contactInquiryType}
                          onChange={(e) => setContactInquiryType(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                          <option value="technical">
                            {isTe ? 'సాంకేతిక సహాయం (Technical Support)' : 'Technical Support / Audit Findings'}
                          </option>
                          <option value="billing">
                            {isTe ? 'చెల్లింపులు & బిల్లింగ్ (Razorpay Billing & Invoice)' : 'Billing, Razorpay & Invoices'}
                          </option>
                          <option value="enterprise">
                            {isTe ? 'ఎంటర్‌ప్రైజ్ & API లైసెన్స్' : 'Enterprise & Bulk API Integration'}
                          </option>
                          <option value="partnership">
                            {isTe ? 'పార్టనర్‌షిప్ & ఏజెన్సీ' : 'Agency Partnership & White-Label'}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        {isTe ? 'సందేశం / వివరణ *' : 'Detailed Message *'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={
                          isTe
                            ? 'మీ సమస్య లేదా అభ్యర్థనను ఇక్కడ వివరించండి...'
                            : 'Describe your website requirements, audit questions, or integration needs...'
                        }
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? isTe
                            ? 'సందేశం పంపుతున్నాము...'
                            : 'Dispatching Inquiry...'
                          : isTe
                          ? 'సందేశం పంపండి (Submit Message)'
                          : 'Submit Inquiry (15-min SLA)'}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* 2. PRIVACY POLICY */}
          {type === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start space-x-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 space-y-1">
                  <p className="font-bold text-white text-sm">
                    {isTe ? 'GDPR, CCPA & IT చట్టం 2000 గోప్యతా కట్టుబాటు' : 'Privacy-First Architecture & Regulatory Compliance'}
                  </p>
                  <p>
                    {isTe
                      ? 'WebsiteHealth.AI మీ అనుమతి లేకుండా ఎలాంటి వ్యక్తిగత డేటాను విక్రయించదు. ఆడిట్ ఫలితాలు కేవలం డయాగ్నస్టిక్స్ మరియు ఎస్‌ఈఓ ఇంప్రూవ్‌మెంట్ కోసం మాత్రమే ఉపయోగించబడతాయి.'
                      : 'WebsiteHealth.AI is strictly non-intrusive. We perform external passive diagnostics and never harvest, sell, or rent personal website telemetry.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '1. మేము సేకరించే సమాచారం (Information We Collect)' : '1. Information We Collect'}
                </h3>
                <p>
                  {isTe
                    ? 'మీరు ఆడిట్ కోసం నమోదు చేసే వెబ్‌సైట్ పబ్లిక్ URL, సర్వర్ ప్రతిస్పందన సమయం (TTFB), హెడర్లు, మరియు మీరు ఐచ్ఛికంగా అందించే ఈమెయిల్ అడ్రస్ మాత్రమే సేకరించబడుతుంది.'
                    : 'We collect public URL endpoints submitted for scanning, cryptographic SSL handshake data, HTTP response headers, Core Web Vitals performance benchmarks, and email addresses voluntarily provided for report delivery.'}
                </p>

                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '2. సమాచార వినియోగం (How We Use Information)' : '2. How Information is Used'}
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li>{isTe ? 'వెబ్‌సైట్ ఎస్‌ఈఓ, సెక్యూరిటీ మరియు పెర్ఫార్మెన్స్ స్కోర్‌లను లెక్కించడం' : 'Computing technical SEO, security header rankings, and Core Web Vitals telemetry'}</li>
                  <li>{isTe ? 'స్వయంచాలక కోడ్ ఫిక్స్‌లు మరియు గిట్‌హబ్ పుల్ రిక్వెస్ట్‌లను రూపొందించడం' : 'Generating 1-click code remediation patches and GitHub Pull Requests'}</li>
                  <li>{isTe ? 'మీరు కోరిన వారపు హెల్త్ నివేదికలను మీ ఈమెయిల్‌కు పంపడం' : 'Delivering requested PDF audit reports and opt-in weekly uptime monitoring digests'}</li>
                  <li>{isTe ? 'ప్లాట్‌ఫామ్ దుర్వినియోగాన్ని నిరోధించడం మరియు సైబర్ భద్రతను రక్షించడం' : 'Preventing malicious rate exhaustion and securing server-side microservices'}</li>
                </ul>

                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '3. చెల్లింపుల భద్రత (Razorpay Payment Security)' : '3. Payment & Financial Data'}
                </h3>
                <p>
                  {isTe
                    ? 'అన్ని చెల్లింపులు PCI-DSS లెవల్ 1 సర్టిఫైడ్ అయిన Razorpay ద్వారా నిర్వహించబడతాయి. మీ క్రెడిట్/డెబిట్ కార్డ్ లేదా UPI పిన్ వివరాలు మా సర్వర్‌లలో ఎప్పుడూ నిల్వ చేయబడవు.'
                    : 'All INR payments are processed through Razorpay India with 256-bit TLS encryption. WebsiteHealth.AI never stores CVV, card numbers, or UPI PINs.'}
                </p>

                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '4. మీ హక్కులు & డేటా తొలగింపు (Your Data Rights)' : '4. Your Rights & Data Erasure'}
                </h3>
                <p>
                  {isTe
                    ? 'మీరు ఎప్పుడైనా మీ స్కాన్ హిస్టరీని క్లియర్ చేసుకోవచ్చు లేదా support@websitehealth.ai కి ఈమెయిల్ చేసి మీ ఖాతా డేటాను శాశ్వతంగా తొలగించమని కోరవచ్చు.'
                    : 'Under GDPR and CCPA, you retain the right to access, rectify, or request permanent erasure of your scan records. Contact our Data Protection Officer at privacy@websitehealth.ai.'}
                </p>
              </div>
            </div>
          )}

          {/* 3. TERMS OF SERVICE */}
          {type === 'terms' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '1. సేవా వినియోగ నిబంధనలు (Acceptance of Terms)' : '1. Acceptance & Service Scope'}
                </h3>
                <p>
                  {isTe
                    ? 'WebsiteHealth.AI ప్లాట్‌ఫామ్‌ను ఉపయోగించడం ద్వారా మీరు ఈ క్రింది నిబంధనలకు అంగీకరిస్తున్నారు. మీరు అధికారం కలిగి ఉన్న లేదా పబ్లిక్‌గా అందుబాటులో ఉన్న వెబ్‌సైట్‌లను మాత్రమే ఆడిట్ చేయడానికి అనుమతి ఉంది.'
                    : 'By accessing or executing diagnostics through WebsiteHealth.AI, you agree to these Terms. You represent that you have authorization to test the submitted URLs.'}
                </p>

                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '2. ఆటోమేటెడ్ కోడ్ ఫిక్స్‌లు & గిట్‌హబ్ లైసెన్స్' : '2. Automated Remediation & GitHub PRs'}
                </h3>
                <p>
                  {isTe
                    ? 'మా ఆటోమేటెడ్ రిపేర్ ఇంజిన్ మీ కోడ్‌బేస్ కోసం ఉత్తమ సిఫార్సులను అందిస్తుంది. మీరు PR ను మీ లైవ్ ప్రొడక్షన్‌లోకి విలీనం చేసే ముందు మీ డెవలప్‌మెంట్ ఎన్విరాన్‌మెంట్‌లో పరీక్షించుకోవాలని సిఫార్సు చేయబడింది.'
                    : 'Automated remediation scripts, ZIP patches, and GitHub Pull Requests are delivered as high-precision code recommendations. Customers are encouraged to test changes in staging environments prior to production deployment.'}
                </p>

                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '3. ధరలు, రీఫండ్‌లు & చెల్లింపులు' : '3. Pricing, Subscriptions & Refund Policy'}
                </h3>
                <p>
                  {isTe
                    ? 'Razorpay ద్వారా జరిపే చెల్లింపులు తక్షణమే ధృవీకరించబడతాయి. ఒకవేళ టెక్నికల్ లోపం వల్ల కోడ్ ఫిక్స్ లేదా PDF రిపోర్ట్ అందకపోతే 100% రీఫండ్ 2-3 పనిదినాల్లో ప్రాసెస్ చేయబడుతుంది.'
                    : 'Prices are transparently shown in INR including statutory GST. If an automated repair fails due to platform runtime exceptions, a full refund is issued within 3-5 business days.'}
                </p>

                <h3 className="text-base font-extrabold text-white">
                  {isTe ? '4. పరిమిత బాధ్యత (Limitation of Liability)' : '4. Limitation of Liability'}
                </h3>
                <p>
                  {isTe
                    ? 'WebsiteHealth.AI టెక్నికల్ లోపాలను గుర్తించడంలో అత్యున్నత ఖచ్చితత్వాన్ని పాటిస్తుంది. అయితే బాహ్య హోస్టింగ్ వైఫల్యాలు లేదా మూడవ పక్షాల సర్వర్‌లలోని మార్పులకు ప్లాట్‌ఫామ్ బాధ్యత వహించదు.'
                    : 'WebsiteHealth.AI strives for 100% diagnostic accuracy based on industry-standard Lighthouse, W3C, and SSL Labs specifications. We are not liable for third-party hosting downtimes or DNS propagation delays.'}
                </p>
              </div>
            </div>
          )}

          {/* 4. COOKIE POLICY */}
          {type === 'cookies' && (
            <div className="space-y-6">
              <p>
                {isTe
                  ? 'మేము వెబ్‌సైట్ పనితీరును మెరుగుపరచడానికి, స్కాన్ హిస్టరీని మీ బ్రౌజర్‌లో సేవ్ చేయడానికి మరియు సెక్యూరిటీని ధృవీకరించడానికి కుకీలను ఉపయోగిస్తాము.'
                  : 'We use cookies and client-side storage to preserve your scan history, authenticate guest tokens, and deliver lightning-fast UI transitions.'}
              </p>

              {/* Cookie Preference Controls */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-extrabold text-white text-sm">
                      {isTe ? 'అత్యవసర కుకీలు (Strictly Necessary)' : 'Strictly Necessary Cookies'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isTe ? 'సెషన్ భద్రత, రేట్ లిమిటింగ్ మరియు ఆడిట్ ప్రాసెసింగ్ కోసం అవసరం' : 'Essential for CSRF protection, rate limiting, and scan processing'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-black">
                    {isTe ? 'ఎల్లప్పుడూ ఆన్' : 'Always Active'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-extrabold text-white text-sm">
                      {isTe ? 'అనలిటిక్స్ & పెర్ఫార్మెన్స్ కుకీలు' : 'Performance & Diagnostic Telemetry'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isTe ? 'ప్లాట్‌ఫామ్ లోడింగ్ స్పీడ్ మరియు ఎర్రర్ లాగ్‌లను మెరుగుపరచడానికి' : 'Helps measure latency and improve automated scanner accuracy'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalyticsCookies(!analyticsCookies)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      analyticsCookies ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        analyticsCookies ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-extrabold text-white text-sm">
                      {isTe ? 'రిఫరల్ & మార్కెటింగ్ కుకీలు' : 'Referral & Partner Attribution'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isTe ? 'రిఫరల్ క్రెడిట్స్ మరియు భాగస్వామ్య ప్రోగ్రామ్‌లను ట్రాక్ చేయడానికి' : 'Tracks referral rewards and agency credit bonuses'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMarketingCookies(!marketingCookies)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      marketingCookies ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        marketingCookies ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {cookieSaved && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isTe ? 'ప్రాధాన్యతలు భద్రపరచబడ్డాయి!' : 'Preferences Saved!'}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveCookiePreferences}
                    className="ml-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {isTe ? 'ఎంపికలను సేవ్ చేయండి' : 'Save Cookie Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. SECURITY & COMPLIANCE */}
          {type === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    <span>256-Bit TLS 1.3</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {isTe ? 'అన్ని నెట్‌వర్క్ కమ్యూనికేషన్లు అత్యాధునిక ఎన్‌క్రిప్షన్ ద్వారా రక్షించబడతాయి.' : 'End-to-end encryption across all diagnostic probes and REST API traffic.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                    <Server className="w-4 h-4" />
                    <span>Sandboxed Execution</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {isTe ? 'కోడ్ విశ్లేషణ పూర్తిగా ఐసోలేట్ చేయబడిన సెక్యూర్ కంటైనర్లలో జరుగుతుంది.' : 'Automated repairs execute in isolated ephemeral containers with zero persistent credentials.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-white">
                  {isTe ? 'సెక్యూరిటీ బగ్ బౌంటీ & డిస్‌క్లోజర్' : 'Responsible Vulnerability Disclosure'}
                </h3>
                <p>
                  {isTe
                    ? 'మీకు మా ప్లాట్‌ఫామ్‌లో ఏదైనా సెక్యూరిటీ లోపం కనిపిస్తే, దయచేసి నేరుగా security@websitehealth.ai కి రిపోర్ట్ చేయండి. మా భద్రతా ఇంజనీర్లు 2 గంటల్లో స్పందిస్తారు.'
                    : 'We welcome reports from security researchers. Please report potential vulnerabilities to security@websitehealth.ai for rapid triage within 2 hours.'}
                </p>
              </div>
            </div>
          )}

          {/* 6. DISCLAIMER & METHODOLOGY */}
          {type === 'disclaimer' && (
            <div className="space-y-6">
              <p>
                {isTe
                  ? 'WebsiteHealth.AI ఆడిట్ స్కోర్‌లు Google Lighthouse, Chromium V8 ఇంజిన్, W3C ప్రమాణాలు మరియు SSL Labs మార్గదర్శకాల ఆధారంగా రూపొందించబడ్డాయి.'
                  : 'Diagnostic scoring algorithms follow Google Lighthouse 11.x, Chromium headless telemetry, WCAG 2.1 AA accessibility rules, and Mozilla Observatory security standards.'}
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-white">
                  {isTe ? 'స్వతంత్ర విశ్లేషణ ప్రకటన' : 'Independent Platform Notice'}
                </p>
                <p className="text-slate-400">
                  {isTe
                    ? 'ఈ ప్లాట్‌ఫామ్ ఒక స్వతంత్ర వెబ్ డయాగ్నస్టిక్స్ సాధనం. Google, Razorpay, లేదా GitHub పేర్లు మరియు ట్రేడ్‌మార్క్‌లు కేవలం సాంకేతిక అనుసంధానం మరియు వివరణ కొరకు మాత్రమే ఉపయోగించబడ్డాయి.'
                    : 'WebsiteHealth.AI is an independent engineering utility. Product names, logos, and brands (Google, Razorpay, GitHub) are property of their respective owners and used solely for compatibility identification.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-bold">WebsiteHealth.AI Enterprise Trust</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            {isTe ? 'మూసివేయి' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
