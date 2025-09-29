import type { RequestHandler } from '@sveltejs/kit';
import { BACKEND_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ url, locals }) => {
	const container_id = url.searchParams.get('container_id');
	const session = await locals.supabase.auth.getSession();

	if (!container_id) {
		return new Response(JSON.stringify({ error: 'Missing container ID' }), { status: 400 });
	}

	const response = await fetch(`${BACKEND_URL}/get_logs?container_id=${container_id}`, {
		headers: {
			Authorization: 'Bearer ' + session.data.session?.access_token
		}
	});
	const logs = await response.json();

	return new Response(JSON.stringify({ logs }), { status: 200 });
};
