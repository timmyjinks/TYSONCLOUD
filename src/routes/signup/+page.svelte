<script>
	import { ArrowRight, Cloud, Mail, Lock, User } from '@lucide/svelte';
</script>

<div class="flex min-h-screen items-center justify-center bg-black px-4 text-white">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="mb-8 text-center">
			<div class="mb-4 flex items-center justify-center gap-2">
				<Cloud class="h-8 w-8 text-red-500" />
				<span class="text-2xl font-bold">TYSONCLOUD</span>
			</div>
			<h1 class="mb-2 text-3xl font-bold">Create your account</h1>
			<p class="text-zinc-400">Start deploying in seconds</p>
		</div>

		<form action="?/signup" method="POST" class="space-y-6">
			<div>
				<label for="name" class="mb-2 block text-sm font-medium text-zinc-300"> Full name </label>
				<div class="relative">
					<User class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-zinc-400" />
					<input
						id="name"
						type="text"
						required
						class="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 pr-4 pl-10 text-white placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
						placeholder="Enter your full name"
					/>
				</div>
			</div>

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

		<!-- Login link -->
		<div class="mt-8 text-center">
			<p class="text-zinc-400">
				Already have an account?
				<a href="/login" class="ml-1 font-medium text-red-500 hover:text-red-400"> Sign in </a>
			</p>
		</div>

		<!-- Back to home -->
		<div class="mt-6 text-center">
			<a href="/login" class="text-sm text-zinc-500 hover:text-zinc-400"> ← Back to home </a>
		</div>
	</div>
</div>
