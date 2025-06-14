<script lang="ts">
	import { blur, draw, fade, fly, scale, slide } from 'svelte/transition';
	import type { PageProps } from '../../$types';
	import { bounceIn, cubicIn, elasticInOut, linear, sineOut } from 'svelte/easing';
	import { cardPage, home, localItems, spaceview } from '../../../lib/shared.svelte';
	import {
		AlertTriangle,
		ArrowDown,
		ChevronRight,
		CircleAlert,
		CircleMinus,
		Frown
	} from 'lucide-svelte';
	import { Link, Link2, MoreHorizontalIcon, MoreVerticalIcon } from '@lucide/svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import DropDown from '$lib/components/DropDownButton.svelte';
	import NoImageUrl from '$lib/assets/no-image.png';
	import Placeholder from '$lib/components/Placeholder.svelte';
	// import Card from '../card[id]/Cards.svelte';
	import { Image } from '@unpic/svelte';

	let { data } = $props();

	let dropMenu = $state(false);
	const imgError = (e: any) => (e.target.src = NoImageUrl);
	function CardPage(
		title: string,
		img: any,
		link: string,
		text: string,
		date: string,
		url: string
	) {
		cardPage.title = title;
		cardPage.img = img;
		cardPage.link = link;
		cardPage.text = text;
		cardPage.date = date;
		cardPage.url = url;
	}
</script>

<!-- Saved Section -->

<div in:blur class="relative z-5 grid space-y-3">
	{#if localItems.current.length > 0}
		<a
			href="/tabs/home/saved"
			onclick={() => {
				spaceview.clr = 'purple';
			}}
		>
			<div class="flex items-stretch justify-between">
				<p class="h3 p-1 font-thin">Saved</p>
				<div class="p-3">
					<ChevronRight />
				</div>
			</div>
		</a>

		{#if home.homeLayout}
			<!-- 1 card column -->
			<div in:fly={{ y: 70 }} class="grid grid-cols-1 gap-3">
				<!-- {#each Array(4) as _}
				{@render Card(
					'https://picsum.photos/200',
					'Card Title',
					'Card Subtitle',
					'Card Description',
					'Card Footer Left',
					new Date().toLocaleDateString(),
					home.homeLayout
				)}
			{/each} -->
				{@render ListLocal()}
			</div>
		{:else}
			<!-- 2 cards column -->
			<div in:fly={{ y: -20 }} class="grid grid-cols-2 gap-3">
				{@render ListLocal()}
			</div>
		{/if}
	{/if}
</div>

{#snippet Card(
	img?: string,
	h6?: string,
	h1?: string,
	p?: string,
	fL?: string,
	fR?: string,
	full?: boolean,
	id?: number,
	item?: any
)}
	<div
		class="card-link bg-primary-900/30 card border-surface-200-800 card-hover divide-surface-200-800 block divide-y border-[2px] shadow-lg"
	>
		{#if full}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="">
				<div class="absolute z-6 m-2 items-center rounded-full">
					<DropDown data={item} />
				</div>
				{#if item.url !== ''}
					<!-- svelte-ignore node_invalid_placement_ssr -->
					<a
						href={item.url}
						target="_blank"
						class="  absolute right-3 mt-2 rounded-full bg-black/30 text-white backdrop-blur"
						><Link class="text-primary-200 size-7 p-1" /></a
						
					>
				{/if}
				<a onclick={() => CardPage(item.title, item.img, item.link, item.text, item.date, item.url)}
					href="/card">
					<header>
						<Image
							src={img}
							onerror={imgError}
							class=" aspect-video w-full rounded-t-xl object-cover"
							alt={NoImageUrl}
						/>
					</header>
					<article class="px-3 py-1">
						<div>
							<p class="p">{h1}</p>
						</div>
						<small class="line-clamp-2 opacity-60">{p}</small>
					</article>
					<hr class="hr" />
					<footer
						class="gap- text-primary-100 flex items-center justify-between px-2 pb-2 font-mono"
					>
						<small class="text-justify opacity-60">{fL}</small>
						<small class="opacity-60">On {fR}</small>
					</footer>
				</a>
			</div>
		{:else}
			<div
				class=" card border-surface-200-800/0 card-hover relative block h-fit w-full rounded-xl border-[0.5px]"
			>
				<div class="absolute m-1">
					<DropDown data={item} />
				</div>
				<!-- svelte-ignore node_invalid_placement_ssr -->
				{#if item.url !== ''}
					<a
						href={item.url}
						target="_blank"
						class=" absolute right-1 mt-1 rounded-full bg-black/40 backdrop-blur"
						><Link class=" text-primary-200 size-6 p-1" /></a
					>
				{/if}
				<a
					onclick={() => CardPage(item.title, item.img, item.link, item.text, item.date, item.url)}
					href="/card"
				>
					{#if img}
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<Image
							src={img}
							class="aspect-video w-full rounded-t-lg object-cover"
							onerror={imgError}
							alt="card-preview"
							onclick={() => {}}
						/>
					{/if}

					<article class=" h-full items-stretch justify-between pl-1 shadow-none">
						<span class="text-surface-50 flex flex-col justify-center -space-y-1">
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<p onclick={() => {}} class="text-md truncate pb-1 font-mono font-bold">
								{h1}
							</p>
							<small class="truncate font-mono text-xs">{fL}</small>
						</span>

						<!-- <small class="text-justify opacity-60">{p}</small> -->
					</article>
				</a>
				<!-- <footer class="flex items-center justify-between gap-4 p-4">
    <small class="opacity-60">On {fR}</small>
    </footer> -->
			</div>
		{/if}
	</div>
{/snippet}

{#snippet ListLocal()}
	{#each [...localItems.current].reverse() as item, index}
		{#if index < 8}
			{@render Card(
				item.img,
				'',
				item.title,
				item.text,
				item.link,
				new Date().toLocaleDateString(),
				home.homeLayout,
				index,
				item
			)}
		{/if}
	{/each}
{/snippet}

<div
	in:fly={{ delay: 0, x: -100 }}
	class="fixed inset-0 z-0 flex flex-col items-center justify-center gap-2 text-gray-300/30"
>
	{#if localItems.current.length < 1}
		<CircleMinus class="size-28" />
		<p class="h3">All Empty!</p>
		<p class="text-sm font-bold">No Items yet</p>
	{/if}
</div>
<div
	in:blur={{ delay: 100 }}
	class="fixed inset-0 bottom-20 z-0 flex flex-col items-center justify-end text-gray-300 opacity-40"
>
	{#if localItems.current.length < 1}
		<p class="animate-bounce">Add Item</p>
		<ArrowDown class="size-10 animate-bounce" />
	{/if}
</div>
