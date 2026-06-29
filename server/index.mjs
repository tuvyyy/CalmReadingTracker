import http from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PORT = Number(process.env.AI_SERVER_PORT || 8787);
const OPENAI_URL = 'https://api.openai.com/v1/responses';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const responseCache = new Map();

loadDotEnv();

function loadDotEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [rawKey, ...rawValue] = trimmed.split('=');
    const key = rawKey.trim();
    const value = rawValue.join('=').trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 100_000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => resolveBody(body));
    req.on('error', reject);
  });
}

function extractText(responseJson) {
  if (typeof responseJson.output_text === 'string') return responseJson.output_text;

  const chunks = [];
  for (const item of responseJson.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && typeof content.text === 'string') {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join('\n').trim();
}

function parseModelJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Model did not return JSON');
    return JSON.parse(match[0]);
  }
}

function normalizeCoachPayload(data) {
  return {
    summary: String(data.summary || ''),
    memoryHook: String(data.memoryHook || ''),
    commonTrap: String(data.commonTrap || ''),
    toeicPattern: String(data.toeicPattern || ''),
    microDrill: Array.isArray(data.microDrill)
      ? data.microDrill.slice(0, 3).map(String)
      : [],
  };
}

function buildVocabPrompt(body) {
  const word = String(body.word || '').trim();
  const meaning = String(body.meaning || '').trim();
  const example = String(body.example || '').trim();
  const exampleVi = String(body.exampleVi || '').trim();
  const type = String(body.type || '').trim();
  const synonyms = String(body.synonyms || '').trim();
  const usage = String(body.usage || '').trim();
  const chosen = body.chosen ? String(body.chosen) : '';
  const correct = Boolean(body.correct);

  if (!word || !meaning) return null;

  return [
    'You are a TOEIC vocabulary coach for a Vietnamese learner.',
    'Write concise Vietnamese explanations. Keep English examples natural.',
    'Be brief: each field should be one short sentence.',
    'Return JSON only with these exact keys: summary, memoryHook, commonTrap, toeicPattern, microDrill.',
    'microDrill must be an array of 2 very short fill-in-the-blank sentences.',
    '',
    `Word: ${word}`,
    `Part of speech: ${type}`,
    `Vietnamese meaning: ${meaning}`,
    `Example: ${example}`,
    exampleVi ? `Example Vietnamese: ${exampleVi}` : '',
    synonyms ? `Synonyms: ${synonyms}` : '',
    usage ? `Existing usage note: ${usage}` : '',
    chosen ? `Learner chose: ${chosen}` : '',
    chosen ? `Was learner correct: ${correct ? 'yes' : 'no'}` : '',
  ].filter(Boolean).join('\n');
}

async function askOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }
  const openaiRes = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: prompt,
    }),
  });

  const responseJson = await openaiRes.json();
  if (!openaiRes.ok) {
    throw new Error(responseJson.error?.message || 'OpenAI request failed.');
  }

  return extractText(responseJson);
}

async function askOllama(prompt) {
  const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
      stream: false,
      format: 'json',
      keep_alive: process.env.OLLAMA_KEEP_ALIVE || '30m',
      messages: [
        {
          role: 'system',
          content: 'You are a concise TOEIC vocabulary coach. Return valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      options: {
        temperature: 0.3,
        num_ctx: 1024,
        num_predict: 220,
      },
    }),
  });

  const responseJson = await ollamaRes.json().catch(() => ({}));
  if (!ollamaRes.ok) {
    throw new Error(
      responseJson.error
        || `Ollama is unavailable. Install Ollama, run "ollama pull ${process.env.OLLAMA_MODEL || 'llama3.1:8b'}", then restart npm run ai:server.`,
    );
  }

  return responseJson.message?.content || responseJson.response || '';
}

async function handleVocabCoach(req, res) {
  const rawBody = await readBody(req);
  const body = rawBody ? JSON.parse(rawBody) : {};
  const prompt = buildVocabPrompt(body);

  if (!prompt) {
    sendJson(res, 400, { error: 'word and meaning are required.' });
    return;
  }

  const provider = process.env.AI_PROVIDER || 'ollama';
  const cacheKey = `${provider}:${process.env.OLLAMA_MODEL || process.env.OPENAI_MODEL || ''}:${prompt}`;
  const cached = responseCache.get(cacheKey);
  if (cached) {
    sendJson(res, 200, { ...cached, cached: true });
    return;
  }

  const text = provider === 'openai'
    ? await askOpenAI(prompt)
    : await askOllama(prompt);

  const data = normalizeCoachPayload(parseModelJson(text));
  responseCache.set(cacheKey, data);
  sendJson(res, 200, data);
}

const VOCAB_FILE = resolve(process.cwd(), 'server', 'vocab.json');

function handleGetVocabSync(req, res) {
  try {
    if (!existsSync(VOCAB_FILE)) {
      sendJson(res, 200, []);
      return;
    }
    const data = JSON.parse(readFileSync(VOCAB_FILE, 'utf8'));
    sendJson(res, 200, data);
  } catch (error) {
    sendJson(res, 500, { error: 'Failed to read sync file.' });
  }
}

async function handlePostVocabSync(req, res) {
  try {
    const rawBody = await readBody(req);
    const list = rawBody ? JSON.parse(rawBody) : [];
    if (!Array.isArray(list)) {
      sendJson(res, 400, { error: 'Body must be a JSON array.' });
      return;
    }
    writeFileSync(VOCAB_FILE, JSON.stringify(list, null, 2), 'utf8');
    sendJson(res, 200, { ok: true, count: list.length });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function buildGrammarPrompt(body) {
  const category = String(body.category || '').trim();
  const question = String(body.question || '').trim();
  const options = Array.isArray(body.options) ? body.options.map(String) : [];
  const chosen = body.chosen ? String(body.chosen) : '';
  const correct = Boolean(body.correct);
  const explanation = String(body.explanation || '').trim();

  if (!category || !question) return null;

  return [
    'You are a expert TOEIC grammar coach for a Vietnamese learner.',
    'Explain the core grammatical rule tested in the question clearly and concisely in Vietnamese.',
    'Explain why the correct answer is correct and why the chosen option is wrong (if the learner got it wrong).',
    'Return JSON only with these exact keys: summary, memoryHook, commonTrap, toeicPattern, microDrill.',
    'microDrill must be an array of 2 short fill-in-the-blank sentences practicing the exact same grammar rule.',
    '',
    `Grammar Topic: ${category}`,
    `Question: ${question}`,
    `Options: ${options.join(', ')}`,
    `Learner selected: ${chosen}`,
    `Was selection correct: ${correct ? 'yes' : 'no'}`,
    `Reference explanation: ${explanation}`
  ].join('\n');
}

async function handleGrammarCoach(req, res) {
  const rawBody = await readBody(req);
  const body = rawBody ? JSON.parse(rawBody) : {};
  const prompt = buildGrammarPrompt(body);

  if (!prompt) {
    sendJson(res, 400, { error: 'category and question are required.' });
    return;
  }

  const provider = process.env.AI_PROVIDER || 'ollama';
  const cacheKey = `${provider}:${process.env.OLLAMA_MODEL || process.env.OPENAI_MODEL || ''}:${prompt}`;
  const cached = responseCache.get(cacheKey);
  if (cached) {
    sendJson(res, 200, { ...cached, cached: true });
    return;
  }

  const text = provider === 'openai'
    ? await askOpenAI(prompt)
    : await askOllama(prompt);

  const data = normalizeCoachPayload(parseModelJson(text));
  responseCache.set(cacheKey, data);
  sendJson(res, 200, data);
}

async function warmOllama() {
  if ((process.env.AI_PROVIDER || 'ollama') !== 'ollama') return;
  if (process.env.AI_WARMUP === '0') return;

  try {
    await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
        stream: false,
        keep_alive: process.env.OLLAMA_KEEP_ALIVE || '30m',
        messages: [{ role: 'user', content: 'ok' }],
        options: { num_predict: 1 },
      }),
    });
    console.log(`Warmed Ollama model ${process.env.OLLAMA_MODEL || 'llama3.1:8b'}`);
  } catch (error) {
    console.warn('Ollama warmup skipped:', error instanceof Error ? error.message : error);
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {});
      return;
    }

    if (req.method === 'GET' && req.url === '/api/health') {
      sendJson(res, 200, {
        ok: true,
        provider: process.env.AI_PROVIDER || 'ollama',
        hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
        model: process.env.AI_PROVIDER === 'openai'
          ? process.env.OPENAI_MODEL || 'gpt-4.1-mini'
          : process.env.OLLAMA_MODEL || 'llama3.1:8b',
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/ai/vocab-coach') {
      await handleVocabCoach(req, res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/ai/grammar-coach') {
      await handleGrammarCoach(req, res);
      return;
    }

    if (req.method === 'GET' && req.url === '/api/sync/vocab') {
      handleGetVocabSync(req, res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/sync/vocab') {
      await handlePostVocabSync(req, res);
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

server.listen(PORT, () => {
  console.log(`AI server listening on http://localhost:${PORT}`);
  warmOllama();
});
