import type { DashboardData } from '../types';

/**
 * Fetches dashboard data from the backend API.
 * Falls back to mock data if the API is unavailable (useful for local dev).
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const res = await fetch('/api/homepage');
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return await res.json();
  } catch (error) {
    console.warn('API unavailable, using fallback mock data for dev/preview.', error);
    return getMockData();
  }
}

/**
 * Request translation from the backend (if available).
 * Falls back to returning original texts if translation fails.
 */
export async function fetchTranslations(texts: string[], target: string): Promise<string[]> {
  if (target === 'en') return texts;
  
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, target }),
    });
    
    if (!res.ok) throw new Error('Translation failed');
    
    const data = await res.json();
    return data.translations || texts;
  } catch (error) {
    console.error('Translation error:', error);
    return texts;
  }
}

/** Mock data for development/preview when API is unavailable */
function getMockData(): DashboardData {
  return {
    updatedAt: new Date().toISOString(),
    hackerNews: [
      { 
        id: '1',
        title: 'The End of Programming', 
        points: 1204, 
        comments: 450, 
        author: 'jdoe', 
        url: 'https://news.ycombinator.com/item?id=1' 
      },
      { 
        id: '2',
        title: 'Show HN: A new way to visualize tensors', 
        points: 890, 
        comments: 120, 
        author: 'dev_ai', 
        url: 'https://news.ycombinator.com/item?id=2' 
      },
      { 
        id: '3',
        title: 'Postgres is all you need', 
        points: 750, 
        comments: 230, 
        author: 'db_fan', 
        url: 'https://news.ycombinator.com/item?id=3' 
      },
      { 
        id: '4',
        title: 'Why I left Big Tech for a startup', 
        points: 620, 
        comments: 180, 
        author: 'techie', 
        url: 'https://news.ycombinator.com/item?id=4' 
      },
      { 
        id: '5',
        title: 'The unreasonable effectiveness of simple algorithms', 
        points: 580, 
        comments: 95, 
        author: 'algo_nerd', 
        url: 'https://news.ycombinator.com/item?id=5' 
      },
    ],
    github: [
      { 
        id: 1,
        name: 'facebook/react', 
        description: 'The library for web and native user interfaces', 
        stars: 213000, 
        language: 'JavaScript', 
        url: 'https://github.com/facebook/react',
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 2,
        name: 'pytorch/pytorch', 
        description: 'Tensors and Dynamic neural networks', 
        stars: 80000, 
        language: 'Python', 
        url: 'https://github.com/pytorch/pytorch',
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 3,
        name: 'denoland/deno', 
        description: 'A modern runtime for JavaScript and TypeScript', 
        stars: 95000, 
        language: 'Rust', 
        url: 'https://github.com/denoland/deno',
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 4,
        name: 'astral-sh/ruff', 
        description: 'An extremely fast Python linter and code formatter', 
        stars: 32000, 
        language: 'Rust', 
        url: 'https://github.com/astral-sh/ruff',
        updatedAt: new Date().toISOString() 
      },
    ],
    llmNews: [
      { 
        id: '1',
        title: 'Llama 3 405B released', 
        score: 3200, 
        comments: 500, 
        url: 'https://reddit.com/r/LocalLLaMA/1' 
      },
      { 
        id: '2',
        title: 'Fine-tuning Mistral on local hardware guide', 
        score: 1500, 
        comments: 120, 
        url: 'https://reddit.com/r/LocalLLaMA/2' 
      },
      { 
        id: '3',
        title: 'Comparison: Ollama vs llama.cpp vs vLLM', 
        score: 980, 
        comments: 85, 
        url: 'https://reddit.com/r/LocalLLaMA/3' 
      },
    ],
    lessWrong: [
      { 
        id: '1',
        title: 'The Waluigi Effect: mega-post', 
        summary: 'A deep dive into LLM behavior simulation...', 
        publishedAt: new Date().toISOString(), 
        url: 'https://lesswrong.com/posts/1' 
      },
      { 
        id: '2',
        title: 'Simulators', 
        summary: 'Understanding language models as simulators of text...', 
        publishedAt: new Date(Date.now() - 86400000).toISOString(), 
        url: 'https://lesswrong.com/posts/2' 
      },
    ],
  };
}

