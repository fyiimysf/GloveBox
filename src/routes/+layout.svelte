<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { AppBar, Avatar, FileUpload, Navigation } from '@skeletonlabs/skeleton-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import BlobImg from '$lib/assets/blob-scene.svg';
	import appIcon from '$lib/assets/launch-icon.webp';
	// Icons
	import { page } from '$app/state';
	import {
		ArrowLeft,
		Bolt,
		CircleDashed,
		File,
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
		CircleOff,
		CircleDotDashed,
		Check,
		Clipboard,
		ChevronUpCircle,
		CircleX,
		Trash2
	} from 'lucide-svelte';
	import { blur, fade, fly, slide } from 'svelte/transition';
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
		undoState,
		performUndo,
		truncate,
		setUndo,
		setUndoRemove
	} from '../lib/shared.svelte';
	// State
	let imageFile: any = $state();
	let navbarExpanded = $state(false);
	let touchStartY = $state(0);
	onMount(() => {
		if (page.route.id === '/') {
			goto('/tabs/home');
		} else if (page.route.id === '/tabs/home') {
			home.pageTitle = 'Home';
			goto('/tabs/home');
		} else if (page.route.id === '/tabs/space') {
			home.pageTitle = 'Space';
			goto('/tabs/space');
		}
	});
	$effect(() => {
		document.documentElement.setAttribute('data-theme', data_theme.current.value);
		if (page.route.id == '/tabs/space') {
			home.spaceDelete = false;
		}
		if (page.route.id !== '/tabs/home' && page.route.id !== '/tabs/home/saved' && page.route.id !== '/tabs/space/spaceview') {
			home.selectMode = false;
			home.selectedTitles = [];
		}
	});

	$effect(() => {
		if (shareTarget.current) {
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
			shareTarget.current = null;
		}
	});

	function generatePreview(event: any) {
		const reader = new FileReader();
		reader.onload = (event) => {
			const image = event.target?.result;

			sharedItem.img = image;
			console.log(image);

			// set the image as the src of an image element
		};
		reader.readAsDataURL(event.acceptedFiles[0]);
		// console.log(reader)
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

	async function handleSubmit() {
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
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	//Chips
	let chipsSelect = $state(false);
	let chipName = $state('');
	function addItemToSpace(item: any) {
		localSpaces.current.forEach((spc: any) => {
			console.log(spc.name);
			if (spc.name === chipName) {
				console.log(spc);
				spc.items.push(item);
			}
		});
	}

	//DropDown
	let dropMenu = $state(false);
	let spaceMenu = $state(false);
	function closeExpanded() {
		navbarExpanded = false;
		space.clr = 'purple';
		space.name = space.desc = '';
		chipName = '';
		sharedItem.img = sharedItem.link = sharedItem.text = sharedItem.title = sharedItem.url = url = '';
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

<div class="flex justify-center w-screen">
	<div class="grid h-screen w-full lg:max-w-[480px] grid-rows-[auto_1fr_auto] select-none">
	<!-- Header -->
	<header in:slide class="gpu sticky top-0 z-10 backdrop-blur-xl">
		<!-- <AppBarC title={value} {homeLayout}></AppBarC> -->
		{#if !page.error && !first.current}
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
			{#if first.current && localItems.current.length < 1 && localSpaces.current.length < 1}
				<!-- svelte-ignore a11y_missing_attribute -->
				<div class="{first.current ? 'visible' : 'hidden'} ">
					<img
						src={BlobImg}
						in:blur
						out:blur={{ delay: 400 }}
						class="fixed inset-1 z-50 flex h-fit w-full justify-center blur-xs"
					/>
					<div>
						<span
							class="absolute top-0 right-0 bottom-0 left-0 z-51 flex flex-col items-center justify-center gap-2"
						>
							<img
								src={appIcon}
								transition:blur={{ delay: 200 }}
								alt="GloveBox"
								class="shadow-primary-200/50 -mb-10"
							/>
							<h2 transition:slide={{ delay: 300 }} class="h3">Welcome to</h2>
							<h2 transition:slide={{ delay: 300 }} class="h2">GloveBox</h2>
							<button
								transition:blur={{ delay: 400 }}
								type="button"
								aria-label="title"
								class="btn preset-filled mt-5 w-60 rounded-full py-2 text-lg"
								onclick={() => {
									first.current = !first.current;
								}}>Continue</button
							>
							<p
								transition:slide={{ delay: 100 }}
								class="p absolute bottom-10 flex text-lg font-bold tracking-wider"
							>
								URL organizer & stashing
							</p>
						</span>
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
			class="gpu fixed bottom-26 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 items-center justify-between gap-4 rounded-2xl bg-black/60 px-4 py-2 shadow-2xl shadow-primary-500/10 backdrop-blur-xl border border-primary-500/20 text-sm"
		>
			<span class="font-semibold text-white drop-shadow-sm">{undoState.message}</span>
			<button
				class="rounded-lg bg-primary-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:bg-primary-400 hover:shadow-primary-400/40 active:scale-95"
				onclick={performUndo}
			>
				Undo
			</button>
		</div>
	{/if}

	{#if dropMenu || spaceMenu}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="gpu fixed inset-0 z-40" onclick={() => { dropMenu = false; spaceMenu = false; }}></div>
		<div
			transition:fly={{ y: 100, duration: 200 }}
			class="gpu fixed bottom-0 z-50 left-1/2 -translate-x-1/2 w-full lg:max-w-[480px] rounded-t-4xl bg-primary-900/70 px-6 pb-10 pt-4 shadow-2xl backdrop-blur-xl border-t border-white/10"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/70" onclick={() => { dropMenu = false; spaceMenu = false; }}></div>
			{@render CardDropDown()}
		</div>
	{/if}
	<!-- Morphing Navbar -->
	{#if (page.route.id === '/tabs/home' || page.route.id === '/tabs/space') && !first.current && !(page.route.id === '/tabs/home' && home.selectMode)}
		{#if navbarExpanded}
			<div
				transition:blur={{ duration: 200 }}
				class="gpu fixed inset-0 z-10 bg-black/40 backdrop-blur-sm"
				onclick={closeExpanded}
			></div>
		{/if}
		<div transition:slide|global class="gpu fixed bottom-5 z-11 left-1/2 -translate-x-1/2 w-full lg:max-w-[480px] px-4">
			<div
				class="rounded-3xl border-2 backdrop-blur-xl overflow-hidden transition-all duration-500 ease-out {navbarExpanded ? 'border-primary-500/50 bg-black/60' : 'border-primary-500/30 bg-black/50'}"
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
								active=" bg-primary-800/50 text-primary-200 "
								rounded="rounded-2xl rounded-r-lg"
								href="/tabs/home/"
								id="Home"
								label="Home"><Home /></Navigation.Tile
							>

							<div class="px-1">
								<button
									type="button"
									class="btn-icon bg-primary-400 z-20 h-12 w-10 rounded-lg px-6 "
									onclick={() => {
										url = sharedItem.img = sharedItem.link = sharedItem.text = sharedItem.title = sharedItem.url = '';
										chipName = '';
										navbarExpanded = true;
									}}
								>
									<Plus class="text-black" />
								</button>
							</div>

							<Navigation.Tile
								active=" bg-primary-800/50 text-primary-200 "
								rounded="rounded-2xl rounded-l-lg"
								href="/tabs/space/"
								id="Space"
								label="Space"><CircleDashed /></Navigation.Tile
							>
						</Navigation.Bar>
					</div>
					<div
						class="absolute inset-0 flex items-center gap-3 px-6 transition-all duration-300 ease-out"
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
					<div transition:slide={{ duration: 400 }} ontouchstart={handleTouchStart} ontouchend={handleTouchEnd} class="max-h-[calc(100dvh-7rem)] overflow-y-auto">
						{@render PopUpCard()}
					</div>
				{/if}
			</div>
		</div>
	{/if}
	{#if confirmState.open}
		<div
			transition:fade={{duration:200}}
			class="gpu fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-md"
		>
			{@render ConfirmDialogue()}
		</div>
	{/if}
</div>
</div>

{#snippet Appbar(title: string, children: any)}
	<div transition:slide|global class="gpu">
		<AppBar classes="dark:bg-primary-950/80 gpu-layer">
			{#snippet headline()}
				{#if page.route.id === '/settings'}
					<center>
						<h1 in:fade class="h1 font-bold">Settings</h1>
					</center>
				{:else if page.route.id === '/tabs/home/saved'}
					<center>
						<h1 in:fade class="h1 font-bold">Saved</h1>
					</center>
				{:else if page.route.id === '/tabs/home'}
					<center>
						<h1 in:fade class="h1 font-bold">Home</h1>
					</center>
				{:else if page.route.id === '/tabs/space'}
					<center>
						<h1 in:fade class="h1 font-bold">Space</h1>
					</center>
				{:else if page.route.id === '/info'}
					<center>
						<h1 in:fade class="h1 font-bold">Glove Box</h1>
					</center>
				{:else if page.route.id === '/card'}
					<center>
						<h1 in:fade class="h1 w-70 truncate font-bold">{cardPage.link}</h1>
					</center>
				{:else if page.route.id === '/tabs/space/spaceview'}
					<center>
						<h1 in:fade class="h1 w-70 truncate font-bold text-{spaceview.clr}-400">
							{spaceview.pageTitle}
						</h1>
					</center>
				{/if}
			{/snippet}

			{#snippet lead()}
				{#if page.route.id === '/settings' || page.route.id === '/tabs/home/saved' || page.error || page.route.id === '/info' || page.route.id === '/tabs/space/spaceview'}
					<ArrowLeft
						onclick={() => {
							history.back();
						}}
						class="size-7"
					/>
				{:else if page.route.id === '/card'}
					{#if !dropMenu || spaceMenu}
						<ArrowLeft
							onclick={() => {
								history.back();
							}}
							class="size-7"
						/>
					{/if}
				{:else if page.route.id === '/tabs/home'}
					{#if !home.homeLayout}
						<StretchHorizontal
							onclick={() => {
								home.homeLayout = !home.homeLayout;
							}}
							class="size-7"
						/>
					{:else}
						<LayoutGrid
							onclick={() => {
								home.homeLayout = !home.homeLayout;
							}}
							class="size-7"
						/>
					{/if}
				{:else if page.route.id === '/tabs/space'}
					{#if !home.savedLayout}
						<ChevronDown
							onclick={() => {
								home.savedLayout = !home.savedLayout;
							}}
							class="size-7"
						/>
					{:else}
						<ChevronUp
							onclick={() => {
								home.savedLayout = !home.savedLayout;
							}}
							class="size-7"
						/>
					{/if}
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
							home.selectMode = !home.selectMode;
							if (!home.selectMode) home.selectedTitles = [];
						}}
					/>
					<a href="/settings">
						<Bolt class="size-7" />
					</a>
				{:else if page.route.id === '/tabs/space'}
					{#if localSpaces.current.length > 0}
						{#if home.spaceDelete}
							<CircleX
								class="size-7"
								onclick={() => {
									home.spaceDelete = false;
								}}
							/>
						{:else}
							<Trash
								class="size-7"
								onclick={() => {
									home.spaceDelete = true;
									toast('Select Spaces to Delete', {
										
										duration: 2000
									});
								}}
							/>
						{/if}
					{/if}
					<a href="/settings">
						<Bolt class="size-7" />
					</a>
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
					<button>
						{#if dropMenu || spaceMenu}
							<div in:fly>
								<X
									class="size-7"
									onclick={() => {
										dropMenu = false;
										spaceMenu = false;
									}}
								/>
							</div>
						{:else}
							<div in:fly>
								<MoreVertical
									class="size-7"
									onclick={() => {
										dropMenu = true;
									}}
								/>
							</div>
						{/if}
					</button>
				{/if}
				{#if page.route.id === '/tabs/home/saved'}
					<SquareStack
						class="size-7 {home.selectMode ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}"
						onclick={() => {
							home.selectMode = !home.selectMode;
							if (!home.selectMode) home.selectedTitles = [];
						}}
					/>
					{#if home.savedLayout}
						<StretchHorizontal
							onclick={() => {
								home.savedLayout = !home.savedLayout;
							}}
							class="size-7"
						/>
					{:else}
						<LayoutGrid
							onclick={() => {
								home.savedLayout = !home.savedLayout;
							}}
							class="size-7"
						/>
					{/if}
				{:else if page.route.id === '/tabs/space/spaceview'}
					<SquareStack
						class="size-7 {home.selectMode ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}"
						onclick={() => {
							home.selectMode = !home.selectMode;
							if (!home.selectMode) home.selectedTitles = [];
						}}
					/>
					<Trash
						onclick={() => {
							confirmState.open = true;
							confirmState.title = 'Delete Space?';
							confirmState.message = spaceview.pageTitle + ' will be permanently deleted';
							confirmState.confirmText = 'Delete';
							confirmState.onConfirm = () => {
								localSpaces.current.forEach((spc: any) => {
									if (spc.name === spaceview.pageTitle) {
										let tempArr = localSpaces.current.filter(
											(item: any) => item.name !== spaceview.pageTitle
										);
										localSpaces.current = tempArr;
									}
								});
								toast.success('Space Deleted', {
									
									duration: 2000
								});
								history.back();
							};
						}}
						class="size-7"
					/>
					{#if !home.spaceviewLayout}
						<StretchHorizontal
							onclick={() => {
								home.spaceviewLayout = !home.spaceviewLayout;
							}}
							class="size-7"
						/>
					{:else}
						<LayoutGrid
							onclick={() => {
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
			<form onsubmit={handleSubmit} class="space-y-4 pt-2">
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
									sharedItem.text = '';
								}}
								class="absolute right-2 top-2 z-10 size-5 cursor-pointer text-surface-400 hover:text-surface-200"
							/>
						{/if}
						<textarea
							id="item-desc"
							class="input-group bg-primary-500/20 ig-input w-full overflow-y-auto focus:ring-2 focus:ring-primary-400"
							rows="3"
							placeholder="Describe this item..."
							bind:value={sharedItem.text}
						></textarea>
					</div>
				</div>
				{@render Fileupload()}

				<div class="flex items-center gap-3 py-1">
					<span class="h-px flex-1 bg-surface-600/30"></span>
					<span class="text-xs font-medium uppercase tracking-wider text-surface-400"
						>Or paste a link</span
					>
					<span class="h-px flex-1 bg-surface-600/30"></span>
				</div>

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
									url = '';
								}}
								class="absolute right-0 m-2 size-5 cursor-pointer text-surface-400 hover:text-surface-200"
							/>
						{:else}
							<Clipboard
								onclick={() => {
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
										chipName = '';
									}}
									type="button"
									class="badge bg-{obj.clr}-400/30 text-{obj.clr}-400 rounded-full"
									>{obj.name}</button
								>
							{:else}
								<button
									onclick={() => {
										chipName = obj.name;
									}}
									type="button"
									class="badge preset-outlined rounded-full">{obj.name}</button
								>
							{/if}
						{/each}
						<button
							onclick={() => {
								goto('/tabs/space');
								home.pageTitle = 'Space';
							}}
							type="button"
							class="text-primary-300 text-xl">+</button
						>
					</div>
				{/if}
				<article>
					<button
						type="submit"
						disabled={loading ||
							(url === '' && (sharedItem.title === '' || sharedItem.text === ''))}
						class="btn {loading ||
						(url === '' && (sharedItem.title === '' || sharedItem.text === ''))
							? 'opacity-50'
							: 'opacity-100'} preset-filled w-full rounded-xl p-3 font-medium"
						onclick={() => {
							if (url !== '' && ogData) {
								if (ogData.image === '') {
									sharedItem.img = noImageUrl;
								} else {
									sharedItem.img = ogData.image;
								}
								if (ogData) {
									localItems.current.push(sharedItem);
									addItemToSpace(sharedItem);
									navbarExpanded = false;
									url =
										sharedItem.img =
										sharedItem.link =
										sharedItem.text =
										sharedItem.title =
										sharedItem.url =
											'';
								} else {
									toast.error('Error fetching OpenGraph data', {
										
										duration: 1500
									});
								}
							} else if (sharedItem.title !== '' && sharedItem.text !== '') {
								if (sharedItem.img === '') {
									sharedItem.img = noImageUrl;
								}
								localItems.current.push(sharedItem);
								addItemToSpace(sharedItem);
								navbarExpanded = false;
								toast.success('Item Added', {
									
									duration: 1500
								});
								url =
									sharedItem.img =
									sharedItem.link =
									sharedItem.text =
									sharedItem.title =
									sharedItem.url =
										'';
							} else if (url !== '') {
								toast.error('Link invalid or "https://" missing', {
									
									duration: 2000
								});
							} else {
								console.log('Important Fields Empty');
								toast.error('Important fields are missing', {
									
									duration: 1500
								});
							}
						}}
					>
						{#if loading}
							<CircleDashed class="size-8 animate-spin" />
						{:else}
							Add Item
						{/if}
					</button>
				</article>
				<button
					type="button"
					class="w-full py-1 text-sm text-white/50 hover:text-white/80 transition-colors"
					onclick={closeExpanded}>Cancel</button>
			</form>
		</div>
		{:else if page.route.id === '/tabs/space'}
			<div class="px-3 pb-4">
				<hr class="hr" />
				<form class="space-y-4 pt-2">
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
								if (space.name !== '') {
									if (!localSpaces.current.find((spc: any) => spc.name === space.name)) {
										console.log('space added: ' + space.name);
										localSpaces.current.push(space);
										navbarExpanded = !navbarExpanded;
										toast.success('Space "' + space.name + '" Created', {
											
											duration: 1500
										});
										space.clr = 'purple';
										space.name = space.desc = '';
									} else {
										toast.error('Space "' + space.name + '" already exists', {
											
											duration: 1500
										});
									}
								} else {
									console.log('Important Fields Empty in Spaces');
									toast.error('Important fields are missing', {
										
										duration: 1500
									});
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
	<div class="">
		<FileUpload
			name="image"
			accept="image/*"
			maxFiles={2}
			subtext=""
			onFileChange={generatePreview}
			onFileReject={console.error}
			classes=" w-full bg-primary-500/20 rounded-lg"
			label=""
		>
			{#snippet iconInterface()}
				{#if sharedItem.img !== ''}
					<img alt="uploaded" class="h-30" src={sharedItem.img} />
				{:else}
					<ImagePlus class="h-12 w-12" />
				{/if}
			{/snippet}

			{#snippet iconFile()}
				<File class="size-4" />{/snippet}
			{#snippet iconFileRemove()}<XCircle
					onclick={() => {
						sharedItem.img = '';
					}}
					class="size-4"
				/>{/snippet}
		</FileUpload>
	</div>
{/snippet}
{#snippet CardDropDown()}
	<div class="divide-y divide-white/10 text-sm font-bold">
		{#if cardPage.url !== ''}
			<a target="_blank" href={cardPage.url}>
				<div class="flex items-center justify-between px-2 py-4 text-yellow-300 transition-colors hover:text-yellow-200 active:scale-[0.98]">
					<span>Open Link</span>
					<Link class="size-4" />
				</div>
			</a>
		{/if}

		{#each localSpaces.current as spaceObj}
			{#each spaceObj.items as obj}
				{#if obj.title === cardPage.title}
					<div
						onclick={(e) => {
							e.stopPropagation();
							dropMenu = false;
							confirmState.open = true;
							confirmState.title = 'Remove from ' + spaceObj.name + '?';
							confirmState.message = cardPage.title;
							confirmState.confirmText = 'Remove';
							confirmState.onConfirm = () => {
								const deletedItem = cardPage;
								spaceObj.items.forEach((item: any) => {
									if (item.title === cardPage.title) {
										let tempArr2 = spaceObj.items.filter(
											(item: any) => item.title !== cardPage.title
										);
										spaceObj.items = tempArr2;
									}
								});
								spaceview.viewItems.forEach((item: any) => {
									if (item.title === cardPage.title) {
										let tempArr3 = spaceview.viewItems.filter(
											(item: any) => item.title !== cardPage.title
										);
										spaceview.viewItems = tempArr3;
									}
								});
								const msg = truncate(cardPage.title) + ' removed';
								setUndoRemove(msg, [deletedItem], spaceObj.name);
								toast.success(msg, {
									
									duration: 2000
								});
							};
						}}
						class="flex cursor-pointer items-center justify-between px-2 py-4 text-{spaceObj.clr}-400 transition-colors hover:text-{spaceObj.clr}-300 active:scale-[0.98]"
					>
						<span class="truncate">Delete From {spaceObj.name}</span>
						<CircleOff class="size-4 shrink-0" />
					</div>
				{/if}
			{/each}
		{/each}

		{#if spaceMenu}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div transition:slide|global>
				<div
					onclick={() => { spaceMenu = false; }}
					class="flex cursor-pointer items-center gap-2 px-2 py-4 transition-colors hover:text-white active:scale-[0.98]"
				>
					<ArrowLeft class="size-4" />
					<span>Back</span>
				</div>
				<div class="max-h-48 overflow-y-auto">
					{#each [...localSpaces.current].reverse() as item}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							onclick={() => {
								const isInSpace = item.items.some((i: any) => i.title === cardPage.title);
								if (isInSpace) {
									item.items = item.items.filter((i: any) => i.title !== cardPage.title);
									toast.success('Item Removed from ' + item.name, {
										
										duration: 1500
									});
								} else {
									item.items.push(cardPage);
									toast.success('Item Added to ' + item.name, {
										
										duration: 1500
									});
								}
								spaceMenu = false;
							}}
							class="flex cursor-pointer items-center justify-between px-2 py-3 transition-colors hover:text-white active:scale-[0.98]"
						>
							<span class="flex min-w-0 items-center gap-2 pr-2">
								<span class="h-2.5 w-2.5 shrink-0 rounded-full bg-{item.clr}-400"></span>
								<span class="truncate">{item.name}</span>
							</span>
							{#if item.items.some((i: any) => i.title === cardPage.title)}
								<Check class="size-4 shrink-0 text-green-400" />
							{:else}
								<Plus class="size-4 shrink-0 text-white/50" />
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{:else if localSpaces.current.length > 0}
			<div
				onclick={() => { spaceMenu = true; }}
				class="flex cursor-pointer items-center justify-between px-2 py-4 transition-colors hover:text-white active:scale-[0.98]"
			>
				<span>Add To Space</span>
				<CircleDashed class="size-4" />
			</div>
		{/if}

		<div
			onclick={(e) => {
				e.stopPropagation();
				dropMenu = false;
				confirmState.open = true;
				confirmState.title = 'Delete Item?';
				confirmState.message = cardPage.title;
				confirmState.confirmText = 'Delete';
				confirmState.onConfirm = () => {
					const deletedItem = localItems.current.find((i: any) => i.title === cardPage.title);
					const spaceMappings: Array<{ spaceName: string; items: any[] }> = [];
					for (const spc of localSpaces.current) {
						if (spc.items.some((i: any) => i.title === cardPage.title)) {
							spaceMappings.push({ spaceName: spc.name, items: [deletedItem] });
						}
					}
					let tempArr = localItems.current.filter((item: any) => item.title !== cardPage.title);
					localItems.current = tempArr;
					localSpaces.current.forEach((spc: any) => {
						spc.items.forEach((item: any) => {
							if (item.title === cardPage.title) {
								let tempArr2 = spc.items.filter((item: any) => item.title !== cardPage.title);
								spc.items = tempArr2;
							}
						});
					});
					const msg = truncate(cardPage.title) + ' Deleted';
					setUndo(msg, [deletedItem], spaceMappings);
					toast.success(msg, {
						
						duration: 2000
					});
					history.back();
				};
			}}
			class="flex cursor-pointer items-center justify-between px-2 py-4 text-red-400 transition-colors hover:text-red-300 active:scale-[0.98]"
		>
			<span>Delete</span>
			<Trash class="size-4" />
		</div>
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
						confirmState.onConfirm?.();
						confirmState.open = false;
					}}
					class="btn btn-primary h-[40%] w-full bg-red-300/20 p-2 font-mono text-lg font-bold text-red-400"
				>
					{confirmState.confirmText}
				</button>
				<button
					onclick={() => {
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
