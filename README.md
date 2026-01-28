# Southern Amusement Company, LLC — Single Page Website

This repo contains the **single-page marketing site** for Southern Amusement Company, LLC, hosted on **GitHub Pages**.

**Live site:** https://1pocket.github.io  
**Repo:** https://github.com/1pocket/1pocket.github.io

---

## Contents
- [Deploy / Update (GitHub Pages)](#deploy--update-github-pages)
- [Customize Content](#customize-content)
- [Replace Images](#replace-images)
- [Optional Enhancements](#optional-enhancements)
  - [Lead Capture (Google Sheet + Email)](#lead-capture-google-sheet--email)
  - [Analytics (GA4)](#analytics-ga4)
- [Troubleshooting](#troubleshooting)

---

## Deploy / Update (GitHub Pages)

GitHub Pages is configured for this repository and automatically deploys from the `main` branch.

### Option A — Upload via GitHub (fastest)
1. Open the repo: https://github.com/1pocket/1pocket.github.io
2. Click **Add file → Upload files**
3. Drag-and-drop the **contents** of this project folder (or upload the ZIP contents)
4. **Commit** to the `main` branch
5. GitHub Pages will redeploy to https://1pocket.github.io (usually within ~1 minute)

### Option B — Git workflow
```bash
git clone https://github.com/1pocket/1pocket.github.io
cd 1pocket.github.io
# copy/replace site files here
git add .
git commit -m "Update site"
git push origin main

