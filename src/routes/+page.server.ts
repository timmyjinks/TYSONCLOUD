import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.supabase.auth.getUser();
	console.log(session.data.user);
	if (!session.data.user) {
		redirect(302, '/login');
	}
	const response = await fetch(`http://backend:8000/deployments?username=${locals.user?.email}`);
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

		const response = await fetch('http://backend:8000/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: name,
				image: image,
				username: locals.user.email
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

		const response = await fetch('http://backend:8000/delete', {
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
