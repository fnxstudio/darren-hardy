# Founders carts: changes queued for the next Spiffy paste

Not installed yet. The user is collecting more edits; when asked, turn this list into one paste
(code box and/or Custom CSS box) for all four Founders carts, then check all four after install.
Mocks: `tce-mocks/pif-before-after.png` (10-book) and `tce-mocks/pif-before-after-100.png` (100-book).

Waiting on Sara: a $0, always-selected product option "REARDEN SPONSORSHIP ($5,000 value)" on the
Founders carts. Once it's on one cart, read the live cart to get its real block id and summary markup
before writing the code. Asked her not to add her own hiding code.

## Order summary (all four carts)
1. **Show the credit row again.** Remove `.line--discount` (and decide on `.coupon-code`; keep the
   code chip hidden) from part 1b of `spiffy-founders-carts-paste.txt`. Today that rule runs on all
   four carts, not just Prepay.
2. **Credit as a line item.** Restyle Spiffy's discount row to match the item lines above it (same bold
   type, grey price, no divider, sits directly under the items). Display only; Spiffy's math untouched.
3. **Credit label = "X Book Credit"**, X from the coupon code: 200OFF -> 10, 1000OFF -> 100.
   (3-book Prepay link has no code, so no credit row.) Replaces Spiffy's "Discount".
4. **Credit amount = "(-$200)" / "(-$1,000)"** exactly, plain hyphen, built from Spiffy's own amount
   text ("$1,000 off"). Write "$" as the escape \u0024 (Spiffy's save mangles "$" + digits).
5. **Rearden line:** rename Spiffy's "The Compound Effect In Business - REARDEN SPONSORSHIP ($5,000 value)"
   to "REARDEN SPONSORSHIP ($5,000 value)", and its price "FREE" to "INCLUDED" (small caps-size type,
   letter-spaced, same grey as prices).
6. **Hide the Rearden product in the checkout form** so it only appears in the summary.
7. Re-apply 3-5 whenever Spiffy redraws the summary (seat counter, VIP checkbox). All DOM work stays
   inside `tcebAfterMount` (wait for Spiffy's app to settle).

## VIP / Team boxes (all four carts)
8. **Bigger red callout.** The corner tab becomes a full-width red band across the top of each box:
   18px, letter-spacing .08em, padding 11px 16px, centred; box top padding 64px so the headline clears it
   (check the 600px rule, which sets 40px). Mock: `tce-mocks/founders-boxes-banner-tab.jpg` (live cart with
   the CSS injected, not saved).
9. **VIP row spacing = Team row.** Zero the inner margins (`.form-group` 10px, `.custom-control` 5px) in
   `.tceb-vip .layout-checkboxes1`, give it padding 15px 16px and margin-bottom 20px. Measured with the
   CSS injected: VIP row 74px tall with 21px below, same as Team.
10. **VIP bullet copy:** "Connect with fellow VIP Founders before the event" (drop "your" and "begins").
11. **Team monthly price second line:** "+$308/ea for 12 months" (was "+$308 for 12 months").
    First line stays "Only $308/ea today".
12. **Box video player = invite page player.** Add to the box iframe src:
    `&color=e02826&colors=000000,e02826,ffffff,000000&cc=0&pip=0&transcript=0&quality_selector=0&airplay=0&chromecast=0&speed=1`
    (play, red scrub, volume, speed, fullscreen only).

## Checks after install
- All four carts: totals unchanged, credit row text and amount right, Rearden line shows INCLUDED,
  Rearden product not visible in the form, 13 monthly payments unchanged, no console errors.
- Diff the stored code in `<div id="customCode">` against the source file.
