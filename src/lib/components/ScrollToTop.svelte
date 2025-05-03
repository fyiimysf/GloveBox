<!-- Originally posted on https://webjeda.com/blog/back-to-top-svelte-component/ -->
<script>
	/**
	 * @typedef {Object} Props
	 * @property {number} [showAtPixel]
	 */

	/** @type {Props} */
	let { showAtPixel = 2000 } = $props();

	let scrollHeight = $state(0);

	const gotoTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	let showGotoTop = $derived(scrollHeight > showAtPixel);
</script>

{#if showGotoTop}
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button onclick={gotoTop} class="btn-icon fixed bottom-10" title="Go to top"
		><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
			<g fill="none" stroke="currentColor" stroke-width="1.5">
				<path
					fill="white"
					d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"
				/>
				<path stroke-linecap="round" stroke-linejoin="round" d="m15 13.5l-3-3l-3 3" />
			</g>
		</svg></button
	>
{/if}

<svelte:window bind:scrollY={scrollHeight} />
