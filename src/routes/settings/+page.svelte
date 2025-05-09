<script lang="ts">
	import {
		ArrowLeft,
		Club,
		Diamond,
		Heart,
		Spade,
		Trash,
		Settings,
		DownloadCloud,

		ArrowDownFromLine,

		ArrowUpFromLine


	} from 'lucide-svelte';
	import type { PageData } from '../$types';
	import { Accordion, Switch } from '@skeletonlabs/skeleton-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { first, localItems, localSpaces } from '$lib/shared.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { Info } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
	let disturb = $state(false);
	let notifications = $state(true);
	let disabled = $state(false);
	let formatDialogue = $state(false);
	let value = $state(['1']);
	function DeleteEverything() {
		localItems.current = [];
		localSpaces.current = [];
		first.current = true;
	}
</script>

<main
	in:slide={{ delay: 0 }}
	class="flex flex-grow flex-col items-center justify-center space-y-4 p-1"
>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border-[1px] p-4">
		<Accordion {value} onValueChange={(e) => (value = e.value)} multiple>
			<Accordion.Item value="1">
				{#snippet lead()}<Settings size={24} />{/snippet}
				{#snippet control()}
				General
				<p class="text-xs text-gray-400">
					Manage your settings and preferences.
				</p>
				{/snippet}
				{#snippet panel()}
					<div>
						<section class="w-full space-y-4">
							<div class="flex items-center justify-between gap-4">
								<p>Default to the inactive state.</p>
								<Switch
									name="disturb"
									checked={disturb}
									onCheckedChange={(e) => (disturb = e.checked)}
								></Switch>
							</div>
							<hr class="hr" />
							
						</section>
					</div>
				{/snippet}
			</Accordion.Item>

			<hr class="hr" />
			<Accordion.Item value="2" classes="text-green-400">
				{#snippet lead()}<DownloadCloud class="" size={24} />{/snippet}
				{#snippet control()}
					<p class="">Backup</p>
					<p class="text-xs text-gray-400">
						Backup your data to a file or import from a file.
					</p>
				{/snippet}
				{#snippet panel()}
					<div class="btn flex items-stretch justify-around text-red-400">
						<button
							onclick={() => { 
								const input = document.createElement('input');
								input.type = 'file';
								input.accept = '.json';
								input.onchange = (e) => {
									const file:any = e.target?.files[0];
									console.log(file.result);
									if (file.type !== 'application/json') {
										toast('Invalid file type!', {
											icon: '⚠️',
											style: 'border-radius: 200px; background: #333; color: #fff;'
										});
										return;
									}
									
									const reader = new FileReader();
									reader.onload = (event) => {
										console.log(event.target);
										if (event.target && typeof event.target.result === 'string') {
											const data = JSON.parse(event.target.result);
											localItems.current = data;
											toast('Data Imported!', {
												icon: '✅',
												style: 'border-radius: 200px; background: #333; color: #fff;'
											});
										} else {
											toast('Failed to import data!', {
												icon: '⚠️',
												style: 'border-radius: 200px; background: #333; color: #fff;'
											});
										}
										
										localItems.current = data;
										toast('Data Imported!', {
											icon: '✅',
											style: 'border-radius: 200px; background: #333; color: #fff;'
										});
									};
									reader.readAsText(file);
								};
								input.click();
								goto('/tabs/home');
							}}
							class="btn w-full bg-yellow-100/10 text-lg text-yellow-200"><ArrowUpFromLine/> Import</button
						>
						<button
							onclick={() => {
								if (localItems.current.length === 0) {
									toast('Nothing to export!', {
										icon: '⚠️',
										style: 'border-radius: 200px; background: #333; color: #fff;'
									});
									return;
								}
								const data = JSON.stringify(localItems.current)
								const blob = new Blob([data], { type: 'application/json' });
								const url = URL.createObjectURL(blob);
								const a = document.createElement('a');
								a.href = url;
								a.download = 'glovebox_backup.json';
								document.body.appendChild(a);
								a.click();
								document.body.removeChild(a);
							}}
							class="btn w-full bg-cyan-200/10 text-lg text-cyan-400">Export<ArrowDownFromLine/></button
						>
					</div>
				{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<Accordion.Item value="3" classes="text-red-400">
				{#snippet lead()}<Trash class="" size={24} />{/snippet}
				{#snippet control()}
					<p class="">Format Data</p>
					<p class="text-xs text-gray-400">
						Warning: This will delete all your data and cannot be undone.
					</p>
				{/snippet}
				{#snippet panel()}
					<div class="btn flex items-center justify-center">
						<button
							onclick={() => {
								formatDialogue = true;
							}}
							class="btn w-full p-2 bg-red-300/10">Delete Everything</button
						>
					</div>
				{/snippet}
			</Accordion.Item>
		</Accordion>
	</div>
	<div>
		<button
			in:fly={{ delay: 0, y: 100 }}
			type="button"
			class=" bg-primary-950/70 fixed bottom-0 left-0 h-[7%] w-[100%] backdrop-blur-xs"
			onclick={() => {
				history.back();
			}}
		>
			<span class="flex items-stretch justify-around">
				<ArrowLeft class="size-8" />
				<h3 class="h4">Go Back</h3>
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<div class="size-8" />
			</span>
		</button>
	</div>
	{#if formatDialogue}
		<div
			transition:fade
			class="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		>
			{@render FormatDialogue()}
		</div>
	{/if}
</main>

{#snippet FormatDialogue()}
	<div class="card bg-primary-300/5 m-4 w-full max-w-md px-4 py-8 text-center">
		<div class="flex flex-col items-center justify-center gap-4">
			<p class="text-center text-xl font-bold">Are you sure you want to delete everything?</p>
			<div class="flex w-full items-center justify-around gap-4">
				<button
					onclick={() => {
						DeleteEverything();
						formatDialogue = false;
						goto('/tabs/home');
						toast('Everything Wiped!', {
							icon: '⚠️',
							style: 'border-radius: 200px; background: #333; color: #fff;'
						});
					}}
					class="btn btn-primary h-[40%] w-full bg-red-300/20 p-2 text-lg font-bold text-red-400"
					>Yes</button
				>
				<button
					onclick={() => {
						formatDialogue = false;
					}}
					class="btn btn-secondary w-full bg-green-300/20 p-2 text-lg font-bold text-green-300"
					>No</button
				>
			</div>
		</div>
	</div>
{/snippet}
