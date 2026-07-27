# DarrenDaily Webflow — Team Setup Steps (Simple)

Three things for the team. Do **Part 1 (billing)** and **Part 2 (HubSpot + tracking)**
now. **Part 3 (domain)** waits until we say we're ready to go live.

If you get stuck on any step, stop and send us a screenshot — don't guess.

---

## PART 1 — Turn on Webflow billing (do first, ASAP)

The site needs a paid plan before we can build the CMS or add any tracking code.

1. Log into Webflow and open the DarrenDaily project.
2. Go to **Site settings → Plans** (or "Upgrade").
3. Under **Site plans**, choose **Business** (annual is cheaper than monthly).
4. Complete checkout.
5. Tell us it's done.

> Pick the **Business site plan** (not just CMS) — it has the bandwidth for our traffic.
> You do **not** need to upgrade the Workspace, just this site's plan.

---

## PART 2 — HubSpot + tracking (do now)

### Step 1 — Tell us what you track
Send us these (or tell us who manages analytics and we'll ask them):
- **HubSpot** — confirm the account. We believe the Portal ID is **2518645**.
- **Google Analytics** — are you on GA4? If yes, send the **Measurement ID** (looks like `G-XXXXXXXX`).
  Find it: Google Analytics → **Admin → Data streams →** click the stream → **Measurement ID** (top right).
- **Meta / Facebook Pixel** — do you run one? If yes, send the **Pixel ID** (a long number).
  Find it: Meta **Events Manager → Data sources →** your pixel → the ID under its name.
- **Anything else?** (LinkedIn Insight tag, TikTok pixel, etc.) — send those IDs too.

### Step 2 — Copy the HubSpot tracking code
1. Log into HubSpot.
2. Click the **gear (Settings)**, top right.
3. Left menu: **Tracking & Analytics → Tracking Code**.
4. Copy the **Embed code** shown there and send it to us.
   *(If that's hard to find, just confirming the Portal ID above is enough — we can build it.)*

### Step 3 — Turn on the HubSpot cookie banner
1. Still in HubSpot **Settings**, left menu: **Privacy & Consent** (may be under "Cookies & Consent").
2. **Enable** the cookie consent banner.
3. Consent type: choose **"Notify"** (a simple notice) unless legal tells you otherwise.
4. Add the site domain so the banner shows there.
5. Adjust the text/colors if you like, then **Save**.

That's all for HubSpot — this same banner will appear on the new site automatically once the tracking code is in.

### Step 4 — Paste the codes into Webflow *(only after we say the site is ready)*
We'll message you when the Webflow site exists. Then:
1. Open the Webflow project → **Site settings**.
2. Click **Custom code**.
3. In the **Head code** box, paste the block we send you (HubSpot + GA4 + any pixels).
4. **Save changes.**
5. Click **Publish**.

Done — tracking and the cookie banner are live.

---

## PART 3 — Domain (LATER — do not start until we say go)

### Do we need to buy an SSL certificate? No.
Webflow includes a **free SSL certificate automatically** on the Business plan. You don't
buy or install anything — once the domain is pointed at Webflow, it turns on HTTPS by itself.

### Steps (when we're ready to switch over):
1. In Webflow → **Site settings → Publishing → Custom domains**, add the domain.
2. Webflow will **show you the exact DNS records** to enter (some A records + a CNAME).
3. Go to wherever the domain's DNS is managed (registrar/host) and enter **exactly those records**.
4. Back in Webflow, make sure **Enable SSL** and **Default to HTTPS** are on, set the default domain, then **Publish**.

We'll do this step live with you so nothing goes down.

> ❓ **Confirm for us:** is the live address **darrendaily.com** (the root domain) or
> **dd.darrenhardy.com** (a subdomain)? It changes which DNS records you'll enter. No rush —
> just need to know before the domain step.

---

## The one thing that unblocks everything right now
**Part 1 (upgrade to Business)** and **Part 2, Step 1 (send the tracking IDs).**
Everything else follows from those two.
