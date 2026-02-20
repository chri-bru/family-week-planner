<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import NotebookTabs from '@lucide/svelte/icons/notebook-tabs';
	import { createPlanForUser } from '../../lib/api/plans.remote';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			<NotebookTabs />
		</Empty.Media>
		<Empty.Title>No available plans (yet)</Empty.Title>
		<Empty.Description>
			You haven't created any plans. Get started by creating your first one.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<form {...createPlanForUser} class="w-full space-y-2 p-4 md:w-96 lg:p-0">
			<div class="m-6 mb-10 text-left">
				<Field.Group>
					<Field.Field>
						<Field.Label for="planName">Name your plan</Field.Label>
						<Input type="text" id="planName" name="planName" placeholder="My family plan" />
					</Field.Field>
				</Field.Group>
			</div>
			<Button type="submit">Create Plan</Button>
		</form>
	</Empty.Content>
</Empty.Root>
