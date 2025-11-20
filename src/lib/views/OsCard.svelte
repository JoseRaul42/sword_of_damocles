<script lang="ts">
	import type { OsInfo } from '../models/os-info';

	interface Props {
		data: OsInfo;
	}

	let { data }: Props = $props();

	const fields = $derived([
		{
			label: 'Operating System',
			value: data.osName ? `${data.osName}${data.osVersion ? ` ${data.osVersion}` : ''}` : null,
			explanation:
				'Your OS and version. Reveals device type and potential security vulnerabilities.'
		},
		{
			label: 'Platform',
			value: data.platform,
			explanation: 'Hardware platform/architecture. Helps fingerprint your specific device.'
		},
		{
			label: 'Browser',
			value: data.browserName
				? `${data.browserName}${data.browserVersion ? ` ${data.browserVersion}` : ''}`
				: null,
			explanation: 'Your browser and version. Used for compatibility and fingerprinting.'
		},
		{
			label: 'Primary Language',
			value: data.primaryLanguage,
			explanation: 'Your preferred language. Can indicate your location and cultural background.'
		},
		{
			label: 'All Languages',
			value: data.languages.length > 0 ? data.languages.join(', ') : null,
			explanation: 'All your language preferences. Part of your unique browser fingerprint.'
		},
		{
			label: 'User Agent',
			value: data.userAgent,
			explanation:
				'Complete user agent string. Contains detailed browser, OS, and device information.',
			mono: true
		}
	]);

	const visibleFields = $derived(fields.filter((f) => f.value !== null));
</script>

<div
	class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-orange-600/50 hover:shadow-lg hover:shadow-orange-600/10"
>
	<div class="border-b border-zinc-800 px-6 py-5">
		<h2 class="mb-2 text-2xl font-bold text-orange-600">Operating System</h2>
		<p class="text-sm text-zinc-400">Information about your software environment and browser</p>
	</div>

	<div class="space-y-6 px-6 py-5">
		{#if visibleFields.length === 0}
			<p class="text-zinc-500 italic">No OS data available</p>
		{:else}
			{#each visibleFields as field (field.label)}
				<div class="border-b border-zinc-800/50 pb-6 last:border-b-0 last:pb-0">
					<dt class="mb-1 text-xs font-semibold tracking-wider text-orange-500/80 uppercase">
						{field.label}
					</dt>
					<dd class="mb-2 font-mono text-lg text-white" class:break-all={field.mono}>
						{field.value}
					</dd>
					<p class="text-sm leading-relaxed text-zinc-500">{field.explanation}</p>
				</div>
			{/each}
		{/if}
	</div>
</div>
