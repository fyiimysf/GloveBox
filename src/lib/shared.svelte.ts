import { page } from '$app/state';
import { LocalStorage } from './storage.svelte';
import noImageUrl from '$lib/assets/no-image.png';
import type { Color } from '@iconify/utils/lib/colors/types.mjs';
import type { Space, ComboboxData } from './types';
import type { Combobox } from '@skeletonlabs/skeleton-svelte';

// place files you want to import through the `$lib` alias in this folder.

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
	spaceDelete: false,
	pageTitle: 'Home',
	selectMode: false,
	selectedTitles: [] as string[]
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

export const spaceview: { pageTitle: string; clr: string; viewItems: any } = $state({
	pageTitle: '',
	clr: 'purple',
	viewItems: []
});

export const sharedItem: {
	title: string;
	img: any;
	link: string;
	text: string;
	date: string;
	url: string;
} = $state({
	title: '',
	img: noImageUrl,
	link: '',
	text: '',
	url: '',
	date: new Date().toLocaleDateString()
});

export const cardPage: {
	title: string;
	img: any;
	link: string;
	text: string;
	date: string;
	url: string;
	space?: Space;
} = $state({
	title: '',
	img: noImageUrl,
	link: '',
	text: '',
	url: '',
	date: new Date().toLocaleDateString()
});

export function restoreCardPage(): void {
	try {
		if (typeof sessionStorage !== 'undefined') {
			const saved = sessionStorage.getItem('cardPage');
			if (saved) {
				const data = JSON.parse(saved);
				cardPage.title = data.title || cardPage.title;
				cardPage.img = data.img || cardPage.img;
				cardPage.link = data.link || cardPage.link;
				cardPage.text = data.text || cardPage.text;
				cardPage.date = data.date || cardPage.date;
				cardPage.url = data.url || cardPage.url;
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
				link: cardPage.link,
				text: cardPage.text,
				date: cardPage.date,
				url: cardPage.url
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
	spaceMappings: Array<{ spaceName: string; items: any[] }>;
	spaceName?: string;
}>({
	pending: false,
	message: '',
	action: 'delete',
	deletedItems: [],
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
	undoState.spaceMappings = [];
}

export function performUndo() {
	if (!undoState.pending) return;

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
	}
}
