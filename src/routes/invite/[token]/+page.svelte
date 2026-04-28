<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { acceptInvitationAction } from './invitations.remote';

	let { data } = $props();

	const isLoggedIn = $state(!!data.user);
	const isMember = $state(data.isMember);
	const family = $state(data.family);

	let declineResult = $state<{
		success: boolean;
		message: string;
	}>();

</script>

<Card class="w-full max-w-md">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<UserPlus class="size-5" />
			Join family
		</CardTitle>
	</CardHeader>
	<CardContent>
		{#if isMember}
			<div class="flex flex-col items-center gap-4 py-4">
				<p class="text-center text-muted-foreground">
					You are already a member of {family.name}
				</p>
				<Button href="/planner/{family.id}/dashboard">Go to Family</Button>
			</div>
		{:else if !isLoggedIn}
			<div class="space-y-4">
				<p class="text-center text-muted-foreground">
					Sign in or create an account to join this family
				</p>
				<div class="flex flex-col gap-2">
					<Button href="/auth/login?redirect=/invite/{data.token}" variant="default">
						Sign In
					</Button>
					<Button href="/auth/register?redirect=/invite/{data.token}" variant="outline">
						Create Account
					</Button>
				</div>
			</div>
		{:else}
			<p class="text-center text-muted-foreground">
				Would you like to join family <strong>{family.name}</strong>?
			</p>
			{#if acceptInvitationAction.result?.success}
				<div class="mt-4 rounded-md bg-green-50 p-4 text-center dark:bg-green-900/20">
					<p class="text-sm text-green-700 dark:text-green-400">{acceptInvitationAction.result.message}</p>
					{#if acceptInvitationAction.result?.familyId}
						<Button href="/planner/{acceptInvitationAction.result.familyId}/dashboard" class="mt-2">
							Go to Family
						</Button>
					{/if}
				</div>
			{/if}
			{#if declineResult?.success}
				<div class="mt-4 rounded-md bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
					<p class="text-sm text-yellow-700 dark:text-yellow-400">{declineResult.message}</p>
				</div>
			{/if}
		{/if}
	</CardContent>
	{#if isLoggedIn && !isMember && !acceptInvitationAction.result?.success && !declineResult?.success}
		<CardFooter class="flex gap-2">
			<form
				{...acceptInvitationAction}
				class="flex-1"
			>
				<Button type="submit" class="w-full">
					<Check class="size-4" />
					Join
				</Button>
			</form>
			<div class="flex-1">
				<Button onclick={() => { declineResult = {
					success: true,
					message: 'Invitation declined. You can rejoin using the same link anytime.',
				}}} variant="outline" class="w-full">
					<X class="size-4" />
					Decline
				</Button>
			</div>
		</CardFooter>
	{/if}
</Card>