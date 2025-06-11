import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) {
		redirect(302, '/login');
	}
	const response = await fetch(`http://localhost:8000/deployments?username=${locals.user?.email}`);
	const data = await response.json();

	return {
		deployments: data
	};
};

export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const image = formData.get('image') as string;

		await fetch('http://localhost:8000/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: name,
				image: image,
				username: locals.user.email
			})
		});

		throw redirect(302, '/');
	},
	update: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const image = formData.get('image') as string;
		const id = formData.get('id') as string;

		await fetch('http://localhost:8000/update', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: id,
				new_name: name,
				new_image: image
			})
		});

		throw redirect(302, '/');
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		await fetch('http://localhost:8000/delete', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: id
			})
		});

		throw redirect(302, '/');
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
