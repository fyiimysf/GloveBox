<script lang="ts">
	import { page } from '$app/state';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeft, Bolt, Columns2 } from 'lucide-svelte';
	import type { Component } from 'svelte';
	let {
		title = 'Title',
		children,
		leadChild,
		viewFull
	}: { children?: any; title?: string; leadChild?: any; viewFull: boolean } = $props();
</script>

<AppBar>
	{#snippet headline()}
		{#if page.route.id === '/settings'}
			<center>
				<h1 class="h1 font-bold">Settings</h1>
			</center>
		{:else}
			<center>
				<h1 class="h1 font-bold">{title}</h1>
			</center>
		{/if}
	{/snippet}

	{#snippet lead()}
		{#if page.route.id === '/settings'}
			<ArrowLeft
				onclick={() => {
					history.back();
				}}
				class="h-6 w-6"
			/>
		{:else}
			<Columns2
				onclick={() => {
					viewFull = !viewFull;
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
	{/snippet}
</AppBar>
