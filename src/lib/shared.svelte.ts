import { page } from '$app/state';
import { LocalStorage } from './storage.svelte';

// place files you want to import through the `$lib` alias in this folder.
export const home = $state({
	homeLayout: false,
	savedLayout: false,
	pageTitle: 'Home'
});

export const sharedItem: { title: string; img: any; link: string; text: string } = $state({
	title: '',
	img: '',
	link: '',
	text: '',
	date: ''
});
export const localItems = new LocalStorage('localItems', []);
