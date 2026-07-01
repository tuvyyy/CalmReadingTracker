self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      title: 'Water Spirit Reminder',
      body: event.data ? event.data.text() : 'Time to study TOEIC.',
      targetPath: '/',
    };
  }

  const title = payload.title || 'Water Spirit Reminder';
  const options = {
    body: payload.body || 'Time to study TOEIC.',
    icon: '/icon.png',
    badge: '/icon.png',
    tag: 'study-reminder',
    data: {
      targetPath: payload.targetPath || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data = event.notification.data || {};
  const targetPath = data.targetPath || '/';
  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    for (const client of clientList) {
      if ('navigate' in client && client.url !== targetUrl) {
        const navigatedClient = await client.navigate(targetUrl).catch(() => null);
        return (navigatedClient || client).focus();
      }

      return client.focus();
    }

    return clients.openWindow(targetUrl);
  })());
});
