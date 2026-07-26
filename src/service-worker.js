import { version, build, files } from '$service-worker';
import { setupServiceWorker } from '$lib/sw.js';

setupServiceWorker(self, {
	version,
	build,
	files
});
