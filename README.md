# Pulse ⚡

Nightlife discovery and social analytics for NYC — a React PWA that feels like a native app.
Deep blacks, electric blues, cyan accents. Spotify × Strava × a NYC nightclub.

## Quick start

```bash
npm install
npm run dev
```

The app runs fully in **demo mode** out of the box — seed venues, friends, check-ins, and a
stylized map — no backend or API keys required.

## Optional integrations

Copy `.env.example` to `.env` and fill in:

| Variable | Effect |
| --- | --- |
| `VITE_MAPBOX_TOKEN` | Real Mapbox GL dark map with live heatmap layer on the Tonight tab |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Live Supabase backend: auth, check-ins, ratings, realtime map updates |

### Supabase setup

Run the migrations in `supabase/migrations/` in order (SQL editor or `supabase db push`):

1. `0001_schema.sql` — tables (users, friendships, venues, checkins, ratings, user_badges, groups)
2. `0002_rls.sql` — Row Level Security for friend-graph privacy
3. `0003_seed_venues.sql` — 15 real NYC venues

## Stack

React 18 · Vite · TypeScript (strict) · Tailwind CSS · Framer Motion · React Router v6 ·
Zustand · TanStack Query · Mapbox GL JS · Recharts · Supabase · vite-plugin-pwa

## Structure

- `src/pages/` — Tonight (live map), Explore (venue feed), Social (leaderboards + badges), Profile (analytics + Wrapped share card), Rate (swipe flow), Onboarding
- `src/components/` — layout shell (phone frame on desktop), map, shared UI
- `src/hooks/` — all data fetching (TanStack Query, optimistic updates)
- `src/store/` — Zustand stores (auth, map, group night)

## PWA

`npm run build` generates a service worker and manifest. On mobile, "Add to Home Screen"
installs Pulse as a standalone portrait app.
