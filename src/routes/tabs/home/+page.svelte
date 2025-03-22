<script lang="ts">
	import { draw, fade, fly, scale, slide } from 'svelte/transition';
	import type { PageProps } from '../../$types';
	import { bounceIn, cubicIn, elasticInOut, linear, sineOut } from 'svelte/easing';
	import { home } from '../../../lib/shared.svelte';
	import { ChevronRight } from 'lucide-svelte';
	// import Card from '../card[id]/Cards.svelte';

	let { data } = $props();
	$effect(() => {});
</script>

<div in:fly={{ delay: 0, x: -100 }} class="relative grid space-y-3">
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
			{#each Array(4) as _}
				{@render Card(
					'https://picsum.photos/200',
					'Card Title',
					'Card Subtitle',
					'Card Description',
					'Card Footer Left',
					new Date().toLocaleDateString(),
					home.homeLayout
				)}
			{/each}
		</div>
	{:else}
		<!-- 2 cards column -->
		<div in:fly={{ y: -20 }} class="grid grid-cols-2 gap-2">
			{#each Array(4) as _}
				{@render Card(
					'https://picsum.photos/200',
					'Card Title',
					'Card Subtitle',
					'Card Description ',
					'Card Footer Left',
					new Date().toLocaleDateString(),
					home.homeLayout
				)}
			{/each}
		</div>
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
		href="/card/"
		class="card-link card bg-surface-900 border-surface-200-800 card-hover divide-surface-200-800 block divide-y overflow-hidden border-[2px]"
	>
		{#if full}
			<div class="">
				<header>
					<img src={img} class="aspect-video w-full" alt="card-preview" />
				</header>
				<article class="px-3 py-1">
					<div>
						<p class="p">{h1}</p>
					</div>
					<small class="overflow-hidden opacity-60">{p}</small>
				</article>
				<footer class="gap- flex items-center justify-around p-1">
					<small class="text-justify opacity-60">{fL}</small>
					<small class="opacity-60">On {fR}</small>
				</footer>
			</div>
		{:else}
			<div
				class=" card border-surface-200-800 card-hover block h-30 w-full overflow-hidden rounded-xl border-[0.5px] shadow-lg"
			>
				<img src={img} class="h-full w-full" alt="card-preview" />

				<article class="relative bottom-13 p-1">
					<span class="-space-y-2">
						<p class="p">{h1}</p>
						<small class="opacity-60">{fL}</small>
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
