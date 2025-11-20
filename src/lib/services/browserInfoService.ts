import type { OsInfo } from '../models/os-info';
import type { MachineInfo } from '../models/machine-info';
import { createEmptyOsInfo } from '../models/os-info';
import { createEmptyMachineInfo } from '../models/machine-info';

/**
 * Service for collecting browser, OS, and device information
 * Uses standard browser APIs - no external dependencies
 */

/**
 * Parses User Agent string to extract browser and OS information
 * Fallback for browsers that don't support navigator.userAgentData
 */
function parseUserAgent(ua: string): Partial<OsInfo> {
	const info: Partial<OsInfo> = {};

	// Detect OS
	if (ua.includes('Windows NT 10.0')) {
		info.osName = 'Windows';
		info.osVersion = '10/11';
	} else if (ua.includes('Windows NT 6.3')) {
		info.osName = 'Windows';
		info.osVersion = '8.1';
	} else if (ua.includes('Windows NT 6.2')) {
		info.osName = 'Windows';
		info.osVersion = '8';
	} else if (ua.includes('Windows NT 6.1')) {
		info.osName = 'Windows';
		info.osVersion = '7';
	} else if (ua.includes('Mac OS X')) {
		info.osName = 'macOS';
		const match = ua.match(/Mac OS X ([\d_]+)/);
		if (match) {
			info.osVersion = match[1].replace(/_/g, '.');
		}
	} else if (ua.includes('Android')) {
		info.osName = 'Android';
		const match = ua.match(/Android ([\d.]+)/);
		if (match) {
			info.osVersion = match[1];
		}
	} else if (ua.includes('iPhone') || ua.includes('iPad')) {
		info.osName = ua.includes('iPad') ? 'iPadOS' : 'iOS';
		const match = ua.match(/OS ([\d_]+)/);
		if (match) {
			info.osVersion = match[1].replace(/_/g, '.');
		}
	} else if (ua.includes('Linux')) {
		info.osName = 'Linux';
	} else if (ua.includes('CrOS')) {
		info.osName = 'Chrome OS';
	}

	// Detect browser
	if (ua.includes('Edg/')) {
		info.browserName = 'Edge';
		const match = ua.match(/Edg\/([\d.]+)/);
		if (match) info.browserVersion = match[1];
	} else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
		info.browserName = 'Chrome';
		const match = ua.match(/Chrome\/([\d.]+)/);
		if (match) info.browserVersion = match[1];
	} else if (ua.includes('Firefox/')) {
		info.browserName = 'Firefox';
		const match = ua.match(/Firefox\/([\d.]+)/);
		if (match) info.browserVersion = match[1];
	} else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
		info.browserName = 'Safari';
		const match = ua.match(/Version\/([\d.]+)/);
		if (match) info.browserVersion = match[1];
	}

	return info;
}

/**
 * Collects operating system information
 */
export function collectOsInfo(): OsInfo {
	const osInfo = createEmptyOsInfo();

	// Get user agent
	osInfo.userAgent = navigator.userAgent;

	// Try modern User-Agent Client Hints API first
	if ('userAgentData' in navigator) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const uaData = (navigator as any).userAgentData;

		if (uaData.platform) {
			osInfo.platform = uaData.platform;
		}

		// Browser info from userAgentData
		if (uaData.brands && Array.isArray(uaData.brands)) {
			for (const brand of uaData.brands) {
				// Skip generic brands
				if (!brand.brand.includes('Not') && !brand.brand.includes('Chromium')) {
					osInfo.browserName = brand.brand;
					osInfo.browserVersion = brand.version;
					break;
				}
			}
		}

		// Request high-entropy values (requires user permission in some browsers)
		if (uaData.getHighEntropyValues) {
			uaData
				.getHighEntropyValues([
					'platform',
					'platformVersion',
					'architecture',
					'model',
					'uaFullVersion'
				])
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.then((data: any) => {
					// This is async, but we'll handle it via the snapshot update
					console.log('High entropy data:', data);
				})
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.catch((err: any) => {
					console.warn('Could not get high entropy values:', err);
				});
		}
	}

	// Fallback to UA string parsing
	const parsedUA = parseUserAgent(navigator.userAgent);
	if (!osInfo.osName) osInfo.osName = parsedUA.osName || null;
	if (!osInfo.osVersion) osInfo.osVersion = parsedUA.osVersion || null;
	if (!osInfo.browserName) osInfo.browserName = parsedUA.browserName || null;
	if (!osInfo.browserVersion) osInfo.browserVersion = parsedUA.browserVersion || null;

	// Platform
	if (!osInfo.platform && 'platform' in navigator) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		osInfo.platform = (navigator as any).platform || null;
	}

	// Languages
	osInfo.primaryLanguage = navigator.language;
	osInfo.languages = navigator.languages ? Array.from(navigator.languages) : [navigator.language];

	return osInfo;
}

/**
 * Collects device/machine information
 */
export function collectMachineInfo(): MachineInfo {
	const machineInfo = createEmptyMachineInfo();

	// Screen information
	if (screen.width) machineInfo.screenWidth = screen.width;
	if (screen.height) machineInfo.screenHeight = screen.height;
	if (screen.availWidth) machineInfo.availableWidth = screen.availWidth;
	if (screen.availHeight) machineInfo.availableHeight = screen.availHeight;
	if (screen.colorDepth) machineInfo.colorDepth = screen.colorDepth;

	// Pixel ratio
	machineInfo.pixelRatio = window.devicePixelRatio || 1;

	// Timezone
	machineInfo.timezoneOffset = new Date().getTimezoneOffset();
	try {
		machineInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	} catch (e) {
		console.warn('Could not detect timezone:', e);
	}

	// Hardware
	if ('hardwareConcurrency' in navigator) {
		machineInfo.hardwareConcurrency = navigator.hardwareConcurrency || null;
	}

	// Device memory (Chrome only)
	if ('deviceMemory' in navigator) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		machineInfo.deviceMemory = (navigator as any).deviceMemory || null;
	}

	// Touch support
	machineInfo.maxTouchPoints = navigator.maxTouchPoints || 0;

	// Cookies
	machineInfo.cookiesEnabled = navigator.cookieEnabled;

	// Do Not Track
	if ('doNotTrack' in navigator) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		machineInfo.doNotTrack = (navigator as any).doNotTrack || null;
	}

	// Device type heuristic
	const ua = navigator.userAgent.toLowerCase();
	const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
	const isTablet = /ipad|tablet|playbook|silk/i.test(ua);

	if (isTablet) {
		machineInfo.deviceType = 'Tablet';
	} else if (isMobile) {
		machineInfo.deviceType = 'Mobile';
	} else {
		machineInfo.deviceType = 'Desktop';
	}

	return machineInfo;
}
