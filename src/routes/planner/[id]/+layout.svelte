<script lang="ts">
	import { BottomNav } from '$lib/components/ui/bottom-nav';
	import { cn } from '$lib/utils';

	let { data, children } = $props();
</script>

<div class="relative flex w-full min-h-screen flex-col">
	<main class={cn('flex flex-1 flex-col pb-24')}>
		{@render children()}
	</main>
	<BottomNav familyId={data.familyId} />
</div>