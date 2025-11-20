<script lang="ts">
	import type { MachineInfo } from '../models/machine-info';

	interface Props {
		data: MachineInfo;
	}

	let { data }: Props = $props();

	const fields = $derived([
		{
			label: 'Device Type',
			value: data.deviceType,
			explanation: 'Detected device type. Used for responsive design and ad targeting.'
		},
		{
			label: 'Screen Resolution',
			value:
				data.screenWidth && data.screenHeight ? `${data.screenWidth} × ${data.screenHeight}` : null,
			explanation: "Your screen's pixel dimensions. Part of your device fingerprint."
		},
		{
			label: 'Available Screen',
			value:
				data.availableWidth && data.availableHeight
					? `${data.availableWidth} × ${data.availableHeight}`
					: null,
			explanation: 'Usable screen space excluding taskbars. Can reveal OS and display setup.'
		},
		{
			label: 'Pixel Ratio',
			value: data.pixelRatio ? `${data.pixelRatio}x` : null,
			explanation: 'Device pixel density. Indicates high-DPI displays (Retina, etc.).'
		},
		{
			label: 'Color Depth',
			value: data.colorDepth ? `${data.colorDepth}-bit` : null,
			explanation: 'Color bit depth. Another fingerprinting data point.'
		},
		{
			label: 'Timezone',
			value: data.timezone,
			explanation: 'Your detected timezone. Helps infer location and can expose VPN usage.'
		},
		{
			label: 'Timezone Offset',
			value:
				data.timezoneOffset !== null
					? `UTC ${data.timezoneOffset > 0 ? '-' : '+'}${Math.abs(data.timezoneOffset / 60)}`
					: null,
			explanation: 'Hours offset from UTC. Another location indicator.'
		},
		{
			label: 'CPU Cores',
			value: data.hardwareConcurrency,
			explanation: 'Number of logical CPU cores. Indicates device performance tier.'
		},
		{
			label: 'Device Memory',
			value: data.deviceMemory ? `${data.deviceMemory} GB` : null,
			explanation: 'Approximate RAM. Only available in Chrome. Helps fingerprint your device.'
		},
		{
			label: 'Touch Support',
			value:
				data.maxTouchPoints !== null && data.maxTouchPoints > 0
					? `Yes (${data.maxTouchPoints} points)`
					: 'No',
			explanation: 'Touch screen capability. Indicates mobile/tablet devices.'
		},
		{
			label: 'Cookies Enabled',
			value: data.cookiesEnabled ? 'Yes' : 'No',
			explanation: 'Whether your browser accepts cookies. Essential for tracking.'
		},
		{
			label: 'Do Not Track',
			value: data.doNotTrack || 'Not set',
			explanation: 'Your Do Not Track preference. Often ignored by trackers.'
		}
	]);

	const visibleFields = $derived(fields.filter((f) => f.value !== null && f.value !== undefined));
</script>

<div
	class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-orange-600/50 hover:shadow-lg hover:shadow-orange-600/10"
>
	<div class="border-b border-zinc-800 px-6 py-5">
		<h2 class="mb-2 text-2xl font-bold text-orange-600">Device & Hardware</h2>
		<p class="text-sm text-zinc-400">
			Information about your device capabilities and configuration
		</p>
	</div>

	<div class="space-y-6 px-6 py-5">
		{#if visibleFields.length === 0}
			<p class="text-zinc-500 italic">No machine data available</p>
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
