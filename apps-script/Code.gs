/**
 * Southern Amusement Company — Lead Capture (Google Apps Script)
 *
 * What this does:
 * - Accepts POSTs from the website contact form (JSON)
 * - Appends each lead to a Google Sheet (your "contact list")
 * - Emails you the lead details (so you can follow up fast)
 *
 * Setup (quick):
 * 1) Create a new Google Sheet (e.g., "Southern Amusement Leads")
 * 2) Extensions -> Apps Script
 * 3) Paste this file into Code.gs
 * 4) Update SETTINGS below
 * 5) Deploy -> New deployment -> Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6) Copy the Web App URL and paste it into index.html:
 *    window.SAC_LEAD_ENDPOINT = '...';
 */

const SETTINGS = {
  // The spreadsheet that stores your lead list.
  // You can paste the Sheet URL here, or just the ID.
  SPREADSHEET_ID: 'PASTE_YOUR_SHEET_ID_HERE',

  // The sheet tab name in that spreadsheet.
  SHEET_NAME: 'Leads',

  // Where lead notification emails should go.
  NOTIFY_EMAIL: 'PASTE_YOUR_EMAIL_HERE',

  // Optional: include the sender/subject branding.
  EMAIL_SUBJECT_PREFIX: 'New website lead',
};

function doGet() {
  // Useful for a quick "is this deployed" test
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    // Basic validation (your site already validates, but keep the server safe)
    const required = ['name', 'venue', 'city', 'phone', 'email', 'message'];
    for (const k of required) {
      if (!String(data[k] || '').trim()) {
        return json_({ ok: false, error: `Missing field: ${k}` }, 400);
      }
    }

    // Ensure sheet exists + headers
    const ss = SpreadsheetApp.openById(extractId_(SETTINGS.SPREADSHEET_ID));
    const sheet = getOrCreateSheet_(ss, SETTINGS.SHEET_NAME);
    ensureHeaders_(sheet);

    // Append row
    const row = [
      new Date(),
      data.name,
      data.venue,
      data.city,
      data.phone,
      data.email,
      data.message,
      data.page_url || '',
      data.timestamp || '',
    ];
    sheet.appendRow(row);

    // Email notification
    const subject = `${SETTINGS.EMAIL_SUBJECT_PREFIX} — ${data.venue} (${data.city})`;
    const body = [
      'New website lead:',
      '',
      `Name: ${data.name}`,
      `Venue: ${data.venue}`,
      `City: ${data.city}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      '',
      'Request:',
      data.message,
      '',
      `Page: ${data.page_url || ''}`,
      `Time: ${data.timestamp || ''}`,
    ].join('\n');

    MailApp.sendEmail({
      to: SETTINGS.NOTIFY_EMAIL,
      subject,
      body,
      replyTo: data.email,
    });

    return json_({ ok: true }, 200);
  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  }
}

function json_(obj, status) {
  const out = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  // setStatusCode isn't available in older GAS runtimes; safe to omit.
  return out;
}

function extractId_(maybeUrlOrId) {
  const s = String(maybeUrlOrId || '').trim();
  const m = s.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : s;
}

function getOrCreateSheet_(ss, name) {
  const existing = ss.getSheetByName(name);
  if (existing) return existing;
  return ss.insertSheet(name);
}

function ensureHeaders_(sheet) {
  const headers = ['Received', 'Name', 'Venue', 'City', 'Phone', 'Email', 'Message', 'Page URL', 'Client Timestamp'];
  const range = sheet.getRange(1, 1, 1, headers.length);
  const existing = range.getValues()[0];
  const isEmpty = existing.every(v => !String(v || '').trim());
  if (isEmpty) {
    range.setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
}
