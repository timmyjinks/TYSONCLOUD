<script lang="ts">
	import { enhance } from '$app/forms';

	let showCreateModal = false;
	let showEditModal = false;
	let showDeleteModal = false;
	let selectedDeployment = null;
	let isLoading = false;
	export let data;
	export let form;
	console.log(form);

	function openCreateModal() {
		showCreateModal = true;
	}

	function openEditModal(deployment) {
		selectedDeployment = deployment;
		showEditModal = true;
	}

	function openDeleteModal(deployment) {
		selectedDeployment = deployment;
		showDeleteModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showEditModal = false;
		showDeleteModal = false;
		selectedDeployment = null;
		isLoading = false;
	}

	// Utility functions
	function getStatusColor(status) {
		return status === 'running' ? 'bg-green-500' : 'bg-gray-400';
	}

	function getHealthColor(health) {
		switch (health) {
			case 'healthy':
				return 'text-green-400';
			case 'warning':
				return 'text-yellow-400';
			case 'error':
				return 'text-red-400';
			default:
				return 'text-gray-400';
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	$: if (form?.error) {
		isLoading = false;
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
	<div class="mx-auto mb-8 max-w-7xl">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="mb-2 text-4xl font-light tracking-tight text-white">Deployments</h1>
				<p class="text-lg text-white/60">Manage your application deployments</p>
			</div>

			<div class="flex">
				<button
					on:click={openCreateModal}
					class="mr-[32px] flex items-center space-x-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-2xl"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					<span>New Deployment</span>
				</button>
				<form action="?/logout" method="post">
					<button
						class="flex items-center space-x-2 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-2xl disabled:bg-red-400"
						type="submit"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						<span>{isLoading ? 'Logging out...' : 'Logout'}</span>
					</button>
				</form>
			</div>
		</div>
	</div>

	<!-- Deployments Grid -->
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.deployments as deployment}
				<div
					class="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-200 hover:bg-white/15"
				>
					<!-- Header -->
					<div class="mb-4 flex items-start justify-between">
						<div class="flex items-center space-x-3">
							<div class="h-3 w-3 rounded-full {getStatusColor(deployment.status)}"></div>
							<h3 class="text-xl font-semibold text-white">{deployment.name}</h3>
						</div>

						<div class="flex items-center space-x-2">
							<button
								on:click={() => openEditModal(deployment)}
								class="rounded-xl p-2 text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
							</button>

							<button
								on:click={() => openDeleteModal(deployment)}
								class="rounded-xl p-2 text-white/60 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Description -->
					<p class="mb-4 line-clamp-2 text-sm text-white/70">{deployment.description}</p>

					<!-- URL -->
					{#if deployment.url}
						<div class="mt-4 border-t border-white/20 pt-4">
							<a
								href={'https://' + deployment.url}
								target="_blank"
								class="flex items-center space-x-1 text-sm font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
							>
								<span>Visit Site</span>
								<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div
			class="w-full max-w-lg rounded-3xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-2xl"
		>
			<h2 class="mb-6 text-2xl font-semibold text-white">Create New Deployment</h2>

			<form
				action="?/create"
				use:enhance={() => {
					isLoading = true;
				}}
				method="post"
				class="space-y-4"
			>
				<div>
					<input
						type="text"
						name="name"
						placeholder="Deployment Name"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-4 py-3 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
					/>
				</div>
				<div>
					<input
						type="text"
						name="image"
						placeholder="Docker image"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-4 py-3 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<textarea
						placeholder="Description"
						rows="3"
						class="w-full resize-none rounded-2xl border border-white/30 bg-white/90 px-4 py-3 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					></textarea>
				</div>

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						on:click={closeModals}
						class="flex-1 rounded-2xl border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-white/30"
					>
						Cancel
					</button>

					{#if isLoading}
						<button
							type="submit"
							disabled={isLoading}
							class="flex-1 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-50"
						>
							Creating...
						</button>
					{:else}
						<button
							type="submit"
							disabled={isLoading}
							class="flex-1 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-50"
						>
							Create
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div
			class="w-full max-w-lg rounded-3xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-2xl"
		>
			<h2 class="mb-6 text-2xl font-semibold text-white">Edit Deployment</h2>

			<form action="?/update" method="post" class="space-y-4">
				<div>
					<input
						type="text"
						name="name"
						placeholder="Deployment Name"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-4 py-3 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<input
						type="text"
						name="image"
						placeholder="Docker image"
						class="w-full rounded-2xl border border-white/30 bg-white/90 px-4 py-3 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<textarea
						placeholder="Description"
						rows="3"
						class="w-full resize-none rounded-2xl border border-white/30 bg-white/90 px-4 py-3 font-medium text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					></textarea>
				</div>

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						on:click={closeModals}
						class="flex-1 rounded-2xl border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-white/30"
					>
						Cancel
					</button>

					<input type="hidden" name="id" value={selectedDeployment?.id} />
					<button
						type="submit"
						disabled={isLoading}
						class="flex-1 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-50"
					>
						{isLoading ? 'Updating...' : 'Update'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Modal -->
{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div
			class="w-full max-w-md rounded-3xl border border-white/30 bg-white/20 p-8 shadow-2xl backdrop-blur-2xl"
		>
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20"
				>
					<svg class="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>

				<h2 class="mb-2 text-2xl font-semibold text-white">Delete Deployment</h2>
				<p class="mb-6 text-white/70">
					Are you sure you want to delete "{selectedDeployment?.name}"? This action cannot be
					undone.
				</p>

				<form action="?/delete" method="post">
					<div class="flex space-x-3">
						<button
							type="button"
							on:click={closeModals}
							class="flex-1 rounded-2xl border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-white/30"
						>
							Cancel
						</button>
						<input type="hidden" name="id" value={selectedDeployment?.id} />
						<button
							type="submit"
							disabled={isLoading}
							class="flex-1 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-700 disabled:opacity-50"
						>
							{isLoading ? 'Deleting...' : 'Delete'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
