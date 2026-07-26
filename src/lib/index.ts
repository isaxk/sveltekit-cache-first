// Reexport your entry components here
import { setupServiceWorker } from "./sw.ts"
import UpdateAvailable from "./update-available.svelte"
import { onUpdate } from "./update.ts"

export {
  setupServiceWorker,
  onUpdate,
  UpdateAvailable
}
