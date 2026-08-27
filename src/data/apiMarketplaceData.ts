import { ApiPricingPlan, ApiDocumentationEndpoint } from '../types';

export const API_PRICING_PLANS: ApiPricingPlan[] = [
  {
    id: 'free',
    name: 'Free Developer',
    nameTe: 'ఉచిత డెవలపర్ ప్లాన్',
    priceINR: 0,
    auditsPerMonth: 100,
    credits: 100,
    pagesPerAudit: 5,
    rateLimitPerMin: 10,
    description: 'Perfect for indie hackers, prototyping, and personal API exploration.',
    descriptionTe: 'వ్యక్తిగత ప్రాజెక్టులు, ప్రోటోటైపింగ్ మరియు టెస్టింగ్ కోసం సరిపోతుంది.',
    features: [
      '100 API Audit Credits / Month',
      'Up to 5 Pages per Full Audit',
      '10 Requests / Minute Rate Limit',
      'Standard JSON Audit & Header Telemetry',
      'Community Support & Discord',
      'Instant wh_live_ API Key Generation',
    ],
    featuresTe: [
      'నెలకు 100 API ఆడిట్ క్రెడిట్స్',
      'ఒక్కో ఆడిట్‌కు 5 పేజీల వరకు స్కాన్',
      'నిమిషానికి 10 రిక్వెస్ట్‌ల రేట్ లిమిట్',
      'ప్రామాణిక JSON ఆడిట్ రెస్పాన్స్',
      'కమ్యూనిటీ సపోర్ట్',
      'తక్షణ wh_live_ API కీ యాక్సెస్',
    ],
    ctaText: 'Get Free API Key',
    ctaTextTe: 'ఉచిత కీ పొందండి',
  },
  {
    id: 'starter',
    name: 'Starter Tier',
    nameTe: 'స్టార్టర్ ప్లాన్',
    priceINR: 499,
    auditsPerMonth: 1000,
    credits: 1000,
    pagesPerAudit: 25,
    rateLimitPerMin: 20,
    tag: 'Best for Small Agencies',
    tagTe: 'చిన్న ఏజెన్సీలకు ఉత్తమం',
    description: 'For small digital agencies, boutique dev studios, and QA automation.',
    descriptionTe: 'చిన్న డిజిటల్ ఏజెన్సీలు మరియు వెబ్ డెవలప్‌మెంట్ బృందాల కోసం.',
    features: [
      '1,000 Audit Credits / Month (₹0.50/audit)',
      'Up to 25 Pages Deep Crawl per Audit',
      '20 Requests / Minute Rate Limit',
      'AI Code Remediation & Fix Snippets API',
      'Full DNS, SSL & OWASP Header Matrix',
      'Email & Slack Webhook Dispatch Alerts',
    ],
    featuresTe: [
      'నెలకు 1,000 ఆడిట్ క్రెడిట్స్ (₹0.50/ఆడిట్)',
      'ఒక్కో ఆడిట్‌కు 25 పేజీల డీప్ క్రాల్',
      'నిమిషానికి 20 రిక్వెస్ట్‌ల రేట్ లిమిట్',
      'AI కోడ్ ఫిక్స్ & రెమిడియేషన్ API',
      'పూర్తి DNS, SSL & OWASP హెడర్ మ్యాట్రిక్స్',
      'ఈమెయిల్ & వెబ్‌హుక్ అలర్ట్స్ సపోర్ట్',
    ],
    ctaText: 'Subscribe for ₹499/mo',
    ctaTextTe: '₹499కి ప్రారంభించండి',
  },
  {
    id: 'pro',
    name: 'Pro Agency',
    nameTe: 'ప్రో ఏజెన్సీ ప్లాన్',
    priceINR: 1999,
    auditsPerMonth: 10000,
    credits: 10000,
    pagesPerAudit: 100,
    rateLimitPerMin: 60,
    popular: true,
    tag: 'Most Popular for SaaS',
    tagTe: 'అత్యంత ప్రజాదరణ పొందినది',
    description: 'High-throughput engine for SaaS platforms, WordPress plugins, and top agencies.',
    descriptionTe: 'SaaS కంపెనీలు, WordPress ప్లగిన్లు మరియు టాప్ మార్కెటింగ్ ఏజెన్సీల కోసం.',
    features: [
      '10,000 Audit Credits / Month (₹0.20/audit)',
      'Up to 100 Pages Deep Crawl per Audit',
      '60 Requests / Minute Fast Pipeline',
      'White-Label PDF Generation Endpoint',
      'AI Automated /v1/ai/fix Endpoint',
      'Competitor Head-to-Head Benchmark API',
      'Dedicated IP Pool & 99.9% SLA Guarantee',
    ],
    featuresTe: [
      'నెలకు 10,000 ఆడిట్ క్రెడిట్స్ (₹0.20/ఆడిట్)',
      'ఒక్కో ఆడిట్‌కు 100 పేజీల డీప్ క్రాల్',
      'నిమిషానికి 60 రిక్వెస్ట్‌ల ఫాస్ట్ పైప్‌లైన్',
      'వైట్-లేబుల్ PDF జెనరేషన్ ఎండ్‌పాయింట్',
      'AI ఆటోమేటెడ్ /v1/ai/fix API ఎండ్‌పాయింట్',
      'పోటీదారుల హెడ్-టు-హెడ్ బెంచ్‌మార్క్ API',
      'డెడికేటెడ్ IP పూల్ & 99.9% అప్‌టైమ్ SLA',
    ],
    ctaText: 'Subscribe for ₹1,999/mo',
    ctaTextTe: '₹1,999కి సబ్‌స్క్రైబ్ చేయండి',
  },
  {
    id: 'business',
    name: 'Business Scale',
    nameTe: 'బిజినెస్ స్కేల్ ప్లాన్',
    priceINR: 6999,
    auditsPerMonth: 50000,
    credits: 50000,
    pagesPerAudit: 500,
    rateLimitPerMin: 300,
    tag: 'High Concurrency',
    tagTe: 'హై కాన్‌కరెన్సీ',
    description: 'For web hosting providers, cloud infrastructure, and large enterprise QA suites.',
    descriptionTe: 'వెబ్ హోస్టింగ్ కంపెనీలు మరియు భారీ ఎంటర్‌ప్రైజ్ ప్లాట్‌ఫారమ్‌ల కోసం.',
    features: [
      '50,000 Audit Credits / Month (₹0.14/audit)',
      'Up to 500 Pages Full Site Crawler',
      '300 Requests / Minute High Concurrency',
      'Real-Time Webhook Event Stream',
      'Unlimited API Key Team Seats',
      '24/7 Priority Telegram & WhatsApp Support',
      'Custom Rate Limit Expansion on Request',
    ],
    featuresTe: [
      'నెలకు 50,000 ఆడిట్ క్రెడిట్స్ (₹0.14/ఆడిట్)',
      'ఒక్కో ఆడిట్‌కు 500 పేజీల ఫుల్ సైట్ క్రాలర్',
      'నిమిషానికి 300 రిక్వెస్ట్‌ల హై కాన్‌కరెన్సీ',
      'రియల్-టైమ్ వెబ్‌హుక్ ఈవెంట్ స్ట్రీమ్',
      'అపరిమిత API కీ టీమ్ సీట్లు',
      '24/7 ప్రాధాన్యతా వాట్సాప్ & ఫోన్ సపోర్ట్',
      'కస్టమ్ రేట్ లిమిట్ విస్తరణ',
    ],
    ctaText: 'Subscribe for ₹6,999/mo',
    ctaTextTe: '₹6,999కి సబ్‌స్క్రైబ్ చేయండి',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Custom',
    nameTe: 'ఎంటర్‌ప్రైజ్ కస్టమ్',
    priceINR: 19999,
    auditsPerMonth: 250000,
    credits: 250000,
    pagesPerAudit: 2500,
    rateLimitPerMin: 1000,
    tag: 'Custom SLA',
    tagTe: 'కస్టమ్ SLA',
    description: 'Custom on-premise or cloud gateway for telecom, banks, and global hosting hosts.',
    descriptionTe: 'భారీ గ్లోబల్ హోస్టింగ్ కంపెనీలు మరియు బ్యాంకింగ్ ప్లాట్‌ఫారమ్‌ల కోసం.',
    features: [
      '250,000+ Credits & Custom Overages',
      'Up to 2,500+ Pages Crawl per Domain',
      '1,000 Requests / Minute Dedicated Gateway',
      'Custom Webhook Integrations & On-Premises Option',
      'Signed BAA / SOC-2 Compliance Attestation',
      'Dedicated Solutions Architect Support',
    ],
    featuresTe: [
      '250,000+ క్రెడిట్స్ & కస్టమ్ ఓవరేజ్',
      'ఒక్కో డొమైన్‌కు 2,500+ పేజీల క్రాల్',
      'నిమిషానికి 1,000 రిక్వెస్ట్‌ల డెడికేటెడ్ గేట్‌వే',
      'SOC-2 / ISO కంప్లయన్స్ రిపోర్టులు',
      'డెడికేటెడ్ ఆర్కిటెక్ట్ సపోర్ట్',
    ],
    ctaText: 'Contact Enterprise Sales',
    ctaTextTe: 'ఎంటర్‌ప్రైజ్ సేల్స్ సంప్రదించండి',
  },
];

export const API_ENDPOINTS: ApiDocumentationEndpoint[] = [
  {
    id: 'post_audit',
    path: '/v1/audit',
    method: 'POST',
    title: 'Audit Website',
    titleTe: 'వెబ్‌సైట్ ఆడిట్ ఎండ్‌పాయింట్',
    description: 'Submits a target URL for automated health, SEO, performance, security, and accessibility auditing.',
    descriptionTe: 'టార్గెట్ URL యొక్క హెల్త్, SEO, స్పీడ్, సెక్యూరిటీ మరియు యాక్సెసిబిలిటీని ఆడిట్ చేయడానికి రిక్వెస్ట్ పంపుతుంది.',
    category: 'audit',
    creditCost: 1,
    params: [
      { name: 'url', type: 'string', required: true, description: 'Target website URL with protocol (e.g. https://example.com)' },
      { name: 'pages', type: 'number', required: false, description: 'Number of pages to crawl (Default: 1, Max based on tier)' },
      { name: 'device', type: 'string', required: false, description: 'Device viewport ("mobile" | "desktop", Default: "mobile")' },
      { name: 'webhook_url', type: 'string', required: false, description: 'Optional webhook callback URL for asynchronous completion event' },
    ],
    requestBodySample: {
      url: 'https://example.com',
      pages: 10,
      device: 'mobile',
      webhook_url: 'https://api.yourdomain.com/webhooks/audit-completed',
    },
    responseSample: {
      audit_id: 'aud_1724398124912',
      status: 'completed',
      target_url: 'https://example.com',
      hostname: 'example.com',
      score: 88,
      seo: 92,
      performance: 81,
      security: 95,
      accessibility: 88,
      best_practices: 86,
      issues: 6,
      breakdown: {
        p0_critical: 0,
        p1_high: 2,
        p2_medium: 4,
      },
      credits_consumed: 1,
      credits_remaining: 999,
      rate_limit: {
        limit: 60,
        remaining: 59,
        reset_seconds: 58,
      },
      created_at: '2026-08-23T08:15:00.000Z',
    },
  },
  {
    id: 'get_audit_status',
    path: '/v1/audit/{audit_id}',
    method: 'GET',
    title: 'Check Audit Status',
    titleTe: 'ఆడిట్ స్థితిని తనిఖీ చేయండి',
    description: 'Retrieves the current execution state, completion percentage, and score snapshot of an audit.',
    descriptionTe: 'ఆడిట్ ఐడీ ఆధారంగా స్కానింగ్ స్థితి మరియు స్కోర్ సారాంశాన్ని అందిస్తుంది.',
    category: 'audit',
    creditCost: 0,
    params: [
      { name: 'audit_id', type: 'string', required: true, description: 'Unique audit ID returned by /v1/audit' },
    ],
    responseSample: {
      audit_id: 'aud_1724398124912',
      status: 'completed',
      progress: 100,
      score: 88,
      hostname: 'example.com',
      duration_ms: 1240,
      completed_at: '2026-08-23T08:15:01.240Z',
    },
  },
  {
    id: 'get_audit_report',
    path: '/v1/audit/{audit_id}/report',
    method: 'GET',
    title: 'Get Full Audit Report JSON',
    titleTe: 'పూర్తి ఆడిట్ నివేదిక JSON పొందండి',
    description: 'Returns granular audit metrics, security header status, Core Web Vitals, and actionable remediation snippets.',
    descriptionTe: 'అన్ని కేటగిరీల డీటెయిల్డ్ మెట్రిక్స్, సెక్యూరిటీ హెడర్స్ మరియు పరిష్కార కోడ్ స్నిప్పెట్లను అందిస్తుంది.',
    category: 'audit',
    creditCost: 0,
    params: [
      { name: 'audit_id', type: 'string', required: true, description: 'Unique audit ID' },
    ],
    responseSample: {
      audit_id: 'aud_1724398124912',
      target_url: 'https://example.com',
      overall_score: 88,
      metrics: [
        {
          id: 'sec_csp',
          category: 'Security & OWASP',
          name: 'Content Security Policy (CSP)',
          status: 'pass',
          score: 100,
          value: 'Enforced (default-src self)',
        },
        {
          id: 'perf_lcp',
          category: 'Core Web Vitals',
          name: 'Largest Contentful Paint (LCP)',
          status: 'warning',
          score: 74,
          value: '2.6s',
          recommendation: 'Preload hero image with high fetchpriority.',
        },
      ],
      ssl_grade: 'A+',
      tls_version: 'TLS 1.3',
      server_technology: 'Nginx / Cloudflare',
    },
  },
  {
    id: 'post_page_audit',
    path: '/v1/page-audit',
    method: 'POST',
    title: 'Single Page Deep Audit',
    titleTe: 'సింగిల్ పేజీ డీప్ ఆడిట్',
    description: 'Audits an isolated URL for DOM structure, meta tags, schema markup, Core Web Vitals, and image optimization.',
    descriptionTe: 'ఒక నిర్దిష్ట వెబ్‌పేజీ యొక్క DOM, మెటా ట్యాగ్‌లు, స్కీమా మరియు ఇమేజ్ ఆప్టిమైజేషన్‌ను ఆడిట్ చేస్తుంది.',
    category: 'crawler',
    creditCost: 1,
    params: [
      { name: 'page_url', type: 'string', required: true, description: 'Full URL of the specific page' },
    ],
    requestBodySample: {
      page_url: 'https://example.com/pricing',
    },
    responseSample: {
      page_url: 'https://example.com/pricing',
      title: 'Pricing Plans - Example SaaS',
      meta_description_length: 148,
      h1_count: 1,
      broken_links_count: 0,
      images_missing_alt: 0,
      ttfb_ms: 120,
      lcp_seconds: 1.8,
      cls_score: 0.02,
      schema_types_found: ['Product', 'FAQPage', 'BreadcrumbList'],
      status: 'healthy',
    },
  },
  {
    id: 'post_ai_fix',
    path: '/v1/ai/fix',
    method: 'POST',
    title: 'AI Code Remediation Generator',
    titleTe: 'AI కోడ్ ఫిక్స్ & రెమిడియేషన్ జనరేటర్',
    description: 'Generates ready-to-paste production fixes (Nginx, Apache, React, Cloudflare Worker, Next.js) for any detected health issue.',
    descriptionTe: 'ఏదైనా వెబ్‌సైట్ సమస్య కోసం తక్షణమే కాపీ చేసి పేస్ట్ చేసుకోగల ప్రొడక్షన్ కోడ్ ఫిక్స్‌ను AI అందిస్తుంది.',
    category: 'ai_fix',
    creditCost: 1,
    params: [
      { name: 'issue', type: 'string', required: true, description: 'Issue name or metric ID (e.g. "Missing HSTS Header")' },
      { name: 'url', type: 'string', required: true, description: 'Target website URL' },
      { name: 'server_type', type: 'string', required: false, description: '"nginx" | "apache" | "cloudflare" | "nextjs"' },
    ],
    requestBodySample: {
      issue: 'Content Security Policy (CSP) Missing',
      url: 'https://example.com',
      server_type: 'nginx',
    },
    responseSample: {
      issue: 'Content Security Policy (CSP) Missing',
      severity: 'critical',
      priority: 'P0',
      explanation: 'Without a Content Security Policy, malicious actors can execute Cross-Site Scripting (XSS) and data injection attacks.',
      fix: 'Add a robust Content-Security-Policy header directive in your Nginx server block.',
      code: "add_header Content-Security-Policy \"default-src 'self'; script-src 'self' https:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';\" always;",
      framework: 'Nginx Web Server',
      verification_command: 'curl -I https://example.com | grep -i content-security-policy',
    },
  },
  {
    id: 'get_usage',
    path: '/v1/usage',
    method: 'GET',
    title: 'Get API Usage & Quota Stats',
    titleTe: 'API వినియోగం & క్రెడిట్ కోటా వివరాలు',
    description: 'Returns real-time credit consumption, monthly quota limits, active rate limits, and endpoint breakdown.',
    descriptionTe: 'API కీ యొక్క మిగిలిన క్రెడిట్స్, వినియోగించిన కాల్స్ మరియు రేట్ లిమిట్ వివరాలను అందిస్తుంది.',
    category: 'analytics',
    creditCost: 0,
    responseSample: {
      api_key_id: 'key_live_9f82...104a',
      tier: 'Pro Agency',
      credits_total: 10000,
      credits_used: 1248,
      credits_remaining: 8752,
      rate_limit_per_min: 60,
      endpoints_breakdown: {
        audit: 940,
        page_audit: 180,
        ai_fix: 128,
      },
      period_start: '2026-08-01T00:00:00.000Z',
      period_end: '2026-08-31T23:59:59.000Z',
    },
  },
];

export const generateCodeSnippet = (
  language: 'curl' | 'node' | 'python' | 'php' | 'go' | 'java' | 'ruby',
  endpoint: ApiDocumentationEndpoint,
  apiKey: string
): string => {
  const key = apiKey || 'wh_live_your_api_key_here';
  const baseUrl = 'https://websitehealth.ai/api';

  switch (language) {
    case 'curl':
      if (endpoint.method === 'POST') {
        return `curl -X POST "${baseUrl}${endpoint.path}" \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.requestBodySample || { url: 'https://example.com' }, null, 2)}'`;
      }
      return `curl -X GET "${baseUrl}${endpoint.path.replace('{audit_id}', 'aud_1724398124912')}" \\
  -H "Authorization: Bearer ${key}"`;

    case 'node':
      if (endpoint.method === 'POST') {
        return `import axios from 'axios';

// 1. Configure Request Payload
const runAudit = async () => {
  try {
    const response = await axios.post(
      '${baseUrl}${endpoint.path}',
      ${JSON.stringify(endpoint.requestBodySample || { url: 'https://example.com' }, null, 2)},
      {
        headers: {
          Authorization: 'Bearer ${key}',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Website Audit Result:', response.data);
    console.log('Health Score:', response.data.score);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

runAudit();`;
      }
      return `import axios from 'axios';

const getReport = async () => {
  try {
    const res = await axios.get(
      '${baseUrl}${endpoint.path.replace('{audit_id}', 'aud_1724398124912')}',
      {
        headers: { Authorization: 'Bearer ${key}' },
      }
    );
    console.log('Report JSON:', res.data);
  } catch (error: any) {
    console.error('Error fetching report:', error.response?.data || error.message);
  }
};

getReport();`;

    case 'python':
      if (endpoint.method === 'POST') {
        return `import requests

url = "${baseUrl}${endpoint.path}"
headers = {
    "Authorization": "Bearer ${key}",
    "Content-Type": "application/json"
}
payload = ${JSON.stringify(endpoint.requestBodySample || { url: 'https://example.com' }, null, 4)}

try:
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()
    print(f"Audit Success! Health Score: {data.get('score', 'N/A')}/100")
    print("Full JSON Payload:", data)
except requests.exceptions.HTTPError as err:
    print(f"HTTP Error ({response.status_code}):", response.text)
except Exception as e:
    print("Request Failed:", str(e))`;
      }
      return `import requests

url = "${baseUrl}${endpoint.path.replace('{audit_id}', 'aud_1724398124912')}"
headers = {"Authorization": "Bearer ${key}"}

response = requests.get(url, headers=headers)
print("Status:", response.status_code)
print(response.json())`;

    case 'php':
      return `<?php
/**
 * Website Health API Integration for PHP / WordPress Plugin
 */
$apiKey = '${key}';
$apiUrl = '${baseUrl}${endpoint.path}';

$payload = json_encode(${JSON.stringify(endpoint.requestBodySample || { url: 'https://example.com' }, null, 2)});

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json',
    'User-Agent: WebsiteHealth-PHP-Client/1.4'
]);

${endpoint.method === 'POST' ? 'curl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $payload);' : ''}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch);
} else {
    $data = json_decode($response, true);
    echo "HTTP Status: " . $httpCode . "\\n";
    echo "Health Score: " . ($data['score'] ?? $data['overall_score'] ?? 'N/A') . "/100\\n";
}

curl_close($ch);
?>`;

    case 'go':
      return `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

func main() {
	apiUrl := "${baseUrl}${endpoint.path}"
	apiKey := "${key}"

	payloadData := ${JSON.stringify(endpoint.requestBodySample || { url: 'https://example.com' }, null, 2)}
	payloadBytes, _ := json.Marshal(payloadData)

	req, err := http.NewRequest("${endpoint.method}", apiUrl, bytes.NewBuffer(payloadBytes))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Printf("HTTP %d\\nResponse: %s\\n", resp.StatusCode, string(body))
}`;

    case 'java':
      return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class WebsiteHealthApiDemo {
    public static void main(String[] args) throws Exception {
        String apiUrl = "${baseUrl}${endpoint.path}";
        String apiKey = "${key}";
        String payload = """
${JSON.stringify(endpoint.requestBodySample || { url: 'https://example.com' }, null, 2)}
        """;

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();

        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json");

        HttpRequest request = "${endpoint.method}".equals("POST")
                ? requestBuilder.POST(HttpRequest.BodyPublishers.ofString(payload)).build()
                : requestBuilder.GET().build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + response.statusCode());
        System.out.println("Payload: " + response.body());
    }
}`;

    case 'ruby':
      return `require 'net/http'
require 'uri'
require 'json'

uri = URI.parse("${baseUrl}${endpoint.path}")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = (uri.scheme == 'https')

request = ${endpoint.method === 'POST' ? 'Net::HTTP::Post.new(uri.request_uri)' : 'Net::HTTP::Get.new(uri.request_uri)'}
request['Authorization'] = 'Bearer ${key}'
request['Content-Type'] = 'application/json'
${endpoint.method === 'POST' ? `request.body = ${JSON.stringify(endpoint.requestBodySample || { url: 'https://example.com' })}.to_json` : ''}

response = http.request(request)
puts "HTTP Status: #{response.code}"
puts "Response Body: #{response.body}"`;

    default:
      return '';
  }
};

export const generateOpenApiSpec = (): string => {
  return JSON.stringify(
    {
      openapi: '3.0.3',
      info: {
        title: 'Website Health & Security REST API',
        version: '1.4.0',
        description:
          'High-performance programmatic REST API gateway for automated SEO, security headers, Core Web Vitals, accessibility audits, and AI remediation snippets.',
        contact: {
          name: 'Website Health Developer Support',
          url: 'https://websitehealth.ai/api',
          email: 'api-support@websitehealth.ai',
        },
      },
      servers: [
        {
          url: 'https://websitehealth.ai/api',
          description: 'Production Edge Gateway',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'API_KEY (wh_live_...)',
          },
        },
      },
      security: [{ BearerAuth: [] }],
      paths: {
        '/v1/audit': {
          post: {
            summary: 'Execute Full Website Audit',
            description: 'Initiates multi-category deep audit including SEO, performance, SSL, OWASP, and accessibility checks.',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['url'],
                    properties: {
                      url: { type: 'string', example: 'https://example.com' },
                      pages: { type: 'integer', example: 10 },
                      device: { type: 'string', enum: ['mobile', 'desktop'], default: 'mobile' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': { description: 'Successful audit completion' },
              '401': { description: 'Unauthorized - invalid or missing Bearer token' },
              '402': { description: 'Payment required - credits quota depleted' },
              '429': { description: 'Too Many Requests - rate limit exceeded' },
            },
          },
        },
        '/v1/audit/{audit_id}': {
          get: {
            summary: 'Check Audit Status',
            parameters: [
              { name: 'audit_id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
              '200': { description: 'Audit status snapshot' },
            },
          },
        },
        '/v1/page-audit': {
          post: {
            summary: 'Single Page Deep Audit',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['page_url'],
                    properties: {
                      page_url: { type: 'string', example: 'https://example.com/pricing' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': { description: 'Single page diagnostics' },
            },
          },
        },
        '/v1/ai/fix': {
          post: {
            summary: 'Generate AI Remediation Code',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['issue', 'url'],
                    properties: {
                      issue: { type: 'string', example: 'Missing HSTS' },
                      url: { type: 'string', example: 'https://example.com' },
                      server_type: { type: 'string', example: 'nginx' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': { description: 'AI generated code and fix configuration' },
            },
          },
        },
        '/v1/usage': {
          get: {
            summary: 'Check Credit Balance & Rate Limit',
            responses: {
              '200': { description: 'Current quota balance and endpoint breakdown' },
            },
          },
        },
      },
    },
    null,
    2
  );
};
