<script lang="ts">
	import { page } from '$app/state';
import { cardPage, haptic, localItems, localSpaces, restoreCardPage, scrollableVignette } from '$lib/shared.svelte';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Pin, X } from 'lucide-svelte';
	import { blur, fade, slide } from 'svelte/transition';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Image } from '@unpic/svelte';
	import { expoInOut } from 'svelte/easing';
	import toast from 'svelte-french-toast';

	let images = $derived(
		cardPage.images.length > 0 ? cardPage.images : (cardPage.img ? [cardPage.img] : [NoImageUrl])
	);

	let currentIndex = $state(0);
	let touchStartX = $state(0);
	let touchEndX = $state(0);

	onMount(() => {
		try {
			restoreCardPage();
			const item = localItems.current.find((i: any) => i.title === cardPage.title);
			if (item) cardPage.pinned = item.pinned;
			if (cardPage.space) {
				const space = localSpaces.current.find((s: any) => s.name === cardPage.space);
				const spaceItem = space?.items.find((i: any) => i.title === cardPage.title);
				if (spaceItem) cardPage.pinnedInSpace = spaceItem.pinnedInSpace;
			}
			requestAnimationFrame(checkTitleOverflow);
		} catch (err) {
			console.error('Failed to restore card page:', err);
		}
	});

	const imgError = (e: any) => (e.target.src = NoImageUrl);

	let titleOverflows = $state(false);
	let titleEl: HTMLElement | undefined = $state();
	let titleOffset = $state(0);
	let marqueeRunning = $state(false);

	function checkTitleOverflow() {
		if (titleEl) {
			titleOverflows = titleEl.scrollWidth > titleEl.clientWidth;
			titleOffset = titleEl.scrollWidth - titleEl.clientWidth;
		}
	}

	function marquee(node: HTMLElement) {
		let anim: Animation | undefined;

		function start() {
			if (titleOffset <= 0) return;
			anim = node.animate(
				[
					{ transform: 'translateX(0)' },
					{ transform: `translateX(-${titleOffset}px)` }
				],
				{ duration: Math.max(2000, titleOffset * 15), iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }
			);
			marqueeRunning = true;
		}

		function stop() {
			if (anim) { anim.cancel(); anim = undefined; }
			marqueeRunning = false;
			node.style.transform = '';
		}

		if (titleOverflows) start();

		return {
			update(overflow: boolean) {
				stop();
				if (overflow) start();
			},
			destroy() { stop(); }
		};
	}

	let photoViewer = $state(false);
	let viewerIndex = $state(0);
	let pinMenuOpen = $state(false);

	function closeViewer() {
		photoViewer = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeViewer();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	function toggleCardPin(target: 'home' | 'space') {
		haptic('light');
		try {
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
		} catch (err) {
			console.error('Failed to toggle card pin:', err);
		}
		pinMenuOpen = false;
	}

	function prev() {
		currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
	}

	function next() {
		currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		const diff = touchStartX - touchEndX;
		if (Math.abs(diff) > 50) {
			if (diff > 0) next();
			else prev();
		}
	}


</script>

	<div in:blur class="transform-gpu justify-top z-10 flex flex-col items-start overflow-x-hidden">
	<div class="z-5 w-1vh pb-20">
		<div
			class="relative my-2 flex w-full touch-pan-y justify-center"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			{#if images.length > 1}
		<button
				onclick={() => { haptic('light'); prev(); }}
				class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
			>
				<ChevronLeft class="size-5" />
			</button>
			<button
				onclick={() => { haptic('light'); next(); }}
				class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
			>
				<ChevronRight class="size-5" />
			</button>
			{/if}
			{#if cardPage.url}
				<a href={cardPage.url} target="_blank" class="flex justify-center">
					<Image
						src={images[currentIndex]}
						onerror={imgError}
						alt="Card Image"
						class="max-h-[65vh] w-fit rounded-lg object-contain shadow-2xl"
					/>
				</a>
			{:else}
				<button onclick={() => { haptic('light'); photoViewer = true; viewerIndex = currentIndex; }} class="flex w-full cursor-pointer justify-center bg-transparent">
					<Image
						src={images[currentIndex]}
						onerror={imgError}
						alt="Card Image"
						class="max-h-[65vh] w-fit rounded-lg object-contain shadow-2xl"
					/>
				</button>
			{/if}
		</div>
		{#if images.length > 1}
			<div class="mb-2 flex items-center justify-center gap-1.5">
				{#each images as _, i}
					<button
						onclick={() => { haptic('light'); currentIndex = i; }}
						class="max-h-[65vh] size-2 rounded-full transition-all duration-200 {i === currentIndex ? 'bg-primary-400 w-4' : 'bg-white/30 hover:bg-white/50'}"
					></button>
				{/each}
			</div>
		{/if}
		<div class="p-2">
			<div class="mb-2 flex items-center justify-between gap-2">
				<div use:scrollableVignette={'horizontal'} class="overflow-hidden min-w-0 max-w-[65vw]">
					<h2
						bind:this={titleEl}
						use:marquee={titleOverflows}
						class="text-xl font-bold {titleOverflows ? 'whitespace-nowrap' : 'truncate'}"
					>{cardPage.title}</h2>
				</div>
				<div class="relative shrink-0">
					<button
						onclick={() => { if (cardPage.space) pinMenuOpen = !pinMenuOpen; else toggleCardPin('home'); }}
						class="flex items-center justify-center rounded-xl p-2 transition-colors duration-200 hover:bg-white/10 {cardPage.pinned || cardPage.pinnedInSpace ? 'text-tertiary-300 bg-tertiary-500/20' : 'text-white/50 bg-black/20'}"
					>
						<span class="flex gap-1">
							<Pin class="size-4.5" />
							<p class="text-xs {cardPage.pinned || cardPage.pinnedInSpace ? '' : 'hidden'}">Pinned</p>
						</span>
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
								class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors hover:bg-white/10 {cardPage.pinned ? 'text-tertiary-300' : 'text-white/60'}"
							>
								{#if cardPage.pinned}<Check class="size-3.5" />{:else}<span class="size-3.5"></span>{/if}
								Pin to Home
							</button>
							<button
								onclick={() => toggleCardPin('space')}
								class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors hover:bg-white/10 {cardPage.pinnedInSpace ? 'text-tertiary-300' : 'text-white/60'}"
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
			<p use:scrollableVignette={'vertical'} class="mt-2 text-md text-pretty max-w-[90vw] max-h-[21vh] flex gap-1 overflow-auto">{cardPage.text}</p>
		</div>
	</div>
	<div class="transform-gpu z-0 bg-black">
		<img
			in:blur={{ delay: 100, duration: 800, easing: expoInOut }}
			src={images[currentIndex]}
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
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95"
		onclick={closeViewer}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
	>
		<button
			onclick={() => { haptic('light'); closeViewer(); }}
			class="fixed top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:text-white"
		>
			<X class="size-6" />
		</button>
		<div
			class="flex w-full flex-1 items-center justify-center touch-pan-y"
			ontouchstart={(e) => { touchStartX = e.changedTouches[0].screenX; }}
			ontouchend={(e) => {
				touchEndX = e.changedTouches[0].screenX;
				const diff = touchStartX - touchEndX;
				if (Math.abs(diff) > 50) {
					if (diff > 0) viewerIndex = viewerIndex < images.length - 1 ? viewerIndex + 1 : 0;
					else viewerIndex = viewerIndex > 0 ? viewerIndex - 1 : images.length - 1;
				}
			}}
		>
			{#if images.length > 1}
				<button
					onclick={(e) => { haptic('light'); e.stopPropagation(); viewerIndex = viewerIndex > 0 ? viewerIndex - 1 : images.length - 1; }}
					class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
				>
					<ChevronLeft class="size-6" />
				</button>
				<button
					onclick={(e) => { haptic('light'); e.stopPropagation(); viewerIndex = viewerIndex < images.length - 1 ? viewerIndex + 1 : 0; }}
					class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
				>
					<ChevronRight class="size-6" />
				</button>
			{/if}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<img
				src={images[viewerIndex]}
				onerror={imgError}
				alt="Fullscreen photo"
				class="max-h-[70vh] max-w-screen cursor-default object-contain p-4"
				onclick={(e) => e.stopPropagation()}
				loading="lazy"
				decoding="async"
			/>
		</div>
		{#if images.length > 1}
			<div
				class="flex w-full justify-center gap-2 overflow-x-auto px-4 pb-6 pt-2"
				onclick={(e) => e.stopPropagation()}
			>
				{#each images as img, i}
					<button
						onclick={() => { haptic('light'); viewerIndex = i; }}
						class="shrink-0 transition-all duration-200 {i === viewerIndex ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-black scale-110' : 'opacity-50 hover:opacity-80'}"
					>
						<img
							src={img}
							alt="thumb {i + 1}"
							class="size-14 rounded-lg object-cover"
							onerror={imgError}
							loading="lazy"
							decoding="async"
						/>
					</button>
				{/each}
			</div>
		{/if}
		<div class="pb-3 text-sm text-white/60" onclick={(e) => e.stopPropagation()}>
			{viewerIndex + 1} / {images.length}
		</div>
	</div>
{/if}

<!-- Back Button -->
<button
	in:slide|global={{delay:400}}
	onclick={() => {
		haptic('light');
		history.back();
	}}
	class="bg-surface-950/60 fixed bottom-0 left-1/2 z-9 w-[90vw] -translate-x-1/2 rounded-t-2xl backdrop-blur-xs"
>
	<span class="btn py-3">
		<ArrowLeft />
		Go Back
	</span>
</button>


