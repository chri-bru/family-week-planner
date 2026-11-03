import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';

const requiredDuringRuntime = (name: string) => (input: string | undefined) => {
	if (input) {
		return input;
	}

	if (building) {
		return '';
	}

	throw new Error(`${name} environment variable is not set`);
};

export const variables = defineEnvVars({
	BETTER_AUTH_URL: {
		description: 'Base URL of the app, used by Better Auth',
		schema: requiredDuringRuntime('BETTER_AUTH_URL')
	},
	DATABASE_URL: {
		description: 'PostgreSQL connection string',
		schema: requiredDuringRuntime('DATABASE_URL')
	}
});
