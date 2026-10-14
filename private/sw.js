// Shows notifications sent by the Cloudflare helper. It never sees your
// vault: the messages only contain counts like "3 things due today".

self.addEventListener('push', event => {
  let msg = {};
  try { msg = event.data ? event.data.json() : {}; } catch {}
  event.waitUntil(self.registration.showNotification(msg.title || 'Dashboard', {
    body: msg.body || 'Tap to open your dashboard.',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: 'dashboard',
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = wins.find(w => new URL(w.url).pathname.startsWith(new URL(self.registration.scope).pathname));
    if (open) return open.focus();
    return self.clients.openWindow(self.registration.scope);
  })());
});
