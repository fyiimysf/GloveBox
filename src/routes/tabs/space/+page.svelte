<script lang="ts">
	import Cards from '$lib/components/Cards.svelte';
	import { cardPage, home, localSpaces, space, spaceview, confirmState, saveSpaceviewName, spaceSelect, setUndoDeleteSpace, scrollableVignette, longpress } from '$lib/shared.svelte';
	import {
		ArrowDown,
		CircleMinus,
		CircleSlash,
		Trash,
		X,
		CircleX,
		ChevronDown,
		ChevronUp,
		Square,
		CheckSquare,
		Trash2
	} from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { fly, blur, fade, slide } from 'svelte/transition';

	let expandedSpaces = $state<string[]>([]);

	$effect(() => {
		if (spaceSelect.expandAll) {
			expandedSpaces = localSpaces.current.map((s: any) => s.name);
		} else {
			expandedSpaces = [];
		}
	});

	$effect(() => {
		const total = localSpaces.current.length;
		const expanded = expandedSpaces.length;
		if (total > 0 && expanded === total) {
			spaceSelect.expandAll = true;
		} else if (expanded === 0) {
			spaceSelect.expandAll = false;
		}
	});

	function toggleExpand(name: string) {
		if (expandedSpaces.includes(name)) {
			expandedSpaces = expandedSpaces.filter(n => n !== name);
		} else {
			expandedSpaces = [...expandedSpaces, name];
		}
	}

	function isExpanded(name: string) {
		return expandedSpaces.includes(name);
	}

	function toggleSelectAll() {
		let allSelected = [...localSpaces.current].every((spc: any) => spaceSelect.selectedNames.includes(spc.name));
		if (allSelected) {
			spaceSelect.selectedNames = [];
		} else {
			spaceSelect.selectedNames = localSpaces.current.map((spc: any) => spc.name);
		}
	}

	function handleSpaceClick(name: string) {
		if (spaceSelect.selectMode) {
			if (spaceSelect.selectedNames.includes(name)) {
				spaceSelect.selectedNames = spaceSelect.selectedNames.filter(n => n !== name);
			} else {
				spaceSelect.selectedNames = [...spaceSelect.selectedNames, name];
			}
			return;
		}
	}

	function emptyToast() {
		toast(spaceview.pageTitle + ' is Empty', { duration: 1200 });
	}
</script>

<div class="z-10 space-y-4 pb-26" in:blur>
	{#each [...localSpaces.current].reverse() as spaceItem (spaceItem.name)}
		<div
			use:longpress={() => {
				spaceSelect.selectMode = true;
				if (!spaceSelect.selectedNames.includes(spaceItem.name)) {
					spaceSelect.selectedNames = [...spaceSelect.selectedNames, spaceItem.name];
				}
			}}
			transition:fly={{ delay: 0, x: 100 }}
			class="transform-gpu relative
			{spaceItem.clr === 'purple'
				? 'bg-purple-400/10 text-purple-400 outline-purple-400'
				: spaceItem.clr === 'red'
					? 'bg-red-400/10 text-red-400 outline-red-400'
					: spaceItem.clr === 'green'
						? 'bg-green-400/10 text-green-400 outline-green-400'
						: spaceItem.clr === 'blue'
							? 'bg-blue-400/10 text-blue-400 outline-blue-400'
							: spaceItem.clr === 'yellow'
								? 'bg-yellow-400/10 text-yellow-400 outline-yellow-400'
								: spaceItem.clr === 'orange'
									? 'bg-orange-400/10 text-orange-400 outline-orange-400'
									: spaceItem.clr === 'pink'
										? 'bg-pink-400/10 text-pink-400 outline-pink-400'
										: 'bg-surface-900/20 text-white outline-white'}

		 z-10 rounded-2xl shadow-lg shadow-black/20 backdrop-blur overflow-hidden {spaceSelect.selectMode && spaceSelect.selectedNames.includes(spaceItem.name) ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-transparent shadow-lg shadow-primary-500/20' : ''} transition-all duration-200"
		>
			{#if spaceSelect.selectMode && spaceSelect.selectedNames.includes(spaceItem.name)}
				<div class="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-primary-500/20"></div>
			{/if}
			<div class="flex items-stretch justify-between pb-3">
				<a
					href={spaceSelect.selectMode ? '' : (spaceItem.items.length > 0 ? '/tabs/space/spaceview' : '')}
					onclick={(e) => {
						if (spaceSelect.selectMode) {
							handleSpaceClick(spaceItem.name);
							return;
						}
						spaceview.pageTitle = spaceItem.name;
						spaceview.clr = spaceItem.clr;
						spaceview.viewItems = spaceItem.items;
						saveSpaceviewName(spaceItem.name);
						if (spaceItem.items.length < 1) {
							emptyToast();
						}
					}}
					class="min-w-0 flex-1"
				>
					<span>
						<p class="w-50 truncate pt-2 pl-3 text-2xl font-medium opacity-100">
							{spaceItem.name}
						</p>
						<p class="w-60 truncate pl-3 text-sm opacity-100">{spaceItem.desc}</p>
					</span>
				</a>
				<div class="flex items-center gap-2 pr-3 pt-2.5">
					{#if spaceSelect.selectMode}
						<div
							onclick={(e) => { e.stopPropagation(); handleSpaceClick(spaceItem.name); }}
							class="cursor-pointer"
						>
							{#if spaceSelect.selectedNames.includes(spaceItem.name)}
								<CheckSquare class="size-6 text-primary-400 drop-shadow-md" />
							{:else}
								<Square class="size-6 text-white/60" />
							{/if}
						</div>
					{:else}
						{#if spaceItem.items.length > 0}
							<p class="text-lg font-bold">{spaceItem.items.length}</p>
						{:else}
							<CircleSlash class="size-6 text-white/40" />
						{/if}
					{/if}
				</div>
			</div>
			{#if isExpanded(spaceItem.name)}
				<div transition:slide class="p-2 relative max-h-80 overflow-y-scroll max-w-[93svw]">
					{#if spaceItem.items.length < 1}
						<div
							class="
						{spaceItem.clr === 'purple'
								? 'bg-purple-400/30 '
								: spaceItem.clr === 'red'
									? 'bg-red-400/30 '
									: spaceItem.clr === 'green'
										? 'bg-green-400/30 '
										: spaceItem.clr === 'blue'
											? 'bg-blue-400/30 '
											: spaceItem.clr === 'yellow'
												? 'bg-yellow-400/30 '
												: spaceItem.clr === 'orange'
													? 'bg-orange-400/30 '
													: spaceItem.clr === 'pink'
														? 'bg-pink-400/30 '
														: 'bg-surface-900/20 '}

                     flex flex-col items-center justify-stretch rounded-xl p-4 opacity-30"
						>
							<CircleSlash class="size-10" />
							<h5 class="h5 pt-2">No Items</h5>
						</div>
					{:else if [...spaceItem.items].filter((i: any) => i.pinnedInSpace).length > 0}
						<div
							class="
							
						{spaceItem.clr === 'purple'
								? 'bg-purple-400/30 text-purple-200'
								: spaceItem.clr === 'red'
									? 'bg-red-400/30 text-red-200'
									: spaceItem.clr === 'green'
										? 'bg-green-400/30 text-green-200'
										: spaceItem.clr === 'blue'
											? 'bg-blue-400/30 text-blue-200'
											: spaceItem.clr === 'yellow'
												? 'bg-yellow-400/30 text-yellow-200'
												: spaceItem.clr === 'orange'
													? 'bg-orange-400/30 text-orange-200'
													: spaceItem.clr === 'pink'
														? 'bg-pink-400/30 text-pink-200'
														: 'bg-surface-900/20 text-white'}

						flex gap-2 overflow-x-auto rounded-2xl p-1.5"
						use:scrollableVignette={'horizontal'}
						>
							{#each [...spaceItem.items].reverse().filter((i: any) => i.pinnedInSpace) as itemCard (itemCard.title)}
									<button
										class="shrink-0 w-45"
										onclick={() => {
											cardPage.title = itemCard.title;
											cardPage.img = itemCard.img;
											cardPage.link = itemCard.link;
											cardPage.text = itemCard.text;
											cardPage.date = itemCard.date;
											cardPage.url = itemCard.url;
											cardPage.space = spaceItem.name;
											cardPage.pinnedInSpace = itemCard.pinnedInSpace ?? false;
											cardPage.pinned = itemCard.pinned ?? false;
										}}
									>
										<Cards
											h1={itemCard.title}
											img={itemCard.img}
											p={itemCard.text}
											item={itemCard}
											full={false}
											spaceName={spaceItem.name}
										/>
									</button>
							{/each}
						</div>
					{:else}
						<div use:scrollableVignette={'horizontal'} class="flex gap-2 overflow-x-auto rounded-2xl p-1.5">
							{#each [...spaceItem.items].reverse().slice(0, 2) as itemCard (itemCard.title)}
								<button
									class="shrink-0 w-45"
									onclick={() => {
										cardPage.title = itemCard.title;
										cardPage.img = itemCard.img;
										cardPage.link = itemCard.link;
										cardPage.text = itemCard.text;
										cardPage.date = itemCard.date;
										cardPage.url = itemCard.url;
										cardPage.space = spaceItem.name;
										cardPage.pinnedInSpace = itemCard.pinnedInSpace ?? false;
										cardPage.pinned = itemCard.pinned ?? false;
									}}
								>
									<Cards
										h1={itemCard.title}
										img={itemCard.img}
										p={itemCard.text}
										item={itemCard}
										full={false}
										spaceName={spaceItem.name}
									/>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
			<button
				onclick={(e) => { e.stopPropagation(); toggleExpand(spaceItem.name); }}
				class="flex w-full cursor-pointer items-center justify-center gap-2 py-3 text-white/60 transition-colors hover:text-white
				{spaceItem.clr === 'purple'
					? 'bg-purple-400/30 '
					: spaceItem.clr === 'red'
						? 'bg-red-400/30 '
						: spaceItem.clr === 'green'
							? 'bg-green-400/30 '
							: spaceItem.clr === 'blue'
								? 'bg-blue-400/30 '
								: spaceItem.clr === 'yellow'
									? 'bg-yellow-400/30 '
									: spaceItem.clr === 'orange'
										? 'bg-orange-400/30 '
										: spaceItem.clr === 'pink'
											? 'bg-pink-400/30 '
											: 'bg-surface-900/20 '}"
			>
				{#if isExpanded(spaceItem.name)}
					<ChevronUp class="size-5" />
					<span class="text-sm font-bold">Collapse</span>
				{:else}
					<ChevronDown class="size-5" />
					<span class="text-sm font-bold">{spaceItem.items.length > 0 ? 'Expand' : 'Empty'}</span>
				{/if}
			</button>
		</div>
	{/each}
</div>

{#if spaceSelect.selectMode}
	<div
		in:fly={{ y: 40, duration: 200 }}
		class="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 overflow-x-auto rounded-2xl bg-black/80 px-3 py-2.5 shadow-2xl backdrop-blur-xl border border-white/10"
	>
		<button
			class="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold text-primary-400 transition-colors duration-200 hover:bg-primary-500/10"
			onclick={toggleSelectAll}
		>
			{#if [...localSpaces.current].every((spc: any) => spaceSelect.selectedNames.includes(spc.name))}
				<CheckSquare class="size-4" />
				All
			{:else}
				<Square class="size-4" />
				All
			{/if}
		</button>
		<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">{spaceSelect.selectedNames.length}</span>
		{#if spaceSelect.selectedNames.length > 0}
			<span class="ml-auto flex items-center gap-1">
				<button
					class="flex items-center justify-center rounded-xl bg-red-500/80 p-2 text-white transition-colors duration-200 hover:bg-red-400"
					onclick={() => {
						confirmState.open = true;
						confirmState.title = 'Delete ' + spaceSelect.selectedNames.length + ' spaces?';
						confirmState.message = 'All items in these spaces will be kept';
						confirmState.confirmText = 'Delete';
						confirmState.onConfirm = () => {
							let names = spaceSelect.selectedNames;
							const deletedSpaces = localSpaces.current.filter((s: any) => names.includes(s.name));
							let tempArr = localSpaces.current.filter(
								(s: any) => !names.includes(s.name)
							);
							localSpaces.current = tempArr;
							spaceSelect.selectedNames = [];
							spaceSelect.selectMode = false;
							const msg = names.length + ' spaces Deleted';
							setUndoDeleteSpace(msg, deletedSpaces);
							toast.success(msg, { duration: 2000 });
						};
					}}
				>
					<Trash2 class="size-4" />
				</button>
				<button
					class="flex items-center justify-center rounded-xl p-2 text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
					onclick={() => {
						spaceSelect.selectedNames = [];
						spaceSelect.selectMode = false;
					}}
				>
					<X class="size-4" />
				</button>
			</span>
		{/if}
	</div>
{/if}

<div
	in:fly={{ delay: 0, x: 100 }}
	class="fixed {localSpaces.current.length < 1
		? 'inset-0'
		: ''}  z-0 flex flex-col items-center justify-center gap-2 text-gray-300/30"
>
	{#if localSpaces.current.length < 1}
		<CircleMinus class="size-28" />
		<p class="h3">All Empty!</p>
		<p class="text-sm font-bold">No Space yet</p>
	{/if}
</div>

<div
	in:blur={{ delay: 100 }}
	class="fixed {localSpaces.current.length < 1
		? 'inset-0'
		: ''} bottom-25 z-0 flex flex-col items-center justify-end text-gray-300 opacity-40"
>
	{#if localSpaces.current.length < 1}
		<p class="animate-bounce">Add a Space</p>
		<ArrowDown class="size-10 animate-bounce" />
	{/if}
</div>
