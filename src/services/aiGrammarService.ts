// src/services/aiGrammarService.ts

export interface GrammarCoachRequest {
  category: string;
  question: string;
  options: string[];
  chosen?: string | null;
  correct?: boolean;
  explanation?: string;
}

export interface GrammarCoachResponse {
  summary: string;
  memoryHook: string;
  commonTrap: string;
  toeicPattern: string;
  microDrill: string[];
}

export async function getGrammarCoach(input: GrammarCoachRequest): Promise<GrammarCoachResponse> {
  const res = await fetch('/api/ai/grammar-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'AI coach is unavailable.');
  }

  return {
    summary: String(data.summary || ''),
    memoryHook: String(data.memoryHook || ''),
    commonTrap: String(data.commonTrap || ''),
    toeicPattern: String(data.toeicPattern || ''),
    microDrill: Array.isArray(data.microDrill) ? data.microDrill.map(String) : [],
  };
}
