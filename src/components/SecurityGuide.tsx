import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  Globe,
  KeyRound,
  CheckCircle2,
  FileCode,
  HelpCircle,
  Eye,
} from 'lucide-react';

export const SecurityGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Eye className="w-3.5 h-3.5" />
          <span>Cyber Threat Intelligence & Safe Browsing Field Guide</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How to Recognize Deceptive & Fake Websites
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Cybercriminals use sophisticated visual mimicry, homograph attacks, and subdomain tricks to impersonate reputable brands. Learn the warning signs before you enter credentials.
        </p>
      </div>

      {/* 4 Core Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lesson 1: The Padlock Myth */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            1. The "Padlock" Does Not Mean It's Safe
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The browser padlock symbol (HTTPS) only indicates that the communication between your browser and the server is encrypted. Anyone, including phishers and scam artists, can obtain a free SSL certificate in seconds.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <strong>Rule of thumb:</strong> An encrypted scam is still a scam. Look for the authentic domain name, not just the lock.
          </div>
        </div>

        {/* Lesson 2: Subdomain Trickery */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            2. The Subdomain Camouflage Trick
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Attackers create subdomains that contain a legitimate brand name, hoping you only read the beginning of the URL.
          </p>
          <div className="space-y-1 font-mono text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <p className="text-rose-600 dark:text-rose-400">
              ❌ <span className="line-through">paypal.com.verify-user.top</span> <span className="text-slate-400">(Real domain is verify-user.top!)</span>
            </p>
            <p className="text-emerald-600 dark:text-emerald-400">
              ✓ <span>paypal.com/signin</span> <span className="text-slate-400">(Authentic domain)</span>
            </p>
          </div>
        </div>

        {/* Lesson 3: Homograph Attacks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Homograph & Punycode Mimicry
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Attackers register internationalized domain names (IDNs) with non-Latin characters (like the Cyrillic 'а' or 'о') that render identically to Latin letters in browser address bars.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <strong>SafeWeb Inspector</strong> automatically converts and checks for raw Punycode (e.g. <code className="font-mono text-rose-500">xn--...</code>) to instantly catch homograph attacks.
          </div>
        </div>

        {/* Lesson 4: Security Headers */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileCode className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Enterprise Security Headers
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Legitimate companies protect their users from Clickjacking and Cross-Site Scripting (XSS) by deploying strict HTTP security headers like <code>Strict-Transport-Security</code> and <code>Content-Security-Policy</code>. Throwaway scam sites almost never configure these.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            A website scoring an <strong>F</strong> in Security Headers is a red flag for any site handling sensitive logins or transactions.
          </div>
        </div>
      </div>

      {/* 5-Step Pre-Flight Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          <span>The 5-Point Safety Checklist Before Entering Sensitive Data</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">Step 1</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Inspect the Exact Domain</h4>
            <p className="text-xs text-slate-500">Read from right to left before the first single slash (<code>/</code>). Verify the exact domain matches the company.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">Step 2</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Run SafeWeb Inspector</h4>
            <p className="text-xs text-slate-500">Paste the URL into SafeWeb to check certificate authority, DNS infrastructure, and Gemini threat intelligence.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">Step 3</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Beware of Urgent Messages</h4>
            <p className="text-xs text-slate-500">Phishing emails and texts create artificial panic: "Account suspended in 24 hours! Click here now!"</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">Step 4</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Compare Unknown Alternatives</h4>
            <p className="text-xs text-slate-500">Use our Compare feature to put an unknown online store or tool side-by-side with a reputable provider.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">Step 5</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Use a Password Manager</h4>
            <p className="text-xs text-slate-500">Password managers automatically refuse to auto-fill credentials on fake imitation domains because the domain doesn't match.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
