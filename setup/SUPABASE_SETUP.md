# Supabase Local Development Setup

## Local ports (this project)

Defined in `supabase/config.toml` and `lib/local-supabase.ts` — **not** the Supabase defaults:

| Service | Port | URL |
|---------|------|-----|
| API (REST) | 54621 | http://127.0.0.1:54621 |
| Database | 54622 | `postgresql://postgres:postgres@127.0.0.1:54622/postgres` |
| Studio | 54623 | http://127.0.0.1:54623 |
| Inbucket (email) | 54624 | http://127.0.0.1:54624 |
| Pooler | 54629 | (disabled by default) |
| Analytics | 54627 | (internal) |

## Environment Variables

Create `.env.local` (or run `pnpm supabase:env-sync` after start):

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54621
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

Or copy from the CLI: `npx supabase status -o env`

## Database Schema

### Products Table
- `id`, `name`, `price`, `category`, `image_url`, `description`

### Orders Table
- `id`, `created_at`, `registered_by`, `shift_id`

### Order Items Table
- `id`, `order_id`, `product_id`, `quantity`

### Operators & Shifts
- PIN-based staff login; see migration `20250801030130_add_operators_and_shifts.sql`

## Commands

```bash
pnpm supabase:start      # Start local stack
pnpm supabase:reset      # Migrations + seed
pnpm supabase:stop
pnpm supabase:env-sync   # Write .env.local from `supabase status`
pnpm supabase:types      # Regenerate lib/database.types.ts
```

### Supabase Studio

Open **http://127.0.0.1:54623** to manage the database in the browser.

## Seed Data

- Products (bebidas + comida) in `supabase/seed.sql`
- Sample orders
- Operators seeded in migration (PIN `1234` / `5678` for demo)

## TypeScript Integration

- **`lib/database.types.ts`**: Auto-generated types
- **`lib/supabase.ts`**: Client (defaults from `lib/local-supabase.ts`)
- **`lib/local-supabase.ts`**: Single source of truth for local ports/URLs
