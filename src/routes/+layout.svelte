<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { AppBar, FileUpload, Navigation } from '@skeletonlabs/skeleton-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import BlobImg from '$lib/assets/blob-scene.svg';
	import appIcon from '$lib/assets/icon-512.png';
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
		ChevronDown
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
		spaceview
	} from '../lib/shared.svelte';
	// State
	let imageFile: any = $state();
	let openPopup = $state(false);
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
		// console.log('Navigation value:', home.pageTitle);
		// console.log(home.homeLayout);
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
	import noImageUrl from '$lib/assets/no-image.png';
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
	import { ChevronUpCircle, CircleX, Trash2 } from '@lucide/svelte';

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
</script>

<div class="grid h-screen w-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header in:slide class="sticky top-0 z-10 backdrop-blur-xl">
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
			<!-- <Placeholder /> -->
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
								class="shadow-primary-200/50 size-25 rounded-4xl"
							/>
							<h2 transition:blur={{ delay: 300 }} class="h3">Welcome to</h2>
							<h2 transition:blur={{ delay: 300 }} class="h2">GloveBox</h2>
							<button
								transition:blur={{ delay: 400 }}
								type="button"
								aria-label="title"
								class="btn preset-filled mt-5 w-60 rounded-full py-2 text-lg"
								onclick={() => {
									first.current = !first.current;
								}}>Continue</button
							>
						</span>
					</div>
				</div>
			{/if}
		{/if}
	</main>

	<Toaster />
	<!-- PopUp -->
	<!-- <div>
		{#if page.route.id !== '/settings' && openPopup}
			{@render PopUp()}
		{/if}
	</div> -->
	<!-- Footer -->
	<!-- Component -->
	{#if (page.route.id === '/tabs/home' || page.route.id === '/tabs/space') && !first.current}
		<div
			transition:slide|global
			class="border-primary-200 sticky bottom-0 z-11 grid grid-rows-[1fr_auto]"
		>
			<Navigation.Bar
				classes="bg-surface-950/70 backdrop-blur"
				value={home.pageTitle}
				onValueChange={(newValue) => {
					home.pageTitle = newValue;
				}}
			>
				<Navigation.Tile
					active=" border-1 border-primary-200 bg-primary-900/50 "
					rounded="rounded-3xl rounded-l-lg rounded-b-lg"
					href="/tabs/home/"
					id="Home"
					label="Home"><Home /></Navigation.Tile
				>

				<div class="flex items-center justify-center px-2">
					<button
						type="button"
						class="btn-icon preset-tonal-primary z-20 size-8 rounded-2xl px-8"
						onclick={() => {
							url =
								sharedItem.img =
								sharedItem.link =
								sharedItem.text =
								sharedItem.title =
								sharedItem.url =
									'';
							chipName = '';
							openPopup = true;
						}}
					>
						<Plus />
					</button>
				</div>

				<Navigation.Tile
					active="border-1 border-primary-200 bg-primary-900/50 "
					rounded="rounded-3xl rounded-b-lg rounded-r-lg"
					href="/tabs/space/"
					id="Space"
					label="Space"><CircleDashed /></Navigation.Tile
				>
			</Navigation.Bar>
		</div>
	{/if}
	<!-- PopUp -->
	{#if page.route.id !== '/settings' && openPopup}
		<div
			class="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-2 backdrop-blur-sm"
		>
			{@render PopUpCard()}
			<button
				class="btn preset-tonal fixed bottom-5 w-80 py-2"
				aria-label="title"
				onclick={() => {
					openPopup = false;
					space.clr = 'purple';
				}}
			>
				Cancel
			</button>
		</div>
	{/if}
</div>

{#snippet Appbar(title: string, children: any)}
	<div transition:slide|global>
		<AppBar classes="dark:bg-primary-950/80">
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
						<h1 in:fade class="h1 font-bold">About</h1>
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
				{#if page.route.id === '/settings' || page.route.id === '/tabs/home/saved' || page.error || page.route.id === '/card' || page.route.id === '/info' || page.route.id === '/tabs/space/spaceview'}
					<ArrowLeft
						onclick={() => {
							history.back();
						}}
						class="size-7"
					/>
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
										style: 'border-radius: 200px; background: #333; color: #fff;',
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
				{:else if page.route.id === '/card'}
					<button
						onclick={() => {
							dropMenu = !dropMenu;
						}}
					>
						{#if dropMenu}
							<div in:fly>
								<X class="size-7" />
							</div>
						{:else}
							<div in:fly>
								<MoreVertical class="size-7" />
							</div>
						{/if}
					</button>
				{/if}
				{#if page.route.id === '/tabs/home/saved'}
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
					<Trash
						onclick={() => {
							try {
								localSpaces.current.forEach((spc: any) => {
									if (spc.name === spaceview.pageTitle) {
										let tempArr = localSpaces.current.filter(
											(item: any) => item.name !== spaceview.pageTitle
										);
										localSpaces.current = tempArr;
									}
								});
								toast.success('Space Cleared', {
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 1500
								});
								history.back();
							} catch (e) {
								toast.error('Space Cleared', {
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 1500
								});
								console.log('Error removing item from local storage:', e);
							}
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
		{#if dropMenu}
			<div class="fixed top-15 right-4 z-12 flex justify-end">
				{@render CardDropDown()}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet PopUpCard()}
	<!-- Home Page PopUp Card -->
	<div
		transition:fly={{ y: 100, duration: 200 }}
		class="card bg-surface-900/90 right-0 bottom-0 left-0 z-200 m-4 w-full p-3 backdrop-blur-xl"
	>
		{#if page.route.id === '/tabs/home'}
			<form onsubmit={handleSubmit} class="space-y-3">
				<header class="flex justify-between">
					<p class="text-xl font-bold">Add Item</p>
					<button
						class="btn-icon badge preset-filled hover:preset-tonal rounded-full"
						onclick={() => {
							openPopup = !openPopup;
							chipName = '';
						}}><X /></button
					>
				</header>
				<hr class="hr" />
				<div class="input-group grid-cols-auto relative">
					<input
						form="input[]"
						class="ig-input bg-primary-500/20"
						bind:value={sharedItem.title}
						type="text"
						required
						placeholder="Title *"
					/>
					{#if sharedItem.title.length > 0}
						<X
							onclick={() => {
								sharedItem.title = '';
							}}
							class=" text-surface-200/30 absolute right-0 m-2 "
						/>
					{:else}
						<Info
							onclick={() => {
								toast('Required to add a Title', {
									icon: '⚠️',
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 2000
								});
							}}
							class=" text-primary-200/30 absolute right-0 m-2 "
						/>
					{/if}
				</div>

				<div class="relative">
					{#if sharedItem.text.length > 0}
						<X
							onclick={() => {
								sharedItem.text = '';
							}}
							class=" text-surface-200/30 absolute right-0 m-2 "
						/>
					{:else}
						<Info
							onclick={() => {
								toast('Required to add a Description', {
									icon: '⚠️',
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 2000
								});
							}}
							class=" text-primary-200/30 absolute right-0 m-2 "
						/>
					{/if}
					<textarea
						class="input-group bg-primary-500/20 ig-input w-full"
						rows="3"
						placeholder="Description *"
						bind:value={sharedItem.text}
					></textarea>
				</div>
				{@render Fileupload()}

				<span class="flex justify-center">OR</span>

				<div class="input-group bg-primary-500/20 relative grid-cols-[auto_1fr]">
					<div class=" ig-cell preset-tonal w-fit"><Link class="h-4 w-4" /></div>
					<input
						class="ig-input"
						bind:value={url}
						oninput={handleSubmit}
						type="url"
						placeholder="https://www.example.com"
					/>
					{#if url.length > 0}
						<X
							onclick={() => {
								url = '';
							}}
							class=" text-surface-200/30 absolute right-0 m-2 "
						/>
					{:else}
						<Info
							onclick={() => {
								toast('Required to add a Description', {
									icon: '⚠️',
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 2000
								});
							}}
							class=" text-primary-200/30 absolute right-0 m-2 "
						/>
					{/if}
				</div>
				<hr class="hr" />
				{#if localSpaces.current.length > 0}
					<p class="text-sm">Assign a Space</p>
					<div class="flex gap-2 overflow-auto pb-2">
						{#each localSpaces.current as obj}
							{#if obj.name === chipName}
								<button
									onclick={() => {
										chipName = '';
									}}
									type="button"
									class="chip bg-{obj.clr}-400 rounded-full">{obj.name}</button
								>
							{:else}
								<button
									onclick={() => {
										chipName = obj.name;
									}}
									type="button"
									class="chip preset-outlined rounded-full">{obj.name}</button
								>
							{/if}
						{/each}
						<button
							onclick={() => {
								goto('/tabs/space');
								// space.clr = 'purple';
								// space.name = space.desc = '';
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
							: 'opacity-100'} preset-filled w-full p-3"
						onclick={() => {
							if (url !== '' && ogData) {
								if (ogData.image === '') {
									sharedItem.img = noImageUrl;
								} else {
									// console.log(imageToBase64(ogData.image))
									sharedItem.img = ogData.image;
								}
								if (ogData) {
									// sharedItem.title = ogData.title;
									// sharedItem.text = ogData.description;
									// sharedItem.link = ogData.siteName;
									// sharedItem.url = url;
									localItems.current.push(sharedItem);
									addItemToSpace(sharedItem);
									openPopup = false;
									url =
										sharedItem.img =
										sharedItem.link =
										sharedItem.text =
										sharedItem.title =
										sharedItem.url =
											'';
								} else {
									toast.error('Error fetching OpenGraph data', {
										style: 'border-radius: 200px; background: #333; color: #fff;',
										duration: 1500
									});
								}
							} else if (sharedItem.title !== '' && sharedItem.text !== '') {
								if (sharedItem.img === '') {
									sharedItem.img = noImageUrl;
								}
								localItems.current.push(sharedItem);
								addItemToSpace(sharedItem);
								openPopup = false;
								toast.success('Item Added', {
									style: 'border-radius: 200px; background: #333; color: #fff;',
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
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 2000
								});
							} else {
								console.log('Important Fields Empty');
								toast.error('Important fields are missing', {
									style: 'border-radius: 200px; background: #333; color: #fff;',
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
			</form>
		{:else if page.route.id === '/tabs/space'}
			<!-- Space page PopUp Card -->
			<form class="space-y-3">
				<header class="flex justify-between">
					<p class="text-xl font-bold">Add Space</p>
					<button
						class="btn-icon badge preset-filled hover:preset-tonal rounded-full"
						onclick={() => {
							openPopup = !openPopup;
							space.clr = 'purple';
							space.name = space.desc = '';
						}}><X /></button
					>
				</header>
				<hr class="hr" />
				<div class="input-group grid-cols-auto">
					<input
						form="input[]"
						class="ig-input bg-primary-500/20"
						bind:value={space.name}
						type="text"
						required
						placeholder="Name"
					/>
				</div>
				<textarea
					class="input-group bg-primary-500/20 ig-input w-full"
					rows="3"
					placeholder="Detail."
					bind:value={space.desc}
				></textarea>

				<p class="text-sm font-light">Select Space colour</p>
				<ColorGroup />
				<article>
					<button
						type="submit"
						class="btn preset-filled w-full bg-{space.clr}-400 p-3"
						onclick={() => {
							if (space.name !== '') {
								console.log('space added: ' + space.name);
								localSpaces.current.push(space);
								openPopup = !openPopup;
								toast.success('Space "' + space.name + '" Created', {
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 1500
								});
								space.clr = 'purple';
								space.name = space.desc = '';
							} else {
								console.log('Important Fields Empty in Spaces');
								toast.error('Name is Missing', {
									style: 'border-radius: 200px; background: #333; color: #fff;',
									duration: 1500
								});
							}
						}}>Add Space</button
					>
				</article>
			</form>
		{/if}
	</div>
{/snippet}

<!-- {#snippet PopUp()}
	<Popover
		classes=" "
		open={openPopup}
		onOpenChange={(e) => (openPopup = e.open)}
		positioning={{ placement: 'top', offset: { mainAxis: 45 } }}
		triggerBase="btn "
		contentBase="card bg-surface-900/60 backdrop-blur-xl p-4 space-y-4 max-w-[360px]"
		arrow
		arrowBackground="!bg-surface-200 dark:!bg-surface-800"
	>
		{#snippet trigger()}{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<p class="text-xl font-bold">Add Item</p>
				<button
					class="btn-icon hover:preset-tonal"
					onclick={() => {
						openPopup = !openPopup
					}}><X /></button
				>
			</header>
			<div class="input-group grid-cols-auto">
				<input class="ig-input" type="text" placeholder="Title" />
			</div>
			{@render Fileupload()}
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal w-fit">
					<Icon icon="lucide:link" class="h-4 w-4" />
				</div>
				<input class="ig-input" type="text" placeholder="www.example.com" />
			</div>

			<article>
				<button type="button" class="btn preset-filled w-full p-3">Add Item</button>
			</article>
		{/snippet}
	</Popover>
{/snippet} -->

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

{#if dropMenu}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		out:blur={{ duration: 300 }}
		onclick={() => {
			dropMenu = !dropMenu;
		}}
		class="fixed inset-0 z-9 bg-black/30 backdrop-blur-xs"
	></div>
{/if}
{#snippet CardDropDown()}
	{#if dropMenu}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			transition:slide|global
			id="dropdownDots"
			onclick={() => {
				dropMenu = !dropMenu;
			}}
			class="bg-primary-950/70 w-50 divide-y divide-white rounded-lg font-bold shadow-sm outline backdrop-blur-lg"
		>
			{#if cardPage.url !== ''}
				<a target="_blank" href={cardPage.url} class="py-1">
					<div class="block px-4 py-1 text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-600">
						<span class="flex justify-between">
							Open Link
							<Link />
						</span>
					</div>
				</a>
			{/if}
			<div class="py-1">
				<div class="block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600">
					<span class="flex justify-between">
						Add To Space
						<CircleDashed />
					</span>
				</div>
			</div>
			<div
				onclick={() => {
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
					console.log(localSpaces.current);
					console.log(localItems.current);
					toast.success('Item Deleted', {
						style: 'border-radius: 200px; background: #333; color: #fff;',
						duration: 1500
					});
					history.back();
				}}
				class="py-1"
			>
				<div class="block px-4 py-1 text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
					<span class="flex justify-between">
						Delete
						<Trash />
					</span>
				</div>
			</div>
		</div>
	{/if}
{/snippet}
