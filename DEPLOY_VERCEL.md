# Deploy History Guessr on Vercel

Recommended for a quick HTTPS URL and Circles playground testing.

## 1. Prerequisites

- GitHub repo pushed (e.g. `ThibaultL24/HistoryGuessr` or `gnosis-box/history-guessr`)
- [Vercel account](https://vercel.com) linked to GitHub

## 2. Import project

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. Select your **History Guessr** repo
3. Vercel detects **Vite** automatically (`vercel.json` is already in the repo)

| Setting | Value |
|---------|--------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

4. **Deploy** (no env vars required for a first test)

Your app will be live at something like:

`https://history-guessr-xxx.vercel.app`

## 3. HIST group + demo trust (Garage)

### A — Register HIST on-chain (once)

On your machine with a Gnosis wallet (CRC for gas):

```bash
OPERATOR_PRIVATE_KEY=0xYOUR_KEY npm run hist:register-group
```

Copy the printed `VITE_HIST_GROUP_ADDRESS=0x…` into Vercel env vars, then **Redeploy**.

### B — Relax trust for demos (optional)

While testing without Gnosis Group trust paths:

```
VITE_DEV_RELAX_TRUST=true
```

Redeploy. HIST shows as **earned** in-session; **Claim** still needs `VITE_HIST_GROUP_ADDRESS`.

Remove `VITE_DEV_RELAX_TRUST` before production.

---

## 4. Environment variables (optional)

In **Project → Settings → Environment Variables**:

| Name | Example | When |
|------|---------|------|
| `VITE_HIST_GROUP_ADDRESS` | `0x…` | On-chain HIST group deployed |
| `VITE_APP_URL` | `https://history-guessr.vercel.app` | Custom domain only — usually **omit** (app uses `window.location.origin`) |

Redeploy after adding variables (**Deployments → … → Redeploy**).

## 5. Custom domain (optional)

**Project → Settings → Domains** → add e.g. `history-guessr.yourdomain.com` → follow DNS instructions.

If you set a custom domain, add:

```
VITE_APP_URL=https://history-guessr.yourdomain.com
```

## 6. Test in Circles playground

Replace `<your-url>` with your Vercel URL (trailing slash optional):

```
https://circles.gnosis.io/playground?url=https://<your-vercel-url>/
```

Or use the **Circles Playground** button on the home page (link is built from the current deployment URL).

Expected: wallet / profile in the header when the host injects your Safe.

## 7. Garage / Circles catalog

- **Live URL:** your Vercel HTTPS URL  
- **Repo:** your GitHub URL  
- Same pitch as in [DEPLOY.md](./DEPLOY.md) § Garage

Optional PR: [aboutcircles/CirclesMiniapps](https://github.com/aboutcircles/CirclesMiniapps) `static/miniapps.json`.

## 8. CLI (alternative)

```bash
npm i -g vercel
vercel login
vercel link    # in repo root
vercel --prod
```

## Notes

- **SPA routing:** `vercel.json` rewrites all routes to `index.html`.
- **Circles iframe:** CSP `frame-ancestors` allows `*.gnosis.io` and `*.vercel.app`.
- **Coolify / gnosis.box:** still documented in [DEPLOY.md](./DEPLOY.md) if you need `*.thp.gnosis.box` later.
