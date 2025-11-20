// Models
export type { NetworkInfo } from './models/network-info';
export type { OsInfo } from './models/os-info';
export type { MachineInfo } from './models/machine-info';
export type { ExposureSnapshot, LoadingState } from './models/exposure-snapshot';
export { createEmptyNetworkInfo } from './models/network-info';
export { createEmptyOsInfo } from './models/os-info';
export { createEmptyMachineInfo } from './models/machine-info';

// Services
export { fetchNetworkInfo, fetchIpOnly } from './services/ipGeoService';
export { collectOsInfo, collectMachineInfo } from './services/browserInfoService';
export {
	saveSnapshot,
	loadSnapshot,
	clearSnapshot,
	hasStoredSnapshot
} from './services/storageService';

// ViewModels
export { createExposureViewModel } from './viewmodels/exposureViewModel.svelte';
export type { ExposureViewModel } from './viewmodels/exposureViewModel.svelte';

// Views
export { default as ExposureDashboard } from './views/ExposureDashboard.svelte';
export { default as NetworkCard } from './views/NetworkCard.svelte';
export { default as OsCard } from './views/OsCard.svelte';
export { default as MachineCard } from './views/MachineCard.svelte';
