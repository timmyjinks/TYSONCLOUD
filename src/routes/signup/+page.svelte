<script>
	let email = '';
	let password = '';
	let confirmPassword = '';
	let agreeToTerms = false;
	let isLoading = false;
	let passwordStrength = 0;

	$: {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;
		passwordStrength = strength;
	}

	$: passwordsMatch = password && confirmPassword && password === confirmPassword;
	$: canSubmit = email && password && confirmPassword && passwordsMatch;
</script>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4"
>
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-white/10"></div>
		<div
			class="absolute -bottom-40 -left-40 h-80 w-80 animate-bounce rounded-full bg-white/10"
		></div>
		<div class="absolute top-1/3 right-1/4 h-24 w-24 animate-ping rounded-full bg-white/5"></div>
		<div
			class="absolute bottom-1/3 left-1/3 h-16 w-16 animate-pulse rounded-full bg-white/5"
			style="animation-delay: -2s;"
		></div>
	</div>

	<div class="relative z-10 w-full max-w-md">
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-sm"
			>
				<svg class="h-8 w-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
					/>
				</svg>
			</div>
			<h1 class="mb-3 text-4xl font-light tracking-tight text-white">Create Account</h1>
			<p class="text-lg font-light text-white/70">Join us today</p>
		</div>

		<div class="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-2xl">
			<form action="?/signup" method="post" class="space-y-5">
				<!-- Name Fields Row -->
				<div class="grid grid-cols-2 gap-4"></div>

				<div class="group relative">
					<input
						type="email"
						name="email"
						bind:value={email}
						placeholder="Email"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-6 py-4 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 hover:bg-white/95 focus:-translate-y-0.5 focus:border-transparent focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
						required
					/>
				</div>

				<div class="group relative">
					<input
						type="password"
						bind:value={password}
						name="password"
						placeholder="Password"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-6 py-4 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 hover:bg-white/95 focus:-translate-y-0.5 focus:border-transparent focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
						required
					/>
					{#if password}
						<div class="mt-2 px-2">
							<div class="mb-1 flex items-center justify-between">
								<span class="text-xs text-white/70">Password strength</span>
							</div>
							<div class="h-1.5 w-full rounded-full bg-white/30">
								<div
									class="h-1.5 rounded-full transition-all duration-300"
									style="width: {(passwordStrength / 5) * 100}%"
								></div>
							</div>
						</div>
					{/if}
				</div>

				<div class="group relative">
					<input
						type="password"
						bind:value={confirmPassword}
						placeholder="Confirm Password"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-6 py-4 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 hover:bg-white/95 focus:-translate-y-0.5 focus:border-transparent focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
						required
					/>
					{#if confirmPassword && !passwordsMatch}
						<div class="mt-1 px-2">
							<span class="text-xs text-red-300">Passwords don't match</span>
						</div>
					{/if}
					{#if confirmPassword && passwordsMatch}
						<div class="mt-1 px-2">
							<span class="text-xs text-green-300">✓ Passwords match</span>
						</div>
					{/if}
				</div>

				<button
					type="submit"
					disabled={!canSubmit || isLoading}
					class="w-full rounded-2xl bg-pink-600 px-6 py-4 font-semibold text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-700 hover:shadow-2xl focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? 'Creating Account...' : 'Create Account'}
				</button>
			</form>
			<form action="?/googlesignup" method="POST">
				<div class="mt-[15px] space-y-3">
					<button
						type="submit"
						class="flex w-full items-center justify-center space-x-3 rounded-2xl border border-white/40 bg-white/90 px-6 py-4 font-semibold text-gray-800 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span>Continue with Google</span>
					</button>
				</div>
			</form>
			<div class="mt-8 border-t border-white/20 pt-6 text-center">
				<p class="text-white/70">
					Already have an account?
					<a href="/login">
						<button
							type="button"
							class="font-semibold text-white transition-all duration-200 hover:underline"
						>
							Sign in
						</button>
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
