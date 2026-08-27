import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    success: true,
    totalRegisteredUsers: 0,
    totalLoggedToday: 0,
    activeOnlineUsers: 1,
    activeScore: 100.0,
    activeAuditsRunning: 0,
    peakUsersToday: 1,
    systemHealthStatus: 'optimal',
    uptimePercentage: 100,
    recentFeed: [],
    lastUpdated: new Date().toISOString(),
  });
}
