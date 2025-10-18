<script>
	import {
		Globe,
		GitBranch,
		Settings,
		X,
		Plus,
		Container,
		Sparkles,
		AlertTriangle
	} from '@lucide/svelte';
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

	let createActiveTab = $state('docker');
	let updateActiveTab = $state('docker');

	let createFormData = $state({
		name: '',
		envs: [],
		volume: '/data',
		source: ''
	});

	let updateFormData = $state({
		name: '',
		source: '',
		envs: [],
		volume: '',
		update: false
	});

	$effect(() => {
		if (selectedDeployment && selectedDeployment.type) {
			updateActiveTab = selectedDeployment.type;
		}
	});

	$effect(() => {
		if (selectedDeployment) {
			updateFormData = {
				name: selectedDeployment.name,
				source: selectedDeployment.source || '',
				envs: selectedDeployment.envs || [],
				volume: selectedDeployment.volume || '',
				update: false
			};
		}
	});

	function close() {
		onCreateModalChange(false);
		onUpdateModalChange(false);
		onDeleteModalChange(false);
		createFormData.name = '';
		createFormData.source = '';
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

				<!-- Added tab navigation for deployment methods -->
				<div class="mb-6 flex gap-2 border-b border-zinc-800">
					<button
						type="button"
						onclick={() => (createActiveTab = 'docker')}
						class={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
							createActiveTab === 'docker'
								? 'border-red-500 text-red-500'
								: 'border-transparent text-zinc-400 hover:text-white'
						}`}
					>
						<Container class="h-4 w-4" />
						Docker
					</button>
					<button
						type="button"
						onclick={() => (createActiveTab = 'git')}
						class={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
							createActiveTab === 'git'
								? 'border-red-500 text-red-500'
								: 'border-transparent text-zinc-400 hover:text-white'
						}`}
					>
						<GitBranch class="h-4 w-4" />
						Git
					</button>
					<button
						type="button"
						onclick={() => (createActiveTab = 'prompt')}
						class={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
							createActiveTab === 'prompt'
								? 'border-red-500 text-red-500'
								: 'border-transparent text-zinc-400 hover:text-white'
						}`}
					>
						<Sparkles class="h-4 w-4" />
						Prompt
					</button>
				</div>

				<form action="?/create" method="POST" class="space-y-4" use:enhance={submitForm}>
					<div class="space-y-2">
						<label for="name" class="block text-sm font-medium"> Project Name </label>
						<input
							id="name"
							name="name"
							maxlength="24"
							bind:value={createFormData.name}
							placeholder="my-awesome-project"
							class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500"
							required
						/>
					</div>

					<!-- Docker tab content -->
					{#if createActiveTab === 'docker'}
						<input type="hidden" name="type" value="docker" />
						<div class="space-y-2">
							<label for="docker-image" class="block text-sm font-medium"> Docker Image </label>
							<input
								id="docker-image"
								name="source"
								bind:value={createFormData.source}
								placeholder="nginx"
								class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500"
								required
							/>
						</div>
					{/if}

					<!-- Git tab content -->
					{#if createActiveTab === 'git'}
						<input type="hidden" name="type" value="git" />
						<div class="space-y-2">
							<label for="git-url" class="block text-sm font-medium"> Repository URL </label>
							<input
								id="git-url"
								bind:value={createFormData.source}
								name="source"
								placeholder="https://github.com/user/repo.git"
								class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500"
								required
							/>
						</div>
					{/if}

					<!-- Prompt tab content -->
					{#if createActiveTab === 'prompt'}
						<input type="hidden" name="type" value="slop" />
						<div class="space-y-2">
							<label for="prompt" class="block text-sm font-medium">
								Describe Your Deployment
							</label>
							<textarea
								id="prompt"
								name="source"
								bind:value={createFormData.source}
								placeholder="Deploy a Node.js API with PostgreSQL database..."
								class="min-h-[120px] w-full resize-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500"
								required
							></textarea>
							<p class="text-xs text-zinc-500">
								Describe what you want to deploy and we'll configure it for you.
							</p>
						</div>
					{/if}

					{#if createActiveTab !== 'prompt'}
						<div class="space-y-2">
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
											placeholder="value"
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
					{/if}

					{#if createActiveTab === 'docker'}
						<div class="space-y-2">
							<label for="volume" class="block text-sm font-medium"> Volume Mount </label>
							<input
								id="volume"
								name="volume"
								bind:value={createFormData.volume}
								placeholder="/app/data"
								class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
							/>
						</div>
					{/if}

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

					<!-- Show only Docker fields if deployment type is docker -->
					{#if selectedDeployment.type === 'docker'}
						<input type="hidden" name="type" value="docker" />
						<div class="space-y-2">
							<label class="block text-sm font-medium" for="update-envs">
								Environment Variables
							</label>
							<div class="space-y-2">
								{#each updateFormData.envs as env, index}
									<div class="flex gap-2">
										<input
											id={`update-env-key-${index}`}
											bind:value={env.key}
											placeholder="KEY"
											class="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
										/>
										<input
											id={`update-env-value-${index}`}
											bind:value={env.value}
											placeholder="value"
											class="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
										/>
										{#if updateFormData.envs.length > 1}
											<button
												type="button"
												onclick={() =>
													(updateFormData.envs = updateFormData.envs.filter((_, i) => i !== index))}
												class="px-2 text-red-400 hover:text-red-300"
											>
												<X class="h-4 w-4" />
											</button>
										{/if}
									</div>
								{/each}
								<button
									type="button"
									onclick={() =>
										(updateFormData.envs = [...updateFormData.envs, { key: '', value: '' }])}
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
					{/if}

					<!-- Show only Git fields if deployment type is git -->
					{#if selectedDeployment.type === 'git'}
						<input type="hidden" name="type" value="git" />
						<div class="space-y-2">
							<label for="update-git-url" class="block text-sm font-medium"> Repository URL </label>
							<input
								id="update-git-url"
								bind:value={updateFormData.source}
								name="source"
								placeholder="https://github.com/user/repo.git"
								class="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500"
								required
							/>
						</div>
					{/if}

					<!-- Show only Prompt field if deployment type is prompt -->
					{#if selectedDeployment.type === 'slop'}
						<input type="hidden" name="type" value="slop" />
						<div class="space-y-2">
							<!-- <textarea -->
							<!-- 	id="update-prompt" -->
							<!-- 	bind:value={updateFormData.prompt} -->
							<!-- 	placeholder="Deploy a Node.js API with PostgreSQL database..." -->
							<!-- 	class="min-h-[120px] w-full resize-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500" -->
							<!-- 	required -->
							<!-- ></textarea> -->
						</div>
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

<!-- Delete Confirmation Modal -->
{#if deleteModalOpen && selectedDeployment}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 text-white">
			<div class="p-6">
				<div class="mb-4 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<AlertTriangle class="h-5 w-5 text-red-500" />
						<h2 class="text-lg font-semibold">Delete Deployment</h2>
					</div>
					<button onclick={close} class="text-zinc-400 hover:text-white">
						<X class="h-5 w-5" />
					</button>
				</div>
				<p class="mb-6 text-sm text-zinc-400">
					Are you sure you want to delete "{selectedDeployment.name}"? This action cannot be undone.
				</p>
				<form action="?/delete" method="POST" use:enhance={submitForm}>
					<input type="hidden" name="id" value={selectedDeployment.id} />
					<div class="flex gap-2">
						<button
							type="button"
							onclick={close}
							class="flex-1 rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
{/if}
