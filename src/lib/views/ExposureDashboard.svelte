<script lang="ts">
	import { onMount } from 'svelte';
	import type { ExposureViewModel } from '../viewmodels/exposureViewModel.svelte';
	import NetworkCard from './NetworkCard.svelte';
	import OsCard from './OsCard.svelte';
	import MachineCard from './MachineCard.svelte';

	interface Props {
		viewModel: ExposureViewModel;
	}

	let { viewModel }: Props = $props();

	// Initialize on mount
	onMount(() => {
		viewModel.initialize();
	});

	// Format last updated timestamp
	const lastUpdatedText = $derived.by(() => {
		if (!viewModel.lastUpdated) return null;
		const date = new Date(viewModel.lastUpdated);
		return date.toLocaleString();
	});

	async function handleRefresh() {
		await viewModel.refresh();
	}

	async function handleClearData() {
		if (confirm('This will clear your stored data and collect fresh data. Continue?')) {
			await viewModel.clearData(true);
		}
	}
</script>

<div class="min-h-screen w-full px-4 py-8 md:px-8 md:py-12">
	<!-- Hero Section -->
<section class="min-h-screen flex items-center justify-center px-4">
	<header class="mb-16 md:mb-20 max-w-4xl text-center">
		<h1
			class="mb-6 text-4xl leading-none font-bold tracking-tight text-orange-600 md:mb-8 md:text-6xl lg:text-7xl"
		>
			The Internet: Our Modern Sword of Damocles
		</h1>

		<div class="space-y-6 text-base leading-relaxed md:space-y-8 md:text-lg">
			<p class="text-zinc-300">
				The internet gives us incredible power—knowledge, communication, and convenience right at
				our fingertips. But like the story of the Sword of Damocles, that power comes with a hidden
				danger:
				<strong class="font-semibold text-orange-500">
					the constant exposure of our personal data
				</strong>.
			</p>

			<p class="text-zinc-400">
				Every site you visit reveals pieces of who you are—your IP address, location, device
				details, browsing habits. Separately they seem harmless, but together they form a clear
				picture of your identity.
			</p>

			<div class="my-8 space-y-3 md:my-10">
				<p class="text-lg font-medium text-orange-600 md:text-xl">The "sword" is your data.</p>
				<p class="text-lg font-medium text-orange-500 md:text-xl">
					The thin "strand" holding it up is your awareness.
				</p>
			</div>

			<div class="space-y-4 text-zinc-400">
				<p>
					If you ignore it, you risk exposing more than you realize.<br />
					If you understand it, you can protect yourself—using better settings, privacy tools,
					and safer habits.
				</p>

				<p class="text-zinc-300">
					<strong class="font-semibold text-orange-500">Technology isn't the enemy.</strong><br />
					Using it blindly is.
				</p>
			</div>

		</div>
	</header>
</section>


	<!-- Loading State -->
	{#if viewModel.isLoading && !viewModel.hasData}
		<div class="flex flex-col items-center justify-center py-20">
			<div
				class="spinner h-12 w-12 rounded-full border-4 border-orange-600/30 border-t-orange-600"
			></div>
			<p class="mt-6 text-lg text-zinc-400">Collecting your digital footprint...</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if viewModel.hasError}
		<div class="flex flex-col items-center justify-center py-20">
			<svg
				class="mb-4 h-16 w-16 text-red-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<p class="mb-6 text-lg text-zinc-400">Failed to collect data: {viewModel.errorMessage}</p>
			<button
				class="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-orange-700"
				onclick={handleRefresh}
			>
				Try Again
			</button>
		</div>
	{/if}

	<!-- Data Display -->
	{#if viewModel.hasData}
		<!-- Controls -->
		<div
			class="mb-8 flex flex-col items-start justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-4 md:flex-row md:items-center"
		>
			<div class="flex-1">
				{#if lastUpdatedText}
					<p class="text-sm text-zinc-400">
						<span class="mr-2 text-zinc-500">Last updated:</span>
						<span class="font-mono text-orange-600">{lastUpdatedText}</span>
					</p>
				{/if}
			</div>
			<div class="flex gap-3">
				<button
					class="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
					onclick={handleRefresh}
					disabled={viewModel.isLoading}
				>
					{viewModel.isLoading ? 'Refreshing...' : 'Refresh Data'}
				</button>
				<button
					class="rounded-lg border border-red-800 bg-red-900/50 px-4 py-2 text-sm font-semibold text-red-400 transition-colors duration-200 hover:bg-red-900/70 disabled:cursor-not-allowed disabled:opacity-50"
					onclick={handleClearData}
					disabled={viewModel.isLoading}
				>
					Clear My Data
				</button>
			</div>
		</div>

		<!-- Cards Grid -->
		<div class="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
			<NetworkCard data={viewModel.networkInfo} />
			<OsCard data={viewModel.osInfo} />
			<MachineCard data={viewModel.machineInfo} />
		</div>

		<!-- Disclaimer -->
		<div class="mt-16 rounded-lg border border-zinc-800 bg-zinc-900/30 p-8">
			<h3 class="mb-4 text-xl font-bold text-orange-600">Privacy Notice</h3>
			<div class="space-y-4 text-sm leading-relaxed text-zinc-400">
				<p class="mb-3">
					This tool is designed for <strong class="font-semibold text-zinc-300"
						>educational purposes only</strong
					> to raise awareness about digital privacy and browser fingerprinting.
				</p>
				<p class="mb-3">
					<strong class="font-semibold text-zinc-300">What we collect:</strong> All data processing happens
					in your browser. Network information is fetched from a third-party IP geolocation API (ipapi.co).
					OS and device data is collected from standard browser APIs.
				</p>
				<p class="mb-3">
					<strong class="font-semibold text-zinc-300">What we store:</strong> Data is saved only to your
					browser's localStorage for convenience. We do not send any data to our servers or any database.
					You can clear this data at any time using the "Clear My Data" button above.
				</p>
				<p class="mb-3">
					<strong class="font-semibold text-zinc-300">Limitations:</strong> This tool only shows information
					that any website can typically access through standard browser APIs and IP lookup services.
					More sophisticated tracking techniques exist but are not demonstrated here.
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
