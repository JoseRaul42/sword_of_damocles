<script lang="ts">
	import ExposureDashboard from '$lib/views/ExposureDashboard.svelte';
	import { createExposureViewModel } from '$lib/viewmodels/exposureViewModel.svelte';

	// Create the view model instance
	const viewModel = createExposureViewModel();
</script>

<svelte:head>
	<title>The Sword of Damocles - What Websites Know About You</title>
	<meta
		name="description"
		content="Discover what personal and device information you leak just by visiting a website. An educational tool for digital privacy awareness."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<ExposureDashboard {viewModel} />
