import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Zap,
  Lock,
  Eye,
  FileCheck2,
  Gauge,
  HelpCircle,
  Info,
  Mail,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Code2,
  ArrowLeft,
  DollarSign,
} from 'lucide-react';
import { Language, AuditTargetModule } from '../types';

export interface SeoLandingPageData {
  slug: string;
  title: string;
  titleTe: string;
  h1: string;
  h1Te: string;
  metaDesc: string;
  metaDescTe: string;
  icon: React.ElementType;
  color: string;
  checkpoints: {
    name: string;
    description: string;
    descriptionTe: string;
  }[];
  explanation: {
    heading: string;
    content: string;
    contentTe: string;
  }[];
}

export const SEO_LANDING_PAGES: Record<string, SeoLandingPageData> = {
  'website-seo-checker': {
    slug: 'website-seo-checker',
    title: 'Free Website SEO Checker & SEO Audit Tool | Website Health Platform',
    titleTe: 'ఉచిత వెబ్‌సైట్ SEO చెకర్ & SEO ఆడిట్ టూల్',
    h1: 'Free Website SEO Checker & Technical Audit Tool',
    h1Te: 'ఉచిత వెబ్‌సైట్ SEO చెకర్ & సాంకేతిక ఆడిట్',
    metaDesc:
      'Analyze on-page SEO, meta title, description, H1-H6 headings, image alt tags, canonical URLs, robots.txt, XML sitemap, and JSON-LD schema with 1-click remediation.',
    metaDescTe:
      'ఆన్-పేజ్ SEO, మెటా టైటిల్, వివరణ, హెడింగ్స్, ఇమేజ్ ఆల్ట్ ట్యాగ్స్, మరియు స్కీమా మార్కప్‌లను ఉచితంగా స్కాన్ చేయండి.',
    icon: Search,
    color: 'teal',
    checkpoints: [
      {
        name: 'Meta Titles & Descriptions',
        description: 'Verifies length (50-60 chars for title, 155-160 chars for snippet), keyword focus, and duplicate prevention.',
        descriptionTe: 'మెటా టైటిల్ మరియు వివరణ యొక్క పొడవు మరియు నాణ్యత తనిఖీ చేస్తుంది.',
      },
      {
        name: 'Heading Structure (H1-H6)',
        description: 'Ensures exactly one semantic H1 per page, sequential H2-H6 nesting without skipping hierarchy levels.',
        descriptionTe: 'పేజీకి ఒకే H1 మరియు సరైన హెడింగ్ క్రమాన్ని ధృవీకరిస్తుంది.',
      },
      {
        name: 'Canonical & Duplicate URLs',
        description: 'Checks rel="canonical" tags to prevent Google duplicate content penalties across query parameters and subdomains.',
        descriptionTe: 'డూప్లికేట్ కంటెంట్ నిరోధించడానికి కానానికల్ ట్యాగ్స్ పరిశీలిస్తుంది.',
      },
      {
        name: 'Robots.txt & XML Sitemap',
        description: 'Validates crawler access, bot indexing directives, and sitemap.xml reachability for fast indexing.',
        descriptionTe: 'క్రాలర్ డైరెక్టివ్స్ మరియు sitemap.xml లింక్‌లను తనిఖీ చేస్తుంది.',
      },
      {
        name: 'Image Alt Attributes',
        description: 'Audits every image for descriptive alt text, webp formats, and width/height aspect ratios to boost Google Image SEO.',
        descriptionTe: 'ప్రతి ఇమేజ్‌కి ఆల్ట్ టెక్స్ట్ మరియు సైజ్ ఆట్రిబ్యూట్స్ చెక్ చేస్తుంది.',
      },
      {
        name: 'Schema.org JSON-LD Structured Data',
        description: 'Validates Organization, WebApplication, FAQPage, and BreadcrumbList markup for Google Rich Snippets.',
        descriptionTe: 'గూగుల్ రిచ్ స్నిప్పెట్స్ కోసం JSON-LD స్కీమా మార్కప్‌ను నిర్ధారిస్తుంది.',
      },
    ],
    explanation: [
      {
        heading: 'Why is On-Page & Technical SEO Critical?',
        content:
          'Search engines like Google rely on well-structured HTML semantic markup, fast response times, and clear canonical signals to understand your content. Missing meta tags or broken heading hierarchies directly reduce your visibility in search results.',
        contentTe:
          'గూగుల్ వంటి సెర్చ్ ఇంజిన్‌లు మీ కంటెంట్‌ను అర్థం చేసుకోవడానికి సరైన HTML సెమాంటిక్ మార్కప్ మరియు మెటా ట్యాగ్స్ తప్పనిసరి. వీటిని సరిదిద్దడం ద్వారా సెర్చ్ ర్యాంకింగ్స్‌లో ముందంజలో ఉండవచ్చు.',
      },
      {
        heading: 'How to Fix Detected SEO Issues',
        content:
          'Our platform generates copy-paste ready HTML fixes or automated GitHub Pull Requests that apply optimized titles, descriptions, and JSON-LD schema directly into your code repository.',
        contentTe:
          'మా ప్లాట్‌ఫామ్ సిద్ధంగా ఉన్న HTML కోడ్ స్నిప్పెట్స్ లేదా GitHub PRలను రూపొందిస్తుంది, దీని ద్వారా మీరు క్షణాల్లో లోపాలను సరిచేయవచ్చు.',
      },
    ],
  },

  'website-health-checker': {
    slug: 'website-health-checker',
    title: 'Complete Website Health Checker | 360-Degree Diagnostics',
    titleTe: 'పూర్తి వెబ్‌సైట్ హెల్త్ చెకర్',
    h1: 'Complete Website Health Checker & Diagnostic Platform',
    h1Te: 'సమగ్ర వెబ్‌సైట్ హెల్త్ చెకర్ & డయాగ్నస్టిక్స్',
    metaDesc:
      'All-in-one health inspection measuring performance, SEO, SSL encryption, accessibility, DNS records, and best practices.',
    metaDescTe:
      'వెబ్‌సైట్ వేగం, భద్రత, SEO మరియు యాక్సెసిబిలిటీల సంపూర్ణ 360 డిగ్రీల తనిఖీ.',
    icon: ShieldCheck,
    color: 'emerald',
    checkpoints: [
      {
        name: 'Unified Health Score (0-100)',
        description: 'Single diagnostic score weighted across all technical vectors.',
        descriptionTe: 'అన్ని విభాగాల ఆధారంగా ఏకీకృత 0-100 హెల్త్ స్కోర్.',
      },
      {
        name: 'Core Web Vitals Telemetry',
        description: 'LCP, CLS, and TBT live metrics against Web Vitals benchmarks.',
        descriptionTe: 'వాస్తవ స్పీడ్ మరియు లేఅవుట్ స్టెబిలిటీ కొలతలు.',
      },
      {
        name: 'Automated Issue Triage',
        description: 'Prioritizes high, medium, and low severity issues for instant remediation.',
        descriptionTe: 'తీవ్రత ఆధారంగా సమస్యల వర్గీకరణ.',
      },
    ],
    explanation: [
      {
        heading: 'What Constitutes True Website Health?',
        content:
          'A healthy website balances blazing-fast load speeds, rock-solid HTTPS security, semantic accessibility for all users, and immaculate search engine indexability.',
        contentTe:
          'వేగవంతమైన లోడింగ్, బలమైన భద్రత, అందరికీ అందుబాటులో ఉండే యాక్సెసిబిలిటీ మరియు అద్భుతమైన SEOల కలయికే నిజమైన వెబ్‌సైట్ హెల్త్.',
      },
    ],
  },

  'website-security-checker': {
    slug: 'website-security-checker',
    title: 'Website Security Checker & Vulnerability Scanner | SSL Audit',
    titleTe: 'వెబ్‌సైట్ సెక్యూరిటీ చెకర్ & SSL ఆడిట్',
    h1: 'Website Security Checker & SSL Vulnerability Scanner',
    h1Te: 'వెబ్‌సైట్ సెక్యూరిటీ చెకర్ & వల్నరబిలిటీ స్కానర్',
    metaDesc:
      'Verify SSL/TLS certificate validity, HSTS headers, X-Frame-Options, Content Security Policy (CSP), and open server ports.',
    metaDescTe:
      'SSL సర్టిఫికేట్ చెల్లుబాటు, HSTS హెడర్స్ మరియు సర్వర్ సెక్యూరిటీ కాన్ఫిగరేషన్ల తనిఖీ.',
    icon: Lock,
    color: 'cyan',
    checkpoints: [
      {
        name: 'SSL/TLS 1.3 Cryptography',
        description: 'Validates issuer chain, RSA/ECC key strength, and expiration countdown.',
        descriptionTe: 'SSL సర్టిఫికేట్ గడువు మరియు ఎన్‌క్రిప్షన్ బలాన్ని తనిఖీ చేస్తుంది.',
      },
      {
        name: 'Strict-Transport-Security (HSTS)',
        description: 'Ensures max-age=31536000 with subdomains and preload eligibility.',
        descriptionTe: 'బ్రౌజర్ లెవల్ బలవంతపు HTTPS ఎన్‌ఫోర్స్‌మెంట్.',
      },
      {
        name: 'OWASP Security Headers',
        description: 'Checks X-Frame-Options (Clickjacking), X-Content-Type-Options, and CSP.',
        descriptionTe: 'క్లిక్‌జాకింగ్ మరియు MIME-టైప్ స్నిఫింగ్ నిరోధక హెడర్స్.',
      },
    ],
    explanation: [
      {
        heading: 'Why Server Security Headers Matter',
        content:
          'Modern cyber threats often exploit missing HTTP headers. Implementing HSTS, CSP, and Referrer-Policy shields your users from injection attacks and data leakage.',
        contentTe:
          'సెక్యూరిటీ హెడర్స్ లేకపోతే సైట్ దాడులకు గురయ్యే ప్రమాదం ఉంది. వీటిని ఆటోమేటిక్‌గా కాన్ఫిగర్ చేయడం ద్వారా వినియోగదారుల డేటా సురక్షితంగా ఉంటుంది.',
      },
    ],
  },

  'website-performance-checker': {
    slug: 'website-performance-checker',
    title: 'Website Performance Checker & Speed Test | Core Web Vitals',
    titleTe: 'వెబ్‌సైట్ పెర్ఫార్మెన్స్ చెకర్ & స్పీడ్ టెస్ట్',
    h1: 'Website Performance Checker & Page Speed Analyzer',
    h1Te: 'వెబ్‌సైట్ పెర్ఫార్మెన్స్ చెకర్ & పేజీ స్పీడ్ విశ్లేషణ',
    metaDesc:
      'Speed test measuring TTFB, Largest Contentful Paint, Cumulative Layout Shift, resource compression, and render-blocking scripts.',
    metaDescTe:
      'పేజీ లోడింగ్ వేగం, కోర్ వెబ్ వైటల్స్ మరియు స్క్రిప్ట్ ఆప్టిమైజేషన్ స్పీడ్ టెస్ట్.',
    icon: Zap,
    color: 'amber',
    checkpoints: [
      {
        name: 'Time to First Byte (TTFB)',
        description: 'Server response latency benchmarking under 200ms.',
        descriptionTe: 'సర్వర్ ప్రాథమిక రెస్పాన్స్ వేగం కొలత.',
      },
      {
        name: 'Largest Contentful Paint (LCP)',
        description: 'Main visual content paint time benchmarked under 2.5s.',
        descriptionTe: 'ప్రధాన విజువల్ కంటెంట్ లోడ్ అయ్యే సమయం.',
      },
      {
        name: 'Resource Deferral & Minification',
        description: 'Identifies unminified CSS/JS and render-blocking resources.',
        descriptionTe: 'భారీ స్క్రిప్ట్‌లను డిఫర్ చేసి లోడింగ్ వేగాన్ని పెంచడం.',
      },
    ],
    explanation: [
      {
        heading: 'Speed Directly Impacts Conversions',
        content:
          'Every 100ms improvement in page load speed can lift conversions by up to 8%. Optimizing critical rendering paths guarantees lower bounce rates and higher sales.',
        contentTe:
          'వెబ్‌సైట్ వేగం పెరిగే కొద్దీ యూజర్ ఎంగేజ్‌మెంట్ మరియు కన్వర్షన్స్ గణనీయంగా పెరుగుతాయి.',
      },
    ],
  },

  'website-accessibility-checker': {
    slug: 'website-accessibility-checker',
    title: 'Website Accessibility Checker | WCAG 2.1 AA Compliance Audit',
    titleTe: 'వెబ్‌సైట్ యాక్సెసిబిలిటీ చెకర్',
    h1: 'Website Accessibility Checker & WCAG Compliance Tool',
    h1Te: 'వెబ్‌సైట్ యాక్సెసిబిలిటీ చెకర్ & WCAG ఆడిట్',
    metaDesc:
      'Audit your website for WCAG 2.1 AA compliance, color contrast ratios, screen reader ARIA labels, and keyboard navigation.',
    metaDescTe:
      'WCAG 2.1 AA ప్రమాణాలు, కాంట్రాస్ట్ రేషియోలు మరియు స్క్రీన్ రీడర్ లేబుల్స్ తనిఖీ.',
    icon: Eye,
    color: 'purple',
    checkpoints: [
      {
        name: 'Color Contrast (4.5:1 ratio)',
        description: 'Ensures body text and interactive controls meet WCAG AA contrast standards.',
        descriptionTe: 'చదవడానికి సులభంగా ఉండే రంగుల కాంట్రాస్ట్ తనిఖీ.',
      },
      {
        name: 'ARIA Labels & Roles',
        description: 'Provides descriptive labels for icon buttons and navigation elements.',
        descriptionTe: 'స్క్రీన్ రీడర్ల కోసం స్పష్టమైన లేబుల్స్.',
      },
      {
        name: 'Keyboard Navigation & Focus Traps',
        description: 'Guarantees seamless tabbing without mouse dependency.',
        descriptionTe: 'కీబోర్డ్ ద్వారా మాత్రమే మొత్తం సైట్‌ను నావిగేట్ చేసే సదుపాయం.',
      },
    ],
    explanation: [
      {
        heading: 'Accessibility is Both Ethical and Legal',
        content:
          'Ensuring your site is accessible guarantees all users, including those with disabilities, can browse seamlessly, while protecting against ADA/WCAG compliance lawsuits.',
        contentTe:
          'అందరికీ సమాన డిజిటల్ అనుభవాన్ని అందించడంతో పాటు చట్టపరమైన నిబంధనలను పాటించడానికి యాక్సెసిబిలిటీ తప్పనిసరి.',
      },
    ],
  },

  'core-web-vitals-checker': {
    slug: 'core-web-vitals-checker',
    title: 'Core Web Vitals Checker | LCP, CLS, INP Diagnostic Tool',
    titleTe: 'కోర్ వెబ్ వైటల్స్ చెకర్',
    h1: 'Google Core Web Vitals Checker & Diagnostics',
    h1Te: 'గూగుల్ కోర్ వెబ్ వైటల్స్ చెకర్',
    metaDesc:
      'Benchmark your website against Google Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms) with actionable code optimizations.',
    metaDescTe:
      'గూగుల్ కోర్ వెబ్ వైటల్స్ (LCP, CLS, INP) ప్రమాణాల ప్రత్యక్ష కొలత మరియు పరిష్కారాలు.',
    icon: Gauge,
    color: 'teal',
    checkpoints: [
      {
        name: 'Largest Contentful Paint (LCP)',
        description: 'Target < 2.5s for green performance scoring.',
        descriptionTe: 'LCP సమయాన్ని 2.5 సెకన్ల కంటే తక్కువకు తగ్గించడం.',
      },
      {
        name: 'Cumulative Layout Shift (CLS)',
        description: 'Target < 0.1 to eliminate shifting UI elements.',
        descriptionTe: 'లేఅవుట్ షిఫ్ట్‌లను సున్నాకి చేర్చడం.',
      },
      {
        name: 'Interaction to Next Paint (INP)',
        description: 'Target < 200ms for instant click and tap feedback.',
        descriptionTe: 'యూజర్ క్లిక్‌లకు తక్షణ ప్రతిస్పందన వేగం.',
      },
    ],
    explanation: [
      {
        heading: 'Why Core Web Vitals are a Direct Ranking Factor',
        content:
          'Google uses real-world Chrome User Experience (CrUX) data to rank search results. Sites passing all three Core Web Vitals receive priority ranking in search results.',
        contentTe:
          'గూగుల్ శోధన ఫలితాలలో ర్యాంకింగ్ ఇవ్వడానికి కోర్ వెబ్ వైటల్స్ ఒక ముఖ్యమైన కొలమానం.',
      },
    ],
  },

  'ssl-checker': {
    slug: 'ssl-checker',
    title: 'Free SSL Certificate Checker & Expiry Validator | Website Health',
    titleTe: 'ఉచిత SSL సర్టిఫికేట్ చెకర్',
    h1: 'Free SSL Certificate Checker & Expiry Monitor',
    h1Te: 'ఉచిత SSL సర్టిఫికేట్ చెకర్ & ఎక్స్‌పైరీ మానిటర్',
    metaDesc:
      'Inspect SSL/TLS certificate chains, certificate authority, expiration date, and cipher protocol configuration.',
    metaDescTe:
      'SSL సర్టిఫికేట్ స్థితి, అథారిటీ, మరియు గడువు తేదీల ప్రత్యక్ష తనిఖీ.',
    icon: Lock,
    color: 'cyan',
    checkpoints: [
      {
        name: 'Chain & Authority Verification',
        description: 'Confirms Let’s Encrypt, Cloudflare, DigiCert, or Sectigo authority chain.',
        descriptionTe: 'ప్రముఖ సర్టిఫికేట్ అథారిటీ చైన్ ధృవీకరణ.',
      },
      {
        name: 'Expiry Countdown Alert',
        description: 'Alerts if renewal is needed within 30 days.',
        descriptionTe: 'గడువు ముగియక ముందే అప్రమత్తం చేసే అలర్ట్.',
      },
    ],
    explanation: [
      {
        heading: 'Avoid Insecure Warning Screens',
        content:
          'An expired or misconfigured SSL certificate triggers full-screen browser security warnings that instantly destroy visitor trust and traffic.',
        contentTe:
          'SSL గడువు ముగిస్తే బ్రౌజర్ వార్నింగ్ ఇచ్చి యూజర్లు సైట్ నుండి వెనుదిరిగే ప్రమాదం ఉంది.',
      },
    ],
  },

  'website-audit': {
    slug: 'website-audit',
    title: 'Enterprise Website Audit Tool | Full-Stack Score & PDF Export',
    titleTe: 'ఎంటర్‌ప్రైజ్ వెబ్‌సైట్ ఆడిట్ టూల్',
    h1: 'Enterprise Website Audit & Diagnostics Platform',
    h1Te: 'ఎంటర్‌ప్రైజ్ వెబ్‌సైట్ ఆడిట్ & డయాగ్నస్టిక్స్',
    metaDesc:
      'Comprehensive website audit evaluating speed, SEO, security, and accessibility with downloadable PDF reports and Git code fixes.',
    metaDescTe:
      'పూర్తి వెబ్‌సైట్ ఆడిట్, డౌన్‌లోడ్ చేసుకోగల PDF రిపోర్ట్ మరియు కోడ్ ఫిక్స్‌లు.',
    icon: FileCheck2,
    color: 'emerald',
    checkpoints: [
      {
        name: 'Executive PDF Reports',
        description: 'Branded white-label PDF audit reports ready for clients and stakeholders.',
        descriptionTe: 'క్లయింట్ల కోసం సిద్ధంగా ఉండే అందమైన PDF నివేదికలు.',
      },
      {
        name: 'Competitor Benchmarking',
        description: 'Compare your score side-by-side against top industry players.',
        descriptionTe: 'పోటీదారుల సైట్లతో స్కోర్ల ప్రత్యక్ష పోలిక.',
      },
    ],
    explanation: [
      {
        heading: 'Deliver Real Value to Clients',
        content:
          'Agencies and freelancers use our comprehensive audit reports to pitch web development improvements and deliver measurable results.',
        contentTe:
          'ఏజెన్సీలు మరియు డెవలపర్లు తమ క్లయింట్లకు ప్రొఫెషనల్ ఆడిట్ రిపోర్టులను అందించవచ్చు.',
      },
    ],
  },

  'pricing': {
    slug: 'pricing',
    title: 'Transparent Pricing Plans | Automated Code Remediation & Audit',
    titleTe: 'ధరల వివరాలు (Pricing Plans)',
    h1: 'Transparent Pricing for Automated Website Remediation',
    h1Te: 'స్వయంచాలక వెబ్‌సైట్ రిపేర్ ప్లాన్ల వివరాలు',
    metaDesc:
      'Choose between Quick Fix (₹299), Pro Fix (₹799), Complete Fix (₹1,499), and Business Monthly with verified Razorpay checkout.',
    metaDescTe:
      'Quick Fix, Pro Fix, Complete Fix మరియు Business సబ్‌స్క్రిప్షన్ ప్లాన్ల వివరాలు.',
    icon: DollarSign,
    color: 'emerald',
    checkpoints: [
      {
        name: 'Quick Fix (₹299)',
        description: 'Fixes top 5 critical SEO and security meta issues automatically.',
        descriptionTe: 'టాప్ 5 అత్యవసర సమస్యల ఆటోమేటిక్ పరిష్కారం.',
      },
      {
        name: 'Pro Fix ⭐ (₹799)',
        description: 'Fixes up to 20 comprehensive issues including SSL, HSTS, and ARIA.',
        descriptionTe: '20 వరకు సమగ్ర సమస్యలు + SSL/HSTS ప్యాచ్‌లు.',
      },
      {
        name: 'Complete Fix 💎 (₹1,499)',
        description: 'Zero-issue guarantee with direct GitHub Pull Request & ZIP patch.',
        descriptionTe: 'గుర్తించిన అన్ని సమస్యల సమగ్ర పరిష్కారం + డైరెక్ట్ GitHub PR.',
      },
    ],
    explanation: [
      {
        heading: 'Why Invest in Automated Remediation?',
        content:
          'Manual debugging takes hours of engineering time. Our automated system generates precise code modifications in minutes, saving you time and money.',
        contentTe:
          'మాన్యువల్‌గా కోడ్ సరిచేయడానికి పట్టే గంటల సమయాన్ని నిమిషాల్లోకి తగ్గించి ఖర్చు ఆదా చేస్తుంది.',
      },
    ],
  },

  'faq': {
    slug: 'faq',
    title: 'Frequently Asked Questions | Website Health & Security Platform',
    titleTe: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    h1: 'Frequently Asked Questions & Support Hub',
    h1Te: 'తరచుగా అడిగే ప్రశ్నలు & సహాయ కేంద్రం',
    metaDesc:
      'Learn about technical SEO audits, Core Web Vitals benchmarks, SSL verification, pricing, and automated code pull requests.',
    metaDescTe:
      'టెక్నికల్ SEO ఆడిట్, స్పీడ్ టెస్ట్, మరియు ఆటో-ఫిక్స్ సేవలపై ప్రశ్నలు మరియు సమాధానాలు.',
    icon: HelpCircle,
    color: 'teal',
    checkpoints: [
      {
        name: 'Is the initial scan free?',
        description: 'Yes! Unlimited basic and deep scans are 100% free forever.',
        descriptionTe: 'అవును, వెబ్‌సైట్ స్కాన్ మరియు రిపోర్ట్‌లు 100% ఉచితం.',
      },
      {
        name: 'How does GitHub PR generation work?',
        description: 'We generate standard Git patches or branch pull requests with zero secret access needed.',
        descriptionTe: 'మీ రిపోజిటరీకి సురక్షితమైన Git ప్యాచ్‌లను అందిస్తుంది.',
      },
    ],
    explanation: [
      {
        heading: 'Dedicated Support & Assistance',
        content:
          'Our engineering team is continually updating rulesets to match the latest Google Search algorithm updates and OWASP security standards.',
        contentTe:
          'గూగుల్ యొక్క తాజా అల్గారిథమ్ అప్‌డేట్‌లకు అనుగుణంగా మా సిస్టమ్ నిరంతరం అప్‌డేట్ చేయబడుతుంది.',
      },
    ],
  },

  'about': {
    slug: 'about',
    title: 'About Us | Website Health & Security Intelligence Platform',
    titleTe: 'మా గురించి (About Us)',
    h1: 'About Website Health & Security Intelligence',
    h1Te: 'మా వేదిక గురించి పూర్తి వివరాలు',
    metaDesc:
      'Empowering webmasters, developers, and businesses with instant automated web diagnostics and 1-click code remediation.',
    metaDescTe:
      'వెబ్‌సైట్ యజమానులు మరియు డెవలపర్ల కోసం అత్యాధునిక వెబ్ ఆడిట్ టెక్నాలజీ.',
    icon: Info,
    color: 'cyan',
    checkpoints: [
      {
        name: 'Mission-Driven Architecture',
        description: 'Building a faster, safer, and more accessible web for everyone.',
        descriptionTe: 'వేగవంతమైన మరియు సురక్షితమైన వెబ్ అనుభవాన్ని అందించడం మా లక్ష్యం.',
      },
      {
        name: 'Precision First',
        description: 'Zero fake numbers or inflated scores. Grounded in actual Google Lighthouse & OWASP metrics.',
        descriptionTe: 'వాస్తవ కొలతల ఆధారంగా ఖచ్చితమైన విశ్లేషణ.',
      },
    ],
    explanation: [
      {
        heading: 'Our Vision for Web Quality',
        content:
          'We believe every website deserves to load instantly, protect user data, and rank effectively on Google search without requiring months of tedious manual code refactoring.',
        contentTe:
          'ప్రతి వెబ్‌సైట్ వేగంగా లోడ్ అవ్వాలని, వినియోగదారుల డేటాను రక్షించాలని మరియు గూగుల్‌లో మంచి ర్యాంకింగ్ సాధించాలని మేము ఆశిస్తున్నాము.',
      },
    ],
  },

  'contact': {
    slug: 'contact',
    title: 'Contact Us | Website Health Support & Enterprise Inquiries',
    titleTe: 'మమ్మల్ని సంప్రదించండి (Contact Us)',
    h1: 'Contact Our Engineering & Support Team',
    h1Te: 'మా సపోర్ట్ టీమ్‌ను సంప్రదించండి',
    metaDesc:
      'Get in touch with our web diagnostics team for enterprise audits, custom API integrations, or technical support.',
    metaDescTe:
      'ఎంటర్‌ప్రైజ్ ఆడిట్ మరియు సహాయం కోసం మా టీమ్‌ను సంప్రదించండి.',
    icon: Mail,
    color: 'purple',
    checkpoints: [
      {
        name: 'Fast Response Time',
        description: 'Our engineering team responds to all inquiries within 24 hours.',
        descriptionTe: '24 గంటల్లో మా బృందం నుండి సమాధానం లభిస్తుంది.',
      },
      {
        name: 'Custom Integrations',
        description: 'Deploy our audit engine directly into your CI/CD pipeline.',
        descriptionTe: 'మీ CI/CD పైప్‌లైన్‌లో ఆడిట్ ఇంజిన్ అనుసంధానం.',
      },
    ],
    explanation: [
      {
        heading: 'We are here to help',
        content:
          'Whether you need custom automated remediation for a large corporate codebase or want to partner with us, reach out today.',
        contentTe:
          'మీ వెబ్‌సైట్ సాంకేతిక సమస్యల పరిష్కారం కోసం ఎప్పుడైనా మమ్మల్ని సంప్రదించవచ్చు.',
      },
    ],
  },

  'blog': {
    slug: 'blog',
    title: 'Website Health & SEO Knowledge Base | Expert Guides',
    titleTe: 'బ్లాగ్ & గైడ్లు (SEO Blog)',
    h1: 'Web Health, Performance & Technical SEO Guides',
    h1Te: 'వెబ్ హెల్త్, పెర్ఫార్మెన్స్ & SEO గైడ్లు',
    metaDesc:
      'In-depth articles and tutorials on fixing Core Web Vitals, configuring HSTS headers, passing WCAG AA, and mastering technical SEO.',
    metaDescTe:
      'కోర్ వెబ్ వైటల్స్, సెక్యూరిటీ హెడర్స్ మరియు టెక్నికల్ SEO పై నిపుణుల ఆర్టికల్స్.',
    icon: BookOpen,
    color: 'teal',
    checkpoints: [
      {
        name: 'How to Fix LCP Delays',
        description: 'Complete step-by-step guide to achieving Largest Contentful Paint under 1.8s.',
        descriptionTe: 'LCP వేగాన్ని మెరుగుపరచడానికి సమగ్ర గైడ్.',
      },
      {
        name: 'The 2026 Technical SEO Checklist',
        description: 'All 50+ on-page and technical checkpoints required for Google indexing.',
        descriptionTe: 'గూగుల్ ఇండెక్సింగ్ కోసం 2026 టెక్నికల్ SEO చెక్‌లిస్ట్.',
      },
    ],
    explanation: [
      {
        heading: 'Stay Ahead of Algorithm Shifts',
        content:
          'Our articles break down complex Google search updates and web performance standards into actionable code solutions for modern engineers.',
        contentTe:
          'గూగుల్ అల్గారిథమ్ మార్పులను అర్థం చేసుకుని సరైన కోడ్ సొల్యూషన్స్ అమలు చేయండి.',
      },
    ],
  },
};

interface SeoLandingHubProps {
  currentSlug: string;
  lang: Language;
  onSelectSlug: (slug: string) => void;
  onScanUrl: (url: string, targetModule?: AuditTargetModule) => void;
  onBackToHome: () => void;
  onOpenPricing?: () => void;
}

export const SeoLandingHub: React.FC<SeoLandingHubProps> = ({
  currentSlug,
  lang,
  onSelectSlug,
  onScanUrl,
  onBackToHome,
  onOpenPricing,
}) => {
  const isTe = lang === 'te';
  const page = SEO_LANDING_PAGES[currentSlug] || SEO_LANDING_PAGES['website-seo-checker'];
  const Icon = page.icon;

  const [inputUrl, setInputUrl] = useState('');

  const getSlugModule = (slug: string): AuditTargetModule => {
    switch (slug) {
      case 'website-seo-checker':
        return 'seo';
      case 'website-security-checker':
        return 'security';
      case 'website-performance-checker':
        return 'performance';
      case 'website-accessibility-checker':
        return 'accessibility';
      case 'core-web-vitals-checker':
        return 'vitals';
      case 'ssl-checker':
        return 'ssl';
      default:
        return 'all';
    }
  };

  const handleLaunchScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      const module = getSlugModule(currentSlug);
      onScanUrl(inputUrl.trim(), module);
      onBackToHome();
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Navigation Breadcrumb & Back Button */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
        <button
          type="button"
          id="btn-seo-back-to-main"
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 hover:text-white border-2 border-emerald-500/70 hover:border-emerald-400 text-sm sm:text-base font-black transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-95 cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5] text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          <span>{isTe ? 'ప్రధాన స్కానర్‌కి తిరిగి వెళ్లండి' : 'Back to Main Scanner & Dashboard'}</span>
        </button>

        {/* Quick Nav Dropdown / Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full py-1 text-xs">
          {Object.keys(SEO_LANDING_PAGES).map((key) => {
            const item = SEO_LANDING_PAGES[key];
            const isActive = currentSlug === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectSlug(key)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {key.replace(/-/g, ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Header for this Dedicated Landing Page */}
      <header className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Icon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isTe ? 'అంకితమైన SEO ల్యాండింగ్ పేజీ' : 'Dedicated Technical SEO Landing Hub'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {isTe ? page.h1Te : page.h1}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {isTe ? page.metaDescTe : page.metaDesc}
        </p>

        {/* Embedded Fast Scanner */}
        <form onSubmit={handleLaunchScan} className="max-w-2xl mx-auto pt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={isTe ? 'ఉదాహరణ: https://yoursite.com' : 'Enter website URL to audit (e.g. https://stripe.com)'}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-slate-800 border-2 border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-hidden"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTe ? 'ఇప్పుడే స్కాన్ చేయండి' : 'Run Free Audit'}</span>
          </button>
        </form>
      </header>

      {/* Key Checkpoints Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {isTe ? 'ప్రధాన తనిఖీ అంశాలు (Key Checkpoints Inspected)' : 'Key Checkpoints Inspected'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isTe
                ? 'ఈ టూల్ క్రింది అంశాలను లోతుగా విశ్లేషించి ఖచ్చితమైన స్కోర్‌లను అందిస్తుంది.'
                : 'Our crawler systematically tests these specific criteria for 100% compliance.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {page.checkpoints.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h3 className="font-bold text-sm text-white">{item.name}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isTe ? item.descriptionTe : item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Explanations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-white tracking-tight">
          {isTe ? 'సాంకేతిక వివరాలు & పరిష్కారాలు' : 'Technical Specifications & Remediation Insights'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {page.explanation.map((exp, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-850/80 border border-slate-800 space-y-3">
              <h3 className="text-base font-extrabold text-teal-300">{exp.heading}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTe ? exp.contentTe : exp.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Action Footer Call to Action */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/40 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          {isTe ? 'మీ వెబ్‌సైట్ ఎర్రర్లను పరిష్కరించడానికి సిద్ధంగా ఉన్నారా?' : 'Ready to diagnose and fix your website?'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {isTe
            ? 'ప్రధాన స్కానర్‌ని ఉపయోగించి మీ సైట్‌ను ఆడిట్ చేయండి లేదా మా 3-Tier ఆటోమేటెడ్ రిపేర్ ప్లాన్లను పరిశీలించండి.'
            : 'Launch a free live audit or explore our instant automated code remediation engine with verified Razorpay checkout.'}
        </p>
        <div className="flex items-center justify-center flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            {isTe ? 'లైవ్ స్కానర్‌కి వెళ్లండి' : 'Launch Live Scanner'}
          </button>
          {onOpenPricing && (
            <button
              type="button"
              onClick={onOpenPricing}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              {isTe ? 'ధరల ప్లాన్లు చూడండి' : 'Explore Remediation Plans (₹299+)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
