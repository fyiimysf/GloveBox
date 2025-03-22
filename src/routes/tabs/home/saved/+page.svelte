<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import type { PageData } from './$types';
	import Cards from '$lib/components/Cards.svelte';
	import { home } from '$lib/shared.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<div in:scale class="relative grid space-y-6">
	<div>
		<div
			in:fly={{ y: 70 }}
			class="grid {home.savedLayout ? 'grid-cols-2' : 'grid-cols-1'} gap-6 p-2"
		>
			{#each Array(8) as _}
				<Cards
					img="https://picsum.photos/200"
					h6="Card Title"
					h1="Card Subtitle"
					p="Card Description "
					fL="Card Footer Left"
					fR={new Date().toLocaleDateString()}
					full={!home.savedLayout}
				/>
			{/each}
		</div>

		<button
			in:fly={{ delay: 0, y: 100 }}
			type="button"
			class="btn-icon bg-primary-950/70 fixed bottom-0 left-0 h-10 w-[100%] backdrop-blur-xs"
			onclick={() => {
				history.back();
			}}
		>
			<span class="flex flex-1/2 items-center gap-[28%]">
				<ArrowLeft class="size-7" />
				<h3 class="h4">Go Back</h3>
			</span>
		</button>
	</div>
</div>
