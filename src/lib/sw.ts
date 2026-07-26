
type Options = {
  cachePageData?: boolean
  ignoredPaths?: string[]
};

const defaultOptions: Options = {
  cachePageData: true,
  ignoredPaths: ['/api'],
};

export function setupServiceWorker(
	self: ServiceWorkerGlobalScope,
  {
    version,
    build,
    files,
    options
  }: {
    version: string;
    build: string[];
    files: string[];
    options?: Options;
	}
) {
	const CACHE = `cache-${version}`;
  const ASSETS = [...build, ...files];

  options = options ? {...defaultOptions, ...options} : defaultOptions;

	self.addEventListener('install', (event) => {
		event.waitUntil(
			(async () => {
				const cache = await caches.open(CACHE);
				await cache.addAll(ASSETS);

				// Ensure the SPA shell is cached
				if (!ASSETS.includes('/')) {
					await cache.add('/');
				}
			})()
		);
	});

	self.addEventListener('activate', (event) => {
		event.waitUntil(
			(async () => {
				for (const key of await caches.keys()) {
					if (key !== CACHE) {
						await caches.delete(key);
					}
				}
				await self.clients.claim();
			})()
		);
	});

	self.addEventListener('fetch', (event) => {
		const url = new URL(event.request.url);

		let skipCache = false;

		if (event.request.method !== 'GET') skipCache = true;

		// Never cache SvelteKit page data
		if (!options.cachePageData && url.pathname.endsWith('/__data.json')) skipCache = true;

		// Never cache ignored routes
		if (options.ignoredPaths?.some((route) => url.pathname.startsWith(route))) skipCache = true;

		if (skipCache) return;

		event.respondWith(cacheFirstWithSpaFallback(event));
	});

	async function cacheFirstWithSpaFallback(event: FetchEvent) {
		const cache = await caches.open(CACHE);
		const cachedResponse = await cache.match(event.request);

		const isNavigation =
			event.request.mode === 'navigate' ||
			event.request.headers.get('accept')?.includes('text/html');

		// Start background update
		const networkUpdate = fetch(event.request)
			.then((response) => {
				if (response && response.status === 200) {
					cache.put(event.request, response.clone());
				}
				return response;
			})
			.catch(() => undefined);

		event.waitUntil(networkUpdate);

		// 1️⃣ Serve cache immediately
		if (cachedResponse) {
			return cachedResponse;
		}

		// 2️⃣ Try network
		const networkResponse = await networkUpdate;
		if (networkResponse) {
			return networkResponse;
		}

		// 3️⃣ Offline navigation → serve SPA shell
		if (isNavigation) {
			const shell = await cache.match('/');
			if (shell) {
				return shell;
			}
		}

		throw new Error('No cached response and network unavailable');
	}

	self.addEventListener('message', (event) => {
		if (event.data?.type === 'SKLOCALFIRST_GET_VERSION') {
			console.log('SW received message', event.data, 'ports', event.ports);
			if (event.data?.type === 'SKLOCALFIRST_GET_VERSION') {
				const port = event.ports[0];
				if (port) {
					port.postMessage(version);
				} else {
					console.warn('No port received!');
				}
			}
		}

		if (event.data?.type === 'SKLOCALFIRST_SKIP_WAITING') {
			self.skipWaiting();
		}
	});
}
