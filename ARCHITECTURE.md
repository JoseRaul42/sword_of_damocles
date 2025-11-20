# Architecture Documentation

## Overview

The Sword of Damocles follows the **MVVM (Model-View-ViewModel)** architectural pattern, adapted for SvelteKit and Svelte 5 with runes.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        USER                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    VIEWS (Svelte Components)            │
│  ┌────────────────────────────────────────────────┐    │
│  │  ExposureDashboard.svelte                      │    │
│  │    ├── NetworkCard.svelte                      │    │
│  │    ├── OsCard.svelte                           │    │
│  │    └── MachineCard.svelte                      │    │
│  └────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ Data Binding ($props, events)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              VIEW MODELS (Business Logic)               │
│  ┌────────────────────────────────────────────────┐    │
│  │  exposureViewModel.svelte.ts                   │    │
│  │    - Reactive state ($state)                   │    │
│  │    - Computed values ($derived)                │    │
│  │    - Orchestration methods                     │    │
│  │    - Loading/error state management            │    │
│  └────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ Service calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 SERVICES (Data Layer)                   │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ ipGeoService.ts │  │ browserInfo  │  │ storage  │  │
│  │                 │  │ Service.ts   │  │ Service  │  │
│  │ - fetchNetwork  │  │ - collectOs  │  │ - save   │  │
│  │   Info()        │  │   Info()     │  │ - load   │  │
│  │ - fetchIpOnly() │  │ - collectMa  │  │ - clear  │  │
│  │                 │  │   chineInfo()│  │          │  │
│  └─────────────────┘  └──────────────┘  └──────────┘  │
└───────┬───────────────────────────────────────┬─────────┘
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌─────────────────┐
│  External APIs   │                  │  Browser APIs   │
│  - ipapi.co      │                  │  - navigator    │
│  - ipify.org     │                  │  - window       │
│  - ipwho.is      │                  │  - screen       │
└──────────────────┘                  │  - Intl         │
                                      │  - localStorage │
                                      └─────────────────┘
                     ▲
                     │ Type Definitions
┌─────────────────────────────────────────────────────────┐
│                    MODELS (Data Types)                  │
│  ┌────────────────────────────────────────────────┐    │
│  │  network-info.ts  - NetworkInfo interface      │    │
│  │  os-info.ts       - OsInfo interface           │    │
│  │  machine-info.ts  - MachineInfo interface      │    │
│  │  exposure-snapshot.ts - ExposureSnapshot       │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Models (Pure Data)

**Location**: `src/lib/models/`

**Purpose**: Define data structures as TypeScript interfaces

**Files**:

- `network-info.ts` - IP, location, ISP data structure
- `os-info.ts` - Operating system and browser data
- `machine-info.ts` - Device capabilities
- `exposure-snapshot.ts` - Root data container

**Characteristics**:

- No logic, only type definitions
- Factory functions for creating empty instances
- Exported interfaces for type safety

**Example**:

```typescript
export interface NetworkInfo {
	ip: string | null;
	country: string | null;
	// ... more fields
}

export function createEmptyNetworkInfo(): NetworkInfo {
	return { ip: null, country: null /* ... */ };
}
```

### 2. Services (Data Operations)

**Location**: `src/lib/services/`

**Purpose**: Stateless functions for data fetching and persistence

**Files**:

- `ipGeoService.ts` - External API calls for IP/geo
- `browserInfoService.ts` - Browser API data collection
- `storageService.ts` - localStorage operations

**Characteristics**:

- Pure functions (no state)
- Error handling built-in
- Single responsibility per service
- Returns typed data (Models)

**Example**:

```typescript
export async function fetchNetworkInfo(): Promise<NetworkInfo> {
	try {
		const response = await fetch('https://ipapi.co/json/');
		const data = await response.json();
		return mapToNetworkInfo(data);
	} catch (error) {
		console.error(error);
		return createEmptyNetworkInfo();
	}
}
```

### 3. ViewModels (Business Logic)

**Location**: `src/lib/viewmodels/`

**Purpose**: Manage reactive state and orchestrate services

**Files**:

- `exposureViewModel.svelte.ts` - Main application logic

**Characteristics**:

- Uses Svelte 5 runes (`$state`, `$derived`)
- Coordinates multiple services
- Manages loading/error states
- Provides computed properties
- Implements user actions (refresh, clear)

**Svelte 5 Runes Usage**:

```typescript
export function createExposureViewModel() {
	// Reactive state
	let loadingState = $state<LoadingState>('idle');
	let networkInfo = $state<NetworkInfo>(createEmptyNetworkInfo());

	// Computed values
	const isLoading = $derived(loadingState === 'loading');
	const hasData = $derived(networkInfo.ip !== null);

	// Methods
	async function initialize() {
		/* ... */
	}
	async function refresh() {
		/* ... */
	}

	return {
		get loadingState() {
			return loadingState;
		},
		get isLoading() {
			return isLoading;
		},
		get hasData() {
			return hasData;
		},
		initialize,
		refresh
	};
}
```

### 4. Views (UI Components)

**Location**: `src/lib/views/`

**Purpose**: Render UI and handle user interactions

**Files**:

- `ExposureDashboard.svelte` - Main layout and composition
- `NetworkCard.svelte` - Network data display
- `OsCard.svelte` - OS data display
- `MachineCard.svelte` - Machine data display

**Characteristics**:

- Receive data via props (`$props`)
- Delegate logic to ViewModel
- Pure presentation (minimal logic)
- Responsive design with Tailwind

**Example**:

```svelte
<script lang="ts">
	import type { NetworkInfo } from '../models/network-info';

	interface Props {
		data: NetworkInfo;
	}

	let { data }: Props = $props();

	const hasData = $derived(data.ip !== null);
</script>

<div class="card">
	{#if hasData}
		<p>{data.ip}</p>
	{:else}
		<p>No data</p>
	{/if}
</div>
```

## Data Flow

### Initialization Flow

```
1. User visits page (+page.svelte)
   ↓
2. ViewModel created (createExposureViewModel())
   ↓
3. ExposureDashboard mounts (onMount)
   ↓
4. ViewModel.initialize() called
   ↓
5. Try loadSnapshot() from localStorage
   ↓ (if found)
6. Display cached data immediately
   ↓ (always)
7. collectExposureData() in background
   ↓
8. Call services in parallel:
   - collectOsInfo() (sync)
   - collectMachineInfo() (sync)
   - fetchNetworkInfo() (async)
   ↓
9. Save snapshot to localStorage
   ↓
10. Update UI (reactive)
```

### User Action Flow (Refresh)

```
1. User clicks "Refresh Data"
   ↓
2. Button calls viewModel.refresh()
   ↓
3. ViewModel sets loadingState = 'loading'
   ↓
4. UI shows loading spinner (reactive)
   ↓
5. collectExposureData() runs
   ↓
6. Services fetch new data
   ↓
7. Data saved to localStorage
   ↓
8. ViewModel updates state
   ↓
9. UI re-renders with new data
```

### User Action Flow (Clear Data)

```
1. User clicks "Clear My Data"
   ↓
2. Confirmation dialog
   ↓ (if confirmed)
3. Button calls viewModel.clearData(true)
   ↓
4. ViewModel calls clearSnapshot()
   ↓
5. localStorage.removeItem() executed
   ↓
6. ViewModel resets state to empty
   ↓
7. collectExposureData() runs
   ↓
8. Fresh data displayed
```

## Reactivity System (Svelte 5 Runes)

### $state - Reactive Variables

Used for data that changes over time and triggers UI updates:

```typescript
let loadingState = $state<LoadingState>('idle');
let networkInfo = $state<NetworkInfo>(createEmptyNetworkInfo());
```

When these change, all references update automatically.

### $derived - Computed Values

Used for values derived from state:

```typescript
const isLoading = $derived(loadingState === 'loading');
const hasData = $derived(networkInfo.ip !== null);
```

Automatically recomputes when dependencies change.

### $props - Component Props

Used for passing data to components:

```svelte
<script lang="ts">
	interface Props {
		data: NetworkInfo;
	}

	let { data }: Props = $props();
</script>
```

Reactive by default, updates when parent passes new data.

## State Management Strategy

### Local State (ViewModel)

- Loading states
- Error messages
- Current data snapshot
- Computed properties

### Persistent State (localStorage)

- Complete exposure snapshot
- Timestamp
- Version number

### No Global State

- No stores needed
- Single ViewModel instance per page
- Props for component communication

## Error Handling

### Service Layer

- Try-catch around all async operations
- Return empty/null values on error
- Log errors to console
- Never throw to caller

### ViewModel Layer

- Catch service errors
- Set error state
- Display error message
- Provide retry mechanism

### View Layer

- Display error states
- Provide user actions (retry, clear)
- Graceful degradation (show partial data)

## Performance Considerations

### Initial Load

1. Load from localStorage immediately (instant display)
2. Refresh data in background (progressive enhancement)
3. No blocking API calls on mount

### Data Collection

- Synchronous browser APIs (fast)
- Single async API call (geo data)
- Parallel execution where possible

### Rendering

- Component-level reactivity (fine-grained updates)
- No unnecessary re-renders
- Efficient list rendering with `{#each}`

### Bundle Size

- Tree-shaking friendly
- No heavy dependencies
- Code splitting by route (automatic with SvelteKit)

## Security Considerations

### Client-Side Only

- No sensitive data on server
- No database to breach
- No API keys in code (public API)

### Data Privacy

- localStorage only (user's device)
- No analytics by default
- No third-party tracking
- Clear data option available

### API Safety

- CORS-enabled public APIs only
- Rate limit awareness
- Fallback to alternative APIs
- Error handling for API failures

## Testing Strategy

### Unit Tests (Recommended)

- Test services independently
- Mock fetch for API calls
- Test factory functions

### Component Tests (Recommended)

- Test view components in isolation
- Mock ViewModel data
- Test user interactions

### E2E Tests (Optional)

- Full user flows
- Browser compatibility
- Real API calls

## Extending the Architecture

### Adding New Data Points

1. **Update Model**:

   ```typescript
   // src/lib/models/machine-info.ts
   export interface MachineInfo {
   	// ... existing fields
   	newField: string | null;
   }
   ```

2. **Update Service**:

   ```typescript
   // src/lib/services/browserInfoService.ts
   export function collectMachineInfo(): MachineInfo {
   	return {
   		// ... existing fields
   		newField: navigator.newProperty || null
   	};
   }
   ```

3. **Update View**:
   ```svelte
   <!-- src/lib/views/MachineCard.svelte -->
   <div class="field-group">
   	<dt>New Field</dt>
   	<dd>{data.newField}</dd>
   </div>
   ```

No ViewModel changes needed! The existing flow handles it.

### Adding New Features

Follow MVVM principles:

1. **Model** - Define data structure
2. **Service** - Implement data operation
3. **ViewModel** - Add reactive state and methods
4. **View** - Create UI components

Example: Adding export functionality

1. **Service**:

   ```typescript
   // src/lib/services/exportService.ts
   export function exportAsJson(data: ExposureSnapshot): void {
   	const json = JSON.stringify(data, null, 2);
   	const blob = new Blob([json], { type: 'application/json' });
   	const url = URL.createObjectURL(blob);
   	const a = document.createElement('a');
   	a.href = url;
   	a.download = 'exposure-data.json';
   	a.click();
   }
   ```

2. **ViewModel**:

   ```typescript
   // Add to exposureViewModel.svelte.ts
   function exportData(): void {
   	const snapshot: ExposureSnapshot = {
   		network: networkInfo,
   		os: osInfo,
   		machine: machineInfo,
   		timestamp: Date.now()
   	};
   	exportAsJson(snapshot);
   }

   return {
   	// ... existing
   	exportData
   };
   ```

3. **View**:
   ```svelte
   <!-- Add to ExposureDashboard.svelte -->
   <button onclick={() => viewModel.exportData()}> Export Data </button>
   ```

## Conclusion

This architecture provides:

- ✅ Clear separation of concerns
- ✅ Easy to test
- ✅ Scalable and maintainable
- ✅ Type-safe with TypeScript
- ✅ Modern Svelte 5 patterns
- ✅ Client-side focused (Vercel-friendly)

The MVVM pattern ensures that adding features, fixing bugs, and maintaining the codebase remains straightforward as the project grows.
