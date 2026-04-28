<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import type { Invitation } from '$lib/server/db/schema/invitations';
	import { onMount } from 'svelte';

	export let invitations: Invitation[] = [];
	export let loading = false;
	
	let refreshTimeout: number;

	const acceptInvitation = async (invitationId: string) => {
		try {
			const response = await fetch(`/api/invitations/${invitationId}/accept`, {
				method: 'POST'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to accept invitation');
			}

			// Remove the invitation from the list
			invitations = invitations.filter(inv => inv.id !== invitationId);
		} catch (err: any) {
			alert(err.message);
		}
	};

	const declineInvitation = async (invitationId: string) => {
		try {
			const response = await fetch(`/api/invitations/${invitationId}/decline`, {
				method: 'POST'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to decline invitation');
			}

			// Remove the invitation from the list
			invitations = invitations.filter(inv => inv.id !== invitationId);
		} catch (err: any) {
			alert(err.message);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	// Auto-refresh every 30 seconds
	onMount(() => {
		refreshTimeout = window.setInterval(() => {
			// In a real app, we would refetch the data here
			// For now, we'll just trigger a refetch by calling a function
			// that would be provided by the parent component
		}, 30000);

		return () => {
			if (refreshTimeout) {
				clearInterval(refreshTimeout);
			}
		};
	});
</script>

<div class="space-y-4">
	{#if loading}
		<div class="text-center py-8">
			<div class="inline-block animate-spin rounded-full border-2 border-primary/50 border-t-primary w-8 h-8"></div>
			<p class="mt-2 text-sm text-muted-foreground">Loading invitations...</p>
		</div>
	{:else if invitations.length === 0}
		<div class="text-center py-8">
			<p class="text-sm text-muted-foreground">No invitations found</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each invitations as invitation}
				<Card class="border">
					<CardHeader class="pb-4">
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<CardTitle class="text-sm font-medium">
									Invitation to join {invitation.familyName}
								</CardTitle>
								<p class="text-xs text-muted-foreground mt-1">
									From: {invitation.inviterName} • {formatDate(invitation.createdAt)}
								</p>
							</div>
							{#if invitation.status === 'pending'}
								<div class="flex items-baseline gap-2">
									<Button 
										variant="default" 
										size="sm" 
										on:click={() => acceptInvitation(invitation.id)}
										class="px-3 py-1"
									>
										Accept
									</Button>
									<Button 
										variant="destructive" 
										size="sm" 
										on:click={() => declineInvitation(invitation.id)}
										class="px-3 py-1"
									>
										Decline
									</Button>
								</div>
							{/if}
						</div>
					</CardHeader>
					{/* Content area for additional details */}
					<CardContent class="pt-0">
						{#if invitation.status !== 'pending'}
							<div class="text-xs text-center py-2">
								{#if invitation.status === 'accepted'}
									<span class="text-success">Accepted</span>
								{:else if invitation.status === 'declined'}
									<span class="text-destructive">Declined</span>
								{:else if invitation.status === 'expired'}
									<span class="text-muted-foreground">Expired</span>
								{/if}
							</div>
						{/if}
					</CardContent>
				</Card>
				<Separator class="my-2" />
			{/each}
		</div>
	{/if}
</div>
