import React, { useState } from 'react';
import {
  Lock,
  FileCode,
  Network,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import type { WebsiteSafetyReport } from '../types.js';

interface TechnicalDetailsProps {
  report: WebsiteSafetyReport;
}

export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'ssl' | 'headers' | 'dns' | 'heuristics'>('ssl');
  const [showAllSans, setShowAllSans] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
        <button
          id="tab-tech-ssl"
          onClick={() => setActiveTab('ssl')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ssl'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>SSL/TLS Certificate</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              report.ssl.isValid
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {report.ssl.grade}
          </span>
        </button>

        <button
          id="tab-tech-headers"
          onClick={() => setActiveTab('headers')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'headers'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Security Headers</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              report.headers.totalScore >= 70
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : report.headers.totalScore >= 40
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {report.headers.grade} ({report.headers.totalScore}/100)
          </span>
        </button>

        <button
          id="tab-tech-dns"
          onClick={() => setActiveTab('dns')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'dns'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>DNS Infrastructure</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
            {report.dns.aRecords.length} IPs
          </span>
        </button>

        <button
          id="tab-tech-heuristics"
          onClick={() => setActiveTab('heuristics')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'heuristics'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Threat Markers</span>
          {report.heuristics.riskCount > 0 ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
              {report.heuristics.riskCount} flags
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              Clean
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* SSL/TLS TAB */}
        {activeTab === 'ssl' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {report.ssl.isValid ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {report.ssl.isValid ? 'Valid Trusted Certificate' : 'SSL Validation Failure'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {report.ssl.isValid
                      ? 'Secure encrypted tunnel actively protecting traffic.'
                      : 'Unencrypted or invalid identity certificate.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    report.ssl.isValid
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  Grade {report.ssl.grade}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Certificate Issuer
                </span>
                <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                  {report.ssl.issuer || 'N/A'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Common Name / Subject
                </span>
                <p className="font-medium text-slate-800 dark:text-slate-200 text-sm break-all">
                  {report.ssl.subject || report.domain}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Validity Window
                </span>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p>
                    <span className="text-slate-400">Expires in:</span>{' '}
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {report.ssl.daysRemaining} days
                    </strong>
                  </p>
                  {report.ssl.validTo && (
                    <p className="text-slate-500">
                      Until: {new Date(report.ssl.validTo).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Negotiated Protocol & Cipher
                </span>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p>
                    <span className="text-slate-400">Protocol:</span>{' '}
                    <span className="font-mono font-semibold">{report.ssl.protocol || 'TLS'}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Cipher:</span>{' '}
                    <span className="font-mono text-[11px] break-all">{report.ssl.cipher || 'Standard'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* SANs list */}
            {report.ssl.sans && report.ssl.sans.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    Subject Alternative Names (SANs) ({report.ssl.sans.length})
                  </span>
                  {report.ssl.sans.length > 4 && (
                    <button
                      onClick={() => setShowAllSans(!showAllSans)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {showAllSans ? 'Show less' : 'View all'}
                      {showAllSans ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(showAllSans ? report.ssl.sans : report.ssl.sans.slice(0, 4)).map((san, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono"
                    >
                      {san}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECURITY HEADERS TAB */}
        {activeTab === 'headers' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  HTTP Security Headers Evaluation
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Headers tell browsers how to prevent clickjacking, MIME sniffing, and script injection attacks.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {report.headers.totalScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {/* HSTS */}
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {report.headers.hsts.present ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      Strict-Transport-Security (HSTS)
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      (+25 pts)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enforces HTTPS strictly and prevents SSL-stripping downgrade attacks.
                  </p>
                  {report.headers.hsts.value && (
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1 break-all">
                      {report.headers.hsts.value}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    report.headers.hsts.present
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {report.headers.hsts.present ? 'ACTIVE' : 'MISSING'}
                </span>
              </div>

              {/* CSP */}
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {report.headers.csp.present ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      Content-Security-Policy (CSP)
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      (+25 pts)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restricts script sources to stop Cross-Site Scripting (XSS) and data injection.
                  </p>
                  {report.headers.csp.value && (
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1 break-all">
                      {report.headers.csp.value}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    report.headers.csp.present
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {report.headers.csp.present ? 'ACTIVE' : 'MISSING'}
                </span>
              </div>

              {/* X-Frame-Options */}
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {report.headers.xFrameOptions.present ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      X-Frame-Options (Clickjacking Protection)
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      (+15 pts)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Prevents malicious sites from embedding this page in an invisible iframe to hijack clicks.
                  </p>
                  {report.headers.xFrameOptions.value && (
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1">
                      {report.headers.xFrameOptions.value}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    report.headers.xFrameOptions.present
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {report.headers.xFrameOptions.present ? 'ACTIVE' : 'MISSING'}
                </span>
              </div>

              {/* X-Content-Type-Options */}
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {report.headers.xContentTypeOptions.present ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      X-Content-Type-Options
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      (+15 pts)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Prevents browsers from MIME-sniffing a response away from declared content type.
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    report.headers.xContentTypeOptions.present
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {report.headers.xContentTypeOptions.present ? 'nosniff' : 'MISSING'}
                </span>
              </div>

              {/* Referrer-Policy */}
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {report.headers.referrerPolicy.present ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      Referrer-Policy
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      (+10 pts)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Controls how much referrer information is sent when users click links away.
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    report.headers.referrerPolicy.present
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {report.headers.referrerPolicy.present ? 'ACTIVE' : 'DEFAULT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DNS TAB */}
        {activeTab === 'dns' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* A Records */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  IPv4 Addresses (A Records)
                </span>
                {report.dns.aRecords.length > 0 ? (
                  <ul className="space-y-1">
                    {report.dns.aRecords.map((ip, idx) => (
                      <li key={idx} className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded">
                        {ip}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No A records resolved</p>
                )}
              </div>

              {/* AAAA Records */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  IPv6 Addresses (AAAA Records)
                </span>
                {report.dns.aaaaRecords.length > 0 ? (
                  <ul className="space-y-1">
                    {report.dns.aaaaRecords.map((ip, idx) => (
                      <li key={idx} className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded break-all">
                        {ip}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No IPv6 records configured</p>
                )}
              </div>

              {/* MX Records */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Mail Exchange Servers (MX)
                </span>
                {report.dns.mxRecords.length > 0 ? (
                  <ul className="space-y-1">
                    {report.dns.mxRecords.slice(0, 4).map((mx, idx) => (
                      <li key={idx} className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded">
                        {mx}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                    No mail servers found. Many fake/phishing sites omit MX records.
                  </p>
                )}
              </div>

              {/* Nameservers */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Authoritative Name Servers (NS)
                </span>
                {report.dns.nsRecords.length > 0 ? (
                  <ul className="space-y-1">
                    {report.dns.nsRecords.slice(0, 4).map((ns, idx) => (
                      <li key={idx} className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded">
                        {ns}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No NS records returned</p>
                )}
              </div>
            </div>

            {/* SPF / DMARC Verification */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Email Authentication Records (SPF / DMARC)
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    report.dns.hasSpfOrDmarc
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {report.dns.hasSpfOrDmarc ? 'CONFIGURED' : 'NONE DETECTED'}
                </span>
              </div>
              {report.dns.txtRecords.length > 0 ? (
                <div className="space-y-1 pt-1">
                  {report.dns.txtRecords.map((txt, idx) => (
                    <div
                      key={idx}
                      className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 break-all"
                    >
                      {txt}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No TXT verification records found.</p>
              )}
            </div>
          </div>
        )}

        {/* HEURISTICS TAB */}
        {activeTab === 'heuristics' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Heuristic & Phishing Indicators
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated tests checking domain anatomy, deceptive typo-squatting, and homograph patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Punycode / Homograph Attack
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uses lookalike non-Latin characters (e.g. Cyrillic 'а')
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    report.heuristics.isPunycode
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {report.heuristics.isPunycode ? 'DETECTED' : 'CLEAN'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    High-Risk Disposable TLD
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cheap/free domains correlated with mass phishing
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    report.heuristics.highRiskTld
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {report.heuristics.highRiskTld ? 'HIGH RISK TLD' : 'STANDARD TLD'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Raw IP Address Host
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct IP links without legitimate DNS hostname
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    report.heuristics.isIpAddress
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {report.heuristics.isIpAddress ? 'IP HOST DETECTED' : 'DOMAIN HOST'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Excessive Subdomains
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Obfuscated paths (e.g. login.secure.verify.fake.com)
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    report.heuristics.excessiveSubdomains
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {report.heuristics.excessiveSubdomains ? 'DEEP SUBDOMAINS' : 'NORMAL'}
                </span>
              </div>
            </div>

            {report.heuristics.suspiciousKeywords && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Suspicious Brand Keyword Triggers</span>
                </div>
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  The domain includes sensitive keywords [
                  <strong>{report.heuristics.detectedKeywords.join(', ')}</strong>] but is not an
                  official verified domain. Phishing sites frequently use these terms to trick victims.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
