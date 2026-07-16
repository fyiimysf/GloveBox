<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		text,
		delay = 300,
		children
	}: {
		text: string;
		delay?: number;
		children: Snippet;
	} = $props();

	let visible = $state(false);
	let timeout: ReturnType<typeof setTimeout> | null = null;

	function show() {
		timeout = setTimeout(() => {
			visible = true;
		}, delay);
	}

	function hide() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		visible = false;
	}

	function tooltipAction(node: HTMLElement) {
		let touchTimeout: ReturnType<typeof setTimeout> | null = null;

		function onTouchStart(e: TouchEvent) {
			touchTimeout = setTimeout(() => {
				visible = true;
			}, 500);
		}

		function onTouchEnd() {
			if (touchTimeout) {
				clearTimeout(touchTimeout);
				touchTimeout = null;
			}
			visible = false;
		}

		node.addEventListener('touchstart', onTouchStart, { passive: true });
		node.addEventListener('touchend', onTouchEnd);
		node.addEventListener('touchcancel', onTouchEnd);

		return {
			destroy() {
				node.removeEventListener('touchstart', onTouchStart);
				node.removeEventListener('touchend', onTouchEnd);
				node.removeEventListener('touchcancel', onTouchEnd);
				if (touchTimeout) clearTimeout(touchTimeout);
			}
		};
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	use:tooltipAction
	class="tooltip-wrap relative inline-flex"
	onmouseenter={show}
	onmouseleave={hide}
>
	{@render children()}
	{#if visible}
		<span
			class="pointer-events-none absolute bottom-full left-1/2 z-9999 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-xl"
		>
			{text}
			<span class="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
		</span>
	{/if}
</span>

<style>
	.tooltip-wrap {
		position: relative;
		z-index: 1;
	}
</style>
