import { redirect } from '@sveltejs/kit';

export const actions = {
	logout: async ({ locals }) => {
		locals.sb.authStore.clear();
		locals.user = null;

		redirect(303, '/login');
	}
};
