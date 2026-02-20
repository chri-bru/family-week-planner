<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';

	async function registerPasskey() {
		const { data, error } = await authClient.passkey.addPasskey({
			name: 'My Device',
			authenticatorAttachment: 'platform'
		});

		if (error) {
			console.error(error.message);
			return;
		}

		console.log('Passkey registered:', data);
	}
</script>

<Card class="max-w-md">
	<CardHeader>
		<CardTitle>Register a Passkey</CardTitle>
	</CardHeader>

	<CardContent>
		<Button onclick={registerPasskey} class="w-full">Add Passkey</Button>
	</CardContent>
</Card>
