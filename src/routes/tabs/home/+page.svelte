<script lang="ts">
	import { blur, draw, fade, fly, scale, slide } from 'svelte/transition';
	import type { PageProps } from '../../$types';
	import { bounceIn, cubicIn, elasticInOut, linear, sineOut } from 'svelte/easing';
	import { cardPage, home, localItems, localSpaces, spaceview, confirmState, truncate, setUndo, saveCardPage } from '../../../lib/shared.svelte';
	import {
		ArrowDown,
		ChevronRight,
		CircleMinus,
		Trash2,
		Square,
		CheckSquare
	} from 'lucide-svelte';
	import { Link } from '@lucide/svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import DropDown from '$lib/components/DropDownButton.svelte';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { Image } from '@unpic/svelte';

	let { data } = $props();

	const imgError = (e: any) => (e.target.src = NoImageUrl);

	let visibleItems = $derived([...localItems.current].reverse().slice(0, 8));

	function handleCardClick(item: any) {
		if (home.selectMode) {
			if (home.selectedTitles.includes(item.title)) {
				home.selectedTitles = home.selectedTitles.filter((t: string) => t !== item.title);
			} else {
				home.selectedTitles = [...home.selectedTitles, item.title];
			}
			return;
		}
		cardPage.title = item.title;
		cardPage.img = item.img;
		cardPage.link = item.link;
		cardPage.text = item.text;
		cardPage.date = item.date;
		cardPage.url = item.url;
		saveCardPage();
	}

	function toggleSelectAll() {
		let allSelected = visibleItems.every((item: any) => home.selectedTitles.includes(item.title));
		if (allSelected) {
			home.selectedTitles = [];
		} else {
			home.selectedTitles = visibleItems.map((item: any) => item.title);
		}
	}
</script>

<!-- Saved Section -->

<div in:blur class="relative z-5 grid space-y-3">
	{#if localItems.current.length > 0}
		<a
			href="/tabs/home/saved"
			onclick={() => {
				spaceview.clr = 'purple';
			}}
		>
			<div class="flex items-stretch justify-between">
				<p class="h3 p-1 font-thin">Saved</p>
				<div class="p-3">
					<ChevronRight />
				</div>
			</div>
		</a>

		{#if home.homeLayout}
			<div in:fly={{ y: 70 }} class="grid grid-cols-1 gap-3">
				{@render ListLocal()}
			</div>
		{:else}
			<div in:fly={{ y: -20 }} class="grid grid-cols-2 gap-3">
				{@render ListLocal()}
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
						class="absolute right-3 mt-2 rounded-full bg-black/30 text-white mix-blend-difference"
						onclick={(e) => e.stopPropagation()}
						><Link class="text-primary-200 size-7 p-1" /></a
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
						<small class="line-clamp-2 break-words opacity-60">{p}</small>
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
				<div class="absolute m-1">
					<DropDown data={item} />
				</div>
				{#if home.selectMode}
					<div
						class="absolute top-1 right-1 z-20"
						onclick={(e) => {
							e.stopPropagation();
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
						class="absolute right-1 mt-1 rounded-full mix-blend-difference"
						onclick={(e) => e.stopPropagation()}
						><Link class="text-primary-200 size-6 p-1" /></a
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
							<small class="truncate font-mono text-xs">{fL}</small>
						</span>
					</article>
				</a>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet ListLocal()}
	{#each visibleItems as item}
		{@render Card(
			item.img,
			item.title,
			item.text,
			item.link,
			new Date().toLocaleDateString(),
			home.homeLayout,
			item
		)}
	{/each}
{/snippet}

{#if home.selectMode}
	<div
		in:fly={{ y: 40, duration: 200 }}
		class="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-xl border border-white/10"
	>
		<button
			class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-primary-400 transition-colors duration-200 hover:bg-primary-500/10"
			onclick={toggleSelectAll}
		>
			{#if visibleItems.every((item: any) => home.selectedTitles.includes(item.title))}
				<CheckSquare class="size-4" />
				Deselect All
			{:else}
				<Square class="size-4" />
				Select All
			{/if}
		</button>
		<span class="h-6 w-px bg-white/10"></span>
		<span class="px-2 text-sm font-bold text-white/80">{home.selectedTitles.length} selected</span>
		{#if home.selectedTitles.length > 0}
			<button
				class="flex items-center gap-1.5 rounded-xl bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-red-400"
				onclick={() => {
					confirmState.open = true;
					confirmState.title = 'Delete ' + home.selectedTitles.length + ' items?';
					confirmState.message = 'This will remove them from all spaces too';
					confirmState.confirmText = 'Delete All';
					confirmState.onConfirm = () => {
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
						home.selectedTitles = [];
						home.selectMode = false;
						const msg = titles.length + ' items Deleted';
						setUndo(msg, deletedItems, spaceMappings);
						toast.success(msg, {
							style: 'border-radius: 200px; background: #333; color: #fff;',
							duration: 2000
						});
					};
				}}
			>
				<Trash2 class="size-4" />
				Delete
			</button>
			<button
				class="rounded-xl px-3 py-1.5 text-xs font-bold text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
				onclick={() => {
					home.selectedTitles = [];
					home.selectMode = false;
				}}
			>
				Cancel
			</button>
		{/if}
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
	class="fixed inset-0 bottom-25 z-0 flex flex-col items-center justify-end text-gray-300 opacity-40"
>
	{#if localItems.current.length < 1}
		<p class="animate-bounce">Add an Item</p>
		<ArrowDown class="size-10 animate-bounce" />
	{/if}
</div>
