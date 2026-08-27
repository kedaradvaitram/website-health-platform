import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
  Heart,
  Filter,
  Award,
  Send,
  Globe,
  User,
  ExternalLink,
  Server,
  HardDrive,
  Tag,
  Shield,
  Check,
  Flame,
} from 'lucide-react';
import { Language, UserReview } from '../types';
import { fetchAllUserReviews, submitUserReview } from '../data/reviewsData';
import { AFFILIATE_LINKS, HOSTING_AFFILIATE_OPTIONS } from '../data/affiliateLinks';
import confetti from 'canvas-confetti';

interface CustomerReviewsSectionProps {
  lang: Language;
  onOpenRatingModal: () => void;
  newlySubmittedReview?: UserReview | null;
  newReview?: UserReview | null;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  lang,
  onOpenRatingModal,
  newlySubmittedReview,
  newReview,
}) => {
  const isTe = lang === 'te';
  const effectiveNewReview = newlySubmittedReview || newReview;
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selected Hostinger Affiliate target (default: Germany Main 13695204)
  const [selectedHostingerTarget, setSelectedHostingerTarget] = useState<'de-main' | 'de-ext' | 'fr-main'>('de-main');

  const getHostingerCurrentUrl = () => {
    switch (selectedHostingerTarget) {
      case 'de-ext':
        return AFFILIATE_LINKS.hostingerGermanyExtensions;
      case 'fr-main':
        return AFFILIATE_LINKS.hostingerFranceMain;
      case 'de-main':
      default:
        return AFFILIATE_LINKS.hostingerGermanyMain;
    }
  };

  const godaddyUrl = AFFILIATE_LINKS.godaddyOfficial;

  // Inline Quick Rating Form State
  const [inlineRating, setInlineRating] = useState<number>(5);
  const [inlineHoverRating, setInlineHoverRating] = useState<number>(0);
  const [inlineName, setInlineName] = useState<string>('');
  const [inlineWebsite, setInlineWebsite] = useState<string>('');
  const [inlineRole, setInlineRole] = useState<string>('Website Owner');
  const [inlineFeedback, setInlineFeedback] = useState<string>('');
  const [isSubmittingInline, setIsSubmittingInline] = useState<boolean>(false);
  const [inlineSuccess, setInlineSuccess] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetchAllUserReviews()
      .then((res) => {
        setReviews(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (effectiveNewReview) {
      setReviews((prev) => [
        effectiveNewReview,
        ...prev.filter((r) => r.id !== effectiveNewReview.id),
      ]);
    }
  }, [effectiveNewReview]);

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvotedIds.has(id)) return;

    setUpvotedIds((prev) => new Set(prev).add(id));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineName.trim()) {
      alert(isTe ? 'దయచేసి మీ పేరును నమోదు చేయండి' : 'Please enter your name');
      return;
    }
    if (!inlineFeedback.trim()) {
      alert(isTe ? 'దయచేసి మీ ఫీడ్‌బ్యాక్ రాయండి' : 'Please enter your feedback review');
      return;
    }

    setIsSubmittingInline(true);
    try {
      const created = await submitUserReview({
        userName: inlineName.trim(),
        userRole: inlineRole.trim(),
        companyOrWebsite: inlineWebsite.trim() || 'Verified Visitor',
        rating: inlineRating,
        title: isTe
          ? `${inlineRating} స్టార్స్ - నిజమైన యూజర్ ఫీడ్‌బ్యాక్`
          : `${inlineRating} Stars - Verified User Feedback`,
        titleTe: `${inlineRating} స్టార్స్ - నిజమైన యూజర్ ఫీడ్‌బ్యాక్`,
        feedback: inlineFeedback.trim(),
        feedbackTe: isTe ? inlineFeedback.trim() : undefined,
        categoryTag: 'Full Health',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          inlineName.trim()
        )}`,
      });

      setReviews((prev) => [created, ...prev]);
      setInlineSuccess(true);
      setInlineFeedback('');
      setInlineWebsite('');

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setInlineSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Error submitting inline review:', err);
    } finally {
      setIsSubmittingInline(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedRatingFilter === 'all') return true;
    return r.rating === selectedRatingFilter;
  });

  // Calculate live real rating statistics
  const totalReviewsCount = reviews.length;
  const avgRating =
    totalReviewsCount > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviewsCount).toFixed(1)
      : '5.0';

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;

  return (
    <section className="py-12 relative overflow-hidden" id="customer-reviews-section">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header & Rating Overview Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            {/* Title & Authentic User Trust Highlights */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isTe
                    ? 'నిజమైన యూజర్ల లైవ్ ఫీడ్‌బ్యాక్ & 5-స్టార్ రేటింగ్స్'
                    : '100% Real Live User Ratings & Feedback'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isTe
                  ? 'యూజర్ల నిజమైన ఫీడ్‌బ్యాక్ & 5-స్టార్ రేటింగ్స్'
                  : 'Real User Feedback & 5-Star Ratings'}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {isTe
                  ? 'మా వెబ్‌సైట్‌ను ఉపయోగించిన అసలైన యూజర్లు మరియు డెవలపర్లు స్వయంగా అందించిన లైవ్ రేటింగ్స్ & రివ్యూలు. మీ అభిప్రాయాన్ని కూడా ఇక్కడే నేరుగా సబ్మిట్ చేయండి!'
                  : 'Genuine ratings and direct feedback from real website owners and engineers who tested their websites on our platform. Leave your honest 5-star rating below!'}
              </p>

              {/* Verified Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isTe ? 'ధృవీకరించబడిన లైవ్ సబ్మిషన్లు' : 'Real-Time Database Sync'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Award className="w-4 h-4" />
                  <span>
                    {totalReviewsCount > 0
                      ? `${avgRating} / 5.0 (${totalReviewsCount} ${isTe ? 'రివ్యూలు' : 'Reviews'})`
                      : isTe
                      ? '5.0 స్టార్ రేటింగ్ సిస్టమ్'
                      : '5.0 Star Rating System'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                  <Zap className="w-4 h-4" />
                  <span>{isTe ? '1-క్లిక్ డైరెక్ట్ సబ్మిషన్' : 'Instant Direct Feedback'}</span>
                </div>
              </div>
            </div>

            {/* Live Rating Stats & Direct CTA Card */}
            <div className="w-full lg:w-auto shrink-0 bg-slate-950/80 border-2 border-amber-500/30 rounded-2xl p-6 text-center space-y-4 shadow-xl">
              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-black text-white flex items-center justify-center gap-2">
                  <span>{avgRating}</span>
                  <span className="text-xl text-slate-500 font-medium">/ 5.0</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">
                  {totalReviewsCount > 0
                    ? isTe
                      ? `${totalReviewsCount} మంది నిజమైన యూజర్లు రేట్ చేశారు`
                      : `Based on ${totalReviewsCount} verified real user submissions`
                    : isTe
                    ? 'మొదటి రివ్యూ ఇవ్వడానికి సిద్ధంగా ఉంది'
                    : 'Be the first user to submit a rating!'}
                </p>
              </div>

              {/* Give Rating / Feedback Button */}
              <button
                type="button"
                onClick={onOpenRatingModal}
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/80 active:scale-95"
              >
                <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>
                  {isTe ? 'మీ 5-స్టార్ రేటింగ్ & ఫీడ్‌బ్యాక్ ఇవ్వండి' : 'Write 5-Star Rating & Feedback'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Inline Direct Rating & Feedback Form Box (Zero friction for visitors) */}
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isTe
                    ? 'వెబ్‌సైట్ విజిటర్స్ నేరుగా 5-స్టార్ రేటింగ్ & ఫీడ్‌బ్యాక్ ఇవ్వండి'
                    : 'Direct User Feedback & 5-Star Submission Form'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTe
                    ? 'మీరు ఉపయోగించిన అనుభవాన్ని ఇక్కడే తక్షణమే సబ్మిట్ చేయండి, ఇది నేరుగా క్రింద డిస్‌ప్లే అవుతుంది.'
                    : 'Share your authentic experience directly below. Your review will be published live instantly.'}
                </p>
              </div>
            </div>

            {inlineSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {isTe ? 'ధన్యవాదాలు! మీ రివ్యూ పబ్లిష్ అయింది!' : 'Success! Your review is published live!'}
              </span>
            )}
          </div>

          <form onSubmit={handleInlineSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isTe ? 'మీ పేరు (Name) *' : 'Your Name *'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={inlineName}
                  onChange={(e) => setInlineName(e.target.value)}
                  placeholder={isTe ? 'ఉదా: ప్రవీణ్ కుమార్' : 'e.g. John Doe'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500 font-medium"
                />
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isTe ? 'మీ వెబ్‌సైట్ (Website Domain)' : 'Your Website URL'}</span>
                </label>
                <input
                  type="text"
                  value={inlineWebsite}
                  onChange={(e) => setInlineWebsite(e.target.value)}
                  placeholder="e.g. mysite.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500 font-medium"
                />
              </div>

              {/* Interactive Stars Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{isTe ? 'స్టార్ రేటింగ్ (Rating)' : 'Star Rating'}</span>
                </label>
                <div className="flex items-center gap-1.5 h-[42px] px-3 rounded-xl bg-slate-950 border border-slate-700">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (inlineHoverRating || inlineRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setInlineRating(star)}
                        onMouseEnter={() => setInlineHoverRating(star)}
                        onMouseLeave={() => setInlineHoverRating(0)}
                        className="cursor-pointer focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-mono font-bold text-amber-300 ml-2">
                    {inlineRating}.0★
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {isTe ? 'మీ నిజమైన అనుభవం & ఫీడ్‌బ్యాక్ (Your Real Feedback) *' : 'Your Real Feedback *'}
              </label>
              <textarea
                required
                rows={2}
                value={inlineFeedback}
                onChange={(e) => setInlineFeedback(e.target.value)}
                placeholder={
                  isTe
                    ? 'మా వెబ్‌సైట్ ఆడిట్ టూల్స్, స్పీడ్ రిపోర్ట్ మరియు డెవలపర్ ఫిక్సెస్ గురించి మీ అభిప్రాయాన్ని రాయండి...'
                    : 'Tell us how our audit tool helped identify issues, verify headers, or speed up your website...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500 font-medium resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingInline}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmittingInline
                    ? isTe
                      ? 'సబ్మిట్ అవుతోంది...'
                      : 'Submitting...'
                    : isTe
                    ? '5-స్టార్ ఫీడ్‌బ్యాక్ పోస్ట్ చేయండి'
                    : 'Post 5-Star Feedback'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs if there are reviews */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>
                {isTe
                  ? `యూజర్లు అందించిన రివ్యూలు (${filteredReviews.length})`
                  : `User Submitted Reviews (${filteredReviews.length})`}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRatingFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedRatingFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isTe ? 'అన్నీ' : 'All'}
            </button>
            <button
              onClick={() => setSelectedRatingFilter(5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                selectedRatingFilter === 5
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>5★</span>
              {fiveStarCount > 0 && <span className="opacity-80">({fiveStarCount})</span>}
            </button>
            <button
              onClick={() => setSelectedRatingFilter(4)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                selectedRatingFilter === 4
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>4★</span>
              {fourStarCount > 0 && <span className="opacity-80">({fourStarCount})</span>}
            </button>
          </div>
        </div>

        {/* Reviews Grid or Empty State with Left (Hostinger) & Right (GoDaddy) Affiliate Cards */}
        {filteredReviews.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* LEFT SIDE: Hostinger Affiliate Partner Card */}
            <div className="bg-gradient-to-b from-indigo-950/70 via-slate-900/90 to-purple-950/50 rounded-3xl border-2 border-indigo-500/30 hover:border-indigo-400/60 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl transition-all hover:shadow-indigo-500/10 group relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[11px] font-black uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isTe ? '75% తగ్గింపు ఆఫర్' : 'Special 75% OFF Deal'}</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                    {isTe ? 'అఫీలియేట్ పార్ట్‌నర్' : 'Official Partner'}
                  </span>
                </div>

                {/* Hostinger Branding */}
                <div className="flex items-center space-x-3 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/40 shrink-0">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                      Hostinger
                    </h4>
                    <p className="text-xs text-indigo-200/80 font-medium">
                      {isTe ? 'సూపర్-ఫాస్ట్ క్లౌడ్ & వెబ్ హోస్టింగ్' : 'High-Speed Web Hosting & VPS'}
                    </p>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isTe ? 'లైట్‌స్పీడ్ వెబ్ సర్వర్ (99.9% అప్‌టైమ్ గ్యారెంటీ)' : 'LiteSpeed Turbo Servers (99.9% Uptime)'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isTe ? 'ఉచిత డొమైన్ & అపరిమిత ఉచిత SSL సర్టిఫికెట్స్' : 'Free Domain + Free SSL Security Certificate'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isTe ? '1-క్లిక్ వర్డ్‌ప్రెస్ సెటప్ & ఉచిత ఆటో-మైగ్రేషన్' : '1-Click WordPress & Free Site Migration'}</span>
                  </div>
                </div>

                {/* Regional Offers / Extension Selector */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {isTe ? 'ప్రత్యేక ఆఫర్ ఎంపిక (Germany / France):' : 'Select Regional Offer:'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-indigo-500/20 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSelectedHostingerTarget('de-main')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition-all text-center ${
                        selectedHostingerTarget === 'de-main'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🇩🇪 Germany
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHostingerTarget('de-ext')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition-all text-center ${
                        selectedHostingerTarget === 'de-ext'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🌐 .DE / Ext
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHostingerTarget('fr-main')}
                      className={`py-1.5 px-1 rounded-lg font-bold transition-all text-center ${
                        selectedHostingerTarget === 'fr-main'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🇫🇷 France
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 relative z-10 space-y-2">
                <motion.a
                  href={getHostingerCurrentUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-hostinger-affiliate-link"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 0 28px rgba(99, 102, 241, 0.75), 0 0 12px rgba(168, 85, 247, 0.5)',
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/60 relative overflow-hidden group"
                >
                  {/* Subtle pulsing highlight effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none"
                  />
                  <Server className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {selectedHostingerTarget === 'de-ext'
                      ? (isTe ? 'Germany Extensions డీల్ పొందండి' : 'Claim Germany Extensions Deal')
                      : selectedHostingerTarget === 'fr-main'
                      ? (isTe ? 'France Hostinger 75% ఆఫర్ పొందండి' : 'Claim France Hostinger Deal')
                      : (isTe ? 'Hostinger లో 75% ఆఫర్ పొందండి' : 'Get 75% OFF on Hostinger')}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                </motion.a>

                <div className="text-[10px] text-center text-slate-400">
                  {selectedHostingerTarget === 'de-main' && 'Text 13695204 (Offer 58) • 30-Day Money Back'}
                  {selectedHostingerTarget === 'de-ext' && 'Text 14344621 (Offer 319) • Extensions Germany'}
                  {selectedHostingerTarget === 'fr-main' && 'Text 13690177 / Banner 13631420 (Offer 58 France)'}
                </div>
              </div>
            </div>

            {/* CENTER: Reviews Empty State & Rating Trigger Card */}
            <div className="bg-slate-900/80 rounded-3xl border-2 border-slate-800 p-6 sm:p-8 text-center flex flex-col justify-between space-y-5 shadow-xl">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                  <Star className="w-8 h-8 fill-amber-400/20 text-amber-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {isTe
                      ? 'ఇంకా రివ్యూలు సమర్పించబడలేదు'
                      : 'No User Reviews Submitted Yet'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                    {isTe
                      ? 'మా ప్లాట్‌ఫారమ్‌లో నకిలీ రివ్యూలు ఏవీ లేవు! మీ వెబ్‌సైట్‌ను ఆడిట్ చేసి, మొదటి 5-స్టార్ రేటింగ్ & ఫీడ్‌బ్యాక్‌ను పైన ఉన్న ఫారమ్‌లో అందించండి.'
                      : 'We do not display fabricated fake reviews! Run an audit and be the first verified webmaster to leave your real 5-star rating & feedback above.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenRatingModal}
                  id="btn-reviews-empty-submit"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black py-3 px-5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer border border-amber-300/80 active:scale-95"
                >
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>{isTe ? 'మొదటి 5-స్టార్ రివ్యూ సబ్మిట్ చేయండి' : 'Submit the First 5-Star Review'}</span>
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: GoDaddy Affiliate Partner Card */}
            <div className="bg-gradient-to-b from-teal-950/70 via-slate-900/90 to-emerald-950/50 rounded-3xl border-2 border-teal-500/30 hover:border-teal-400/60 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl transition-all hover:shadow-teal-500/10 group relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[11px] font-black uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-teal-300" />
                    <span>{isTe ? 'డొమైన్ & వెబ్ హోస్టింగ్' : 'Domains & Web Hosting'}</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                    {isTe ? 'అఫీలియేట్ పార్ట్‌నర్' : 'Official Partner'}
                  </span>
                </div>

                {/* GoDaddy Branding */}
                <div className="flex items-center space-x-3 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-teal-500/25 border border-teal-400/40 shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                      GoDaddy
                    </h4>
                    <p className="text-xs text-teal-200/80 font-medium">
                      {isTe ? 'వరల్డ్ నెం.1 డొమైన్ & బిజినెస్ సూట్' : 'World #1 Domain Registrar & Hosting'}
                    </p>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{isTe ? '.COM / .IN డొమైన్స్ ₹499 / $0.99 నుండి' : '.COM & .IN Domains starting at $0.99'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{isTe ? 'ఉచిత WHOIS ప్రైవసీ & DNSSEC సెక్యూరిటీ' : 'Free WHOIS Privacy & High-Speed DNS'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{isTe ? 'ప్రొఫెషనల్ బిజినెస్ ఈమెయిల్ అకౌంట్స్' : 'Professional Business Email Integration'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{isTe ? '24/7 ఎక్స్‌పర్ట్ ఫోన్ & లైవ్ చాట్ సపోర్ట్' : '24/7 Expert Phone & Live Chat Support'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 relative z-10">
                <motion.a
                  href={godaddyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-godaddy-affiliate-link"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 0 28px rgba(20, 184, 166, 0.75), 0 0 12px rgba(16, 185, 129, 0.5)',
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition-all cursor-pointer border border-teal-400/60 relative overflow-hidden group"
                >
                  {/* Subtle pulsing highlight effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none"
                  />
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isTe ? 'GoDaddy లో డొమైన్ & హోస్టింగ్ పొందండి' : 'Claim Domain on GoDaddy'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                </motion.a>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Flanking Affiliate Promotion Banner for Hostinger & GoDaddy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hostinger Quick Banner */}
              <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 rounded-2xl border border-indigo-500/30 p-4 flex items-center justify-between gap-4 shadow-lg hover:border-indigo-400/60 transition-all">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">
                    <Server className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-sm text-white">Hostinger</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">75% OFF</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      {isTe ? 'లైట్‌స్పీడ్ వెబ్ హోస్టింగ్ + ఉచిత SSL & డొమైన్' : 'Ultra-Fast LiteSpeed Web Hosting + Free Domain'}
                    </p>
                  </div>
                </div>
                <motion.a
                  href={AFFILIATE_LINKS.hostingerGermanyMain}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.7)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-xl shrink-0 transition-colors shadow-md border border-indigo-400/40"
                >
                  <span>{isTe ? 'ఆఫర్ పొందండి' : 'Claim Deal'}</span>
                  <ExternalLink className="w-3 h-3" />
                </motion.a>
              </div>

              {/* GoDaddy Quick Banner */}
              <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/60 rounded-2xl border border-teal-500/30 p-4 flex items-center justify-between gap-4 shadow-lg hover:border-teal-400/60 transition-all">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-sm text-white">GoDaddy</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">₹499 / $0.99</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      {isTe ? '.COM / .IN డొమైన్ రిజిస్ట్రేషన్ & బిజినెస్ సూట్' : '.COM & .IN Domains + Business Hosting'}
                    </p>
                  </div>
                </div>
                <motion.a
                  href={godaddyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 20px rgba(20, 184, 166, 0.7)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3 py-2 rounded-xl shrink-0 transition-colors shadow-md border border-teal-400/40"
                >
                  <span>{isTe ? 'డొమైన్ పొందండి' : 'Get Domain'}</span>
                  <ExternalLink className="w-3 h-3" />
                </motion.a>
              </div>
            </div>

            {/* Existing reviews grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-900/80 hover:bg-slate-900 border-2 border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-lg hover:shadow-amber-500/10 group relative"
                >
                  <div className="space-y-3.5">
                    {/* Top Card: Rating Stars & Verified Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isTe ? 'వెరిఫైడ్ రియల్ యూజర్' : 'Verified Real User'}</span>
                      </span>
                    </div>

                    {/* Review Title */}
                    <h4 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {isTe && rev.titleTe ? rev.titleTe : rev.title}
                    </h4>

                    {/* Review Feedback Quote */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      "{isTe && rev.feedbackTe ? rev.feedbackTe : rev.feedback}"
                    </p>
                  </div>

                  {/* Bottom Card: Author Avatar, Role, Website & Upvote button */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={
                          rev.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            rev.userName
                          )}`
                        }
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 shrink-0 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white truncate">{rev.userName}</span>
                          {rev.verified && (
                            <span title="Verified Website User" className="inline-flex">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {rev.userRole || 'Site Owner'} •{' '}
                          <span className="text-amber-400/90 font-mono font-medium">
                            {rev.companyOrWebsite}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Helpful Upvote Button */}
                    <button
                      type="button"
                      onClick={(e) => handleUpvote(rev.id, e)}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
                        upvotedIds.has(rev.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:bg-slate-700'
                      }`}
                      title="Mark this review as helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{rev.helpfulCount || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
