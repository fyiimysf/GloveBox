import { page } from '$app/state';
import { LocalStorage } from './storage.svelte';
import noImageUrl from '$lib/assets/no-image.png';
import type { Color } from '@iconify/utils/lib/colors/types.mjs';
import type { ComboboxData } from './types';
import type { Combobox } from '@skeletonlabs/skeleton-svelte';

// place files you want to import through the `$lib` alias in this folder.

export function haptic(type: 'light' | 'medium' | 'heavy' = 'light') {
	if (!navigator.vibrate) return;
	navigator.vibrate(type === 'light' ? 10 : type === 'medium' ? 25 : 50);
}

export const firstTime = $state({ value: true });

export const comboboxData: ComboboxData[] = [
	{ label: 'Mona', value: 'mona', color: 'text-purple-500' },
	{ label: 'Nosh', value: 'nosh', color: 'text-red-500' },
	{ label: 'Vox', value: 'vox', color: 'text-pink-500' },
	{ label: 'Mint', value: 'mint', color: 'text-green-500' },
	{ label: 'Vintage', value: 'vintage', color: 'text-orange-500' },
	{ label: 'Modern', value: 'modern', color: 'text-blue-500' },
	{ label: 'Wintry', value: 'wintry', color: 'text-green-500' },
	{ label: 'Crimson', value: 'crimson', color: 'text-green-500' },
	{ label: 'Pine', value: 'pine', color: 'text-green-500' }
];

export const selectedTheme = $state({
	theme: { label: '', value: '', color: '' },
	selected: ['']
});

export const home = $state({
	homeLayout: false,
	savedLayout: false,
	spaceviewLayout: false,
	pageTitle: 'Home',
	selectMode: false,
	selectedTitles: [] as string[],
	reorderMode: false
});

export const spaceSelect = $state<{
	selectMode: boolean;
	selectedNames: string[];
	expandAll: boolean;
}>({
	selectMode: false,
	selectedNames: [],
	expandAll: false
});

export const confirmState = $state<{
	open: boolean;
	title: string;
	message: string;
	confirmText: string;
	onConfirm: (() => void) | null;
}>({
	open: false,
	title: 'Confirm',
	message: 'Are you sure?',
	confirmText: 'Delete',
	onConfirm: null
});

export const sheetState = $state<{
	open: boolean;
	data: any | null;
	spacePicker: boolean;
}>({
	open: false,
	data: null,
	spacePicker: false
});

export const onboardingView = $state({ active: false });

export const spaceview: { pageTitle: string; clr: string; viewItems: any; reorderMode: boolean } = $state({
	pageTitle: '',
	clr: 'purple',
	viewItems: [],
	reorderMode: false
});

export const sharedItem: {
	title: string;
	img: any;
	images: string[];
	link: string;
	text: string;
	date: string;
	url: string;
	pinned: boolean;
} = $state({
	title: '',
	img: noImageUrl,
	images: [],
	link: '',
	text: '',
	url: '',
	date: new Date().toLocaleDateString(),
	pinned: false
});

export const cardPage: {
	title: string;
	img: any;
	images: string[];
	link: string;
	text: string;
	date: string;
	url: string;
	pinned: boolean;
	pinnedInSpace: boolean;
	space: string;
} = $state({
	title: '',
	img: noImageUrl,
	images: [],
	link: '',
	text: '',
	url: '',
	date: new Date().toLocaleDateString(),
	pinned: false,
	pinnedInSpace: false,
	space: ''
});

	export function restoreCardPage(): void {
		try {
			if (typeof sessionStorage !== 'undefined') {
				const saved = sessionStorage.getItem('cardPage');
				if (saved) {
					const data = JSON.parse(saved);
					cardPage.title = data.title || cardPage.title;
					cardPage.img = data.img || cardPage.img;
					cardPage.images = data.images || (data.img ? [data.img] : []);
					cardPage.link = data.link || cardPage.link;
					cardPage.text = data.text || cardPage.text;
					cardPage.date = data.date || cardPage.date;
					cardPage.url = data.url || cardPage.url;
				cardPage.pinned = data.pinned ?? cardPage.pinned;
				cardPage.pinnedInSpace = data.pinnedInSpace ?? cardPage.pinnedInSpace;
				cardPage.space = data.space ?? cardPage.space;
			}
			}
		} catch {}
	}

export function saveCardPage(): void {
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.setItem(
			'cardPage',
			JSON.stringify({
				title: cardPage.title,
				img: cardPage.img,
				images: cardPage.images,
				link: cardPage.link,
				text: cardPage.text,
				date: cardPage.date,
				url: cardPage.url,
				pinned: cardPage.pinned,
				pinnedInSpace: cardPage.pinnedInSpace,
				space: cardPage.space
			})
		);
	}
}

export function saveSpaceviewName(name: string): void {
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.setItem('spaceviewName', name);
	}
}

export const space: { name: string; clr: string; desc: string } = $state({
	name: '',
	clr: 'purple',
	desc: '',
	items: []
});

export const localItems = new LocalStorage('localItems', []);

export const localSpaces = new LocalStorage('localSpaces', []);

export const data_theme = new LocalStorage('dataTheme', {
	label: 'Mona',
	value: 'mona',
	color: 'text-purple-500'
});

export const first = new LocalStorage('first', true);

export const shareTarget = $state<{ current: { url: string; title: string; text: string } | null }>(
	{ current: null }
);

export function truncate(str: string, max: number = 30): string {
	return str.length > max ? str.slice(0, max) + '…' : str;
}

let undoTimeout: ReturnType<typeof setTimeout> | null = null;

export const undoState = $state<{
	pending: boolean;
	message: string;
	action: 'delete' | 'remove-from-space' | 'delete-space';
	deletedItems: any[];
	deletedSpaces: any[];
	spaceMappings: Array<{ spaceName: string; items: any[] }>;
	spaceName?: string;
}>({
	pending: false,
	message: '',
	action: 'delete',
	deletedItems: [],
	deletedSpaces: [],
	spaceMappings: []
});

export function setUndo(
	message: string,
	deletedItems: any[],
	spaceMappings: Array<{ spaceName: string; items: any[] }> = []
) {
	clearUndo();
	undoState.message = message;
	undoState.deletedItems = deletedItems;
	undoState.spaceMappings = spaceMappings;
	undoState.action = 'delete';
	undoState.pending = true;
	undoTimeout = setTimeout(() => {
		undoState.pending = false;
		undoState.deletedItems = [];
		undoState.spaceMappings = [];
	}, 5000);
}

export function setUndoRemove(message: string, deletedItems: any[], spaceName: string) {
	clearUndo();
	undoState.message = message;
	undoState.deletedItems = deletedItems;
	undoState.action = 'remove-from-space';
	undoState.spaceName = spaceName;
	undoState.pending = true;
	undoTimeout = setTimeout(() => {
		undoState.pending = false;
		undoState.deletedItems = [];
		undoState.spaceName = '';
	}, 5000);
}

export function clearUndo() {
	if (undoTimeout) {
		clearTimeout(undoTimeout);
		undoTimeout = null;
	}
	undoState.pending = false;
	undoState.deletedItems = [];
	undoState.deletedSpaces = [];
	undoState.spaceMappings = [];
}

export function setUndoDeleteSpace(message: string, deletedSpaces: any[]) {
	clearUndo();
	undoState.message = message;
	undoState.deletedSpaces = deletedSpaces;
	undoState.action = 'delete-space';
	undoState.pending = true;
	undoTimeout = setTimeout(() => {
		undoState.pending = false;
		undoState.deletedSpaces = [];
	}, 5000);
}

export function togglePinSelectedItems(context: 'home' | 'space' = 'home'): void {
	try {
		const titles = home.selectedTitles;
		if (titles.length === 0) return;

		if (context === 'home') {
			const items = localItems.current.filter((i: any) => titles.includes(i.title));
			if (items.length === 0) return;
			const allPinned = items.every((i: any) => i.pinned);
			localItems.current.forEach((item: any) => {
				if (titles.includes(item.title)) item.pinned = !allPinned;
			});
		} else if (context === 'space') {
			const space = localSpaces.current.find((s: any) => s.name === spaceview.pageTitle);
			if (!space) return;
			const items = space.items.filter((i: any) => titles.includes(i.title));
			if (items.length === 0) return;
			const allPinned = items.every((i: any) => i.pinnedInSpace);
			space.items.forEach((item: any) => {
				if (titles.includes(item.title)) item.pinnedInSpace = !allPinned;
			});
		}

		home.selectedTitles = [];
		home.selectMode = false;
	} catch (err) {
		console.error('Failed to toggle pin:', err);
		home.selectedTitles = [];
		home.selectMode = false;
	}
}

export function performUndo() {
	if (!undoState.pending) return;
	try {
		if (undoState.action === 'delete') {
			const currentItems = [...localItems.current];
			for (const item of undoState.deletedItems) {
				if (!currentItems.some((i: any) => i.title === item.title)) {
					currentItems.push(item);
				}
			}
			localItems.current = currentItems;

			for (const { spaceName, items } of undoState.spaceMappings) {
				const space = localSpaces.current.find((s: any) => s.name === spaceName);
				if (space) {
					for (const item of items) {
						if (!space.items.some((i: any) => i.title === item.title)) {
							space.items.push(item);
						}
					}
				}
			}

			clearUndo();
		} else if (undoState.action === 'remove-from-space') {
			const space = localSpaces.current.find((s: any) => (s as any).name === undoState.spaceName);
			if (space) {
				for (const item of undoState.deletedItems) {
					if (!space.items.some((i: any) => i.title === item.title)) {
						space.items.push(item);
					}
				}
			}
			clearUndo();
		} else if (undoState.action === 'delete-space') {
			const currentSpaces = [...localSpaces.current];
			for (const spc of undoState.deletedSpaces) {
				if (!currentSpaces.some((s: any) => s.name === spc.name)) {
					currentSpaces.push(spc);
				}
			}
			localSpaces.current = currentSpaces;
			clearUndo();
		}
	} catch (err) {
		console.error('Undo failed:', err);
		clearUndo();
	}
}

export function scrollableVignette(node: HTMLElement, direction: 'horizontal' | 'vertical' = 'horizontal'): { destroy: () => void } {
	function update() {
		if (direction === 'horizontal') {
			const canScrollLeft = node.scrollLeft > 0;
			const canScrollRight = node.scrollLeft + node.clientWidth < node.scrollWidth;
			if (canScrollLeft && canScrollRight) {
				const g = 'linear-gradient(to right, transparent 4%, black 10%, black 90%, transparent 96%)';
				node.style.setProperty('-webkit-mask-image', g);
				node.style.setProperty('mask-image', g);
			} else if (canScrollLeft) {
				const g = 'linear-gradient(to right, transparent 4%, black 10%)';
				node.style.setProperty('-webkit-mask-image', g);
				node.style.setProperty('mask-image', g);
			} else if (canScrollRight) {
				const g = 'linear-gradient(to right, black 90%, transparent 96%)';
				node.style.setProperty('-webkit-mask-image', g);
				node.style.setProperty('mask-image', g);
			} else {
				node.style.removeProperty('-webkit-mask-image');
				node.style.removeProperty('mask-image');
			}
		} else {
			const canScrollUp = node.scrollTop > 0;
			const canScrollDown = node.scrollTop + node.clientHeight < node.scrollHeight;
			if (canScrollUp && canScrollDown) {
				const g = 'linear-gradient(to bottom, transparent 4%, black 10%, black 90%, transparent 96%)';
				node.style.setProperty('-webkit-mask-image', g);
				node.style.setProperty('mask-image', g);
			} else if (canScrollUp) {
				const g = 'linear-gradient(to bottom, transparent 4%, black 10%)';
				node.style.setProperty('-webkit-mask-image', g);
				node.style.setProperty('mask-image', g);
			} else if (canScrollDown) {
				const g = 'linear-gradient(to bottom, black 90%, transparent 96%)';
				node.style.setProperty('-webkit-mask-image', g);
				node.style.setProperty('mask-image', g);
			} else {
				node.style.removeProperty('-webkit-mask-image');
				node.style.removeProperty('mask-image');
			}
		}
	}
	const ro = new ResizeObserver(update);
	ro.observe(node);
	const mo = new MutationObserver(update);
	mo.observe(node, { childList: true, subtree: true, characterData: true });
	node.addEventListener('scroll', update, { passive: true });
	update();
	return {
		destroy() {
			ro.disconnect();
			mo.disconnect();
			node.removeEventListener('scroll', update);
		}
	};
}

export function longpress(node: HTMLElement, options: (() => void) | { onFirst?: () => void; onSecond?: () => void }) {
	let timer: ReturnType<typeof setTimeout> | null = null;
	let secondTimer: ReturnType<typeof setTimeout> | null = null;
	let triggered = false;
	let secondTriggered = false;
	let startX = 0;
	let startY = 0;

	const onFirst = typeof options === 'function' ? options : options.onFirst;
	const onSecond = typeof options === 'function' ? undefined : options.onSecond;

	function cancel() {
		if (timer) { clearTimeout(timer); timer = null; }
		if (secondTimer) { clearTimeout(secondTimer); secondTimer = null; }
	}

	function handlePointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		triggered = false;
		secondTriggered = false;
		startX = e.clientX;
		startY = e.clientY;
		timer = setTimeout(() => {
			triggered = true;
			haptic('medium');
			if (onFirst) onFirst();
			if (onSecond) {
				secondTimer = setTimeout(() => {
					secondTriggered = true;
					haptic('heavy');
					onSecond();
				}, 400);
			}
		}, 400);
	}

	function handlePointerUp() { cancel(); }
	function handlePointerCancel() { cancel(); }
	function handlePointerLeave() { cancel(); }

	function handlePointerMove(e: PointerEvent) {
		if (!timer) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		if (dx * dx + dy * dy > 100) cancel();
	}

	function handleClickCapture(e: MouseEvent) {
		if (triggered || secondTriggered) {
			e.stopPropagation();
			e.preventDefault();
			triggered = false;
			secondTriggered = false;
		}
	}

	function handleContextMenu(e: Event) {
		if (triggered || secondTriggered) e.preventDefault();
	}

	node.addEventListener('pointerdown', handlePointerDown);
	node.addEventListener('pointerup', handlePointerUp);
	node.addEventListener('pointercancel', handlePointerCancel);
	node.addEventListener('pointerleave', handlePointerLeave);
	node.addEventListener('pointermove', handlePointerMove);
	node.addEventListener('click', handleClickCapture, true);
	node.addEventListener('contextmenu', handleContextMenu);

	return {
		destroy() {
			node.removeEventListener('pointerdown', handlePointerDown);
			node.removeEventListener('pointerup', handlePointerUp);
			node.removeEventListener('pointercancel', handlePointerCancel);
			node.removeEventListener('pointerleave', handlePointerLeave);
			node.removeEventListener('pointermove', handlePointerMove);
			node.removeEventListener('click', handleClickCapture, true);
			node.removeEventListener('contextmenu', handleContextMenu);
		}
	};
}
