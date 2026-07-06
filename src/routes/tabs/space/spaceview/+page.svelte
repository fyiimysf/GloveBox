<script lang="ts">
	import { fly, scale, slide, blur } from 'svelte/transition';
	import Cards from '$lib/components/Cards.svelte';
	import { home, localSpaces, spaceview, confirmState, truncate, setUndoRemove } from '$lib/shared.svelte';
	import { ArrowLeft, CircleSlash, Trash2, CheckSquare, Square } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

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

	let reversedItems = $derived([...spaceview.viewItems].reverse());

	function toggleSelectAll() {
		let allSelected = reversedItems.every((item: any) => home.selectedTitles.includes(item.title));
		if (allSelected) {
			home.selectedTitles = [];
		} else {
			home.selectedTitles = reversedItems.map((item: any) => item.title);
		}
	}
</script>

<div in:blur|global class="relative z-1">
	<div in:fly|global class="grid {!home.spaceviewLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
		{#each reversedItems as itemCard}
			<Cards
				h1={itemCard.title}
				p={itemCard.text}
				img={itemCard.img}
				fL={itemCard.link}
				fR={itemCard.date}
				full={home.spaceviewLayout}
				item={itemCard}
				selectMode={home.selectMode}
				selected={home.selectedTitles.includes(itemCard.title)}
				onselect={(checked) => {
					if (checked) {
						home.selectedTitles = [...home.selectedTitles, itemCard.title];
					} else {
						home.selectedTitles = home.selectedTitles.filter((t: string) => t !== itemCard.title);
					}
				}}
			/>
		{/each}
	</div>
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
					confirmState.message = 'Remove from this space';
					confirmState.confirmText = 'Delete';
					confirmState.onConfirm = () => {
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
						home.selectedTitles = [];
						home.selectMode = false;
						const msg = titles.length + ' items removed';
						setUndoRemove(msg, deletedItems, spaceview.pageTitle);
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
