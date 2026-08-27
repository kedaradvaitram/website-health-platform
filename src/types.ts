export type Language =
  | 'en'
  | 'te'
  | 'hi'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'zh'
  | 'ar'
  | 'pt'
  | 'ru';

export type FixSkillPersona = 'beginner' | 'developer' | 'wordpress';

export interface PersonaFixOption {
  steps?: string[];
  stepsTe?: string[];
  pluginOrTool?: string;
  codeSnippet?: string;
  fileTarget?: string;
  testCommand?: string;
}

export interface AuditMetric {
  id: string;
  name: string;
  nameTe?: string;
  value: string | number;
  score: number; // 0 to 100
  status: 'good' | 'warning' | 'error' | 'info';
  description?: string;
  descriptionTe?: string;
  recommendation?: string;
  recommendationTe?: string;
  priority?: 'P0' | 'P1' | 'P2' | 'P3';
  effort?: 'quick' | 'medium' | 'high';
  scoreImpact?: number; // Estimated points gain if fixed (e.g. 5, 10, 15)
  isVerified?: boolean;
  verifiedAt?: string;
  // 5-Stage Problem-Why-Fix AI Guidance
  problem?: string;
  problemTe?: string;
  impact?: string; // Why it matters
  impactTe?: string;
  solution?: string; // Exact solution
  solutionTe?: string;
  whereToAdd?: string; // Where to add it
  whereToAddTe?: string;
  verificationMethod?: string; // How to verify the fix
  verificationMethodTe?: string;
  fixSnippet?: {
    language: string;
    code: string;
    fileTarget?: string;
  };
  personaFixes?: {
    beginner?: PersonaFixOption;
    developer?: PersonaFixOption;
    wordpress?: PersonaFixOption;
  };
}

export interface CategoryResult {
  id: string;
  name: string;
  nameTe: string;
  score: number; // 0 to 100
  icon: string;
  summary: string;
  summaryTe: string;
  metrics: AuditMetric[];
}

export interface DetectedTech {
  name: string;
  category: string;
  version?: string;
  confidence: number;
  iconName?: string;
  color?: string;
}

export interface DnsCheckItem {
  recordType: 'A' | 'AAAA' | 'MX' | 'TXT' | 'CNAME' | 'NS' | 'DMARC';
  status: 'valid' | 'warning' | 'missing';
  value: string;
  details: string;
}

export interface SslAnalysis {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  issuer: string;
  protocol: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isExpired: boolean;
  hstsEnabled?: boolean;
  ocspStapling?: boolean;
}

export interface PageIssueItem {
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority?: 'P0' | 'P1' | 'P2';
  code: string;
  title: string;
  titleTe?: string;
  whyItMatters?: string;
  whyItMattersTe?: string;
  fixSuggestion?: string;
  fileTarget?: string;
}

export interface CrawledPageItem {
  id: string;
  url: string;
  path: string;
  title: string;
  statusCode: number;
  depth: number;
  wordCount: number;
  healthScore: number;
  brokenLinksCount: number;
  hasMetaDesc: boolean;
  hasH1: boolean;
  missingAltCount?: number;
  loadTimeMs: number;
  status: 'healthy' | 'warning' | 'critical';
  seo?: {
    hasTitle: boolean;
    titleLength: number;
    hasMetaDesc: boolean;
    metaDescLength: number;
    hasH1: boolean;
    h1Count: number;
    h2Count: number;
    canonicalUrl?: string;
    hasCanonical: boolean;
    isCanonicalMatch: boolean;
    metaRobots?: string;
    hasOpenGraph: boolean;
    hasSchemaOrg: boolean;
    totalImages: number;
    missingAltCount: number;
  };
  performance?: {
    ttfbMs: number;
    loadTimeMs: number;
    scriptCount: number;
    stylesheetCount: number;
    imageCount: number;
    hasPreconnect: boolean;
  };
  security?: {
    isHttps: boolean;
    hasHsts: boolean;
    hasCsp: boolean;
    hasXFrameOptions: boolean;
    hasXContentTypeOptions: boolean;
    hasReferrerPolicy: boolean;
    hasMixedContent: boolean;
  };
  accessibility?: {
    hasHtmlLang: boolean;
    htmlLangValue?: string;
    hasViewport: boolean;
    hasMainLandmark: boolean;
    altTextCompliancePercent: number;
  };
  links?: {
    internalCount: number;
    externalCount: number;
    brokenCount: number;
    outgoingUrls: string[];
  };
  issues?: PageIssueItem[];
}

export interface MonitoringConfig {
  websiteUrl: string;
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  alertThreshold: number; // e.g. score drops below 80
  alertOnSslExpiry: boolean;
  alertOnSpeedDrop: boolean;
  alertOnBrokenLinks?: boolean;
  isActive: boolean;
  lastScanDate?: string;
  nextScanDate?: string;
}

export interface MonitoringAlertRecord {
  id: string;
  date: string;
  type: 'score_drop' | 'ssl_expiry' | 'speed_spike' | 'broken_links' | 'healthy_check';
  title: string;
  titleTe?: string;
  description: string;
  descriptionTe?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved?: boolean;
}

export interface AiGeoSignalItem {
  id: string;
  name: string;
  nameTe?: string;
  platform: 'ChatGPT' | 'Google AI' | 'Perplexity' | 'Claude' | 'Universal LLM';
  status: 'ready' | 'needs_work' | 'missing';
  score: number;
  description: string;
  descriptionTe?: string;
  recommendation: string;
  recommendationTe?: string;
  codeSnippet?: string;
}

export type AuditTargetModule =
  | 'all'
  | 'seo'
  | 'security'
  | 'performance'
  | 'accessibility'
  | 'vitals'
  | 'ssl';

export interface FullAuditReport {
  id: string;
  url: string;
  hostname: string;
  timestamp: string;
  targetAuditModule?: AuditTargetModule;
  overallScore: number;
  perfScore: number;
  seoScore: number;
  secScore: number;
  accScore: number;
  bestPracticesScore: number;
  performanceScore?: number;
  securityScore?: number;
  grade?: string;
  vulnerabilities?: any[];
  mobileScore?: number;
  aiScore?: number;
  techSeoScore?: number;
  isPaidUnlocked?: boolean;
  planTier?: PricingPlanId;
  issueCounts?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    passed: number;
    total: number;
  };
  isLiveScan?: boolean;
  httpStatusCode?: number;
  categories: CategoryResult[];
  technologies: DetectedTech[];
  ssl: SslAnalysis;
  dns: DnsCheckItem[];
  latencyMs: number;
  confidenceScore: number;
  emailSentTo?: string;
  optInWeeklyReports?: boolean;
  summaryItems: string[];
  crawledPages?: CrawledPageItem[];
  monitoringConfig?: MonitoringConfig;
}

export interface ClientTicket {
  id: number;
  email: string;
  websiteUrl: string;
  githubLink: string;
  description: string;
  status: 'Processing' | 'PR Opened' | 'Resolved (zip)' | 'Failed';
  prUrl?: string;
  downloadPath?: string;
  createdAt: string;
  fixedIssuesCount: number;
}

export interface LiveUserPresenceStats {
  totalRegisteredUsers: number;
  totalLoggedToday: number;
  activeOnlineUsers: number;
  activeScore: number; // e.g. 98.4
  activeAuditsRunning: number;
  systemHealthStatus: 'optimal' | 'high_load' | 'standard';
  peakUsersToday: number;
  lastUpdated: string;
}

export interface ApiDailyConsumptionPoint {
  date: string;
  shortDate: string;
  dayName: string;
  totalRequests: number;
  auditCalls: number;
  securityCalls: number;
  crawlerCalls: number;
  remediationCalls: number;
  successRate: number;
}

export interface ApiEndpointUsage {
  audit: number;
  security: number;
  crawler: number;
  remediation: number;
}

export interface ApiUsageStats {
  totalCalls: number;
  monthlyQuota: number;
  lastUsedAt?: string;
  endpointsUsed: ApiEndpointUsage;
  dailyHistory?: ApiDailyConsumptionPoint[];
}

export type ApiPlanTier = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

export interface ApiPricingPlan {
  id: ApiPlanTier;
  name: string;
  nameTe: string;
  priceINR: number;
  auditsPerMonth: number;
  credits: number;
  pagesPerAudit: number;
  rateLimitPerMin: number;
  popular?: boolean;
  tag?: string;
  tagTe?: string;
  description: string;
  descriptionTe: string;
  features: string[];
  featuresTe: string[];
  ctaText: string;
  ctaTextTe: string;
}

export interface ApiKeyItem {
  id: string;
  key: string;
  name: string;
  tier: ApiPlanTier;
  createdAt: string;
  status: 'active' | 'revoked';
  lastUsedAt?: string;
  creditsRemaining: number;
  creditsTotal: number;
  rateLimitPerMin: number;
  totalRequests: number;
  totalErrors: number;
  ipAllowlist?: string[];
  webhookUrl?: string;
}

export interface ApiCreditAlertNotification {
  id: string;
  timestamp: string;
  tier: ApiPlanTier;
  creditsUsed: number;
  creditsTotal: number;
  usagePercent: number;
  thresholdPercent: number;
  type: 'threshold_80' | 'threshold_90' | 'threshold_100' | 'custom' | 'test_alert';
  recipientEmail: string;
  status: 'delivered' | 'sent' | 'pending';
  notificationChannels: ('email' | 'dashboard' | 'webhook')[];
  title: string;
  titleTe?: string;
  message: string;
  messageTe?: string;
  previewHtml?: string;
  acknowledged?: boolean;
}

export interface ApiNotificationPreferences {
  enableEmailAlerts: boolean;
  enableDashboardAlerts: boolean;
  enableWebhookAlerts: boolean;
  alertEmail: string;
  webhookUrl?: string;
  thresholdPercent: number; // default 80
  alertOn80Percent: boolean;
  alertOn90Percent: boolean;
  alertOnExhaustion: boolean;
}

export interface ApiDocumentationEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST';
  title: string;
  titleTe?: string;
  description: string;
  descriptionTe?: string;
  category: 'audit' | 'crawler' | 'ai_fix' | 'monitoring' | 'analytics';
  creditCost: number;
  requestBodySample?: Record<string, any>;
  responseSample: Record<string, any>;
  params?: { name: string; type: string; required: boolean; description: string }[];
}

export interface UserAccount {
  name: string;
  email: string;
  photoURL?: string;
  credits: number;
  referralCode: string;
  referralCount?: number;
  unlockedWebsites?: string[];
  isProUser?: boolean;
  isLoggedIn: boolean;
  role?: string;
  userId?: string;
  uid?: string;
  authProvider?: string;
  lastSyncedAt?: string;
  isFirebaseSynced?: boolean;
  // Secure API Wallet fields
  apiKey?: string;
  apiKeyName?: string;
  apiKeyCreatedAt?: string;
  apiKeyStatus?: 'active' | 'revoked';
  apiTier?: 'Free Starter' | 'Developer' | 'Pro' | 'Enterprise';
  apiWalletBalance?: number;
  apiUsage?: ApiUsageStats;
  apiKeysList?: ApiKeyItem[];
  currentApiTier?: ApiPlanTier;
  apiCreditsRemaining?: number;
}

export interface AuditQueueItem {
  id: string;
  url: string;
  hostname: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  score?: number;
  report?: FullAuditReport;
  error?: string;
}

export type PricingPlanId = 'free' | 'quick' | 'pro' | 'complete' | 'business';

export interface PricingPlan {
  id: PricingPlanId;
  name: string;
  nameTe: string;
  price: number; // in INR (₹)
  billingPeriod?: 'one-time' | 'month';
  maxIssues: number | 'all' | 'unlimited';
  tag?: string;
  tagTe?: string;
  popular?: boolean;
  features: string[];
  featuresTe: string[];
  ctaText: string;
  ctaTextTe: string;
  description: string;
  descriptionTe: string;
  targetAudience: string;
  targetAudienceTe: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  amountINR?: number;
  razorpayFeeEstimated?: number;
  currency: string;
  keyId: string;
  planId: PricingPlanId;
  planName: string;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: PricingPlanId;
  websiteUrl: string;
  email?: string;
  repoUrl?: string;
  authMethod?: 'github' | 'zip' | 'ftp' | 'wordpress';
}

export interface RemediationExecutionResult {
  success: boolean;
  orderId: string;
  paymentId: string;
  verified: boolean;
  planId: PricingPlanId;
  websiteUrl: string;
  beforeScore: number;
  afterScore: number;
  issuesFixedCount: number;
  prUrl?: string;
  downloadZipUrl?: string;
  remediatedItems: {
    title: string;
    titleTe: string;
    category: string;
    actionTaken: string;
  }[];
  timestamp: string;
}

export interface UserReview {
  id: string;
  userId?: string;
  userName: string;
  userRole: string;
  companyOrWebsite: string;
  rating: number;
  title: string;
  titleTe?: string;
  feedback: string;
  feedbackTe?: string;
  categoryTag: 'All' | 'SEO Boost' | 'Speed & Performance' | 'Security & SSL' | 'Accessibility' | 'Full Health';
  scoreBefore?: number;
  scoreAfter?: number;
  issuesFixedCount?: number;
  avatarUrl?: string;
  verified: boolean;
  createdAt: string;
  helpfulCount?: number;
  hasUpvoted?: boolean;
}

// 1. Global Multi-Region Latency & Edge CDN Node
export interface GlobalLatencyNode {
  id: string;
  city: string;
  cityTe: string;
  country: string;
  flag: string;
  continent: 'North America' | 'Europe' | 'Asia' | 'Oceania' | 'South America';
  latencyMs: number;
  ttfbMs: number;
  dnsMs: number;
  tlsMs: number;
  downloadMs: number;
  cdnProvider: string;
  cdnStatus: 'HIT' | 'MISS' | 'DYNAMIC';
  httpStatus: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
}

// 2. 1-Click GitHub Auto-Fix Pull Request Engine
export interface GitHubFixPatch {
  id: string;
  file: string;
  category: 'security' | 'performance' | 'seo' | 'accessibility';
  title: string;
  titleTe: string;
  diffSummary: string;
  diffCode: string;
  selected: boolean;
  linesAdded: number;
  linesRemoved: number;
}

// 3. Google CrUX Real User Monitoring & Historical Trends
export interface CrUXFieldMetric {
  name: string;
  acronym: string;
  value: string;
  unit: string;
  p75: number;
  status: 'good' | 'needs_improvement' | 'poor';
  goodPercent: number;
  needsImprovementPercent: number;
  poorPercent: number;
  thresholdGood: string;
}

export interface HistoricalTrendPoint {
  date: string;
  overallScore: number;
  perfScore: number;
  seoScore: number;
  secScore: number;
  lcpMs: number;
  inpMs: number;
  clsScore: number;
}

// 4. Advanced OWASP Top 10 & CVE Vulnerability Item
export interface OwaspSecurityVulnerability {
  id: string;
  owaspCategory: string; // e.g. "A01:2021 - Broken Access Control"
  cveCode?: string;
  name: string;
  nameTe: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'PASSED';
  riskScore: number;
  pathOrComponent: string;
  description: string;
  remediation: string;
  codeSnippet?: string;
  status: 'vulnerable' | 'secure' | 'warning';
}

// 5. Multi-Channel Instant Alerts Configuration
export interface AlertChannelIntegration {
  id: 'whatsapp' | 'slack' | 'discord' | 'telegram' | 'email' | 'webhook';
  name: string;
  iconName: string;
  color: string;
  enabled: boolean;
  destination: string; // e.g. Phone number, Webhook URL, Telegram Chat ID, Email
  verified: boolean;
  triggers: {
    downtime: boolean;
    sslExpiry: boolean;
    scoreDropBelow: number;
    securityCve: boolean;
    weeklyDigest: boolean;
  };
  lastAlertSentAt?: string;
}

// 6. Team Workspace & Security Collaboration
export type WorkspaceMemberRole = 'owner' | 'admin' | 'security_lead' | 'developer' | 'viewer';

export interface WorkspaceMember {
  userId: string;
  email: string;
  name: string;
  role: WorkspaceMemberRole;
  joinedAt: string;
  avatarBg?: string;
  status: 'active' | 'pending';
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceMemberRole;
  invitedBy: string;
  invitedByName: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'revoked';
  token: string;
  note?: string;
}

export interface WorkspaceIssueComment {
  id: string;
  authorEmail: string;
  authorName: string;
  authorRole: string;
  content: string;
  codeSnippet?: string;
  timestamp: string;
}

export interface CollaborativeSecurityIssue {
  id: string;
  workspaceId: string;
  reportHostname: string;
  reportUrl: string;
  metricId: string;
  title: string;
  titleTe?: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'open' | 'in_progress' | 'review' | 'resolved';
  assignedToEmail?: string;
  assignedToName?: string;
  assignedToRole?: string;
  comments: WorkspaceIssueComment[];
  remediationSnippet?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedWorkspaceReport {
  id: string;
  workspaceId: string;
  url: string;
  hostname: string;
  overallScore: number;
  perfScore: number;
  secScore: number;
  seoScore: number;
  sharedByEmail: string;
  sharedByName: string;
  sharedAt: string;
  tag?: 'production' | 'staging' | 'client_audit' | 'critical';
  issuesCount: number;
  resolvedCount: number;
  notes?: string;
}

export interface TeamWorkspace {
  id: string;
  name: string;
  domainOrOrg?: string;
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt?: string;
  members: WorkspaceMember[];
  invitations: WorkspaceInvitation[];
  sharedReports: SharedWorkspaceReport[];
  issues: CollaborativeSecurityIssue[];
}

// 7. Dedicated API Status Page & System Health Telemetry
export type SystemHealthState = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface DayUptimeRecord {
  date: string;
  uptime: number; // e.g. 100 or 99.8
  status: SystemHealthState;
  incidentCount?: number;
}

export interface ApiEndpointHealth {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  name: string;
  nameTe?: string;
  description: string;
  descriptionTe?: string;
  group: 'Core Audit Engine' | 'Deep Crawler & Vitals' | 'Security & Infrastructure' | 'AI Remediation & Geo' | 'Developer & Gateway';
  status: SystemHealthState;
  latencyMs: number;
  baselineLatencyMs: number;
  successRate: number; // percentage e.g. 99.99
  uptime90d: number; // percentage e.g. 99.98
  uptimeHistory90d: DayUptimeRecord[];
  protocol: string;
  lastChecked: string;
  samplePayload?: Record<string, any>;
  sampleResponse?: Record<string, any>;
}

export interface GlobalRegionStatus {
  id: string;
  name: string;
  location: string;
  flag: string;
  status: SystemHealthState;
  latencyMs: number;
  packetLoss: number; // percentage e.g. 0.00
  jitterMs: number;
  pop: string;
  provider: string;
}

export interface SystemIncidentItem {
  id: string;
  title: string;
  titleTe?: string;
  status: 'resolved' | 'monitoring' | 'investigating' | 'scheduled';
  severity: 'maintenance' | 'minor' | 'major' | 'critical';
  date: string;
  duration: string;
  impact: string;
  impactTe?: string;
  affectedServices: string[];
  updates: Array<{
    timestamp: string;
    message: string;
    messageTe?: string;
    status: string;
  }>;
}

export interface ApiSystemStatusData {
  overallStatus: SystemHealthState;
  overallUptime90d: number;
  overallLatencyMs: number;
  activeIncidentsCount: number;
  lastUpdated: string;
  endpoints: ApiEndpointHealth[];
  regions: GlobalRegionStatus[];
  incidents: SystemIncidentItem[];
  metricsSummary: {
    totalChecks24h: number;
    avgTtfbMs: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
    availabilityPercent: number;
  };
}

export interface TeamAuditActivityItem {
  id: string;
  url: string;
  hostname: string;
  auditorName: string;
  auditorRole: string;
  auditorAvatar?: string;
  module: AuditTargetModule | string;
  moduleLabel?: string;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  timestamp: string;
  relativeTime: string;
  status: 'completed' | 'in-progress' | 'flagged';
  issuesCount: number;
  criticalIssues: number;
}





