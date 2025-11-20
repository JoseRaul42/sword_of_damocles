/**
 * ExposureViewModel - MVVM ViewModel for the exposure dashboard
 *
 * This ViewModel encapsulates all business logic for:
 * - Fetching network, OS, and machine data
 * - Managing loading states
 * - Persisting data to localStorage
 * - Providing computed properties for the view
 *
 * Uses Svelte 5 runes for reactive state management
 */

import { fetchNetworkInfo } from '../services/ipGeoService';
import { collectOsInfo, collectMachineInfo } from '../services/browserInfoService';
import { loadSnapshot, saveSnapshot, clearSnapshot } from '../services/storageService';
import { createEmptyNetworkInfo } from '../models/network-info';
import { createEmptyOsInfo } from '../models/os-info';
import { createEmptyMachineInfo } from '../models/machine-info';
import type { ExposureSnapshot, LoadingState } from '../models/exposure-snapshot';
import type { NetworkInfo } from '../models/network-info';
import type { OsInfo } from '../models/os-info';
import type { MachineInfo } from '../models/machine-info';

/**
 * Creates an exposure view model instance
 * This function returns an object with reactive state and methods
 */
export function createExposureViewModel() {
	// Reactive state using Svelte 5 $state rune
	let loadingState = $state<LoadingState>('idle');
	let errorMessage = $state<string | null>(null);
	let networkInfo = $state<NetworkInfo>(createEmptyNetworkInfo());
	let osInfo = $state<OsInfo>(createEmptyOsInfo());
	let machineInfo = $state<MachineInfo>(createEmptyMachineInfo());
	let lastUpdated = $state<number | null>(null);

	// Derived/computed values using $derived rune
	const isLoading = $derived(loadingState === 'loading');
	const hasError = $derived(loadingState === 'error');
	const hasData = $derived(
		loadingState === 'success' &&
			(networkInfo.ip !== null || osInfo.osName !== null || machineInfo.deviceType !== null)
	);

	/**
	 * Loads data from localStorage if available
	 */
	function loadFromStorage(): boolean {
		const stored = loadSnapshot();
		if (stored) {
			networkInfo = stored.network;
			osInfo = stored.os;
			machineInfo = stored.machine;
			lastUpdated = stored.timestamp;
			loadingState = 'success';
			return true;
		}
		return false;
	}

	/**
	 * Collects all exposure data (network, OS, machine)
	 */
	async function collectExposureData(): Promise<void> {
		try {
			loadingState = 'loading';
			errorMessage = null;

			// Collect OS and machine info synchronously (browser APIs)
			osInfo = collectOsInfo();
			machineInfo = collectMachineInfo();

			// Fetch network info asynchronously (external API)
			networkInfo = await fetchNetworkInfo();

			// Create snapshot
			const snapshot: ExposureSnapshot = {
				network: networkInfo,
				os: osInfo,
				machine: machineInfo,
				timestamp: Date.now()
			};

			// Save to localStorage
			saveSnapshot(snapshot);
			lastUpdated = snapshot.timestamp;

			loadingState = 'success';
		} catch (error) {
			console.error('Failed to collect exposure data:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to collect data';
			loadingState = 'error';
		}
	}

	/**
	 * Initializes the view model
	 * Loads from storage first, then refreshes in the background
	 */
	async function initialize(): Promise<void> {
		// Try to load from storage first for instant display
		const hasStoredData = loadFromStorage();

		// Then refresh in the background
		if (hasStoredData) {
			// Don't block UI, refresh silently
			collectExposureData().catch((err) => {
				console.error('Background refresh failed:', err);
			});
		} else {
			// No stored data, show loading state
			await collectExposureData();
		}
	}

	/**
	 * Refreshes all data
	 */
	async function refresh(): Promise<void> {
		await collectExposureData();
	}

	/**
	 * Clears stored data and optionally refreshes
	 */
	async function clearData(andRefresh: boolean = true): Promise<void> {
		clearSnapshot();

		if (andRefresh) {
			// Reset state and collect fresh data
			networkInfo = createEmptyNetworkInfo();
			osInfo = createEmptyOsInfo();
			machineInfo = createEmptyMachineInfo();
			lastUpdated = null;
			await collectExposureData();
		} else {
			// Just reset everything
			networkInfo = createEmptyNetworkInfo();
			osInfo = createEmptyOsInfo();
			machineInfo = createEmptyMachineInfo();
			lastUpdated = null;
			loadingState = 'idle';
		}
	}

	// Return the view model interface
	return {
		// State (read-only from outside)
		get loadingState() {
			return loadingState;
		},
		get errorMessage() {
			return errorMessage;
		},
		get networkInfo() {
			return networkInfo;
		},
		get osInfo() {
			return osInfo;
		},
		get machineInfo() {
			return machineInfo;
		},
		get lastUpdated() {
			return lastUpdated;
		},

		// Derived values
		get isLoading() {
			return isLoading;
		},
		get hasError() {
			return hasError;
		},
		get hasData() {
			return hasData;
		},

		// Methods
		initialize,
		refresh,
		clearData
	};
}

// Type for the view model
export type ExposureViewModel = ReturnType<typeof createExposureViewModel>;
