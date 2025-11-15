# Homepage Worker

Cloudflare Worker that refreshes `/api/homepage` content hourly and serves cached data to the static site.

## Setup

1. Install dependencies used by Wrangler (already bundled with the repo).  
2. Authenticate with Cloudflare via `npx wrangler login`.

### Required secrets

Store your GitHub token so the worker can query the GitHub Search API:

```bash
npx wrangler secret put GITHUB_TOKEN
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

Then, in the Cloudflare dashboard, connect the Worker to the `/api/homepage` route of `kutsenko.dev`.

