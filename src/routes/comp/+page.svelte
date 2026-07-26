<script>
	import { UpdateAvailable } from '$lib/index.js';
</script>

<UpdateAvailable>
	{#snippet children({ accept })}
		<h2 class="">An update is available</h2>
		<button onclick={() => accept()}>Accept</button>
	{/snippet}
</UpdateAvailable>
