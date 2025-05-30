<script>
	// @ts-nocheck

	import { space } from '$lib/shared.svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	let align = $state('purple');
</script>

<div class="flex w-full justify-center">
	<Segment
		classes="overflow-x-auto"
		name="align"
		value={align}
		indicatorBg="bg-{align}-400 "
		indicatorText="text-surface-900"
		onValueChange={(e) => {
			align = e.value;
			space.clr = e.value;
		}}
	>
		<Segment.Item value="purple">
			<div class="badge bg-purple-400">P</div>
		</Segment.Item>
		<Segment.Item value="red">
			<div class="badge bg-red-400">R</div>
		</Segment.Item>
		<Segment.Item value="green">
			<div class="badge bg-green-400">G</div>
		</Segment.Item>
		<Segment.Item value="blue">
			<div class="badge bg-blue-400">B</div>
		</Segment.Item>
		<Segment.Item value="yellow">
			<div class="badge bg-yellow-400">Y</div>
		</Segment.Item>

		<Segment.Item value="orange">
			<div class="badge bg-orange-400">O</div>
		</Segment.Item>

		<Segment.Item value="pink">
			<div class="badge bg-pink-400">Pi</div>
		</Segment.Item>
	</Segment>
</div>
