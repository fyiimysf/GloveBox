<script lang="ts">
	import { localItems } from '$lib/shared.svelte';
	import { CircleDashed, CircleDot } from '@lucide/svelte';
	import { Link, MoreVertical, Trash } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let dropMenu = $state(false);

	let { data, id = 0 }: { data?: any; id?: number } = $props();

	function DeleteFromStorage() {
		localItems.current.slice(data, 1);
	}
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	id="dropdownMenuIconButton"
	class="text-surface-500 rounded-full p-1 backdrop-blur-xs"
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
<div
	in:fade
	id="dropdownDots"
	onclick={() => {
		dropMenu = !dropMenu;
	}}
	class=" {dropMenu
		? 'visible'
		: 'hidden'}  bg-primary-950/70 w-40 divide-y divide-white rounded-lg font-bold shadow-sm outline backdrop-blur-lg"
>
	{#if data.url !== ''}
		<a target="_blank" href={data.url} class="py-1">
			<div class="block px-4 py-1 text-xs text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-600">
				<span class="flex justify-between">
					Open Link
					<Link />
				</span>
			</div>
		</a>
	{/if}
	<div class="py-1">
		<div class="block px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
			<span class="flex justify-between">
				Add To Space
				<CircleDashed />
			</span>
		</div>
	</div>
	<div
		onclick={() => {
			let tempArr = localItems.current.filter((item: any) => item.title !== data.title);
			localItems.current = tempArr;
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
