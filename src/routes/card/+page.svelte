<script lang="ts">
	import { page } from '$app/state';
	import { cardPage } from '$lib/shared.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { blur, slide } from 'svelte/transition';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { onMount } from 'svelte';
	import { Image } from '@unpic/svelte';

	const imgError = (e: any) => (e.target.src = NoImageUrl);
</script>

<div transition:blur class="justify-top z-10 flex h-screen flex-col items-start">
	<div class="z-5">
		<a href={cardPage.url} target="_blank" class="my-2">
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<!-- <img
				src={cardPage.img}
				onerror={imgError}
				alt="Card Image"
				class="h-fit w-fit rounded-xl object-cover shadow-lg"
			/> -->
			<Image
				src={cardPage.img}
				onerror={imgError}
				alt="Card Image"
				class="h-fit w-fit rounded-xl object-cover shadow-lg"
			/>
		</a>
		<div class="p-2">
			<h2 class="mb-2 text-xl font-bold">{cardPage.title}</h2>
			<a href={cardPage.url} target="_blank" class="text-primary-300 text-sm">{cardPage.url}</a>
			<p class="text-lg">{cardPage.text}</p>
		</div>
		<button
			transition:slide
			onclick={() => {
				history.back();
			}}
			class="btn bg-primary-800/50 fixed bottom-2 z-10 w-[94%] rounded-lg"
		>
			<ArrowLeft />
			Go Back
		</button>
	</div>
	<div class="z-0 bg-black">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img
			src={cardPage.img}
			onerror={imgError}
			alt="Card Image"
			class="fixed inset-0 z-0 h-full w-full object-cover opacity-40 blur-2xl"
		/>
	</div>
</div>
