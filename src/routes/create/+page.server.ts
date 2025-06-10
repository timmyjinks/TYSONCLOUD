import { redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name').replace(/[^a-zA-Z0-9-_]/g, '') as string;
		const image = formData.get('image').replace(/[^a-zA-Z]/g, '') as string;

		await fetch('http://backend:8000/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: name,
				image: image
			})
		});

		throw redirect(303, '/');
	}
};
