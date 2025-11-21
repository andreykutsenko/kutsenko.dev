# Homepage Worker

Cloudflare Worker that refreshes `/api/homepage` content hourly and serves cached data (Hacker News, GitHub, r/LocalLLaMA, LessWrong).  
It also exposes `/api/translate` for translating dashboard content.

## Setup

1. Install dependencies used by Wrangler (already bundled with the repo).  
2. Authenticate with Cloudflare via `npx wrangler login`.

### Required secrets

Store your GitHub token so the worker can query the GitHub Search API:

```bash
npx wrangler secret put GITHUB_TOKEN
```

Optional: override the translation backend (defaults to `https://translate.argosopentech.com/translate`):

```bash
npx wrangler secret put TRANSLATE_API_URL
```

### KV namespace

Create the KV namespace and copy the returned ID into `wrangler.toml`:

```bash
npx wrangler kv:namespace create HOMEPAGE_CACHE
```

### Deploy

```bash
npx wrangler deploy
```

Then, in the Cloudflare dashboard, connect the Worker to the `/api/homepage*` and `/api/translate*` routes of `kutsenko.dev`.

