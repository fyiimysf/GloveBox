<script lang="ts">
	import { fade, fly, scale, slide, blur } from 'svelte/transition';
	import Cards from '$lib/components/Cards.svelte';
	import { cardPage, home, localItems, localSpaces, spaceview } from '$lib/shared.svelte';
	import { ArrowLeft, CircleSlash } from 'lucide-svelte';
</script>

{#each spaceview.viewItems as itemCard}
	<div in:blur|global class="relative z-1 mb-10 grid space-y-6">
		<div>
			<div
				in:fly|global
				class="grid {!home.spaceviewLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-6 p-2"
			>
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
						p={itemCard.text}
						img={itemCard.img}
						fL={itemCard.link}
						fR={itemCard.date}
						full={home.spaceviewLayout}
						item={itemCard}
					/>
				</button>

				<br />
			</div>
		</div>
	</div>
{/each}

{#if spaceview.viewItems.length < 1}
	<div
		class="fixed inset-0 -z-10 flex flex-col items-center justify-center text-{spaceview.clr}-400 opacity-30"
	>
		<CircleSlash class="size-28" />
		<p class="h3">Empty Space</p>
		<p class="text-sm font-bold">No Spaces yet</p>
	</div>
{/if}

<button
	in:slide
	onclick={() => {
		history.back();
	}}
	class="btn bg-primary-800/50 fixed bottom-3 z-10 h-10 w-[94%] rounded-lg"
>
	<ArrowLeft />
	Go Back
</button>
