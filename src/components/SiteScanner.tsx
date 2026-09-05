import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowLeftRight,
  ShieldAlert,
  HelpCircle,
  Check,
  AlertOctagon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { WebsiteSafetyReport } from '../types.js';
import { ScoreGauge } from './ScoreGauge.js';
import { TechnicalDetails } from './TechnicalDetails.js';

interface SiteScannerProps {
  onScanUrl: (url: string) => Promise<WebsiteSafetyReport | null>;
  currentReport: WebsiteSafetyReport | null;
  loading: boolean;
  onCompareWith: (url: string) => void;
}

export const SiteScanner: React.FC<SiteScannerProps> = ({
  onScanUrl,
  currentReport,
  loading,
  onCompareWith,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [scanStep, setScanStep] = useState(0);

  const quickSamples = [
    { name: 'Wikipedia', url: 'https://en.wikipedia.org', tag: 'Safe Enterprise' },
    { name: 'GitHub', url: 'https://github.com', tag: 'Hardened Tech' },
    { name: 'PayPal Official', url: 'https://www.paypal.com', tag: 'Banking/Fintech' },
    { name: 'Phishing Sim Clone', url: 'https://paypal-security-update-verify.top', tag: 'Phishing Simulation' },
    { name: 'Legacy HTTP', url: 'http://neverssl.com', tag: 'Unencrypted' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || loading) return;

    // Simulate multi-step telemetry progress
    setScanStep(1);
    const t1 = setTimeout(() => setScanStep(2), 600);
    const t2 = setTimeout(() => setScanStep(3), 1400);
    const t3 = setTimeout(() => setScanStep(4), 2200);

    try {
      await onScanUrl(inputUrl);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setScanStep(0);
    }
  };

  const handleSampleClick = (url: string) => {
    setInputUrl(url);
    onScanUrl(url);
  };

  const getThreatBadge = (threat: 'safe' | 'caution' | 'suspicious' | 'malicious') => {
    switch (threat) {
      case 'safe':
        return {
          label: 'VERIFIED SAFE',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        };
      case 'caution':
        return {
          label: 'MODERATE CAUTION',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'suspicious':
        return {
          label: 'SUSPICIOUS SITE',
          icon: <AlertOctagon className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
          bg: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        };
      case 'malicious':
        return {
          label: 'HIGH RISK / DANGEROUS',
          icon: <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
          bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time TLS, DNS, Headers & Gemini Threat Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify Website Safety & Detect Scams
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Check any website before you click, log in, or enter payment details. We inspect live certificates, HTTP headers, DNS infrastructure, and brand imitation risks.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-lg shadow-emerald-500/5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-colors p-1.5">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="input-url-check"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL or domain (e.g., paypal.com, suspicious-site.top)..."
              disabled={loading}
              className="w-full py-2.5 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {inputUrl && !loading && (
              <button
                type="button"
                onClick={() => setInputUrl('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2 text-xs"
              >
                ✕
              </button>
            )}
            <button
              id="btn-scan-submit"
              type="submit"
              disabled={loading || !inputUrl.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Inspecting...</span>
                </>
              ) : (
                <>
                  <span>Scan Safety</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Telemetry Steps */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto mt-5 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2"
            >
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {scanStep === 1 && 'Querying DNS records (A, AAAA, MX, TXT)...'}
                  {scanStep === 2 && 'Connecting via TLS & verifying SSL certificate chain...'}
                  {scanStep === 3 && 'Probing HTTP response & testing security headers (HSTS, CSP)...'}
                  {scanStep >= 4 && 'Gemini AI synthesizing reputation & threat models...'}
                  {scanStep === 0 && 'Connecting to server scanner engine...'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  animate={{
                    width: scanStep === 1 ? '25%' : scanStep === 2 ? '50%' : scanStep === 3 ? '75%' : '95%',
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Sample Presets */}
        <div className="max-w-3xl mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-1">Quick Test Samples:</span>
          {quickSamples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.url)}
              disabled={loading}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>{sample.name}</span>
              <span className="text-[10px] text-slate-400">({sample.tag})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Section */}
      {currentReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Brand Impersonation Alert Banner if detected */}
          {currentReport.brandImpersonation.detected && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-300 dark:border-rose-900 flex items-start gap-4 text-rose-900 dark:text-rose-200 shadow-md">
              <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-rose-700 dark:text-rose-300">
                  Critical Brand Impersonation Warning: Phishing Suspected
                </h3>
                <p className="text-sm leading-relaxed">
                  This domain appears to be imitating{' '}
                  <strong className="underline">
                    {currentReport.brandImpersonation.brandName || 'a recognized trademark'}
                  </strong>
                  . It is NOT hosted by the authentic company. Never enter your credentials, passwords, or payment cards on this URL.
                </p>
              </div>
            </div>
          )}

          {/* Main Hero Overview Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
              {/* Left: Score Gauge */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 w-full sm:w-auto">
                <ScoreGauge
                  score={currentReport.overallSafetyScore}
                  threatLevel={currentReport.threatLevel}
                  size="lg"
                />
                <div className="mt-3">
                  {(() => {
                    const badge = getThreatBadge(currentReport.threatLevel);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bg}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Center: Verdict and Target Metadata */}
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {currentReport.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {currentReport.responseTimeMs}ms response
                    </span>
                    {currentReport.httpStatus && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                        HTTP {currentReport.httpStatus}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white break-all">
                    {currentReport.domain}
                  </h2>
                  <a
                    href={currentReport.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 break-all"
                  >
                    <span>{currentReport.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {currentReport.verdictTitle}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentReport.verdictSummary}
                  </p>
                </div>

                {/* Compare CTA */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    id="btn-compare-from-scan"
                    onClick={() => onCompareWith(currentReport.domain)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Compare {currentReport.domain} with another site</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Pillars Sub-Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  SSL / TLS Grade
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {currentReport.ssl.grade}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentReport.scores.ssl}/25 pts
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block truncate">
                  {currentReport.ssl.issuer || 'No valid certificate'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Security Headers
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {currentReport.headers.grade}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentReport.scores.headers}/25 pts
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {currentReport.headers.hsts.present ? 'HSTS Active' : 'HSTS Missing'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Domain Trust
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {currentReport.scores.domainTrust >= 20 ? 'High' : currentReport.scores.domainTrust >= 12 ? 'Moderate' : 'Low'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentReport.scores.domainTrust}/25 pts
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {currentReport.heuristics.riskCount === 0 ? 'Zero flags' : `${currentReport.heuristics.riskCount} risk indicators`}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Threat Rating
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {currentReport.threatLevel.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentReport.scores.aiReputation}/25 pts
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Gemini Cyber Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Positives, Risks & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Safety Positives */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base">Security Strengths & Positives</h3>
              </div>
              {currentReport.safetyPositives.length > 0 ? (
                <ul className="space-y-2.5">
                  {currentReport.safetyPositives.map((pos, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No significant security strengths verified.</p>
              )}
            </div>

            {/* Identified Risks */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base">Identified Risks & Vulnerabilities</h3>
              </div>
              {currentReport.identifiedRisks.length > 0 ? (
                <ul className="space-y-2.5">
                  {currentReport.identifiedRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span
                        className={`px-1.5 py-0.5 text-[10px] uppercase font-bold rounded flex-shrink-0 mt-0.5 ${
                          risk.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : risk.severity === 'high'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {risk.severity}
                      </span>
                      <div>
                        <strong className="font-semibold text-slate-900 dark:text-white">
                          {risk.category}:
                        </strong>{' '}
                        <span>{risk.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  No high or critical risks identified during technical inspection.
                </p>
              )}
            </div>
          </div>

          {/* Actionable Recommendations */}
          {currentReport.recommendations.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3.5">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                  User Safety Guidelines & Next Steps:
                </h4>
                <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                  {currentReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Deep Technical Inspection Tabs */}
          <div className="pt-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Deep Technical Diagnostics
            </h3>
            <TechnicalDetails report={currentReport} />
          </div>
        </motion.div>
      )}
    </div>
  );
};
