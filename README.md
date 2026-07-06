# 🏪 Festa POS — Cash Register

A fast, touch-friendly point-of-sale for village festivals and events. Runs **entirely in the browser with zero setup** (no database, no accounts), and can optionally sync across multiple devices with Supabase.

Originally built in under 8 hours for a multi-day village religious event, and refined since.

**▶ Live demo:** https://cash-register-a85839.gitlab.io/ — log in with the codes shown right on the screen.

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase_(optional)-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com/)

> The interface is in **Portuguese** (built for a Portuguese festa). Key labels: **Caixa** = register, **Pedidos** = orders, **Produtos** = products, **Iniciar/Encerrar Turno** = start/end shift.

---

## 🚀 Quick start (zero setup)

By default the app runs in **local mode** — everything is stored on the device, no backend required.

```bash
pnpm install
pnpm dev
```

Open **http://localhost:3000** and log in with a demo account (the codes are shown on the login screen):

| Account | Role | PIN |
|--------|------|-----|
| Carlos R. / Maria S. / João P. | Vendedor (seller) | **1234** |
| Ana L. | Admin | **5678** |

That's it — no `.env`, no database, no Supabase project. Product photos are bundled with the app, so it looks complete out of the box.

> Prefer a production-like run? `pnpm build && npx serve out` serves the static export (this is what's deployed). See [Troubleshooting](#-troubleshooting) if `pnpm dev` complains about file watchers.

---

## 🧭 Using the app

1. **Log in (Iniciar Turno).** Pick your name, tap a demo code chip (or type your PIN), and start your shift.
2. **Caixa (register).** Browse products by category (**Bebidas** / **Comida**) or search. Tap a product to add it to the current order (**Pedido Atual**); use +/− to adjust quantities. Tap **Confirmar Pedido**, enter the amount tendered, and the app shows the change due.
3. **Pedidos (orders).** Full order history plus live stats — total revenue, order count, average ticket, revenue by hour, best-sellers, and a breakdown per seller.
4. **Produtos (admin only).** Create and edit menu items (name, price, category, description, photo). Admins only.
5. **Encerrar Turno.** Ends the shift and shows a summary of what you sold.

On phones/tablets the current order lives in a bottom sheet you can pull up; on desktop it's a panel on the right.

---

## 🔀 Two ways to run it

The mode is chosen at build time by `NEXT_PUBLIC_APP_MODE`:

| | **Local** (default) | **Shared** |
|---|---|---|
| Backend | None | Supabase |
| Setup | Nothing | Supabase project + env vars |
| Data | Stored per-device (localStorage) | Shared across all devices |
| Multi-device | ❌ one device | ✅ many sellers + admin, one dataset |
| Best for | A single till, demos, trying it out | A real event with several devices |

Anything other than `shared` (including unset) means **local**. In local mode the app never touches the network; in shared mode it uses Supabase and automatically falls back to a local copy if the backend is unreachable.

---

## ⚙️ Configuration

Copy `.env.example` to `.env.local` and adjust. All variables are optional in local mode.

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_APP_MODE` | `local` (default) or `shared`. |
| `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS` | Show the demo PIN chips on the login screen. Always on in local mode; set to `true` to also show them in a connected shared deploy. Only ever reveals the public demo PINs — never a real operator's (those are bcrypt-hashed on the server). |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Shared mode only** — your Supabase endpoint + anon key. |

> `NEXT_PUBLIC_*` variables are inlined at **build time**. Set them before `pnpm build` (in CI, as GitLab CI/CD variables, then rebuild).

---

## 🌐 Shared mode (multi-device with Supabase)

Only needed if several devices must share one order pool.

**Local Supabase (for development)** — uses custom ports (see `lib/local-supabase.ts`): API `54621`, DB `54622`, Studio `54623`, Inbucket `54624`.

```bash
pnpm supabase:start        # boot the local stack (Docker)
pnpm supabase:reset        # apply migrations + seed
pnpm supabase:env-sync     # write NEXT_PUBLIC_SUPABASE_* into .env.local
pnpm supabase:types        # regenerate lib/database.types.ts
NEXT_PUBLIC_APP_MODE=shared pnpm dev
```

Studio: http://127.0.0.1:54623 · demo PINs after seeding are the same `1234` / `5678`.

**Hosted Supabase (production):** create a project, run `pnpm supabase:deploy` (links + pushes migrations), then set `NEXT_PUBLIC_APP_MODE=shared` and your hosted `NEXT_PUBLIC_SUPABASE_*` values in the build environment.

### Data model (shared mode)

| Table | Purpose |
|-------|---------|
| `products` | Menu items (`id`, `name`, `price`, `category`, `image_url`, `description`). |
| `orders` | Confirmed orders (`registered_by`, `shift_id`, totals, amount tendered, change). |
| `order_items` | Line items per order (with a price snapshot). |
| `operators` | Staff accounts (`name`, `pin_hash` bcrypt, `role`, `active`). |
| `shifts` | Work sessions (`operator_id`, `started_at`, `ended_at`). |

PIN verification, product upserts, and shift management run server-side via `SECURITY DEFINER` RPCs (`authenticate_operator`, `list_active_operators`, `start_shift`, `end_shift`, `upsert_product`); real PINs never reach the browser.

---

## 🚢 Deployment

The app is a **static export** (`output: "export"` in `next.config.ts`) — `pnpm build` produces an `out/` folder you can host anywhere. The live demo deploys to **GitLab Pages** via CI. Because it's a static export there is no Node server, so `next start` is not used — serve `out/` with any static file server.

---

## 🛠️ Development

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # static production build → out/
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint (zero warnings enforced)
```

**Tech stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (animations) · Recharts (analytics) · Supabase (optional).

**Product images:** the bundled photos live in `public/products/<id>.webp`. To regenerate them, put source renders in `generated-images/` (via `pnpm photos:generate`) and run `node scripts/optimize-product-images.mjs` to produce optimized 512² webp (~20 KB each). Source renders stay gitignored; the optimized set is committed.

**Further reading:** [`setup/SUPABASE_SETUP.md`](setup/SUPABASE_SETUP.md) (shared-mode backend) · [`setup/THEMING.md`](setup/THEMING.md) (design tokens & theming).

---

## 🧯 Troubleshooting

**`pnpm dev` fails with `EMFILE: too many open files, watch ...`** — your system's inotify watcher limit is exhausted (common on Linux desktops with many apps open). Raise it:

```bash
sudo sysctl fs.inotify.max_user_instances=1024
# persist across reboots:
echo 'fs.inotify.max_user_instances=1024' | sudo tee /etc/sysctl.d/60-inotify.conf && sudo sysctl --system
```

Or avoid the watcher entirely by testing the static build: `pnpm build && npx serve out`.

---

## 🤝 Contributing

Personal portfolio project, but ideas, issues, and merge requests are welcome.

## 📄 License

For personal portfolio purposes. **All rights reserved.**

---

**Contact:** [LinkedIn](https://www.linkedin.com/in/miguel-louren%C3%A7o-395335355/) · [GitLab](https://gitlab.com/miguel-lourenco-main) · [Email](mailto:migasoulou@gmail.com)

**Built with ❤️ by Miguel Lourenço**
