import { version, build, files } from '$service-worker';
import { setupServiceWorker } from '$lib/index.js';

setupServiceWorker(self, {
	version,
	build,
	files
});
