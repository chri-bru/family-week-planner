<script lang="ts">
	import type { Meal } from '$lib/server/db/schema/meals';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import CloseIcon from '@lucide/svelte/icons/x';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import MealItemList from './meal-item-list.svelte';

	let { date, meals }: { date: string; meals: Meal[] } = $props();

	let editMode: boolean = $state(false);

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const dayOfWeek = days[date.getDay()];
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		return `${dayOfWeek} (${day}-${month})`;
	}
</script>

<Card.Root class="-my-4 w-full max-w-sm">
	<Card.Header>
		<Card.Title>{formatDate(date)}</Card.Title>
		<Card.Action class="gap-4">
		{#if editMode}
			<Button onclick={() => (editMode = false)} variant="outline" size="icon-lg" aria-label="Close Edit Mode">
				<CloseIcon />
			</Button>
		{:else}
			<Button onclick={() => (editMode = true)} variant="outline" size="icon-lg" aria-label="Enter Edit Mode">
				<PencilIcon />
			</Button>
		{/if}
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<MealItemList meals={meals} {editMode}/>
	</Card.Content>
</Card.Root>
