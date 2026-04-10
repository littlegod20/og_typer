# Deploy OG Typer: Railway (API + Postgres) + Vercel (frontend)

This walkthrough assumes one Git repo with `server/` and `client/` at the top level.

## Prerequisites

- GitHub (or GitLab) repo pushed with this code.
- A Railway account ([railway.app](https://railway.app)).
- A Vercel account ([vercel.com](https://vercel.com)).

---

## Part A — Railway: PostgreSQL + API

### 1. Create a project and database

1. In Railway: **New Project** → **Empty Project**.
2. Click **+ New** → **Database** → **PostgreSQL**.
3. Wait until Postgres is provisioned. Open the Postgres service → **Variables** and note **`DATABASE_URL`** (Railway sets this automatically; you will reference it on the API service).

### 2. Deploy the Node API

1. In the same project, **+ New** → **GitHub Repo** → select your repo.
2. After the service is created, open it → **Settings**:
   - **Root Directory**: set to `server` (critical).
   - **Build Command** (if not using `server/railway.toml`): `npm ci && npm run build`
   - **Start Command**: `npm run start`
3. **Variables** tab — add:

   | Variable | Value / notes |
   |----------|----------------|
   | `DATABASE_URL` | Click **Reference** → choose the Postgres service → `DATABASE_URL` (same value the DB exposes). |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | Long random string (generate e.g. `openssl rand -hex 32`). |
   | `CORS_ORIGIN` | Your Vercel URL, e.g. `https://your-app.vercel.app` (no trailing slash). After you have a custom domain, use `https://yourdomain.com`. |
   | `PORT` | Usually **omit** — Railway sets `PORT`; the app already reads it. |
   | `SEED_DATA` | Optional: set to `true` **once** for first boot if you want demo courses/lessons/badges seeded; then remove or set to `false` so you do not re-seed on every deploy. |

   Copy any other secrets you use locally from [`server/.env.example`](../server/.env.example) (e.g. `GOOGLE_CLIENT_ID` if you use Google login).

4. **Deploy**. Watch **Deployments** logs until the build succeeds.
5. **Settings** → **Networking** → **Generate Domain** (or add a custom domain). Your API base URL will be like `https://og-typer-api.up.railway.app`.

### 3. Smoke-test the API

- Open `https://<your-railway-domain>/api/health` — expect JSON `status: success`.
- If health fails, check logs: DB connection, missing `JWT_SECRET`, or wrong root directory (`server`).

---

## Part B — Vercel: React frontend

### 1. Import the project

1. Vercel → **Add New** → **Project** → import the **same** Git repository.

### 2. Configure the app

1. **Root Directory**: set to `client` (critical).
2. **Framework Preset**: Vite (auto-detected).
3. **Build Command**: `npm run build` (default).
4. **Output Directory**: `dist` (default for Vite).

### 3. Environment variable (build time)

Add:

| Name | Value |
|------|--------|
| `VITE_API_BASE` | Your Railway public API URL **with no path suffix**, e.g. `https://og-typer-api.up.railway.app` |

The client prefixes `/api` and `/auth` itself; do **not** append `/api` here.

### 4. Deploy

Deploy, then open the Vercel URL. Register/login and complete a lesson to confirm CORS and JWT.

### 5. Align CORS with Vercel

If the site works on `https://xxx.vercel.app` but you add a **custom domain**, update Railway `CORS_ORIGIN` to that exact origin (scheme + host, no path).

---

## Part C — Order of operations (recommended)

1. Deploy **Railway API** + Postgres and confirm `/api/health`.
2. Copy the **public API URL**.
3. Create **Vercel** project with `VITE_API_BASE` pointing at that URL.
4. Set **`CORS_ORIGIN`** on Railway to your Vercel production URL.

---

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| API build fails | Root directory must be `server`; run `npm run build` locally in `server/` to see errors. |
| API starts then crashes on DB | Check `DATABASE_URL` is referenced from the Postgres service; region / private networking issues are rare on Railway’s default setup. |
| Browser: CORS errors | `CORS_ORIGIN` must match the **exact** frontend origin (including `https`). |
| Frontend calls wrong host | Rebuild Vercel after changing `VITE_API_BASE` (it is baked in at build time). |
| 401 on `/api/me/*` | Token storage / login; confirm same API URL as where you logged in. |
| No entities / TypeORM errors in production | `NODE_ENV=production` and compiled `dist/` entity globs are configured in code; ensure you deploy **built** output (`npm run build` on Railway). |

---

## Optional hardening (later)

- Set TypeORM `synchronize: false` and use migrations for production schema control.
- Remove or protect public `GET /api/user_setting` routes if you do not need them.
- Use Railway **cron** or one-off `SEED_DATA=true` instead of leaving seeding on permanently.
