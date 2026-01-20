
# Southern Amusement Company, LLC — Single Page Site

Deployed via GitHub Pages on your user site: **https://1pocket.github.io**

## Publish / Update Steps
1. Open your repo: https://github.com/1pocket/1pocket.github.io
2. Click **Add file → Upload files** and drag the contents of this folder (or the ZIP).
3. Commit to the **main** branch.
4. Pages auto-deploys to **https://1pocket.github.io** in ~1 minute.

### Replacing Images
- Pool tables: `assets/images/tables.jpg`
- Jukebox: `assets/images/jukebox.jpg`
- Logo: `assets/images/logo.png` (also provided as `logo.svg` and `logo-hires.jpg`)

### Optional Enhancements

#### Lead capture (recommended)
This site can submit the "Request a quote" form to a **Google Sheet** (your contact list) and also email you each lead.

1) Create a new Google Sheet (example name: "Southern Amusement Leads")
2) In the Sheet: **Extensions → Apps Script**
3) Paste the script located at: `apps-script/Code.gs`
4) Update the `SETTINGS` block (sheet ID, email address)
5) **Deploy → New deployment → Web app**
   - Execute as: Me
   - Who has access: Anyone
6) Copy the Web App URL and paste it into `index.html`:
   `window.SAC_LEAD_ENDPOINT = '...';`

If the endpoint is not configured, the site falls back to the clipboard “Copy details” button so you never lose a lead.

#### Analytics
Google Analytics 4 is stubbed in `index.html`.

1) Create a GA4 property
2) Replace both instances of `G-XXXXXXXXXX` with your real Measurement ID

---

Other options (if you prefer):
- Formspree / Basin / Getform as a hosted form backend
- Plausible or Fathom as privacy-focused analytics
