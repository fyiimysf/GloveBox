<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { shareTarget } from '$lib/shared.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const url = page.url.searchParams.get('url') || '';
		const title = page.url.searchParams.get('title') || '';
		const text = page.url.searchParams.get('text') || '';

		shareTarget.current = { url, title, text };

		goto('/tabs/home');
	});
</script>
