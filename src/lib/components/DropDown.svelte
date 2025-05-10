<script lang="ts">
	import { cardPage, localItems, localSpaces } from '$lib/shared.svelte';
	import { CircleDashed, CircleDot } from '@lucide/svelte';
	import { CircleDotDashed, Link, MoreVertical, Trash } from 'lucide-svelte';
	import { fade, slide, blur, fly } from 'svelte/transition';
	import AddtoSpace from './AddtoSpace.svelte';
	import toast from 'svelte-french-toast';

	let dropMenu = $state(false);
	let spaceMenu = $state(false);

	let { data, id = 0 }: { data?: any; id?: number } = $props();

	function DeleteFromStorage() {
		localItems.current.slice(data, 1);
	}
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	id="dropdownMenuIconButton"
	class=" m-1 p-0.5 text-gray-400 backdrop-blur"
	type="button"
	onclick={() => {
		dropMenu = !dropMenu;
	}}
>
	<MoreVertical class="size-5" />
</button>

<!-- Dropdown menu -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if dropMenu || spaceMenu}
	<div
		onclick={() => {
			dropMenu = false;
			spaceMenu = false;
		}}
		class="fixed inset-0 bg-black/30"
	></div>
{/if}
{#if dropMenu}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:slide={{ duration: 150 }}
		id="dropdownDots"
		onclick={() => {
			dropMenu = !dropMenu;
		}}
		class="bg-primary-950/70 z-100 w-40 rounded-lg font-bold shadow-sm outline backdrop-blur-lg"
	>
		{#if data.url !== ''}
			<a target="_blank" href={data.url} class="py-1">
				<div class="block px-4 py-1 text-xs text-yellow-300">
					<span class="flex justify-between">
						Open Link
						<Link />
					</span>
				</div>
			</a>
		{/if}
		{#if localSpaces.current.length > 0}
			{#each localSpaces.current as spaceObj}
				{#each spaceObj.items as obj}
					<div class="py-1">
						{#if obj.title === data.title}
							<div class="block px-4 py-1 text-xs">
								<span
									onclick={() => {
										spaceObj.items.forEach((item: any) => {
											if (item.title === data.title) {
												let tempArr2 = spaceObj.items.filter(
													(item: any) => item.title !== data.title
												);
												spaceObj.items = tempArr2;
											}
										});
										toast.success('Item Deleted from Space', {
											style: 'border-radius: 200px; background: #333; color: #fff;',
											duration: 1500
										});
									}}
									class="flex justify-between text-{spaceObj.clr}-400"
								>
									Delete From {spaceObj.name}
									<CircleDotDashed />
								</span>
							</div>
						{/if}
					</div>
					{/each}
					{/each}
					
					<div class="block px-4 py-1 text-xs">
						<span
							onclick={() => {
								spaceMenu = !spaceMenu;
								localSpaces.current.forEach((spc: any) => {
									spc.items.forEach((item: any) => {
										if (item.title === data.title) {
											let tempArr2 = spc.items.filter(
												(item: any) => item.title !== data.title
											);
											spc.items = tempArr2;
										}
									});
								});
							}}
							class="flex justify-between"
						>
							Add To Space
							<CircleDashed />
						</span>
					</div>
		{/if}
		<div
			onclick={() => {
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
				console.log(localSpaces.current);
				console.log(localItems.current);
				toast.success('Item Deleted', {
					style: 'border-radius: 200px; background: #333; color: #fff;',
					duration: 1500
				});
			}}
			class="py-1"
		>
			<div class="block px-4 py-1 text-xs text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
				<span class="flex justify-between">
					Delete
					<Trash />
				</span>
			</div>
		</div>
	</div>
{/if}

{#if spaceMenu}
	{@render AddtoSpace()}
{/if}

{#snippet AddtoSpace()}
	{#each localSpaces.current as item, index}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			transition:slide={{ duration: 150 }}
			id="dropdownDots"
			onclick={() => {}}
			class="bg-primary-950/70 w-40 rounded-lg font-bold shadow-sm outline backdrop-blur-lg"
		>
			<div
				onclick={() => {
					if (item.items.length < 1) {
						item.items.push(data);
						toast.success('Item Added to Space', {
							style: 'border-radius: 200px; background: #333; color: #fff;',
							duration: 1500
						});
					} else {
						let tempArr = item.items.filter((item: any) => item.title !== data.title);
						item.items = tempArr;
						toast.success('Item Removed from Space', {
							style: 'border-radius: 200px; background: #333; color: #fff;',
							duration: 1500
						});
					}

					spaceMenu = !spaceMenu;
				}}
				class="py-1"
			>
				<div
					class="block px-4 py-1 text-xs text-{item.clr}-400 hover:bg-gray-100 dark:hover:bg-gray-600"
				>
					<span class="flex justify-between">
						{item.name}
						<CircleDotDashed />
					</span>
				</div>
			</div>
		</div>
	{/each}
{/snippet}
