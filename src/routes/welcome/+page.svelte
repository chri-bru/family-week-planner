<script lang="ts">
	import { onMount } from 'svelte';
	// Components
	import * as Empty from '$lib/components/ui/empty/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import SquareUserRound from '@lucide/svelte/icons/square-user-round';
	import { goto } from '$app/navigation';
	import { addUser } from '$lib/api/users.remote';
	import * as Field from '$lib/components/ui/field';
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			<SquareUserRound />
		</Empty.Media>
		<Empty.Title>Welcome to your family week planner</Empty.Title>
		<Empty.Description>Please introduce yourself.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<form {...addUser} class="w-full space-y-2 p-4 md:w-96 lg:p-0">
			<div class="m-6 mb-10 text-left">
				<Field.Group>
					<Field.Field>
						<Field.Label for="username">Username</Field.Label>
						<Input type="text" id="username" name="username" placeholder="Enter your username" />
						<Field.Description>This is your display name</Field.Description>
					</Field.Field>
				</Field.Group>
			</div>
			<div>
				<Button type="submit">Submit</Button>
			</div>
		</form>
	</Empty.Content>
</Empty.Root>
