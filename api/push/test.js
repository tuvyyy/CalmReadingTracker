import { isPushConfigured, readJson, saveSubscription, sendJson, sendPush } from '../_push.js';

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
    const record = {
      subscription: body.subscription,
      time: body.time || '20:00',
      timezone: body.timezone || 'Asia/Saigon',
      lang: body.lang || 'vi',
    };

    await saveSubscription(record);
    await sendPush(record, {
      title: body.lang === 'en' ? 'Water Spirit Reminder' : 'Water Spirit nhắc học',
      body: body.lang === 'en'
        ? 'Server push is working. This notification came from Vercel.'
        : 'Push server hoạt động rồi. Thông báo này được gửi từ Vercel.',
      targetPath: '/',
    });

    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Failed to send test push.' });
  }
}
