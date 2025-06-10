import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.sb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const response = await fetch(`http://backend:8000/databases?username=${locals.user?.username}`);

	const data = await response.json();

	return {
		databases: data.reverse(),
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions = {
	logout: async ({ locals }) => {
		locals.sb.authStore.clear();
		locals.user = null;

		redirect(303, '/login');
	}
};
