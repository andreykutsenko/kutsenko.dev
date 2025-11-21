# kutsenko.dev

Live dashboard with automation status, LLM news, and dual-theme UI.

## 🎨 Design

- **Modes:** Dark terminal + “Mist” light theme (toggle persists in `localStorage`)
- **Typography:** CaskaydiaCove NF / Cascadia Code stack
- **Accent:** `#64ffda` on dark, `#2f7aff` on light
- **Features:** Responsive grid, EN/RU toggle, cards with live data

## 🚀 Run Locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## 🧭 Homepage Dashboard

- `index.html` — dashboard with Hacker News, GitHub radar, Best LLM News, LessWrong Reader, and status block.
- `about.html` — background, current work, and contact section.
- `/api/homepage` — Cloudflare Worker endpoint that hydrates all feeds (HN, GitHub, r/LocalLLaMA, LessWrong) and caches them in KV.
- `/api/translate` — Worker proxy to translate dynamic text (default https://translate.argosopentech.com/translate; configurable via env).

## 📝 Structure

```
index.html   → dashboard grid + toggles
about.html   → work / stack / contact
styles.css   → shared theme tokens + layout
script.js    → theme/lang toggles, data fetching, translation
backend/     → Cloudflare Worker (scheduler + APIs)
```

## ⚙️ Customize

- Update CSS tokens inside `styles.css` (see `:root` + `[data-theme="light"]`).
- Extend translations by editing the `i18n` object in `script.js`.
- Data sources are fetched hourly via the Worker — adjust queries inside `backend/homepage-worker/index.js`.

## Deployment

- Static site: deployed from `main` via Cloudflare Pages (no build step).
- Worker: deploy with `backend/homepage-worker/wrangler.toml`, Cloudflare KV, and `npx wrangler deploy`. Configure:
  - `HOMEPAGE_CACHE` — KV namespace id.
  - `GITHUB_TOKEN` — classic PAT for GitHub Search API.
  - `TRANSLATE_API_URL` (optional) — override the default Argos Open Translate endpoint.

---

Made with ❤️ and minimalism
