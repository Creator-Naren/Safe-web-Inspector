<img width="1798" height="877" alt="Screenshot 2026-09-05 061936" src="https://github.com/user-attachments/assets/20558df7-28c0-48ad-a034-4f0a274ba733" />
<img width="1797" height="871" alt="Screenshot 2026-09-05 061912" src="https://github.com/user-attachments/assets/e71d8fe2-04f9-4d2c-bc1e-5c9bf54ae36f" />
<img width="1798" height="882" alt="Screenshot 2026-09-05 061851" src="https://github.com/user-attachments/assets/5c7989c9-70e8-47ac-bd84-cd9529b479a2" />
# Safe Web Inspector

[![Repo Size](https://img.shields.io/github/repo-size/Creator-Naren/Safe-web-Inspector)](https://github.com/Creator-Naren/Safe-web-Inspector)
[![License](https://img.shields.io/github/license/Creator-Naren/Safe-web-Inspector)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Creator-Naren/Safe-web-Inspector)](https://github.com/Creator-Naren/Safe-web-Inspector/issues)

A web-based Site Safety & Comparison engine that inspects live TLS certificates, HTTP headers, DNS infrastructure, and threat intelligence to help verify website safety and detect scams.

Built to be developer-friendly and highly visual — the inspector displays a compact overall safety score, deep technical diagnostics, and clear, actionable findings.

---

## Visual Preview

> Add the screenshots to the repository at `./assets/screenshots/` with these filenames:
- `screenshot-1.png` (Image 1)
- `screenshot-2.png` (Image 2)
- `screenshot-3.png` (Image 3)

Visual gallery (these relative links assume you added the files above):

![Inspector Home & Score](./assets/screenshots/screenshot-1.png)
Caption: Landing UI and example site safety score summary.

![Security Strengths & Diagnostics](./assets/screenshots/screenshot-2.png)
Caption: Security strengths, identified risks, and deep technical diagnostics.

![Certificate Details & Recent Inspections](./assets/screenshots/screenshot-3.png)
Caption: Certificate metadata, SANs, and recent inspection cards.

---

## Key Features

- Live TLS/SSL inspection: certificate issuer, validity window, SANs, negotiated protocol & ciphers.
- HTTP & security headers analysis: CSP, HSTS, and other security header checks.
- DNS infrastructure checks: nameserver and resolver observations, IP/ASN mapping.
- Threat intelligence scoring: aggregate safe/scam indicators from heuristic and external signals.
- Clear UI with score breakdowns, strengths, and identified risks for both technical and non-technical users.
- Recent inspections dashboard for quick comparisons (side-by-side).

---

## How it works (high level)

1. The engine queries the target site and collects:
   - TLS handshake and certificate chain
   - HTTP headers and response codes
   - DNS records and resolved IPs
2. It runs a set of heuristics and rule checks:
   - Certificate validity, CA reputation, and upcoming expiration
   - Presence/strength of security headers (CSP, HSTS, X-Frame-Options, etc.)
   - DNS delegation and possible impersonation signals
3. Aggregates signals into a unified score and a human-readable set of findings:
   - "Security Strengths & Positives"
   - "Identified Risks & Vulnerabilities"
   - Deep technical diagnostics for auditors and engineers

---

## Quick Start

These are generic instructions — adjust commands for your repo structure and stack.

1. Clone the repository:
   git clone https://github.com/Creator-Naren/Safe-web-Inspector.git
   cd Safe-web-Inspector

2. Serve the web UI (if this is a static frontend)
   - Open `index.html` in your browser, or
   - Serve from a local static server, e.g.:
     - Python 3: `python -m http.server 8000` (then open http://localhost:8000)
     - Or use your existing frontend tooling: `npm install && npm start` (if Node project)

3. Backend / scanner service
   - If the project depends on a backend scanner or API, follow the service README (or run the scanner service before visiting the UI).
   - Example pattern: `docker-compose up` to start an API service and frontend

Note: If you want me to add a matching `docker-compose.yml` or specific npm scripts, tell me which runtime/backend this repo uses and I’ll draft them.

---

## Developer Notes & Tips

- Place screenshots under `./assets/screenshots/` and reference them with relative links in this README.
- Use environment variables for API keys and external threat intelligence endpoints; never commit secrets.
- Provide an endpoint that returns a deterministic JSON scan result for UI development and testing (mock mode).
- Add automated tests to validate scanning heuristics and to prevent regressions.

---

## Contributing

Contributions are welcome — issues and pull requests accepted.

- Fork the repo
- Create a branch: `git checkout -b feat/my-feature`
- Add tests and documentation updates
- Submit a PR describing your change

Please follow the repository's coding style and include unit/integration tests where applicable.

---

## Roadmap / Ideas

- Add multi-target comparison mode (compare two sites side-by-side).
- Improve threat intelligence by integrating multiple external feeds.
- Add scheduled scans and historical trend charts.
- Export reports (PDF/CSV) for audits.

---

## License

This repository is currently unlicensed in the draft. Add a LICENSE file (e.g., MIT) to clarify usage.

---

## Contact

Maintainer: Creator-Naren (GitHub: @Creator-Naren)

---

If you'd like, I can:
- Commit this README.md to Creator-Naren/Safe-web-Inspector and upload the three screenshots to ./assets/screenshots/.
- Generate a small CONTRIBUTING.md and a LICENSE (MIT) file for you.
Tell me which actions you want me to take and I'll apply them.
