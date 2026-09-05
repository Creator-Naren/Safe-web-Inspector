import dns from 'node:dns/promises';
import tls from 'node:tls';
import { GoogleGenAI, Type } from '@google/genai';
import type {
  WebsiteSafetyReport,
  SslInspection,
  SecurityHeadersReport,
  DnsRecordsReport,
  HeuristicFlags,
  ThreatItem,
  ThreatLevel,
  SiteComparisonResult
} from '../src/types.js';

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export function parseAndNormalizeUrl(rawInput: string): { url: string; domain: string; protocol: string } {
  let cleaned = rawInput.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const parsed = new URL(cleaned);
    const domain = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol.replace(':', '').toLowerCase();
    return { url: parsed.href, domain, protocol };
  } catch {
    // Fallback if invalid URL
    const sanitized = rawInput.replace(/^https?:\/\//, '').split('/')[0].trim().toLowerCase();
    return {
      url: `https://${sanitized}`,
      domain: sanitized,
      protocol: 'https'
    };
  }
}

export async function inspectDns(domain: string): Promise<DnsRecordsReport> {
  const result: DnsRecordsReport = {
    hasA: false,
    aRecords: [],
    hasAaaa: false,
    aaaaRecords: [],
    hasMx: false,
    mxRecords: [],
    hasTxt: false,
    txtRecords: [],
    hasNs: false,
    nsRecords: [],
    hasSpfOrDmarc: false,
  };

  try {
    const a = await dns.resolve4(domain).catch(() => []);
    result.aRecords = a;
    result.hasA = a.length > 0;
  } catch {}

  try {
    const aaaa = await dns.resolve6(domain).catch(() => []);
    result.aaaaRecords = aaaa;
    result.hasAaaa = aaaa.length > 0;
  } catch {}

  try {
    const mx = await dns.resolveMx(domain).catch(() => []);
    result.mxRecords = mx.map((m) => `${m.exchange} (priority: ${m.priority})`);
    result.hasMx = mx.length > 0;
  } catch {}

  try {
    const txt = await dns.resolveTxt(domain).catch(() => []);
    const flatTxt = txt.map((t) => t.join(''));
    result.txtRecords = flatTxt.slice(0, 8); // Keep top 8 for readability
    result.hasTxt = flatTxt.length > 0;
    result.hasSpfOrDmarc = flatTxt.some(
      (t) => t.toLowerCase().includes('v=spf1') || t.toLowerCase().includes('v=dmarc1')
    );
  } catch {}

  try {
    const ns = await dns.resolveNs(domain).catch(() => []);
    result.nsRecords = ns;
    result.hasNs = ns.length > 0;
  } catch {}

  return result;
}

export async function inspectTls(domain: string, port = 443): Promise<SslInspection> {
  return new Promise((resolve) => {
    const timeoutMs = 5000;
    let resolved = false;

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({
          isValid: false,
          issuer: 'Connection timed out',
          subject: domain,
          validFrom: '',
          validTo: '',
          daysRemaining: 0,
          grade: 'F',
        });
      }
    }, timeoutMs);

    try {
      const socket = tls.connect(
        {
          host: domain,
          port,
          servername: domain,
          rejectUnauthorized: false,
        },
        () => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timer);

          try {
            const cert = socket.getPeerCertificate(true);
            const protocol = socket.getProtocol() || undefined;
            const cipher = socket.getCipher()?.name;
            const authorized = socket.authorized;

            if (!cert || Object.keys(cert).length === 0) {
              socket.destroy();
              return resolve({
                isValid: false,
                issuer: 'No certificate found',
                subject: domain,
                validFrom: '',
                validTo: '',
                daysRemaining: 0,
                grade: 'F',
              });
            }

            const validTo = cert.valid_to ? new Date(cert.valid_to).toISOString() : '';
            const validFrom = cert.valid_from ? new Date(cert.valid_from).toISOString() : '';
            const daysRemaining = cert.valid_to
              ? Math.max(0, Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
              : 0;

            const formatCertField = (field: string | string[] | undefined, fallback: string): string => {
              if (Array.isArray(field)) return field.join(', ');
              if (typeof field === 'string' && field.trim()) return field;
              return fallback;
            };

            const isExpired = daysRemaining <= 0;
            const issuerCN = formatCertField(cert.issuer?.CN, '');
            const subjectCN = formatCertField(cert.subject?.CN, '');
            const isSelfSigned = Boolean(issuerCN && subjectCN && issuerCN === subjectCN);
            const isValid = authorized && !isExpired && !isSelfSigned;

            // Determine grade
            let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'B';
            if (!isValid) {
              grade = 'F';
            } else if (protocol === 'TLSv1.3' && daysRemaining > 30) {
              grade = 'A+';
            } else if (daysRemaining > 15) {
              grade = 'A';
            } else if (daysRemaining > 0) {
              grade = 'C';
            }

            const issuerString = typeof cert.issuer === 'object' && cert.issuer
              ? formatCertField(cert.issuer.O || cert.issuer.CN, 'Unknown Certificate Authority')
              : String(cert.issuer || 'Unknown');

            const subjectString = typeof cert.subject === 'object' && cert.subject
              ? formatCertField(cert.subject.CN, domain)
              : String(cert.subject || domain);

            const sans = cert.subjectaltname
              ? cert.subjectaltname.split(',').map((s) => s.trim().replace(/^DNS:/i, ''))
              : [];

            socket.destroy();
            resolve({
              isValid,
              issuer: issuerString,
              subject: subjectString,
              validFrom,
              validTo,
              daysRemaining,
              protocol,
              cipher,
              sans: sans.slice(0, 10),
              isSelfSigned,
              grade,
            });
          } catch (err) {
            socket.destroy();
            resolve({
              isValid: false,
              issuer: 'Error reading certificate',
              subject: domain,
              validFrom: '',
              validTo: '',
              daysRemaining: 0,
              grade: 'F',
            });
          }
        }
      );

      socket.on('error', () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve({
            isValid: false,
            issuer: 'SSL Handshake Failed',
            subject: domain,
            validFrom: '',
            validTo: '',
            daysRemaining: 0,
            grade: 'F',
          });
        }
      });
    } catch {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({
          isValid: false,
          issuer: 'Socket error',
          subject: domain,
          validFrom: '',
          validTo: '',
          daysRemaining: 0,
          grade: 'F',
        });
      }
    }
  });
}

export async function inspectHttp(
  targetUrl: string
): Promise<{
  httpStatus: number | null;
  statusText?: string;
  finalUrl: string;
  hasRedirect: boolean;
  redirectCount: number;
  responseTimeMs: number;
  headers: SecurityHeadersReport;
}> {
  const startTime = Date.now();
  let httpStatus: number | null = null;
  let statusText = '';
  let finalUrl = targetUrl;
  let hasRedirect = false;
  let redirectCount = 0;

  let headersMap: Record<string, string> = {};

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SafeWebBot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    httpStatus = response.status;
    statusText = response.statusText;
    finalUrl = response.url;
    if (finalUrl !== targetUrl) {
      hasRedirect = true;
      redirectCount = 1;
    }

    response.headers.forEach((val, key) => {
      headersMap[key.toLowerCase()] = val;
    });
  } catch (err: any) {
    statusText = err?.name === 'AbortError' ? 'Connection timeout' : 'Unreachable or blocked';
  }

  const responseTimeMs = Date.now() - startTime;

  // Grade security headers
  const hstsVal = headersMap['strict-transport-security'];
  const cspVal = headersMap['content-security-policy'];
  const xfoVal = headersMap['x-frame-options'];
  const xctoVal = headersMap['x-content-type-options'];
  const refVal = headersMap['referrer-policy'];
  const permVal = headersMap['permissions-policy'] || headersMap['feature-policy'];

  const hsts = { present: Boolean(hstsVal), value: hstsVal, score: hstsVal ? 25 : 0 };
  const csp = { present: Boolean(cspVal), value: cspVal ? (cspVal.length > 80 ? cspVal.slice(0, 80) + '...' : cspVal) : undefined, score: cspVal ? 25 : 0 };
  const xfo = { present: Boolean(xfoVal), value: xfoVal, score: xfoVal ? 15 : 0 };
  const xcto = { present: Boolean(xctoVal), value: xctoVal, score: xctoVal ? 15 : 0 };
  const referrerPolicy = { present: Boolean(refVal), value: refVal, score: refVal ? 10 : 0 };
  const permissionsPolicy = { present: Boolean(permVal), value: permVal ? (permVal.length > 60 ? permVal.slice(0, 60) + '...' : permVal) : undefined, score: permVal ? 10 : 0 };

  const totalScore = hsts.score + csp.score + xfo.score + xcto.score + referrerPolicy.score + permissionsPolicy.score;

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (totalScore >= 90) grade = 'A+';
  else if (totalScore >= 75) grade = 'A';
  else if (totalScore >= 55) grade = 'B';
  else if (totalScore >= 35) grade = 'C';
  else if (totalScore >= 15) grade = 'D';

  const headersReport: SecurityHeadersReport = {
    hsts,
    csp,
    xFrameOptions: xfo,
    xContentTypeOptions: xcto,
    referrerPolicy,
    permissionsPolicy,
    totalScore,
    grade,
  };

  return {
    httpStatus,
    statusText,
    finalUrl,
    hasRedirect,
    redirectCount,
    responseTimeMs,
    headers: headersReport,
  };
}

export function inspectHeuristics(domain: string): HeuristicFlags {
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain) || domain.includes(':');
  const isPunycode = domain.startsWith('xn--') || /[^\u0000-\u007F]/.test(domain);

  const highRiskTlds = [
    'xyz', 'top', 'work', 'buzz', 'cfd', 'sbs', 'gq', 'ml', 'ga', 'tk',
    'icu', 'fit', 'quest', 'click', 'link', 'country', 'stream', 'download',
    'bid', 'loan', 'racing', 'date', 'faith', 'review'
  ];
  const tld = domain.split('.').pop() || '';
  const highRiskTld = highRiskTlds.includes(tld);

  const parts = domain.split('.');
  const excessiveSubdomains = parts.length > 4;

  const suspiciousTargetKeywords = [
    'paypal', 'wellsfargo', 'chase', 'bank', 'bankofamerica', 'apple', 'google',
    'microsoft', 'netflix', 'amazon', 'crypto', 'binance', 'coinbase', 'metamask',
    'login', 'signin', 'verify', 'update-account', 'security-alert', 'wallet-connect'
  ];

  const detectedKeywords: string[] = [];
  const domainWithoutTld = parts.slice(0, -1).join('.');
  
  for (const kw of suspiciousTargetKeywords) {
    if (domainWithoutTld.includes(kw)) {
      // Check if it is the official legitimate domain or a clone
      const officialDomains: Record<string, string[]> = {
        paypal: ['paypal.com'],
        wellsfargo: ['wellsfargo.com'],
        chase: ['chase.com'],
        apple: ['apple.com', 'icloud.com'],
        google: ['google.com', 'google.co', 'google.org'],
        microsoft: ['microsoft.com', 'live.com', 'office.com', 'azure.com'],
        netflix: ['netflix.com'],
        amazon: ['amazon.com', 'amazon.co.uk', 'amazon.de', 'aws.amazon.com'],
        binance: ['binance.com'],
        coinbase: ['coinbase.com'],
        metamask: ['metamask.io'],
      };

      const isOfficial = officialDomains[kw]?.some((official) => domain.endsWith(official));
      if (!isOfficial) {
        detectedKeywords.push(kw);
      }
    }
  }

  let riskCount = 0;
  if (isIpAddress) riskCount += 2;
  if (isPunycode) riskCount += 2;
  if (highRiskTld) riskCount += 1;
  if (excessiveSubdomains) riskCount += 1;
  if (detectedKeywords.length > 0) riskCount += 3;

  return {
    isIpAddress,
    isPunycode,
    highRiskTld,
    excessiveSubdomains,
    suspiciousKeywords: detectedKeywords.length > 0,
    detectedKeywords,
    riskCount,
  };
}

// Fallback deterministic assessment if Gemini is unavailable
function fallbackAnalysis(
  domain: string,
  ssl: SslInspection,
  headers: SecurityHeadersReport,
  dnsInfo: DnsRecordsReport,
  heuristics: HeuristicFlags
): {
  overallSafetyScore: number;
  threatLevel: ThreatLevel;
  verdictTitle: string;
  verdictSummary: string;
  category: string;
  scores: { ssl: number; headers: number; domainTrust: number; aiReputation: number };
  identifiedRisks: ThreatItem[];
  safetyPositives: string[];
  recommendations: string[];
  brandImpersonation: { detected: boolean; brandName?: string; details?: string };
} {
  let sslScore = ssl.isValid ? (ssl.grade === 'A+' ? 25 : ssl.grade === 'A' ? 22 : 18) : 0;
  let headersScore = Math.round((headers.totalScore / 100) * 25);
  let domainTrustScore = 25 - Math.min(25, heuristics.riskCount * 6);
  if (!dnsInfo.hasA && !dnsInfo.hasAaaa) domainTrustScore = 5;
  if (dnsInfo.hasSpfOrDmarc) domainTrustScore = Math.min(25, domainTrustScore + 3);

  let aiReputationScore = 22;
  if (heuristics.suspiciousKeywords) aiReputationScore = 5;
  else if (heuristics.highRiskTld) aiReputationScore = 12;

  const totalScore = Math.min(100, Math.max(5, sslScore + headersScore + domainTrustScore + aiReputationScore));

  let threatLevel: ThreatLevel = 'safe';
  let verdictTitle = 'Site Appears Safe & Legitimate';
  let verdictSummary = `Domain ${domain} has valid security infrastructure, active DNS, and passed core safety heuristics.`;

  if (heuristics.suspiciousKeywords || totalScore < 40) {
    threatLevel = 'malicious';
    verdictTitle = 'High Risk Phishing or Malicious Pattern Detected';
    verdictSummary = `Domain ${domain} exhibits critical brand-spoofing keywords and anomalous indicators. Do not enter passwords or sensitive personal info.`;
  } else if (totalScore < 60 || heuristics.highRiskTld || !ssl.isValid) {
    threatLevel = 'suspicious';
    verdictTitle = 'Suspicious or Inadequately Secured Website';
    verdictSummary = `Domain ${domain} lacks key security headers, has SSL anomalies, or uses a high-risk TLD. Exercise extreme caution.`;
  } else if (totalScore < 80) {
    threatLevel = 'caution';
    verdictTitle = 'Moderate Security Hardening Recommended';
    verdictSummary = `Domain ${domain} is reachable with valid TLS, but could benefit from stronger security policies (HSTS, CSP, DMARC).`;
  }

  const identifiedRisks: ThreatItem[] = [];
  const safetyPositives: string[] = [];
  const recommendations: string[] = [];

  if (!ssl.isValid) {
    identifiedRisks.push({
      category: 'Encryption / SSL',
      severity: 'critical',
      description: 'SSL/TLS certificate is invalid, self-signed, or expired. Data transmitted can be intercepted.',
    });
    recommendations.push('Do not submit personal data or payment info on non-HTTPS or invalid SSL sites.');
  } else {
    safetyPositives.push(`Valid SSL/TLS certificate issued by ${ssl.issuer} (expires in ${ssl.daysRemaining} days).`);
  }

  if (heuristics.suspiciousKeywords) {
    identifiedRisks.push({
      category: 'Brand Spoofing',
      severity: 'critical',
      description: `Domain contains trademarked name(s) [${heuristics.detectedKeywords.join(', ')}] but does not belong to the verified brand.`,
    });
    recommendations.push('Verify the exact URL in your browser bar. Never navigate to banking/payment portals from unverified links.');
  }

  if (heuristics.highRiskTld) {
    identifiedRisks.push({
      category: 'Domain Reputation',
      severity: 'medium',
      description: 'The Top-Level Domain (TLD) has a high statistical correlation with spam or disposable domains.',
    });
  }

  if (!headers.hsts.present) {
    identifiedRisks.push({
      category: 'Protocol Downgrade',
      severity: 'low',
      description: 'HTTP Strict Transport Security (HSTS) header is missing, allowing potential downgrade attacks.',
    });
  } else {
    safetyPositives.push('HSTS enabled to strictly enforce HTTPS connections.');
  }

  if (headers.csp.present) {
    safetyPositives.push('Content Security Policy (CSP) actively configured against Cross-Site Scripting (XSS).');
  } else {
    recommendations.push('Site administrators should implement a Content Security Policy (CSP) to prevent script injection.');
  }

  if (dnsInfo.hasSpfOrDmarc) {
    safetyPositives.push('Domain publishes email authentication records (SPF/DMARC), preventing email spoofing.');
  }

  return {
    overallSafetyScore: totalScore,
    threatLevel,
    verdictTitle,
    verdictSummary,
    category: heuristics.suspiciousKeywords ? 'Impersonation / Fake Portal' : 'General Web Service',
    scores: {
      ssl: sslScore,
      headers: headersScore,
      domainTrust: domainTrustScore,
      aiReputation: aiReputationScore,
    },
    identifiedRisks,
    safetyPositives,
    recommendations,
    brandImpersonation: {
      detected: heuristics.suspiciousKeywords,
      brandName: heuristics.detectedKeywords[0],
      details: heuristics.suspiciousKeywords
        ? `Keywords [${heuristics.detectedKeywords.join(', ')}] detected in domain name without verified brand association.`
        : undefined,
    },
  };
}

export async function analyzeWebsiteSafety(rawUrl: string): Promise<WebsiteSafetyReport> {
  const { url, domain, protocol } = parseAndNormalizeUrl(rawUrl);

  // Run technical checks in parallel
  const [dnsInfo, ssl, httpInfo] = await Promise.all([
    inspectDns(domain),
    inspectTls(domain),
    inspectHttp(url),
  ]);

  const heuristics = inspectHeuristics(domain);

  // Attempt AI synthesis using Gemini 3.8 Flash
  const genAI = getGenAI();
  let aiData: any = null;

  if (genAI) {
    try {
      const prompt = `You are an elite cyber threat intelligence analyst and web trust evaluation engine.
Analyze the following website security inspection data for the domain "${domain}" (full URL: ${url}):

TECHNICAL INSPECTION DATA:
- Domain: ${domain}
- Protocol: ${protocol}
- HTTP Status: ${httpInfo.httpStatus} (${httpInfo.statusText || 'OK'})
- Response Time: ${httpInfo.responseTimeMs}ms
- Redirects: ${httpInfo.hasRedirect ? `Yes (Final: ${httpInfo.finalUrl})` : 'No'}
- SSL Valid: ${ssl.isValid}
- SSL Issuer: ${ssl.issuer}
- SSL Days Remaining: ${ssl.daysRemaining}
- SSL Protocol: ${ssl.protocol || 'Unknown'}
- SSL Grade: ${ssl.grade}
- Security Headers Grade: ${httpInfo.headers.grade} (Score: ${httpInfo.headers.totalScore}/100)
- HSTS: ${httpInfo.headers.hsts.present}
- CSP: ${httpInfo.headers.csp.present}
- X-Frame-Options: ${httpInfo.headers.xFrameOptions.present}
- DNS A Records: ${dnsInfo.aRecords.length > 0 ? dnsInfo.aRecords.join(', ') : 'None'}
- DNS MX Records: ${dnsInfo.mxRecords.length > 0 ? 'Present' : 'None'}
- DNS SPF/DMARC: ${dnsInfo.hasSpfOrDmarc ? 'Yes' : 'No'}
- Heuristic Flags:
  * IP Address as Host: ${heuristics.isIpAddress}
  * Punycode / Homograph: ${heuristics.isPunycode}
  * High-risk TLD: ${heuristics.highRiskTld}
  * Excessive Subdomains: ${heuristics.excessiveSubdomains}
  * Suspicious Brand Keywords: ${heuristics.suspiciousKeywords ? heuristics.detectedKeywords.join(', ') : 'None'}

TASK:
Provide a rigorous, balanced security evaluation.
1. Determine overallSafetyScore from 0 (extremely dangerous/confirmed scam) to 100 (top-tier enterprise verified security like Google, Wikipedia, GitHub).
2. Determine threatLevel: 'safe' (80-100), 'caution' (55-79), 'suspicious' (35-54), or 'malicious' (0-34).
3. If domain mimics a famous brand (e.g. chase, paypal, steam, google, apple, metamask, banks) without being their actual official domain, flag brandImpersonationDetected as true and assign low safety score.
4. Provide structured risks, positives, and actionable recommendations.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallSafetyScore: { type: Type.INTEGER, description: 'Composite safety score from 0 to 100' },
              threatLevel: {
                type: Type.STRING,
                description: 'One of: safe, caution, suspicious, malicious',
              },
              verdictTitle: { type: Type.STRING, description: 'Short concise headline verdict (e.g. Verified Safe Platform, Suspicious Clone)' },
              verdictSummary: { type: Type.STRING, description: '2-3 sentences explaining the assessment and safety status' },
              category: { type: Type.STRING, description: 'Classification of the site (e.g., E-Commerce, Financial Services, Tech, Phishing Clone)' },
              scores: {
                type: Type.OBJECT,
                properties: {
                  ssl: { type: Type.INTEGER, description: 'SSL subscore 0-25' },
                  headers: { type: Type.INTEGER, description: 'Headers subscore 0-25' },
                  domainTrust: { type: Type.INTEGER, description: 'Domain trust subscore 0-25' },
                  aiReputation: { type: Type.INTEGER, description: 'Reputation subscore 0-25' },
                },
                required: ['ssl', 'headers', 'domainTrust', 'aiReputation'],
              },
              identifiedRisks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    severity: { type: Type.STRING, description: 'low, medium, high, or critical' },
                    description: { type: Type.STRING },
                  },
                  required: ['category', 'severity', 'description'],
                },
              },
              safetyPositives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              brandImpersonation: {
                type: Type.OBJECT,
                properties: {
                  detected: { type: Type.BOOLEAN },
                  brandName: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ['detected'],
              },
            },
            required: [
              'overallSafetyScore',
              'threatLevel',
              'verdictTitle',
              'verdictSummary',
              'category',
              'scores',
              'identifiedRisks',
              'safetyPositives',
              'recommendations',
              'brandImpersonation',
            ],
          },
        },
      });

      if (response.text) {
        aiData = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.warn('Gemini safety analysis failed, using rule-based engine:', err);
    }
  }

  // If Gemini succeeded, merge; otherwise use reliable fallback
  const baseResult = aiData || fallbackAnalysis(domain, ssl, httpInfo.headers, dnsInfo, heuristics);

  return {
    url,
    domain,
    protocol,
    httpStatus: httpInfo.httpStatus,
    statusText: httpInfo.statusText,
    finalUrl: httpInfo.finalUrl,
    hasRedirect: httpInfo.hasRedirect,
    redirectCount: httpInfo.redirectCount,
    responseTimeMs: httpInfo.responseTimeMs,
    analyzedAt: new Date().toISOString(),

    overallSafetyScore: baseResult.overallSafetyScore,
    threatLevel: (baseResult.threatLevel as ThreatLevel) || 'caution',
    verdictTitle: baseResult.verdictTitle,
    verdictSummary: baseResult.verdictSummary,
    scores: baseResult.scores,
    category: baseResult.category || 'Website',

    ssl,
    headers: httpInfo.headers,
    dns: dnsInfo,
    heuristics,

    identifiedRisks: baseResult.identifiedRisks || [],
    safetyPositives: baseResult.safetyPositives || [],
    recommendations: baseResult.recommendations || [],
    brandImpersonation: baseResult.brandImpersonation || { detected: false },
  };
}

export async function compareWebsitesSafety(
  rawUrl1: string,
  rawUrl2: string
): Promise<SiteComparisonResult> {
  const [site1, site2] = await Promise.all([
    analyzeWebsiteSafety(rawUrl1),
    analyzeWebsiteSafety(rawUrl2),
  ]);

  let comparisonVerdict = {
    saferSite: (site1.overallSafetyScore > site2.overallSafetyScore
      ? 'site1'
      : site2.overallSafetyScore > site1.overallSafetyScore
      ? 'site2'
      : 'equal') as 'site1' | 'site2' | 'both_safe' | 'both_unsafe' | 'equal',
    summary: '',
    keyDifferences: [] as string[],
    advice: '',
    winnerHeadline: '',
  };

  const genAI = getGenAI();
  if (genAI) {
    try {
      const prompt = `You are a cybersecurity expert comparing two websites for user safety:
Website 1:
- Domain: ${site1.domain} (Score: ${site1.overallSafetyScore}/100, Threat: ${site1.threatLevel})
- SSL: Valid: ${site1.ssl.isValid}, Issuer: ${site1.ssl.issuer}, Grade: ${site1.ssl.grade}
- Headers Grade: ${site1.headers.grade}
- Impersonation detected: ${site1.brandImpersonation.detected}

Website 2:
- Domain: ${site2.domain} (Score: ${site2.overallSafetyScore}/100, Threat: ${site2.threatLevel})
- SSL: Valid: ${site2.ssl.isValid}, Issuer: ${site2.ssl.issuer}, Grade: ${site2.ssl.grade}
- Headers Grade: ${site2.headers.grade}
- Impersonation detected: ${site2.brandImpersonation.detected}

Provide a direct head-to-head comparison verdict:
1. Which site is safer: 'site1', 'site2', 'both_safe', 'both_unsafe', or 'equal'?
2. winnerHeadline: concise title (e.g. "${site1.domain} is significantly safer than ${site2.domain}")
3. summary: 2-3 sentences explaining why one is safer or comparing their risk profiles.
4. keyDifferences: 3-5 specific bullet points contrasting their SSL, headers, infrastructure, or threat markers.
5. advice: direct recommendation on which one the user should interact with and what precautions to take.`;

      const compResponse = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              saferSite: { type: Type.STRING, description: 'site1, site2, both_safe, both_unsafe, or equal' },
              winnerHeadline: { type: Type.STRING },
              summary: { type: Type.STRING },
              keyDifferences: { type: Type.ARRAY, items: { type: Type.STRING } },
              advice: { type: Type.STRING },
            },
            required: ['saferSite', 'winnerHeadline', 'summary', 'keyDifferences', 'advice'],
          },
        },
      });

      if (compResponse.text) {
        const parsed = JSON.parse(compResponse.text.trim());
        comparisonVerdict = {
          saferSite: parsed.saferSite,
          winnerHeadline: parsed.winnerHeadline,
          summary: parsed.summary,
          keyDifferences: parsed.keyDifferences,
          advice: parsed.advice,
        };
      }
    } catch (err) {
      console.warn('Gemini comparison failed, using rule-based comparison:', err);
    }
  }

  // Fallback if AI was unavailable
  if (!comparisonVerdict.summary) {
    const diff = site1.overallSafetyScore - site2.overallSafetyScore;
    if (site1.overallSafetyScore >= 80 && site2.overallSafetyScore >= 80) {
      comparisonVerdict.saferSite = 'both_safe';
      comparisonVerdict.winnerHeadline = 'Both websites demonstrate high security standards';
      comparisonVerdict.summary = `Both ${site1.domain} (${site1.overallSafetyScore}/100) and ${site2.domain} (${site2.overallSafetyScore}/100) have verified SSL certificates and solid infrastructure.`;
      comparisonVerdict.advice = 'Both domains appear reputable. Maintain standard browsing hygiene.';
    } else if (site1.overallSafetyScore < 45 && site2.overallSafetyScore < 45) {
      comparisonVerdict.saferSite = 'both_unsafe';
      comparisonVerdict.winnerHeadline = 'Both websites present substantial security risks';
      comparisonVerdict.summary = `Neither ${site1.domain} nor ${site2.domain} meets safe browsing thresholds. High risk of phishing, missing encryption, or unverified identity.`;
      comparisonVerdict.advice = 'Avoid submitting credentials or financial details on either of these websites.';
    } else if (diff > 10) {
      comparisonVerdict.saferSite = 'site1';
      comparisonVerdict.winnerHeadline = `${site1.domain} is safer than ${site2.domain}`;
      comparisonVerdict.summary = `${site1.domain} scored ${site1.overallSafetyScore}/100 vs ${site2.domain} (${site2.overallSafetyScore}/100), exhibiting superior certificate health and security headers.`;
      comparisonVerdict.advice = `Prefer ${site1.domain}. Exercise caution with ${site2.domain}.`;
    } else if (diff < -10) {
      comparisonVerdict.saferSite = 'site2';
      comparisonVerdict.winnerHeadline = `${site2.domain} is safer than ${site1.domain}`;
      comparisonVerdict.summary = `${site2.domain} scored ${site2.overallSafetyScore}/100 vs ${site1.domain} (${site1.overallSafetyScore}/100), showing stronger hardening and reputation.`;
      comparisonVerdict.advice = `Prefer ${site2.domain}. Exercise caution with ${site1.domain}.`;
    } else {
      comparisonVerdict.saferSite = 'equal';
      comparisonVerdict.winnerHeadline = 'Both websites have similar safety ratings';
      comparisonVerdict.summary = `${site1.domain} and ${site2.domain} have comparable security scores (${site1.overallSafetyScore} vs ${site2.overallSafetyScore}).`;
      comparisonVerdict.advice = 'Review the detailed header and SSL parameters below for specific differences.';
    }

    comparisonVerdict.keyDifferences = [
      `Overall Safety: ${site1.domain} (${site1.overallSafetyScore}/100) vs ${site2.domain} (${site2.overallSafetyScore}/100)`,
      `SSL Status: ${site1.domain} (${site1.ssl.grade}, ${site1.ssl.issuer}) vs ${site2.domain} (${site2.ssl.grade}, ${site2.ssl.issuer})`,
      `Security Headers: ${site1.domain} (${site1.headers.grade}) vs ${site2.domain} (${site2.headers.grade})`,
      `Impersonation Flags: ${site1.brandImpersonation.detected ? 'FLAGGED' : 'Clean'} vs ${site2.brandImpersonation.detected ? 'FLAGGED' : 'Clean'}`,
    ];
  }

  return {
    site1,
    site2,
    comparisonVerdict,
  };
}
