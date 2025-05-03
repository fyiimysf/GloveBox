import { page } from '$app/state';
import { LocalStorage } from './storage.svelte';
import noImageUrl from '$lib/assets/no-image.png';
import type { Color } from '@iconify/utils/lib/colors/types.mjs';

// place files you want to import through the `$lib` alias in this folder.
export const home = $state({
	homeLayout: false,
	savedLayout: false,
	pageTitle: 'Home'
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

export const space: { name: string; clr: string; desc: string } = $state({
	name: '',
	clr: 'purple',
	desc: '',
	items: []
});

export const localItems = new LocalStorage('localItems', []);

export const localSpaces = new LocalStorage('localSpaces', []);
