<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { mealFormSchema, type MealFormSchema } from '../../schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data }: { data: { date: string; form: SuperValidated<MealFormSchema> } } = $props();

	let date: string = $derived(data.date);

	const form = superForm(data.form, {
		validators: zod4Client(mealFormSchema)
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		$formData.date = date;
	});
</script>

<form method="POST"  class="w-2/3 space-y-6" action="?/save" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input {...props} bind:value={$formData.name} placeholder="Meal name" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="date">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Date</Form.Label>
				<Input {...props} type="date" bind:value={date} readonly aria-readonly="true" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Type</Form.Label>
				<select
					{...props}
					bind:value={$formData.type}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				>
					<option value="breakfast">Breakfast</option>
					<option value="lunch">Lunch</option>
					<option value="dinner">Dinner</option>
					<option value="snack">Snack</option>
					<option value="special">Special</option>
				</select>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="link">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Link (optional)</Form.Label>
				<Input {...props} bind:value={$formData.link} placeholder="https://..." />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
