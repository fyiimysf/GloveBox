<script lang="ts">
	import { cardPage, localItems, localSpaces, spaceview, confirmState, truncate, setUndo, setUndoRemove } from '$lib/shared.svelte';
	import { CircleDashed, CircleDot, CircleOff, CircleX, Trash2, CircleDotDashed, Delete, Link, MoreVertical, Trash, X } from 'lucide-svelte';
	import { fade, slide, blur, fly } from 'svelte/transition';
	import toast from 'svelte-french-toast';
	import { page } from '$app/state';

	let dropMenu = $state(false);
	let spaceMenu = $state(false);

	let { data, id = 0 }: { data?: any; id?: number } = $props();

	
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	id="dropdownMenuIconButton"
	class="rounded-full p-1.5 bg-black/40 text-white shadow-lg active:scale-95 transition-transform duration-150"
	type="button"
	onclick={(e) => {
		e.stopPropagation();
		dropMenu = !dropMenu;
	}}
>
	{#if dropMenu || spaceMenu}
		<X class="size-5" />
	{:else}
		<MoreVertical class="size-5 text-white" />
	{/if}
</button>

<!-- Dropdown menu -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if dropMenu || spaceMenu}
	<div
		onclick={(e) => {
			e.stopPropagation();
			dropMenu = false;
			spaceMenu = false;
		}}
		class="fixed inset-0 z-10 bg-black/50 backdrop-blur-[1px]"
	></div>
{/if}
{#if dropMenu}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:slide={{ duration: 150 }}
		id="dropdownDots"
		onclick={(e) => {
			e.stopPropagation();
		}}
		class="bg-primary-950/70 absolute z-100 w-44 rounded-xl px-1 py-1.5 text-sm font-bold text-white shadow-xl backdrop-blur-xl border border-white/10"
	>
		{#if data.url !== ''}
			<a target="_blank" href={data.url} class="block rounded-lg px-3 py-3 text-yellow-300 hover:bg-white/5 active:scale-[0.98] transition-all duration-150">
				<span class="flex items-center justify-between gap-3">
					<span>Open Link</span>
					<Link class="size-4 shrink-0" />
				</span>
			</a>
			<hr class="mx-2 border-white/5" />
		{/if}

		{#if localSpaces.current.length > 0}
			{#each localSpaces.current as spaceObj}
				{#each spaceObj.items as obj}
					{#if obj.title === data.title}
						<div
							onclick={(e) => {
								e.stopPropagation();
								dropMenu = false;
								confirmState.open = true;
								confirmState.title = 'Remove from ' + spaceObj.name + '?';
								confirmState.message = data.title;
								confirmState.confirmText = 'Remove';
								confirmState.onConfirm = () => {
									const deletedItem = data;
									spaceObj.items.forEach((item: any) => {
										if (item.title === data.title) {
											let tempArr2 = spaceObj.items.filter(
												(item: any) => item.title !== data.title
											);
											spaceObj.items = tempArr2;
										}
									});
									spaceview.viewItems.forEach((item: any) => {
										if (item.title === data.title) {
											let tempArr3 = spaceview.viewItems.filter(
												(item: any) => item.title !== data.title
											);
											spaceview.viewItems = tempArr3;
										}
									});
									const msg = truncate(data.title) + ' removed';
									setUndoRemove(msg, [deletedItem], spaceObj.name);
									toast.success(msg, { duration: 2000 });
								};
							}}
							class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 text-{spaceObj.clr}-400 hover:bg-white/5 active:scale-[0.98] transition-all duration-150"
						>
							<span class="truncate">Remove from <span class="font-bold">{spaceObj.name}</span></span>
							<CircleOff class="size-4 shrink-0" />
						</div>
						<hr class="mx-2 border-white/5" />
					{/if}
				{/each}
			{/each}
			{#if page.route.id !== '/tabs/space/spaceview' && page.route.id !== '/tabs/space'}
				<div
					onclick={(e) => {
						e.stopPropagation();
						spaceMenu = !spaceMenu;
						localSpaces.current.forEach((spc: any) => {
							spc.items.forEach((item: any) => {
								if (item.title === data.title) {
									let tempArr2 = spc.items.filter((item: any) => item.title !== data.title);
									spc.items = tempArr2;
								}
							});
						});
					}}
					class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-white/5 active:scale-[0.98] transition-all duration-150"
				>
					<span>Add To Space</span>
					<CircleDotDashed class="size-4 shrink-0" />
				</div>
				<hr class="mx-2 border-white/5" />
			{/if}
		{/if}
		{#if page.route.id !== '/tabs/space/spaceview' && page.route.id !== '/tabs/space'}
			<div
				onclick={(e) => {
					e.stopPropagation();
					dropMenu = false;
					confirmState.open = true;
					confirmState.title = 'Delete Item?';
					confirmState.message = data.title;
					confirmState.confirmText = 'Delete';
					confirmState.onConfirm = () => {
						const deletedItem = localItems.current.find((i: any) => i.title === data.title);
						const spaceMappings: Array<{ spaceName: string; items: any[] }> = [];
						for (const spc of localSpaces.current) {
							if (spc.items.some((i: any) => i.title === data.title)) {
								spaceMappings.push({ spaceName: spc.name, items: [deletedItem] });
							}
						}
						let tempArr = localItems.current.filter((item: any) => item.title !== data.title);
						localItems.current = tempArr;
						localSpaces.current.forEach((spc: any) => {
							spc.items.forEach((item: any) => {
								if (item.title === data.title) {
									let tempArr2 = spc.items.filter((item: any) => item.title !== data.title);
									spc.items = tempArr2;
								}
							});
						});
						const msg = truncate(data.title) + ' Deleted';
						setUndo(msg, [deletedItem], spaceMappings);
						toast(msg, {
							icon: '🗑️',
							duration: 2000
						});
					};
				}}
				class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 text-red-400 hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150"
			>
				<span>Delete</span>
				<Trash class="size-4 shrink-0" />
			</div>
		{/if}
	</div>
{/if}

{#if spaceMenu}
	{@render AddtoSpace()}
{/if}

{#snippet AddtoSpace()}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="rounded-lg">
		<div
			transition:slide={{ duration: 150 }}
			id="dropdownDots"
			class="bg-primary-950/70 absolute z-100 w-44 max-h-48 overflow-y-auto rounded-xl font-bold shadow-xl backdrop-blur-xl border border-white/10"
		>
			<div
				onclick={(e) => {
					e.stopPropagation();
					spaceMenu = false;
				}}
				class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-white/60 hover:bg-white/5 active:scale-[0.98] transition-all duration-150 border-b border-white/5"
			>
				<span class="text-sm">← Back</span>
			</div>
			{#each [...localSpaces.current].reverse() as item, index}
				<div
					onclick={(e) => {
						e.stopPropagation();
						item.items.push(data);
						toast.success('Added to ' + item.name, { duration: 1500 });
						spaceMenu = !spaceMenu;
					}}
					class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-white/5 active:scale-[0.98] transition-all duration-150"
				>
					<span class="flex items-center gap-2 truncate">
						<span class="h-2.5 w-2.5 shrink-0 rounded-full bg-{item.clr}-400"></span>
						<span class="truncate">{item.name}</span>
					</span>
					<CircleDotDashed class="size-4 shrink-0 text-white/50" />
				</div>
			{/each}
		</div>
	</div>
{/snippet}
