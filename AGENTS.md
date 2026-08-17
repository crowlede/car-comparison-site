# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single-product static frontend: a **Vite + React** car-cost comparison site (`package.json` name `car-comparison-site`) deployed to GitHub Pages. Node `>=22.13.0` and npm (see `package-lock.json`).

Entry point and app code:
- Browser entry is `src/main.tsx`, which renders `app/page.tsx` (the whole comparison UI) and imports `app/globals.css`.
- `app/layout.tsx`, `next.config.ts`, `next-env.d.ts`, `eslint.config.mjs`, `db/`, `drizzle*`, `worker/`, `build/`, and `examples/` are leftovers from the `vinext` starter (see `README.md`) and are **not** used by the running Vite app. Ignore the Next.js-oriented `README.md` instructions; the actual toolchain is Vite.

Commands (from `package.json`):
- `npm run dev` — Vite dev server. It serves under a base path, so the app is at `http://localhost:5173/car-comparison-site/` (NOT the bare root, which 404s). Base path is set by `base: "/car-comparison-site/"` in `vite.config.ts`, and image `src` paths in `app/page.tsx` are hardcoded with that prefix.
- `npm run build` — Vite production build into `dist/`.
- `npm test` — runs `npm run build` first, then `node --test tests/pages.test.mjs`. The test reads the built `dist/index.html` and the `app/page.tsx` source, so it will fail if the build hasn't produced `dist/` — always let `npm test` do its own build rather than running the node test directly.

Lint: there is **no** lint step. There is no `lint` script and `eslint` is not installed; `eslint.config.mjs` references Next.js eslint plugins that are not in `package.json`. Do not assume a working `eslint` — running it would fail on missing plugins. CI (`.github/workflows/pages.yml`) runs only `npm ci` + `npm test`, then deploys `dist/` to Pages.
