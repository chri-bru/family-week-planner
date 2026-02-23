<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import Utensils from '@lucide/svelte/icons/utensils';
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			<Utensils />
		</Empty.Media>
		<Empty.Title>No available meals (yet)</Empty.Title>
		<Empty.Description>
			You haven't created any meals.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<!-- Create meals -->
	</Empty.Content>
</Empty.Root>
