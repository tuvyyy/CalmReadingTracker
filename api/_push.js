import webpush from 'web-push';

const STORE_KEY = 'toeic:push:subscriptions';

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

export function pushConfig() {
  return {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
    subject: process.env.VAPID_SUBJECT || 'mailto:toeic-reminder@example.com',
    redis: redisConfig(),
  };
}

export function isPushConfigured() {
  const config = pushConfig();
  return Boolean(config.publicKey && config.privateKey && config.redis.url && config.redis.token);
}

export function configureWebPush() {
  const config = pushConfig();
  if (!config.publicKey || !config.privateKey) {
    throw new Error('Missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY.');
  }

  webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function redisCommand(command, ...args) {
  const { url, token } = redisConfig();
  if (!url || !token) {
    throw new Error('Missing KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN.');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Redis command failed: ${command}`);
  }
  return data.result;
}

export async function saveSubscription(record) {
  if (!record?.subscription?.endpoint) {
    throw new Error('Invalid push subscription.');
  }

  await redisCommand(
    'HSET',
    STORE_KEY,
    record.subscription.endpoint,
    JSON.stringify({
      ...record,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export async function deleteSubscription(endpoint) {
  if (!endpoint) return;
  await redisCommand('HDEL', STORE_KEY, endpoint);
}

export async function getSubscriptions() {
  const raw = await redisCommand('HGETALL', STORE_KEY);
  if (!raw) return [];

  const values = Array.isArray(raw)
    ? raw.filter((_, index) => index % 2 === 1)
    : Object.values(raw);

  return values
    .map(value => {
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export async function sendPush(record, payload) {
  configureWebPush();
  return webpush.sendNotification(record.subscription || record, JSON.stringify(payload));
}

export function sendJson(res, status, data) {
  res.status(status).json(data);
}
