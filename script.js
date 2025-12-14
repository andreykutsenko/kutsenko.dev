const i18n = {
  en: {
    "hero.tagline": "Software engineer building automation tools and AI agents.",
    "nav.home": "Home / Dashboard",
    "nav.about": "About / Profile",
    "nav.contact": "Contact Uplink",
    "toggle.theme": "Theme",
    "about.subtitle": "Automation engineer · LLM ops · Builder of SimpleProcess.",
    "section.hn.tagline": "Top discussions from the front page",
    "section.github.tagline": "Fresh repos trending on GitHub",
    "section.llm.tagline": "Highlights from r/LocalLLaMA",
    "section.lw.tagline": "Most upvoted rationality essays",
    "panel.links.heading": "More",
    "footer.about": "About",
    "about.summary.heading": "Summary",
    "about.summary.body":
      "Experienced software engineer with fintech/banking roots (InfoIMAGE, BPS-Sberbank) and a track record of shipping automations across QA, data parsing, and multi-platform systems.",
    "about.summary.item1":
      "Builds automation-first products (SimpleProcess.io) and applies AI/LLM agents to real workflows.",
    "about.summary.item2":
      "Strong background in data processing, system optimization, QA automation, and Unix/Python tooling.",
    "about.summary.item3":
      "Led engineering and operations teams in banking, improving KPIs and reducing operational risk.",
    "about.focus.heading": "Current focus",
    "about.focus.body1":
      "Running SimpleProcess.io — practical automations for outbound ops, enrichment, and AI/LLM-driven agents that tie into CRMs and ops stacks.",
    "about.focus.body2":
      "Building a Telegram Outreach microservice (pet project) based on Telethon: multi-account messaging, response tracking, contact parsing, phone validation, CRM enrichment, and warm-up routines orchestrated with n8n + LLM agents.",
    "about.stack.heading": "Stack & Interests",
    "about.stack.item1": "Agents / evals / monitoring for LLM-powered systems",
    "about.stack.item2": "Python, TypeScript, Rust tooling, Postgres/ClickHouse",
    "about.stack.item3": "Cloudflare Workers, n8n, CRM/ops integrations",
    "about.contact.heading": "Contact",
    "status.loading": "INITIALIZING SYSTEM...",
    "status.error": "CONNECTION FAILURE",
    "status.online": "SYSTEM ONLINE",
  },
  ru: {
    "hero.tagline": "Инженер-программист, создающий автоматизацию и AI-агентов.",
    "nav.home": "Главная / Дашборд",
    "nav.about": "Обо мне / Профиль",
    "nav.contact": "Связь",
    "toggle.theme": "Тема",
    "about.subtitle": "Инженер по автоматизации · LLM ops · Создатель SimpleProcess.",
    "section.hn.tagline": "Главные обсуждения с Hacker News",
    "section.github.tagline": "Свежие тренды с GitHub",
    "section.llm.tagline": "Лучшее из r/LocalLLaMA",
    "section.lw.tagline": "Самые оценённые эссе на LessWrong",
    "panel.links.heading": "Ещё",
    "footer.about": "Обо мне",
    "about.summary.heading": "Кратко",
    "about.summary.body":
      "Инженер-программист с корнями в финтехе/банкинге (InfoIMAGE, БПС-Сбербанк) и опытом внедрения автоматизации в QA, парсинге данных и мультиплатформенных системах.",
    "about.summary.item1":
      "Запускаю продукты с упором на автоматизацию (SimpleProcess.io) и применяю AI/LLM-агентов в реальных процессах.",
    "about.summary.item2":
      "Силен в обработке данных, оптимизации систем, QA-автоматизации и Unix/Python инструментах.",
    "about.summary.item3":
      "Руководил инженерными и операционными командами в банке, повышая KPI и снижая риски.",
    "about.focus.heading": "Текущий фокус",
    "about.focus.body1":
      "Веду SimpleProcess.io — прикладные автоматизации для outbound-операций, энричмента и LLM-агентов, интегрированных с CRM и операционными системами.",
    "about.focus.body2":
      "Собираю Telegram Outreach микросервис (pet-проект) на Telethon: мультиаккаунт, отслеживание ответов, парсинг контактов, проверка телефонов, энричмент CRM и прогрев аккаунтов с оркестрацией через n8n и LLM-агентов.",
    "about.stack.heading": "Инструменты и интересы",
    "about.stack.item1": "Агенты / оценки / мониторинг LLM-систем",
    "about.stack.item2": "Python, TypeScript, Rust-инструменты, Postgres/ClickHouse",
    "about.stack.item3": "Cloudflare Workers, n8n, интеграции с CRM/оперейшнс",
    "about.contact.heading": "Связаться",
    "status.loading": "ЗАГРУЗКА СИСТЕМЫ...",
    "status.error": "ОШИБКА ПОДКЛЮЧЕНИЯ",
    "status.online": "СИСТЕМА АКТИВНА",
  },
};

const state = {
  theme: localStorage.getItem("theme") || getPreferredTheme(),
  lang: localStorage.getItem("lang") || "en",
  data: null,
  translationCache: {},
};

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initTheme();
  initLanguage();
  bindThemeToggle();
  bindLanguageControls();
  applyI18n();
  refreshIcons();

  if (document.querySelector("[data-dashboard]")) {
    loadDashboard();
  }
});

function initYear() {
  const el = document.getElementById("year");
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function initTheme() {
  updateThemeUI();
}

function bindThemeToggle() {
  const toggle = document.querySelector("[data-action='toggle-theme']");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", state.theme);
    updateThemeUI();
  });
}

function updateThemeUI() {
  document.body.dataset.theme = state.theme;
  const root = document.documentElement;
  root.classList.toggle("dark", state.theme === "dark");
  root.classList.toggle("light", state.theme === "light");

  const label = document.querySelector("[data-theme-label]");
  if (label) {
    label.textContent = state.theme === "dark" ? "Dark" : "Light";
  }

  const icon = document.querySelector("[data-theme-icon]");
  if (icon) {
    icon.setAttribute("data-lucide", state.theme === "dark" ? "moon" : "sun");
  }

  refreshIcons();
}

function initLanguage() {
  setLanguage(state.lang);
}

function bindLanguageControls() {
  const toggle = document.querySelector("[data-action='toggle-lang']");
  if (toggle) {
    toggle.addEventListener("click", () => {
      setLanguage(state.lang === "en" ? "ru" : "en");
    });
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
}

function setLanguage(lang) {
  state.lang = lang || "en";
  localStorage.setItem("lang", state.lang);
  document.documentElement.lang = state.lang;
  state.translationCache = {};

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === state.lang);
  });

  const label = document.querySelector("[data-lang-label]");
  if (label) {
    label.textContent = state.lang.toUpperCase();
  }

  applyI18n();
  if (state.data) {
    renderDashboard();
  }
}

function applyI18n() {
  const dict = i18n[state.lang] || i18n.en;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (!key || !dict[key]) return;
    if (node.dataset.i18nHtml === "true") {
      node.innerHTML = dict[key];
    } else {
      node.textContent = dict[key];
    }
  });
}

async function loadDashboard() {
  setStatus(i18n[state.lang]?.["status.loading"] || "Loading…");
  try {
    const res = await fetch("/api/homepage");
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    state.data = await res.json();
    state.translationCache = {};
    renderDashboard();
    setStatus("");
  } catch (error) {
    console.error("Failed to load feed:", error);
    setStatus(i18n[state.lang]?.["status.error"] || "Failed to load data.", true);
  }
}

function setStatus(message, isError = false) {
  const el = document.getElementById("feed-status");
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? "#ff7b72" : "rgba(255,255,255,0.5)";
}

async function renderDashboard() {
  const timestamp = state.data?.updatedAt ? formatDate(state.data.updatedAt) : "";
  const syncNode = document.getElementById("last-updated");
  if (syncNode) {
    syncNode.textContent = timestamp ? `Last synced ${timestamp}` : "";
  }

  updateMeta("hn-updated", timestamp);
  updateMeta("gh-updated", timestamp);
  updateMeta("llm-updated", timestamp);
  updateMeta("lw-updated", timestamp);

  const sections = [
    {
      key: "hn",
      target: "#feed-hn",
      fields: ["title"],
      items: state.data?.hackerNews ?? [],
      limit: 5,
      renderer: createHnCard,
    },
    {
      key: "github",
      target: "#feed-github",
      fields: ["name", "description"],
      items: state.data?.github ?? [],
      limit: 4,
      renderer: createGithubCard,
    },
    {
      key: "llm",
      target: "#feed-llm",
      fields: ["title"],
      items: state.data?.llmNews ?? [],
      limit: 4,
      renderer: createLlmCard,
    },
    {
      key: "lesswrong",
      target: "#feed-lesswrong",
      fields: ["title", "summary"],
      items: state.data?.lessWrong ?? [],
      limit: 4,
      renderer: createLesswrongCard,
    },
  ];

  for (const section of sections) {
    try {
      await renderFeedSection(section);
    } catch (error) {
      console.error(`Failed to render ${section.key}:`, error);
      const container = document.querySelector(section.target);
      if (container) {
        container.innerHTML = "";
        container.appendChild(createErrorCard(error));
      }
    }
  }
}

function updateMeta(id, text) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = text || "";
  }
}

async function renderFeedSection({ key, target, items, fields, limit, renderer }) {
  const container = document.querySelector(target);
  if (!container) return;
  container.innerHTML = "";

  if (!items.length) {
    container.appendChild(createEmptyCard());
    return;
  }

  const trimmed = items.slice(0, limit);
  const localized = await localizeItems(key, trimmed, fields);
  localized.forEach((item) => {
    container.appendChild(renderer(item));
  });
}

function createEmptyCard() {
  const node = document.createElement("div");
  node.className = "feed-card";
  node.innerHTML = `<p class="feed-card__title">No data yet.</p><p class="feed-card__meta">Worker cache is still warming up.</p>`;
  return node;
}

function createErrorCard(error) {
  const node = document.createElement("div");
  node.className = "feed-card";
  node.innerHTML = `<p class="feed-card__title">Unable to load.</p><p class="feed-card__meta">${error.message || "Unexpected error"}</p>`;
  return node;
}

async function localizeItems(section, items, fields) {
  if (state.lang === "en" || !fields.length) {
    return items;
  }

  const cacheKey = `${section}:${state.lang}`;
  if (state.translationCache[cacheKey]) {
    return state.translationCache[cacheKey];
  }

  const translated = {};
  for (const field of fields) {
    const texts = items.map((item) => item[field] || "");
    translated[field] = await requestTranslations(texts);
  }

  const localized = items.map((item, idx) => {
    const clone = { ...item };
    fields.forEach((field) => {
      clone[field] = translated[field]?.[idx] ?? clone[field];
    });
    return clone;
  });

  state.translationCache[cacheKey] = localized;
  return localized;
}

async function requestTranslations(texts) {
  if (!texts.some(Boolean) || state.lang === "en") {
    return texts;
  }
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, target: state.lang }),
    });
    if (!res.ok) throw new Error(`Translation failed (${res.status})`);
    const data = await res.json();
    return Array.isArray(data.translations) ? data.translations : texts;
  } catch (error) {
    console.error("Translation failed:", error);
    setStatus("Translation temporarily unavailable.", true);
    return texts;
  }
}

function createHnCard(item) {
  const card = document.createElement("a");
  card.className = "feed-card";
  card.href = item.url || "#";
  card.target = "_blank";
  card.rel = "noopener";

  const title = document.createElement("p");
  title.className = "feed-card__title";
  title.textContent = item.title || "Untitled thread";

  const meta = document.createElement("p");
  meta.className = "feed-card__meta";
  meta.textContent = `${formatNumber(item.points)} pts :: ${formatNumber(item.comments)} cmts :: ${item.author ?? "unknown"}`;

  card.append(title, meta);
  return card;
}

function createGithubCard(item) {
  const card = document.createElement("a");
  card.className = "feed-card github-card";
  card.href = item.url || "#";
  card.target = "_blank";
  card.rel = "noopener";

  const title = document.createElement("p");
  title.className = "feed-card__title";
  title.textContent = item.name || "Unnamed repo";

  const body = document.createElement("p");
  body.className = "feed-card__body";
  body.textContent = item.description || "No description provided.";

  const meta = document.createElement("p");
  meta.className = "feed-card__meta";
  meta.textContent = `★ ${formatNumber(item.stars)} • ${item.language || "n/a"} • ${formatDate(item.updatedAt)}`;

  card.append(title, body, meta);
  return card;
}

function createLlmCard(item) {
  const card = document.createElement("a");
  card.className = "feed-card";
  card.href = item.url || "#";
  card.target = "_blank";
  card.rel = "noopener";

  const title = document.createElement("p");
  title.className = "feed-card__title";
  title.textContent = item.title || "Untitled thread";

  const meta = document.createElement("p");
  meta.className = "feed-card__meta";
  meta.textContent = `${formatNumber(item.score)} upvotes :: ${formatNumber(item.comments)} comments`;

  card.append(title, meta);
  return card;
}

function createLesswrongCard(item) {
  const card = document.createElement("a");
  card.className = "feed-card";
  card.href = item.url || "#";
  card.target = "_blank";
  card.rel = "noopener";

  const title = document.createElement("p");
  title.className = "feed-card__title";
  title.textContent = item.title || "Untitled essay";

  if (item.summary) {
    const body = document.createElement("p");
    body.className = "feed-card__body";
    body.textContent = item.summary;
    card.appendChild(body);
  }

  const meta = document.createElement("p");
  meta.className = "feed-card__meta";
  meta.textContent = item.publishedAt ? formatDate(item.publishedAt) : "—";

  card.appendChild(meta);
  return card;
}

function formatNumber(value) {
  if (value == null) return "0";
  return Number(value).toLocaleString();
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function refreshIcons() {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}
