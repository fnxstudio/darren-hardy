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
