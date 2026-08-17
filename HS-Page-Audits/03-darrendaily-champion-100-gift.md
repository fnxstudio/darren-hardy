# Page Audit — www.darrendaily.com/champion-100-gift

**Audited:** 2026-08-17 · **HubSpot portal:** 2518645 · **HS content ID:** 197331034914
**Template:** `enrol-lp` · **Modules:** `DH_-_Hero_Two_Column_5_-_Content`, `kore-master-style`
**Method:** served HTML + live DOM probed at 1280 px and 375 px

> Standalone report. See `01-bmc-multiplier-findings.md` and `02-unbreakable-sole-findings.md`.

---

## Summary

This page is a **referral reward claim page**. A subscriber who has referred 100+ people arrives to claim a custom shirt & hat.

It fails on both breakpoints, in different ways, and the reward is **unclaimable on mobile**.

---

## 1. On mobile, the page is the DarrenDaily newsletter homepage

Same URL. Same HTML. Entirely different page.

| | Desktop (1280) | Mobile (375) |
|---|---|---|
| Headline | CONGRATULATIONS CHAMPION! | YOUR 5-MINUTE MORNING EDGE |
| Body | "You've championed over 100 people… Now its time to claim your reward." | "One strategic insight daily. Zero fluff. Maximum impact." |
| Offer | BE THE EXCEPTION shirt & hat | "Private video strategy delivered to your inbox each workday" |
| CTA | **YES! SEND MY GIFT!** | **START MY MORNING ADVANTAGE** |
| Visible form | `38bbadfe-…` (gift) | `41958dbb-…` (newsletter) |

**Two different forms are on the page; CSS picks which one shows.**

| Form | Fields | Visible desktop | Visible mobile |
|---|---|---|---|
| `38bbadfe-…` **gift** | firstname, lastname, email, mobilephone, **address, city, state, shipping_zipcode, shirt_style, shirt_size** | ✅ | ❌ |
| `41958dbb-…` **newsletter** | First Name, Email, Phone, company_role, sms opt-in | ❌ | ✅ |

The newsletter form collects **no address and no shirt size**.

### Consequence
A champion who earned the reward and opens the link on a phone:
- sees no mention of their gift
- cannot enter a shipping address
- cannot choose shirt style or size
- is offered a newsletter subscription they are already on — that is how they earned the referrals

**There is no path to claim the reward on mobile.** Given this is a referral link shared person-to-person, mobile is likely the majority of the traffic.

The newsletter form GUID `41958dbb-3c3a-439b-b747-bb96acf50680` is **identical on `champion-25-gift`**, confirming both reward pages were built by duplicating the DarrenDaily homepage and editing only the desktop view.

---

## 2. The success message promises the wrong reward

Form `38bbadfe-…` — the shirt & hat form, with the shipping address and shirt-size fields — is configured with:

```js
formId: '38bbadfe-2497-4c36-9edf-692578b40e0b',
target: '#hs_form_target_form_166412383',
inlineMessage: "Thank you! Your DarrenDaily mug is on its way."
```

The mug is the **25-tier** reward. A champion who qualified at 100, completes the form correctly on desktop, and is told a mug is coming.

---

## 3. Every form label is hidden — 10 blank boxes

All 10 fields on the gift form have labels defined. **Every label is hidden**, and there are no placeholders and no `aria-label`s.

| Field | Label (hidden) | Placeholder | Required |
|---|---|---|---|
| firstname | First name* | none | ✅ |
| lastname | Last name* | none | ✅ |
| email | Email* | none | ✅ |
| mobilephone | Mobile phone number* | none | ✅ |
| address | Street address* | none | ✅ |
| city | City* | none | ✅ |
| state | State/Region* | none | ✅ |
| shipping_zipcode | Shipping Zipcode* | none | ✅ |
| shirt_style | Shirt Style | none | — |
| shirt_size | Shirt Size | none | — |

The visitor sees a stack of unlabelled boxes and must guess the order of ten fields, eight of them required. This is a hard conversion blocker on the **working** version of the page, and a screen-reader failure.

---

## 4. Metadata is the 25-tier page's

```
<title>       DarrenDaily - Champion Gift - 100
<description> Congratulations on championing 25 people to become #bettereveryday.
```

`champion-25-gift` carries the **identical** description. The 100 page inherited it and it was never changed — so the Google snippet for the 100-tier page advertises the 25-tier achievement.

---

## 5. Copy defects

- **"ROCKSTART STATUS!"** — typo for ROCKSTAR, in an `<h2>` on the desktop hero.
- **"Get ready to turn heads sporting these custom goods.You unlocked your very own"** — missing space after the full stop.
- On mobile, the social-proof line renders out of order: **"Join who refuse to start their day without an edge. | 350,000+ high-achievers"** — the number is separated from its sentence.
- On mobile, **"100% FREE • Unsub|scribe anytime."** — the word is split across two elements.

---

## 6. Inherited portal-level issues

Same as every other page in portal 2518645 — see report 01 for the full triage list. Present here: GTM `GTM-TTK5KZ`, the GA4 / Google Ads / Meta / TikTok / LinkedIn / UET / Clarity stack, Hyros, Funnelytics, ClickCease, the dead Ambassador loader, jQuery 1.11.2, and `utm-tracking.js` with its 2-second forever-interval.

---

## Why this page matters to the wider case

Every defect here is **invisible from the HubSpot editor's desktop preview**. The page looks finished. It took a mobile-width render and a form-config read to find that:

- the reward cannot be claimed by half the audience
- the people who *can* claim it are promised the wrong item
- the form is unlabelled
- the search snippet describes a different tier

This is the clearest available example of why "it looks fine" is not evidence that a page works.
