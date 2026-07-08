<script lang="ts">
	import { page } from '$app/state';
import { cardPage, localItems, localSpaces, restoreCardPage } from '$lib/shared.svelte';
import { ArrowLeft, Check, Pin, X } from 'lucide-svelte';
	import { blur, fade, slide } from 'svelte/transition';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { onMount } from 'svelte';
	import { Image } from '@unpic/svelte';
	import { expoInOut } from 'svelte/easing';

	onMount(() => {
		restoreCardPage();
		const item = localItems.current.find((i: any) => i.title === cardPage.title);
		if (item) cardPage.pinned = item.pinned;
		if (cardPage.space) {
			const space = localSpaces.current.find((s: any) => s.name === cardPage.space);
			const spaceItem = space?.items.find((i: any) => i.title === cardPage.title);
			if (spaceItem) cardPage.pinnedInSpace = spaceItem.pinnedInSpace;
		}
	});

	const imgError = (e: any) => (e.target.src = NoImageUrl);

	let photoViewer = $state(false);
	let pinMenuOpen = $state(false);

	function closeViewer() {
		photoViewer = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeViewer();
	}

	function toggleCardPin(target: 'home' | 'space') {
		const item = localItems.current.find((i: any) => i.title === cardPage.title);
		if (!item) return;
		if (target === 'home') {
			item.pinned = !item.pinned;
			cardPage.pinned = item.pinned;
		} else if (target === 'space' && cardPage.space) {
			const space = localSpaces.current.find((s: any) => s.name === cardPage.space);
			if (space) {
				const spaceItem = space.items.find((i: any) => i.title === cardPage.title);
				if (spaceItem) {
					spaceItem.pinnedInSpace = !spaceItem.pinnedInSpace;
					cardPage.pinnedInSpace = spaceItem.pinnedInSpace;
				}
			}
		}
		pinMenuOpen = false;
	}
</script>

	<div in:blur class="transform-gpu justify-top z-10 flex h-screen flex-col items-start overflow-x-hidden">
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
			<div class="mb-2 flex items-center justify-between">
				<h2 class="text-xl font-bold break-all">{cardPage.title}</h2>
				<div class="relative shrink-0">
					<button
						onclick={() => { if (cardPage.space) pinMenuOpen = !pinMenuOpen; else toggleCardPin('home'); }}
						class="flex items-center justify-center rounded-xl p-2 transition-colors duration-200 hover:bg-white/10 {cardPage.pinned || cardPage.pinnedInSpace ? 'text-yellow-300' : 'text-white/60'}"
					>
						<Pin class="size-5" />
					</button>
					{#if pinMenuOpen}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							onclick={() => pinMenuOpen = false}
							class="fixed inset-0 z-30"
						></div>
						<div
							transition:slide={{ duration: 120 }}
							class="absolute right-0 z-40 mt-1 min-w-40 rounded-xl bg-black/90 p-1 shadow-xl border border-white/10"
						>
							<button
								onclick={() => toggleCardPin('home')}
								class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors hover:bg-white/10 {cardPage.pinned ? 'text-yellow-300' : 'text-white/80'}"
							>
								{#if cardPage.pinned}<Check class="size-3.5" />{:else}<span class="size-3.5"></span>{/if}
								Pin to Home
							</button>
							<button
								onclick={() => toggleCardPin('space')}
								class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors hover:bg-white/10 {cardPage.pinnedInSpace ? 'text-yellow-300' : 'text-white/80'}"
							>
								{#if cardPage.pinnedInSpace}<Check class="size-3.5" />{:else}<span class="size-3.5"></span>{/if}
								Pin to {cardPage.space}
							</button>
						</div>
					{/if}
				</div>
			</div>
			<a href={cardPage.url} target="_blank" class="text-primary-300 flex w-60 truncate text-sm"
				>{cardPage.url}</a
			>
			<p class="mt-2 w-fit text-md text-pretty break-all">{cardPage.text}</p>
		</div>
	</div>
	<div class="transform-gpu z-0 bg-black">
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
