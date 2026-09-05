export type ThreatLevel = 'safe' | 'caution' | 'suspicious' | 'malicious';

export interface SslInspection {
  isValid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol?: string;
  cipher?: string;
  sans?: string[];
  isSelfSigned?: boolean;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface SecurityHeadersReport {
  hsts: { present: boolean; value?: string; score: number };
  csp: { present: boolean; value?: string; score: number };
  xFrameOptions: { present: boolean; value?: string; score: number };
  xContentTypeOptions: { present: boolean; value?: string; score: number };
  referrerPolicy: { present: boolean; value?: string; score: number };
  permissionsPolicy: { present: boolean; value?: string; score: number };
  totalScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface DnsRecordsReport {
  hasA: boolean;
  aRecords: string[];
  hasAaaa: boolean;
  aaaaRecords: string[];
  hasMx: boolean;
  mxRecords: string[];
  hasTxt: boolean;
  txtRecords: string[];
  hasNs: boolean;
  nsRecords: string[];
  hasSpfOrDmarc: boolean;
}

export interface HeuristicFlags {
  isIpAddress: boolean;
  isPunycode: boolean;
  highRiskTld: boolean;
  excessiveSubdomains: boolean;
  suspiciousKeywords: boolean;
  detectedKeywords: string[];
  riskCount: number;
}

export interface ThreatItem {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface WebsiteSafetyReport {
  url: string;
  domain: string;
  protocol: string;
  httpStatus: number | null;
  statusText?: string;
  finalUrl?: string;
  hasRedirect: boolean;
  redirectCount: number;
  responseTimeMs: number;
  analyzedAt: string;
  
  // Composite score 0 - 100
  overallSafetyScore: number;
  threatLevel: ThreatLevel;
  verdictTitle: string;
  verdictSummary: string;
  
  // Sub-scores
  scores: {
    ssl: number;          // 0-25
    headers: number;      // 0-25
    domainTrust: number;  // 0-25
    aiReputation: number; // 0-25
  };
  
  category: string;
  ssl: SslInspection;
  headers: SecurityHeadersReport;
  dns: DnsRecordsReport;
  heuristics: HeuristicFlags;
  
  identifiedRisks: ThreatItem[];
  safetyPositives: string[];
  recommendations: string[];
  brandImpersonation: {
    detected: boolean;
    brandName?: string;
    details?: string;
  };
}

export interface SiteComparisonResult {
  site1: WebsiteSafetyReport;
  site2: WebsiteSafetyReport;
  comparisonVerdict: {
    saferSite: 'site1' | 'site2' | 'both_safe' | 'both_unsafe' | 'equal';
    summary: string;
    keyDifferences: string[];
    advice: string;
    winnerHeadline: string;
  };
}

export interface RecentScanItem {
  id: string;
  url: string;
  domain: string;
  score: number;
  threatLevel: ThreatLevel;
  timestamp: number;
}
