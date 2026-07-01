import { deleteSubscription, getSubscriptions, isPushConfigured, sendJson, sendPush } from '../_push.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  if (process.env.CRON_SECRET) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${process.env.CRON_SECRET}` && req.headers['user-agent'] !== 'vercel-cron/1.0') {
      sendJson(res, 401, { error: 'Unauthorized.' });
      return;
    }
  }

  if (!isPushConfigured()) {
    sendJson(res, 503, { error: 'Web Push is not configured on the server.' });
    return;
  }

  const records = await getSubscriptions();
  let sent = 0;
  let failed = 0;

  for (const record of records) {
    const lang = record.lang || 'vi';
    try {
      await sendPush(record, {
        title: lang === 'en' ? 'Water Spirit Reminder' : 'Water Spirit nhắc học',
        body: lang === 'en'
          ? 'Time for one focused TOEIC round today.'
          : 'Tới giờ học rồi. Vào làm một lượt TOEIC ngắn nha.',
        targetPath: '/tests?tab=syllabus',
      });
      sent++;
    } catch (error) {
      failed++;
      const statusCode = error?.statusCode || error?.status;
      if (statusCode === 404 || statusCode === 410) {
        await deleteSubscription(record.subscription?.endpoint);
      }
    }
  }

  sendJson(res, 200, { ok: true, total: records.length, sent, failed });
}
