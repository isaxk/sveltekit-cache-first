<script lang="ts">
	import { onUpdate } from '$lib/index.js';
	import { onMount } from 'svelte';

	let updateAvailable = $state(false);
	let acceptUpdate: (() => void) | null = $state(null);

	onMount(() => {
		onUpdate((onAccept) => {
			updateAvailable = true;
			acceptUpdate = onAccept;
		});
	});
</script>

{#if updateAvailable}
	<h2 class="">An update is available</h2>
	<button onclick={() => acceptUpdate?.()}>Accept</button>
{/if}
