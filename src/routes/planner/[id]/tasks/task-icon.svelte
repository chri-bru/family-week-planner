<script lang="ts">
	import ListTodoIcon from '@lucide/svelte/icons/list-todo';
	import RepeatIcon from '@lucide/svelte/icons/repeat';

	let { choreId }: { choreId: number | null } = $props();
</script>

{#if choreId !== null}
	<RepeatIcon class="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
{:else}
	<ListTodoIcon class="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
{/if}
