<script lang="ts">
	import { sheetState } from '$lib/shared.svelte';
	import { MoreVertical } from 'lucide-svelte';

	let { data }: { data?: any } = $props();

	function openSheet(e: MouseEvent) {
		e.stopPropagation();
		sheetState.open = true;
		sheetState.data = data;
		sheetState.spacePicker = false;
	}
</script>

<button
	class="text-white p-0.5 "
	type="button"
	onclick={openSheet}
>
	<MoreVertical class="size-5.5 mix-blend-difference backdrop-blur-md rounded-md" />
</button>
