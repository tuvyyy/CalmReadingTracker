export interface VocabCoachRequest {
  word: string;
  type: string;
  meaning: string;
  example: string;
  exampleVi?: string;
  synonyms?: string;
  usage?: string;
  chosen?: string | null;
  correct?: boolean;
}

export interface VocabCoachResponse {
  summary: string;
  memoryHook: string;
  commonTrap: string;
  toeicPattern: string;
  microDrill: string[];
}

export async function getVocabCoach(input: VocabCoachRequest): Promise<VocabCoachResponse> {
  const res = await fetch('/api/ai/vocab-coach', {
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
