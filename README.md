# বাজার দর (BazarDor)

বাজার দর is a Bengali market-price dashboard for checking everyday product prices in one calm, readable place. It uses the supplied market API and keeps the UI focused on quick comparison across categories and bazaars.

## Features

- Bengali product names, units, prices, percentages, and numerals.
- Home sections for the six biggest price increases and decreases.
- Responsive product cards with a continuously scrolling price ticker.
- Category pages with numeric low-to-high and high-to-low sorting.
- Protected product details with minimum, maximum, average, and market-level prices.
- Better Auth email/password accounts, Google/GitHub sign-in when provider credentials are configured, and profile updates.
- Loading, API error, empty, invalid-route, and protected-route states.

## Technology

- Next.js 16 App Router with TypeScript
- Tailwind CSS 4 and scoped CSS design tokens
- Better Auth 1.7 with Drizzle and local SQLite
- React Hot Toast
- API: `https://api.api-store.workers.dev/api/bazardor`

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The local Better Auth database is stored in `auth.db`, which is ignored by Git. Set `BETTER_AUTH_SECRET` to a long random value. Change the API with `BAZARDOR_API_URL`; the alternative is `https://api.abcz.workers.dev/api/bazardor`.

## Authentication configuration

Email/password auth works with the local SQLite database. Google and GitHub sign-in require the matching client ID and secret in `.env.local`. Their OAuth app callback URLs for local development are:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Create the provider apps in these consoles:

1. In [Google Cloud Console](https://console.cloud.google.com/), open **APIs & Services > Credentials**, create an **OAuth client ID** for a **Web application**, and add the Google callback URL below under **Authorized redirect URIs**.
2. In GitHub, open **Settings > Developer settings > OAuth Apps > New OAuth App**, set the homepage to `http://localhost:3000`, and add the GitHub callback URL below as the **Authorization callback URL**. The app must request the `user:email` scope so private email addresses can be used for sign-in.

Register these exact local callback URLs:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Copy the resulting client IDs and secrets into your local `.env.local`; never commit them. The `.env.example` values are safe placeholders only. Without provider credentials, selecting a provider shows a configuration message.

```env
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_PATH=auth.db
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Social OAuth callback URLs should point to `/api/auth/callback/google` and `/api/auth/callback/github`. Email verification and password reset are intentionally not enabled for this assignment.

## API assumptions

The API returns numeric `today`, `yesterday`, `change.pct`, and market `min`/`max` values. Product details use the confirmed `markets` array rather than inventing bazaar data. If a market record includes an optional `previous` value, its current midpoint is compared with that same-market record; without it, the market change indicator remains neutral. If the API is unavailable, the UI shows an explicit error instead of substituting fabricated products.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The design references remain in the project root as `Bazardor _ Assignment-07.fig` and `Bazardor -Assignment-07.penpot`. Supplied imagery is available from `public/bazar-hero.png` and `public/logo-icon.png`.
