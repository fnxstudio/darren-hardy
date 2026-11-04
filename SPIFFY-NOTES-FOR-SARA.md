# Notes for Sara (Spiffy): pre-print + Founders Event funnel

Running list. Read from the live Spiffy checkout settings on 2026-10-16.

## Redirects
1. **Use https:// on every redirect.** All the embedded steps point at `http://thecompoundeffect.com/...`. They still work (the site redirects), but `https://` saves a hop and avoids a mixed-content warning.
   - Pre-print cart: 3 Book Invite, 10 Book Invite, 100 Book Invite
   - Every Founders cart: Confirmation Page (`/pre-print-event-confirmation`)
2. **Order number isn't passed.** Spiffy sends buyers to the exact URL with nothing added, so our pages can't show "Order #…". If Spiffy has an order-ID merge tag, add it to each redirect as `?order={tag}`. Our pages already read `?order=` and show it.
3. **VIP buyers go to the regular confirmation.** Every Founders cart lands on `/pre-print-event-confirmation`. VIP buyers should go to `/pre-print-event-vip-confirmation` (add a condition: order includes the VIP item).
4. **Team seats count isn't passed.** If possible, add `?seats={qty}` on the confirmation redirect so the team-seat step shows only to people who bought seats.
5. **Checkout title:** "TCEB FOUNDER'S EVENT" needs a new name (exact wording to come from us).
6. **Fallback step.** A pre-print order that matches none of the 3/10/100 conditions lands on Spiffy's own "Thank You 1" page. Point it at `https://thecompoundeffect.com/pre-print-confirmation` or confirm that it can't happen.

## The code (all four Founders carts: base, -200-off, -1000-off, -pif)
Paste `pre-print-demo-assets/spiffy-checkout-custom.js` inside `<script></script>` in each checkout's Settings > custom code. Same file for all four; it detects the -pif cart and shows the prepay prices there. Nothing else to build in the editor. The code:
- Keeps the duplicate total above the Join button, and hides the code chip and Discount row on the prepay cart.
- Turns the Extra Team Seats dropdown into a − / + counter.
- Builds the VIP and Team boxes around the existing checkbox and dropdown: corner tab, headline, grey line, bullets, price on the right, and "Get more details from Darren →", which plays Darren's video in the box (with a Close button).
- Relabels the VIP checkbox "Add VIP to my seat" and hides its green price badge.
- Changes the Join button to "JOIN THE FOUNDERS EVENT!" (no apostrophe).

Keep the VIP checkbox's name containing "VIP" and the dropdown named "Extra Team Seats"; that's how the code finds them.

Demo of the target: https://fnxstudio.github.io/darren-hardy/pre-print-event-invite-demo-2b/

## Champion invite funnel: REFERRALS cart (2026-11-01)
Code ready in `TCEB/champion-invite/` (handoff: `SPIFFY-REFERRALS-FOR-SARA.md`): `spiffy-referrals-custom.css`
(Design > Custom CSS) + `spiffy-referrals-custom-code.html` (Settings > custom code), then publish.
Redirects and order-details-in-URL were already set correctly on this cart. Our Webflow page swaps its mock
form back to the real embed once she has published.

## Pre-release book cart: the-compound-effect-pre-release (2026-11-02)
Checked the live checkout. Routing is right (every order goes to `https://thecompoundeffect.com/pre-release-invite`), prices are right ($89.85 / $249.50 / $1,995), and shipping is already hidden and picked automatically from the bundle and country (tested: US 10 books adds $16.58, UK adds $32.78).

Two IDs were copied over from the pre-print cart and still point at it. Change both, then publish the checkout:

1. **Settings > custom code**, in this line:
   `var btn = document.querySelectorAll('#block-370965 label.option-button-auto-width')[INDEX[tier]];`
   change `370965` to `376023`. (This is what selects the bundle when someone clicks 3, 10 or 100 on our page.)
2. **Design > Custom CSS**, in this rule:
   `#section-333440:has(.option-button-auto-width--selected) { display: none !important; }`
   change `333440` to `337566`. (This hides the 3/10/100 buttons in the form once a bundle is picked, like the pre-print cart.)

Both fixes were tested inside the live checkout: picking 10 books sets the total to $249.50 and hides the bundle buttons.

Optional: if Spiffy has an order-ID merge tag, add `?order={tag}` to the invite redirect so the invite page can show "Order #…".

## Hardy Harvest: SALES carts founders-event + founders-event-pif (2026-11-04)
Code ready in `Hardy-Harvest/spiffy/` (tested inside both live carts: totals right, VIP + team boxes build, "I agree" pre-ticked, no errors):
- founders-event (Pay Monthly): `hh-founders-event-custom.css` (Design > Custom CSS) + `hh-founders-event-custom-code.html` (Settings > custom code)
- founders-event-pif (Pay In Full): `hh-founders-event-pif-custom.css` + `hh-founders-event-pif-custom-code.html`
Both carts are embedded on darrenhardy.com/harvest (staging) and show Spiffy's plain look until these are installed.

Settings for Sara on both carts:
1. Button text: RESERVE MY FOUNDERS SEAT
2. Thank-you redirect: darrenhardy.com/harvest-confirmation; when the VIP add-on is bought, darrenhardy.com/harvest-vip-confirmation (both carts still end on Spiffy's generic "Thank You 1" step).

## Hardy Harvest: VIP carts tceb-founders-event-vip-monthly + tceb-founders-event-vip (2026-11-04)
Docs (two tabs each): "Spiffy - HH - VIP - Monthly" 1RfXMqK9aDBmR-35ENprgQai-NUooqUvSYfLYZKBw3yQ, "Spiffy - HH - VIP - PIF" 1zrjgJ9ZuldafiTh6jdcz411s_LFIJaOdowYmuq0gyrc.
Settings on both carts:
1. Button text: UPGRADE ME TO VIP
2. Thank-you redirect: darrenhardy.com/harvest-vip-confirmation
Both carts are embedded on darrenhardy.com/harvest-vip (staging).
