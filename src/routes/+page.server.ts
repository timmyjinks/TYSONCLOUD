import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.supabase.auth.getUser();
	console.warn = () => {};
	if (!session.data.user) {
		redirect(302, '/login');
	}

	try {
		const response = await fetch(
			`http://localhost:8000/deployments?username=${locals.user?.email}`
		);
		const data = await response.json();

		return {
			deployments: data
		};
	} catch (err) {
		return { deployments: [] };
	}
};

export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const image = formData.get('image') as string;
		const env_array = JSON.parse(formData.get('env'));

		let env = {};
		for (let i = 0; i < env_array.length; i++) {
			console.log(env_array[i].key);
			env[env_array[i].key] = env_array[i].val;
		}

		const response = await fetch('http://localhost:8000/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: name,
				image: image,
				username: locals.user.email,
				env: env
			})
		});

		if (response.status !== 200) {
			return fail(400, {
				error: 'Error creating container'
			});
		}
	},
	update: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const image = formData.get('image') as string;
		const id = formData.get('id') as string;

		const response = await fetch('http://backend:8000/update', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: id,
				new_name: name,
				new_image: image
			})
		});

		if (response.status !== 200) {
			return fail(400, {
				error: 'Error updating container'
			});
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const response = await fetch('http://localhost:8000/delete', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: id
			})
		});

		if (response.status !== 200) {
			return fail(400, {
				error: 'Error deleting container'
			});
		}
	},
	logout: async ({ locals }) => {
		const { error } = await locals.supabase.auth.signOut();

		console.log(locals.supabase.user);
		if (error) {
			console.log(error?.message);
		}

		locals.supabase.session = null;
		locals.supabase.user = null;

		redirect(302, '/login');
	}
};
