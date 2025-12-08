/** Feed item from HN, GitHub, Reddit, or LessWrong */
export interface FeedItem {
  id?: string | number;
  title?: string;
  name?: string;
  description?: string;
  summary?: string;
  url: string;
  points?: number;
  stars?: number;
  comments?: number;
  author?: string;
  language?: string;
  updatedAt?: string;
  publishedAt?: string;
  createdAt?: string;
  score?: number;
  commentsUrl?: string;
  flair?: string | null;
}

/** Dashboard data structure from /api/homepage */
export interface DashboardData {
  updatedAt: string;
  hackerNews: FeedItem[];
  github: FeedItem[];
  llmNews: FeedItem[];
  lessWrong: FeedItem[];
  images?: ImageItem[];
}

/** Optional image item for the images column */
export interface ImageItem {
  url: string;
  caption?: string;
  alt?: string;
}

/** I18n dictionary structure */
export interface I18nDict {
  [lang: string]: {
    [key: string]: string;
  };
}

/** Theme type */
export type Theme = 'dark' | 'light';

/** Language type */
export type Lang = 'en' | 'ru';

/** Agent preset for the /agents page */
export interface AgentPreset {
  id: string;
  name: string;
  description: string;
  category: 'outreach' | 'content' | 'utility' | 'guard';
  status: 'active' | 'beta' | 'coming-soon';
  icon: string;
}

