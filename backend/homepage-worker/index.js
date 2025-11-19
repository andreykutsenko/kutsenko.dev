const HN_URL = "https://hn.algolia.com/api/v1/search?tags=front_page";
const GH_URL =
  "https://api.github.com/search/repositories?q=created:>2025-01-01&sort=stars&order=desc&per_page=10";

const IMAGE_GALLERY = [
  {
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    caption: "Night code session",
  },
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    caption: "Automation pipelines",
  },
  {
    url: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=600&q=80",
    caption: "Systems thinking",
  },
];

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${url} (${res.status})`);
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
      let cached = await env.HOMEPAGE_CACHE.get("homepage_json", {
        type: "json",
      });

      if (!cached) {
        try {
          cached = await updateCache(env);
        } catch (error) {
          console.error("Failed to refresh cache on-demand:", error);
          cached = {
            updatedAt: new Date().toISOString(),
            hackerNews: [],
            github: [],
            images: IMAGE_GALLERY,
          };
        }
      }

      return new Response(JSON.stringify(cached), {
        headers: { "content-type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },

  async scheduled(event, env) {
    event.waitUntil(updateCache(env));
  },
};

export async function updateCache(env) {
  try {
    const headers = {
      "User-Agent": "kutsenko-homepage-worker",
      Accept: "application/vnd.github+json",
    };

    if (env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
    }

    const [hnData, ghData] = await Promise.all([
      fetchJson(HN_URL),
      fetchJson(GH_URL, { headers }),
    ]);

    const payload = {
      updatedAt: new Date().toISOString(),
      hackerNews: mapHackerNewsResponse(hnData),
      github: mapGithubResponse(ghData),
      images: IMAGE_GALLERY,
    };

    await env.HOMEPAGE_CACHE.put("homepage_json", JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to update homepage cache:", error);
    throw error;
  }
}

