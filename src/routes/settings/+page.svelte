<script lang="ts">
	import { ArrowLeft, Club, Diamond, Heart, Spade, Trash, Settings } from 'lucide-svelte';
	import type { PageData } from '../$types';
	import { Accordion, Switch } from '@skeletonlabs/skeleton-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { localItems, localSpaces } from '$lib/shared.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';

	let { data }: { data: PageData } = $props();
	let disturb = $state(false);
	let notifications = $state(true);
	let disabled = $state(false);
	let formatDialogue = $state(false);
	let value = $state(['1']);
	function DeleteEverything() {
		localItems.current = [];
		localSpaces.current = [];
	}
	const lorem =
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit esse nisi eligendi fuga! Quas nisi repellat adipisci animi repellendus incidunt laborum sunt qui nesciunt, ducimus saepe sapiente sed ut labore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit esse nisi eligendi fuga! Quas nisi repellat adipisci animi repellendus incidunt laborum sunt qui nesciunt, ducimus saepe sapiente sed ut labore.';
</script>

<main
	in:slide={{ delay: 0 }}
	class="flex flex-grow flex-col items-center justify-center space-y-4 p-1"
>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border-[1px] p-4">
		<Accordion {value} onValueChange={(e) => (value = e.value)} multiple>
			<Accordion.Item value="1">
				<!-- Control -->
				{#snippet lead()}<Settings size={24} />{/snippet}
				{#snippet control()}General{/snippet}
				<!-- Panel -->
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
							<div class="flex items-center justify-between gap-4">
								<p>Default to the active state.</p>
								<Switch
									name="notifications"
									checked={notifications}
									onCheckedChange={(e) => (notifications = e.checked)}
								></Switch>
							</div>
							<hr class="hr" />
							<div class="flex items-center justify-between gap-4">
								<p>Shown in disabled mode.</p>
								<Switch
									disabled={!disabled}
									name="disabled"
									checked={disabled}
									onCheckedChange={(e) => (disabled = e.checked)}
								></Switch>
							</div>
						</section>
					</div>
				{/snippet}
			</Accordion.Item>

			<hr class="hr" />
			<Accordion.Item value="2">
				{#snippet lead()}<Trash class="text-red-400" size={24} />{/snippet}
				{#snippet control()}
					<p class="text-red-400">Format Data</p>
				{/snippet}
				{#snippet panel()}
					<div class="btn flex items-center justify-center text-red-400">
						<button
							onclick={() => {
								formatDialogue = true;
							}}
							class="btn btn-icon-base">Delete Everything</button
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
				<p></p>
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
