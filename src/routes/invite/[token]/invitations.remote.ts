import { form, getRequestEvent } from '$app/server';
import { z } from 'zod';
import { acceptInvitationToken } from '$lib/server/db/api/family';


export const acceptInvitationAction = form(async () => {
    const event = getRequestEvent();
    const user = event.locals.user;
    const token = event.params.token;


    if (!user && !token) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        const result = await acceptInvitationToken(token!, user!.id);

        if (result.alreadyMember) {
            return { success: true, message: 'You are already a member', familyId: result.family.id };
        }

        return { success: true, message: 'You have joined the family!', familyId: result.family.id };
    } catch (err) {
        return { success: false, message: 'Failed to accept invitation' };
    }
});