<script lang="ts">
	import type { PageProps } from '../../[protected]/dashboard/$types';
	import EmptyProject from './empty-project.svelte';

	let { data }: PageProps = $props();
</script>

{#if data.plans.length === 0}
	<EmptyProject />
{:else}
	<!-- render plans -->
{/if}
