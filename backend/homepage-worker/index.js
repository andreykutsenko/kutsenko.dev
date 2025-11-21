const HN_URL = "https://hn.algolia.com/api/v1/search?tags=front_page";
const GH_BASE = "https://api.github.com/search/repositories";
const GH_QUERY = "created:>=2025-01-01";
const REDDIT_LLM_URL =
  "https://old.reddit.com/r/LocalLLaMA/top/.json?t=week&limit=12";
const LESSWRONG_RSS_URL = "https://www.lesswrong.com/feed.xml?view=rss";
const DEFAULT_TRANSLATE_URL = "https://libretranslate.de/translate";

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

function mapGithubResponse(data) {
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.map((repo) => ({
    id: repo.id,
    name: repo.full_name || repo.name,
    url: repo.html_url,
    description: repo.description,
    stars: repo.stargazers_count,
    language: repo.language,
    updatedAt: repo.updated_at,
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
    ctx.waitUntil(updateCache(env));
  },
};

export async function updateCache(env) {
  try {
    const headers = {
      "User-Agent": "kutsenko-homepage-worker",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (env.GITHUB_TOKEN) {
      headers.Authorization = `token ${env.GITHUB_TOKEN}`;
    }

    const ghUrl = `${GH_BASE}?${new URLSearchParams({
      q: GH_QUERY,
      sort: "stars",
      order: "desc",
      per_page: "10",
    }).toString()}`;

    const [hnData, ghData, llmNews, lessWrongPosts] = await Promise.all([
      fetchJson(HN_URL),
      fetchJson(ghUrl, { headers }),
      fetchLlmNews(),
      fetchLessWrongPosts(),
    ]);

    const payload = {
      updatedAt: new Date().toISOString(),
      hackerNews: mapHackerNewsResponse(hnData),
      github: mapGithubResponse(ghData),
      llmNews,
      lessWrong: lessWrongPosts,
    };

    await env.HOMEPAGE_CACHE.put("homepage_json", JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to update homepage cache:", error);
    throw error;
  }
}

async function fetchLlmNews() {
  try {
    const res = await fetch(REDDIT_LLM_URL, {
      headers: {
        "User-Agent": "kutsenko-homepage-worker",
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

async function translateBatch(texts, target, env) {
  const translateUrl = env.TRANSLATE_API_URL || DEFAULT_TRANSLATE_URL;
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
      const res = await fetch(translateUrl, {
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

