import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BACKEND_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('app:deployments');
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
			deployments: data,
			token: session.data?.session?.access_token
		};
	} catch (err) {
		return { deployments: [], token: '' };
	}
};

export const actions = {
	create: async ({ request, locals }) => {
		const formData: FormData = await request.formData();
		const env_array = JSON.parse(formData.get('env')) ?? [];
		let volume = (formData.get('volume') as string) || '/data';
		const session = await locals.supabase.auth.getSession();

		let env: { [key: string]: string } = {};
		for (let i = 0; i < env_array.length; i++) {
			if (env_array[i].key === '') {
				continue;
			}
			env[env_array[i].key] = env_array[i].value;
		}

		const files = formData.get('files') as File;
		if (files == null) {
			formData.set('files', new File([], 'none', undefined));
		} else if (files.name == '') {
			formData.set('files', new File([], 'none', undefined));
		}

		formData.set('env', JSON.stringify(env));
		formData.set('volume', volume);

		const response = await fetch(`${BACKEND_URL}/create`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + session.data.session?.access_token
			},
			body: formData
		});

		let result = await response.json();

		return { success: true, deploymentId: result.deploymentId };
	},
	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const container_id = formData.get('container_id') as string;
		const new_name = formData.get('name') as string;
		const update = formData.get('update') ? true : false;
		const volume = (formData.get('volume') as string) ?? '/data';
		const env_array = JSON.parse(formData.get('env')) ?? [];
		const type = (formData.get('type') as string) ?? '';
		const session = await locals.supabase.auth.getSession();

		let env: { [key: string]: string } = {};
		for (let i = 0; i < env_array.length; i++) {
			if (env_array[i].key === '') {
				continue;
			}
			env[env_array[i].key] = env_array[i].value;
		}

		const options = { timeout: 8000 };
		const timeout = 8000;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort, timeout);

		await fetch(`${BACKEND_URL}/update`, {
			...options,
			signal: controller.signal,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + session.data.session?.access_token
			},
			body: JSON.stringify({
				id: id,
				container_id: container_id,
				new_name: new_name,
				update: update,
				volume: volume,
				env: env,
				type: type
			})
		});
		clearTimeout(timer);
		return { success: true };
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const container_id = formData.get('container_id');
		const session = await locals.supabase.auth.getSession();

		const response = await fetch(`${BACKEND_URL}/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + session.data.session?.access_token
			},
			body: JSON.stringify({
				id: id,
				container_id: container_id
			})
		});

		if (response.status !== 200) {
			return fail(400, {
				error: 'Error deleting container'
			});
		}
		throw redirect(303, '/dashboard');
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
