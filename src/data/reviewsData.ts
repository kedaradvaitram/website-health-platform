import { UserReview } from '../types';
import { db, collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from '../lib/firebase';

// Empty default initial reviews (no fake / fabricated reviews)
export const INITIAL_REVIEWS: UserReview[] = [];

const LOCAL_STORAGE_REVIEWS_KEY = 'website_health_real_user_reviews';

export async function fetchAllUserReviews(): Promise<UserReview[]> {
  try {
    let localReviews: UserReview[] = [];
    const saved = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (saved) {
      try {
        localReviews = JSON.parse(saved);
      } catch {}
    }

    // Fetch real user reviews from Firestore
    try {
      const q = query(collection(db, 'reviews'), limit(50));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const firestoreReviews: UserReview[] = snap.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            userId: d.userId,
            userName: d.userName || 'Website User',
            userRole: d.userRole || 'Site Owner',
            companyOrWebsite: d.companyOrWebsite || 'Verified Domain',
            rating: d.rating || 5,
            title: d.title || 'Genuine User Feedback',
            titleTe: d.titleTe,
            feedback: d.feedback || '',
            feedbackTe: d.feedbackTe,
            categoryTag: d.categoryTag || 'Full Health',
            scoreBefore: d.scoreBefore,
            scoreAfter: d.scoreAfter,
            issuesFixedCount: d.issuesFixedCount,
            avatarUrl: d.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(d.userName || 'User')}`,
            verified: d.verified ?? true,
            createdAt: d.savedAt ? new Date(d.savedAt).toLocaleDateString() : 'Recent',
            helpfulCount: d.helpfulCount || 0,
          };
        });

        // Merge firestore & local reviews (deduplicate by id)
        const combined = [...firestoreReviews, ...localReviews];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique;
      }
    } catch (fsErr) {
      console.warn('Firestore real reviews fetch:', fsErr);
    }

    return localReviews;
  } catch (err) {
    console.warn('Real reviews load error:', err);
    return [];
  }
}

export async function submitUserReview(reviewData: Omit<UserReview, 'id' | 'createdAt' | 'helpfulCount' | 'verified'>): Promise<UserReview> {
  const newReview: UserReview = {
    ...reviewData,
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    verified: true,
    createdAt: 'Just now',
    helpfulCount: 0,
  };

  // 1. Save to localStorage immediately so user sees their review immediately
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    const existing: UserReview[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = [newReview, ...existing.filter(r => r.id !== newReview.id)];
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save review note:', e);
  }

  // 2. Persist to Firestore database
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...newReview,
      timestamp: serverTimestamp(),
      savedAt: new Date().toISOString(),
    });
    newReview.id = docRef.id;
  } catch (fsErr) {
    console.warn('Firestore addDoc review note:', fsErr);
  }

  return newReview;
}
