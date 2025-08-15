<script>
	import { ArrowRight, Cloud, Mail, Lock } from '@lucide/svelte';
</script>

<div class="flex min-h-screen items-center justify-center bg-black px-4 text-white">
	<div class="w-full max-w-md">
		<div class="mb-8 text-center">
			<div class="mb-4 flex items-center justify-center gap-2">
				<Cloud class="h-8 w-8 text-red-500" />
				<span class="text-2xl font-bold">TYSONCLOUD</span>
			</div>
			<h1 class="mb-2 text-3xl font-bold">Welcome back</h1>
			<p class="text-zinc-400">Sign in to your account to continue</p>
		</div>

		<form action="?/login" method="POST" class="space-y-6">
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-zinc-300">
					Email address
				</label>
				<div class="relative">
					<Mail class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400" />
					<input
						id="email"
						type="email"
						name="email"
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
						type="password"
						name="password"
						required
						class="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 pr-4 pl-10 text-white placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
						placeholder="Enter your password"
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<label class="flex items-center">
					<input
						type="checkbox"
						class="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500"
					/>
					<span class="ml-2 text-sm text-zinc-400">Remember me</span>
				</label>
				<button type="button" class="text-sm text-red-500 hover:text-red-400">
					Forgot password?
				</button>
			</div>

			<button
				type="submit"
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700"
			>
				Sign in
				<ArrowRight class="h-4 w-4" />
			</button>
		</form>

		<div class="mt-8 text-center">
			<p class="text-zinc-400">
				Don't have an account?
				<a href="/signup" class="ml-1 font-medium text-red-500 hover:text-red-400"> Sign up </a>
			</p>
		</div>

		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-zinc-500 hover:text-zinc-400"> ← Back to home </a>
		</div>
	</div>
</div>
