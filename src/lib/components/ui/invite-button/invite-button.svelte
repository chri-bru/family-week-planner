<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import type { Family } from '$lib/server/db/schema/family-plans';
	import { onMount } from 'svelte';

	export let family: Family;
	export let open = false;

	let email = '';
	let loading = false;
	let error: string | null = null;
	let successMessage: string | null = null;

	const sendInvitation = async () => {
		if (!email.trim()) {
			error = 'Please enter an email address';
			return;
		}

		loading = true;
		error = null;
		successMessage = null;

		try {
			const response = await fetch('/api/invitations/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					familyId: family.id,
					inviteeEmail: email
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to send invitation');
			}

			const data = await response.json();
			successMessage = 'Invitation sent successfully!';
			email = '';
			
			// Reset after a delay
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	};

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			sendInvitation();
		}
	}

	// Close dialog when clicking outside
	function handleOutsideClick(event: MouseEvent) {
		const dialog = event.currentTarget as HTMLElement;
		if (!dialog.contains(event.target as Node)) {
			open = false;
		}
	}
</script>

{#if open}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" on:click={handleOutsideClick}>
	<div class="relative w-full max-w-md mx-auto p-4">
		<Dialog class="fixed inset-0" open={open}>
			<DialogTrigger asChild>
				<div />
			</DialogTrigger>
			<DialogContent class="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader class="space-y-4 p-6">
					<DialogTitle class="text-lg font-semibold">Invite Members to {family.name}</DialogTitle>
					<DialogDescription class="text-sm text-muted-foreground">
						Enter the email address of the person you want to invite to join your family plan.
					</DialogDescription>
				</DialogHeader>
				<form on:submit|preventDefault={sendInvitation} class="p-6 space-y-4">
					<div class="space-y-2">
						<label class="text-sm font-medium text-foreground">Email Address</label>
						<Input
							type="email"
							bind:value={email}
							placeholder="Enter email address"
							on:keydown={handleKeyDown}
							class="w-full"
							disabled={loading}
						/>
						{#if error}
							<p class="text-sm text-destructive">{error}</p>
						{/if}
						{#if successMessage}
							<p class="text-sm text-success">{successMessage}</p>
						{/if}
					</div>
					<div class="flex justify-end space-x-3">
						<Button 
							variant="outline" 
							on:click={() => open = false}
							class="w-32"
						>
							Cancel
						</Button>
						<Button 
							variant="default" 
							on:click={sendInvitation}
							class="w-32"
							disabled={loading || !email.trim()}
							loading={loading}
						>
							{loading ? 'Sending...' : 'Send Invitation'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</div>
{/if}

<Button 
	variant="outline" 
	on:click={() => open = true}
	class="w-full"
>
	Invite Members
</Button>
