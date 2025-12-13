export interface FeedItem {
  title?: string;
  name?: string;
  description?: string;
  url: string;
  points?: number;
  stars?: number;
  forks?: number;
  comments?: number;
  author?: string;
  language?: string;
  updatedAt?: string;
  publishedAt?: string;
  summary?: string;
  score?: number;
}

export interface DashboardData {
  updatedAt: string;
  hackerNews: FeedItem[];
  github: FeedItem[];
  llmNews: FeedItem[];
  lessWrong: FeedItem[];
}

export interface I18nDict {
  [key: string]: {
    [key: string]: string;
  };
}

export type Theme = 'dark' | 'light';
export type Lang = 'en' | 'ru';
