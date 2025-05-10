<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import type { PageData } from './$types';
	import Cards from '$lib/components/Cards.svelte';
	import { cardPage, home, localItems, localSpaces, spaceview } from '$lib/shared.svelte';
	import { ArrowLeft, CircleSlash } from 'lucide-svelte';
	import { on } from '@sveu/browser';
	import { onMount } from 'svelte';
</script>

<div in:scale class="relative grid space-y-6">
	{#each localSpaces.current as spaceItem}
		<div>
			<div
				in:fly={{ y: 70 }}
				class="grid {!home.spaceviewLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-6 p-2"
			>
				{#each [...spaceItem.items].reverse() as itemCard, index}
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
							fL={itemCard.text}
							fR={itemCard.date}
							full={home.spaceviewLayout}
						/>
					</button>
				{/each}
				<br/>
			</div>
		</div>
	{/each}
</div>

{#if spaceview.viewItems.length < 1}
	<div
		class="fixed inset-0 z-0 flex flex-col items-center justify-center text-{spaceview.clr}-400 opacity-30"
	>
		<CircleSlash class="size-28" />
		<p class="h3">Empty Space</p>
		<p class="text-sm font-bold">No Spaces yet</p>
	</div>
{/if}
<button
	in:fly={{ delay: 10, y: 100 }}
	type="button"
	class="btn-icon z-10 bg-primary-950/70 fixed bottom-0 left-0 h-10 w-full rounded-xs backdrop-blur-xs"
	onclick={() => {
		history.back();
	}}
>
	<span class="bottom-0 flex flex-1/2 items-center gap-[28%]">
		<ArrowLeft class="size-7" />
		<h3 class="h4">Go Back</h3>
	</span>
</button>
