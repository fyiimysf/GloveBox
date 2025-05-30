<script lang="ts">
	import { page } from '$app/state';
	import { cardPage } from '$lib/shared.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { blur, slide } from 'svelte/transition';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { onMount } from 'svelte';
	import { Image } from '@unpic/svelte';
	import { circInOut, elasticIn, expoIn, expoInOut, linear } from 'svelte/easing';

	const imgError = (e: any) => (e.target.src = NoImageUrl);
</script>

<div in:blur class="justify-top z-10 flex h-screen flex-col items-start">
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
				class="h-fit w-fit rounded-lg  object-cover shadow-2xl"
			/>
		</a>
		<div class="p-2">
			<h2 class="mb-2 text-xl font-bold">{cardPage.title}</h2>
			<a href={cardPage.url} target="_blank" class="text-primary-300 flex w-60 truncate text-sm"
				>{cardPage.url}</a
			>
			<p class=" text-md text-wrap">{cardPage.text}</p>
		</div>
	</div>
	<div class="z-0 bg-black">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img
			in:blur={{ delay: 100, duration: 800, easing: expoInOut }}
			src={cardPage.img}
			onerror={imgError}
			alt="Card Image"
			class="fixed inset-0 z-0 h-full w-full object-cover opacity-35 blur-2xl"
		/>
	</div>
</div>

<button
	in:slide
	onclick={() => {
		history.back();
	}}
	class="btn bg-primary-950/70 fixed bottom-2 z-9 h-10 w-[94%] rounded-lg backdrop-blur"
>
	<ArrowLeft />
	Go Back
</button>
