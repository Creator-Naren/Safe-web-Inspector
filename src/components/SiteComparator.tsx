import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trophy,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Lock,
  FileCode,
  Network,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { SiteComparisonResult } from '../types.js';
import { ScoreGauge } from './ScoreGauge.js';

interface SiteComparatorProps {
  onCompare: (url1: string, url2: string) => Promise<SiteComparisonResult | null>;
  currentComparison: SiteComparisonResult | null;
  loading: boolean;
  prefillUrl1?: string;
}

export const SiteComparator: React.FC<SiteComparatorProps> = ({
  onCompare,
  currentComparison,
  loading,
  prefillUrl1 = '',
}) => {
  const [url1, setUrl1] = useState(prefillUrl1 || 'paypal.com');
  const [url2, setUrl2] = useState('paypal-security-update-verify.top');

  const presetComparisons = [
    {
      title: 'Bank vs. Phishing Clone',
      site1: 'chase.com',
      site2: 'chase-online-login-auth.xyz',
      desc: 'See how spoofed banking sites lack real enterprise TLS & headers',
    },
    {
      title: 'Payment Services',
      site1: 'paypal.com',
      site2: 'stripe.com',
      desc: 'Compare two top-tier international payment processors',
    },
    {
      title: 'Brand vs. Typosquatting',
      site1: 'google.com',
      site2: 'go0gle-login-verify.top',
      desc: 'Detect how zero-for-O and fake TLD tricks work',
    },
    {
      title: 'Encrypted vs. Plain HTTP',
      site1: 'wikipedia.org',
      site2: 'neverssl.com',
      desc: 'Clear contrast between modern TLS and legacy plain text',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1.trim() || !url2.trim() || loading) return;
    onCompare(url1, url2);
  };

  const loadPreset = (s1: string, s2: string) => {
    setUrl1(s1);
    setUrl2(s2);
    onCompare(s1, s2);
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Side-by-Side Website Safety Comparator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compare Two Websites Side-by-Side
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Not sure which link is legitimate? Compare two domains head-to-head to spot phishing replicas, evaluate security hardening, and find the safer choice.
          </p>
        </div>

        {/* Dual URL Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-3">
            {/* Site 1 Input */}
            <div className="relative flex items-center rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 p-1.5 transition-colors">
              <span className="px-3 text-xs font-bold text-slate-400 uppercase">Site 1</span>
              <input
                id="input-compare-site1"
                type="text"
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
                placeholder="e.g. paypal.com"
                disabled={loading}
                className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* VS Badge */}
            <div className="flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-900 font-extrabold text-xs flex items-center justify-center shadow-sm">
                VS
              </span>
            </div>

            {/* Site 2 Input */}
            <div className="relative flex items-center rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 p-1.5 transition-colors">
              <span className="px-3 text-xs font-bold text-slate-400 uppercase">Site 2</span>
              <input
                id="input-compare-site2"
                type="text"
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
                placeholder="e.g. paypal-verify-login.top"
                disabled={loading}
                className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              id="btn-compare-submit"
              type="submit"
              disabled={loading || !url1.trim() || !url2.trim()}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Inspecting Both Sites...</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Compare Websites</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Comparison Templates */}
        <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left">
            Popular Comparison Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {presetComparisons.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(preset.site1, preset.site2)}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                  <span>{preset.title}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">
                  {preset.site1} vs {preset.site2}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {currentComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Head-to-Head AI Verdict Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-slate-900">
                    VERDICT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {currentComparison.comparisonVerdict.winnerHeadline}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {currentComparison.comparisonVerdict.summary}
                </p>

                {/* Practical Advice */}
                {currentComparison.comparisonVerdict.advice && (
                  <div className="pt-2 flex items-start gap-2 text-xs sm:text-sm text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Recommendation:</strong> {currentComparison.comparisonVerdict.advice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Differences Bullet List */}
            {currentComparison.comparisonVerdict.keyDifferences?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentComparison.comparisonVerdict.keyDifferences.map((diff, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{diff}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side-by-Side Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site 1 Card */}
            <div
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 shadow-sm space-y-6 ${
                currentComparison.comparisonVerdict.saferSite === 'site1'
                  ? 'border-emerald-400 dark:border-emerald-600'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    SITE 1
                  </span>
                  {currentComparison.comparisonVerdict.saferSite === 'site1' && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      SAFER CHOICE
                    </span>
                  )}
                </div>
                <a
                  href={currentComparison.site1.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center gap-5">
                <ScoreGauge
                  score={currentComparison.site1.overallSafetyScore}
                  threatLevel={currentComparison.site1.threatLevel}
                  size="md"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white break-all">
                    {currentComparison.site1.domain}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">
                    {currentComparison.site1.category}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      currentComparison.site1.threatLevel === 'safe'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : currentComparison.site1.threatLevel === 'caution'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {currentComparison.site1.threatLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {currentComparison.site1.verdictSummary}
              </p>
            </div>

            {/* Site 2 Card */}
            <div
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 shadow-sm space-y-6 ${
                currentComparison.comparisonVerdict.saferSite === 'site2'
                  ? 'border-emerald-400 dark:border-emerald-600'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    SITE 2
                  </span>
                  {currentComparison.comparisonVerdict.saferSite === 'site2' && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      SAFER CHOICE
                    </span>
                  )}
                </div>
                <a
                  href={currentComparison.site2.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center gap-5">
                <ScoreGauge
                  score={currentComparison.site2.overallSafetyScore}
                  threatLevel={currentComparison.site2.threatLevel}
                  size="md"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white break-all">
                    {currentComparison.site2.domain}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">
                    {currentComparison.site2.category}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      currentComparison.site2.threatLevel === 'safe'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : currentComparison.site2.threatLevel === 'caution'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {currentComparison.site2.threatLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {currentComparison.site2.verdictSummary}
              </p>
            </div>
          </div>

          {/* Deep Comparative Matrix Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Detailed Side-by-Side Security Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct head-to-head comparison of technical encryption, security headers, and domain traits.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="py-3 px-4 font-bold text-slate-400 uppercase text-xs">Security Feature</th>
                    <th className="py-3 px-4 font-extrabold text-slate-900 dark:text-white max-w-[200px] truncate">
                      {currentComparison.site1.domain}
                    </th>
                    <th className="py-3 px-4 font-extrabold text-slate-900 dark:text-white max-w-[200px] truncate">
                      {currentComparison.site2.domain}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Overall Score */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      Overall Trust Score
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">
                        {currentComparison.site1.overallSafetyScore} / 100
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white">
                        {currentComparison.site2.overallSafetyScore} / 100
                      </span>
                    </td>
                  </tr>

                  {/* SSL / TLS Status */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      SSL/TLS Certificate
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {currentComparison.site1.ssl.isValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className="font-medium">
                          Grade {currentComparison.site1.ssl.grade} ({currentComparison.site1.ssl.issuer})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {currentComparison.site2.ssl.isValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className="font-medium">
                          Grade {currentComparison.site2.ssl.grade} ({currentComparison.site2.ssl.issuer})
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Security Headers Grade */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      Security Headers
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">
                        Grade {currentComparison.site1.headers.grade} ({currentComparison.site1.headers.totalScore}/100)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">
                        Grade {currentComparison.site2.headers.grade} ({currentComparison.site2.headers.totalScore}/100)
                      </span>
                    </td>
                  </tr>

                  {/* HSTS */}
                  <tr>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 pl-8">
                      └ Strict-Transport-Security (HSTS)
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site1.headers.hsts.present ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
                      ) : (
                        <span className="text-rose-500 font-semibold">Missing</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site2.headers.hsts.present ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
                      ) : (
                        <span className="text-rose-500 font-semibold">Missing</span>
                      )}
                    </td>
                  </tr>

                  {/* CSP */}
                  <tr>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 pl-8">
                      └ Content-Security-Policy (CSP)
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site1.headers.csp.present ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Enforced</span>
                      ) : (
                        <span className="text-slate-400 font-semibold">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site2.headers.csp.present ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Enforced</span>
                      ) : (
                        <span className="text-slate-400 font-semibold">None</span>
                      )}
                    </td>
                  </tr>

                  {/* X-Frame-Options */}
                  <tr>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 pl-8">
                      └ Clickjacking Defense (X-Frame)
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site1.headers.xFrameOptions.present ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Protected</span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Unprotected</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site2.headers.xFrameOptions.present ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Protected</span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Unprotected</span>
                      )}
                    </td>
                  </tr>

                  {/* Brand Impersonation */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      Brand Impersonation Risk
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site1.brandImpersonation.detected ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">
                          SPOOFING SUSPECTED
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          No spoofing detected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site2.brandImpersonation.detected ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">
                          SPOOFING SUSPECTED
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          No spoofing detected
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Email Authentication */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      DNS SPF / DMARC Auth
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site1.dns.hasSpfOrDmarc ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Configured</span>
                      ) : (
                        <span className="text-slate-400 font-medium">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {currentComparison.site2.dns.hasSpfOrDmarc ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Configured</span>
                      ) : (
                        <span className="text-slate-400 font-medium">None</span>
                      )}
                    </td>
                  </tr>

                  {/* Latency */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      Response Latency
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {currentComparison.site1.responseTimeMs} ms
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {currentComparison.site2.responseTimeMs} ms
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
