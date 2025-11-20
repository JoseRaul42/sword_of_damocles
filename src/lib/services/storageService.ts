import type { ExposureSnapshot } from '../models/exposure-snapshot';

/**
 * Service for persisting data to localStorage
 * All storage operations are client-side only
 */

const STORAGE_KEY = 'sword-of-damocles-exposure-data';
const STORAGE_VERSION = '1.0';

/**
 * Stored data structure with versioning
 */
interface StoredData {
	version: string;
	snapshot: ExposureSnapshot;
}

/**
 * Saves exposure snapshot to localStorage
 * @param snapshot - The exposure snapshot to save
 */
export function saveSnapshot(snapshot: ExposureSnapshot): void {
	try {
		if (typeof window === 'undefined' || !window.localStorage) {
			console.warn('localStorage not available');
			return;
		}

		const data: StoredData = {
			version: STORAGE_VERSION,
			snapshot
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		console.log('Snapshot saved to localStorage');
	} catch (error) {
		console.error('Failed to save snapshot to localStorage:', error);
		// Handle quota exceeded or other storage errors gracefully
	}
}

/**
 * Loads exposure snapshot from localStorage
 * @returns The stored snapshot, or null if not found or invalid
 */
export function loadSnapshot(): ExposureSnapshot | null {
	try {
		if (typeof window === 'undefined' || !window.localStorage) {
			return null;
		}

		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return null;
		}

		const data: StoredData = JSON.parse(raw);

		// Validate version (for future compatibility)
		if (data.version !== STORAGE_VERSION) {
			console.warn('Stored data version mismatch, clearing old data');
			clearSnapshot();
			return null;
		}

		console.log('Snapshot loaded from localStorage');
		return data.snapshot;
	} catch (error) {
		console.error('Failed to load snapshot from localStorage:', error);
		return null;
	}
}

/**
 * Clears stored snapshot from localStorage
 */
export function clearSnapshot(): void {
	try {
		if (typeof window === 'undefined' || !window.localStorage) {
			return;
		}

		localStorage.removeItem(STORAGE_KEY);
		console.log('Snapshot cleared from localStorage');
	} catch (error) {
		console.error('Failed to clear snapshot from localStorage:', error);
	}
}

/**
 * Checks if a snapshot exists in localStorage
 */
export function hasStoredSnapshot(): boolean {
	try {
		if (typeof window === 'undefined' || !window.localStorage) {
			return false;
		}

		return localStorage.getItem(STORAGE_KEY) !== null;
	} catch {
		return false;
	}
}
