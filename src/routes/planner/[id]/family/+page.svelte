<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Link from '@lucide/svelte/icons/link';

	let { data } = $props();

	let copied = $state(false);

	function getInitials(name: string | null): string {
		if (!name) return '?';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	async function copyLink() {
		const url = `${page.url.origin}/invite/${data.invitationToken}`;
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<div class="space-y-6">
	<Card>
		<CardHeader>
			<CardTitle>Family Members</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if data.members.length === 0}
				<p class="text-sm text-muted-foreground">No members found</p>
			{:else}
				{#each data.members as member}
					<div class="flex items-center gap-3">
						<Avatar>
							<AvatarFallback>{getInitials(member.username)}</AvatarFallback>
						</Avatar>
						<span class="text-sm font-medium">{member.username}</span>
					</div>
				{/each}
			{/if}
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Invite Members</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<p class="text-sm text-muted-foreground">
				Share this link with family members you want to invite. They can join by clicking the link and
				either signing in or creating an account.
			</p>
			<div class="flex items-center gap-2">
				<Link class="size-4 shrink-0 text-muted-foreground" />
				<code class="flex-1 truncate text-sm bg-muted px-2 py-1 rounded">
					{page.url.origin}/invite/{data.invitationToken}
				</code>
				<Button size="icon-sm" variant="ghost" onclick={copyLink}>
					{#if copied}
						<Check class="size-4 text-green-500" />
					{:else}
						<Copy class="size-4" />
					{/if}
				</Button>
			</div>
		</CardContent>
	</Card>
</div>