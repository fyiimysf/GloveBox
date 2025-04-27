<script lang="ts">
	import { spaces } from '$lib/shared.svelte';
	import { ArrowDown, CircleAlert, CircleDotDashed } from 'lucide-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	let transitioned = $state(false);
</script>

{#if spaces.current.length > 0}
	<div>
		<div in:fly={{ delay: 0, x: 100 }} class=" space-y-4">
			<h1>Space</h1>
			<p>This is the space page.</p>
		</div>
	</div>
{/if}

<div
	in:fly={{ delay: 0, x: 100 }}
	class="fixed inset-0 z-0 flex flex-col items-center justify-center gap-1 text-gray-600"
>
	{#if spaces.current.length < 1}
		<CircleDotDashed class="size-28" />
		<p class="h3">Empty Space</p>
		<p class="text-sm font-bold">No Spaces yet</p>
	{/if}
</div>

<div
	in:fade={{ delay: 100 }}
	class="fixed inset-0 bottom-20 z-1 flex flex-col items-center justify-end text-gray-600"
>
	{#if spaces.current.length < 1}
		<p>Add Space</p>
		<ArrowDown class="size-10" />
	{/if}
</div>
