<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { Navigation, AppBar, Popover } from '@skeletonlabs/skeleton-svelte';
	import Icon from '@iconify/svelte';
	// Icons
	import AppBarC from '$lib/components/AppBarC.svelte';
	import {
		ArrowLeft,
		Bolt,
		BookHeart,
		CircleDashed,
		Columns2,
		Home,
		LayoutGrid,
		Plus,
		Settings2,
		StretchHorizontal,
		X
	} from 'lucide-svelte';
	import { page } from '$app/state';
	import { fade, fly, slide } from 'svelte/transition';
	import { home } from '../lib/shared.svelte';
	// State

	let openPopup = $state(false);
	$effect(() => {
		console.log('Navigation value:', home.pageTitle);
		console.log(home.homeLayout);
	});
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
	<div class="border-primary-200 sticky bottom-0 z-10 grid grid-rows-[1fr_auto]">
		<!-- Component -->
		{#if page.route.id === '/tabs/home' || page.route.id === '/tabs/space'}
			<div in:slide={{ delay: 0, axis: 'y' }}>
				<Navigation.Bar
					classes="bg-surface-950/80 backdrop-blur-xl"
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
							class="btn-icon preset-outlined-primary-500 z-20 h-6 rounded-2xl px-10"
						>
							<Plus />
						</button>
					</div>

					<Navigation.Tile
						active=" border-1 border-primary-200 bg-primary-900/50 "
						rounded="rounded-3xl rounded-b-lg rounded-r-lg"
						href="/tabs/space/"
						id="Space"
						label="Space"><CircleDashed /></Navigation.Tile
					>
				</Navigation.Bar>
			</div>
		{/if}
	</div>
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

{#snippet PopUp()}
	<Popover
		open={openPopup}
		onOpenChange={(e) => (openPopup = e.open)}
		positioning={{ placement: 'top' }}
		triggerBase="btn "
		contentBase=" card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
		arrow
		arrowBackground="!bg-surface-200 dark:!bg-surface-800"
	>
		{#snippet trigger()}{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<p class="text-xl font-bold">Popover Example</p>
				<button
					class="btn-icon hover:preset-tonal"
					onclick={() => {
						openPopup = !openPopup;
					}}><X /></button
				>
			</header>
			<article>
				<p class="opacity-60">
					This will display a basic popover with a header and body. This also includes a title,
					description, and close button.
				</p>
			</article>
		{/snippet}
	</Popover>
{/snippet}
