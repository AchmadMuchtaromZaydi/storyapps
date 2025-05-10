import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

// ✅ Do precaching – langsung gunakan self.__WB_MANIFEST
precacheAndRoute(self.__WB_MANIFEST);

// ✅ Runtime caching

registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  ({ url }) =>
    url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

registerRoute(
  ({ url }) => url.origin === 'https://ui-avatars.com',
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// ✅ Gunakan BASE_URL literal langsung (bukan import)
const BASE_API_URL = 'https://story-api.dicoding.dev/v1';

registerRoute(
  ({ request, url }) =>
    url.origin === new URL(BASE_API_URL).origin && request.destination !== 'image',
  new NetworkFirst({
    cacheName: 'story-api',
  }),
);

registerRoute(
  ({ request, url }) =>
    url.origin === new URL(BASE_API_URL).origin && request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
  }),
);

registerRoute(
  ({ url }) => url.origin.includes('maptiler'),
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);

self.addEventListener('push', (event) => {
  console.log('[Service worker] pushing...');

  async function showNotification() {
    const data = await event.data.json();

    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(showNotification());
});
