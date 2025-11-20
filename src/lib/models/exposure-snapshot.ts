import type { NetworkInfo } from './network-info';
import type { OsInfo } from './os-info';
import type { MachineInfo } from './machine-info';

/**
 * Complete snapshot of all exposed user information
 */
export interface ExposureSnapshot {
	/** Network and geolocation information */
	network: NetworkInfo;

	/** Operating system information */
	os: OsInfo;

	/** Device/machine information */
	machine: MachineInfo;

	/** Timestamp when the snapshot was created */
	timestamp: number;
}

/**
 * Loading state for data fetching
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
