import { command, getRequestEvent } from '$app/server';
import { z } from 'zod';
import { findUserByEmail, addMemberToPlan } from '$lib/server/db/api/users';
import { sendInvitation as sendFamilyInvitation } from '$lib/server/db/api/invitations';
import { error } from '@sveltejs/kit';

const inviteUserFormSchema = z.object({
	email: z.email('Please enter a valid email address'),
	familyId: z.string().min(1, 'Family ID is required')
});

export const inviteUser = command(inviteUserFormSchema, async (data) => {
	try {
		const event = getRequestEvent();
		const user = event.locals.user;

		if (!user) {
			error(401, 'Unauthorized');
		}

		const invitedUser = await findUserByEmail(data.email);

		if (!invitedUser || invitedUser.length === 0) {
			// The user doesn't exist. To prevent email enumeration,
			// an invitation is created, but not linked to an actual user.
			// TODO add cleanup for expired invitations that are not linked to a user
			await sendFamilyInvitation(data.familyId, user.id, data.email);

			return { success: true, message: 'Invitation sent successfully' };
		}

		await sendFamilyInvitation(data.familyId, user.id, invitedUser[0].id);

		return { success: true, message: 'Invitation sent successfully' };
	} catch (err) {
		console.log(err)
		error(503, 'There was an error sending the invitation');
	}
});