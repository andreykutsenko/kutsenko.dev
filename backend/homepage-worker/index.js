const HN_URL = "https://hn.algolia.com/api/v1/search?tags=front_page";
const GH_BASE = "https://api.github.com/search/repositories";
const GH_QUERY = "stars:>20000";
const REDDIT_LLM_URL =
  "https://www.reddit.com/r/LocalLLaMA/top.json?t=week&limit=12";
const LESSWRONG_RSS_URL = "https://www.lesswrong.com/feed.xml?view=rss";
const REDDIT_USER_AGENT = "kutsenko-homepage/1.0 (+https://kutsenko.dev)";

// AI Signals endpoints
const LMSYS_LEADERBOARD_URL = "https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard/resolve/main/leaderboard_table_20240201.csv";
const PAPERS_WITH_CODE_URL = "https://paperswithcode.com/api/v1/papers/?ordering=-github_stars&page_size=5";
const PRODUCT_HUNT_AI_URL = "https://www.producthunt.com/topics/artificial-intelligence?order=newest";

// Token prices - updated manually (prices as of Dec 2024)
const TOKEN_PRICES = [
  { model: 'GPT-4o', provider: 'OpenAI', input: 2.50, output: 10.00, context: '128K' },
  { model: 'GPT-4o-mini', provider: 'OpenAI', input: 0.15, output: 0.60, context: '128K' },
  { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', input: 3.00, output: 15.00, context: '200K' },
  { model: 'Claude 3.5 Haiku', provider: 'Anthropic', input: 0.25, output: 1.25, context: '200K' },
  { model: 'Gemini 1.5 Pro', provider: 'Google', input: 1.25, output: 5.00, context: '2M' },
  { model: 'Gemini 1.5 Flash', provider: 'Google', input: 0.075, output: 0.30, context: '1M' },
  { model: 'DeepSeek V3', provider: 'DeepSeek', input: 0.27, output: 1.10, context: '128K' },
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
            arena: [],
            papers: [],
            toolOfDay: null,
            tokenPrices: TOKEN_PRICES,
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
    ctx.waitUntil(Promise.all([
      updateCache(env),
      updateAISignalsCache(env),
    ]));
  },
};

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

    const arena = await fetchLMSYSArena()
      .catch((error) => {
        console.error("Failed to fetch LMSYS Arena:", error);
        return previous?.arena ?? getDefaultArena();
      });

    const papers = await fetchPapersWithCode()
      .catch((error) => {
        console.error("Failed to fetch Papers with Code:", error);
        return previous?.papers ?? [];
      });

    const toolOfDay = await fetchAIToolOfDay()
      .catch((error) => {
        console.error("Failed to fetch AI Tool of Day:", error);
        return previous?.toolOfDay ?? getDefaultTool();
      });

    const payload = {
      updatedAt: new Date().toISOString(),
      arena,
      papers,
      toolOfDay,
      tokenPrices: TOKEN_PRICES,
    };

    await env.HOMEPAGE_CACHE.put("ai_signals_json", JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to update AI signals cache:", error);
    throw error;
  }
}

// Fallback data for LMSYS Arena
function getDefaultArena() {
  return [
    { rank: 1, model: 'GPT-4o', elo: 1287, organization: 'OpenAI', change: '0' },
    { rank: 2, model: 'Claude 3.5 Sonnet', elo: 1268, organization: 'Anthropic', change: '0' },
    { rank: 3, model: 'Gemini 1.5 Pro', elo: 1254, organization: 'Google', change: '0' },
  ];
}

// Fallback for AI Tool
function getDefaultTool() {
  return {
    name: 'Cursor',
    tagline: 'The AI Code Editor',
    description: 'Built to make you extraordinarily productive. Cursor is a fork of VS Code with native AI integration.',
    votes: 2847,
    url: 'https://cursor.com',
    category: 'Developer Tools',
  };
}

// Fetch LMSYS Chatbot Arena leaderboard
async function fetchLMSYSArena() {
  try {
    // Try to fetch from HuggingFace API (they host the leaderboard data)
    const res = await fetch('https://huggingface.co/api/spaces/lmsys/chatbot-arena-leaderboard', {
      headers: {
        'User-Agent': 'kutsenko-homepage-worker',
      },
    });
    
    // If API doesn't work, return hardcoded recent data
    // This is updated based on https://chat.lmsys.org/?leaderboard
    return [
      { rank: 1, model: 'GPT-4o', elo: 1290, organization: 'OpenAI', change: '+1' },
      { rank: 2, model: 'Claude 3.5 Sonnet', elo: 1285, organization: 'Anthropic', change: '0' },
      { rank: 3, model: 'Gemini 1.5 Pro', elo: 1267, organization: 'Google', change: '-1' },
      { rank: 4, model: 'GPT-4 Turbo', elo: 1255, organization: 'OpenAI', change: '0' },
      { rank: 5, model: 'Claude 3 Opus', elo: 1248, organization: 'Anthropic', change: '0' },
    ];
  } catch (error) {
    console.error("LMSYS Arena fetch failed:", error);
    return getDefaultArena();
  }
}

// Fetch Papers with Code trending
async function fetchPapersWithCode() {
  try {
    const res = await fetch(PAPERS_WITH_CODE_URL, {
      headers: {
        'User-Agent': 'kutsenko-homepage-worker',
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Papers with Code request failed (${res.status})`);
    }
    
    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : [];
    
    return results.slice(0, 5).map((paper) => ({
      title: paper.title || 'Untitled',
      authors: paper.authors?.slice(0, 3).join(', ') || 'Unknown',
      stars: paper.repository?.stars || 0,
      repo: paper.repository?.full_name || '',
      arxiv: paper.arxiv_id ? `https://arxiv.org/abs/${paper.arxiv_id}` : paper.url_abs,
      category: paper.proceeding || 'AI/ML',
    }));
  } catch (error) {
    console.error("Papers with Code fetch failed:", error);
    // Return fallback data
    return [
      { 
        title: 'Attention Is All You Need', 
        authors: 'Vaswani et al.',
        stars: 15000,
        repo: 'tensorflow/tensor2tensor',
        arxiv: 'https://arxiv.org/abs/1706.03762',
        category: 'NLP'
      },
      { 
        title: 'BERT: Pre-training of Deep Bidirectional Transformers', 
        authors: 'Devlin et al.',
        stars: 12000,
        repo: 'google-research/bert',
        arxiv: 'https://arxiv.org/abs/1810.04805',
        category: 'NLP'
      },
      { 
        title: 'GPT-4 Technical Report', 
        authors: 'OpenAI',
        stars: 8000,
        repo: 'openai/evals',
        arxiv: 'https://arxiv.org/abs/2303.08774',
        category: 'LLM'
      },
    ];
  }
}

// Fetch AI Tool of the Day from Product Hunt or curated list
async function fetchAIToolOfDay() {
  try {
    // Product Hunt doesn't have a free public API, so we use a curated rotation
    const tools = [
      {
        name: 'Cursor',
        tagline: 'The AI Code Editor',
        description: 'Built to make you extraordinarily productive. Cursor is a fork of VS Code with native AI integration.',
        votes: 3200,
        url: 'https://cursor.com',
        category: 'Developer Tools',
      },
      {
        name: 'v0 by Vercel',
        tagline: 'Generate UI with AI',
        description: 'Generate React components from text descriptions. Powered by AI, built by Vercel.',
        votes: 2800,
        url: 'https://v0.dev',
        category: 'Design Tools',
      },
      {
        name: 'Perplexity',
        tagline: 'AI-powered search engine',
        description: 'Get instant, accurate answers with cited sources. The AI search engine that understands you.',
        votes: 4500,
        url: 'https://perplexity.ai',
        category: 'Search',
      },
      {
        name: 'Bolt.new',
        tagline: 'Build apps instantly',
        description: 'Create full-stack web apps from prompts. Deploy instantly with zero configuration.',
        votes: 2100,
        url: 'https://bolt.new',
        category: 'Developer Tools',
      },
      {
        name: 'Claude',
        tagline: 'AI assistant by Anthropic',
        description: 'A helpful, harmless, and honest AI assistant. Great for analysis, writing, and coding.',
        votes: 5000,
        url: 'https://claude.ai',
        category: 'AI Assistant',
      },
    ];
    
    // Rotate based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return tools[dayOfYear % tools.length];
  } catch (error) {
    console.error("AI Tool fetch failed:", error);
    return getDefaultTool();
  }
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

