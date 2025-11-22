const i18n = {
  en: {
    "hero.tagline": "Software engineer building automation tools and AI agents.",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.contact": "Contact",
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
  },
  ru: {
    "hero.tagline": "Инженер-программист, создающий автоматизацию и AI-агентов.",
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.contact": "Контакт",
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
      "Сильен в обработке данных, оптимизации систем, QA-автоматизации и Unix/Python инструментах.",
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
  bindLanguageToggle();
  applyI18n();

  const dashboard = document.querySelector("[data-dashboard]");
  if (dashboard) {
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
  document.body.dataset.theme = state.theme;
}

function bindThemeToggle() {
  const toggle = document.querySelector("[data-action='toggle-theme']");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = state.theme;
    localStorage.setItem("theme", state.theme);
  });
}

function initLanguage() {
  setLanguage(state.lang);
}

function bindLanguageToggle() {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
}

function setLanguage(lang) {
  state.lang = lang || "en";
  localStorage.setItem("lang", state.lang);
  document.documentElement.lang = state.lang;
  document
    .querySelectorAll("[data-lang]")
    .forEach((btn) =>
      btn.classList.toggle("is-active", btn.dataset.lang === state.lang)
    );
  applyI18n();
  if (state.data) {
    renderDashboard();
  }
}

function applyI18n() {
  const dict = i18n[state.lang] || i18n.en;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      if (node.dataset.i18nHtml === "true") {
        node.innerHTML = dict[key];
      } else {
        node.textContent = dict[key];
      }
    }
  });
}

async function loadDashboard() {
  setStatus("Loading feed…");
  try {
    const res = await fetch("/api/homepage");
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const payload = await res.json();
    state.data = payload;
    state.translationCache = {};
    renderDashboard();
    setStatus("");
  } catch (error) {
    console.error("Failed to load feed:", error);
    setStatus("Failed to load data. Refresh or try again later.", true);
  }
}

function setStatus(message, isError = false) {
  const el = document.getElementById("feed-status");
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? "#ff7b72" : "var(--muted)";
}

async function renderDashboard() {
  const updatedAt = state.data?.updatedAt
    ? formatDate(state.data.updatedAt)
    : "";
  updateMeta("hn-updated", updatedAt);
  updateMeta("gh-updated", updatedAt);
  updateMeta("llm-updated", updatedAt);
  updateMeta("lw-updated", updatedAt);

  const sections = [
    { key: "hn", domId: "hn", items: state.data?.hackerNews ?? [], fields: ["title"] },
    {
      key: "github",
      domId: "gh",
      items: state.data?.github ?? [],
      fields: ["name", "description"],
    },
    { key: "llm", domId: "llm", items: state.data?.llmNews ?? [], fields: ["title"] },
    {
      key: "lesswrong",
      domId: "lesswrong",
      items: state.data?.lessWrong ?? [],
      fields: ["title", "summary"],
    },
  ];

  for (const entry of sections) {
    try {
      await renderSection(entry.key, entry.items, entry.fields, entry.domId);
    } catch (error) {
      console.error(`Failed to render ${entry.key} section`, error);
      const container = document.getElementById(
        `${entry.domId || entry.key}-list`
      );
      if (container) {
        container.innerHTML = `<li class="card"><p class="card-title">Unable to load section.</p><p class="card-meta">${error.message}</p></li>`;
      }
    }
  }
}

function updateMeta(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text ? `Updated ${text}` : "";
}

async function renderSection(section, items, translateFields = [], domId) {
  const container = document.getElementById(`${domId || section}-list`);
  if (!container) return;
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `<li class="card"><p class="card-title">No data yet.</p><p class="card-meta">Worker cache is still warming up.</p></li>`;
    return;
  }

  const limitMap = { hn: 8, github: 8, llm: 8, lesswrong: 6 };
  const trimmed = items.slice(0, limitMap[section] || 6);

  const localized = await localizeItems(section, trimmed, translateFields);
  localized.forEach((item) => {
    const card = buildCard(section, item);
    container.appendChild(card);
  });
}

async function localizeItems(section, items, fields) {
  if (state.lang === "en" || !fields.length) {
    return items;
  }
  const cacheKey = `${section}:${state.lang}`;
  if (state.translationCache[cacheKey]) {
    return state.translationCache[cacheKey];
  }

  const translatedFields = {};
  for (const field of fields) {
    const texts = items.map((item) => item[field] || "");
    translatedFields[field] = await requestTranslations(texts);
  }

  const localized = items.map((item, idx) => {
    const clone = { ...item };
    fields.forEach((field) => {
      if (translatedFields[field] && translatedFields[field][idx]) {
        clone[field] = translatedFields[field][idx];
      }
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

function buildCard(section, item) {
  const li = document.createElement("li");
  li.className = "card";
  const title = document.createElement("a");
  title.className = "card-title";
  title.href = item.url;
  title.target = "_blank";
  title.rel = "noopener";

  if (section === "github") {
    title.textContent = item.name;
    const desc = document.createElement("p");
    desc.className = "card-body";
    desc.textContent = item.description || "No description provided.";
    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = `★ ${formatNumber(item.stars)} • ${item.language || "n/a"} • ${formatDate(item.updatedAt)}`;
    li.append(title, desc, meta);
    return li;
  }

  if (section === "lesswrong") {
    title.textContent = item.title;
    const summary = document.createElement("p");
    summary.className = "card-body";
    summary.classList.add("is-clamped");
    summary.textContent = item.summary || "";
    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = item.publishedAt ? formatDate(item.publishedAt) : "";
    li.append(title, summary, meta);
    return li;
  }

  if (section === "llm") {
    title.textContent = item.title;
    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = `${formatNumber(item.score)} points • ${formatNumber(item.comments)} comments`;
    li.append(title, meta);
    return li;
  }

  // default: Hacker News
  title.textContent = item.title;
  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = `${formatNumber(item.points)} points • ${formatNumber(item.comments)} comments • ${item.author ?? "unknown"}`;
  li.append(title, meta);
  return li;
}

function formatNumber(value) {
  if (value == null) return "0";
  return Number(value).toLocaleString();
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
