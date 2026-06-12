# kutsenko.dev

Personal site of Andrey Kutsenko. Two faces, one deploy:

- **`/`** — one-page profile. A single self-contained HTML file
  (`frontend/public/index.html`): system fonts, dark/light via
  `prefers-color-scheme`, zero frameworks, zero analytics. The page ends
  with a working shell prompt — type `help`.
- **`/dashboard/`** — VS Code-flavored feed reader (React + Vite):
  Hacker News, GitHub radar, r/LocalLLaMA, LessWrong, AI signals.
  Data comes from `/api/*` served by a Cloudflare Worker.

## Structure

```
frontend/
  public/            → copied as-is to the build root
    index.html       → the one-pager (edit content here)
    404.html         → terminal-style 404
    _headers         → security headers (Cloudflare Pages)
    _redirects       → SPA fallback for /dashboard/*, legacy route redirects
    llms.txt         → agent-readable profile
  dashboard/
    index.html       → SPA entry (built to /dashboard/)
  src/               → React app (router basename: /dashboard)
backend/homepage-worker/ → Cloudflare Worker: /api/homepage, /api/ai-signals,
                           /api/translate; hourly cron refresh into KV
sites/simpleprocess/     → static mirror of simpleprocess.io (legacy; the real
                           site now lives separately at simpleprocess.io)
legacy/static-dashboard/ → previous static version of the site (retired)
```

## Develop

```bash
npm run dev        # vite dev server → http://localhost:3000/dashboard/
                   # the one-pager is served at http://localhost:3000/
npm run build      # builds everything into frontend/dist
npm run preview    # serve the production build locally
```

## Deploy

- **Cloudflare Pages**: build command `npm run build`, output directory
  `frontend/dist`. Everything (one-pager, dashboard, headers, redirects)
  ships in one artifact.
- **Worker**: `cd backend/homepage-worker && npx wrangler deploy`.
  Bindings: `HOMEPAGE_CACHE` (KV), optional `GITHUB_TOKEN`,
  `TRANSLATE_API_URL`.

---

Made of HTML, with ❤️
