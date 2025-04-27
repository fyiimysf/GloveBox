import { page } from '$app/state';
import { LocalStorage } from './storage.svelte';
import noImageUrl from '$lib/assets/no-image.png';

// place files you want to import through the `$lib` alias in this folder.
export const home = $state({
	homeLayout: false,
	savedLayout: false,
	pageTitle: 'Home'
});

export const sharedItem: { title: string; img: any; link: string; text: string; date: string } =
	$state({
		title: '',
		img: noImageUrl,
		link: '',
		text: '',
		date: new Date().toLocaleDateString()
	});
export const localItems = new LocalStorage('localItems', []);

export const spaces = new LocalStorage('spaces', []);
