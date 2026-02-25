<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Family Week Planner</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center gap-8 bg-gray-50">
	<header class="w-full max-w-4xl px-4 py-4">
		<h1 class="text-center text-2xl font-bold">Family Week Planner</h1>
	</header>
	<main class="flex w-full max-w-4xl flex-1 flex-col items-center px-4 pb-8">
		{@render children()}
	</main>
</div>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
