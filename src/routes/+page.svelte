<script lang="ts">
	import { ArrowRight, Cloud, Database, Lock, Terminal, Zap } from '@lucide/svelte';
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
				<a href="/signup"
					><Button class="bg-red-600 text-white hover:bg-red-700">Get Started</Button></a
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
				<a href="/signup"
					><Button size="lg" class="bg-red-600 text-white hover:bg-red-700">Start for free</Button
					></a
				>
				<Button
					size="lg"
					variant="outline"
					class="border-zinc-700 bg-transparent text-white hover:bg-zinc-900"
				>
					View documentation <ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	</section>

	<section class="container mx-auto px-4 py-24">
		<div
			class="mx-auto max-w-4xl rounded-lg border border-red-800/50 bg-gradient-to-r from-red-900/50 to-orange-900/50 p-8 text-center md:p-12"
		>
			<h2 class="mb-6 text-3xl font-bold md:text-4xl">Ready to get started?</h2>
			<p class="mx-auto mb-8 max-w-2xl text-xl text-zinc-300">
				Join thousands of developers building the future on TYSONCLOUD.
			</p>
			<a href="/signup"
				><Button size="lg" class="bg-white text-black hover:bg-zinc-200">Create your account</Button
				></a
			>
		</div>
	</section>

	<footer class="container mx-auto border-t border-zinc-800 px-4 py-12">
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
