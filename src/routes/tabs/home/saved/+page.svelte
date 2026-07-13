<script lang="ts">
	import { fly, scale, blur, slide, fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import Cards from '$lib/components/Cards.svelte';
	import { home, localItems, localSpaces, confirmState, truncate, setUndo, togglePinSelectedItems, haptic } from '$lib/shared.svelte';
	import { ArrowLeft, CircleDotDashed, CircleMinus, Pin, Trash2, CheckSquare, Square, X } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	let { data }: { data: PageData } = $props();

	let spaceMenu = $state(false);

	let reversedItems = $derived([...localItems.current].reverse());

	function addSelectedToSpace(spc: any) {
		try {
			let added = 0;
			for (const title of home.selectedTitles) {
				const item = localItems.current.find((i: any) => i.title === title);
				if (item && !spc.items.some((i: any) => i.title === title)) {
					spc.items.push(item);
					added++;
				}
			}
			toast.success(added + ' items added to ' + spc.name, { duration: 2000 });
			haptic('medium');
		} catch (err) {
			console.error('Failed to add selected to space:', err);
			toast.error('Failed to add items to space', { duration: 2000 });
		}
		home.selectedTitles = [];
		home.selectMode = false;
		spaceMenu = false;
	}

	function toggleSelectAll() {
		haptic('light');
		let allSelected = reversedItems.every((item: any) => home.selectedTitles.includes(item.title));
		if (allSelected) {
			home.selectedTitles = [];
		} else {
			home.selectedTitles = reversedItems.map((item: any) => item.title);
		}
	}
</script>

<div class="relative z-1 mb-20 grid min-h-dvh content-start space-y-6" onclick={(e) => {
	if (home.selectMode && !(e.target as HTMLElement).closest('.card')) {
		home.selectMode = false;
		home.selectedTitles = [];
	}
}}>
	<div in:scale|global class="transform-gpu">
		<div class="grid {home.savedLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
			{#each reversedItems as _, i (_.title)}
				<Cards
					img={_.img}
					h1={truncate(_.title,80)}
					p={truncate(_.text,160)}
					fL={_.link}
					fR={_.date}
					full={!home.savedLayout}
					item={_}
					selectMode={home.selectMode}
					selected={home.selectedTitles.includes(_.title)}
					onselect={(checked) => {
						if (checked) {
							home.selectedTitles = [...home.selectedTitles, _.title];
						} else {
							home.selectedTitles = home.selectedTitles.filter((t: string) => t !== _.title);
							if (home.selectedTitles.length === 0) home.selectMode = false;
						}
					}}
				/>
			{/each}
		</div>
	</div>
</div>

{#if home.selectMode}
	<div
		in:fly={{ y: 40, duration: 200 }}
		class="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 overflow-x-auto rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10"
	>
		<button
			class="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold text-primary-400 transition-colors duration-200 hover:bg-primary-500/10"
			onclick={toggleSelectAll}
		>
			{#if reversedItems.every((item: any) => home.selectedTitles.includes(item.title))}
				<CheckSquare class="size-4" />
				All
			{:else}
				<Square class="size-4" />
				All
			{/if}
		</button>
		<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">{home.selectedTitles.length}</span>
		{#if home.selectedTitles.length > 0}
			<span class="ml-auto flex items-center gap-1">
				<button
					class="flex items-center justify-center rounded-xl p-2 text-yellow-300/80 transition-colors duration-200 hover:bg-white/10 hover:text-yellow-300"
					onclick={() => { spaceMenu = true; }}
				>
					<CircleDotDashed class="size-4" />
				</button>
				<button
					class="flex items-center justify-center rounded-xl p-2 text-primary-400/80 transition-colors duration-200 hover:bg-primary-500/10 hover:text-primary-400"
					onclick={() => { haptic('light'); togglePinSelectedItems('home'); }}
				>
					<Pin class="size-4" />
				</button>
				<button
					class="flex items-center justify-center rounded-xl bg-red-500/80 p-2 text-white transition-colors duration-200 hover:bg-red-400"
				onclick={() => {
					haptic('medium');
					confirmState.open = true;
					confirmState.title = 'Delete ' + home.selectedTitles.length + ' items?';
						confirmState.message = 'This will remove them from all spaces too';
						confirmState.confirmText = 'Delete All';
						confirmState.onConfirm = () => {
							try {
								let titles = home.selectedTitles;
								const deletedItems = localItems.current.filter((i: any) => titles.includes(i.title));
								const spaceMappings: Array<{ spaceName: string; items: any[] }> = [];
								for (const spc of localSpaces.current) {
									const matching = spc.items.filter((i: any) => titles.includes(i.title));
									if (matching.length > 0) {
										spaceMappings.push({ spaceName: spc.name, items: matching });
									}
								}
								let tempArr = localItems.current.filter(
									(item: any) => !titles.includes(item.title)
								);
								localItems.current = tempArr;
								localSpaces.current.forEach((spc: any) => {
									spc.items = spc.items.filter(
										(item: any) => !titles.includes(item.title)
									);
								});
								const msg = titles.length + ' items Deleted';
								setUndo(msg, deletedItems, spaceMappings);
								toast.success(msg, { duration: 2000 });
							} catch (err) {
								console.error('Failed to delete items:', err);
								toast.error('Failed to delete items', { duration: 2000 });
							}
							home.selectedTitles = [];
							home.selectMode = false;
						};
					}}
				>
					<Trash2 class="size-4" />
				</button>
				<button
					class="flex items-center justify-center rounded-xl p-2 text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
					onclick={() => {
						haptic('light');
						home.selectedTitles = [];
						home.selectMode = false;
					}}
				>
					<X class="size-4" />
				</button>
			</span>
		{/if}
	</div>

	{#if spaceMenu}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			transition:fade={{ duration: 150 }}
			onclick={() => { spaceMenu = false; }}
			class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
		></div>
		<div
			transition:slide={{ duration: 200 }}
			class="fixed bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-2xl bg-primary-950/90 px-4 pb-8 pt-2 shadow-2xl backdrop-blur-xl border-t border-white/10"
		>
			<div class="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20"></div>
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm font-bold text-white/80">Add {home.selectedTitles.length} items to...</span>
				<button
					onclick={() => { spaceMenu = false; }}
					class="rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X class="size-4" />
				</button>
			</div>
			<div class="flex max-h-60 flex-col gap-1 overflow-y-auto">
				{#each [...localSpaces.current].reverse() as spc}
					<button
						onclick={() => addSelectedToSpace(spc)}
						class="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-white/80 transition-colors duration-150 hover:bg-white/10 active:scale-[0.98]"
					>
						<span class="h-3 w-3 shrink-0 rounded-full bg-{spc.clr}-400"></span>
						<span>{spc.name}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
{:else}
	<!-- Back Button -->
	<button
		in:slide|global={{delay:400}}
		onclick={() => {
			haptic('light');
			history.back();
		}}
		class="bg-surface-950/60 fixed bottom-0 left-1/2 z-9 w-[90vw] -translate-x-1/2 rounded-t-2xl backdrop-blur-xs"
	>
		<span class="btn py-3">
			<ArrowLeft />
			Go Back
		</span>
	</button>
{/if}

<div
	in:fly={{ delay: 0, x: -100 }}
	class="fixed inset-0 z-0 flex flex-col items-center justify-center gap-1 text-gray-300/30"
>
	{#if localItems.current.length < 1}
		<CircleMinus class="size-28" />
		<p class="h3">All Empty!</p>
		<p class="text-sm font-bold">Nothing Saved yet</p>
	{/if}
</div>
