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
