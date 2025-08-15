import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.supabase.auth.getUser();
	if (session.data.user) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			console.error(error.message);
			return fail(343, { error: error?.message });
		} else {
			redirect(302, '/');
		}
	},
	googlesignup: async ({ locals: { supabase } }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'https://tysoncloud.tysonjenkins.dev/auth/callback'
			}
		});

		if (data.url) {
			redirect(302, data.url);
		}
	}
};
