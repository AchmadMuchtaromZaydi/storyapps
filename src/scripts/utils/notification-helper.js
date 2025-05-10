import CONFIG from '../config';
import API from '../data/api'; // perbaikan path import

// Fungsi untuk subscribe push notification
export async function subscribePushNotifications() {
  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });
  }

  const token = localStorage.getItem('token');
  if (!token) throw new Error("Pengguna belum login");

  const { endpoint, keys } = subscription.toJSON();

  return await API.subscribePushNotification({
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  }, token);
}

// Fungsi untuk menampilkan notifikasi manual dari client
export async function sendStoryNotification({ title, body }) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      body,
    });
  }
}

// Fungsi pembantu untuk mengubah base64 VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
