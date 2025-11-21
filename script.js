const i18n = {
  en: {
    "hero.tagline": "Software engineer building automation tools and AI agents.",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.contact": "Contact",
    "toggle.theme": "Theme",
    "section.hn.tagline": "Top discussions from the front page",
    "section.github.tagline": "Fresh repos trending on GitHub",
    "section.llm.tagline": "Highlights from r/LocalLLaMA",
    "section.lw.tagline": "Most upvoted rationality essays",
    "panel.links.heading": "More",
    "footer.about": "About",
    "about.work.heading": "Work",
    "about.stack.heading": "Stack & Interests",
    "about.contact.heading": "Contact",
  },
  ru: {
    "hero.tagline": "Инженер-программист, создающий автоматизацию и AI-агентов.",
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.contact": "Контакт",
    "toggle.theme": "Тема",
    "section.hn.tagline": "Главные обсуждения с Hacker News",
    "section.github.tagline": "Свежие тренды с GitHub",
    "section.llm.tagline": "Лучшее из r/LocalLLaMA",
    "section.lw.tagline": "Самые оценённые эссе на LessWrong",
    "panel.links.heading": "Ещё",
    "footer.about": "Обо мне",
    "about.work.heading": "Работа",
    "about.stack.heading": "Инструменты и интересы",
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
      node.textContent = dict[key];
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

  await Promise.all([
    renderSection("hn", state.data?.hackerNews ?? [], ["title"]),
    renderSection("github", state.data?.github ?? [], ["name", "description"]),
    renderSection("llm", state.data?.llmNews ?? [], ["title"]),
    renderSection("lesswrong", state.data?.lessWrong ?? [], ["title", "summary"]),
  ]);
}

function updateMeta(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text ? `Updated ${text}` : "";
}

async function renderSection(section, items, translateFields = []) {
  const container = document.getElementById(`${section}-list`);
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
