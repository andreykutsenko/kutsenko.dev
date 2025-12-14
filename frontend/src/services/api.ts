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
        { title: "The End of Programming", points: 1204, comments: 450, author: "jdoe", url: "#" },
        { title: "Show HN: A new way to visualize tensors", points: 890, comments: 120, author: "dev_ai", url: "#" },
        { title: "Postgres is all you need", points: 750, comments: 230, author: "db_fan", url: "#" },
        { title: "Why we're leaving the cloud", points: 620, comments: 180, author: "cloud_exit", url: "#" },
        { title: "Building a 1000x faster database", points: 540, comments: 95, author: "perf_eng", url: "#" },
      ],
      github: [
        { name: "facebook/react", description: "The library for web and native user interfaces", stars: 213000, language: "JavaScript", url: "#", updatedAt: new Date().toISOString() },
        { name: "pytorch/pytorch", description: "Tensors and Dynamic neural networks", stars: 80000, language: "Python", url: "#", updatedAt: new Date().toISOString() },
        { name: "langchain-ai/langchain", description: "Building applications with LLMs through composability", stars: 75000, language: "Python", url: "#", updatedAt: new Date().toISOString() },
        { name: "anthropics/claude-code", description: "Claude's coding capabilities", stars: 45000, language: "TypeScript", url: "#", updatedAt: new Date().toISOString() },
      ],
      llmNews: [
        { title: "Llama 3 405B released", score: 3200, comments: 500, url: "#" },
        { title: "Fine-tuning Mistral on local hardware guide", score: 1500, comments: 120, url: "#" },
        { title: "Running 70B models on consumer GPUs", score: 980, comments: 85, url: "#" },
      ],
      lessWrong: [
        { title: "The Waluigi Effect: mega-post", summary: "A deep dive into LLM behavior simulation...", publishedAt: new Date().toISOString(), url: "#" },
        { title: "Situational Awareness: The Decade Ahead", summary: "AI capabilities and safety considerations...", publishedAt: new Date().toISOString(), url: "#" },
        { title: "RLHF and Constitutional AI", summary: "Understanding alignment techniques...", publishedAt: new Date().toISOString(), url: "#" },
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
