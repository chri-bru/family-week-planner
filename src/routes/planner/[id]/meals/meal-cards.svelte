<script lang="ts">
	import type { Meal } from '$lib/server/db/schema/meals';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import CloseIcon from '@lucide/svelte/icons/x';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import MealItemList from './meal-item-list.svelte';
	import type { Snippet } from 'svelte';

	let { date, meals, children }: { date: string; meals: Meal[]; children: Snippet } = $props();

	let editMode: boolean = $state(false);

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const dayOfWeek = days[date.getDay()];
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		return `${dayOfWeek} (${day}-${month})`;
	}

	const isToday = (dateStr: string): boolean => {
		const today = new Date();
		const date = new Date(dateStr);
		return (
			today.getDate() === date.getDate() &&
			today.getMonth() === date.getMonth() &&
			today.getFullYear() === date.getFullYear()
		);
	};
</script>

<Card.Root class="w-full max-w-sm {isToday(date) ? 'border-2 border-primary' : ''}">
	<Card.Header>
		<Card.Title>{formatDate(date)}</Card.Title>
		<Card.Action class="gap-4">
			{#if meals.length > 0}
				{#if editMode}
					<Button
						onclick={() => (editMode = false)}
						variant="outline"
						size="icon-lg"
						aria-label="Close Edit Mode"
					>
						<CloseIcon />
					</Button>
				{:else}
					<Button
						onclick={() => (editMode = true)}
						variant="outline"
						size="icon-lg"
						aria-label="Enter Edit Mode"
					>
						<PencilIcon />
					</Button>
				{/if}
			{/if}
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<MealItemList {meals} {editMode} />
	</Card.Content>
	<Card.Footer class="flex justify-end">
		{@render children()}
	</Card.Footer>
</Card.Root>
