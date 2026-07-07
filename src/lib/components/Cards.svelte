<script lang="ts">
	import { page } from '$app/state';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { cardPage, saveCardPage } from '$lib/shared.svelte';
	import { blur } from 'svelte/transition';
	import DropDown from './DropDownButton.svelte';
	import { Link, Square, CheckSquare } from 'lucide-svelte';
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
		saveCardPage();
		goto('/card');
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
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
					><Link class="size-7 p-1" /></a
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
				<small class="justify-start overflow-hidden break-words opacity-60">{p}</small>
			</article>
			<footer class="flex items-center justify-between bg-black/10 px-3 py-1">
				<small class="text-justify opacity-60">{fL}</small>
				<small class="opacity-60">On {fR}</small>
			</footer>
		</div>
	{:else}
		<div
			in:blur
			class="card relative h-27 overflow-hidden rounded-xl shadow-lg transition-all duration-200"
		>
			{#if page.route.id === '/tabs/space' && !selectMode}
				<div class="absolute z-100">
					<DropDown data={item} />
				</div>
				{#if item.url !== ''}
					<!-- svelte-ignore node_invalid_placement_ssr -->
					<a
						href={item.url}
						target="_blank"
						class="text-primary-200 absolute right-1 mt-1 rounded-full bg-black/60 shadow-lg"
						onclick={(e) => e.stopPropagation()}
						><Link class="size-6 p-1" /></a
					>
				{/if}
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

			<article class="relative bottom-8 rounded-b-xl bg-gradient-to-t from-black/80 to-transparent p-1">
				<span class="-space-y-2">
					<p class="p truncate px-1">{h1}</p>
				</span>
			</article>
		</div>
	{/if}
</div>
