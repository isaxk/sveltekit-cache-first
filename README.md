# SvelteKit Local First

A small library to make your SvelteKit Web App / PWA local first.

## Setup

```bash
npm install @isaxk/sveltekit-local-first
```

```js
// src/service-worker.js
import { version, build, files } from '$service-worker';
import { setupServiceWorker } from '@isaxk/sveltekit-local-first';

setupServiceWorker(self, { version, build, files });
```

```js
// src/routes/+layout.svelte
// Example using toast from svelte-sonner
import { toast } from 'svelte-sonner';
import { onUpdate } from '@isaxk/sveltekit-local-first';

onMount(() => {
	onUpdate((accept) => {
		// Your notification logic here, eg:
		toast('An update is available', {
			description: 'Refresh the page to update',
			action: {
				label: 'Refresh',
				onClick: () => accept()
			}
		});
	});
});
```

## Config

```js
// default values
const options = {
  cachePageData: false, // Cache _data.json: data returned by load functions
  ignoredRoutes: ['/api'] // Routes to always fetch fresh for
}

setupServiceWorker(self, { version, build, files, options });
