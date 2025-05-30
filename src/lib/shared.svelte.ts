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
    { label: 'Pine', value: 'pine', color: 'text-green-500' },
  ];

export const selectedTheme = $state({
	theme:{ label: '', value: '', color: '' },
	selected: ['']
});


export const home = $state({
	homeLayout: false,
	savedLayout: false,
	spaceviewLayout: false,
	spaceDelete: false,
	pageTitle: 'Home',
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

export const data_theme = new LocalStorage('dataTheme', { label: 'Mona', value: 'mona', color: 'text-purple-500' });

export const first = new LocalStorage('first', true);
