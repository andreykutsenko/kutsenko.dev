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
