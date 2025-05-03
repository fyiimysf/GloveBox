<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl font-bold">Card Details</h1>
	<p class="text-lg">This is the card details page.</p>
	<p class="text-lg">Card ID: s</p>
	<a href="/card" class="mt-4 text-blue-500 hover:underline">Back to Cards</a>
	<div class="mt-4">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<enhanced:img
			src="/path/to/card-image.jpg"
			alt="Card Image"
			class="h-64 w-64 rounded-lg object-cover shadow-lg"
		>
		</enhanced:img>
	</div>
</div>
