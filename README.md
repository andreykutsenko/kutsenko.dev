# kutsenko.dev

Minimalist personal site with terminal aesthetic.

## 🎨 Design

- **Style:** Terminal-inspired (dark background + cyan accents)
- **Font:** CaskaydiaCove NF, Cascadia Code, Consolas
- **Color scheme:** `#0a0e12` background, `#64ffda` accent
- **Features:** Blinking cursor, clean typography, mobile-responsive

## 🚀 Run Locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## 🧭 Homepage Dashboard

- `homepage.html` — three-column dashboard (Hacker News, GitHub, image feed).
- `/api/homepage` — Cloudflare Worker endpoint that refreshes hourly via KV cache (`backend/homepage-worker/`).

## 📝 Structure

```
Work       → SimpleProcess.io description
Contact    → email, LinkedIn, Telegram
Footer     → Personal branding
```

## ⚙️ Customize

Edit CSS variables in `styles.css`:

```css
:root {
  --bg: #0a0e12;      /* background */
  --fg: #c9d1d9;      /* text */
  --accent: #64ffda;  /* links & cursor */
}
```

## Deployment

- Static site: deployed from `main` via Cloudflare Pages (no build step).
- Worker: deploy with `backend/homepage-worker/wrangler.toml`, Cloudflare KV, and `npx wrangler deploy`.

---

Made with ❤️ and minimalism
