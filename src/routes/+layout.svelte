<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { AppBar, Avatar, FileUpload, Navigation } from '@skeletonlabs/skeleton-svelte';
	import type { FileUploadApi } from '@skeletonlabs/skeleton-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import BlobImg from '$lib/assets/blob-scene.svg';
	import appIcon from '$lib/assets/launch-icon.webp';
	// Icons
	import { page } from '$app/state';
	import {
		ArrowLeft,
		Bolt,
		CircleDashed,
		File as FileIcon,
		Home,
		ImagePlus,
		LayoutGrid,
		Plus,
		StretchHorizontal,
		X,
		XCircle,
		Link,
		Info,
		MoreVertical,
		Trash,
		CircleMinus,
		ChevronUp,
		ChevronDown,
		Github,
		Link2,
		User,
		CircleUser,
		SquareStack,
		Check,
		Clipboard,
		ChevronUpCircle,
		CircleX,
		Trash2,
		ChevronLeft,
		Pin,
		PinOff
	} from 'lucide-svelte';
	import { blur, fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
import {
	home,
	localItems,
	sharedItem,
	space,
	localSpaces,
	cardPage,
	first,
	spaceview,
	data_theme,
	shareTarget,
	confirmState,
	sheetState,
	undoState,
	performUndo,
	truncate,
	setUndo,
	setUndoRemove,
	spaceSelect,
	onboardingView,
	haptic
} from '../lib/shared.svelte';

	const motionOk =
		typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// State
	let imageFile: any = $state();
	let uploadApi: FileUploadApi | undefined = $state();
	const fileLookup = new Map<string, File>();
	let navbarExpanded = $state(false);
	let isSubmitting = $state(false);
	let descFocused = $state(false);
	let touchStartY = $state(0);
	onMount(() => {
		try {
			if (page.route.id === '/') {
				goto('/tabs/home');
			} else if (page.route.id === '/tabs/home') {
				home.pageTitle = 'Home';
				goto('/tabs/home');
			} else if (page.route.id === '/tabs/space') {
				home.pageTitle = 'Space';
				goto('/tabs/space');
			}
		} catch (err) {
			console.error('Navigation error:', err);
		}
	});
	$effect(() => {
		document.documentElement.setAttribute('data-theme', data_theme.current.value);
		refreshGrainientColors();
		if (page.route.id == '/tabs/space') {
			spaceSelect.selectMode = false;
			spaceSelect.selectedNames = [];
		}
		if (page.route.id !== '/tabs/home' && page.route.id !== '/tabs/home/saved' && page.route.id !== '/tabs/space/spaceview') {
			home.selectMode = false;
			home.reorderMode = false;
			home.selectedTitles = [];
		}
		if (page.route.id !== '/tabs/space/spaceview') {
			spaceview.reorderMode = false;
		}
	});

	$effect(() => {
		if (shareTarget.current) {
			try {
				let targetUrl = shareTarget.current.url;
				if (!targetUrl && shareTarget.current.text) {
					const match = shareTarget.current.text.match(/https?:\/\/[^\s]+/);
					if (match) targetUrl = match[0];
				}
				if (targetUrl) {
					if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
						targetUrl = 'https://' + targetUrl;
					}
					url = targetUrl;
					handleSubmit();
				}
				if (shareTarget.current.title && !shareTarget.current.title.startsWith('http')) {
					sharedItem.title = shareTarget.current.title;
				}
				navbarExpanded = true;
			} catch (err) {
				console.error('Share target error:', err);
			}
			shareTarget.current = null;
		}
	});

	function generatePreview(event: any) {
		try {
			const files = event.acceptedFiles;
			if (!files?.length) return;
			for (const file of files) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const image = e.target?.result as string;
					if (image && !sharedItem.images.includes(image)) {
						sharedItem.images = [...sharedItem.images, image];
						fileLookup.set(image, file);
					}
				};
				reader.readAsDataURL(file);
			}
			if (files[0]) sharedItem.img = '';
		} catch (err) {
			console.error('Failed to generate preview:', err);
		}
	}

	function removeImage(index: number) {
		const image = sharedItem.images[index];
		const file = fileLookup.get(image);
		if (file) {
			uploadApi?.deleteFile(file);
			fileLookup.delete(image);
		}
		sharedItem.images = sharedItem.images.filter((_: any, i: number) => i !== index);
		if (sharedItem.images.length === 0) sharedItem.img = noImageUrl;
	}

	// OpenGraph imports and functions
	import { fetchOgData } from '$lib/actions/fetchOgData';
	import type { OpenGraphData } from '$lib/types';

	let url = $state('');
	let loading = $state(false);
	let error: string | null = $state(null);
	let ogData: OpenGraphData | null = $state(null);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	import noImageUrl from '$lib/assets/no-image.png';
	function debouncedHandleSubmit() {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => handleSubmit(), 400);
	}

	async function handleSubmit(e?: Event) {
		e?.preventDefault();
		if (!url) {
			error = 'Please enter a URL';
			return;
		}

		loading = true;
		error = null;
		ogData = null;

		try {
			ogData = await fetchOgData(url);
			if (ogData.image === '') {
				sharedItem.img = noImageUrl;
			} else {
				// console.log(imageToBase64(ogData.image))
				sharedItem.img = ogData.image;
			}
			sharedItem.title = ogData.title;
			sharedItem.text = ogData.description;
			sharedItem.link = ogData.siteName;
			sharedItem.url = url;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	// Image to Base64 imports and Functions
	import { browser } from '$app/environment';
	import ColorGroup from '$lib/components/ColorGroup.svelte';
	import Grainient from '$lib/components/Grainient.svelte';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const themeColors: Record<string, { p: string; s: string; t: string }> = {
		mona:    { p: '#824fe1', s: '#2fa44f', t: '#6ad6d0' },
		nosh:    { p: '#dc0024', s: '#f5d2d2', t: '#3c5748' },
		vox:     { p: '#fbb48a', s: '#d0f96f', t: '#c8adff' },
		modern:  { p: '#eb4999', s: '#00b7d6', t: '#21b7a6' },
		vintage: { p: '#ea861d', s: '#98cea5', t: '#00b7d6' },
		mint:    { p: '#66e985', s: '#7262f4', t: '#5d4f5f' },
		crimson: { p: '#d21d3d', s: '#4785ae', t: '#bfb6b5' },
		wintry:  { p: '#3a82f7', s: '#01a5ea', t: '#8281fd' },
		pine:    { p: '#a0814d', s: '#57123c', t: '#878678' },
		none:    { p: '#000000', s: '#808080', t: '#ffffff' },
	};
	const defaultColors = { c1: '#824fe1', c2: '#2fa44f', c3: '#6ad6d0' };
	let grainientColors = $state(defaultColors);
	function refreshGrainientColors() {
		const theme = data_theme.current.value;
		const colors = themeColors[theme];
		if (colors) {
			grainientColors.c1 = colors.p;
			grainientColors.c2 = colors.s;
			grainientColors.c3 = colors.t;
		}
	}

	//Chips
	let chipsSelect = $state(false);
	let chipName = $state('');

	function normalizeUrl(u: string): string {
		return u.trim().toLowerCase().replace(/\/+$/, '');
	}

	function isDuplicateItem(item: any, urlToCheck: string, titleToCheck: string): boolean {
		if (urlToCheck && item.url) {
			if (normalizeUrl(item.url) === normalizeUrl(urlToCheck)) return true;
		}
		if (titleToCheck && item.title) {
			if (item.title.trim().toLowerCase() === titleToCheck.trim().toLowerCase()) return true;
		}
		return false;
	}

	function addItemToSpace(item: any) {
		try {
			localSpaces.current.forEach((spc: any) => {
				if (spc.name === chipName) {
					const exists = spc.items.some((i: any) => i.title === item.title);
					if (!exists) spc.items.push(item);
				}
			});
		} catch (err) {
			console.error('Failed to add item to space:', err);
		}
	}

	function closeExpanded() {
		isSubmitting = false;
		navbarExpanded = false;
		space.clr = 'purple';
		space.name = space.desc = '';
		chipName = '';
		sharedItem.img = sharedItem.link = sharedItem.text = sharedItem.title = sharedItem.url = '';
		sharedItem.pinned = false;
		sharedItem.images = [];
		url = '';
	}
	function handleTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
	}
	function handleTouchEnd(e: TouchEvent) {
		const dy = e.changedTouches[0].clientY - touchStartY;
		const target = e.currentTarget as HTMLElement;
		if (dy > 50 && target.scrollTop === 0) closeExpanded();
	}

</script>

<div class="relative flex justify-center w-screen">
	<div class="pointer-events-none fixed inset-0 z-0 h-svh w-full opacity-60">
		<Grainient
			color1={grainientColors.c1}
			color2={grainientColors.c2}
			color3={grainientColors.c3}
			grainAmount={0.08}
			contrast={1.1}
			saturation={1}
		/>
	</div>
	<div class="relative z-1 grid h-svh w-full lg:max-w-[1svh] grid-rows-[auto_1fr_auto] select-none">
	<!-- Header -->
	<header in:slide class="transform-gpu sticky top-0 z-11">
		<!-- <AppBarC title={value} {homeLayout}></AppBarC> -->
		{#if !page.error && (!first.current || localItems.current.length > 0 || localSpaces.current.length > 0)}
			{@render Appbar(home.pageTitle, null)}
		{/if}
	</header>
	<!-- Main -->
	<main in:blur class="relative w-full p-3">
		{#if !browser}
			<div
				class="fixed top-[40%] right-0 bottom-[40%] left-0 flex h-fit w-full flex-col items-center justify-center"
			>
				<CircleDashed class="text-primary-800 size-30 animate-spin" />
				<CircleMinus class=" text-primary-800 fixed size-15 animate-ping" />
			</div>
		{:else}
			{@render children()}
			{#if (first.current && localItems.current.length < 1 && localSpaces.current.length < 1) || onboardingView.active}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Welcome to GloveBox"
					in:fade={{ duration: motionOk ? 300 : 100 }}
					out:fade={{ duration: motionOk ? 200 : 80 }}
					class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950"
				>
					<!-- <img
						src={BlobImg}
						class="fixed inset-0 h-full w-full object-cover  "
						alt=""
					/> -->
					<div
						class="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center px-6"
					>
						<img
							src={appIcon}
							in:fly={{ y: motionOk ? 12 : 0, duration: motionOk ? 500 : 100, delay: 0 }}
							alt="GloveBox"
							class="mb-5 size-[20%] bg-primary-500 rounded-3xl"
						/>
						<h1
							in:fly={{ y: motionOk ? 12 : 0, duration: motionOk ? 500 : 100, delay: motionOk ? 60 : 0 }}
							class="h1 mb-1 text-center font-bold tracking-tight"
						>
							GloveBox
						</h1>
						<p
							in:fly={{ y: motionOk ? 8 : 0, duration: motionOk ? 400 : 100, delay: motionOk ? 120 : 0 }}
							class="mb-10 text-center text-sm text-white/50"
						>
							URL organizer &amp; stashing
						</p>
						<div class="flex w-full flex-col gap-3">
							<div
								in:fly={{ y: motionOk ? 16 : 0, duration: motionOk ? 400 : 100, delay: motionOk ? 200 : 0 }}
								class="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-white/10 bg-primary-500/15 px-4 py-2 xs:py-4 transition-colors duration-200 hover:border-white/20 hover:bg-primary-500/15"
							>
								<div
									class="flex size-9 shrink-0 items-center justify-center rounded-lg"
								>
									<Link class="size-6 text-primary-400" />
								</div>
								<div>
									<h3 class="text-sm font-semibold leading-tight">Save &amp; Stash</h3>
									<p class="text-xs leading-snug text-white/45">
										Auto-fetch titles, images &amp; descriptions from any URL
									</p>
								</div>
							</div>
							<div
								in:fly={{ y: motionOk ? 16 : 0, duration: motionOk ? 400 : 100, delay: motionOk ? 280 : 0 }}
								class="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-white/10 bg-secondary-500/15 px-4 py-2 xs:py-4 transition-colors duration-200 hover:border-white/20 hover:bg-secondary-500/35"
							>
								<div
									class="flex size-9 shrink-0 items-center justify-center rounded-lg "
								>
									<LayoutGrid class="size-6 text-secondary-400" />
								</div>
								<div>
									<h3 class="text-sm font-semibold leading-tight">Spaces</h3>
									<p class="text-xs leading-snug text-white/45">
										Organize links & items into themed Collections & Spaces.
									</p>
								</div>
							</div>
							<div
								in:fly={{ y: motionOk ? 16 : 0, duration: motionOk ? 400 : 100, delay: motionOk ? 360 : 0 }}
								class="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-white/10 bg-tertiary-500/15 px-4 py-2 xs:py-4 transition-colors duration-200 hover:border-white/20 hover:bg-tertiary-500/35"
							>
								<div
									class="flex size-9 shrink-0 items-center justify-center rounded-lg "
								>
									<Pin class="size-6 text-tertiary-400" />
								</div>
								<div>
									<h3 class="text-sm font-semibold leading-tight">Pin &amp; Manage</h3>
									<p class="text-xs leading-snug text-white/45">
										Pin favorites, add custom images. Make the most of it
									</p>
								</div>
							</div>
						</div>
						<button
							in:fly={{ y: motionOk ? 8 : 0, duration: motionOk ? 400 : 100, delay: motionOk ? 460 : 0 }}
							type="button"
							onclick={() => {
								first.current = false;
								onboardingView.active = false;
							}}
							class="mt-8 w-full cursor-pointer rounded-xl border border-primary-500/30 bg-primary-500/10 px-6 py-3 text-sm font-bold text-primary-400 transition-colors duration-200 hover:border-primary-500/50 hover:bg-primary-500/15"
						>
							Get Started
						</button>
						<button
							in:fade={{ duration: motionOk ? 300 : 100, delay: motionOk ? 550 : 0 }}
							type="button"
							onclick={() => {
								first.current = false;
								onboardingView.active = false;
							}}
							class="mt-4 cursor-pointer text-xs tracking-wider text-white/30 uppercase transition-colors duration-200 hover:text-white/60"
						>
							Skip
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</main>

	<Toaster
		toastOptions={{
			
			duration: 2000
		}}
	/>

	{#if undoState.pending}
		<div
			in:fly={{ y: 40, duration: 200 }}
			class="transform-gpu fixed bottom-26 left-1/2 z-50 flex w-full max-w-[90%] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl bg-black/60 px-4 py-3 mb-2 shadow-2xl shadow-primary-500/10 backdrop-blur-xl border border-primary-500/20 text-sm"
		>
			<span class="font-semibold text-white drop-shadow-sm">{undoState.message}</span>
			<button
				class="rounded-lg bg-primary-300 px-5 py-2 text-sm font-black text-surface-900 shadow-lg shadow-primary-500/30 transition-all duration-200 hover:bg-primary-400 hover:shadow-primary-400/40 active:scale-95"
				onclick={() => { haptic('medium'); performUndo(); }}
			>
				Undo
			</button>
		</div>
	{/if}
	<!-- Morphing Navbar -->
	{#if (page.route.id === '/tabs/home' || page.route.id === '/tabs/space') && (!first.current || localItems.current.length > 0 || localSpaces.current.length > 0) && !(page.route.id === '/tabs/home' && home.selectMode)}
		{#if navbarExpanded}
		<div
			transition:blur={{ duration: 200 }}
			class="transform-gpu fixed inset-0 z-11 bg-black/40 backdrop-blur-sm"
			onclick={() => { haptic('light'); closeExpanded(); }}
		></div>
		{/if}
		<div transition:slide|global class="transform-gpu fixed transition-all duration-700 {navbarExpanded ? 'bottom-0' : 'bottom-5 px-4'} z-11 w-full " class:opacity-0={page.route.id === '/tabs/space' && spaceSelect.selectMode} class:pointer-events-none={page.route.id === '/tabs/space' && spaceSelect.selectMode}>
			<div
				class="{navbarExpanded ? 'rounded-t-2xl' : 'rounded-[42px]'} border-2 backdrop-blur-xl overflow-hidden transition-all duration-500 ease-out {navbarExpanded ? 'border-b-1 border-primary-500/50 bg-black/60' : 'border-primary-500/30 bg-black/50'}"
			>
				<div class="h-20 relative overflow-hidden">
					<div
						class="absolute inset-0 transition-all duration-300 ease-out"
						class:opacity-0={navbarExpanded}
						class:opacity-100={!navbarExpanded}
						style={navbarExpanded ? 'pointer-events: none;' : ''}
					>
						<Navigation.Bar
							classes="bg-transparent"
							value={page.route.id.startsWith('/tabs/home') ? 'Home' : 'Space'}
							onValueChange={(newValue) => {
								home.pageTitle = newValue;
							}}
						>
							<Navigation.Tile
								active=" bg-primary-500/50 text-primary-200 transition-all duration-200"
								rounded="rounded-full rounded-r-none"
								href="/tabs/home/"
								id="Home"
								label="Home"><Home /></Navigation.Tile
							>

							<div class="">
								<button
									type="button"
									class="btn-icon bg-primary-400 z-20 h-14 flex rounded-none px-10 "
								onclick={() => {
									haptic('light');
									url = sharedItem.img = sharedItem.link = sharedItem.text = sharedItem.title = sharedItem.url = '';
									sharedItem.pinned = false;
									chipName = '';
									navbarExpanded = true;
								}}
								>
									<Plus class="text-black" />
								</button>
							</div>

							<Navigation.Tile
								active=" bg-primary-500/50 text-primary-200 transition-all duration-200"
								rounded="rounded-full rounded-l-none"
								href="/tabs/space/"
								id="Space"
								label="Space"><CircleDashed /></Navigation.Tile
							>
						</Navigation.Bar>
					</div>
					<div
						class="absolute inset-0 flex items-center gap-3 px-4 transition-all duration-300 ease-out"
						class:opacity-0={!navbarExpanded}
						class:opacity-100={navbarExpanded}
						style={!navbarExpanded ? 'pointer-events: none;' : ''}
					>
						<a
							href="/tabs/home/"
							class="flex-1 rounded-lg py-2 text-center text-sm font-bold transition-colors duration-200 {page.route.id.startsWith('/tabs/home') ? 'bg-primary-800/50 text-primary-200' : 'text-white/70 hover:text-white'}"
						>Home</a>
						<a
							href="/tabs/space/"
							class="flex-1 rounded-lg py-2 text-center text-sm font-bold transition-colors duration-200 {page.route.id.startsWith('/tabs/space') ? 'bg-primary-800/50 text-primary-200' : 'text-white/70 hover:text-white'}"
						>Space</a>
					</div>
				</div>
				{#if navbarExpanded}
					<div transition:slide={{ duration: 500 }} ontouchstart={handleTouchStart} ontouchend={handleTouchEnd} class="max-h-[calc(100dvh-7rem)] overflow-y-auto">
						{@render PopUpCard()}
					</div>
				{/if}
			</div>
		</div>
	{/if}
	{#if confirmState.open}
		<div
			transition:fade={{duration:200}}
			class="transform-gpu fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md"
		>
			{@render ConfirmDialogue()}
		</div>
	{/if}
	<BottomSheet />
</div>
</div>

{#snippet Appbar(title: string, children: any)}
	<div transition:slide|global class="transform-gpu">
		<AppBar classes="bg-surface-950/60 rounded-b-[35px] gpu-layer backdrop-blur-xl text-primary-50">
			<!-- {#snippet headline()} -->
				<div class="  rounded-full absolute top-8 left-1/2 -translate-1/2 -z-1">
					{#if page.route.id === '/settings'}
					<center>
						<h1 in:fade class="h2 font-bold">Settings</h1>
					</center>
					{:else if page.route.id === '/tabs/home/saved'}
					<center>
						<h1 in:fade class="h2 font-bold">Saved</h1>
					</center>
					{:else if page.route.id === '/tabs/home'}
					<center>
						<h1 in:fade class="h2 font-bold">Home</h1>
					</center>
					{:else if page.route.id === '/tabs/space'}
					<center>
						<h1 in:fade class="h2 font-bold">Space</h1>
					</center>
					{:else if page.route.id === '/info'}
					<center>
						<h1 in:fade class="h2 font-bold">Glove Box</h1>
					</center>
			{:else if page.route.id === '/card'}
				<center>
					<h1 in:fade class="h2 w-70 truncate font-bold">{cardPage.link || cardPage.title}</h1>
				</center>
				{:else if page.route.id === '/tabs/space/spaceview'}
				<center>
					<h1 in:fade class="h2 w-70 truncate font-bold text-{spaceview.clr}-200">
						{spaceview.pageTitle}
					</h1>
				</center>
				{/if}
			</div>
			<!-- {/snippet} -->

			{#snippet lead()}
				{#if page.route.id === '/settings' || page.route.id === '/tabs/home/saved' || page.error || page.route.id === '/info' || page.route.id === '/tabs/space/spaceview'}
			<ArrowLeft
					onclick={() => {
						haptic('light');
						history.back();
					}}
					class="size-7"
				/>
				{:else if page.route.id === '/card'}
					{#if !sheetState.open}
						<ArrowLeft
							onclick={() => {
								history.back();
							}}
							class="size-7"
						/>
					{/if}
				{:else if page.route.id === '/tabs/home'}
					<a href="/settings">
						<Bolt class="size-7" />
					</a>
				{:else if page.route.id === '/tabs/space'}
					<a href="/settings" class="size-7">
						<Bolt class="size-7" />
					</a>
				{/if}
			{/snippet}

			{#snippet trail()}
				{#if children}
					{@render children()}
				{/if}
				{#if page.route.id === '/tabs/home'}
					<SquareStack
						class="size-7 {home.selectMode ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}"
						onclick={() => {
							haptic('light');
							home.selectMode = !home.selectMode;
						if (!home.selectMode) { home.selectedTitles = []; home.reorderMode = false; spaceview.reorderMode = false; }
						}}
					/>
				{:else if page.route.id === '/tabs/space'}
			{#if !spaceSelect.expandAll}
				<ChevronDown
					onclick={() => { haptic('light'); spaceSelect.expandAll = true; }}
					class="size-7"
				/>
			{:else}
				<ChevronUp
					onclick={() => { haptic('light'); spaceSelect.expandAll = false; }}
					class="size-7"
				/>
				{/if}
					{#if localSpaces.current.length > 0}
						<SquareStack
							class="size-7 {spaceSelect.selectMode ? 'text-primary-400 drop-shadow-[0_0_8px rgba(168,85,247,0.6)]' : ''}"
							onclick={() => {
								haptic('light');
								spaceSelect.selectMode = !spaceSelect.selectMode;
								if (!spaceSelect.selectMode) spaceSelect.selectedNames = [];
							}}
						/>
					{/if}
				{:else if page.route.id === '/settings'}
					<a href="/info">
						<Info class="size-7" />
					</a>
				{:else if page.route.id === '/info'}
					<a href="/info">
						<CircleUser
							class="size-7"
							onclick={() => {
								window.open('https://mysf.pages.dev', '_blank');
							}}
						/>
					</a>
				{:else if page.route.id === '/card'}
					<MoreVertical
						class="size-7"
						onclick={() => {
							sheetState.open = true;
							sheetState.data = cardPage;
							sheetState.spacePicker = false;
						}}
					/>
				{/if}
			{#if page.route.id === '/tabs/home/saved'}
				<SquareStack
					class="size-7 {home.selectMode ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}"
					onclick={() => {
						haptic('light');
						home.selectMode = !home.selectMode;
						if (!home.selectMode) { home.selectedTitles = []; home.reorderMode = false; }
					}}
					/>
				{#if home.savedLayout}
					<StretchHorizontal
						onclick={() => {
							haptic('light');
							home.savedLayout = !home.savedLayout;
						}}
						class="size-7"
					/>
				{:else}
					<LayoutGrid
						onclick={() => {
							haptic('light');
							home.savedLayout = !home.savedLayout;
						}}
						class="size-7"
					/>
					{/if}
			{:else if page.route.id === '/tabs/space/spaceview'}
				<SquareStack
					class="size-7 {home.selectMode ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] z-10' : ''}"
					onclick={() => {
						haptic('light');
						home.selectMode = !home.selectMode;
						if (!home.selectMode) { home.selectedTitles = []; home.reorderMode = false; spaceview.reorderMode = false; }
					}}
					/>
				<!-- <Trash
					onclick={() => {
						haptic('medium');
						confirmState.open = true;
							confirmState.title = 'Delete Space?';
							confirmState.message = spaceview.pageTitle + ' will be permanently deleted';
							confirmState.confirmText = 'Delete';
							confirmState.onConfirm = () => {
								try {
									localSpaces.current.forEach((spc: any) => {
										if (spc.name === spaceview.pageTitle) {
											let tempArr = localSpaces.current.filter(
												(item: any) => item.name !== spaceview.pageTitle
											);
											localSpaces.current = tempArr;
										}
									});
									toast.success('Space Deleted', { duration: 2000 });
									history.back();
								} catch (err) {
									console.error('Failed to delete space:', err);
									toast.error('Failed to delete space', { duration: 2000 });
								}
							};
						}}
						class="size-7"
					/> -->
				{#if !home.spaceviewLayout}
					<LayoutGrid
						onclick={() => {
							haptic('light');
							home.spaceviewLayout = !home.spaceviewLayout;
						}}
						class="size-7"
					/>
				{:else}
					<StretchHorizontal
						onclick={() => {
							haptic('light');
							home.spaceviewLayout = !home.spaceviewLayout;
						}}
						class="size-7"
					/>
					{/if}
				{/if}
			{/snippet}
		</AppBar>
	</div>
{/snippet}

{#snippet PopUpCard()}
	{#if page.route.id === '/tabs/home'}
		<div class="px-3 pb-4">
			<hr class="hr" />
			<form onsubmit={(e) => e.preventDefault()} class="space-y-4 pt-2">
				<div>
					<label for="item-title" class="block pb-0.5 text-sm font-medium text-surface-300"
						>Title</label
					>
					<div class="input-group grid-cols-auto relative">
						<input
							id="item-title"
							form="input[]"
							class="ig-input bg-primary-500/20 overflow-x-auto focus:ring-2 focus:ring-primary-400"
							bind:value={sharedItem.title}
							type="text"
							required
							placeholder="e.g. My Awesome Link"
						/>
							{#if sharedItem.title.length > 0}
							<X
								onclick={() => {
									haptic('light');
									sharedItem.title = '';
								}}
								class="absolute right-0 m-2 size-5 cursor-pointer text-surface-400 hover:text-surface-200"
							/>
						{/if}
					</div>
				</div>

				<div>
					<label for="item-desc" class="block pb-0.5 text-sm font-medium text-surface-300"
						>Description</label
					>
					<div class="relative">
					{#if sharedItem.text.length > 0}
						<X
							onclick={() => {
								haptic('light');
								sharedItem.text = '';
							}}
								class="absolute right-2 top-2 z-10 size-5 cursor-pointer text-surface-400 hover:text-surface-200"
							/>
						{/if}
						<textarea
							id="item-desc"
							class="input-group bg-primary-500/20 ig-input w-full overflow-y-auto focus:ring-2 focus:ring-primary-400 transition-[height] duration-300 ease-in-out"
							style="height: {descFocused ? '120px' : '36px'}"
							placeholder="Describe this item..."
							bind:value={sharedItem.text}
							onfocus={() => descFocused = true}
							onblur={() => descFocused = false}
						></textarea>
					</div>
				</div>
				{#if sharedItem.img && sharedItem.img !== noImageUrl && sharedItem.images.length === 0}
					<div>
						<label class="block pb-0.5 text-sm font-medium text-surface-300">Image</label>
						<div class="relative">
							<img
								src={sharedItem.img}
								alt="Fetched preview"
								class="w-full max-h-64 rounded-lg object-contain"
							/>
							<button
								type="button"
								onclick={() => { haptic('light'); sharedItem.img = noImageUrl; }}
								class="absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
							>
								<X class="size-3.5" />
							</button>
							<p class="text-xs text-surface-400 mt-1">Fetched from web</p>
						</div>
					</div>
				{:else}
					{#if !descFocused}
						<div transition:slide={{ duration: 250, easing: quintOut }}>
							{@render Fileupload()}
						</div>
					{/if}
				{/if}

				<div>
					<label for="item-url" class="block pb-0.5 text-sm font-medium text-surface-300"
						>URL</label
					>
					<div
						class="input-group bg-primary-500/20 relative grid-cols-[auto_1fr] focus-within:ring-2 focus-within:ring-primary-400"
					>
						<div class="ig-cell preset-tonal w-fit">
							<Link
								class="h-4 w-4"
								onclick={() => {
									url = 'https://';
								}}
							/>
						</div>
						<input
							id="item-url"
							class="ig-input"
							bind:value={url}
							oninput={debouncedHandleSubmit}
							type="url"
							placeholder="https://www.example.com"
						/>
						{#if url.length > 0}
							<X
								onclick={() => {
									haptic('light');
									url = '';
								}}
								class="absolute right-0 m-2 size-5 cursor-pointer text-surface-400 hover:text-surface-200"
							/>
						{:else}
							<Clipboard
								onclick={() => {
									haptic('light');
									navigator.clipboard
										.readText()
										.then((text) => {
											url = text;
											debouncedHandleSubmit();
										})
										.catch((err) => {
											console.error('Failed to read clipboard: ', err);
										});
								}}
								class="absolute right-0 m-2 size-5 cursor-pointer text-primary-300 hover:text-primary-200"
							/>
						{/if}
					</div>
				</div>
				<hr class="hr" />
				{#if localSpaces.current.length > 0}
					<div class="flex flex-row gap-1">
						<p class="text-sm">Assign a Space</p>
						<p class="text-error-300 text-sm font-light">( + will discard data entered )</p>
					</div>
					<div class="flex gap-2 overflow-auto pb-2">
						{#each localSpaces.current as obj}
						{#if obj.name === chipName}
							<button
								onclick={() => {
									haptic('light');
									chipName = '';
								}}
									type="button"
									class="badge bg-{obj.clr}-400/30 text-{obj.clr}-400 rounded-full"
									>{obj.name}</button
								>
						{:else}
							<button
								onclick={() => {
									haptic('light');
									chipName = obj.name;
								}}
									type="button"
									class="badge preset-outlined rounded-full">{obj.name}</button
								>
							{/if}
						{/each}
						<button
							onclick={() => {
								haptic('light');
								goto('/tabs/space');
								home.pageTitle = 'Space';
							}}
							type="button"
							class="text-primary-300 text-xl">+</button
						>
					</div>
				{/if}
				<article>
					<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() => { haptic('light'); sharedItem.pinned = !sharedItem.pinned; }}
						class="flex items-center justify-center rounded-xl p-3 transition-colors {sharedItem.pinned ? 'bg-tertiary-500/20 text-tertiary-400' : 'bg-white/5 text-white/30 hover:text-white/70'}"
						title={sharedItem.pinned ? 'Pinned' : 'Pin to top'}
					>
						{#if sharedItem.pinned}
						<Pin class="size-7" />
						{:else}
						<PinOff class="size-7" />
						{/if}
					</button>
						<button
							type="submit"
							disabled={loading ||
								(url === '' && (sharedItem.title === '' || sharedItem.text === ''))}
							class="btn flex-1 {loading ||
							(url === '' && (sharedItem.title === '' || sharedItem.text === ''))
								? 'opacity-50'
								: 'opacity-100'} preset-filled rounded-xl p-3 font-medium"
					onclick={() => {
						haptic('medium');
						if (isSubmitting) return;
							if (url !== '' && ogData) {
								isSubmitting = true;
								try {
									if (localItems.current.some((i: any) => isDuplicateItem(i, url, sharedItem.title))) {
										toast.error('Item with this URL or title already exists', { duration: 1500 });
										isSubmitting = false;
										return;
									}
									const img = ogData.image === '' ? noImageUrl : ogData.image;
									const newItem = {
										title: sharedItem.title,
										img,
										images: [img],
										link: ogData.siteName || '',
										text: sharedItem.text,
										date: new Date().toLocaleDateString(),
										url,
										pinned: sharedItem.pinned
									};
									localItems.current.push(newItem);
									addItemToSpace(newItem);
									navbarExpanded = false;
									toast.success('Item Added', { duration: 1500 });
									url = sharedItem.img = sharedItem.link = sharedItem.text = sharedItem.title = sharedItem.url = '';
								sharedItem.images = [];
								fileLookup.clear();
							} catch (err) {
								console.error('Failed to add item:', err);
								toast.error('Failed to add item', { duration: 2000 });
							} finally {
								isSubmitting = false;
							}
						} else if (sharedItem.title !== '' && sharedItem.text !== '') {
								isSubmitting = true;
								try {
									if (localItems.current.some((i: any) => isDuplicateItem(i, url, sharedItem.title))) {
										toast.error('Item with this URL or title already exists', { duration: 1500 });
										isSubmitting = false;
										return;
									}
									const imgs = sharedItem.images.length > 0 ? sharedItem.images : [sharedItem.img || noImageUrl];
									const newItem = {
										title: sharedItem.title,
										img: imgs[0],
										images: imgs,
										link: sharedItem.link,
										text: sharedItem.text,
										date: new Date().toLocaleDateString(),
										url,
										pinned: sharedItem.pinned
									};
									localItems.current.push(newItem);
									addItemToSpace(newItem);
									navbarExpanded = false;
									toast.success('Item Added', { duration: 1500 });
									url = sharedItem.img = sharedItem.link = sharedItem.text = sharedItem.title = sharedItem.url = '';
								sharedItem.images = [];
								fileLookup.clear();
							} catch (err) {
								console.error('Failed to add item:', err);
								toast.error('Failed to add item', { duration: 2000 });
							} finally {
								isSubmitting = false;
							}
						} else if (url !== '') {
								toast.error('Link invalid or "https://" missing', { duration: 2000 });
							} else {
								console.log('Important Fields Empty');
								toast.error('Important fields are missing', { duration: 1500 });
							}
						}}
					>
						{#if loading}
							<CircleDashed class="size-8 animate-spin" />
						{:else}
							Add Item
						{/if}
					</button>
					
				</div>
				</article>
				<button
					type="button"
					class="w-full py-1 text-sm text-white/50 hover:text-white/80 transition-colors"
					onclick={() => { haptic('light'); closeExpanded(); }}>Cancel</button>
			</form>
		</div>
		{:else if page.route.id === '/tabs/space'}
	<div class="px-3 pb-2">
				<hr class="hr" />
			<form onsubmit={(e) => e.preventDefault()} class="space-y-2 pt-2">
					<div>
						<label for="space-name" class="block pb-0.5 text-sm font-medium text-surface-300"
							>Space Name</label
						>
						<div class="input-group grid-cols-auto">
							<input
								id="space-name"
								form="input[]"
								class="ig-input bg-primary-500/20 focus:ring-2 focus:ring-primary-400"
								bind:value={space.name}
								type="text"
								required
								placeholder="e.g. Design Resources"
							/>
						</div>
					</div>
					<div>
						<label for="space-desc" class="block pb-0.5 text-sm font-medium text-surface-300"
							>Description</label
						>
						<textarea
							id="space-desc"
							class="input-group bg-primary-500/20 ig-input w-full focus:ring-2 focus:ring-primary-400"
							rows="3"
							placeholder="What's this space about?"
							bind:value={space.desc}
						></textarea>
					</div>

					<p class="text-sm font-medium text-surface-300">Colour</p>
					<ColorGroup />
					<article>
						<button
							type="submit"
							class="btn preset-filled w-full rounded-xl bg-{space.clr}-400 p-3 font-medium"
						onclick={() => {
							haptic('medium');
							if (space.name === '') {
									toast.error('Important fields are missing', { duration: 1500 });
									return;
								}
								if (localSpaces.current.find((spc: any) => spc.name === space.name)) {
									toast.error('Space "' + space.name + '" already exists', { duration: 1500 });
									return;
								}
								try {
									const newSpace = { name: space.name, clr: space.clr, desc: space.desc, items: [] };
									localSpaces.current.push(newSpace);
									navbarExpanded = !navbarExpanded;
									toast.success('Space "' + space.name + '" Created', { duration: 1500 });
									space.clr = 'purple';
									space.name = space.desc = '';
								} catch (err) {
									console.error('Failed to create space:', err);
									toast.error('Failed to create space', { duration: 2000 });
								}
							}}>Add Space</button>
					</article>
					<button
						type="button"
						class="w-full py-1 text-sm text-white/50 hover:text-white/80 transition-colors"
						onclick={closeExpanded}>Cancel</button>
				</form>
			</div>
		{/if}
{/snippet}

{#snippet Fileupload()}
	<div class="space-y-1">
		<FileUpload
			name="image"
			accept="image/*"
			maxFiles={10}
			subtext=""
			onFileChange={generatePreview}
			onFileReject={console.error}
			onApiReady={(api) => { uploadApi = api; }}
			classes=" w-full bg-primary-500/20 rounded-lg"
			label=""
		>
			{#snippet iconInterface()}
				<ImagePlus class="h-8 w-8" />
			{/snippet}
			{#snippet iconFile()}
				<FileIcon class="size-4" />{/snippet}
			{#snippet iconFileRemove()}
				<XCircle class="size-4" />
			{/snippet}
		</FileUpload>
		{#if sharedItem.images.length > 0}
			<div class="flex gap-2 overflow-x-auto pb-1 snap-x">
				{#each sharedItem.images as img, i}
					<div class="relative shrink-0 snap-start">
						<img
							src={img}
							alt="uploaded {i + 1}"
							class="h-16 w-16 rounded-lg object-cover"
						/>
						<button
							type="button"
							onclick={() => { haptic('light'); removeImage(i) }}
							class="absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
						>
							<X class="size-3" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet ConfirmDialogue()}
	<div class="card m-4 w-full max-w-md px-4 py-8 text-center">
		<div class="flex flex-col items-center justify-center gap-2">
			<p class="text-center text-2xl font-bold">{confirmState.title}</p>
			<p class="text-md pb-4 text-center font-mono">{confirmState.message}</p>
			<div class="flex w-full items-center justify-around gap-4">
			<button
				onclick={() => {
					haptic('heavy');
					confirmState.onConfirm?.();
					confirmState.open = false;
				}}
					class="btn btn-primary h-[40%] w-full bg-red-300/20 p-2 font-mono text-lg font-bold text-red-400"
				>
					{confirmState.confirmText}
				</button>
			<button
				onclick={() => {
					haptic('light');
					confirmState.open = false;
				}}
					class="btn btn-secondary w-full bg-green-300/20 p-2 font-mono text-lg font-bold text-green-300"
				>
					No, don't
				</button>
			</div>
		</div>
	</div>
{/snippet}
