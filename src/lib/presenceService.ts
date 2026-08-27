import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from './firebase';
import { LiveUserPresenceStats, UserAccount } from '../types';

export interface PresenceSession {
  sessionId: string;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  isLoggedIn: boolean;
  lastActive: number;
  joinedAt: number;
  path?: string;
  platform?: string;
}

export interface ActivityFeedItem {
  id: string;
  user: string;
  location: string;
  action: string;
  score?: number | null;
  timeAgo: string;
}

// Generate or retrieve persistent browser session ID
function getOrCreateSessionId(): string {
  try {
    let id = sessionStorage.getItem('audit_session_id');
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('audit_session_id', id);
    }
    return id;
  } catch {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

class PresenceManager {
  private sessionId: string;
  private currentUser: UserAccount | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private unsubscribeFirestore: (() => void) | null = null;
  private unsubscribeUsers: (() => void) | null = null;
  private listeners: Set<(stats: LiveUserPresenceStats, feed?: ActivityFeedItem[]) => void> = new Set();
  
  private currentStats: LiveUserPresenceStats = {
    totalRegisteredUsers: 0,
    totalLoggedToday: 0,
    activeOnlineUsers: 0,
    activeScore: 100,
    activeAuditsRunning: 0,
    systemHealthStatus: 'optimal',
    peakUsersToday: 0,
    lastUpdated: new Date().toISOString(),
  };

  private currentFeed: ActivityFeedItem[] = [];

  private isInitialized = false;

  constructor() {
    this.sessionId = getOrCreateSessionId();
  }

  public init(user?: UserAccount | null) {
    if (user !== undefined) {
      this.currentUser = user;
    }

    if (this.isInitialized) {
      // Just update current user info in session
      this.sendHeartbeat();
      return;
    }

    this.isInitialized = true;

    // 1. Initial Heartbeat & register session
    this.sendHeartbeat();

    // 2. Setup periodic heartbeat (every 12 seconds)
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, 12000);

    // 3. Listen to Firestore active_sessions for true real-time global multi-user count
    this.subscribeToFirestoreSessions();

    // 4. Listen to Firestore users collection to get total registered users
    this.subscribeToFirestoreUsers();

    // 5. Cleanup on window close or tab hide
    if (typeof window !== 'undefined') {
      const handleUnload = () => {
        this.removeSession();
      };
      window.addEventListener('beforeunload', handleUnload);
      window.addEventListener('pagehide', handleUnload);

      // Handle visibility changes (resume heartbeat when tab becomes active again)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.sendHeartbeat();
        }
      });
    }

    // 6. Also run fallback polling from backend API
    this.fetchApiFallback();
  }

  public updateUser(user: UserAccount | null) {
    this.currentUser = user;
    this.sendHeartbeat();
  }

  public subscribe(callback: (stats: LiveUserPresenceStats, feed?: ActivityFeedItem[]) => void) {
    this.listeners.add(callback);
    // Immediately emit current state
    callback(this.currentStats, this.currentFeed);

    return () => {
      this.listeners.delete(callback);
    };
  }

  public getStats(): LiveUserPresenceStats {
    return this.currentStats;
  }

  public getFeed(): ActivityFeedItem[] {
    return this.currentFeed;
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentStats, this.currentFeed);
      } catch (err) {
        console.error('Error notifying presence listener:', err);
      }
    }
  }

  private async sendHeartbeat() {
    const now = Date.now();
    const sessionData: PresenceSession = {
      sessionId: this.sessionId,
      userId: this.currentUser?.userId || this.currentUser?.uid || null,
      userName: this.currentUser?.name || (this.currentUser?.isLoggedIn ? 'Signed User' : 'Guest Visitor'),
      userEmail: this.currentUser?.email || null,
      isLoggedIn: Boolean(this.currentUser?.isLoggedIn),
      lastActive: now,
      joinedAt: now,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'web',
    };

    // A. Firestore write
    try {
      if (db) {
        const sessionRef = doc(db, 'active_sessions', this.sessionId);
        await setDoc(sessionRef, sessionData, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `active_sessions/${this.sessionId}`);
    }

    // B. Server API heartbeat fallback (for environments with Express server)
    try {
      fetch('/api/stats/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      }).catch(() => {
        // Silently ignore if hosted on static Vercel SPA
      });
    } catch {
      // Ignore network errors
    }
  }

  private async removeSession() {
    try {
      if (db && this.sessionId) {
        const sessionRef = doc(db, 'active_sessions', this.sessionId);
        await deleteDoc(sessionRef);
      }
    } catch {
      // Ignore on unload
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/stats/leave',
          JSON.stringify({ sessionId: this.sessionId })
        );
      }
    } catch {
      // Ignore
    }
  }

  private subscribeToFirestoreSessions() {
    try {
      if (!db) return;

      const sessionsCollection = collection(db, 'active_sessions');
      this.unsubscribeFirestore = onSnapshot(
        sessionsCollection,
        (snapshot) => {
          const now = Date.now();
          const activeSessions: PresenceSession[] = [];
          const expiredDocIds: string[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as PresenceSession;
            // Valid if active within the last 45 seconds
            if (data.lastActive && now - data.lastActive < 45000) {
              activeSessions.push(data);
            } else if (data.lastActive && now - data.lastActive > 90000) {
              // Expired doc candidate for pruning
              expiredDocIds.push(docSnap.id);
            }
          });

          // Real count of active concurrent sessions
          const activeCount = activeSessions.length;
          const loggedInCount = activeSessions.filter((s) => s.isLoggedIn).length;
          const peak = Math.max(this.currentStats.peakUsersToday, activeCount);

          this.currentStats = {
            ...this.currentStats,
            activeOnlineUsers: activeCount,
            activeScore: 100,
            peakUsersToday: peak,
            lastUpdated: new Date().toISOString(),
          };

          this.notify();

          // Prune stale sessions asynchronously
          if (expiredDocIds.length > 0) {
            expiredDocIds.slice(0, 5).forEach((id) => {
              deleteDoc(doc(db, 'active_sessions', id)).catch(() => {});
            });
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'active_sessions');
        }
      );
    } catch (err) {
      console.warn('Firestore presence subscription error, falling back to polling:', err);
    }
  }

  private subscribeToFirestoreUsers() {
    try {
      if (!db) return;

      const usersCollection = collection(db, 'users');
      this.unsubscribeUsers = onSnapshot(
        usersCollection,
        (snapshot) => {
          // Strictly count real registered users from Firestore collection (zero if none)
          const realRegisteredCount = snapshot.size;
          
          // Calculate today's real logins from users' lastLoginAt timestamps
          let todayLogins = 0;
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          const startTimestamp = startOfToday.getTime();

          snapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            if (userData?.lastLoginAt?.toMillis) {
              if (userData.lastLoginAt.toMillis() >= startTimestamp) {
                todayLogins++;
              }
            } else if (userData?.lastLoginAt?.seconds) {
              if (userData.lastLoginAt.seconds * 1000 >= startTimestamp) {
                todayLogins++;
              }
            } else if (userData?.lastLoginAt) {
              todayLogins++;
            }
          });

          // If current session is logged in, ensure at least 1 login today is counted
          if (this.currentUser?.isLoggedIn && todayLogins === 0) {
            todayLogins = 1;
          }

          this.currentStats = {
            ...this.currentStats,
            totalRegisteredUsers: realRegisteredCount,
            totalLoggedToday: todayLogins,
            lastUpdated: new Date().toISOString(),
          };

          this.notify();
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      );
    } catch (err) {
      console.warn('Users collection subscription error:', err);
    }
  }

  public async fetchApiFallback() {
    try {
      const res = await fetch('/api/stats/user-activity');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const activeCount = typeof data.activeOnlineUsers === 'number' ? data.activeOnlineUsers : this.currentStats.activeOnlineUsers;
          const totalRegistered = typeof data.totalRegisteredUsers === 'number' ? data.totalRegisteredUsers : this.currentStats.totalRegisteredUsers;

          this.currentStats = {
            ...this.currentStats,
            activeOnlineUsers: activeCount,
            totalRegisteredUsers: totalRegistered,
            totalLoggedToday: typeof data.totalLoggedToday === 'number' ? data.totalLoggedToday : this.currentStats.totalLoggedToday,
            activeScore: data.activeScore || 100,
            activeAuditsRunning: data.activeAuditsRunning || 0,
            peakUsersToday: Math.max(this.currentStats.peakUsersToday, data.peakUsersToday || 0),
            lastUpdated: new Date().toISOString(),
          };

          if (Array.isArray(data.recentFeed)) {
            this.currentFeed = data.recentFeed;
          }

          this.notify();
        }
      }
    } catch {
      // Silently ignore if backend route is unavailable
    }
  }

  public destroy() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    if (this.unsubscribeFirestore) this.unsubscribeFirestore();
    if (this.unsubscribeUsers) this.unsubscribeUsers();
    this.removeSession();
    this.isInitialized = false;
  }
}

export const presenceService = new PresenceManager();
