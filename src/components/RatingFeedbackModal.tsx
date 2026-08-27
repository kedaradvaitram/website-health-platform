import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, ShieldCheck, Zap, Globe, MessageSquare, Award, Heart, ThumbsUp, ArrowRight } from 'lucide-react';
import { Language, UserAccount, FullAuditReport, UserReview } from '../types';
import { submitUserReview } from '../data/reviewsData';
import confetti from 'canvas-confetti';

interface RatingFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user?: UserAccount;
  currentReport?: FullAuditReport | null;
  onReviewSubmitted?: (newReview: UserReview) => void;
}

const ROLE_OPTIONS = [
  'Website Owner',
  'Web Developer / Engineer',
  'SEO Specialist & Marketer',
  'Agency Founder / CEO',
  'E-Commerce Store Owner',
  'Blogger & Content Creator',
  'UI/UX Designer',
];

const CATEGORY_TAGS: UserReview['categoryTag'][] = [
  'Speed & Performance',
  'SEO Boost',
  'Security & SSL',
  'Full Health',
  'Accessibility',
];

export const RatingFeedbackModal: React.FC<RatingFeedbackModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  currentReport,
  onReviewSubmitted,
}) => {
  const isTe = lang === 'te';

  const defaultWebsite = currentReport?.hostname || (user?.email ? user.email.split('@')[1] : '') || '';
  const defaultScore = currentReport?.overallScore || 72;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>(user?.name || '');
  const [userRole, setUserRole] = useState<string>('Website Owner');
  const [companyOrWebsite, setCompanyOrWebsite] = useState<string>(defaultWebsite);
  const [categoryTag, setCategoryTag] = useState<UserReview['categoryTag']>('Speed & Performance');
  const [title, setTitle] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [scoreBefore, setScoreBefore] = useState<number>(Math.max(35, defaultScore - 28));
  const [scoreAfter, setScoreAfter] = useState<number>(Math.min(99, defaultScore + 20));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const getRatingFeedbackMessage = (stars: number) => {
    switch (stars) {
      case 5:
        return { en: 'Outstanding & Highly Recommended! 🚀', te: 'అద్భుతం! అందరికీ సిఫార్సు చేస్తున్నాను! 🚀' };
      case 4:
        return { en: 'Very Good & Useful Platform! 👍', te: 'చాలా ఉపయోగకరమైన ప్లాట్‌ఫారమ్! 👍' };
      case 3:
        return { en: 'Good Service with Helpful Fixes 🙂', te: 'మంచి సేవ & ఉపయోగపడే పరిష్కారాలు 🙂' };
      default:
        return { en: 'Helpful Audit Insights 💡', te: 'మంచి విశ్లేషణ & సలహాలు 💡' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert(isTe ? 'దయచేసి మీ పేరు నమోదు చేయండి' : 'Please enter your name');
      return;
    }
    if (!feedback.trim()) {
      alert(isTe ? 'దయచేసి మీ ఫీడ్‌బ్యాక్ రాయండి' : 'Please provide your feedback comments');
      return;
    }

    setIsSubmitting(true);
    try {
      const computedTitle = title.trim() || (isTe ? `${rating} స్టార్ రేటింగ్ & అద్భుతమైన ఫలితాలు` : `Instant 5-Star Website Health & Fixes`);
      
      const created = await submitUserReview({
        userId: user?.email || undefined,
        userName: userName.trim(),
        userRole: userRole.trim(),
        companyOrWebsite: companyOrWebsite.trim() || 'Verified Client',
        rating,
        title: computedTitle,
        titleTe: isTe ? computedTitle : undefined,
        feedback: feedback.trim(),
        feedbackTe: isTe ? feedback.trim() : undefined,
        categoryTag,
        scoreBefore: Number(scoreBefore),
        scoreAfter: Number(scoreAfter),
        issuesFixedCount: currentReport?.categories.reduce((acc, c) => acc + c.metrics.filter(m => m.status === 'error' || m.status === 'warning').length, 0) || 8,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
      });

      setIsSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(created);
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Error submitting review:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 text-white relative max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">
              {isTe ? 'ధన్యవాదాలు! మీ రేటింగ్ సేవ్ అయింది 🎉' : 'Thank You! Your Review is Live 🎉'}
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {isTe 
                ? 'మీ 5-స్టార్ రేటింగ్ మరియు ఫీడ్‌బ్యాక్ మా వెబ్‌సైట్ టెస్టిమోనియల్స్ సెక్షన్‌లో విజయవంతంగా చేర్చబడింది.'
                : 'Your rating and valuable feedback have been verified and added to our customer testimonials wall.'}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{isTe ? '+2 ఉచిత ఆడిట్ క్రెడిట్స్ యాడ్ అయ్యాయి!' : '+2 Free Audit Credits Awarded!'}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {isTe ? '5-స్టార్ రేటింగ్ & ఫీడ్‌బ్యాక్' : '5-Star Rating & Experience'}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  🎁 +2 Credits Reward
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isTe ? 'మీ అనుభవాన్ని రేట్ చేయండి & ఇతరులకు సహాయపడండి' : 'Share Your 5-Star Experience & Feedback'}
              </h2>
              <p className="text-xs text-slate-400">
                {isTe
                  ? 'మీ వెబ్‌సైట్ రియల్ హెల్త్ రిపోర్ట్ & ఆటో-ఫిక్స్ ఫలితాలు ఎలా ఉన్నాయో మీ రేటింగ్ ద్వారా తెలపండి.'
                  : 'Tell other webmasters how our real audit and 1-click fixes helped boost your website scores!'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Star Rating Interactive Selector */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-2.5 shadow-inner">
                <span className="text-xs font-extrabold text-slate-300 block">
                  {isTe ? 'మీ స్టార్ రేటింగ్ ఎంచుకోండి:' : 'Select Your Star Rating:'}
                </span>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-amber-300 animate-pulse">
                  {getRatingFeedbackMessage(hoverRating || rating)[isTe ? 'te' : 'en']}
                </div>
              </div>

              {/* Name & Website Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isTe ? 'మీ పేరు (Name) *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isTe ? 'వెబ్‌సైట్ / కంపెనీ (Website URL) *' : 'Website / Company *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyOrWebsite}
                    onChange={(e) => setCompanyOrWebsite(e.target.value)}
                    placeholder="e.g. mybusiness.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500 font-medium"
                  />
                </div>
              </div>

              {/* Role / Profession & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isTe ? 'మీ హోదా (Role / Profession)' : 'Your Role / Profession'}
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white font-medium cursor-pointer"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role} className="bg-slate-900 text-white">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isTe ? 'ప్రధాన ఫలితం (Key Benefit)' : 'Key Metric Area'}
                  </label>
                  <select
                    value={categoryTag}
                    onChange={(e) => setCategoryTag(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white font-medium cursor-pointer"
                  >
                    {CATEGORY_TAGS.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Score Boost Before & After */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">
                    {isTe ? 'స్కోర్ మెరుగుదల (Score Improvement):' : 'Health Score Boosted:'}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-400">
                    +{Math.max(0, scoreAfter - scoreBefore)} Points Boost!
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">Before:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={scoreBefore}
                      onChange={(e) => setScoreBefore(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-amber-400 text-center"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">After:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={scoreAfter}
                      onChange={(e) => setScoreAfter(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-emerald-400 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Review Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {isTe ? 'మీ అభిప్రాయం & ఫీడ్‌బ్యాక్ (Your Detailed Review) *' : 'Your Detailed Review & Feedback *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    isTe
                      ? 'ఈ ఆడిట్ టూల్ మీ సైట్ స్పీడ్, SEO మరియు సెక్యూరిటీ సమస్యలను పరిష్కరించడంలో ఎలా ఉపయోగపడిందో వివరించండి...'
                      : 'Share how this tool helped detect real issues, download reports, or fix performance on your website...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500 font-medium resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-98 text-slate-950 font-black py-3 rounded-xl text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/80"
                >
                  <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>
                    {isSubmitting
                      ? (isTe ? 'సమర్పిస్తున్నాము...' : 'Publishing Review...')
                      : (isTe ? '5-స్టార్ రేటింగ్ సబ్మిట్ చేయండి' : 'Submit 5-Star Rating & Review')}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
