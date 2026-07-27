# DarrenDaily Webflow — Team Setup Steps

The DarrenDaily site already exists in Webflow (Site ID `6a66d7a6f9d116b514a13ae1`,
darrendaily.com). You own these systems, so please handle the setup below. Ask any
questions anytime. **Once items 1 through 4 are done, reply to confirm** so the build can continue.

Do Parts 1 through 4 now. **Part 5 (domain) waits** until we say we're ready to go live.

---

## PART 1 — Upgrade the Webflow site plan (ASAP)

The site needs a paid plan before the CMS or tracking can be added.

**Plan:** **Premium** (in May 2026 Webflow merged the old CMS and Business plans into Premium).
**Cost:** **$25/month billed annually** (about $300/year), or **$39/month billed monthly**. Annual is the better deal.

1. Log into Webflow, open the **DarrenDaily** project.
2. **Site settings → Plans**.
3. Under **Site plans**, choose **Premium**, billed **annually**.
4. Complete checkout.

> This is a **Site** plan (for this one project). The Workspace does not need upgrading.

---

## PART 2 — HubSpot (both sides)

Connect our HubSpot (**portal 2518645**) to the site. Set it up the way we run it today.

**In HubSpot:**
- Confirm the tracking code is active for the portal.
- Turn on the **cookie consent banner** (Settings → Privacy & Consent). Use **"Notify"** unless legal says otherwise. Add the site domain.
- Confirm the **Smart CTAs** we use are set to run on the new site.

**In Webflow:**
- Add the HubSpot tracking code to **Site settings → Custom code → Head**, then Save and Publish.

---

## PART 3 — Tracking, across the whole site

Install only the tracking we **actually use today**, site wide (Google Tag Manager, HubSpot,
and any current pixels), via **Site settings → Custom code → Head** (or Webflow's native
Google Tag field for GA/GTM).

> The current DarrenDaily pages have built up a lot of **old, unused tags** over the years.
> Please bring over only what is **genuinely in use** now, not all of it.

---

## PART 4 — Comments tool (Hyvor)

Our comments will not load until the domains are whitelisted.

1. Log into the **Hyvor Talk** console.
2. Open our website (**website ID 13897**) → **Settings → Domains**.
3. Add **both**:
   - the staging site **`darrendaily.webflow.io`**, and
   - **`darrendaily.com`**.
4. Save.

---

## PART 5 — Domain (LATER — do not start until we say go)

**No SSL certificate to buy.** Webflow includes free, automatic SSL on the Premium plan. Once
the domain points at Webflow, HTTPS turns on by itself.

Steps (when we're ready to switch over):
1. Webflow → **Site settings → Publishing → Custom domains** → add **darrendaily.com** and **www.darrendaily.com**.
2. Webflow shows the exact DNS records (some A records + a CNAME).
3. In the domain's DNS host, enter exactly those records.
4. Back in Webflow: turn on **Enable SSL** + **Default to HTTPS**, set the default domain, then **Publish**.

We will send the exact records and the order to do them when it is time.

---

## When you are done

Reply to confirm once **Parts 1 through 4** are complete. Questions welcome anytime.
