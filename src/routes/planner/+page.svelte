<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";

	let { data } = $props();
</script>

<p>{data.plans.length} plans available</p>
	<!-- render plans -->

{#each data.plans as plan}
    <Button href="/planner/{plan.id}/dashboard">{plan.name}</Button>
{/each}