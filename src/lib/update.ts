function getVersion(worker: ServiceWorker): Promise<string | null> {
	return new Promise((resolve) => {
		const channel = new MessageChannel();
		channel.port1.onmessage = (e) => resolve(e.data ?? null);
		worker.postMessage({ type: 'SKLOCALFIRST_GET_VERSION' }, [channel.port2]);
	});
}

async function checkVersionChanged(worker: ServiceWorker) {
	const version = await getVersion(worker);
	if (!version) return false;

	const lastPrompted = localStorage.getItem('lastPrompted');
	if (lastPrompted === version) return false;
	localStorage.setItem('lastPrompted', version);

	return true;
}

function handleAccept(worker: ServiceWorker) {
	worker.postMessage({ type: 'SKLOCALFIRST_SKIP_WAITING' });
}

export function onUpdate(handle: (onAccept: () => void) => void) {
	if (!('serviceWorker' in navigator)) {
		return () => {};
	}

	navigator.serviceWorker.getRegistration().then(async (reg) => {
		if (!reg) return;

		// 1️⃣ Detect if a waiting SW already exists
		if (reg.waiting) {
			const sw = reg.waiting;
			if (await checkVersionChanged(sw)) {
				handle(() => handleAccept(sw));
			}
		}

		// 2️⃣ Listen for new SW installations
		reg.addEventListener('updatefound', () => {
			const sw = reg.installing;
			if (!sw) return;

			sw.addEventListener('statechange', () => {
				if (sw.state === 'installed' && navigator.serviceWorker.controller) {
					// SW installed, new version waiting
					handle(() => handleAccept(sw));
				}
			});
		});
	});

	// 3️⃣ Reload page when the new SW takes control
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		window.location.reload();
	});

	return () => {};
}
