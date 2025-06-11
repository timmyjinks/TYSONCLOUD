<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { redirect } from '@sveltejs/kit';

	let { data, children } = $props();
	let { session, cookies } = $derived(data);

	onMount(() => {
		const { data } = cookies.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			data.subscription.unsubscribe();
			redirect(302, '/login');
		};
	});
</script>

{@render children()}
