<script lang="ts">
	import { page } from '$app/state';
	import { cardPage, restoreCardPage } from '$lib/shared.svelte';
	import { ArrowLeft, X } from 'lucide-svelte';
	import { blur, fade, slide } from 'svelte/transition';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { onMount } from 'svelte';
	import { Image } from '@unpic/svelte';
	import { expoInOut } from 'svelte/easing';

	onMount(() => restoreCardPage());

	const imgError = (e: any) => (e.target.src = NoImageUrl);

	let photoViewer = $state(false);

	function closeViewer() {
		photoViewer = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeViewer();
	}
</script>

	<div in:blur class="gpu justify-top z-10 flex h-screen flex-col items-start overflow-x-hidden">
	<div class="z-5 pb-20">
		{#if cardPage.url}
			<a href={cardPage.url} target="_blank" class="my-2 flex justify-center">
				<Image
					src={cardPage.img}
					onerror={imgError}
					alt="Card Image"
					class="max-h-[75vh] w-fit rounded-lg object-contain shadow-2xl"
				/>
			</a>
		{:else}
			<button onclick={() => photoViewer = true} class="my-2 flex w-full cursor-pointer justify-center bg-transparent">
				<Image
					src={cardPage.img}
					onerror={imgError}
					alt="Card Image"
					class="max-h-[75vh] w-fit rounded-lg object-contain shadow-2xl"
				/>
			</button>
		{/if}
		<div class="p-2 ">
			<h2 class="mb-2 text-xl font-bold break-all">{cardPage.title}</h2>
			<a href={cardPage.url} target="_blank" class="text-primary-300 flex w-60 truncate text-sm"
				>{cardPage.url}</a
			>
			<p class="w-fit text-md text-pretty break-all">{cardPage.text}</p>
		</div>
	</div>
	<div class="gpu z-0 bg-black">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img
			in:blur={{ delay: 100, duration: 800, easing: expoInOut }}
			src={cardPage.img}
			onerror={imgError}
			alt="Card Image"
			class="fixed inset-0 z-0 h-full w-full object-cover opacity-35 blur-xl"
			loading="lazy"
			decoding="async"
		/>
	</div>
</div>

<!-- Fullscreen Photo Viewer -->
{#if photoViewer}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
		onclick={closeViewer}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
	>
		<button
			onclick={closeViewer}
			class="fixed top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:text-white"
		>
			<X class="size-6" />
		</button>
		<img
			src={cardPage.img}
			onerror={imgError}
			alt="Fullscreen photo"
			class="max-h-screen max-w-screen cursor-default object-contain p-4"
			onclick={(e) => e.stopPropagation()}
			loading="lazy"
			decoding="async"
		/>
	</div>
{/if}

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
