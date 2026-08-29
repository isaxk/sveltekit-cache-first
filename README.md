<<<<<<< HEAD
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
=======
# Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.16.6 create --template library --types ts --install pnpm sveltekit-cache-first
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
>>>>>>> b1866e7 (Fix imports and double updates)
```
