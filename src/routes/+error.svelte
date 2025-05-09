<script lang="ts">
	import { Frown } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { blur } from 'svelte/transition';
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import IconX from '@lucide/svelte/icons/x';

	let openState = $state(false);

	function popoverClose() {
		openState = false;
	}
</script>

<div transition:blur class="fixed inset-0 flex h-full flex-col items-center justify-center">
	<div class=" flex flex-col items-center justify-center opacity-30">
		<Frown class="size-20" />
		<h4 class="h2">Oops!</h4>
		<h4 class="h6">Something went wrong.</h4>
	</div>
	<br />
	<a href="/" class="btn text-primary-400/70 font-medium outline-2">Go back</a>
	<Popover
		open={openState}
		onOpenChange={(e) => (openState = e.open)}
		positioning={{ placement: 'top' }}
		triggerBase="btn absolute bottom-10 right-[45%] left-[45%] text-primary-400/60 "
		contentBase="card bg-primary-800/40 p-4 space-y-4 max-w-[300px]"
		arrow
		arrowBackground="!bg-surface-200 dark:!bg-surface-800"
	>
		{#snippet trigger()}Why? am I seeing this?{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<p class="text-xl font-bold">An Error Occured</p>
				<button class="btn-icon hover:preset-tonal" onclick={popoverClose}><IconX /></button>
			</header>
			<article>
				<p class="opacity-60">
					This could be due to a variety of reasons, such as a <b>network issue</b>, a
					<b>server error</b>, or a <b>bug in the application</b>. If you continue to experience
					this issue, please contact support for assistance.
				</p>
			</article>
		{/snippet}
	</Popover>
</div>
