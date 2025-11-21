<script lang="ts">
	import { ArrowRight, Cloud, Upload, GitBranch, Container, Zap } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="min-h-screen bg-black text-white">
	<header class="container mx-auto px-4 py-6">
		<nav class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Cloud class="h-8 w-8 text-red-500" />
				<span class="text-xl font-bold tracking-tight">TYSONCLOUD</span>
			</div>
			<div class="flex items-center gap-4">
				<a href="/login" class="text-sm text-zinc-400 transition-colors hover:text-white">
					Sign in
				</a>
				<a href="/signup" class="rounded-sm bg-red-600 px-[0.8rem] py-[0.3rem] hover:bg-red-700"
					>Get Started</a
				>
			</div>
		</nav>
	</header>

	<section class="container mx-auto px-4 py-24 md:py-32">
		<div class="mx-auto max-w-3xl text-center">
			<h1 class="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
				Cloud infrastructure for the{' '}
				<span class="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
					modern developer
				</span>
			</h1>
			<p class="mx-auto mb-10 max-w-2xl text-xl text-zinc-400">
				Deploy, scale, and manage your applications with unparalleled speed and reliability. Built
				for developers who demand more.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button
					size="lg"
					variant="outline"
					class="border-zinc-700 bg-transparent text-white hover:bg-zinc-900"
				>
					View documentation (Coming soon...) <ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	</section>
	<section class="container mx-auto px-4 py-24">
		<div class="mx-auto mb-16 max-w-4xl text-center">
			<h2 class="mb-6 text-3xl font-bold md:text-4xl">
				Deployment made{' '}
				<span class="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
					effortless
				</span>
			</h2>
			<p class="mx-auto max-w-2xl text-xl text-zinc-400">
				Just paste a link and watch your application come to life. No complex configurations, no
				lengthy setup processes.
			</p>
		</div>

		<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
			<div
				class="rounded-lg border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-red-500/50"
			>
				<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-red-900">
					<GitBranch class="h-8 w-8 text-red-400" />
				</div>
				<h3 class="mb-4 text-center text-2xl font-bold">Git Repository</h3>
				<p class="mb-6 text-center text-zinc-400">
					Paste your GitHub, GitLab, or Bitbucket repository URL and we'll handle the rest.
				</p>
				<div class="rounded-md border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm">
					<div class="mb-2 text-zinc-500">Repository URL:</div>
					<div class="text-green-400">https://github.com/user/my-app.git</div>
					<div class="mt-3 mb-1 text-zinc-500">✓ Automatic build detection</div>
					<div class="mb-1 text-zinc-500">✓ Environment configuration</div>
					<div class="text-zinc-500">✓ Live deployment in seconds</div>
				</div>
			</div>

			<div
				class="rounded-lg border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-red-500/50"
			>
				<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-red-900">
					<Container class="h-8 w-8 text-red-400" />
				</div>
				<h3 class="mb-4 text-center text-2xl font-bold">Docker Image</h3>
				<p class="mb-6 text-center text-zinc-400">
					Deploy any Docker image from Docker Hub, private registries, or custom builds.
				</p>
				<div class="rounded-md border border-zinc-700 bg-zinc-950 p-4 font-mono text-sm">
					<div class="mb-2 text-zinc-500">Docker Image:</div>
					<div class="text-blue-400">nginx:latest</div>
					<div class="mt-3 mb-1 text-zinc-500">✓ Automatic container orchestration</div>
				</div>
			</div>
		</div>
	</section>

	<footer class="container mx-auto border-zinc-800 px-4 py-12">
		<div
			class="mt-12 flex flex-col items-center justify-between border-t border-zinc-800 pt-8 md:flex-row"
		>
			<div class="mb-4 flex items-center gap-2 md:mb-0">
				<Cloud class="h-6 w-6 text-red-500" />
				<span class="text-lg font-bold">TYSONCLOUD</span>
			</div>
			<p class="text-sm text-zinc-500">© 2025 TYSONCLOUD, Inc. All rights reserved.</p>
		</div>
	</footer>
</div>
