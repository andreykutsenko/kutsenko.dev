const HN_URL = "https://hn.algolia.com/api/v1/search?tags=front_page";
const GH_BASE = "https://api.github.com/search/repositories";
const GH_QUERY = "stars:>20000";
const REDDIT_LLM_URL =
  "https://www.reddit.com/r/LocalLLaMA/top.json?t=week&limit=12";
const LESSWRONG_RSS_URL = "https://www.lesswrong.com/feed.xml?view=rss";
const REDDIT_USER_AGENT = "kutsenko-homepage/1.0 (+https://kutsenko.dev)";

// AI Signals endpoints (live sources, no API keys required)
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const HF_DAILY_PAPERS_URL = "https://huggingface.co/api/daily_papers?limit=12";
const FEATURED_PROVIDERS = [
  "anthropic",
  "openai",
  "google",
  "deepseek",
  "moonshotai",
  "meta-llama",
  "mistralai",
  "x-ai",
  "qwen",
];

async function fetchJson(url, options = {}) {
  const res = await fetch(typeof url === "string" ? url : url.toString(), options);
  if (!res.ok) {
    let snippet = "";
    try {
      snippet = await res.text();
    } catch {
      snippet = "<no body>";
    }
    console.error("Upstream error body:", snippet);
    console.error("Upstream error headers:", Object.fromEntries(res.headers.entries()));
    throw new Error(
      `Request failed: ${url} (${res.status}) ${snippet.slice(0, 200)}`
    );
  }
  return res.json();
}

function mapHackerNewsResponse(data) {
  const hits = Array.isArray(data?.hits) ? data.hits : [];
  return hits.map((item) => ({
    id: item.objectID,
    title: item.title || item.story_title || "Untitled",
    url:
      item.url ||
      item.story_url ||
      `https://news.ycombinator.com/item?id=${item.objectID}`,
    points: item.points || 0,
    author: item.author || "unknown",
    comments: item.num_comments || 0,
    createdAt: item.created_at || null,
  }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/homepage") {
      const forceRefresh = url.searchParams.has("refresh");
      let cached = await env.HOMEPAGE_CACHE.get("homepage_json", {
        type: "json",
      });

      if (forceRefresh || !cached) {
        try {
          cached = await updateCache(env);
        } catch (error) {
          console.error("Failed to refresh cache on-demand:", error);
          cached = {
            updatedAt: new Date().toISOString(),
            hackerNews: [],
            github: [],
            llmNews: [],
            lessWrong: [],
          };
        }
      }

      return new Response(JSON.stringify(cached), {
        headers: { "content-type": "application/json" },
      });
    }

    // AI Signals endpoint
    if (request.method === "GET" && url.pathname === "/api/ai-signals") {
      const forceRefresh = url.searchParams.has("refresh");
      let cached = await env.HOMEPAGE_CACHE.get("ai_signals_json", {
        type: "json",
      });

      if (forceRefresh || !cached) {
        try {
          cached = await updateAISignalsCache(env);
        } catch (error) {
          console.error("Failed to refresh AI signals cache:", error);
          cached = {
            updatedAt: new Date().toISOString(),
            models: [],
            papers: [],
            trending: [],
          };
        }
      }

      return new Response(JSON.stringify(cached), {
        headers: { "content-type": "application/json" },
      });
    }

    // Strava running stats
    if (request.method === "GET" && url.pathname === "/api/strava") {
      const forceRefresh = url.searchParams.has("refresh");
      let cached = await env.HOMEPAGE_CACHE.get("strava_json", {
        type: "json",
      });

      if (forceRefresh || !cached) {
        try {
          cached = await updateStravaCache(env);
        } catch (error) {
          console.error("Failed to refresh Strava cache:", error);
          cached = cached || { updatedAt: null, week: null, recent: [], ytd: null };
        }
      }

      return new Response(JSON.stringify(cached), {
        headers: { "content-type": "application/json" },
      });
    }

    if (url.pathname === "/api/translate" && request.method === "POST") {
      try {
        const body = await request.json();
        const texts = Array.isArray(body?.texts) ? body.texts : [];
        const target = (body?.target || "").toLowerCase();
        if (!texts.length || !target) {
          return new Response(
            JSON.stringify({ error: "texts[] and target are required" }),
            { status: 400, headers: { "content-type": "application/json" } }
          );
        }
        const translations = await translateBatch(texts, target, env);
        return new Response(JSON.stringify({ translations }), {
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        console.error("Translation endpoint failed:", error);
        return new Response(
          JSON.stringify({ error: "Translation failed" }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }
    }

    return new Response("Not Found", { status: 404 });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.all([
      updateCache(env),
      updateAISignalsCache(env),
      updateStravaCache(env).catch((error) =>
        console.error("Scheduled Strava refresh failed:", error)
      ),
    ]));
  },
};

// ===== STRAVA =====

const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_API = "https://www.strava.com/api/v3";
const METERS_PER_MILE = 1609.344;

async function stravaAccessToken(env) {
  // Strava rotates refresh tokens; prefer the latest one persisted in KV
  // over the initial secret so the chain never breaks.
  const stored = await env.HOMEPAGE_CACHE.get("strava_refresh_token").catch(
    () => null
  );
  const refreshToken = stored || env.STRAVA_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("STRAVA_REFRESH_TOKEN is not configured");
  }

  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    throw new Error(`Strava token refresh failed (${res.status})`);
  }
  const data = await res.json();
  if (data.refresh_token && data.refresh_token !== refreshToken) {
    await env.HOMEPAGE_CACHE.put("strava_refresh_token", data.refresh_token);
  }
  return data.access_token;
}

function miles(metersValue) {
  return Math.round((metersValue / METERS_PER_MILE) * 10) / 10;
}

function paceSecPerMile(movingTimeSec, meters) {
  if (!meters) return null;
  return Math.round(movingTimeSec / (meters / METERS_PER_MILE));
}

function weekStartUTC(date) {
  const dt = new Date(date);
  const day = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - day);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
}

export async function updateStravaCache(env) {
  const token = await stravaAccessToken(env);
  const headers = { Authorization: `Bearer ${token}` };

  // `after` makes Strava return oldest-first; 70 days covers 8 full weeks
  const after = Math.floor((Date.now() - 70 * 86400000) / 1000);
  const activities = await fetchJson(
    `${STRAVA_API}/athlete/activities?after=${after}&per_page=100`,
    { headers }
  );
  const runs = (Array.isArray(activities) ? activities : [])
    .filter((a) => a.type === "Run" || a.sport_type === "Run")
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  // Bucket by the athlete's local calendar day; derive the UTC offset from
  // Strava's own start_date vs start_date_local pair so evening runs do not
  // leak into the next UTC day.
  const tzOffsetMs = runs.length
    ? Date.parse(runs[0].start_date_local) - Date.parse(runs[0].start_date)
    : 0;
  const localDayUTC = (r) =>
    Date.parse(
      (r.start_date_local || r.start_date || "").slice(0, 10) + "T00:00:00Z"
    );

  // Calendar week, Monday start, in athlete-local time
  const currentWeek = weekStartUTC(new Date(Date.now() + tzOffsetMs));
  const currentWeekStart = currentWeek.getTime();
  const weekRuns = runs.filter((r) => localDayUTC(r) >= currentWeekStart);
  const weekMeters = weekRuns.reduce((sum, r) => sum + (r.distance || 0), 0);

  const recent = runs.slice(0, 5).map((r) => ({
    name: r.name,
    miles: miles(r.distance || 0),
    movingTimeSec: r.moving_time || 0,
    paceSecPerMile: paceSecPerMile(r.moving_time || 0, r.distance || 0),
    date: (r.start_date_local || r.start_date || "").slice(0, 10),
  }));

  let ytd = null;
  let all = null;
  if (env.STRAVA_ATHLETE_ID) {
    try {
      const stats = await fetchJson(
        `${STRAVA_API}/athletes/${env.STRAVA_ATHLETE_ID}/stats`,
        { headers }
      );
      if (stats?.ytd_run_totals) {
        ytd = {
          miles: miles(stats.ytd_run_totals.distance || 0),
          runs: stats.ytd_run_totals.count || 0,
        };
      }
      if (stats?.all_run_totals) {
        all = {
          miles: miles(stats.all_run_totals.distance || 0),
          runs: stats.all_run_totals.count || 0,
        };
      }
    } catch (error) {
      console.error("Strava stats fetch failed:", error);
    }
  }

  const dayMiles = {};
  for (const r of runs) {
    const day = (r.start_date_local || r.start_date || "").slice(0, 10);
    if (!day) continue;
    dayMiles[day] = (dayMiles[day] || 0) + (r.distance || 0);
  }
  const days = Object.keys(dayMiles)
    .sort()
    .map((date) => ({ date, miles: miles(dayMiles[date]) }));

  const weeks = [];
  for (let i = 7; i >= 0; i--) {
    const start = currentWeekStart - i * 7 * 86400000;
    const end = start + 7 * 86400000;
    const bucket = runs.filter((r) => {
      const t = localDayUTC(r);
      return t >= start && t < end;
    });
    weeks.push({
      start: new Date(start).toISOString().slice(0, 10),
      miles: miles(bucket.reduce((sum, r) => sum + (r.distance || 0), 0)),
      runs: bucket.length,
    });
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    week: { miles: miles(weekMeters), runs: weekRuns.length },
    weeks,
    days,
    recent,
    ytd,
    all,
  };

  await env.HOMEPAGE_CACHE.put("strava_json", JSON.stringify(payload));
  return payload;
}

export async function updateCache(env) {
  try {
    const previous =
      (await env.HOMEPAGE_CACHE.get("homepage_json", { type: "json" }).catch(
        () => null
      )) || null;

    const hackerNews = await fetchJson(HN_URL)
      .then(mapHackerNewsResponse)
      .catch((error) => {
        console.error("Failed to fetch Hacker News:", error);
        return previous?.hackerNews ?? [];
      });

    const github = await fetchGithubSearch(env)
      .catch((error) => {
        console.error("Failed to fetch GitHub repos:", error);
        return previous?.github ?? [];
      });

    let llmNews = await fetchLlmNews();
    if (!llmNews.length && previous?.llmNews?.length) {
      llmNews = previous.llmNews;
    }

    let lessWrong = await fetchLessWrongPosts();
    if (!lessWrong.length && previous?.lessWrong?.length) {
      lessWrong = previous.lessWrong;
    }

    const payload = {
      updatedAt: new Date().toISOString(),
      hackerNews,
      github,
      llmNews,
      lessWrong,
    };

    await env.HOMEPAGE_CACHE.put("homepage_json", JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to update homepage cache:", error);
    throw error;
  }
}

async function fetchGithubSearch(env, limit = 10) {
  const url = `${GH_BASE}?${new URLSearchParams({
    q: GH_QUERY,
    sort: "stars",
    order: "desc",
    per_page: String(limit),
  }).toString()}`;

  const headers = {
    "User-Agent": "kutsenko-homepage-worker",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `token ${env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch (err) {
      detail = `<no body>: ${err}`;
    }
    throw new Error(
      `GitHub search failed (${res.status}) ${detail.slice(0, 160)}`
    );
  }

  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.map((repo) => ({
    id: repo.id,
    name: repo.full_name || repo.name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    language: repo.language,
    updatedAt: repo.updated_at || new Date().toISOString(),
  }));
}

async function fetchLlmNews() {
  try {
    const res = await fetch(REDDIT_LLM_URL, {
      headers: {
        "User-Agent": REDDIT_USER_AGENT,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Reddit request failed (${res.status})`);
    }
    const data = await res.json();
    const children = data?.data?.children ?? [];
    return children
      .map((child) => child?.data)
      .filter(
        (item) =>
          item &&
          !item.stickied &&
          !item.over_18 &&
          item.score > 0 &&
          !(item.link_flair_text || "")
            .toLowerCase()
            .includes("meme")
      )
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url.startsWith("http")
          ? item.url
          : `https://old.reddit.com${item.permalink}`,
        commentsUrl: `https://old.reddit.com${item.permalink}`,
        score: item.score,
        comments: item.num_comments,
        flair: item.link_flair_text || null,
        createdAt: new Date(item.created_utc * 1000).toISOString(),
      }));
  } catch (error) {
    console.error("Failed to fetch LLM news:", error);
    return [];
  }
}

async function fetchLessWrongPosts(limit = 6) {
  try {
    const res = await fetch(LESSWRONG_RSS_URL, {
      headers: {
        "User-Agent": "kutsenko-homepage-worker",
      },
    });
    if (!res.ok) {
      throw new Error(`LessWrong request failed (${res.status})`);
    }
    const xml = await res.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) && items.length < limit) {
      const block = match[1];
      const title = decodeHtml(extractTag(block, "title"));
      const link = decodeHtml(extractTag(block, "link"));
      const description = stripHtml(decodeHtml(extractTag(block, "description")));
      const pubDate = extractTag(block, "pubDate");
      if (title && link) {
        items.push({
          id: link,
          title,
          url: link,
          summary: description,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
        });
      }
    }
    return items;
  } catch (error) {
    console.error("Failed to fetch LessWrong feed:", error);
    return [];
  }
}

// ===== AI SIGNALS FUNCTIONS =====

export async function updateAISignalsCache(env) {
  try {
    const previous =
      (await env.HOMEPAGE_CACHE.get("ai_signals_json", { type: "json" }).catch(
        () => null
      )) || null;

    const models = await fetchOpenRouterModels().catch((error) => {
      console.error("Failed to fetch OpenRouter models:", error);
      return previous?.models ?? [];
    });

    const papers = await fetchDailyPapers().catch((error) => {
      console.error("Failed to fetch HF daily papers:", error);
      return previous?.papers ?? [];
    });

    const trending = await fetchTrendingAIRepos(env).catch((error) => {
      console.error("Failed to fetch trending AI repos:", error);
      return previous?.trending ?? [];
    });

    const payload = {
      updatedAt: new Date().toISOString(),
      models,
      papers,
      trending,
    };

    await env.HOMEPAGE_CACHE.put("ai_signals_json", JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to update AI signals cache:", error);
    throw error;
  }
}

// Live model list + pricing from OpenRouter: newest two models per
// featured provider, prices converted to $ per 1M tokens.
async function fetchOpenRouterModels() {
  const data = await fetchJson(OPENROUTER_MODELS_URL, {
    headers: { "User-Agent": "kutsenko-homepage-worker" },
  });
  const list = Array.isArray(data?.data) ? data.data : [];
  const perM = (value) =>
    Math.round(parseFloat(value || "0") * 1e6 * 100) / 100;

  const byProvider = new Map();
  for (const m of list) {
    const id = m.id || "";
    if (id.startsWith("~") || id.includes(":")) continue;
    const provider = id.split("/")[0];
    if (!FEATURED_PROVIDERS.includes(provider)) continue;
    const inputPerM = perM(m.pricing?.prompt);
    const outputPerM = perM(m.pricing?.completion);
    if (!inputPerM && !outputPerM) continue;
    const bucket = byProvider.get(provider) || [];
    bucket.push({
      id,
      name: m.name || id,
      provider,
      context: m.context_length || 0,
      inputPerM,
      outputPerM,
      created: m.created || 0,
    });
    byProvider.set(provider, bucket);
  }

  const models = [];
  for (const bucket of byProvider.values()) {
    bucket.sort((a, b) => (b.created || 0) - (a.created || 0));
    models.push(...bucket.slice(0, 2));
  }
  models.sort((a, b) => (b.created || 0) - (a.created || 0));
  return models.slice(0, 14).map(({ created, ...rest }) => ({
    ...rest,
    addedAt: created ? new Date(created * 1000).toISOString().slice(0, 10) : null,
  }));
}

// Trending papers with community upvotes from HuggingFace Daily Papers
async function fetchDailyPapers() {
  const data = await fetchJson(HF_DAILY_PAPERS_URL, {
    headers: { "User-Agent": "kutsenko-homepage-worker" },
  });
  const items = Array.isArray(data) ? data : [];
  return items.slice(0, 8).map((item) => {
    const paper = item.paper || {};
    return {
      title: paper.title || "Untitled",
      upvotes: paper.upvotes || 0,
      authors: (paper.authors || [])
        .slice(0, 3)
        .map((a) => a?.name)
        .filter(Boolean)
        .join(", "),
      url: paper.id
        ? `https://arxiv.org/abs/${paper.id}`
        : "https://huggingface.co/papers",
      publishedAt: (item.publishedAt || "").slice(0, 10),
      summary: (paper.summary || "").replace(/\s+/g, " ").slice(0, 180),
    };
  });
}

// Fresh AI/LLM repos from the last 30 days, by stars (GitHub search)
async function fetchTrendingAIRepos(env) {
  const since = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .slice(0, 10);
  const url = `${GH_BASE}?${new URLSearchParams({
    q: `topic:llm created:>${since}`,
    sort: "stars",
    order: "desc",
    per_page: "8",
  }).toString()}`;

  const headers = {
    "User-Agent": "kutsenko-homepage-worker",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_TOKEN) {
    headers.Authorization = `token ${env.GITHUB_TOKEN}`;
  }

  const data = await fetchJson(url, { headers });
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.map((repo) => ({
    name: repo.full_name || repo.name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count || 0,
    language: repo.language,
    createdAt: repo.created_at || null,
  }));
}

async function translateBatch(texts, target, env) {
  if (!texts.some(Boolean) || target === "en") {
    return texts;
  }

  if (env.TRANSLATE_API_URL) {
    return translateViaCustom(texts, target, env.TRANSLATE_API_URL);
  }

  return Promise.all(
    texts.map((text) =>
      text ? translateWithGoogle(text, target).catch(() => text) : ""
    )
  );
}

async function translateViaCustom(texts, target, url) {
  const results = [];
  for (const text of texts) {
    if (!text) {
      results.push("");
      continue;
    }
    const body = new URLSearchParams({
      q: text,
      source: "auto",
      target,
      format: "text",
    });
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      if (!res.ok) {
        throw new Error(`Translate request failed (${res.status})`);
      }
      const data = await res.json();
      results.push(data?.translatedText || text);
    } catch (error) {
      console.error("Translation request failed:", error);
      results.push(text);
    }
  }
  return results;
}

async function translateWithGoogle(text, target) {
  const endpoint =
    "https://translate.googleapis.com/translate_a/single?" +
    new URLSearchParams({
      client: "gtx",
      sl: "auto",
      tl: target,
      dt: "t",
      q: text,
    }).toString();

  const res = await fetch(endpoint, {
    headers: {
      "User-Agent": "kutsenko-homepage-worker",
    },
  });
  if (!res.ok) {
    throw new Error(`Google translate failed (${res.status})`);
  }
  const data = await res.json();
  const chunks = Array.isArray(data?.[0]) ? data[0] : [];
  return chunks.map((chunk) => chunk?.[0] || "").join("") || text;
}

function extractTag(xmlBlock, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xmlBlock.match(regex);
  if (!match) return "";
  return match[1]?.replace("<![CDATA[", "").replace("]]>", "").trim() || "";
}

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, "").trim();
}

function decodeHtml(value = "") {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };
  return value.replace(/&([^;]+);/g, (_, entity) => {
    return entity in entities ? entities[entity] : _;
  });
}

