# OG Typer

A full-stack typing tutor: browse courses and lessons, practice on passages, and (when logged in) save sessions, stats, and badges.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | [Vite](https://vitejs.dev/), [React](https://react.dev/) 19, [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) v4, [React Router](https://reactrouter.com/) |
| Backend  | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) 5, [TypeORM](https://typeorm.io/), [PostgreSQL](https://www.postgresql.org/), [Passport](http://www.passportjs.org/) (JWT + local auth) |

## Repository layout

```
og_typer/
├── client/          # Vite SPA (courses, lessons, typing, profile)
├── server/          # Express API + TypeORM entities
└── docs/            # Extra guides (e.g. deployment)
```

## Prerequisites

- **Node.js** 20+ recommended
- **PostgreSQL** running locally (or a hosted `DATABASE_URL`)

## Quick start (local)

### 1. Database and server

```bash
cd server
cp .env.example .env
# Edit .env: DB_* or DATABASE_URL, JWT_SECRET, etc.
npm install
npm run dev
```

The API listens on **port 3000** by default (`PORT` in `.env`).

### 2. Client

In another terminal:

```bash
cd client
cp .env.example .env
# Leave VITE_API_BASE empty for local dev (Vite proxies /api and /auth to :3000)
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**).

### Production build (local)

```bash
cd server && npm run build && npm run start
cd client && npm run build   # output in client/dist
```

## Environment variables

| Location | File | Purpose |
|----------|------|---------|
| Server | [`server/.env.example`](server/.env.example) | Database, JWT, CORS, rate limits, optional Google OAuth |
| Client | [`client/.env.example`](client/.env.example) | `VITE_API_BASE` for production (must be a full URL, e.g. `https://api.example.com`) |

In development, the client uses an empty `VITE_API_BASE` and the Vite dev server proxies `/api` and `/auth` to the backend.

## API overview

- **REST** under `/api` and `/api/health` — courses, lessons, text samples, badges catalog, etc.
- **Auth** under `/auth` — `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` (JWT required).
- **Current user** (JWT required) under `/api/me` — profile, settings, stats, earned badges, typing sessions.

## Deployment

Step-by-step **Railway (API + Postgres) + Vercel (frontend)** is documented in:

[`docs/deploy-railway-vercel.md`](docs/deploy-railway-vercel.md)

Important for the hosted frontend: set **`VITE_API_BASE`** to your API origin **including** `https://` (no path segment). Set **`CORS_ORIGIN`** on the API to your Vercel site URL.

## Scripts

**Server** (`server/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Run with `ts-node` + nodemon |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run `node dist/index.js` |

**Client** (`client/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build locally |

## License

ISC (`server/package.json`).
