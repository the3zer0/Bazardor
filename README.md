<div align="center">

<img src="./public/logo-icon.png" alt="BazarDor logo" width="80"/>

# বাজার দর · BazarDor

**Bangladesh's everyday market prices, presented in a clear Bengali-first dashboard.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-222222)](https://www.better-auth.com/)

**[🌐 Live Demo](https://bazardor-azure.vercel.app) · [💻 Source Code](https://github.com/the3zer0/Bazardor)**

</div>

---

## Overview

**BazarDor (বাজার দর)** is a responsive Bengali market-price explorer. It brings everyday grocery and commodity prices into one interface so visitors can compare products, see price movements, and explore market-level details. Prices are retrieved from an external market API instead of being fabricated or hardcoded.

<img src="./public/bazar-hero.png" alt="BazarDor hero artwork" width="100%"/>

> The image above is the project's existing hero artwork, **not** a captured application screenshot.

## Key features

- **Bengali-first experience** — Bengali product labels, units, prices, percentages, and numerals.
- **Price movement dashboard** — highlights the six largest price increases and decreases.
- **Live price ticker** — continuous scrolling product-price highlights.
- **Category browsing and sorting** — numeric low-to-high and high-to-low price sorting.
- **Protected product details** — minimum, maximum, average, and bazaar-level prices.
- **Accounts and profiles** — email/password authentication via Better Auth; optional Google and GitHub OAuth when configured.
- **Responsive interface** — mobile-friendly cards, loading and empty states, API errors, invalid routes, and authentication redirects.
- **Trustworthy data handling** — unavailable API data is shown as an error rather than replaced with fake market records.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| UI | Tailwind CSS 4, scoped CSS design tokens |
| Authentication | Better Auth 1.7 |
| Persistence | Drizzle ORM, SQLite/libSQL; Turso supported for deployment |
| Notifications | React Hot Toast |
| Product data | External BazarDor API |
| Quality tools | ESLint and TypeScript |

### Main dependencies

Runtime dependencies, as recorded in `package.json`: `next`, `react`, `react-dom`, `better-auth`, `drizzle-orm`, `@libsql/client`, and `react-hot-toast`.

Development tooling: `typescript`, `tailwindcss`, `@tailwindcss/turbopack`, `eslint`, `eslint-config-next`, and React/Node type packages.

## Run locally

**Prerequisites:** Node.js and npm, plus a working internet connection for the market data API.

```bash
git clone https://github.com/the3zer0/Bazardor.git
cd Bazardor
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp` if needed. Open **http://localhost:3000**.

### Configure environment variables

Review and edit `.env.local` before starting:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_PATH=auth.db
BAZARDOR_API_URL=https://api.api-store.workers.dev/api/bazardor

# Optional persistent database for cloud deployment
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# Optional OAuth providers; leave empty until configured
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

- **Local database:** SQLite is stored in `auth.db` by default; the file is Git-ignored.
- **Cloud database:** Configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` for persistent Turso storage on Vercel.
- **OAuth callback URLs:**
  - Google: `http://localhost:3000/api/auth/callback/google`
  - GitHub: `http://localhost:3000/api/auth/callback/github`
- In production, set `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` to valid production values and configure provider callbacks for your deployed domain.
- Never commit `.env.local` or real OAuth secrets. Email verification and password-reset flows are not enabled in this project.

Without OAuth credentials, social sign-in is not available; email/password registration is supported locally.

## Data source

The configured default endpoint is:

```text
https://api.api-store.workers.dev/api/bazardor
```

Set `BAZARDOR_API_URL` to a compatible endpoint if the upstream service changes. The UI consumes current/previous prices, price change percentages, and market minimum/maximum records. A per-market change indicator depends on an optional previous value for that specific market.

Because the data comes from a third-party API, availability and values may change independently of this repository.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without writing output |
| `npm run build` | Create a production build |
| `npm run start` | Serve a built app |

## Project structure

```text
app/                 Next.js routes and pages
components/          UI components
lib/                 Data, authentication, and database logic
public/              Logo and hero artwork
proxy.ts             Request proxy / routing logic
.env.example         Safe environment-variable template
README.assignment.md Additional assignment documentation
package.json         Commands and dependencies
```

## Deployment

Deploy on a Next.js-compatible host such as Vercel. Add `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and database environment variables in the hosting dashboard. Use a **persistent cloud database** such as Turso in production; a temporary serverless filesystem is not suitable for storing user accounts long term. Update the OAuth callback URLs to your production domain.

**Live site:** https://bazardor-azure.vercel.app

## Design resources

This repository includes the original design reference files:

- `Bazardor _ Assignment-07.fig`
- `Bazardor -Assignment-07.penpot`

## Author

Created by [Md Rahat Mahmud](https://github.com/the3zer0).

[Explore the live app →](https://bazardor-azure.vercel.app)
