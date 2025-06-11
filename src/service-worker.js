import { build, files, version, prerendered } from '$service-worker';
import { precacheAndRoute } from 'workbox-precaching';

const cacheFiles = [...build, ...files, ...prerendered].map((files) => ({
	url: files,
	revision: version
}));

precacheAndRoute(cacheFiles);

self.addEventListener('install', (event) => {
	self.skipWaiting(); // Activating the new service worker on install
});

self.addEventListener('message', (event) => {
	if (event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});