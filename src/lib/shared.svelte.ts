import { page } from "$app/state";

// place files you want to import through the `$lib` alias in this folder.
export const home = $state({
    homeLayout: false,
    savedLayout: false,
    pageTitle: 'Home'
});