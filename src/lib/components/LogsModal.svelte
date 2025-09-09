<script>
	import { X, Download, Search } from '@lucide/svelte';

	let { isOpen = false, onClose = () => {}, deployment = {}, logs = [] } = $props();

	let loading = $state(false);
	let searchQuery = $state('');

	function downloadLogs() {
		const logText = logs.map((log) => `${log}`);
		const blob = new Blob([logText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${deployment?.name || 'deployment'}-logs.txt`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleKeydown(event) {
		if (event.key === 'Escape' && isOpen) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Modal Content -->
		<div
			class="flex max-h-[80vh] w-full max-w-4xl flex-col rounded-lg border border-zinc-800 bg-zinc-900"
			role="document"
		>
			<!-- Modal Header -->
			<div class="flex items-center justify-between border-b border-zinc-800 p-4">
				<div>
					<h2 id="modal-title" class="text-lg font-semibold text-white">Deployment Logs</h2>
					<p class="text-sm text-zinc-400">
						{deployment?.name || 'Unknown Deployment'}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
						aria-label="Download logs"
						onclick={downloadLogs}
						disabled={loading || logs.length === 0}
					>
						<Download class="h-4 w-4" />
					</button>
					<button
						class="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
						aria-label="Close modal"
						onclick={onClose}
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			</div>

			<!-- Search Bar -->
			<div class="border-b border-zinc-800 p-4">
				<div class="relative">
					<Search
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-400"
					/>
					<input
						type="text"
						placeholder="Search logs..."
						bind:value={searchQuery}
						disabled={loading}
						class="w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pr-4 pl-10 text-white placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
					/>
				</div>
			</div>

			<!-- Logs Content -->
			<div class="flex-1 overflow-auto bg-black p-4 font-mono text-sm">
				{#if loading}
					<div class="flex h-32 items-center justify-center">
						<div class="flex items-center gap-2 text-zinc-400">
							<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-red-500"></div>
							<span>Fetching logs for {deployment?.name}...</span>
						</div>
					</div>
				{:else if logs.length === 0}
					<div class="flex h-32 items-center justify-center">
						<span class="text-zinc-500">No logs available for this deployment</span>
					</div>
				{:else}
					{#each logs as log}
						{#if !searchQuery || log.toLowerCase().includes(searchQuery.toLowerCase())}
							<div class="flex gap-4 py-1 hover:bg-zinc-900/50">
								<span class="whitespace-nowrap text-zinc-500">{log}</span>
							</div>
						{/if}
					{/each}
				{/if}
			</div>

			<!-- Modal Footer -->
			<div class="flex items-center justify-between border-t border-zinc-800 p-4">
				<span class="text-sm text-zinc-400">
					{#if loading}
						Loading logs...
					{:else}
						{logs.length} log entries
					{/if}
				</span>
				<button
					class="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
					onclick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
