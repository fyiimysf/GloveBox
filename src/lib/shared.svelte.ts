import { page } from '$app/state';
import { LocalStorage } from './storage.svelte';

// place files you want to import through the `$lib` alias in this folder.
export const home = $state({
	homeLayout: false,
	savedLayout: false,
	pageTitle: 'Home'
});

export const files = new LocalStorage('files', { value: [] });
