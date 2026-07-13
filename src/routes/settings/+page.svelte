<script lang="ts">
	import {
		ArrowLeft,
		Club,
		Diamond,
		Heart,
		Spade,
		Trash,
		Settings,
		DownloadCloud,
		ArrowDownFromLine,
		ArrowUpFromLine,
		Palette,
		StickerIcon,
		Info
	} from 'lucide-svelte';
	import type { PageData } from '../$types';
	import { Accordion, Combobox, Switch } from '@skeletonlabs/skeleton-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import {
		comboboxData,
		data_theme,
		first,
		home,
		localItems,
		localSpaces,
		onboardingView,
		selectedTheme,
		haptic
	} from '$lib/shared.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { storage } from '@sveu/browser';

	let { data }: { data: PageData } = $props();
	let disturb = $state(false);
	let notifications = $state(true);
	let disabled = $state(false);
	let importDialogue = $state(false);
	let holdProgress = $state(0);
	let holdTimer: ReturnType<typeof setTimeout> | null = null;
	let holdInterval: ReturnType<typeof setInterval> | null = null;
	let importedData = $state<any[]>([]);
	let importExistingCount = $state(0);
	let importNewCount = $state(0);
	let value = $state(['1']);
	function DeleteEverything() {
		try {
			localItems.current = [];
			localSpaces.current = [];
			first.current = true;
			data_theme.current = { label: 'Mona', value: 'mona', color: 'text-purple-500' };
			home.pageTitle = 'Home';
			toast('Everything Wiped!', {
				icon: '⚠️',
				style: 'border-radius: 200px; background: #4a3342; color: #fff;'
			});

			caches.keys().then(function (names) {
				for (let name of names) {
					console.log(name + ' Deleted', caches.delete(name));
				}
			}).catch(console.error);

			localStorage.clear();
			sessionStorage.clear();
			document.cookie.split(';').forEach((c) => {
				document.cookie = c
					.replace(/^ +/, '')
					.replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
			});
			if (window.indexedDB) {
				indexedDB.deleteDatabase('glovebox');
			}
		} catch (err) {
			console.error('Failed to delete everything:', err);
		}
		location.replace('/');
	}

	function startHold(e?: Event) {
		if (e?.cancelable) e.preventDefault();
		cancelHold();
		holdProgress = 0;
		haptic('medium');
		holdInterval = setInterval(() => {
			holdProgress = Math.min(holdProgress + 2, 100);
			if (holdProgress % 10 === 0) haptic('light');
			if (holdProgress >= 100) {
				cancelHold();
				haptic('heavy');
				DeleteEverything();
			}
		}, 40);
	}

	function cancelHold() {
		if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
		if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
		holdProgress = 0;
	}
	const colors = ['red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green'];
	let color = $state(colors[0]);

	function setColor(selectedColor: string) {
		color = selectedColor;
	}

	function normalizeUrl(u: string): string {
		return u.trim().toLowerCase().replace(/\/+$/, '');
	}

	function isItemDuplicate(existing: any, incoming: any): boolean {
		if (existing.url && incoming.url) {
			if (normalizeUrl(existing.url) === normalizeUrl(incoming.url)) return true;
		}
		if (existing.title && incoming.title) {
			if (existing.title.trim().toLowerCase() === incoming.title.trim().toLowerCase()) return true;
		}
		return false;
	}

	function mergeImportData() {
		const merged = [...localItems.current];
		let added = 0;
		for (const item of importedData) {
			const exists = merged.some((e: any) => isItemDuplicate(e, item));
			if (!exists) {
				merged.push(item);
				added++;
			}
		}
		localItems.current = merged;
		toast(`Imported ${added} items, skipped ${importedData.length - added}`, { icon: '✅' });
		importDialogue = false;
		goto('/tabs/home');
	}

	function replaceImportData() {
		localItems.current = importedData;
		toast('Data Imported!', { icon: '✅' });
		importDialogue = false;
		goto('/tabs/home');
	}
</script>

<main
	in:slide={{ delay: 0 }}
	class="flex flex-col items-center justify-center space-y-4 pb-10 justify-self-center"
>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border p-4">
		<Accordion {value} onValueChange={(e) => (value = e.value)} multiple>
			<!-- <Accordion.Item value="0">
				{#snippet lead()}<Settings size={24} />{/snippet}
				{#snippet control()}
					General
					<p class="text-xs text-gray-400">Manage your settings and preferences.</p>
				{/snippet}
				{#snippet panel()}
					<div>
						<section class="w-full space-y-4">
							<div class="flex items-center justify-between gap-4">
								<p>Default to the inactive state.</p>
								<Switch
									name="disturb"
									checked={disturb}
									onCheckedChange={(e) => (disturb = e.checked)}
								></Switch>
							</div>
							<hr class="hr" />
						</section>
					</div>
				{/snippet}
			</Accordion.Item> -->

			<Accordion.Item value="1">
				{#snippet lead()}<Palette size={24} />{/snippet}
				{#snippet control()}
					Themes
					<p class="text-xs text-gray-400">select a theme you want to apply.</p>
				{/snippet}
				{#snippet panel()}
					<div class="grid grid-cols-3 gap-2">
						<!-- Loop through the available colors -->
						{#each comboboxData as c}
							<!-- On selection, set the color state, dynamically update classes -->
							<button
								class={`chip bg-primary-500 h-12 text-lg capitalize ${data_theme.current.value === c.value ? 'preset-filled' : 'preset-tonal'}`}
						onclick={() => {
								haptic('light');
								data_theme.current = c;
								document.documentElement.setAttribute('data-theme', c.value);
							}}
							>
								<span>{c.label}</span>
							</button>
						{/each}
					</div>
					<button
						class={`chip bg-primary-500 mt-2 h-12 w-full text-lg capitalize ${data_theme.current.value === 'none' ? 'preset-filled' : 'preset-tonal'}`}
					onclick={() => {
						haptic('light');
						data_theme.current.value = 'none';
						document.documentElement.setAttribute('data-theme', data_theme.current.value);
					}}
					>
						<span>None</span>
					</button>
				{/snippet}
			</Accordion.Item>

			<!-- <hr class="hr" />
			<Accordion.Item value="1">
				{#snippet lead()}<Palette size={24} />{/snippet}
				{#snippet control()}
					Theme
					<p class="text-xs text-gray-400">select a theme you want to apply.</p>
				{/snippet}
				{#snippet panel()}
					<div class="flex w-fit">
						<Combobox
							openOnKeyPress={false}
							allowCustomValue={false}
							defaultValue={selectedTheme.selected}
							data={comboboxData}
							value={[selectedTheme.theme.value]}
							onValueChange={(e) => {
								selectedTheme.selected = e.value;
								selectedTheme.theme =
									comboboxData.find((item) => item.value == e.value) || comboboxData[0];
								document.documentElement.setAttribute('data-theme', selectedTheme.theme.value);
								data_theme.current = selectedTheme.theme;
							}}
							placeholder={data_theme.current.label}
						>
							{#snippet item(item)}
								<div class="flex justify-between space-x-2">
									<span>{item.label}</span>
									<span><Palette class={item.color} /></span>
								</div>
							{/snippet}
						</Combobox>
					</div>
				{/snippet}
			</Accordion.Item> -->
			<hr class="hr" />
			<Accordion.Item value="2" classes="text-green-400">
				{#snippet lead()}<DownloadCloud class="" size={24} />{/snippet}
				{#snippet control()}
					<p class="">Backup</p>
					<p class="text-xs text-gray-400">Backup your data to a file or import from a file.</p>
				{/snippet}
				{#snippet panel()}
					<div class="btn xs:flex-row flex flex-col items-center justify-between text-red-400">
					<button
					onclick={() => {
						haptic('light');
						const input = document.createElement('input');
						input.type = 'file';
						input.accept = '.json';
							input.onchange = (e) => {
								try {
									const file: any = e.target?.files[0];
									if (!file || file.type !== 'application/json') {
										toast('Invalid file type!', { icon: '⚠️' });
										return;
									}
									const reader = new FileReader();
									reader.onload = (event) => {
										try {
											const data = JSON.parse(event.target.result);
											if (!Array.isArray(data)) {
												toast('Invalid backup format', { icon: '⚠️' });
												return;
											}
											const valid = data.filter(
												(item: any) => item && typeof item === 'object' && item.title
											);
											if (valid.length === 0) {
												toast('No valid items found in backup', { icon: '⚠️' });
												return;
											}
											let newCount = 0;
											for (const item of valid) {
												const exists = localItems.current.some((e: any) =>
													isItemDuplicate(e, item)
												);
												if (!exists) newCount++;
											}
											importedData = valid;
											importExistingCount = localItems.current.length;
											importNewCount = newCount;
											importDialogue = true;
										} catch (err) {
											console.error('Import parse error:', err);
											toast('Invalid backup file', { icon: '⚠️' });
										}
									};
									reader.readAsText(file);
								} catch (err) {
									console.error('Import error:', err);
									toast('Import failed', { icon: '⚠️' });
								}
							};
							input.click();
						}}
						class="btn w-full bg-yellow-100/10 text-lg text-yellow-200"
						><ArrowDownFromLine /> Import</button
					>
						<button
						onclick={() => {
							haptic('light');
							if (localItems.current.length === 0) {
								toast('Nothing to export!', { icon: '⚠️' });
								return;
							}
								const data = JSON.stringify(localItems.current);
								const blob = new Blob([data], { type: 'application/json' });
								const url = URL.createObjectURL(blob);
								const a = document.createElement('a');
								a.href = url;
								a.download = 'glovebox_backup.json';
								document.body.appendChild(a);
								a.click();
								document.body.removeChild(a);
							}}
							class="btn w-full bg-cyan-200/10 text-lg text-cyan-400"
							>Export<ArrowUpFromLine /></button
						>
					</div>
				{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<Accordion.Item value="3" classes="text-primary-400">
				{#snippet lead()}<StickerIcon class="" size={24} />{/snippet}
				{#snippet control()}
					<p class="">Onboarding</p>
					<p class="text-xs text-gray-400">Revisit the welcome tutorial</p>
				{/snippet}
				{#snippet panel()}
					<div class="flex items-center justify-center">
						<button
						onclick={() => {
							haptic('light');
							onboardingView.active = true;
							goto('/tabs/home');
						}}
							class="btn w-full bg-primary-500/10 py-3 text-base"
						>
							View Onboarding
						</button>
					</div>
				{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<Accordion.Item value="4" classes="text-red-400">
				{#snippet lead()}<Trash class="" size={24} />{/snippet}
				{#snippet control()}
					<p class="">Format Data</p>
					<p class="text-xs text-gray-400">
						Warning: This will delete all your data and cannot be undone.
					</p>
				{/snippet}
				{#snippet panel()}
				<div class="flex items-center justify-center">
					<button
						ontouchstart={startHold}
						ontouchend={cancelHold}
						ontouchcancel={cancelHold}
						onpointerdown={startHold}
						onpointerup={cancelHold}
						onpointerleave={cancelHold}
						onpointercancel={cancelHold}
						oncontextmenu={(e) => e.preventDefault()}
						style="touch-action: none; -webkit-touch-callout: none; user-select: none;"
						class="btn relative w-full overflow-hidden bg-red-300/10 p-2 select-none"
					>
						<div
							class="absolute inset-0 bg-red-500/30 transition-none"
							style="width: {holdProgress}%"
						></div>
						<span class="relative z-10">
							{holdProgress > 0 ? 'Keep holding...' : 'Hold to Delete Everything'}
						</span>
					</button>
				</div>
			{/snippet}
			</Accordion.Item>
		</Accordion>
	</div>
	<div></div>
	{#if importDialogue}
		<div
			transition:fade
			class="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		>
			{@render ImportDialogue()}
		</div>
	{/if}
</main>

<!-- Back Button -->
<button
	in:slide|global={{delay:400}}
	onclick={() => {
		haptic('light');
		history.back();
	}}
	class=" bg-surface-950/60 fixed bottom-0 left-1/2 z-9 w-[90vw] -translate-x-1/2 rounded-t-2xl  backdrop-blur-xs"
>
	<span class="btn py-3">

		<ArrowLeft />
		Go Back
	</span>
</button>

{#snippet ImportDialogue()}
	<div class="card m-4 w-full max-w-md px-4 py-8 text-center">
		<div class="flex flex-col items-center justify-center gap-3">
			<p class="text-center text-2xl font-bold">Import Backup</p>
			<div class="space-y-1 text-sm">
				<p>Current items: <span class="font-mono font-bold">{importExistingCount}</span></p>
				<p>Items in backup: <span class="font-mono font-bold">{importedData.length}</span></p>
				<p class="text-green-400">New items to add: <span class="font-mono font-bold">{importNewCount}</span></p>
				{#if importNewCount < importedData.length}
					<p class="text-yellow-400">
						Skipped: <span class="font-mono">{importedData.length - importNewCount}</span> (already exist)
					</p>
				{/if}
			</div>
			<p class="text-surface-400 text-xs">Duplicates are detected by URL (if available) or title.</p>
			<div class="flex w-full flex-col gap-2 pt-2">
				<button
					onclick={() => { haptic('medium'); mergeImportData(); }}
					class="btn w-full bg-green-300/20 p-2 font-mono text-lg font-bold text-green-300"
				>
					Merge (add new)
				</button>
				<button
					onclick={() => { haptic('heavy'); replaceImportData(); }}
					class="btn w-full bg-yellow-300/20 p-2 font-mono text-lg font-bold text-yellow-300"
				>
					Replace (overwrite all)
				</button>
				<button
					onclick={() => { importDialogue = false; }}
					class="btn w-full bg-surface-500/20 p-2 font-mono text-lg font-bold text-surface-300"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/snippet}
