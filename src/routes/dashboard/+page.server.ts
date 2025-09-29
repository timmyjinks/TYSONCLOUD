import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await locals.supabase.auth.getUser();
	const session = await locals.supabase.auth.getSession();
	if (!user.data.user) {
		redirect(302, '/login');
	}

	try {
		const response = await fetch(`${BACKEND_URL}/deployments?username=${locals.user?.email}`, {
			headers: {
				Authorization: 'Bearer ' + session.data.session?.access_token
			}
		});
		const data = await response.json();

		return {
			deployments: data.data
		};
	} catch (err) {
		return { deployments: [] };
	}
};

export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const source = formData.get('url') as string;
		const env_array = JSON.parse(formData.get('env')) ?? [];
		const volume = (formData.get('volume') as string) || '/data';
		const session = await locals.supabase.auth.getSession();

		let env = {};
		for (let i = 0; i < env_array.length; i++) {
			env[env_array[i].key] = env_array[i].value;
		}

		const options = { timeout: 8000 };
		const timeout = 8000;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort, timeout);

		const response = await fetch(`${BACKEND_URL}/create`, {
			...options,
			signal: controller.signal,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + session.data.session?.access_token
			},
			body: JSON.stringify({
				name: name,
				source: source,
				username: locals.user.email,
				env: env,
				volume: volume
			})
		});
		clearTimeout(timer);

		if (response.status !== 200) {
			return fail(400, {
				error: 'Error creating container'
			});
		}
		redirect(302, '/dashboard');
	},
	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const new_name = formData.get('name') as string;
		const update = formData.get('update') ? true : false;
		const volume = (formData.get('volume') as string) ?? '/data';
		const env_array = JSON.parse(formData.get('env')) ?? [];
		const session = await locals.supabase.auth.getSession();

		let env = {};
		for (let i = 0; i < env_array.length; i++) {
			env[env_array[i].key] = env_array[i].value;
		}

		const options = { timeout: 8000 };
		const timeout = 8000;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort, timeout);

		const response = await fetch(`${BACKEND_URL}/update`, {
			...options,
			signal: controller.signal,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + session.data.session?.access_token
			},
			body: JSON.stringify({
				id: id,
				new_name: new_name,
				update: update,
				volume: volume,
				env: env
			})
		});
		clearTimeout(timer);

		if (response.status !== 200) {
			return fail(400, {
				error: 'Error updating container'
			});
		}
		redirect(302, '/dashboard');
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const session = await locals.supabase.auth.getSession();

		const response = await fetch(`${BACKEND_URL}/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + session.data.session?.access_token
			},
			body: JSON.stringify({
				id: id
			})
		});

		if (response.status !== 200) {
			return fail(400, {
				error: 'Error deleting container'
			});
		}
		redirect(302, '/dashboard');
	},
	logout: async ({ locals }) => {
		const { error } = await locals.supabase.auth.signOut();

		if (error) {
			console.log(error?.message);
		}

		locals.supabase.session = null;
		locals.supabase.user = null;

		redirect(302, '/login');
	}
};
