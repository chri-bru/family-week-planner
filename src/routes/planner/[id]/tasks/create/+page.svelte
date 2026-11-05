<script lang="ts">
	import type { PageData } from './$types';
	import CreateTaskForm from './create-task-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<CreateTaskForm familyId={data.familyId} members={data.members} />
