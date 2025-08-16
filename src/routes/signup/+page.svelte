<script>
	import { ArrowRight, Cloud, Mail, Lock, User } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="flex min-h-screen items-center justify-center bg-black px-4 text-white">
	<div class="w-full max-w-md">
		<div class="mb-8 text-center">
			<div class="mb-4 flex items-center justify-center gap-2">
				<Cloud class="h-8 w-8 text-red-500" />
				<span class="text-2xl font-bold">TYSONCLOUD</span>
			</div>
			<h1 class="mb-2 text-3xl font-bold">Create your account</h1>
			<p class="text-zinc-400">Start deploying in seconds</p>
		</div>

		<form action="?/signup" method="POST" class="space-y-6" use:enhance>
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-zinc-300">
					Email address
				</label>
				<div class="relative">
					<Mail class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400" />
					<input
						id="email"
						name="email"
						type="email"
						required
						class="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 pr-4 pl-10 text-white placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
						placeholder="Enter your email"
					/>
				</div>
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-zinc-300">
					Password
				</label>
				<div class="relative">
					<Lock class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400" />
					<input
						id="password"
						name="password"
						type="password"
						required
						class="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 pr-4 pl-10 text-white placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
						placeholder="Create a password"
					/>
				</div>
			</div>

			<div>
				<label for="confirmPassword" class="mb-2 block text-sm font-medium text-zinc-300">
					Confirm password
				</label>
				<div class="relative">
					<Lock class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400" />
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						class="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 pr-4 pl-10 text-white placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
						placeholder="Confirm your password"
					/>
				</div>
			</div>

			{#if form?.error}
				<p class="text-red-500">{form?.error}</p>
			{/if}

			<div class="flex items-start">
				<input
					type="checkbox"
					required
					class="mt-1 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500"
				/>
				<span class="ml-2 text-sm text-zinc-400">
					I agree to the <button type="button" class="text-red-500 hover:text-red-400"
						>Terms of Service</button
					>
					and <button type="button" class="text-red-500 hover:text-red-400">Privacy Policy</button>
				</span>
			</div>

			<button
				type="submit"
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700"
			>
				Create account
				<ArrowRight class="h-4 w-4" />
			</button>
		</form>

		<form action="?/googlesignup" method="POST" class="mt-[15px] space-y-6" use:enhance>
			<div class="mb-6">
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continue with Google
				</button>
			</div>
		</form>

		<div class="mt-8 text-center">
			<p class="text-zinc-400">
				Already have an account?
				<a href="/login" class="ml-1 font-medium text-red-500 hover:text-red-400"> Sign in </a>
			</p>
		</div>

		<!-- Back to home -->
		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-zinc-500 hover:text-zinc-400"> ← Back to home </a>
		</div>
	</div>
</div>
