/**
 * Operating System information model
 * Contains data about the user's OS, browser, and language preferences
 */
export interface OsInfo {
	/** Operating system name (e.g., "Windows", "macOS", "Linux", "Android", "iOS") */
	osName: string | null;

	/** Operating system version */
	osVersion: string | null;

	/** Platform/architecture (e.g., "x86", "ARM") */
	platform: string | null;

	/** Browser name (e.g., "Chrome", "Firefox", "Safari") */
	browserName: string | null;

	/** Browser version */
	browserVersion: string | null;

	/** Primary language (e.g., "en-US") */
	primaryLanguage: string | null;

	/** All preferred languages */
	languages: string[];

	/** Full user agent string */
	userAgent: string | null;
}

/**
 * Creates a default/empty OsInfo object
 */
export function createEmptyOsInfo(): OsInfo {
	return {
		osName: null,
		osVersion: null,
		platform: null,
		browserName: null,
		browserVersion: null,
		primaryLanguage: null,
		languages: [],
		userAgent: null
	};
}
