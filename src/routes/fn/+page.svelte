<script lang="ts">
  import { onUpdate } from "$lib/client.js";
  import { onMount } from "svelte";

  let updateAvailable = $state(false);
  let testCount = $state(0);
  let acceptUpdate: (() => void) | null = $state(null);

  onMount(() => {
    onUpdate((onAccept) => {
      updateAvailable = true;
      testCount += 1;
      acceptUpdate = onAccept;
    });
  });
</script>

{#if updateAvailable}
  <h2 class="">An update is available</h2>
  <button onclick={() => acceptUpdate?.()}>Accept</button>
  <p>Test count: {testCount}</p>
{:else}
  <p>No update available</p>
{/if}
