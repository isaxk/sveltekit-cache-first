<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { onUpdate } from './client.ts';

	let { children }: { children?: Snippet<[{ accept: () => void }]> } = $props();

	let handleAccept: (() => void) | null = $state(null);
	onMount(() => {
		onUpdate((accept) => {
			handleAccept = accept;
		});
	});
</script>

{#if handleAccept !== null}
	{@render children?.({ accept: handleAccept })}
{/if}
