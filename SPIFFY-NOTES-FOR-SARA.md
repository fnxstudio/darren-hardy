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
6. **Button text:** "JOIN THE FOUNDER'S EVENT!" should be "JOIN THE FOUNDERS EVENT!" (no apostrophe).
7. **Fallback step.** A pre-print order that matches none of the 3/10/100 conditions lands on Spiffy's own "Thank You 1" page. Point it at `https://thecompoundeffect.com/pre-print-confirmation` or confirm that it can't happen.

## VIP and Team blocks (Founders carts)
Our code file (section 3) now does the corner tabs, the display font on headings, the tinted action rows and the 44px VIP checkbox automatically. It also hides the green price badge on the VIP checkbox, since the price shows in the block. Sara builds the content blocks; the code styles them.
- **Pricing goes on the right**, right-aligned under the corner tab ("Only $115 today" / "+$115 for 12 months"; Team "Each seat: $308 today" / "+$308 for 12 months"). Main line bold, 16px; sub line regular, 12px, grey, never longer than the main line. On phones it sits right-aligned under the tab, above the headline.
- **VIP checkbox label:** "YES! GO VIP" becomes "Add VIP to my seat".
8. **No images** in the VIP or Team blocks. The copy runs full width, left-aligned.
9. **Block headlines** ("YES! Make me a VIP", "YES! I want to bring my leaders") are large display headlines (Bebas, uppercase, about 30px). A red tab sits in each block's top-right corner: "SAVE $6,000 PER SEAT" on Team, "EXTRA HALF-DAY WITH DARREN" on VIP. Each block has one small grey uppercase line under the headline: VIP "Private Extra Day 3 session · April 28, 2027", Team "General Admission seats for your key leaders". Those two bullets are removed from the lists (3 bullets each now). Team drops the old "Extra team seats" line and the outlined savings chip.
10. **Headline sits at the top of the block, beside the corner tab** (normal top padding, ~230px kept clear on the right so they never touch). On phones (under 600px) the headline drops below the tab instead.
11. **"Get more details from Darren"** is the last bullet in each block's list (VIP video: https://vimeo.com/1236615000, Team video: https://vimeo.com/1236615058). No thumbnail for now.
12. **"Get more details from Darren →"** is regular weight (not bold), underlined, with an arrow at the end.
13. **The checkbox and the seat counter sit at the bottom of each block**, under the bullets, large, on a soft champagne background (#f5eedf).
14. **VIP checkbox matches the seat counter's buttons:** a 44px square, 1px #dedede border, white; when checked it fills red (#e1132e) with a white check mark.
15. **The seat counter** (from our code file) shows −/+ first, then "Extra team seats", the same way the checkbox shows box then label.

Demo of the target: https://fnxstudio.github.io/darren-hardy/pre-print-event-invite-demo-2b/
Code file: `pre-print-demo-assets/spiffy-checkout-custom.js`
