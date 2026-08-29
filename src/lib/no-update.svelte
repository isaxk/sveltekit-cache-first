<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { onUpdate } from './client.ts';

	let { children }: { children?: Snippet } = $props();

	let updateAvailable = $state(false);
	onMount(() => {
		onUpdate(() => {
			updateAvailable = true;
		});
	});
</script>

{#if !updateAvailable}
	{@render children?.()}
{/if}
