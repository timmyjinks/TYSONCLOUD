<script>
	import { Globe, Settings, X, Plus } from '@lucide/svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { enhance } from '$app/forms';

	let loading = $state(false);
	let errorMessage = $state('');

	let {
		createModalOpen,
		updateModalOpen,
		deleteModalOpen,
		selectedDeployment,
		onCreateModalChange,
		onUpdateModalChange,
		onDeleteModalChange
	} = $props();

	let createFormData = $state({
		name: '',
		url: '',
		envs: [],
		volume: ''
	});

	let updateFormData = $state({
		name: '',
		url: '',
		envs: [{ key: '', value: '' }],
		volume: '',
		image: '',
		update: false
	});

	$effect(() => {
		if (selectedDeployment) {
			updateFormData = {
				name: selectedDeployment.name,
				url: selectedDeployment.url || '',
				envs: selectedDeployment.envs || [],
				volume: selectedDeployment.volume || '',
				image: selectedDeployment.image || '',
				update: false
			};
		}
	});

	function close() {
		onCreateModalChange(false);
		onUpdateModalChange(false);
		onDeleteModalChange(false);
		createFormData.name = '';
		createFormData.url = '';
		createFormData.envs = [];
		createFormData.volume = '';
		errorMessage = '';
		selectedDeployment = null;
	}

	function submitForm() {
		loading = true;
		errorMessage = '';

		return async ({ result, update }) => {
			loading = false;

			if (result.type === 'failure') {
				errorMessage = result.data?.error || 'Something went wrong';
				return;
			}

			await update();
			close();
		};
	}
</script>

<!-- Create Deployment Modal -->
{#if createModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 text-white">
			<div class="p-6">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Globe class="h-5 w-5 text-red-500" />
						<h2 class="text-lg font-semibold">Create New Deployment</h2>
					</div>
					<button onclick={close} class="text-zinc-400 hover:text-white">
						<X class="h-5 w-5" />
					</button>
				</div>
				<p class="mb-6 text-sm text-zinc-400">Deploy your project to NimbusCloud in seconds.</p>

				<form action="?/create" method="POST" class="space-y-4" use:enhance={submitForm}>
					<div class="space-y-2">
						<label for="name" class="block text-sm font-medium"> Project Name </label>
						<input
							id="name"
							name="name"
							maxlength="24"
							bind:value={createFormData.name}
							placeholder="my website"
							class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="url" class="block text-sm font-medium"> URL or Docker Image </label>
						<input
							id="url"
							name="url"
							bind:value={createFormData.url}
							placeholder="https://github.com/timmyjinks/TYSONCLOUD or image:latest"
							class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500"
							required
						/>
					</div>

					<div class="flex flex-col space-y-2">
						<label class="block text-sm font-medium" for="envs"> Environment Variables </label>
						<div class="space-y-2">
							{#each createFormData.envs as env, index}
								<div class="flex gap-2">
									<input
										id={`env-key-${index}`}
										bind:value={env.key}
										placeholder="KEY"
										class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 text-sm text-white placeholder:text-zinc-500"
									/>
									<input
										id={`env-value-${index}`}
										bind:value={env.value}
										placeholder="VALUE"
										class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 text-sm text-white placeholder:text-zinc-500"
									/>
									<button
										type="button"
										onclick={() =>
											(createFormData.envs = createFormData.envs.filter((_, i) => i !== index))}
										class="px-2 text-red-400 hover:text-red-300"
									>
										<X class="h-4 w-4" />
									</button>
								</div>
								<input type="hidden" name="env" value={JSON.stringify(createFormData.envs)} />
							{/each}
							<button
								type="button"
								onclick={() =>
									(createFormData.envs = [...createFormData.envs, { key: '', value: '' }])}
								class="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
							>
								<Plus class="h-3 w-3" />
								Add Environment Variable
							</button>
						</div>
					</div>

					<div class="space-y-2">
						<label for="volume" class="block text-sm font-medium"> Volume Mount </label>
						<input
							id="volume"
							name="volume"
							bind:value={createFormData.volume}
							placeholder="/data"
							class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
						/>
					</div>

					{#if errorMessage != ''}
						<p class="text-red-500">{errorMessage}</p>
					{/if}

					<div class="flex gap-2 pt-4">
						<button
							type="button"
							onclick={close}
							class="rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
						>
							Cancel
						</button>
						<button
							disabled={loading}
							type="submit"
							class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
						>
							{#if loading}
								. . .
							{:else}
								Deploy Project
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Deployment Modal -->
{#if deleteModalOpen && selectedDeployment}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 text-white">
			<div class="p-6">
				<div class="mb-5 flex items-center justify-between">
					<form action="?/delete" method="POST" use:enhance={submitForm}>
						<p class="text-lg font-semibold">Are you sure?</p>
						<input type="hidden" name="id" value={selectedDeployment.id} />
						<div class="flex gap-2 pt-4">
							<button
								type="button"
								onclick={close}
								class="rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
							>
								Cancel
							</button>
							<button
								disabled={loading}
								type="submit"
								class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
							>
								{#if loading}
									. . .
								{:else}
									Delete Deployment
								{/if}
							</button>
							{#if errorMessage != ''}
								<p class="text-red-500">{errorMessage}</p>
							{/if}
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Update Deployment Modal -->
{#if updateModalOpen && selectedDeployment}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 text-white">
			<div class="p-6">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Settings class="h-5 w-5 text-red-500" />
						<h2 class="text-lg font-semibold">Update Deployment</h2>
					</div>
					<button onclick={close} class="text-zinc-400 hover:text-white">
						<X class="h-5 w-5" />
					</button>
				</div>
				<p class="mb-6 text-sm text-zinc-400">
					Update the configuration for "{selectedDeployment.name}".
				</p>

				<form action="?/update" method="POST" class="space-y-4" use:enhance={submitForm}>
					<input type="hidden" name="id" value={selectedDeployment.id} />
					<div class="space-y-2">
						<label for="update-name" class="block text-sm font-medium"> Project Name </label>
						<input
							id="update-name"
							name="name"
							bind:value={updateFormData.name}
							class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
							required
						/>
					</div>

					<div class="flex flex-col space-y-2">
						<label class="block text-sm font-medium" for="envs"> Environment Variables </label>
						<div class="space-y-2">
							{#each createFormData.envs as env, index}
								<div class="flex gap-2">
									<input
										id={`env-key-${index}`}
										bind:value={env.key}
										placeholder="KEY"
										class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 text-sm text-white placeholder:text-zinc-500"
									/>
									<input
										id={`env-value-${index}`}
										bind:value={env.value}
										placeholder="VALUE"
										class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 text-sm text-white placeholder:text-zinc-500"
									/>
									<button
										type="button"
										onclick={() =>
											(createFormData.envs = createFormData.envs.filter((_, i) => i !== index))}
										class="px-2 text-red-400 hover:text-red-300"
									>
										<X class="h-4 w-4" />
									</button>
								</div>
								<input type="hidden" name="env" value={JSON.stringify(createFormData.envs)} />
							{/each}
							<button
								type="button"
								onclick={() =>
									(createFormData.envs = [...createFormData.envs, { key: '', value: '' }])}
								class="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
							>
								<Plus class="h-3 w-3" />
								Add Environment Variable
							</button>
						</div>
					</div>

					<div class="space-y-2">
						<label for="update-volume" class="block text-sm font-medium"> Volume Mount </label>
						<input
							id="update-volume"
							name="volume"
							bind:value={updateFormData.volume}
							class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
						/>
					</div>
					<div class="space-y-2">
						<label for="update-volume" class="block text-sm font-medium"> Update </label>
						<Switch name="update" checked={updateFormData.update} />
					</div>

					{#if errorMessage != ''}
						<p class="text-red-500">{errorMessage}</p>
					{/if}

					<div class="flex gap-2 pt-4">
						<button
							type="button"
							onclick={close}
							class="rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
						>
							Cancel
						</button>
						<button
							disabled={loading}
							type="submit"
							class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
						>
							{#if loading}
								. . .
							{:else}
								Update Deployment
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
