# DarrenDaily Webflow — Team Setup Steps (Simple)

Four short jobs. Do **Parts 1–3 now**. **Part 4 (domain)** only when we say we're ready
to go live. If a step doesn't look like what's described, stop and send a screenshot — don't guess.

The Webflow site already exists (Site ID `6a66d7a6f9d116b514a13ae1`, darrendaily.com), so
nothing here creates a new site — you're just turning things on.

---

## PART 1 — Upgrade the Webflow site plan (do first, ASAP)

The site needs a paid plan before we can build the CMS or add tracking.

**Which plan:** **Premium.** (In May 2026 Webflow merged the old "CMS" and "Business" plans
into one **Premium** plan.)
**Cost:** **$25/month** billed annually (~$300/yr) or **$39/month** billed monthly. Annual is the better deal.

1. Log into Webflow, open the **DarrenDaily** project.
2. **Site settings → Plans**.
3. Under **Site plans**, choose **Premium**, billed **annually**.
4. Complete checkout, then tell us it's done.

> This is a **Site** plan (for this one project). You do **not** need to upgrade the Workspace.

---

## PART 2 — HubSpot + tracking (do now)

**Quick why:** the actual "hookup" to the site is just **one code snippet pasted into Webflow**.
But *what HubSpot does* — the tracking, the cookie banner, the Smart CTAs — is switched on inside
**HubSpot's** own dashboard, because Webflow can't reach in and flip another tool's settings. Most
of this is probably already set up on your current site, so it's mostly "confirm + reuse."

### Step 1 — Tell us what you track
Send us these (or tell us who manages analytics and we'll ask them):
- **HubSpot** — confirm the account. We believe the Portal ID is **2518645**.
- **Google Analytics** — on GA4? Send the **Measurement ID** (`G-XXXXXXXX`).
  Find it: Google Analytics → **Admin → Data streams →** click the stream → **Measurement ID** (top right).
- **Meta / Facebook Pixel** — run one? Send the **Pixel ID** (a long number).
  Find it: Meta **Events Manager → Data sources →** your pixel → the ID under its name.
- **Anything else?** (LinkedIn Insight tag, TikTok pixel, etc.) — send those IDs too.

### Step 2 — Copy the HubSpot tracking code
1. HubSpot → **gear (Settings)**, top right.
2. Left menu: **Tracking & Analytics → Tracking Code**.
3. Copy the **Embed code** and send it to us. *(Or just confirm the Portal ID — we can build it.)*

### Step 3 — Turn on the HubSpot cookie banner
1. HubSpot **Settings** → **Privacy & Consent** (may read "Cookies & Consent").
2. **Enable** the cookie consent banner.
3. Consent type: **"Notify"** (a simple notice) unless legal says otherwise.
4. Add the site domain so it shows there, tweak text/colors if you like, **Save**.

This same banner shows on the new site automatically once the tracking code is in.

### Step 4 — Paste the codes into Webflow *(do as soon as Part 1 is done — no need to wait on us)*
We'll send you one combined block (HubSpot + GA4 + any pixels + a small tag).
1. Webflow project → **Site settings → Custom code**.
2. Paste the block into the **Head code** box.
3. **Save changes**, then **Publish**.

Done — tracking + the cookie banner are live.

---

## PART 3 — Comments plugin (Hyvor) — allow our domains

Our comments won't load until the domains are whitelisted in Hyvor.

1. Log into the **Hyvor Talk** console.
2. Open our website (**website ID 13897**) → **Settings → Domains**.
3. Add **both**:
   - the Webflow **staging** URL: **`darrendaily.webflow.io`**, and
   - **`darrendaily.com`**.
4. Save.

---

## PART 4 — Domain (LATER — do not start until we say go)

### Do we need to buy an SSL certificate? No.
Webflow includes a **free SSL certificate automatically** on the Premium plan. Nothing to buy or
install — once the domain points at Webflow, HTTPS turns on by itself.

### Steps (when we're ready to switch over):
1. Webflow → **Site settings → Publishing → Custom domains** → add **darrendaily.com** and **www.darrendaily.com**.
2. Webflow will **show you the exact DNS records** (some A records + a CNAME).
3. In the domain's DNS host (registrar), enter **exactly those records**.
4. Back in Webflow: make sure **Enable SSL** + **Default to HTTPS** are on, set the default domain, then **Publish**.

We'll hand you the exact records and the order to do them in when it's time, so the switch is clean.

---

## The two things that unblock everything right now
1. **Part 1** — upgrade to **Premium**.
2. **Part 2, Step 1** — send the tracking IDs (or who to ask).
