import { build, files, version, prerendered } from '$service-worker';
import { precacheAndRoute } from 'workbox-precaching';

const cacheFiles = [...build, ...files, ...prerendered].map((files) => ({
	url: files,
	revision: version
}));

precacheAndRoute(cacheFiles);
