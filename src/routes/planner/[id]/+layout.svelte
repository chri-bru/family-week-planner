<script lang="ts">
	import { BottomNav } from '#lib/components/ui/bottom-nav/index.js';
	import { cn } from '#lib/utils.js';

	let { data, children } = $props();
</script>

<div class="relative flex min-h-screen w-full flex-col">
	<main class={cn('flex flex-1 flex-col pb-24')}>
		{@render children()}
	</main>
	<BottomNav familyId={data.familyId} />
</div>
