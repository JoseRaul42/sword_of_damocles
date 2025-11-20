/**
 * Machine/Device information model
 * Contains data about the user's device capabilities and characteristics
 */
export interface MachineInfo {
	/** Device type (e.g., "Desktop", "Mobile", "Tablet") */
	deviceType: string | null;

	/** Screen width in pixels */
	screenWidth: number | null;

	/** Screen height in pixels */
	screenHeight: number | null;

	/** Available screen width (excluding taskbars, etc.) */
	availableWidth: number | null;

	/** Available screen height (excluding taskbars, etc.) */
	availableHeight: number | null;

	/** Color depth in bits */
	colorDepth: number | null;

	/** Pixel ratio (e.g., 1, 2 for Retina displays) */
	pixelRatio: number | null;

	/** Timezone offset from UTC in minutes */
	timezoneOffset: number | null;

	/** Detected timezone name */
	timezone: string | null;

	/** Number of logical processor cores */
	hardwareConcurrency: number | null;

	/** Device memory in GB (if available) */
	deviceMemory: number | null;

	/** Maximum touch points (for touch devices) */
	maxTouchPoints: number | null;

	/** Whether cookies are enabled */
	cookiesEnabled: boolean;

	/** Whether Do Not Track is enabled */
	doNotTrack: string | null;
}

/**
 * Creates a default/empty MachineInfo object
 */
export function createEmptyMachineInfo(): MachineInfo {
	return {
		deviceType: null,
		screenWidth: null,
		screenHeight: null,
		availableWidth: null,
		availableHeight: null,
		colorDepth: null,
		pixelRatio: null,
		timezoneOffset: null,
		timezone: null,
		hardwareConcurrency: null,
		deviceMemory: null,
		maxTouchPoints: null,
		cookiesEnabled: false,
		doNotTrack: null
	};
}
