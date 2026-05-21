# HIST rewards — Group Currency design

Sandipan’s recommendation: use **Group Currency** (`HIST`), not personal CRC, for cultural miniapps.

## Why HIST vs personal CRC?

| Personal CRC | Group Currency (HIST) |
|--------------|------------------------|
| Generic money in the network | Labels value as **cultural contribution** |
| Hard to explain in-game | Clear narrative: learn, verify, curate |
| Treasury spam risk | Group rules + membership + vouching |

## Flow (implemented in app)

1. Player finishes challenge → score → `calculateHistReward()` → **+X HIST**
2. **Eligibility gates** (spam protection):
   - Score ≥ 400
   - Daily cap (30 HIST / day, local ledger)
   - **Trust**: relative score vs [Gnosis Group](https://docs.aboutcircles.com) anchor `0xc19bc204eb1c1d5b3fe500e5e5dfabab625f286c` (+ your HIST group when set)
   - Stricter modes (`source_detective`, `map_path`) need higher trust
3. **Vouching** (lightweight identity):
   - `guest` → `pending` → `member` of History Guessr group
   - No KYC: trusted members vouch access (demo: localStorage; production: on-chain group membership)
4. **Payout**:
   - Pending HIST in local ledger until group treasury + `sendTransactions` calldata exist
   - Set `VITE_HIST_GROUP_ADDRESS` and wire treasury transfers in `payout.ts`

## Trust API

[Circles Advanced Analytics](https://squid-app-3gxnl.ondigitalocean.app/aboutcircles-advanced-analytics2/docs#/Scoring) — `POST /scoring/relative_trustscore/generic`

## Production checklist

- [ ] Create Circles Group `HIST` on-chain
- [ ] Fund group treasury for quest rewards
- [ ] Set `VITE_HIST_GROUP_ADDRESS`
- [ ] Encode ERC-20 / Circles group token `transfer` in `claimPendingHist()`
- [ ] Replace local vouching with group member list (`sdk.groups.getMembers`)
- [ ] Optional: require 2-of-N vouches before first payout
- [ ] Limit rewards to users within N hops of group trust graph

## Personal CRC

Keep CRC for **invites / protocol** only. Game UI shows **HIST** as the reward layer.
