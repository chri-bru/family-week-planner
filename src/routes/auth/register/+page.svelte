<script lang="ts">
	import { goto } from '$app/navigation';
	import { signUp } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	// Create writable stores for form fields
	let username = $state('');
	let email = $state('');
	let password = $state('');

	// Function to handle form submission
	const handleSignUp = async () => {
		await signUp.email({
			email: email,
			password: password,
			name: username,
			callbackURL: '/planner/dashboard',
			fetchOptions: {
				onSuccess() {
					alert('Your account has been created.');
					goto('/planner/dashboard');
				},
				onError(context) {
					alert(context.error.message);
				}
			}
		});
	};
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<Label for="first-name">Username</Label>
				<Input id="first-name" placeholder="Chris" required bind:value={username} />
			</div>
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="chris@example.com"
					required
					bind:value={email}
				/>
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input id="password" type="password" bind:value={password} />
			</div>
			<Button type="button" class="w-full" onclick={handleSignUp}>Create an account</Button>
		</div>
		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="/auth/login" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
