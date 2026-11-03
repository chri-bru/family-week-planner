import { form, getRequestEvent } from '$app/server';
import { z } from 'zod';
import { acceptInvitationToken } from '#lib/server/db/api/family.js';

const invitationSchema = z.object({
	token: z.string().min(1, 'Invitation token is required')
});

export const acceptInvitationAction = form(invitationSchema, async ({ token }) => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		return { success: false, message: 'Unauthorized' };
	}

	try {
		const result = await acceptInvitationToken(token, user.id);

		if (result.alreadyMember) {
			return { success: true, message: 'You are already a member', familyId: result.family.id };
		}

		return { success: true, message: 'You have joined the family!', familyId: result.family.id };
	} catch {
		return { success: false, message: 'Failed to accept invitation' };
	}
});
