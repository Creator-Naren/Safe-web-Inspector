import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { SiteScanner } from './components/SiteScanner.js';
import { SiteComparator } from './components/SiteComparator.js';
import { SecurityGuide } from './components/SecurityGuide.js';
import { RecentScans } from './components/RecentScans.js';
import type { WebsiteSafetyReport, SiteComparisonResult, RecentScanItem } from './types.js';
import { AlertCircle, ShieldCheck, Heart } from 'lucide-react';

const RECENT_SCANS_STORAGE_KEY = 'safeweb_recent_scans_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'compare' | 'guide'>('scan');
  const [currentReport, setCurrentReport] = useState<WebsiteSafetyReport | null>(null);
  const [currentComparison, setCurrentComparison] = useState<SiteComparisonResult | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prefillCompareUrl, setPrefillCompareUrl] = useState<string>('');
  const [recentScans, setRecentScans] = useState<RecentScanItem[]>([]);

  // Load recent scans from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SCANS_STORAGE_KEY);
      if (saved) {
        setRecentScans(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveRecentScan = (report: WebsiteSafetyReport) => {
    const newItem: RecentScanItem = {
      id: `${report.domain}-${Date.now()}`,
      url: report.url,
      domain: report.domain,
      score: report.overallSafetyScore,
      threatLevel: report.threatLevel,
      timestamp: Date.now(),
    };

    setRecentScans((prev) => {
      const filtered = prev.filter((p) => p.domain !== report.domain);
      const updated = [newItem, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SCANS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setRecentScans([]);
    try {
      localStorage.removeItem(RECENT_SCANS_STORAGE_KEY);
    } catch {}
  };

  // API Call: Check single site
  const handleScanUrl = async (url: string): Promise<WebsiteSafetyReport | null> => {
    setScanLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/check-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to inspect website');
      }

      const data: WebsiteSafetyReport = await response.json();
      setCurrentReport(data);
      saveRecentScan(data);
      setActiveTab('scan');
      return data;
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error communicating with safety scanner engine.');
      return null;
    } finally {
      setScanLoading(false);
    }
  };

  // API Call: Compare two sites
  const handleCompare = async (url1: string, url2: string): Promise<SiteComparisonResult | null> => {
    setCompareLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/compare-sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url1, url2 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to compare websites');
      }

      const data: SiteComparisonResult = await response.json();
      setCurrentComparison(data);
      setActiveTab('compare');
      if (data.site1) saveRecentScan(data.site1);
      if (data.site2) saveRecentScan(data.site2);
      return data;
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error performing side-by-side comparison.');
      return null;
    } finally {
      setCompareLoading(false);
    }
  };

  // Auto-fill and switch to compare tab
  const handleCompareWith = (domain: string) => {
    setPrefillCompareUrl(domain);
    setActiveTab('compare');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 dark:text-rose-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {activeTab === 'scan' && (
          <SiteScanner
            onScanUrl={handleScanUrl}
            currentReport={currentReport}
            loading={scanLoading}
            onCompareWith={handleCompareWith}
          />
        )}

        {activeTab === 'compare' && (
          <SiteComparator
            onCompare={handleCompare}
            currentComparison={currentComparison}
            loading={compareLoading}
            prefillUrl1={prefillCompareUrl}
          />
        )}

        {activeTab === 'guide' && <SecurityGuide />}

        {/* Persistent Recent Scans Strip */}
        <RecentScans
          items={recentScans}
          onSelectScan={(url) => {
            handleScanUrl(url);
          }}
          onCompareScan={handleCompareWith}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">SafeWeb Inspector</span>
            <span>— Real-time TLS, DNS, Security Headers & Threat Intelligence</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">Strict User Privacy • Client URL Lookups Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
