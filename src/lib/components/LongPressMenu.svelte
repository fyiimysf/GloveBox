<script>
	import { longpress } from './longpress.js';
	import { press } from 'svelte-gestures';
	let pressed = $state(false);
	let duration = $state(600);
</script>

<label>
	<input type="range" bind:value={duration} max={2000} step={100} />
	{duration}ms
</label>

<div
	class="btn preset-filled"
	use:press={() => ({ timeframe: duration })}
	onpress={() => (pressed = true)}
	onclick={() => (pressed = false)}
>
	<p>press and hold</p>
</div>

{#if pressed}
	<p>congratulations, you pressed and held for {duration}ms</p>
{/if}
