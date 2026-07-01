export interface PushServerConfig {
  enabled: boolean;
  publicKey: string;
  hasVapid: boolean;
  hasStore: boolean;
}

export interface PushSubscribeInput {
  time: string;
  lang: string;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

export async function getPushServerConfig(): Promise<PushServerConfig> {
  const res = await fetch('/api/push/config');
  if (!res.ok) {
    return { enabled: false, publicKey: '', hasVapid: false, hasStore: false };
  }
  return res.json();
}

async function getReadyRegistration() {
  if (!navigator.serviceWorker.controller) {
    await navigator.serviceWorker.register('/sw.js');
  }
  return navigator.serviceWorker.ready;
}

export async function getPushSubscriptionState() {
  if (!isPushSupported()) return { supported: false, subscribed: false };
  const registration = await getReadyRegistration();
  const subscription = await registration.pushManager.getSubscription();
  return { supported: true, subscribed: Boolean(subscription) };
}

export async function subscribeToServerPush(input: PushSubscribeInput) {
  if (!isPushSupported()) {
    throw new Error('Trình duyệt này chưa hỗ trợ Web Push.');
  }

  const config = await getPushServerConfig();
  if (!config.enabled || !config.publicKey) {
    throw new Error('Push server chưa cấu hình VAPID/KV trên Vercel.');
  }

  let permission = Notification.permission;
  if (permission !== 'granted') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') {
    throw new Error('Bạn chưa cho phép thông báo.');
  }

  const registration = await getReadyRegistration();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(config.publicKey),
  });

  const payload = {
    subscription,
    time: input.time,
    lang: input.lang,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Saigon',
  };

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Không lưu được push subscription.');
  }

  return subscription;
}

export async function sendServerPushTest(input: PushSubscribeInput) {
  const subscription = await subscribeToServerPush(input);
  const res = await fetch('/api/push/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription,
      time: input.time,
      lang: input.lang,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Saigon',
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Không gửi được push test.');
  }
}
