<script lang="ts">
	import { cardPage, localItems, localSpaces, spaceview } from '$lib/shared.svelte';
	import { CircleDashed, CircleDot, CircleOff, CircleX, Trash2 } from '@lucide/svelte';
	import { CircleDotDashed, Delete, Link, MoreVertical, Trash, X } from 'lucide-svelte';
	import { fade, slide, blur, fly } from 'svelte/transition';
	import AddtoSpace from './AddtoSpace.svelte';
	import toast from 'svelte-french-toast';
	import { page } from '$app/state';

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
	class=" rounded-full bg-black/30 p-0.5 backdrop-blur"
	type="button"
	onclick={() => {
		dropMenu = !dropMenu;
	}}
>
	{#if dropMenu || spaceMenu}
		<X />
	{:else}
		<MoreVertical class="size-5 text-white" />
	{/if}
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
		class="fixed inset-0 z-1 bg-black/30 backdrop-blur-[1px]"
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
		class="bg-primary-950/70 absolute z-100 w-35 rounded-lg px-2 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-lg"
	>
		{#if data.url !== ''}
			<a target="_blank" href={data.url} class="">
				<div class="block py-2 text-xs text-yellow-300">
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
							<div class="block py-1">
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
										spaceview.viewItems.forEach((item: any) => {
											if (item.title === data.title) {
												let tempArr3 = spaceview.viewItems.filter(
													(item: any) => item.title !== data.title
												);
												spaceview.viewItems = tempArr3;
											}
										});
										toast.success('Item Deleted from ' + spaceObj.name, {
											style: 'border-radius: 200px; background: #333; color: #fff;',
											duration: 1500
										});
									}}
									class="flex justify-between text-{spaceObj.clr}-400"
								>
									<p class="w-30 truncate">
										Delete From <br />{spaceObj.name}
									</p>
									<CircleOff />
								</span>
							</div>
						{/if}
					</div>
				{/each}
			{/each}
			{#if page.route.id !== '/tabs/space/spaceview' && page.route.id !== '/tabs/space'}
				<div class="  py-1">
					<span
						onclick={() => {
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
						class="flex justify-between"
					>
						Add To Space
						<CircleDotDashed />
					</span>
				</div>
			{/if}
		{/if}
		{#if page.route.id !== '/tabs/space/spaceview' && page.route.id !== '/tabs/space'}
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
					toast(data.title + ' Deleted', {
						icon: '🗑️',
						style: 'border-radius: 200px; background: #333; color: #fff;',
						duration: 3000
					});
				}}
				class="py-1"
			>
				<div class="block py-1 text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
					<span class="flex justify-between">
						Delete
						<Trash />
					</span>
				</div>
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
			class="bg-primary-950/70 absolute z-100 h-28 w-40 overflow-y-auto rounded-lg font-bold shadow-xs backdrop-blur-lg"
		>
			{#each [...localSpaces.current].reverse() as item, index}
				<div
					onclick={() => {
						if (item.items.length < 1) {
							item.items.push(data);
							toast.success('Item Added to ' + item.name, {
								style: 'border-radius: 200px; background: #333; color: #fff;',
								duration: 1500
							});
						} else {
							let tempArr = item.items.filter((item: any) => item.title !== data.title);
							item.items = tempArr;
							toast.success('Item Removed from ' + item.name, {
								style: 'border-radius: 200px; background: #333; color: #fff;',
								duration: 1500
							});
						}

						spaceMenu = !spaceMenu;
					}}
					class="py-1"
				>
					<div class=" px-2 py-0.5 text-xs text-{item.clr}-400">
						<span class="flex justify-between">
							<p class="w-30 truncate">
								{item.name}
							</p>
							<CircleDotDashed />
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}
