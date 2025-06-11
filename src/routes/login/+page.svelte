<script>
	let rememberMe = false;
	let isLoading = false;
</script>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4"
>
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-white/10"></div>
		<div
			class="absolute -bottom-40 -left-40 h-80 w-80 animate-bounce rounded-full bg-white/10"
		></div>
		<div class="absolute top-1/2 left-1/4 h-32 w-32 animate-ping rounded-full bg-white/5"></div>
	</div>

	<div class="relative z-10 w-full max-w-md">
		<!-- Logo/Brand -->
		<div class="mb-12 text-center">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-sm"
			>
				<svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			</div>
			<h1 class="mb-3 text-4xl font-light tracking-tight text-white">Welcome Back</h1>
			<p class="text-lg font-light text-white/70">Sign in to your account</p>
		</div>

		<div class="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-2xl">
			<form action="?/login" method="post" class="space-y-6">
				<div class="group relative">
					<input
						type="email"
						placeholder="Email"
						name="email"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-6 py-4 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 hover:bg-white/95 focus:-translate-y-0.5 focus:border-transparent focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>

				<div class="group relative">
					<input
						type="password"
						name="password"
						placeholder="Password"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-6 py-4 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 hover:bg-white/95 focus:-translate-y-0.5 focus:border-transparent focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>

				<div class="flex items-center justify-between text-sm">
					<label class="group flex cursor-pointer items-center text-white/80">
						<input
							type="checkbox"
							bind:checked={rememberMe}
							class="h-4 w-4 rounded border-white/40 bg-white/80 text-blue-600 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
						/>
						<span class="ml-2 transition-colors duration-200 group-hover:text-white"
							>Remember me</span
						>
					</label>
					<button
						type="button"
						class="font-medium text-white/80 transition-colors duration-200 hover:text-white hover:underline"
					>
						Forgot password?
					</button>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-2xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none active:translate-y-0 disabled:opacity-75"
				>
					{isLoading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>

			<div class="mt-8 border-t border-white/20 pt-6 text-center">
				<p class="text-white/70">
					Don't have an account?
					<a href="/signup">
						<button
							type="button"
							class="font-semibold text-white transition-all duration-200 hover:underline"
						>
							Sign up
						</button>
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
