<script lang="ts">
	import { blur, draw, fade, fly, scale, slide } from 'svelte/transition';
	import type { PageProps } from '../../$types';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';

	import { cardPage, home, localItems, localSpaces, spaceview, confirmState, truncate, setUndo, saveCardPage, togglePinSelectedItems, scrollableVignette, longpress, sheetState, haptic } from '../../../lib/shared.svelte';
	import {
		ArrowDown,
		ArrowLeft,
		CircleMinus,
		CircleDotDashed,
		GripVertical,
		Pin,
		Trash2,
		Square,
		CheckSquare,
		Link,
		X
	} from 'lucide-svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import DropDown from '$lib/components/DropDownButton.svelte';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { Image } from '@unpic/svelte';

	let { data } = $props();

	const imgError = (e: any) => (e.target.src = NoImageUrl);

	let spaceMenu = $state(false);
	let dndItems: any[] = $state([]);

	const flipDurationMs = 200;
	const flipDurationMsGrid = 150;

	function handleDndConsider(e: CustomEvent<DndEvent<any>>) {
		dndItems = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<any>>) {
		dndItems = e.detail.items;
		const all = [...localItems.current];
		const pinned = all.filter((i: any) => i.pinned);
		const unpinned = all.filter((i: any) => !i.pinned);
		const reversed = [...dndItems].reverse();
		const reordered = reversed.map((item: any) => pinned.find((i: any) => i.title === item.title)).filter(Boolean);
		localItems.current = [...reordered, ...unpinned];
		haptic('medium');
	}

	let pinnedItems = $derived([...localItems.current].filter((i: any) => i.pinned).reverse().slice(0, 16));
	let recentItems = $derived([...localItems.current].filter((i: any) => !i.pinned).reverse().slice(0, 16));
	let allVisibleItems = $derived([...pinnedItems, ...recentItems]);

	let reorderContainer: HTMLDivElement;
	let autoScrollRaf: number | null = null;
	let pointerY = 0;

	function autoScrollLoop() {
		if (!reorderContainer) return;
		const rect = reorderContainer.getBoundingClientRect();
		const edgeSize = 60;
		const maxSpeed = 8;
		const distFromTop = pointerY - rect.top;
		const distFromBottom = rect.bottom - pointerY;
		let scrollAmount = 0;
		if (distFromTop >= 0 && distFromTop < edgeSize) {
			scrollAmount = -maxSpeed * (1 - distFromTop / edgeSize);
		} else if (distFromBottom >= 0 && distFromBottom < edgeSize) {
			scrollAmount = maxSpeed * (1 - distFromBottom / edgeSize);
		}
		if (scrollAmount !== 0) {
			reorderContainer.scrollTop += scrollAmount;
		}
		autoScrollRaf = requestAnimationFrame(autoScrollLoop);
	}

	$effect(() => {
		if (home.reorderMode) {
			dndItems = pinnedItems.map((item: any) => ({ ...item, id: item.title }));
			const onMove = (e: PointerEvent) => { pointerY = e.clientY; };
			document.addEventListener('pointermove', onMove);
			autoScrollRaf = requestAnimationFrame(autoScrollLoop);
			return () => {
				document.removeEventListener('pointermove', onMove);
				if (autoScrollRaf) { cancelAnimationFrame(autoScrollRaf); autoScrollRaf = null; }
			};
		}
	});

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
		home.selectMode = false; home.reorderMode = false;
		spaceMenu = false;
	}

	function handleCardClick(item: any) {
		if (home.selectMode) {
			haptic('light');
			if (home.selectedTitles.includes(item.title)) {
				home.selectedTitles = home.selectedTitles.filter((t: string) => t !== item.title);
				if (home.selectedTitles.length === 0) { home.selectMode = false; home.reorderMode = false; }
			} else {
				home.selectedTitles = [...home.selectedTitles, item.title];
			}
			return;
		}
		cardPage.title = item.title;
		cardPage.img = item.img;
		cardPage.images = item.images || (item.img ? [item.img] : []);
		cardPage.link = item.link;
		cardPage.text = item.text;
		cardPage.date = item.date;
		cardPage.url = item.url;
		cardPage.pinned = item.pinned;
		cardPage.pinnedInSpace = false;
		cardPage.space = '';
		saveCardPage();
	}

	function toggleSelectAll() {
		haptic('light');
		let allSelected = allVisibleItems.every((item: any) => home.selectedTitles.includes(item.title));
		if (allSelected) {
			home.selectedTitles = [];
		} else {
			home.selectedTitles = allVisibleItems.map((item: any) => item.title);
		}
	}
</script>

<div in:blur class="relative z-5 grid content-start space-y-3" onclick={(e) => {
	if (home.selectMode && !(e.target as HTMLElement).closest('.card-link')) {
		home.selectMode = false; home.reorderMode = false;
		home.selectedTitles = [];
	}
}}>
	{#if recentItems.length > 0 && !home.reorderMode}
		<div in:fade={{ duration: 200 }} class="flex items-center justify-between">
			<p class="h3 p-0 font-thin">Recent <span class="text-sm font-normal align-middle text-white/40">{localItems.current.length}</span></p>
			<a
				href="/tabs/home/saved"
				onclick={() => { spaceview.clr = 'purple'; }}
				class="text-sm font-medium text-primary-400 pr-1"
			>Show All</a>
		</div>
		{#if pinnedItems.length > 0}
			<div use:scrollableVignette={'horizontal'} class="flex gap-1 overflow-x-auto pb-2 snap-x ">
				{#each recentItems as item, i (item.title)}
					<div class="shrink-0 w-40 snap-start p-0.5" transition:fly={{ y: 20, delay: i * 30, duration: 200 }}>
						{@render Card(item.img, item.title, item.text, item.link, new Date().toLocaleDateString(), false, item)}
					</div>
				{/each}
			</div>
		{:else}
			<div use:scrollableVignette={'vertical'} class="max-h-[calc(88dvh-10rem)] overflow-y-auto transform-gpu grid grid-cols-2 gap-3 pb-10 p-1">
				{#each recentItems as item, i (item.title)}
					<div transition:fly={{ y: 20, delay: i * 30, duration: 200 }}>
						{@render Card(item.img, item.title, item.text, item.link, new Date().toLocaleDateString(), false, item)}
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	{#if pinnedItems.length > 0}
		<div in:fade={{ duration: 200 }} class="flex items-center justify-between">
			<p class="h3 p-0 font-thin">Pinned</p>
			<a
				href="/tabs/home/saved"
				onclick={() => { spaceview.clr = 'purple'; }}
				class="text-sm font-medium text-primary-400 pr-1"
			>Show All</a>
		</div>
		{#if home.reorderMode}
			<div in:fade={{ duration: 200 }} bind:this={reorderContainer}
				use:dndzone={{ items: dndItems, flipDurationMs: flipDurationMsGrid, type: 'pinned', dropTargetStyle: {}, morphDisabled: true }}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
				use:scrollableVignette={'vertical'}
				class="max-h-[calc(88dvh-12rem)] overflow-y-auto overscroll-y-contain grid grid-cols-2 gap-3 pr-1 p-1 touch-pan-y"
			>
				{#each dndItems as item, i (item.id)}
					<div class="cursor-grab active:cursor-grabbing touch-none rounded-xl bg-primary-900/50 border border-surface-200-800/50 px-3 py-2.5">
						<div class="flex items-center gap-2">
							<GripVertical class="size-4 shrink-0 text-white/50" />
							<span class="text-[10px] font-bold text-white/30 w-4 text-right">{i + 1}</span>
							<span class="truncate text-sm font-bold">{item.title}</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div in:fade={{ duration: 200 }} use:scrollableVignette={'vertical'} class="{recentItems.length === 0 ? 'xs:max-h-[calc(86dvh-6rem)] max-h-[calc(80dvh-6rem)]' : 'xs:max-h-[calc(60dvh-10rem)] max-h-[20vh]'} overflow-y-auto grid grid-cols-2 gap-3 pr-1 p-1">
				{#each pinnedItems as item, i (item.title)}
					<div transition:fly={{ y: 20, delay: i * 30, duration: 200 }}>
						{@render Card(item.img, item.title, item.text, item.link, new Date().toLocaleDateString(), false, item)}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

{#snippet Card(
	img?: string,
	h1?: string,
	p?: string,
	fL?: string,
	fR?: string,
	full?: boolean,
	item?: any
)}
	<div
		use:longpress={{
			onFirst: () => {
				home.selectMode = true;
				if (!home.selectedTitles.includes(item.title)) {
					home.selectedTitles = [...home.selectedTitles, item.title];
				}
			},
			onSecond: () => {
				home.selectMode = false; home.reorderMode = false;
				home.selectedTitles = [];
				sheetState.open = true;
				sheetState.data = item;
				sheetState.spacePicker = false;
			}
		}}
		class="card-link bg-primary-900/30 card border-surface-200-800 card-hover divide-surface-200-800 block divide-y border-[2px] shadow-lg {home.selectMode ? 'cursor-pointer' : ''} {home.selectMode && home.selectedTitles.includes(item.title) ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-transparent shadow-lg shadow-primary-500/20' : ''} transition-all duration-200 relative"
	>
		{#if home.selectMode && home.selectedTitles.includes(item.title)}
			<div class="pointer-events-none absolute inset-0 z-10 bg-primary-500/20"></div>
		{/if}
		{#if full}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="transition-all duration-200">
				{#if home.selectMode}
				<div
					class="absolute top-2 right-2 z-20"
					onclick={(e) => {
						e.stopPropagation();
						haptic('light');
						handleCardClick(item);
					}}
				>
						{#if home.selectedTitles.includes(item.title)}
							<CheckSquare class="size-6 text-primary-400 drop-shadow-md" />
						{:else}
							<Square class="size-6 text-white/60" />
						{/if}
					</div>
				{/if}
				<div
					class="card border-surface-200-800/0 card-hover absolute m-2 block h-fit w-full rounded-xl"
				>
					<DropDown data={item} />
				</div>
				{#if item.url !== '' && !home.selectMode}
					<!-- svelte-ignore node_invalid_placement_ssr -->
					<a
						href={item.url}
						target="_blank"
						class="absolute right-3 mt-2 rounded-full  text-white"
						onclick={(e) => e.stopPropagation()}
						><Link class=" size-7 p-1 mix-blend-difference backdrop-blur-sm rounded-lg" /></a
					>
				{/if}
				<a
					onclick={(e) => {
						if (home.selectMode) { e.preventDefault(); handleCardClick(item); return; }
						handleCardClick(item);
					}}
					href={home.selectMode ? '' : '/card'}
				>
					<header>
						<Image
							src={img}
							onerror={imgError}
							class="aspect-video w-full rounded-t-xl object-cover"
							alt={NoImageUrl}
						/>
					</header>
					<article class="px-3 py-1">
						<div>
							<p class="p">{h1}</p>
						</div>
						<small class="line-clamp-2 wrap-break-word opacity-60">{p}</small>
					</article>
					<hr class="hr" />
					<footer
						class="gap- text-primary-100 flex items-center justify-between px-2 pb-2 font-mono"
					>
						<small class="text-justify opacity-60">{fL}</small>
						<small class="opacity-60">On {fR}</small>
					</footer>
				</a>
			</div>
		{:else}
			<div
				class="card border-surface-200-800/0 card-hover relative block h-fit w-full rounded-xl border-[0.5px] transition-all duration-200"
			>
				<div class="absolute m-0.5">
					<DropDown data={item} />
				</div>
				{#if home.selectMode}
				<div
					class="absolute top-1 right-1 z-20"
					onclick={(e) => {
						e.stopPropagation();
						haptic('light');
						handleCardClick(item);
					}}
				>
						{#if home.selectedTitles.includes(item.title)}
							<CheckSquare class="size-5 text-primary-400 drop-shadow-md" />
						{:else}
							<Square class="size-5 text-white/60" />
						{/if}
					</div>
				{/if}
				{#if item.url !== '' && !home.selectMode}
					<!-- svelte-ignore node_invalid_placement_ssr -->
					<a
						href={item.url}
						target="_blank"
						class="absolute right-1 mt-1 "
						onclick={(e) => e.stopPropagation()}
						><Link class="text-surface-400 size-6 p-1 mix-blend-difference backdrop-blur-lg rounded-lg"  /></a
					>
				{/if}
				<a
					onclick={(e) => {
						if (home.selectMode) { e.preventDefault(); handleCardClick(item); return; }
						handleCardClick(item);
					}}
					href={home.selectMode ? '' : '/card'}
				>
					{#if img}
						<Image
							src={img}
							class="aspect-video w-full rounded-t-lg object-cover"
							onerror={imgError}
							alt="card-preview"
						/>
					{/if}

					<article class="h-full items-stretch justify-between pl-1 shadow-none">
						<span class="text-surface-50 flex flex-col justify-center -space-y-1">
							<p class="text-md truncate pb-1 font-mono font-bold">
								{h1}
							</p>
							<small class="truncate font-mono text-xs">{fL || h1}</small>
						</span>
					</article>
				</a>
			</div>
		{/if}
	</div>
{/snippet}



{#if home.selectMode}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
		{#if home.selectedTitles.length === 0}
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-all duration-400 {home.reorderMode ? 'text-surface-300 bg-error-950/90 px-[15vw] border-0' : 'text-surface-500 hover:bg-black/90 hover:text-white'}"
				onclick={() => { haptic('light'); home.reorderMode = !home.reorderMode; }}
			>
				<GripVertical class="size-5 rotate-90 {home.reorderMode ? 'hidden' : ''}" />
				<span class="px-1.5 pt-0.5 text-xs {home.reorderMode ? 'text-error-200' : 'text-surface-400'}">{!home.reorderMode ? "Reorder" : "Cancel"}</span>

			</button>
		{/if}
	</div>

	{#if home.selectedTitles.length > 0}
		<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-row items-center gap-2">
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-colors duration-200 hover:bg-black/90"
				onclick={toggleSelectAll}
			>
				{#if allVisibleItems.every((item: any) => home.selectedTitles.includes(item.title))}
					<CheckSquare class="size-5 text-primary-400" />
				{:else}
					<Square class="size-5 text-primary-400" />
				{/if}
				<span class="px-1.5 pt-0.5 text-xs text-primary-300">{home.selectedTitles.length}</span>
			</button>
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-colors duration-200 hover:bg-black/90"
				onclick={() => { spaceMenu = true; }}
			>
				<CircleDotDashed class="size-5 text-yellow-300/80" />
			</button>
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-colors duration-200 hover:bg-black/90"
				onclick={() => { haptic('light'); togglePinSelectedItems('home'); }}
			>
				<Pin class="size-5 text-primary-400/80" />
			</button>
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-colors duration-200 {home.reorderMode ? 'text-primary-400 bg-primary-500/20' : 'text-white/50 hover:bg-black/90 hover:text-white'}"
				onclick={() => { haptic('light'); home.reorderMode = !home.reorderMode; }}
			>
				<GripVertical class="size-5 rotate-90" />
			</button>
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-red-500/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-colors duration-200 hover:bg-red-400"
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
						home.selectMode = false; home.reorderMode = false;
					};
				}}
			>
				<Trash2 class="size-5 text-white" />
			</button>
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center gap-1.5 rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 text-xs font-bold text-white/60 transition-colors duration-200 hover:bg-black/90 hover:text-white"
				onclick={() => {
					haptic('light');
					home.selectedTitles = [];
					home.selectMode = false; home.reorderMode = false;
				}}
			>
				<p class="pt-1">Cancel</p>
			</button>
		</div>
	{/if}
{/if}

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
				onclick={() => { haptic('light'); spaceMenu = false; }}
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

<div
	in:fly={{ delay: 0, x: -100 }}
	class="fixed inset-0 z-0 flex flex-col items-center justify-center gap-2 text-gray-300/30"
>
	{#if localItems.current.length < 1}
		<CircleMinus class="size-28" />
		<p class="h3">All Empty!</p>
		<p class="text-sm font-bold">No Items yet</p>
	{/if}
</div>
<div
	in:blur={{ delay: 100 }}
	class="fixed inset-0 bottom-28 z-0 flex flex-col items-center justify-end text-gray-300 opacity-40"
>
	{#if localItems.current.length < 1}
		<p class="animate-bounce">Add an Item</p>
		<ArrowDown class="size-10 animate-bounce" />
	{/if}
</div>
