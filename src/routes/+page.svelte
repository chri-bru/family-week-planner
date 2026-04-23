<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<h1 class="text-4xl font-bold">Welcome!</h1>
	<p class="text-lg text-gray-600">Plan your family's meals and todos for the week ahead!</p>
	<Button size="lg" href="/auth/login">Login</Button>
	<Button size="lg" href="/auth/register">Register</Button>
</div>