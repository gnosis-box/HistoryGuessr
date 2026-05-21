# Circles / Gnosis integration (next step)

All **11 challenge types are playable** in the front-end MVP. Wallet, profile, and trust-graph features will use the official Circles stack.

## Builder resources

- [Mini app developers (one pager)](https://miniapps.aboutcircles.com/developers)
- [CirclesMiniapps on GitHub](https://github.com/aboutcircles/CirclesMiniapps)
- [Embedded miniapp boilerplate](https://github.com/aboutcircles/embedded-miniapp-boilerplate)
- [No-code mini app tutorial (Gnosis App checkout)](https://docs.aboutcircles.com/user-guides/build-a-no-code-mini-app-on-circles-using-the-gnosis-app-checkout-flow)
- [Demo video (~6 min)](https://www.loom.com/share/6bcfb38138054053b8dfe3c5607bd451?t=344)
- [Circles docs](https://docs.aboutcircles.com/)
- [Garage program](https://garage.aboutcircles.com/)

## Planned SDK wiring

| Package | Use in History Guessr |
| ------- | --------------------- |
| `@aboutcircles/miniapp-sdk` | `onWalletChange`, `signMessage`, `sendTransactions` |
| `@aboutcircles/sdk` | Profile, CRC balance, trust count, avatar name |

Keep calls in `src/lib/circles/` (e.g. `host.ts`, `profile.ts`). UI falls back to `mockCirclesProfile` until the host injects a Safe address.

## Friend Challenge + Groups

- **Friend Challenge** mode already simulates a rival score; replace with trust-graph invites.
- **City History** maps to local Groups (Avignon, Paris, …) and optional group currency.

## Migration path

1. Deploy this Vite app to HTTPS (Vercel).
2. Test in [Circles playground](https://circles.gnosis.io/playground) or migrate to embedded boilerplate.
3. PR to `aboutcircles/CirclesMiniapps` `static/miniapps.json` for catalog listing.
4. Register on [Garage](https://garage.aboutcircles.com/register) with live URL + repo.
