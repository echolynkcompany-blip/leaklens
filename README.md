<<<<<<< HEAD
# LeakLens — Deploy to Vercel

## What this is
A React app for dental practice revenue intelligence. Built by Echolynk.

## Deploy in 5 minutes

### Step 1 — Install Node.js (if you don't have it)
Download from: https://nodejs.org (choose LTS version)

### Step 2 — Extract this zip
Unzip the leaklens folder anywhere on your computer.

### Step 3 — Install Vercel CLI
Open Terminal (Mac) or Command Prompt (Windows) and run:
```
npm install -g vercel
```

### Step 4 — Navigate to the project folder
```
cd path/to/leaklens
```
Example on Mac: `cd ~/Downloads/leaklens`
Example on Windows: `cd C:\Users\YourName\Downloads\leaklens`

### Step 5 — Install dependencies
```
npm install
```
(This takes 1-2 minutes the first time)

### Step 6 — Test locally (optional but recommended)
```
npm start
```
Opens at http://localhost:3000 — check it works, then Ctrl+C to stop.

### Step 7 — Deploy to Vercel
```
vercel
```
- It will ask you to log in (create a free account at vercel.com if needed)
- Answer the prompts: Yes to deploy, accept defaults
- Your app goes live at a URL like: https://leaklens-abc123.vercel.app

### Step 8 — Add a custom domain (optional)
In your Vercel dashboard → your project → Settings → Domains
Add: leaklens.io (after buying it from Namecheap or Google Domains)

## To update the app
Make your changes, then run:
```
vercel --prod
```

## Multi-client usage
The app supports multiple practices via the sidebar.
Click "+ Add practice" to add a new client, then upload their CSVs on the Upload page.
Each practice's data is calculated independently.

## CSV format
Upload any CSV with these rough column types:

**Call log:** date, caller name, phone, call status (Missed/Answered/Voicemail/After Hours), duration, booked
**Appointments:** date, patient name, appointment type, provider, status (Completed/No-Show/Canceled/Open Slot), value
**Leads:** date, lead name, phone, source, service requested, status, booked (Yes/No), value

Column names are flexible — LeakLens auto-detects them.
=======
# LeakLens — Setup & Deploy Guide

## What's included
- React app with real login (Supabase auth)
- Persistent data — practices, CSVs, recovery queue status all save to DB
- Working PDF export (jsPDF, no CDN)
- Multi-practice support
- Settings page per practice

---

## STEP 1 — Supabase Setup (10 min, free)

1. Go to https://supabase.com → Sign up free
2. Click **New Project** → name it `leaklens` → set a DB password → wait ~2 min
3. Go to **Settings → API** and copy:
   - **Project URL** (e.g. `https://abcxyz.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

4. Open `src/supabase.js` and replace:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

5. In Supabase → go to **SQL Editor** → paste the SQL block from the comment in `src/supabase.js` → click **Run**

6. In Supabase → go to **Authentication → Users** → click **Add User** → enter YOUR email and password. This is your admin login.

---

## STEP 2 — Install & Run Locally

You need Node.js (https://nodejs.org — LTS version).

Open Terminal / Command Prompt:
```bash
cd path/to/leaklens        # e.g. cd ~/Downloads/leaklens
npm install                # installs all dependencies (~2 min)
npm start                  # opens at http://localhost:3000
```

Log in with the email/password you created in Supabase.

---

## STEP 3 — Deploy to Vercel (free)

```bash
npm install -g vercel      # install Vercel CLI (one time)
vercel                     # deploy — follow prompts, accept defaults
```

Your app goes live at a URL like `https://leaklens-abc123.vercel.app`

To update after changes:
```bash
vercel --prod
```

### Add your custom domain
Vercel dashboard → your project → Settings → Domains → add `leaklens.io`

---

## STEP 4 — Adding a Client

1. Log in at your live URL
2. Click **+ Add practice** in the sidebar → enter name + month → click Add
3. You'll land on the Upload page — upload their CSVs
4. Dashboard updates instantly with real metrics

---

## CSV Format

Column names are flexible — LeakLens auto-detects. Rough guide:

| Call log | Appointments | Leads |
|---|---|---|
| Date | Date | Date |
| Caller Name | Patient Name | Lead Name |
| Phone Number | Appointment Type | Phone Number |
| Call Status (Missed/Answered/Voicemail/After Hours) | Provider | Source |
| Duration | Status (Completed/No-Show/Canceled/Open Slot) | Requested Service |
| Booked? (Yes/No) | Estimated Value | Status |
| Notes | Notes | Booked? (Yes/No) |

---

## Future updates

To add new features (e.g. email reports, client login, automation):
- Come back to Claude and describe what you want to add
- I'll write the code — you copy it into the right file and run `vercel --prod`
>>>>>>> fcaf2bab (initial LeakLens build)
