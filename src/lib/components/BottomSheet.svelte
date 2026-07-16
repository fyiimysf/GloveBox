<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import {
		sheetState,
		localSpaces,
		localItems,
		confirmState,
		spaceview,
		haptic,
		truncate,
		setUndo,
		setUndoRemove
	} from '$lib/shared.svelte';
	import { fade, fly } from 'svelte/transition';
	import {
		ExternalLink,
		Share2,
		Copy,
		CircleOff,
		Pin,
		PinOff,
		CircleDotDashed,
		Trash2,
		ChevronLeft,
		Plus
	} from 'lucide-svelte';

	function removeFromSheetSpace(spaceObj: any) {
		try {
			const deletedItem = sheetState.data;
			spaceObj.items = spaceObj.items.filter((item: any) => item.title !== sheetState.data.title);
			spaceview.viewItems = spaceview.viewItems.filter(
				(item: any) => item.title !== sheetState.data.title
			);
			setUndoRemove(truncate(sheetState.data.title) + ' removed', [deletedItem], spaceObj.name);
			toast.success(truncate(sheetState.data.title) + ' removed', { duration: 2000 });
		} catch (err) {
			console.error('Failed to remove from space:', err);
			toast.error('Failed to remove item', { duration: 2000 });
		}
		sheetState.open = false;
		sheetState.spacePicker = false;
	}

	function confirmRemoveFromSheetSpace(spaceObj: any) {
		confirmState.open = true;
		confirmState.title = 'Remove from ' + spaceObj.name + '?';
		confirmState.message = truncate(sheetState.data.title, 80);
		confirmState.confirmText = 'Remove';
		confirmState.onConfirm = () => removeFromSheetSpace(spaceObj);
	}

	function deleteSheetItem() {
		haptic('medium');
		try {
			const deletedItem = localItems.current.find(
				(i: any) => i.title === sheetState.data.title
			);
			const spaceMappings: Array<{ spaceName: string; items: any[] }> = [];
			for (const spc of localSpaces.current) {
				if (spc.items.some((i: any) => i.title === sheetState.data.title)) {
					spaceMappings.push({ spaceName: spc.name, items: [deletedItem] });
				}
			}
			localItems.current = localItems.current.filter(
				(item: any) => item.title !== sheetState.data.title
			);
			localSpaces.current.forEach((spc: any) => {
				spc.items = spc.items.filter((item: any) => item.title !== sheetState.data.title);
			});
			setUndo(truncate(sheetState.data.title) + ' Deleted', [deletedItem], spaceMappings);
			toast(truncate(sheetState.data.title) + ' Deleted', { icon: '🗑️', duration: 2000 });
		} catch (err) {
			console.error('Failed to delete item:', err);
			toast.error('Failed to delete item', { duration: 2000 });
		}
		sheetState.open = false;
		sheetState.spacePicker = false;
		if (page.route.id === '/card') history.back();
	}

	function confirmDeleteSheetItem() {
		confirmState.open = true;
		confirmState.title = 'Delete Item?';
		confirmState.message = truncate(sheetState.data.title, 80);
		confirmState.confirmText = 'Delete';
		confirmState.onConfirm = deleteSheetItem;
	}

	function addSheetItemToSpace(spaceObj: any) {
		try {
			const exists = spaceObj.items.some(
				(i: any) => i.title === sheetState.data.title
			);
			if (exists) {
				toast.error('Already in ' + spaceObj.name, { duration: 1500 });
			} else {
				spaceObj.items.push(sheetState.data);
				toast.success('Added to ' + spaceObj.name, { duration: 1500 });
			}
		} catch (err) {
			console.error('Failed to add to space:', err);
			toast.error('Failed to add to space', { duration: 2000 });
		}
		sheetState.open = false;
		sheetState.spacePicker = false;
	}

	function toggleSheetPin() {
		haptic('light');
		if (!sheetState.data) return;
		try {
			sheetState.data.pinned = !sheetState.data.pinned;
			const li = localItems.current.find(
				(i: any) => i.title === sheetState.data.title
			);
			if (li) li.pinned = sheetState.data.pinned;
			localSpaces.current.forEach((spc: any) => {
				const si = spc.items.find(
					(i: any) => i.title === sheetState.data.title
				);
				if (si) si.pinned = sheetState.data.pinned;
			});
			toast.success(sheetState.data.pinned ? 'Pinned to top' : 'Unpinned', { duration: 1500 });
		} catch (err) {
			console.error('Failed to toggle pin:', err);
			toast.error('Failed to update pin', { duration: 2000 });
		}
		sheetState.open = false;
		sheetState.spacePicker = false;
	}

	function toggleSheetPinInSpace() {
		haptic('light');
		if (!sheetState.data) return;
		const space = localSpaces.current.find(
			(s: any) => s.name === spaceview.pageTitle
		);
		if (!space) return;
		const si = space.items.find(
			(i: any) => i.title === sheetState.data.title
		);
		if (si) si.pinnedInSpace = !si.pinnedInSpace;
		const pinned = si?.pinnedInSpace ?? false;
		sheetState.data.pinnedInSpace = pinned;
		toast.success(
			pinned ? 'Pinned to ' + spaceview.pageTitle : 'Unpinned from ' + spaceview.pageTitle,
			{ duration: 1500 }
		);
		sheetState.open = false;
		sheetState.spacePicker = false;
	}

	function shareItem(url: string, title: string) {
		if (navigator.share) {
			navigator.share({ title, url }).catch(() => {});
		} else {
			toast.error('Sharing is not supported on this browser', { duration: 2000 });
		}
		sheetState.open = false;
		sheetState.spacePicker = false;
	}

	function copyItemUrl(url: string) {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				toast.success('URL copied to clipboard', { duration: 2000 });
			})
			.catch(() => {
				toast.error('Failed to copy URL', { duration: 2000 });
			});
		sheetState.open = false;
		sheetState.spacePicker = false;
	}

	function closeSheet() {
		haptic('light');
		sheetState.open = false;
		sheetState.spacePicker = false;
	}

	let hasUrl = $derived(sheetState.data?.url !== '');
	let isInSpaceView = $derived(page.route.id === '/tabs/space/spaceview');
	let isInSpace = $derived(
		page.route.id !== '/tabs/space/spaceview' && page.route.id !== '/tabs/space'
	);
</script>

{#if sheetState.open && sheetState.data}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 150 }}
		onclick={() => {
			sheetState.open = false;
			sheetState.spacePicker = false;
		}}
		class="fixed inset-0 z-200 flex items-end justify-center bg-black/60 backdrop-blur-sm"
	>
		<div
			transition:fly={{ duration: 250, y: 200, opacity: 0 }}
			onclick={(e) => e.stopPropagation()}
			class="mx-auto w-full max-w-lg rounded-t-2xl border border-white/10 bg-primary-950/80 shadow-2xl backdrop-blur-xl"
		>
			<div class="flex justify-center pt-3 pb-1">
				<div class="h-1.5 w-12 rounded-full bg-white/20"></div>
			</div>

			<div class="relative overflow-hidden">
				<!-- Main Action View -->
				<div
					class="transition-all duration-200"
					class:opacity-0={sheetState.spacePicker}
					class:pointer-events-none={sheetState.spacePicker}
				>
					<div class="max-h-[65vh] overflow-y-auto">
						<!-- Title -->
						<div class="px-4 pb-2">
							<p class="truncate text-sm font-bold text-white/80">
								{sheetState.data.title}
							</p>
						</div>

						<!-- Row 1: URL actions (horizontal, spaced-between) -->
						{#if hasUrl}
							<div class="flex justify-evenly px-2 pb-2">
								<Tooltip text="Open Link">
									<a
										target="_blank"
										href={sheetState.data.url}
										onclick={() => {
											sheetState.open = false;
											sheetState.spacePicker = false;
										}}
										class="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-6 text-yellow-200 bg-yellow-200/10 transition-all duration-150 hover:bg-white/10 active:scale-95"
									>
										<ExternalLink class="size-6" />
										<!-- <span class="text-[10px] font-medium text-white/60">Open</span> -->
									</a>
								</Tooltip>

								<Tooltip text="Share">
									<button
										onclick={() => {
											haptic('light');
											shareItem(sheetState.data.url, sheetState.data.title);
										}}
										class="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-6 text-green-300 bg-green-300/10 transition-all duration-150 hover:bg-green-500/10 active:scale-95"
									>
										<Share2 class="size-6" />
										<!-- <span class="text-[10px] font-medium text-white/60">Share</span> -->
									</button>
								</Tooltip>

								<Tooltip text="Copy URL">
									<button
										onclick={() => {
											haptic('light');
											copyItemUrl(sheetState.data.url);
										}}
										class="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-6 text-blue-300 bg-blue-300/10 transition-all duration-150 hover:bg-blue-500/10 active:scale-95"
									>
										<Copy class="size-6" />
										<!-- <span class="text-[10px] font-medium text-white/60">Copy</span> -->
									</button>
								</Tooltip>

								{#if isInSpace}
									<Tooltip text="Delete">
										<button
											onclick={() => {
												haptic('medium');
												confirmDeleteSheetItem();
											}}
											class="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-6 text-red-400 bg-red-200/10 transition-all duration-150 hover:bg-red-500/10 active:scale-95"
										>
											<Trash2 class="size-6" />
											<!-- <span class="text-[10px] font-medium text-white/60">Delete</span> -->
										</button>
									</Tooltip>
									{:else}
									
									<Tooltip text={sheetState.data.pinnedInSpace ? 'Unpin' : 'Pin'}>
										<button
										onclick={toggleSheetPinInSpace}
										class="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-6 text-tertiary-300 bg-tertiary-300/10 transition-all duration-150 hover:bg-blue-500/10 active:scale-95"
									>
										{#if sheetState.data.pinnedInSpace}
											<PinOff class="size-6" />
										{:else}
											<Pin class="size-6" />
											{/if}
											<!-- <span class="text-[10px] font-medium text-white/60">
											{sheetState.data.pinnedInSpace ? 'Unpin' : 'Pin'}
											</span> -->
										</button>
									</Tooltip>
									
							{/if}
						</div>
						{/if}

						<!-- Row 2: Space/Pin actions -->
						<div class="flex flex-col w-full justify-evenly px-4 pb-4 gap-2">
							

							<span class="flex  gap-2">
							{#if isInSpace}

						
							<div class="flex w-full flex-col">
							<Tooltip text="Add to Space">
									<button
										onclick={() => {
											haptic('light');
											sheetState.spacePicker = true;
										}}
										class="flex w-full {hasUrl ? 'flex-row w-full justify-center py-3.75 px-5' : 'flex-col justify-center p-2.5'} items-center gap-1.5 rounded-xl  text-white/60 transition-all duration-150 bg-white/10 hover:bg-white/10 active:scale-95"
									>
										<Plus class="size-8" />
										<span class="text-[10px] font-medium text-white/60">Add to Space</span>
									</button>
								</Tooltip>
							</div>
								
								
							<div class='flex w-full flex-col '>
								<Tooltip text={sheetState.data.pinned ? 'Unpin' : 'Pinned to Home'}>
										<button
										onclick={toggleSheetPin}
										class="flex w-full {hasUrl ? 'flex-row w-full justify-center py-4.75' : 'flex-col justify-center py-3.5'} items-center gap-1.5 rounded-xl py-2.5 px-4 text-tertiary-300 transition-all duration-150 bg-tertiary-500/10 hover:bg-tertiary-500/10 active:scale-95"
									>
										{#if sheetState.data.pinned}
											<PinOff class="size-6" />
											{:else}
											<Pin class="size-6" />
										{/if}
										<span class="text-[10px] font-medium text-white/60">
											{sheetState.data.pinned ? 'Unpin' : 'Pin'}
										</span>
									</button>
								</Tooltip>
							</div>
								{/if}
								
								
								{#each localSpaces.current as spaceObj}
								{#each spaceObj.items as obj}
								{#if obj.title === sheetState.data.title}
								<div class='flex w-full flex-col {isInSpaceView ? 'px-[2vw]' : ''} '>
										<Tooltip text="Remove from {spaceObj.name}">
											<button
												onclick={() => confirmRemoveFromSheetSpace(spaceObj)}
												class="flex w-full {hasUrl ? 'flex-row w-full justify-center py-4.25 px-4' : 'flex-col justify-center py-3.5'} items-center gap-1.5 rounded-xl text-{spaceObj.clr}-300 transition-all duration-150 bg-{spaceObj.clr}-400/10 hover:bg-white/10 active:scale-95"
											>
												<CircleOff class="size-6" />
												<span class="  text-[10px] font-medium text-white/60">
													Remove from {spaceObj.name}
												</span>
											</button>
										</Tooltip>
									</div>
										{/if}
										{/each}
										{/each}
									</span>
									
							<div class='flex flex-col w-full'>
								{#if !hasUrl && isInSpace}
								<Tooltip text="Delete">
									<button
										onclick={() => {
											haptic('medium');
											confirmDeleteSheetItem();
										}}
										class="flex w-full flex-row justify-center items-center gap-1.5 rounded-xl py-3 px-5 text-red-400 bg-red-200/10 transition-all duration-150 hover:bg-red-500/10 active:scale-95"
									>
										<Trash2 class="size-6" />
										<span class="text-[10px] font-medium text-white/60">Delete</span>
									</button>
								</Tooltip>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Space Picker View -->
				<div
					class="absolute inset-0 transition-all duration-200"
					class:opacity-0={!sheetState.spacePicker}
					class:pointer-events-none={!sheetState.spacePicker}
				>
					<div class="max-h-[65vh] overflow-y-auto">
						<div class="flex items-center gap-2 px-4 pb-2">
							<button
								onclick={() => {
									haptic('light');
									sheetState.spacePicker = false;
								}}
								class="flex items-center gap-2 text-sm font-bold text-white/60 transition-colors duration-150 hover:text-white"
							>
								<ChevronLeft class="size-5" />
								<span>Add to Space</span>
							</button>
						</div>
						<div class="px-1 pb-4">
							{#each [...localSpaces.current].reverse() as item}
								<button
									onclick={() => {
										haptic('medium');
										addSheetItemToSpace(item);
									}}
									class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition-all duration-150 hover:bg-white/5 active:scale-[0.98]"
								>
									<span class="flex items-center gap-3 truncate">
										<span class="h-3 w-3 shrink-0 rounded-full bg-{item.clr}-400"></span>
										<span class="truncate font-bold">{item.name}</span>
									</span>
									<CircleDotDashed class="size-5 shrink-0 text-white/50" />
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Cancel Button -->
			<div class="px-4 pb-4 pt-1">
				<button
					onclick={closeSheet}
					class="w-full rounded-xl bg-black/15 py-3.5 text-center font-bold text-white/80 transition-all duration-150 hover:bg-white/15 active:scale-[0.98]"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
