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
		ArrowUpFromLine,
		Palette
	} from 'lucide-svelte';
	import type { PageData } from '../$types';
	import { Accordion, Combobox, Switch } from '@skeletonlabs/skeleton-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import {
		comboboxData,
		data_theme,
		first,
		home,
		localItems,
		localSpaces,
		selectedTheme
	} from '$lib/shared.svelte';
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
		data_theme.current = { label: 'Mona', value: 'mona', color: 'text-purple-500' };
		goto('/tabs/home')
		home.pageTitle = 'Home'
	}
	const colors = [
	'red',
	'blue',
	'green',
	
	'red',
	'blue',
	'green',
	
	'red',
	'blue',
	'green',
	
	];
	let color = $state(colors[0]);

	function setColor(selectedColor: string) {
		color = selectedColor;
	}
</script>

<main
	in:slide={{ delay: 0 }}
	class="flex flex-grow flex-col items-center justify-center space-y-4 p-1"
>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border-[1px] p-4">
		<Accordion {value} onValueChange={(e) => (value = e.value)} multiple>
			<!-- <Accordion.Item value="0">
				{#snippet lead()}<Settings size={24} />{/snippet}
				{#snippet control()}
					General
					<p class="text-xs text-gray-400">Manage your settings and preferences.</p>
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
			</Accordion.Item> -->

			<Accordion.Item value="1">
				{#snippet lead()}<Palette size={24} />{/snippet}
				{#snippet control()}
					Themes
					<p class="text-xs text-gray-400">select a theme you want to apply.</p>
				{/snippet}
				{#snippet panel()}
					<div class="grid gap-2 grid-cols-3 ">
						<!-- Loop through the available colors -->
						{#each comboboxData as c}
							<!-- On selection, set the color state, dynamically update classes -->
							<button
								class={`chip h-12 text-lg capitalize bg-primary-500 ${data_theme.current.value === c.value ? 'preset-filled' : 'preset-tonal'}`}
								onclick={() => {
									data_theme.current = c;
									document.documentElement.setAttribute('data-theme', c.value);
								}}
							>
								<span>{c.label}</span>
							</button>
							{/each}
						</div>
						<button
							class={`chip w-full mt-2 h-12 text-lg capitalize bg-primary-500 ${data_theme.current.value === 'none' ? 'preset-filled' : 'preset-tonal'}`}
							onclick={() => {
								data_theme.current.value = 'none';
								document.documentElement.setAttribute('data-theme', data_theme.current.value);
							}}
						>
							<span>None</span>
						</button>
				{/snippet}
			</Accordion.Item>

			<!-- <hr class="hr" />
			<Accordion.Item value="1">
				{#snippet lead()}<Palette size={24} />{/snippet}
				{#snippet control()}
					Theme
					<p class="text-xs text-gray-400">select a theme you want to apply.</p>
				{/snippet}
				{#snippet panel()}
					<div class="flex w-fit">
						<Combobox
							openOnKeyPress={false}
							allowCustomValue={false}
							defaultValue={selectedTheme.selected}
							data={comboboxData}
							value={[selectedTheme.theme.value]}
							onValueChange={(e) => {
								selectedTheme.selected = e.value;
								selectedTheme.theme =
									comboboxData.find((item) => item.value == e.value) || comboboxData[0];
								document.documentElement.setAttribute('data-theme', selectedTheme.theme.value);
								data_theme.current = selectedTheme.theme;
							}}
							placeholder={data_theme.current.label}
						>
							{#snippet item(item)}
								<div class="flex justify-between space-x-2">
									<span>{item.label}</span>
									<span><Palette class={item.color} /></span>
								</div>
							{/snippet}
						</Combobox>
					</div>
				{/snippet}
			</Accordion.Item> -->
			<hr class="hr" />
			<Accordion.Item value="2" classes="text-green-400">
				{#snippet lead()}<DownloadCloud class="" size={24} />{/snippet}
				{#snippet control()}
					<p class="">Backup</p>
					<p class="text-xs text-gray-400">Backup your data to a file or import from a file.</p>
				{/snippet}
				{#snippet panel()}
					<div class="btn xs:flex-row flex flex-col items-center justify-between text-red-400">
						<button
							onclick={() => {
								const input = document.createElement('input');
								input.type = 'file';
								input.accept = '.json';
								input.onchange = (e) => {
									const file: any = e.target?.files[0];
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
										const data = JSON.parse(event.target.result);
										localItems.current = data;
										toast('Data Imported!', {
											icon: '✅',
											style: 'border-radius: 200px; background: #333; color: #fff;'
										});
										goto('/tabs/home');
									};
									reader.readAsText(file);
								};
								input.click();
							}}
							class="btn w-full bg-yellow-100/10 text-lg text-yellow-200"
							><ArrowDownFromLine /> Import</button
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
								const data = JSON.stringify(localItems.current);
								const blob = new Blob([data], { type: 'application/json' });
								const url = URL.createObjectURL(blob);
								const a = document.createElement('a');
								a.href = url;
								a.download = 'glovebox_backup.json';
								document.body.appendChild(a);
								a.click();
								document.body.removeChild(a);
							}}
							class="btn w-full bg-cyan-200/10 text-lg text-cyan-400"
							>Export<ArrowUpFromLine /></button
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
							class="btn w-full bg-red-300/10 p-2">Delete Everything</button
						>
					</div>
				{/snippet}
			</Accordion.Item>
		</Accordion>
	</div>
	<div></div>
	{#if formatDialogue}
		<div
			transition:fade
			class="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		>
			{@render FormatDialogue()}
		</div>
	{/if}
</main>

<!-- Back Button -->
<button
	in:slide
	onclick={() => {
		history.back();
	}}
	class="btn bg-primary-950/70 fixed bottom-2 z-9 h-10 w-[94%] rounded-lg backdrop-blur"
>
	<ArrowLeft />
	Go Back
</button>

{#snippet FormatDialogue()}
	<div class="card m-4 w-full max-w-md px-4 py-8 text-center">
		<div class="flex flex-col items-center justify-center gap-2">
			<p class="text-center text-2xl font-bold">Delete everything?</p>
			<p class="text-md pb-4 text-center font-mono">can't be undone</p>
			<div class="flex w-full items-center justify-around gap-4">
				<button
					onclick={() => {
						DeleteEverything();
						formatDialogue = false;
						goto('/tabs/home');
						toast('Everything Wiped!', {
							icon: '⚠️',
							style: 'border-radius: 200px; background: #4a3342; color: #fff;'
						});
					}}
					class="btn btn-primary h-[40%] w-full bg-red-300/20 p-2 font-mono text-lg font-bold text-red-400"
					>Yes, Im Sure</button
				>
				<button
					onclick={() => {
						formatDialogue = false;
					}}
					class="btn btn-secondary w-full bg-green-300/20 p-2 font-mono text-lg font-bold text-green-300"
					>No, dont</button
				>
			</div>
		</div>
	</div>
{/snippet}
