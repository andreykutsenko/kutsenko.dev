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

## 📦 Deploy

Ready for Cloudflare Pages, Vercel, or GitHub Pages — no build step required.

Just push and deploy:
- `index.html` — main page
- `styles.css` — terminal theme
- `script.js` — minimal JS (console log)

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

---

Made with ❤️ and minimalism
