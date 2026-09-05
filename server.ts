import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { analyzeWebsiteSafety, compareWebsitesSafety } from './server/safetyAnalyzer.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Check single site
  app.post('/api/check-site', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string' || url.trim().length === 0) {
        return res.status(400).json({ error: 'Valid URL is required' });
      }

      const report = await analyzeWebsiteSafety(url);
      return res.json(report);
    } catch (err: any) {
      console.error('Error in /api/check-site:', err);
      return res.status(500).json({
        error: 'Failed to analyze website',
        message: err?.message || 'Internal server error',
      });
    }
  });

  // Compare two sites
  app.post('/api/compare-sites', async (req, res) => {
    try {
      const { url1, url2 } = req.body;
      if (!url1 || !url2 || typeof url1 !== 'string' || typeof url2 !== 'string') {
        return res.status(400).json({ error: 'Both url1 and url2 are required' });
      }

      const comparison = await compareWebsitesSafety(url1, url2);
      return res.json(comparison);
    } catch (err: any) {
      console.error('Error in /api/compare-sites:', err);
      return res.status(500).json({
        error: 'Failed to compare websites',
        message: err?.message || 'Internal server error',
      });
    }
  });

  // Preset comparison and single check samples
  app.get('/api/samples', (req, res) => {
    res.json({
      quickChecks: [
        { name: 'Wikipedia', url: 'https://en.wikipedia.org', category: 'Knowledge / Encylopedia' },
        { name: 'GitHub', url: 'https://github.com', category: 'Developer Platform' },
        { name: 'PayPal Official', url: 'https://www.paypal.com', category: 'Financial Service' },
        { name: 'Phishing Sim Example', url: 'https://paypal-security-update-verify.top', category: 'Suspicious / Brand Imitation' },
        { name: 'Non-HTTPS Legacy Site', url: 'http://neverssl.com', category: 'Unencrypted HTTP' },
      ],
      comparisons: [
        {
          title: 'Official Bank vs. Phishing Clone',
          site1: 'chase.com',
          site2: 'chase-online-login-auth.xyz',
          tag: 'Security Warning',
        },
        {
          title: 'Payment Gateway Comparison',
          site1: 'paypal.com',
          site2: 'stripe.com',
          tag: 'Enterprise Services',
        },
        {
          title: 'Official Brand vs. Typosquatting',
          site1: 'google.com',
          site2: 'go0gle-login-verify.top',
          tag: 'Phishing Defense',
        },
        {
          title: 'Encrypted vs. Unencrypted Web',
          site1: 'https://wikipedia.org',
          site2: 'http://neverssl.com',
          tag: 'SSL/TLS Contrast',
        },
      ],
    });
  });

  // Vite middleware for dev or static server for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
