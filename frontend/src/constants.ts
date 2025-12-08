import type { I18nDict, AgentPreset } from './types';

/** Internationalization strings */
export const I18N: I18nDict = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.agents': 'Agents',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    // Status
    'status.online': 'SYSTEM ONLINE',
    'status.loading': 'INITIALIZING...',
    'status.error': 'CONNECTION FAILURE',

    // Hero
    'hero.tagline': 'Automation, agents, and simple processes.',
    'hero.subtitle': 'Software engineer building automation tools and AI agents.',
    'hero.cta': 'View Dashboard',

    // Sections
    'section.work': 'Work',
    'section.work.tagline': 'Current projects and focus areas',
    'section.contact': 'Contact',
    'section.contact.tagline': 'Get in touch',
    'section.agents': 'Agent Presets',
    'section.agents.tagline': 'Pre-configured automation agents',

    // Dashboard sections
    'section.hn.tagline': 'Top discussions from the front page',
    'section.github.tagline': 'Trending repos on GitHub',
    'section.llm.tagline': 'Highlights from r/LocalLLaMA',
    'section.lw.tagline': 'Most upvoted rationality essays',
    'section.notes': 'Notes & Focus',

    // About
    'about.subtitle': 'Automation engineer · LLM ops · Builder of SimpleProcess.',
    'about.summary.heading': 'Summary',
    'about.summary.body': 'Experienced software engineer with fintech/banking roots and a track record of shipping automations across QA, data parsing, and multi-platform systems.',

    // Footer
    'footer.copyright': '© 2025 Andrey Kutsenko',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.dashboard': 'Дашборд',
    'nav.agents': 'Агенты',
    'nav.about': 'Обо мне',
    'nav.contact': 'Контакты',

    // Status
    'status.online': 'СИСТЕМА АКТИВНА',
    'status.loading': 'ЗАГРУЗКА...',
    'status.error': 'ОШИБКА ПОДКЛЮЧЕНИЯ',

    // Hero
    'hero.tagline': 'Автоматизация, агенты и простые процессы.',
    'hero.subtitle': 'Инженер-программист, создающий автоматизацию и AI-агентов.',
    'hero.cta': 'Открыть дашборд',

    // Sections
    'section.work': 'Работа',
    'section.work.tagline': 'Текущие проекты и направления',
    'section.contact': 'Контакты',
    'section.contact.tagline': 'Связаться со мной',
    'section.agents': 'Пресеты агентов',
    'section.agents.tagline': 'Готовые агенты автоматизации',

    // Dashboard sections
    'section.hn.tagline': 'Главные обсуждения с Hacker News',
    'section.github.tagline': 'Тренды репозиториев на GitHub',
    'section.llm.tagline': 'Лучшее из r/LocalLLaMA',
    'section.lw.tagline': 'Топ эссе на LessWrong',
    'section.notes': 'Заметки и фокус',

    // About
    'about.subtitle': 'Инженер по автоматизации · LLM ops · Создатель SimpleProcess.',
    'about.summary.heading': 'Кратко',
    'about.summary.body': 'Инженер-программист с корнями в финтехе/банкинге и опытом внедрения автоматизации в QA, парсинге данных и мультиплатформенных системах.',

    // Footer
    'footer.copyright': '© 2025 Андрей Куценко',
  },
};

/** Agent presets for the /agents page */
export const AGENT_PRESETS: AgentPreset[] = [
  {
    id: 'simpleprocess-outreach',
    name: 'SimpleProcess Outreach',
    description: 'Multi-channel outbound automation with LinkedIn, email, and Telegram. Warm-up, sequencing, and response tracking built-in.',
    category: 'outreach',
    status: 'active',
    icon: 'send',
  },
  {
    id: 'linkedin-bio',
    name: 'LinkedIn Bio Writer',
    description: 'AI-powered bio generation from profile data. Optimizes for recruiter keywords and personal branding.',
    category: 'content',
    status: 'active',
    icon: 'user',
  },
  {
    id: 'web-copy-tech',
    name: 'Web Copy Tech Minimal',
    description: 'Clean, developer-focused copywriting for landing pages. Technical accuracy with marketing punch.',
    category: 'content',
    status: 'beta',
    icon: 'file-text',
  },
  {
    id: 'safety-guard',
    name: 'Safety Guard',
    description: 'Content moderation and safety checks for LLM outputs. Catches prompt injections and harmful content.',
    category: 'guard',
    status: 'coming-soon',
    icon: 'shield',
  },
  {
    id: 'crm-enrichment',
    name: 'CRM Enrichment Agent',
    description: 'Automatic contact enrichment from public sources. Email, LinkedIn, company data, and more.',
    category: 'utility',
    status: 'beta',
    icon: 'database',
  },
  {
    id: 'meeting-scheduler',
    name: 'Meeting Scheduler',
    description: 'AI scheduling assistant that handles back-and-forth to find optimal meeting times.',
    category: 'utility',
    status: 'coming-soon',
    icon: 'calendar',
  },
];

/** Contact links */
export const CONTACT_LINKS = [
  { id: 'email', href: 'mailto:kutsenko@gmail.com', label: 'kutsenko@gmail.com', icon: 'mail' },
  { id: 'linkedin', href: 'https://linkedin.com/in/andreykutsenko', label: 'LinkedIn', icon: 'linkedin' },
  { id: 'telegram', href: 'https://t.me/kutsenko_dev', label: 'Telegram', icon: 'send' },
  { id: 'github', href: 'https://github.com/kutsenko', label: 'GitHub', icon: 'github' },
];

