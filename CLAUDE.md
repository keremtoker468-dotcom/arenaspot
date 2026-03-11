# Arenaspot

Dövüş sporları sporcu keşif platformu. Sporcular profillerini oluşturur, highlight videolarını yükler; antrenörler ve fanlar onları keşfeder.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS 3.4 — utility-first, no CSS modules
- **Database & Auth**: Supabase (PostgreSQL + Auth + Realtime)
- **Video**: Cloudflare Stream (upload + playback)
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page + SPA shell (client component)
│   ├── layout.tsx        # Root layout (fonts via Google CDN)
│   ├── auth/             # Auth page + /auth/callback OAuth handler
│   ├── athlete/[username]/ # Server-rendered public athlete profile
│   ├── dashboard/        # Protected profile editing
│   ├── messages/         # Protected inbox
│   └── api/videos/upload/ # Cloudflare Stream upload endpoint
├── components/           # All React components (client-side)
├── lib/
│   ├── supabase/         # client.ts, server.ts, middleware.ts
│   └── types/database.ts # DB types + enums (UserRole, ConversationType)
└── middleware.ts         # Session refresh + route protection
supabase/
└── migrations/           # SQL migrations (single file: 00001_initial_schema.sql)
```

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint check
```

## Database

5 tables with RLS enabled: `profiles`, `videos`, `follows`, `conversations`, `messages`.

- `profiles.role` enum: `athlete | fan | gym | pt`
- `conversations.type` enum: `sparring | job_offer | general`
- Realtime enabled on `messages` table
- Migrations in `supabase/migrations/`

## Design System

- **Fonts**: Barlow Condensed (headings, UI) + Barlow (body text) — loaded via Google Fonts CDN in layout.tsx
- **Primary color**: `#e63946` (accent red)
- **Tailwind tokens**: `accent`, `accent-dark`, `accent-light`, `accent-border`, `muted`, `faint`, `surface`, `border`, `foreground`
- **Cards**: white bg, `border-border`, `rounded-[12px]`, red top accent on hover
- **Language**: Turkish throughout the UI

## User Roles

| Role | Can discover | Can message | Special |
|------|-------------|-------------|---------|
| athlete | athletes | athletes (sparring) | Upload videos, fight record |
| fan | athletes | no | Follow only |
| gym | athletes + PTs | athletes + PTs (job offers) | PT collaboration tab |
| pt | athletes | athletes | — |

## Architecture Notes

- The main page (`/`) is a client-side SPA shell managing role/page state
- Server-rendered routes exist for SEO: `/athlete/[username]`, `/dashboard`, `/messages`
- Supabase clients: `createClient()` from `@/lib/supabase/client` (browser) or `@/lib/supabase/server` (server components/API routes)
- Middleware protects `/dashboard` and `/messages` routes
- All data comes from Supabase — no hardcoded profile data in components

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_STREAM_API_TOKEN
NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE
NEXT_PUBLIC_APP_URL
```

See `.env.example` for reference.
