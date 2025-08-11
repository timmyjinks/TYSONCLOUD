<script>
	import { ArrowUpRight, Cloud, LogOut, Plus, Settings, Trash2 } from '@lucide/svelte';
	import DeploymentModals from '$lib/components/DeploymentModals.svelte';

	let { navigateTo, data } = $props();

	let createModalOpen = $state(false);
	let updateModalOpen = $state(false);
	let deleteModalOpen = $state(false);
	let selectedDeployment = $state(null);
	let totalDeployments = $state(data.deployments.length);

	function handleUpdateClick(deployment) {
		selectedDeployment = deployment;
		updateModalOpen = true;
	}

	function handleDeleteClick(deployment) {
		selectedDeployment = deployment;
		deleteModalOpen = true;
	}
</script>

<div class="min-h-screen bg-black text-white">
	<!-- Header -->
	<header class="border-b border-zinc-800">
		<div class="container mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<button onclick={() => navigateTo('/')} class="flex items-center gap-2">
					<Cloud class="h-6 w-6 text-red-500" />
					<span class="text-lg font-bold">TYSONCLOUD</span>
				</button>
				<div class="flex items-center gap-4">
					<button
						class="flex items-center gap-2 rounded-md px-3 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
					>
						<Settings class="h-4 w-4" />
						Settings
					</button>
					<form action="?/logout" method="POST">
						<button
							class="flex items-center gap-2 rounded-md px-3 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
						>
							<LogOut class="h-4 w-4" />
							Logout
						</button>
					</form>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="container mx-auto px-4 py-8">
		<!-- Dashboard Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">Dashboard</h1>
				<p class="text-zinc-400">Manage your deployments</p>
			</div>
			<button
				class="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-medium hover:bg-red-700"
				onclick={() => (createModalOpen = true)}
			>
				<Plus class="h-4 w-4" />
				New Deployment
			</button>
		</div>

		<!-- Deployments Section -->
		<section>
			<div class="mb-4">
				<h2 class="text-xl font-semibold">Your Deployments</h2>
			</div>

			<!-- Deployment Cards -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.deployments as deployment (deployment.id)}
					<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
						<div class="mb-4 flex items-start justify-between">
							<div>
								<h3 class="text-lg font-semibold">{deployment.name}</h3>
								<div class="mt-1 flex items-center">
									<span class="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
									<span class="text-sm text-zinc-400 capitalize">{deployment.status}</span>
								</div>
							</div>
							<div class="flex gap-1">
								<button
									class="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
									onclick={() => handleUpdateClick(deployment)}
								>
									<Settings class="h-4 w-4" />
								</button>
								<button
									class="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-red-500"
									onclick={() => handleDeleteClick(deployment)}
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>

						<div class="mb-4 flex items-center">
							<a
								href="https://{deployment.url}"
								target="_blank"
								class="flex items-center text-sm text-zinc-400 hover:text-red-400"
							>
								{deployment.url}
								<ArrowUpRight class="ml-1 h-3 w-3" />
							</a>
						</div>

						<div class="flex justify-between text-xs text-zinc-500">
							<span>Last deployed {deployment.lastDeployed}</span>
							<span>{deployment.region}</span>
						</div>

						<div class="mt-4 flex justify-between border-t border-zinc-800 pt-4">
							<button
								class="rounded-md border border-zinc-700 bg-transparent px-3 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
							>
								Logs (Coming soon...)
							</button>
							<button
								class="rounded-md bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
								onclick={() => handleUpdateClick(deployment)}
							>
								Update
							</button>
						</div>
					</div>
				{/each}

				<!-- Add New Deployment Card -->
				<button
					class="flex h-full min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900 p-5 transition-colors hover:bg-zinc-800/50"
					onclick={() => (createModalOpen = true)}
				>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
						<Plus class="h-6 w-6 text-zinc-400" />
					</div>
					<p class="font-medium text-zinc-400">Deploy a new project</p>
					<p class="mt-1 text-sm text-zinc-500">Click to get started</p>
				</button>
			</div>
		</section>

		<!-- Quick Stats -->
		<section class="mt-12">
			<h2 class="mb-4 text-xl font-semibold">Quick Stats</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
					<p class="text-sm text-zinc-400">Total Deployments</p>
					<p class="mt-1 text-2xl font-bold">{totalDeployments}</p>
				</div>
				<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
					<p class="text-sm text-zinc-400">Total Requests (30d)</p>
					<p class="mt-1 text-2xl font-bold">0</p>
				</div>
				<div class="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
					<p class="text-sm text-zinc-400">Compute Usage</p>
					<p class="mt-1 text-2xl font-bold">0%</p>
					<div class="mt-2 h-2 w-full rounded-full bg-zinc-800">
						<div class="h-2 rounded-full bg-red-600" style="width: 0%"></div>
					</div>
				</div>
			</div>
		</section>
	</main>
</div>

<!-- Modals -->
<DeploymentModals
	{createModalOpen}
	{updateModalOpen}
	{deleteModalOpen}
	{selectedDeployment}
	onCreateModalChange={(open) => (createModalOpen = open)}
	onUpdateModalChange={(open) => (updateModalOpen = open)}
	onDeleteModalChange={(open) => (deleteModalOpen = open)}
/>
