<script lang="ts">
	import { fly, scale, blur, slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import Cards from '$lib/components/Cards.svelte';
	import { home, localItems, localSpaces, confirmState, truncate, setUndo } from '$lib/shared.svelte';
	import { ArrowLeft, CircleMinus, Trash2, CheckSquare, Square } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	let { data }: { data: PageData } = $props();

	let reversedItems = $derived([...localItems.current].reverse());

	function toggleSelectAll() {
		let allSelected = reversedItems.every((item: any) => home.selectedTitles.includes(item.title));
		if (allSelected) {
			home.selectedTitles = [];
		} else {
			home.selectedTitles = reversedItems.map((item: any) => item.title);
		}
	}
</script>

<div class="relative z-1 mb-20 grid space-y-6">
	<div in:scale|global>
		<div class="grid {home.savedLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
			{#each reversedItems as _}
				<Cards
					img={_.img}
					h1={_.title}
					p={_.text}
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
		class="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-xl border border-white/10"
	>
		<button
			class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-primary-400 transition-colors duration-200 hover:bg-primary-500/10"
			onclick={toggleSelectAll}
		>
			{#if reversedItems.every((item: any) => home.selectedTitles.includes(item.title))}
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
{:else}
	<!-- Back Button -->
	<button
		in:slide
		onclick={() => {
			history.back();
		}}
		class="btn bg-primary-950/70 fixed bottom-6 left-1/2 z-9 w-80 -translate-x-1/2 rounded-2xl backdrop-blur"
	>
		<ArrowLeft />
		Go Back
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
