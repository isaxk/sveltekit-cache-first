# SvelteKit Cache First

A small library to make your SvelteKit Web App / PWA use a cache first approach: instant second visit loads and fast performance on poor network conditions.

## Setup

```bash
npm install sveltekit-cache-first
```

```js
// src/service-worker.js
import { version, build, files } from '$service-worker';
import { setupServiceWorker } from 'sveltekit-cache-first/sw';

setupServiceWorker(self, { version, build, files });
```

#### Component method
```svelte
<script>
	import { UpdateAvailable } from 'sveltekit-cache-first';
</script>

<UpdateAvailable>
	{#snippet children({ accept })}
		<h2>An update is available</h2>
		<p>Refresh to update</p>
		<button onclick={() => accept()}>Refresh</button>
	{/snippet}
</UpdateAvailable>

<!-- Optional -->
<!-- Note: This will disappear after the update has been detected, which may take a few seconds to appear. Only use this if your app must always be running the latest version. And if that is that is the case, strongly consider if cache-first is the right approach, or use other methods like api versioning. -->
<NoUpdate>
	Main logic here
</NoUpdate>
```

#### Custom handler method, using [svelte-sonner](https://github.com/wobsoriano/svelte-sonner)
```js
// src/routes/+layout.svelte
import { toast } from 'svelte-sonner';
import { onUpdate } from 'sveltekit-cache-first';

onMount(() => {
	onUpdate((accept) => {
		// Your notification logic here, eg:
		toast('An update is available', {
			description: 'Refresh to update',
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
};

setupServiceWorker(self, { version, build, files, options });
```
