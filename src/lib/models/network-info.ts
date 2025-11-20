/**
 * Network information model
 * Contains data about the user's IP address, geolocation, and ISP
 */
export interface NetworkInfo {
	/** Public IP address of the visitor */
	ip: string | null;

	/** Country name */
	country: string | null;

	/** Region/State name */
	region: string | null;

	/** City name */
	city: string | null;

	/** Latitude coordinate */
	latitude: number | null;

	/** Longitude coordinate */
	longitude: number | null;

	/** Internet Service Provider name */
	isp: string | null;

	/** Organization name */
	organization: string | null;

	/** Connection type (if available) */
	connectionType: string | null;

	/** Postal/ZIP code */
	postalCode: string | null;

	/** Timezone (e.g., "America/New_York") */
	timezone: string | null;
}

/**
 * Creates a default/empty NetworkInfo object
 */
export function createEmptyNetworkInfo(): NetworkInfo {
	return {
		ip: null,
		country: null,
		region: null,
		city: null,
		latitude: null,
		longitude: null,
		isp: null,
		organization: null,
		connectionType: null,
		postalCode: null,
		timezone: null
	};
}
