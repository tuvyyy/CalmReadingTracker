self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data = event.notification.data || {};
  const targetPath = data.targetPath || (data.callerName ? `/?call=${encodeURIComponent(data.callerName)}` : '/');
  const targetUrl = new URL(targetPath, self.location.origin).href;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    for (const client of clientList) {
      if (data.callerName && !data.targetPath) {
        client.postMessage({
          type: 'TRIGGER_VIRTUAL_CALL',
          callerName: data.callerName,
        });
        return client.focus();
      }

      if ('navigate' in client && client.url !== targetUrl) {
        const navigatedClient = await client.navigate(targetUrl).catch(() => null);
        return (navigatedClient || client).focus();
      }

      return client.focus();
    }

    return clients.openWindow(targetUrl);
  })());
});
