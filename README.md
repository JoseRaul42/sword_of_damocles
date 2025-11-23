# The Sword of Damocles

[Sword Of Damocles](https://sword-of-damocles.vercel.app/)

A privacy-focused web application that reveals what personal and device information visitors leak just by visiting a website. Built to raise awareness about digital privacy and browser fingerprinting.

![Tech Stack](https://img.shields.io/badge/SvelteKit-2.47-orange)
![Svelte](https://img.shields.io/badge/Svelte-5.41-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-cyan)

## 🎯 Project Overview

**The Sword of Damocles** demonstrates the vast amount of information that websites can collect about visitors through:

- Public IP address and geolocation
- Operating system and browser details
- Device capabilities and characteristics

This tool is designed for **educational purposes only** to increase awareness about:

- Digital privacy concerns
- Browser fingerprinting techniques
- The data trail left by everyday web browsing

### Key Features

- **Real-time Data Collection**: Gathers network, OS, and machine information instantly
- **Client-Side Only**: All processing happens in your browser
- **No Database Required**: Perfect for deployment to Vercel or any static host
- **Privacy Focused**: Data stored only in browser's localStorage
- **Beautiful UI**: Interior design-inspired aesthetic with black textured background and orange-red accents

## 🛠️ Tech Stack

- **[SvelteKit 2.47.1](https://kit.svelte.dev/)** - Full-stack framework for Svelte
- **[Svelte 5.41.0](https://svelte.dev/)** - Modern reactive UI framework with runes
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type safety and improved DX
- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-first CSS framework
- **ESLint & Prettier** - Code quality and formatting
- **Vite 7.1** - Lightning-fast build tool

## 🏗️ Architecture: MVVM Pattern

This project follows the **Model-View-ViewModel (MVVM)** architectural pattern, adapted for SvelteKit and Svelte 5:

```
src/
├── lib/
│   ├── models/              # Data structures (Models)
│   │   ├── network-info.ts
│   │   ├── os-info.ts
│   │   ├── machine-info.ts
│   │   └── exposure-snapshot.ts
│   ├── viewmodels/          # Business logic (ViewModels)
│   │   └── exposureViewModel.svelte.ts
│   ├── services/            # Data fetching & persistence
│   │   ├── ipGeoService.ts
│   │   ├── browserInfoService.ts
│   │   └── storageService.ts
│   └── views/               # UI Components (Views)
│       ├── ExposureDashboard.svelte
│       ├── NetworkCard.svelte
│       ├── OsCard.svelte
│       └── MachineCard.svelte
└── routes/
    ├── +layout.svelte       # Root layout with theming
    ├── +page.svelte         # Main page using the dashboard
    └── +page.ts             # Client-side only configuration
```

### MVVM Components Explained

#### Models (`src/lib/models/`)

TypeScript interfaces defining data structures:

- **`network-info.ts`**: IP address, geolocation, ISP data
- **`os-info.ts`**: Operating system, browser, language preferences
- **`machine-info.ts`**: Device type, screen, hardware capabilities
- **`exposure-snapshot.ts`**: Root model containing all collected data

#### ViewModels (`src/lib/viewmodels/`)

**`exposureViewModel.svelte.ts`** - The central orchestrator using Svelte 5 runes:

- Manages reactive state with `$state`
- Provides computed properties with `$derived`
- Coordinates all services
- Handles loading/error states
- Implements data refresh and clearing logic

#### Services (`src/lib/services/`)

Business logic layer (no UI, no state):

- **`ipGeoService.ts`**: Fetches IP and geolocation from external API
- **`browserInfoService.ts`**: Collects OS and device info from browser APIs
- **`storageService.ts`**: localStorage persistence operations

#### Views (`src/lib/views/`)

Svelte components that display data:

- **`ExposureDashboard.svelte`**: Main composition, controls, disclaimer
- **`NetworkCard.svelte`**: Displays network/geo information
- **`OsCard.svelte`**: Displays OS information
- **`MachineCard.svelte`**: Displays device information

## 📊 Data Fetching Logic - Exact Locations

### Network Info (IP + Geolocation)

**Where**: `src/lib/services/ipGeoService.ts`

**Primary Function**: `fetchNetworkInfo()`

**Flow**:

1. `fetchNetworkInfo()` in `ipGeoService.ts` makes HTTPS request to `https://ipapi.co/json/`
2. Parses response into `NetworkInfo` model structure
3. Returns data including:
   - IP address
   - Country, region, city, postal code
   - Latitude/longitude (approximate)
   - ISP and organization
   - Timezone

**Called From**: `exposureViewModel.svelte.ts` → `collectExposureData()` method

**API Used**: [ipapi.co](https://ipapi.co) - Free tier (1000 requests/day, no API key required)

**Alternative APIs** (documented in code):

- `https://api.ipify.org?format=json` (IP only)
- `https://ipwho.is/` (alternative with geo data)

### OS Info & Machine Info

**Where**: `src/lib/services/browserInfoService.ts`

**Functions**:

- `collectOsInfo()` - Returns `OsInfo` object
- `collectMachineInfo()` - Returns `MachineInfo` object

**Data Sources** (all standard browser APIs):

- `navigator.userAgent` - User agent string
- `navigator.userAgentData` - Modern User-Agent Client Hints API
- `navigator.language` / `navigator.languages` - Language preferences
- `navigator.platform` - OS platform
- `screen.width`, `screen.height`, `screen.colorDepth` - Display info
- `window.devicePixelRatio` - Pixel density
- `navigator.hardwareConcurrency` - CPU cores
- `navigator.deviceMemory` - Device RAM (Chrome only)
- `navigator.maxTouchPoints` - Touch support
- `Intl.DateTimeFormat().resolvedOptions().timeZone` - Timezone detection

**Called From**: `exposureViewModel.svelte.ts` → `collectExposureData()` method (synchronous)

### LocalStorage Persistence

**Where**: `src/lib/services/storageService.ts`

**Functions**:

- `saveSnapshot(snapshot: ExposureSnapshot)` - Saves data to localStorage
- `loadSnapshot()` - Loads data from localStorage
- `clearSnapshot()` - Removes stored data
- `hasStoredSnapshot()` - Checks if data exists

**Storage Key**: `'sword-of-damocles-exposure-data'`

**Called From**: `exposureViewModel.svelte.ts`:

- `initialize()` - Loads on startup via `loadFromStorage()`
- `collectExposureData()` - Saves after successful collection
- `clearData()` - Clears via `clearSnapshot()`

**Data Structure**:

```typescript
{
  version: "1.0",
  snapshot: {
    network: NetworkInfo,
    os: OsInfo,
    machine: MachineInfo,
    timestamp: number
  }
}
```

## 🚀 How to Run & Develop

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **pnpm** (or npm/yarn)

### Install Dependencies

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
pnpm build
```

This creates an optimized production build in the `build/` directory.

### Preview Production Build

```bash
pnpm preview
```

### Type Checking

```bash
pnpm check
```

### Linting

```bash
pnpm lint
```

### Format Code

```bash
pnpm format
```


### What This Tool Doesn't Show

- **Advanced fingerprinting**: Canvas fingerprinting, WebGL fingerprinting, audio fingerprinting
- **Cookies & tracking pixels**: Third-party tracking mechanisms
- **Browser extensions**: Information about installed extensions (though some can be inferred)
- **True private data**: Contacts, files, camera, microphone (requires explicit permissions)

### Privacy & Data Storage

- **No server-side storage**: We do not save any data to a database or send it to our servers
- **Third-party API**: Network info is fetched from ipapi.co (see their [privacy policy](https://ipapi.co/privacy/))
- **LocalStorage only**: Data persists only in your browser's localStorage
- **Full control**: You can clear stored data at any time using the "Clear My Data" button

### Educational Purpose

This tool is intended to:

- Raise awareness about digital privacy
- Demonstrate common data collection techniques
- Encourage users to consider privacy tools (VPNs, privacy-focused browsers, etc.)

**This tool should not be used for**:

- Malicious tracking or fingerprinting
- Privacy violation
- Data harvesting


**Remember**: Privacy is a right, not a privilege. Use this tool to educate, not to exploit.
