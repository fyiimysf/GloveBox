import { page } from '$app/state';
import { LocalStorage } from './storage.svelte';
import noImageUrl from '$lib/assets/no-image.png';
import type { Color } from '@iconify/utils/lib/colors/types.mjs';
import type { Space } from './types';

// place files you want to import through the `$lib` alias in this folder.

export const firstTime = $state({ value: true });

export const home = $state({
	homeLayout: false,
	savedLayout: false,
	spaceviewLayout: false,
	spaceDelete: false,
	pageTitle: 'Home'
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

export const space: { name: string; clr: string; desc: string } = $state({
	name: '',
	clr: 'purple',
	desc: '',
	items: []
});

export const localItems = new LocalStorage('localItems', []);

export const localSpaces = new LocalStorage('localSpaces', []);

export const first = new LocalStorage('first', true);
