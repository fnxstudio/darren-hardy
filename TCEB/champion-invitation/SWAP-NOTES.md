# /champion-invitation: what to swap later

The Champion Board's "GET MY GIFT LINK" funnel. A copy of the BMC45 card's /champion-invite funnel, on the
TCE Webflow site (6aa109c0730dcec4155908e1). Built 2026-11-04 with /champion-invite's current video, Spiffy cart
and HubSpot forms. Staging only, noindex, out of the sitemap.

| Page | Page id | Copied from |
|---|---|---|
| /champion-invitation | 6aebef162efd66e375587415 | /champion-invite |
| /champion-invitation-confirmation | 6aebef175380cfcdd6440e0a | /champion-invite-confirmation |
| /champion-invitation-vip-confirmation | 6aebef17f10a750ce2aa487d | /champion-invite-vip-confirmation |
| /champion-invitation-gift-confirmation | 6aebef18ff9d28e26c89894e | /champion-invite-gift-confirmation |
| /champion-invitation-digital-gift-confirmation | 6aebef19cc55624742ecebe0 | /champion-invite-digital-gift-confirmation |

The only change from the originals: the gift confirmations' "Redeem your gift" link goes to /champion-invitation.

## 1. New video (Darren's evergreen recording)

Webflow > /champion-invitation > Page settings > Custom code > **Before </body>**, the first block,
`CI_SETTINGS`. Change these four values and nothing else:

- `VIMEO_ID`: the number in the new video's vimeo.com link (cover thumbnail + length).
- `VIDEO_HLS`: Vimeo > the video > Distribution > Video file links > HLS link (.m3u8, keep the `?s=...` part).
- `VIDEO_MP4`: same place, the 1080p MP4 link (keep the signature).
- `REVEAL_AT`: the second at which the button + free book link appear. Set it to 1 second before Darren says
  "Click the button below". If it's later than the video's end, the button shows in the last 5 seconds.

The video ID alone is not enough: the HLS and MP4 links carry their own security codes from Vimeo.

## 2. New Spiffy cart (Sara)

- Same block, `CART_URL`: the new cart's address (`https://secure.darrenhardy.com/checkout/<cart>`).
- In Spiffy, set the new cart's after-purchase redirects to /champion-invitation-confirmation and, for VIP,
  /champion-invitation-vip-confirmation (with "send order details through the URL" on, as the current cart has).
- The new cart needs the same custom CSS + code as the referrals cart (TCEB/champion-invite/spiffy-referrals-*).
- Until the swap, a purchase here lands on the OLD /champion-invite confirmation pages (the current cart's
  redirects). The Champion still gets the credit: the referral code travels in the link.

## 3. New HubSpot forms

Two embeds on /champion-invitation hold the form IDs, each on one line `var FORM_ID = "..."`:

- Hardcover book form, embed `1aee7070-…` (now 4f117f67-2239-48e7-941d-eba5f81426e0) -> its redirect should be
  /champion-invitation-gift-confirmation.
- International audio + eBook form, embed `ea1bdb98-…` (now e5723685-9a71-4ca4-9bc0-153428def07f) -> its redirect
  should be /champion-invitation-digital-gift-confirmation.

New forms need the same hidden fields `dhrp_opt_in_affiliate_id` + `dhrp_opt_in_campaign` (HubSpot fills them
from the page address). Until the swap, form sign-ups land on the OLD gift confirmation pages.

## 4. Jon (Fan Bridge)

- A referral console campaign whose destination is `https://www.thecompoundeffect.com/champion-invitation`.
- The board's "GET MY GIFT LINK" button gives each Champion their own card.darrenhardy.com/r/CODE link for it.
- When the new cart exists, add it to the champion feed so those seats count on the board.

After any swap: publish to staging, test with `?skip=end&introducer=Jon`, then live.


**2026-11-06:** CART_URL switched to the evergreen checkout `the-compound-effect-in-business-founders-event-referrals-evergreen` (user). Verified live: the cart loads it with utm_content/ref carried. In Spiffy, that cart needs the same custom CSS + code and the after-purchase redirects to /champion-invitation-confirmation and /champion-invitation-vip-confirmation (Sara).
