<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	let transitioned = $state(false);
</script>

<div>
	<div in:fly={{ delay: 0, x: 100 }} class=" space-y-4">
		<h1>Space</h1>
		<p>This is the space page.</p>
	</div>
</div>
