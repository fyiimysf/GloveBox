<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import type { PageData } from './$types';
	import Cards from '$lib/components/Cards.svelte';
	import { home, localItems } from '$lib/shared.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class=" mb-10 grid space-y-6">
	<div in:scale>
		<div in:fly={{ y: 70 }} class="grid {home.savedLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
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
	<button
		in:fly={{ delay: 10, y: 100 }}
		type="button"
		class=" btn-icon bg-primary-950/70 fixed bottom-0 left-0 h-10 w-full rounded-xs backdrop-blur-xs"
		onclick={() => {
			history.back();
		}}
	>
		<span class="bottom-0 flex flex-1/2 items-center gap-[28%]">
			<ArrowLeft class="size-7" />
			<h3 class="h4">Go Back</h3>
		</span>
	</button>
</div>
