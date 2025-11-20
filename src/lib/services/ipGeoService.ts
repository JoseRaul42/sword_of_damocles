import type { NetworkInfo } from '../models/network-info';
import { createEmptyNetworkInfo } from '../models/network-info';

/**
 * Service for fetching IP address and geolocation data
 * Uses ipapi.co as a free, no-auth-required API
 */

/**
 * Response structure from ipapi.co
 */
interface IpApiResponse {
	ip?: string;
	city?: string;
	region?: string;
	country_name?: string;
	latitude?: number;
	longitude?: number;
	org?: string;
	postal?: string;
	timezone?: string;
	connection?: {
		type?: string;
	};
	// Additional fields available
	country_code?: string;
	region_code?: string;
}

/**
 * Fetches network and geolocation information from IP API
 * @returns NetworkInfo object with all available data
 */
export async function fetchNetworkInfo(): Promise<NetworkInfo> {
	try {
		// Using ipapi.co - free tier allows 1000 requests/day without API key
		// Alternative APIs if this one fails:
		// - https://api.ipify.org?format=json (IP only)
		// - https://ipwho.is/ (alternative with geo data)
		const response = await fetch('https://ipapi.co/json/', {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`IP API error: ${response.status}`);
		}

		const data: IpApiResponse = await response.json();

		// Parse ISP/Organization from the 'org' field
		// Usually in format "AS12345 ISP Name"
		const orgParts = data.org?.split(' ') || [];
		const isp = orgParts.length > 1 ? orgParts.slice(1).join(' ') : data.org || null;

		const networkInfo: NetworkInfo = {
			ip: data.ip || null,
			country: data.country_name || null,
			region: data.region || null,
			city: data.city || null,
			latitude: data.latitude || null,
			longitude: data.longitude || null,
			isp: isp,
			organization: data.org || null,
			connectionType: data.connection?.type || null,
			postalCode: data.postal || null,
			timezone: data.timezone || null
		};

		return networkInfo;
	} catch (error) {
		console.error('Failed to fetch network info:', error);
		// Return empty network info on error
		return createEmptyNetworkInfo();
	}
}

/**
 * Fallback: Fetch just the IP address
 * Used if the main API fails
 */
export async function fetchIpOnly(): Promise<string | null> {
	try {
		const response = await fetch('https://api.ipify.org?format=json');
		const data = await response.json();
		return data.ip || null;
	} catch (error) {
		console.error('Failed to fetch IP:', error);
		return null;
	}
}
