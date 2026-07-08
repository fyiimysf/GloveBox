<script lang="ts">
	import { page } from '$app/state';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { cardPage, saveCardPage, home, longpress } from '$lib/shared.svelte';
	import { blur } from 'svelte/transition';
	import DropDown from './DropDownButton.svelte';
	import { Link, Pin, Square, CheckSquare } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let {
		img = '',
		h1 = '',
		p = '',
		fL = '',
		fR = new Date().toLocaleDateString(),
		full = false,
		item = '',
		selectMode = false,
		selected = false,
		pinned = false,
		spaceName = '',
		onselect = (_checked: boolean) => {}
	}: {
		img?: string;
		h1?: string;
		p?: string;
		fL?: string;
		fR?: string;
		full?: boolean;
		item?: any;
		selectMode?: boolean;
		selected?: boolean;
		pinned?: boolean;
		spaceName?: string;
		onselect?: (checked: boolean) => void;
	} = $props();

	const imgError = (e: any) => (e.target.src = NoImageUrl);

	function handleNav(e: MouseEvent) {
		if (selectMode) {
			onselect(!selected);
			return;
		}
		cardPage.title = item.title;
		cardPage.img = item.img;
		cardPage.link = item.link;
		cardPage.text = item.text;
		cardPage.date = item.date;
		cardPage.url = item.url;
		cardPage.pinned = item.pinned;
		cardPage.pinnedInSpace = item.pinnedInSpace ?? false;
		cardPage.space = spaceName;
		saveCardPage();
		goto('/card');
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	use:longpress={() => {
		home.selectMode = true;
		onselect(true);
	}}
	onclick={handleNav}
	class="card divide-surface-200-800 relative {selectMode ? 'cursor-pointer' : ''} {selected ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-transparent shadow-lg shadow-primary-500/20' : ''} transition-all duration-200"
>
	{#if selectMode}
		<div
			class="absolute top-2 right-2 z-20"
			onclick={(e) => {
				e.stopPropagation();
				onselect(!selected);
			}}
		>
			{#if selected}
				<CheckSquare class="size-6 text-primary-400 drop-shadow-md" />
			{:else}
				<Square class="size-6 text-white/60" />
			{/if}
		</div>
	{/if}
	{#if selected}
		<div class="pointer-events-none absolute inset-0 z-10 bg-primary-500/20"></div>
	{/if}
	{#if full}
		<div in:blur class="bg-surface-900 overflow-hidden shadow-lg transition-all duration-200 rounded-xl">
			<div class="absolute m-2 rounded-full">
				<DropDown data={item} />
			</div>
			{#if item.url !== '' && !selectMode}
				<!-- svelte-ignore node_invalid_placement_ssr -->
				<a
					href={item.url}
					target="_blank"
					class="text-primary-200 absolute right-3 z-11 mt-3 rounded-full bg-black/60 shadow-lg"
					onclick={(e) => e.stopPropagation()}
					><Link class="size-7 p-1 mix-blend-difference backdrop-blur-sm rounded-lg" /></a
				>
			{/if}
			<header>
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={img}
					onerror={imgError}
					class="aspect-video w-full object-cover"
					alt="card-preview"
					loading="lazy"
					decoding="async"
				/>
			</header>
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<article class="px-3 py-1">
				<div>
					<p class="p">{h1}</p>
				</div>
				<small class="justify-start overflow-hidden wrap-break-word opacity-60">{p}</small>
			</article>
			<footer class="flex items-center justify-between bg-black/10 px-3 py-1">
				<small class="text-justify opacity-60">{fL}</small>
				<span class="flex items-center gap-1.5">
					<small class="opacity-60">On {fR}</small>
					{#if pinned && !selectMode}
						<Pin class="size-3 text-yellow-400" />
					{/if}
				</span>
			</footer>
		</div>
	{:else}
		<div
			in:blur
			class="card relative h-27 overflow-hidden rounded-xl shadow-lg transition-all duration-200"
		>
			<div class="absolute top-0 left-0 z-10 m-1">
				<DropDown data={item} />
			</div>
			{#if pinned && !selectMode}
				<div class="absolute bottom-1 right-1 z-10 p-1 mix-blend-difference ">
					<Pin class="size-5 backdrop-blur-3xl rounded-md text-yellow-400 bg-black" />
				</div>
			{/if}
			{#if item.url !== '' && !selectMode}
				<!-- svelte-ignore node_invalid_placement_ssr -->
				<a
					href={item.url}
					target="_blank"
					class="text-white absolute right-1 mt-1 shadow-lg"
					onclick={(e) => e.stopPropagation()}
					><Link class=" size-6 p-1 mix-blend-difference backdrop-blur-xs rounded-lg " /></a
				>
			{/if}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<img
				src={img}
				onerror={imgError}
				class="aspect-video h-full w-full object-cover"
				alt="card-preview"
				loading="lazy"
				decoding="async"
			/>

			<article class="relative bottom-8 rounded-b-xl bg-linear-to-t from-black/80 to-black/5 p-1 shadow-xl shadow-black/50 backdrop-blur-xs">
				<span class="-space-y-2">
					<p class="p font-semibold truncate pr-6 ">{h1}</p>
				</span>
			</article>
		</div>
	{/if}
</div>
