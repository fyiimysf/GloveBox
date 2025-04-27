<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { AppBar, FileUpload, Navigation } from '@skeletonlabs/skeleton-svelte';
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
		Link
	} from 'lucide-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { home, localItems, sharedItem } from '../lib/shared.svelte';
	// State
	let imageFile: any = $state();
	let openPopup = $state(false);
	$effect(() => {
		console.log('Navigation value:', home.pageTitle);
		console.log(home.homeLayout);
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
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<div in:slide class="grid h-screen w-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header class="sticky top-0 z-10 backdrop-blur-xl">
		<!-- <AppBarC title={value} {homeLayout}></AppBarC> -->
		{@render Appbar(home.pageTitle, null)}
	</header>
	<!-- Main -->
	<main class="dark:bg-surface-950 relative w-full p-3">
		{@render children()}
	</main>
	<!-- PopUp -->
	<!-- <div>
		{#if page.route.id !== '/settings' && openPopup}
			{@render PopUp()}
		{/if}
	</div> -->
	<!-- Footer -->
	<div
		in:slide={{ delay: 0, axis: 'y' }}
		class="border-primary-200 sticky bottom-0 z-10 grid grid-rows-[1fr_auto]"
	>
		<!-- Component -->
		{#if page.route.id === '/tabs/home' || page.route.id === '/tabs/space'}
			<div>
				<Navigation.Bar
					classes="bg-surface-950/70 backdrop-blur"
					value={home.pageTitle}
					onValueChange={(newValue) => {
						home.pageTitle = newValue;
					}}
				>
					<Navigation.Tile
						active=" border-1 border-primary-200 bg-primary-900/50 "
						rounded="rounded-3xl rounded-b-lg rounded-l-lg"
						href="/tabs/home/"
						id="Home"
						label="Home"><Home /></Navigation.Tile
					>

					<div class="flex items-center justify-center px-2">
						<button
							type="button"
							class="btn-icon preset-tonal-primary z-20 size-8 rounded-full px-8"
							onclick={() => {
								openPopup = true;
								url = sharedItem.img = sharedItem.link = sharedItem.text = sharedItem.title = '';
							}}
						>
							<Plus />
						</button>
					</div>

					<Navigation.Tile
						active="border-1  border-primary-200 bg-primary-900/50 "
						rounded="rounded-3xl rounded-b-lg rounded-r-lg"
						href="/tabs/space/"
						id="Space"
						label="Space"><CircleDashed /></Navigation.Tile
					>
				</Navigation.Bar>
			</div>
		{/if}
	</div>
	<!-- PopUp -->
	{#if page.route.id !== '/settings' && openPopup}
		<div class="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			{@render PopUpCard()}
			<button
				class="btn preset-tonal fixed bottom-5 w-90 py-2"
				aria-label="title"
				onclick={() => {
					openPopup = false;
				}}
			>
				Cancel
			</button>
		</div>
	{/if}
</div>

{#snippet Appbar(title: string, children: any)}
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
			{:else}
				<center>
					<h1 in:fade class="h1 font-bold">{title}</h1>
				</center>
			{/if}
		{/snippet}

		{#snippet lead()}
			{#if page.route.id === '/settings' || page.route.id === '/tabs/home/saved'}
				<ArrowLeft
					onclick={() => {
						history.back();
					}}
					class="h-6 w-6"
				/>
			{:else if home.homeLayout}
				<StretchHorizontal
					onclick={() => {
						home.homeLayout = !home.homeLayout;
					}}
					class="h-6 w-6"
				/>
			{:else}
				<LayoutGrid
					onclick={() => {
						home.homeLayout = !home.homeLayout;
					}}
					class="h-6 w-6"
				/>
			{/if}
		{/snippet}

		{#snippet trail()}
			{#if children}
				{@render children()}
			{/if}
			{#if page.route.id !== '/settings'}
				<a href="/settings">
					<Bolt class="h-6 w-6" />
				</a>
			{/if}
			{#if page.route.id === '/tabs/home/saved'}
				{#if home.savedLayout}
					<StretchHorizontal
						onclick={() => {
							home.savedLayout = !home.savedLayout;
						}}
						class="h-6 w-6"
					/>
				{:else}
					<LayoutGrid
						onclick={() => {
							home.savedLayout = !home.savedLayout;
						}}
						class="h-6 w-6"
					/>
				{/if}
			{/if}
		{/snippet}
	</AppBar>
{/snippet}

{#snippet PopUpCard()}
	<form
		onsubmit={handleSubmit}
		class="card bg-surface-900/90 right-0 bottom-0 left-0 z-200 m-4 w-full space-y-3 p-3 backdrop-blur-xl"
		transition:fly={{ y: 100, duration: 300 }}
	>
		<header class="flex justify-between">
			<p class="text-xl font-bold">Add Item</p>
			<button
				class="btn-icon preset-filled hover:preset-tonal rounded-full"
				onclick={() => {
					openPopup = !openPopup;
				}}><X /></button
			>
		</header>
		<div class="input-group grid-cols-auto">
			<input
				form="input[]"
				class="ig-input bg-primary-500/20"
				bind:value={sharedItem.title}
				type="text"
				required
				placeholder="Title"
			/>
		</div>
		<!-- <div>
			{#each imageFile as file}
				<img alt="uploaded" class="h-12 w-12" src={'/' + file.name} />
			{/each}
		</div> -->
		<textarea
			class="textarea input-group bg-primary-500/20 ig-input"
			rows="3"
			placeholder="Detail."
			bind:value={sharedItem.text}
		></textarea>
		{@render Fileupload()}

		<span class="flex justify-center">OR</span>

		<div class="input-group bg-primary-500/20 grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal w-fit"><Link class="h-4 w-4" /></div>
			<input
				class="ig-input"
				bind:value={url}
				oninput={handleSubmit}
				type="url"
				placeholder="www.example.com"
			/>
		</div>

		<article>
			<button
				type="submit"
				class="btn preset-filled w-full p-3"
				onclick={() => {
					console.log(url);
					if (url !== '' && ogData) {
						if (ogData.image === '') {
							sharedItem.img = noImageUrl;
						} else {
							sharedItem.img = ogData.image;
						}
						sharedItem.title = ogData.title;
						sharedItem.link = ogData.description;
						sharedItem.text = ogData.siteName;
						localItems.current.push(sharedItem);
						openPopup = false;
					} else if (sharedItem.title !== '' && sharedItem.text !== '') {
						if (sharedItem.img === '') {
							sharedItem.img = noImageUrl;
						}
						localItems.current.push(sharedItem);
						openPopup = false;
					} else {
						console.log('Important Fields Empty');
					}
				}}>Add Item</button
			>
		</article>
	</form>
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
