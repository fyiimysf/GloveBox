<script lang="ts">
	import { fly, scale, slide, blur, fade } from 'svelte/transition';
	import Cards from '$lib/components/Cards.svelte';
	import { home, localSpaces, spaceview, confirmState, truncate, setUndoRemove, togglePinSelectedItems, scrollableVignette, haptic } from '$lib/shared.svelte';
	import { ArrowLeft, CircleDotDashed, CircleSlash, GripVertical, Pin, Trash2, CheckSquare, Square, X } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';

	try {
		if (typeof sessionStorage !== 'undefined' && spaceview.viewItems.length < 1) {
			const savedName = sessionStorage.getItem('spaceviewName');
			if (savedName) {
				const space = localSpaces.current.find((s: any) => s.name === savedName);
				if (space) {
					spaceview.pageTitle = space.name;
					spaceview.clr = space.clr;
					spaceview.viewItems = space.items;
				}
			}
		}
	} catch {}

	let spaceMenu = $state(false);

	let reversedItems = $derived([...spaceview.viewItems].reverse());

	const flipDurationMsGrid = 150;
	let dndItems: any[] = $state([]);

	function handleDndConsider(e: CustomEvent<DndEvent<any>>) {
		dndItems = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<any>>) {
		dndItems = e.detail.items;
		const reversed = [...dndItems].reverse();
		spaceview.viewItems = reversed;
		const space = localSpaces.current.find((s: any) => s.name === spaceview.pageTitle);
		if (space) {
			space.items = reversed;
			localSpaces.current = [...localSpaces.current];
		}
		haptic('medium');
	}

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
		if (spaceview.reorderMode) {
			dndItems = reversedItems.map((item: any) => ({ ...item, id: item.title }));
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
				const item = spaceview.viewItems.find((i: any) => i.title === title);
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
		spaceview.reorderMode = false;
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

<div in:blur|global class="transform-gpu relative z-1 pb-16" onclick={(e) => {
	if (home.selectMode && !(e.target as HTMLElement).closest('.card')) {
		home.selectMode = false;
		spaceview.reorderMode = false;
		home.selectedTitles = [];
	}
}}>
	{#if spaceview.reorderMode}
		<div in:fade={{ duration: 200 }} bind:this={reorderContainer}
			use:dndzone={{ items: dndItems, flipDurationMs: flipDurationMsGrid, type: 'spaceview', dropTargetStyle: {}, morphDisabled: true }}
			onconsider={handleDndConsider}
			onfinalize={handleDndFinalize}
			use:scrollableVignette={'vertical'}
			class="max-h-[calc(88dvh-8rem)] overflow-y-auto overscroll-y-contain grid grid-cols-2 gap-3 pr-1 p-1 touch-pan-y"
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
		<div in:fly|global class="transform-gpu grid {home.spaceviewLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
			{#each reversedItems as itemCard (itemCard.title)}
				<Cards
					h1={itemCard.title}
					p={itemCard.text}
					img={itemCard.img}
					fL={itemCard.link}
					fR={itemCard.date}
					full={!home.spaceviewLayout}
					item={itemCard}
					selectMode={home.selectMode}
					selected={home.selectedTitles.includes(itemCard.title)}
					pinned={itemCard.pinnedInSpace}
					spaceName={spaceview.pageTitle}
					onselect={(checked) => {
						if (checked) {
							home.selectedTitles = [...home.selectedTitles, itemCard.title];
						} else {
							home.selectedTitles = home.selectedTitles.filter((t: string) => t !== itemCard.title);
							if (home.selectedTitles.length === 0) { home.selectMode = false; spaceview.reorderMode = false; }
						}
					}}
				/>
			{/each}
		</div>
	{/if}
</div>

{#if spaceview.viewItems.length < 1}
	<div
		class="fixed inset-0 -z-10 flex flex-col items-center justify-center text-{spaceview.clr}-400 opacity-30"
	>
		<CircleSlash class="size-28" />
		<p class="h3">Empty Space</p>
		<p class="text-sm font-bold">No Spaces yet</p>
	</div>
{/if}

{#if home.selectMode}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
		{#if home.selectedTitles.length === 0}
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-all duration-400 {spaceview.reorderMode ? 'text-surface-300 bg-error-950/90 px-[15vw] border-0' : 'text-surface-500 hover:bg-black/90 hover:text-white'}"
				onclick={() => { haptic('light'); spaceview.reorderMode = !spaceview.reorderMode; }}
			>
				<GripVertical class="size-5 rotate-90 {spaceview.reorderMode ? 'hidden' : ''}" />
				<span class="px-1.5 pt-0.5 text-xs {spaceview.reorderMode ? 'text-error-200' : 'text-surface-400'}">{!spaceview.reorderMode ? "Reorder" : "Cancel"}</span>
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
				{#if reversedItems.every((item: any) => home.selectedTitles.includes(item.title))}
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
				onclick={() => { haptic('light'); togglePinSelectedItems('space'); }}
			>
				<Pin class="size-5 text-primary-400/80" />
			</button>
			<button
				in:fly={{ y: 40, duration: 200 }}
				class="flex items-center justify-center rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10 transition-colors duration-200 {spaceview.reorderMode ? 'text-primary-400 bg-primary-500/20' : 'text-white/50 hover:bg-black/90 hover:text-white'}"
				onclick={() => { haptic('light'); spaceview.reorderMode = !spaceview.reorderMode; }}
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
					confirmState.message = 'Remove from this space';
					confirmState.confirmText = 'Delete';
					confirmState.onConfirm = () => {
						try {
							let titles = home.selectedTitles;
							const deletedItems = [...spaceview.viewItems].filter((i: any) => titles.includes(i.title));
							localSpaces.current.forEach((spc: any) => {
								if (spc.name === spaceview.pageTitle) {
									spc.items = spc.items.filter(
										(item: any) => !titles.includes(item.title)
									);
								}
							});
							spaceview.viewItems = spaceview.viewItems.filter(
								(item: any) => !titles.includes(item.title)
							);
							const msg = titles.length + ' items removed';
							setUndoRemove(msg, deletedItems, spaceview.pageTitle);
							toast.success(msg, { duration: 2000 });
						} catch (err) {
							console.error('Failed to remove items:', err);
							toast.error('Failed to remove items', { duration: 2000 });
						}
						home.selectedTitles = [];
						home.selectMode = false;
						spaceview.reorderMode = false;
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
					home.selectMode = false;
					spaceview.reorderMode = false;
				}}
			>
				<p class="pt-1">Cancel</p>
			</button>
		</div>
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
					onclick={() => { spaceMenu = false; }}
					class="rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X class="size-4" />
				</button>
			</div>
			<div class="flex max-h-60 flex-col gap-1 overflow-y-auto">
				{#each [...localSpaces.current].reverse().filter(s => s.name !== spaceview.pageTitle) as spc}
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
