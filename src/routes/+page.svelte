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
			<div class="hidden items-center gap-8 md:flex">
				<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white"> Products </a>
				<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
					Documentation
				</a>
				<a href="" class="text-sm text-zinc-400 transition-colors hover:text-white"> Pricing </a>
				<a href="" class="text-sm text-zinc-400 transition-colors hover:text-white">Blog</a>
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

	<section class="container mx-auto px-4 py-16">
		<div class="mx-auto max-w-4xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
			<div class="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
				<span class="ml-2 text-xs text-zinc-400">terminal</span>
			</div>
			<div class="p-6 font-mono text-sm">
				<p class="text-green-500">$ nimbus deploy --app my-awesome-project</p>
				<p class="mt-2 text-zinc-400">Initializing deployment...</p>
				<p class="text-zinc-400">Packaging application...</p>
				<p class="text-zinc-400">Uploading assets (2.4 MB)...</p>
				<p class="text-zinc-400">Configuring environment...</p>
				<p class="text-zinc-400">Starting containers...</p>
				<p class="mt-2 text-red-400">✓ Deployment successful! Your app is live at:</p>
				<p class="text-blue-400 underline">https://my-awesome-project.nimbuscloud.app</p>
				<p class="mt-4 animate-pulse text-zinc-400">_</p>
			</div>
		</div>
	</section>

	<section class="container mx-auto px-4 py-24">
		<h2 class="mb-16 text-center text-3xl font-bold md:text-4xl">
			Everything you need to build at{' '}
			<span class="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
				lightning speed
			</span>
		</h2>
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-900">
					<Zap class="h-6 w-6 text-red-400" />
				</div>
				<h3 class="mb-3 text-xl font-bold">Instant Deployments</h3>
				<p class="text-zinc-400">
					Deploy your code in seconds, not minutes. Our optimized build system ensures your changes
					go live instantly.
				</p>
			</div>
			<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-900">
					<Database class="h-6 w-6 text-red-400" />
				</div>
				<h3 class="mb-3 text-xl font-bold">Serverless Database</h3>
				<p class="text-zinc-400">
					Scale your database from zero to global without changing a line of code. Pay only for what
					you use.
				</p>
			</div>
			<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-900">
					<Terminal class="h-6 w-6 text-red-400" />
				</div>
				<h3 class="mb-3 text-xl font-bold">Developer Experience</h3>
				<p class="text-zinc-400">
					Intuitive CLI, comprehensive API, and detailed documentation make development a breeze.
				</p>
			</div>
			<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-900">
					<Lock class="h-6 w-6 text-red-400" />
				</div>
				<h3 class="mb-3 text-xl font-bold">Enterprise Security</h3>
				<p class="text-zinc-400">
					Bank-level encryption, automatic SSL, and advanced access controls keep your data safe.
				</p>
			</div>
			<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-900">
					<Cloud class="h-6 w-6 text-red-400" />
				</div>
				<h3 class="mb-3 text-xl font-bold">Global Edge Network</h3>
				<p class="text-zinc-400">
					Deploy to 200+ data centers worldwide for lightning-fast performance no matter where your
					users are.
				</p>
			</div>
			<div class="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-8">
				<div
					class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 transition-opacity group-hover:opacity-100"
				></div>
				<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-900">
					<ArrowRight class="h-6 w-6 text-red-400" />
				</div>
				<h3 class="mb-3 text-xl font-bold">And Much More</h3>
				<p class="text-zinc-400">
					Discover all our features designed to make your development workflow seamless and
					efficient.
				</p>
			</div>
		</div>
	</section>

	<section class="container mx-auto px-4 py-24">
		<div
			class="mx-auto max-w-4xl rounded-lg border border-red-800/50 bg-gradient-to-r from-red-900/50 to-orange-900/50 p-8 text-center md:p-12"
		>
			<h2 class="mb-6 text-3xl font-bold md:text-4xl">Ready to get started?</h2>
			<p class="mx-auto mb-8 max-w-2xl text-xl text-zinc-300">
				Join thousands of developers building the future on NimbusCloud.
			</p>
			<a href="/signup"
				><Button size="lg" class="bg-white text-black hover:bg-zinc-200">Create your account</Button
				></a
			>
		</div>
	</section>

	<footer class="container mx-auto border-t border-zinc-800 px-4 py-12">
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			<div>
				<h3 class="mb-4 font-bold">Product</h3>
				<ul class="space-y-2">
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Features
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Pricing
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Marketplace
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Enterprise
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 font-bold">Resources</h3>
				<ul class="space-y-2">
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Documentation
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Guides
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							API Reference
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Status
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 font-bold">Company</h3>
				<ul class="space-y-2">
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white"> About </a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white"> Blog </a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Careers
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Contact
						</a>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 font-bold">Legal</h3>
				<ul class="space-y-2">
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Privacy
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white"> Terms </a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Security
						</a>
					</li>
					<li>
						<a href="#" class="text-sm text-zinc-400 transition-colors hover:text-white">
							Cookies
						</a>
					</li>
				</ul>
			</div>
		</div>
		<div
			class="mt-12 flex flex-col items-center justify-between border-t border-zinc-800 pt-8 md:flex-row"
		>
			<div class="mb-4 flex items-center gap-2 md:mb-0">
				<Cloud class="h-6 w-6 text-red-500" />
				<span class="text-lg font-bold">NimbusCloud</span>
			</div>
			<p class="text-sm text-zinc-500">© 2025 NimbusCloud, Inc. All rights reserved.</p>
		</div>
	</footer>
</div>
