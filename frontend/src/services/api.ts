import { DashboardData } from '../types';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const res = await fetch("/api/homepage");
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return await res.json();
  } catch (error) {
    console.warn("API unavailable, using fallback mock data for dev/preview.");
    // Fallback mock data if API fails (for demo purposes)
    return {
      updatedAt: new Date().toISOString(),
      hackerNews: [
        { title: "The End of Programming", points: 1204, comments: 450, author: "jdoe", url: "https://news.ycombinator.com" },
        { title: "Show HN: A new way to visualize tensors", points: 890, comments: 120, author: "dev_ai", url: "https://news.ycombinator.com" },
        { title: "Postgres is all you need", points: 750, comments: 230, author: "db_fan", url: "https://news.ycombinator.com" },
        { title: "Why I'm leaving Big Tech for a startup", points: 620, comments: 180, author: "anon_dev", url: "https://news.ycombinator.com" },
        { title: "Understanding transformer architectures from scratch", points: 580, comments: 95, author: "ml_researcher", url: "https://news.ycombinator.com" },
      ],
      github: [
        { name: "facebook/react", description: "The library for web and native user interfaces", stars: 213000, forks: 44800, language: "JavaScript", url: "https://github.com/facebook/react", updatedAt: new Date().toISOString() },
        { name: "pytorch/pytorch", description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration", stars: 80000, forks: 21500, language: "Python", url: "https://github.com/pytorch/pytorch", updatedAt: new Date().toISOString() },
        { name: "langchain-ai/langchain", description: "Building applications with LLMs through composability", stars: 75000, forks: 11200, language: "Python", url: "https://github.com/langchain-ai/langchain", updatedAt: new Date().toISOString() },
      ],
      llmNews: [
        { title: "Llama 3 405B released - benchmarks and first impressions", score: 3200, comments: 500, url: "https://reddit.com/r/LocalLLaMA" },
        { title: "Fine-tuning Mistral on local hardware - complete guide", score: 1500, comments: 120, url: "https://reddit.com/r/LocalLLaMA" },
        { title: "Quantization comparison: GGUF vs GPTQ vs AWQ", score: 980, comments: 85, url: "https://reddit.com/r/LocalLLaMA" },
        { title: "Running 70B models on consumer GPUs - what's possible?", score: 870, comments: 145, url: "https://reddit.com/r/LocalLLaMA" },
      ],
      lessWrong: [
        { title: "The Waluigi Effect: mega-post", summary: "A deep dive into LLM behavior simulation and why models sometimes exhibit opposing behaviors...", publishedAt: new Date().toISOString(), url: "https://lesswrong.com" },
        { title: "Sleeper Agents: Training Deceptive LLMs That Persist Through Safety Training", summary: "Research on how deceptive behaviors can persist even after extensive fine-tuning...", publishedAt: new Date().toISOString(), url: "https://lesswrong.com" },
        { title: "The case for and against AI consciousness", summary: "Examining the philosophical and empirical arguments around machine sentience...", publishedAt: new Date().toISOString(), url: "https://lesswrong.com" },
      ]
    };
  }
};

// AI Signals data types (live: OpenRouter, HF Daily Papers, GitHub search)
export interface AISignalsData {
  updatedAt: string;
  models: Array<{
    id: string;
    name: string;
    provider: string;
    context: number;
    inputPerM: number;
    outputPerM: number;
    addedAt: string | null;
  }>;
  papers: Array<{
    title: string;
    upvotes: number;
    authors: string;
    url: string;
    publishedAt: string;
    summary: string;
  }>;
  trending: Array<{
    name: string;
    url: string;
    description: string | null;
    stars: number;
    language: string | null;
    createdAt: string | null;
  }>;
}

export const fetchAISignals = async (): Promise<AISignalsData | null> => {
  try {
    const res = await fetch("/api/ai-signals");
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return await res.json();
  } catch (error) {
    console.warn("AI Signals API unavailable.");
    return null;
  }
};

// Strava running stats
export interface StravaData {
  updatedAt: string | null;
  week: { miles: number; runs: number } | null;
  weeks?: Array<{ start: string; miles: number; runs: number }>;
  days?: Array<{ date: string; miles: number }>;
  recent: Array<{
    name: string;
    miles: number;
    movingTimeSec: number;
    paceSecPerMile: number | null;
    date: string;
  }>;
  ytd: { miles: number; runs: number } | null;
  all: { miles: number; runs: number } | null;
}

export const fetchStrava = async (): Promise<StravaData | null> => {
  try {
    const res = await fetch('/api/strava');
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return await res.json();
  } catch (error) {
    console.warn('Strava API unavailable.');
    return null;
  }
};

export const fetchTranslations = async (texts: string[], target: string): Promise<string[]> => {
  if (target === 'en') return texts;
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, target }),
    });
    if (!res.ok) throw new Error("Translation failed");
    const data = await res.json();
    return data.translations || texts;
  } catch (error) {
    console.error("Translation error", error);
    return texts;
  }
};
