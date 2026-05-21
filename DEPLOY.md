# Deploy History Guessr on gnosis.box (Coolify)

Target URL example: **https://history-guessr.thp.gnosis.box**

Circles playground test:

```
https://circles.gnosis.io/playground?url=https://history-guessr.thp.gnosis.box/
```

Garage submission: use the same HTTPS URL + this GitHub repo.

---

## 1. GitHub — org [gnosis-box](https://github.com/orgs/gnosis-box/)

You are org owner for now. Suggested layout:

| Item | Suggestion |
|------|------------|
| Team | `thp` (or your name) — shows provenance THP / Intuition |
| Repo | `gnosis-box/history-guessr` |
| Visibility | Public (Garage judges need the repo) |

### Create repo (web UI)

1. https://github.com/organizations/gnosis-box/settings/profile — confirm org access  
2. **Teams** → New team → `thp` → add yourself  
3. **New repository** → name `history-guessr` → Public → no template  
4. Team `thp` → Repository access → `history-guessr` → **Admin** (until Zet scopes per-team perms)

### Push from this machine

```bash
cd /path/to/OpenCircles   # or your local clone

git init
git add .
git commit -m "History Guessr — playable MVP with Circles SDK"

git branch -M main
git remote add origin git@github.com:gnosis-box/history-guessr.git
git push -u origin main
```

If the repo already exists with a README, use:

```bash
git pull origin main --rebase
git push -u origin main
```

---

## 2. Coolify — invite & project

1. Open the **Coolify invite link** Zet sent in chat (one-time; do not commit that URL).  
2. Sign in / link account → you should see the shared Gnosis b0x server.  
3. **+ New Resource** → **Application** → **Public Git Repository** (or GitHub App if connected).  
4. Repository: `gnosis-box/history-guessr`  
5. Branch: `main`

### Build settings (Dockerfile — recommended)

| Setting | Value |
|---------|--------|
| Build pack | **Dockerfile** |
| Dockerfile | `./Dockerfile` |
| Port | `80` |
| Health check | `/` (optional) |

Coolify will run `docker build` → nginx serves `dist/`.

### Build settings (Nixpacks / static — alternative)

| Setting | Value |
|---------|--------|
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Install command | `npm ci` |

Add the same CSP for iframe if the static preset allows custom headers; otherwise prefer **Dockerfile**.

---

## 3. Domain `history-guessr.thp.gnosis.box`

In the Coolify application:

1. **Domains** → add `history-guessr.thp.gnosis.box`  
2. Enable HTTPS (Let’s Encrypt on the Coolify proxy).  
3. Deploy → wait for green **Running**.

Verify:

```bash
curl -I https://history-guessr.thp.gnosis.box/
```

---

## 4. Circles miniapp check

1. Open https://circles.gnosis.io/playground?url=https://history-guessr.thp.gnosis.box/  
2. Header should show **Circles connected** + wallet when the host injects your Safe.  
3. Play **Place Guess** and **Friend Challenge**.

Optional: PR to [aboutcircles/CirclesMiniapps](https://github.com/aboutcircles/CirclesMiniapps) `static/miniapps.json` for catalog listing.

---

## 5. Garage (Friday deadline)

1. Profile: https://garage.aboutcircles.com/signup  
2. Register app: https://garage.aboutcircles.com/register  
   - **Live URL:** `https://history-guessr.thp.gnosis.box/`  
   - **Repo:** `https://github.com/gnosis-box/history-guessr`  
   - Short pitch: modular historical challenge platform on Circles (11 modes, trust-ready).

---

## 6. Local Docker test (optional)

```bash
docker build -t history-guessr .
docker run --rm -p 8080:80 history-guessr
# open http://localhost:8080
```

---

## THP / Intuition narrative (for Zet / sub-DAO pitch)

- **THP / Intuition:** builder infra + deployment on `*.thp.gnosis.box`  
- **OpenCircles / Circles:** protocol + Garage hackathon + miniapp SDK  
- **Gnosis:** host (`circles.gnosis.io`), Safe wallet, `gnosis.box` deploy  

History Guessr is one miniapp in a future bundle of THP demos on gnosis.box — same playbook as `zet.thp.gnosis.box`.
