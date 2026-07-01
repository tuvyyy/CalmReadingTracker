import { isPushConfigured, pushConfig, sendJson } from '../_push.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const config = pushConfig();
  sendJson(res, 200, {
    enabled: isPushConfigured(),
    publicKey: config.publicKey,
    hasVapid: Boolean(config.publicKey && config.privateKey),
    hasStore: Boolean(config.redis.url && config.redis.token),
  });
}
