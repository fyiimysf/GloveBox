<script lang="ts">
	import { page } from '$app/state';
	import Cards from '$lib/components/Cards.svelte';
	import { cardPage, home, localSpaces, space, spaceview } from '$lib/shared.svelte';
	import { CircleX, Currency } from '@lucide/svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import {
		ArrowDown,
		ChevronRight,
		CircleMinus,
		CircleSlash,
		CircleSlash2,
		Trash,
		X
	} from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { fly, blur, fade, slide } from 'svelte/transition';
	$effect(() => {
		// $inspect(spaceview);
	});

	function emptyToast() {
		toast(spaceview.pageTitle + ' is Empty', {
			style: 'border-radius: 200px; background: #333; color: #fff;',
			duration: 1200
		});
	}
</script>

<div class=" z-10 space-y-4" in:blur>
	{#each [...localSpaces.current].reverse() as spaceItem}
		<div
			transition:fly={{ delay: 0, x: 100 }}
			class="
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

		 z-10 rounded-2xl shadow-lg shadow-black/20 backdrop-blur"
		>
			<a
				href={spaceItem.items.length > 0 ? '/tabs/space/spaceview' : ''}
				onclick={() => {
					spaceview.pageTitle = spaceItem.name;
					spaceview.clr = spaceItem.clr;
					spaceview.viewItems = spaceItem.items;
					if (spaceItem.items.length < 1) {
						emptyToast();
					}
				}}
			>
				<div class=" flex items-stretch justify-between pb-3">
					<span>
						<p class="p w-50 truncate pt-2 pl-3 text-2xl font-medium opacity-100">
							{spaceItem.name}
						</p>
						<p class="w-60 truncate pl-3 text-sm opacity-100">{spaceItem.desc}</p>
					</span>
					<div class="flex pt-2.5 pr-3">
						{#if home.spaceDelete}
							<CircleX
								class="size-8 text-red-400"
								onclick={() => {
									let tempArr = localSpaces.current.filter(
										(item: any) => item.name !== spaceItem.name
									);
									localSpaces.current = tempArr;
									console.log(localSpaces.current);
									toast(spaceItem.name + ' Deleted', {
										icon: '🗑️',
										style: ' border-radius: 200px; background: #333; color: #fff;',
										duration: 3000
									});
								}}
							/>
						{:else if spaceItem.items.length > 0}
							<p class="text-lg font-bold">{spaceItem.items.length}</p>
							<ChevronRight class="size-8" />
						{:else}
							<CircleMinus class="size-8 opacity-40" />
						{/if}
					</div>
				</div>
			</a>
			{#if home.savedLayout}
				<div transition:slide class="p-2">
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
					{:else}
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
												? 'bg-yellow-400/30'
												: spaceItem.clr === 'orange'
													? 'bg-orange-400/30 '
													: spaceItem.clr === 'pink'
														? 'bg-pink-400/30 '
														: 'bg-surface-900/20'}

						grid grid-cols-2 gap-1 overflow-auto rounded-2xl p-1.5"
						>
							{#each [...spaceItem.items].reverse() as itemCard, index}
								{#if index < 4}
									<button
										onclick={() => {
											cardPage.title = itemCard.title;
											cardPage.img = itemCard.img;
											cardPage.link = itemCard.link;
											cardPage.text = itemCard.text;
											cardPage.date = itemCard.date;
											cardPage.url = itemCard.url;
										}}
									>
										<Cards
											h1={itemCard.title}
											img={itemCard.img}
											p={itemCard.text}
											item={itemCard}
											full={false}
										/>
									</button>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>

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
		: ''} bottom-20 z-0 flex flex-col items-center justify-end text-gray-300 opacity-40"
>
	{#if localSpaces.current.length < 1}
		<p class="animate-bounce">Add a Space</p>
		<ArrowDown class="size-10 animate-bounce" />
	{/if}
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
