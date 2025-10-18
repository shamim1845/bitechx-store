# Product Management App — BitechX Assignment

Tech stack

- Next.js (App Router)
- React
- Redux Toolkit + RTK Query
- Tailwind CSS v4

Color palette

- From Coolors: https://coolors.co/0d1821-eff1f3-4e6e5d-ad8a64-a44a3f

Getting started

1. Install deps

```bash
pnpm i
```

2. Run dev server

```bash
pnpm dev
```

3. Build

```bash
pnpm build && pnpm start
```

Environment

- No env vars required. API base: https://api.bitechx.com

Features

- Login via /auth and JWT stored in Redux (persisted to localStorage)
- Products list with pagination (offset/limit) and client-side search
- Product details with Edit/Delete
- Create and Edit forms with validations: required, price > 0, at least one image URL, valid category
- Categories fetched for select
- Delete confirmation modal
- Consistent UI with Coolors palette
- Basic route guard and logout

Project structure

- `src/app/(auth)/login` — login page
- `src/app/(product)/products` — list, details, create, edit
- `src/services/*` — RTK Query endpoints
- `src/store/*` — Redux store/slices/hooks
- `src/utils/*` — API base and storage helper
- `src/components/Header.tsx` — app header

Deployment

1. Push to GitHub
2. Import repository in Vercel (Next.js)
3. Build command: `pnpm build` — Output: `Next.js` default

Notes

- All API requests send `Authorization: Bearer <token>` and `Content-Type: application/json`.
