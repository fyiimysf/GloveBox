<script lang="ts">
	import { fade, fly, scale, blur, slide } from 'svelte/transition';
	import type { PageData } from './$types';
	import Cards from '$lib/components/Cards.svelte';
	import { home, localItems } from '$lib/shared.svelte';
	import { ArrowDown, ArrowLeft, CircleMinus } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="relative z-1 mb-10 grid space-y-6">
	<div in:scale|global>
		<div class="grid {home.savedLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
			{#each [...localItems.current].reverse() as _}
				<Cards
					img={_.img}
					h6={_.title}
					h1={_.title}
					p={_.text}
					fL={_.link}
					fR={_.date}
					full={!home.savedLayout}
					item={_}
				/>
			{/each}
		</div>
	</div>
</div>

<!-- Back Button -->
<button
	in:slide
	onclick={() => {
		history.back();
	}}
	class="btn bg-primary-950/70 fixed bottom-6 left-1/2 z-9 w-80 -translate-x-1/2 rounded-2xl backdrop-blur"
>
	<ArrowLeft />
	Go Back
</button>

<div
	in:fly={{ delay: 0, x: -100 }}
	class="fixed inset-0 z-0 flex flex-col items-center justify-center gap-1 text-gray-300/30"
>
	{#if localItems.current.length < 1}
		<CircleMinus class="size-28" />
		<p class="h3">All Empty!</p>
		<p class="text-sm font-bold">Nothing Saved yet</p>
	{/if}
</div>
