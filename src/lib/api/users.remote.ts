import { form } from '$app/server';
import { userFormSchema } from '$lib/forms/schema/user';
import { createUser } from '$lib/server/db/api/users';
import { error, redirect } from '@sveltejs/kit';

export const addUser = form(userFormSchema, async (data) => {
	try {
		await createUser(data.username);
		redirect(302, '/dashboard');
	} catch (_err) {
		console.log(_err);
		error(503, 'There was an error creating the user');
	}
});
