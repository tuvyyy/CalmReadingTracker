import { isPushConfigured, readJson, saveSubscription, sendJson } from '../_push.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!isPushConfigured()) {
    sendJson(res, 503, { error: 'Web Push is not configured on the server.' });
    return;
  }

  try {
    const body = await readJson(req);
    await saveSubscription({
      subscription: body.subscription,
      time: body.time || '20:00',
      timezone: body.timezone || 'Asia/Saigon',
      lang: body.lang || 'vi',
      userAgent: req.headers['user-agent'] || '',
      createdAt: new Date().toISOString(),
    });

    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 400, { error: error instanceof Error ? error.message : 'Failed to save subscription.' });
  }
}
