<script lang="ts">
	import type { NetworkInfo } from '../models/network-info';

	interface Props {
		data: NetworkInfo;
	}

	let { data }: Props = $props();

	const fields = $derived([
		{
			label: 'IP Address',
			value: data.ip,
			explanation:
				'Your public IP address. Can be used to track your online activity and approximate location.'
		},
		{
			label: 'Country',
			value: data.country,
			explanation:
				'Your country based on IP address. Used for geo-targeting and content restrictions.'
		},
		{
			label: 'Region / State',
			value: data.region,
			explanation: 'Your state or region. Narrows down your location significantly.'
		},
		{
			label: 'City',
			value: data.city,
			explanation: 'Your city. Can reveal your general location when combined with other data.'
		},
		{
			label: 'Postal Code',
			value: data.postalCode,
			explanation: 'Your postal/ZIP code. Pinpoints your location to a neighborhood level.'
		},
		{
			label: 'Coordinates',
			value:
				data.latitude && data.longitude
					? `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`
					: null,
			explanation: 'Approximate latitude and longitude. Can be used to map your location.'
		},
		{
			label: 'Timezone',
			value: data.timezone,
			explanation: 'Your timezone. Helps infer your location and can be used for timing attacks.'
		},
		{
			label: 'ISP',
			value: data.isp,
			explanation:
				'Your Internet Service Provider. Can reveal your network and potentially your identity.'
		},
		{
			label: 'Organization',
			value: data.organization,
			explanation: 'Network organization. May indicate corporate, educational, or public networks.'
		},
		{
			label: 'Connection Type',
			value: data.connectionType,
			explanation:
				'Type of internet connection (if detectable). Can indicate mobile vs. fixed broadband.'
		}
	]);

	const visibleFields = $derived(fields.filter((f) => f.value !== null));
</script>

<div
	class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-orange-600/50 hover:shadow-lg hover:shadow-orange-600/10"
>
	<div class="border-b border-zinc-800 px-6 py-5">
		<h2 class="mb-2 text-2xl font-bold text-orange-600">Network & Location</h2>
		<p class="text-sm text-zinc-400">
			Information leaked through your IP address and network connection
		</p>
	</div>

	<div class="space-y-6 px-6 py-5">
		{#if visibleFields.length === 0}
			<p class="text-zinc-500 italic">No network data available</p>
		{:else}
			{#each visibleFields as field (field.label)}
				<div class="border-b border-zinc-800/50 pb-6 last:border-b-0 last:pb-0">
					<dt class="mb-1 text-xs font-semibold tracking-wider text-orange-500/80 uppercase">
						{field.label}
					</dt>
					<dd class="mb-2 font-mono text-lg text-white">{field.value}</dd>
					<p class="text-sm leading-relaxed text-zinc-500">{field.explanation}</p>
				</div>
			{/each}
		{/if}
	</div>
</div>
