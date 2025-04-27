<script lang="ts">
	import { draw, fade, fly, scale, slide } from 'svelte/transition';
	import type { PageProps } from '../../$types';
	import { bounceIn, cubicIn, elasticInOut, linear, sineOut } from 'svelte/easing';
	import { home, localItems } from '../../../lib/shared.svelte';
	import { ArrowDown, ChevronRight, CircleAlert } from 'lucide-svelte';
	// import Card from '../card[id]/Cards.svelte';

	let { data } = $props();
	$effect(() => {});
</script>

<!-- Saved Section -->

<div in:fly={{ delay: 0, x: -100 }} class="relative z-10 grid space-y-3">
	{#if localItems.current.length > 0}
		<a href="/tabs/home/saved">
			<div class="flex items-stretch justify-between">
				<p class="h3 p-1 font-thin">Saved</p>
				<div class="p-3">
					<ChevronRight />
				</div>
			</div>
		</a>

		{#if home.homeLayout}
			<!-- 1 card column -->
			<div in:fly={{ y: 70 }} class="grid grid-cols-1 gap-2">
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
			<div in:fly={{ y: -20 }} class="grid grid-cols-2 gap-2">
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
	full?: boolean
)}
	<a
		href="/"
		class="card-link card bg-surface-900 border-surface-200-800 card-hover divide-surface-200-800 block divide-y overflow-hidden border-[2px]"
	>
		{#if full}
			<div class="">
				<header>
					<img src={img} class=" aspect-video w-full rounded-b-xl" alt="card-preview" />
				</header>
				<article class="px-3 py-1">
					<div>
						<p class="p">{h1}</p>
					</div>
					<small class="overflow-y-clip opacity-60">{p}</small>
				</article>
				<footer class="gap- flex items-center justify-around p-1">
					<small class="text-justify opacity-60">{fL}</small>
					<small class="opacity-60">On {fR}</small>
				</footer>
			</div>
		{:else}
			<div
				class=" card border-surface-200-800 card-hover block h-40 w-full overflow-hidden rounded-xl border-[0.5px] shadow-lg"
			>
				<img src={img} class="aspect-video w-full" alt="card-preview" />

				<article class=" bg-primary-950/90 relative bottom-0 z-1 h-full p-2">
					<span class="text-surface-50 text- -space-y-2">
						<p class="text-md font-bold">{h1}</p>
						<small class="font-mono text-xs">{fL}</small>
					</span>

					<!-- <small class="text-justify opacity-60">{p}</small> -->
				</article>

				<!-- <footer class="flex items-center justify-between gap-4 p-4">
    <small class="opacity-60">On {fR}</small>
    </footer> -->
			</div>
		{/if}
	</a>
{/snippet}

{#snippet ListLocal()}
	{#each localItems.current as item}
		{@render Card(
			item.img,
			'',
			item.title,
			item.link,
			item.text,
			new Date().toLocaleDateString(),
			home.homeLayout
		)}
	{/each}
{/snippet}
<div
	in:fly={{ delay: 0, x: -100 }}
	class="fixed inset-0 z-0 flex flex-col items-center justify-center gap-1 text-gray-300/30"
>
	{#if localItems.current.length < 1}
		<CircleAlert class="size-28" />
		<p class="h3">All Empty</p>
		<p class="text-sm font-bold">Nothing saved yet</p>
	{/if}
</div>

<div
	in:fade={{ delay: 100 }}
	class="fixed inset-0 bottom-20 z-0 flex flex-col items-center justify-end text-gray-600"
>
	{#if localItems.current.length < 1}
		<p>Add Item</p>
		<ArrowDown class="size-10" />
	{/if}
</div>
