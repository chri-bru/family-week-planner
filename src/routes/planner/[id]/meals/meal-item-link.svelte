<script lang="ts">
	import * as Item from '$lib/components/ui/item/index.js';
	import type { Meal } from '$lib/server/db/schema/meals';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	let { meal }: { meal: Meal } = $props();
</script>

<a href={meal.link}>
	<Item.Root>
		<Item.Content>
			<Item.Title>{meal.name}</Item.Title>
			<Item.Description>{meal.type}</Item.Description>
		</Item.Content>
		<Item.Actions>
			<ExternalLinkIcon class="size-4" />
		</Item.Actions>
	</Item.Root>
</a>
