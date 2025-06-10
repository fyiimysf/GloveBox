<script lang="ts">
	import { page } from '$app/state';
	import toast from 'svelte-french-toast';
	import NoImageUrl from '$lib/assets/no-image.png';
	import { cardPage, spaceview } from '$lib/shared.svelte';
	import { blur } from 'svelte/transition';
	import DropDown from './DropDownButton.svelte';
	import { Link } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	// import { Pageprops } from './$types';

	let {
		img = '',
		h6 = '',
		h1 = '',
		p = '',
		fL = '',
		fR = new Date().toLocaleDateString(),
		full = false,
		item = ''
	}: {
		img?: string;
		h6?: String;
		h1?: string;
		p?: String;
		fL?: string;
		fR?: string;
		full?: boolean;
		item?: any;
	} = $props();
	const imgError = (e: any) => (e.target.src = NoImageUrl);
	function CardPage(
		title: string,
		img: any,
		link: string,
		text: string,
		date: string,
		url: string
	) {
		cardPage.title = title;
		cardPage.img = img;
		cardPage.link = link;
		cardPage.text = text;
		cardPage.date = date;
		cardPage.url = url;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={() => {
		// toast('Page yet to be made', {
		// 	icon: '🚧',
		// 	style: 'border-radius: 200px; background: #333; color: #fff;',
		// 	duration: 1000
		// });
		CardPage(item.title, item.img, item.link, item.text, item.date, item.url);
	}}
	class=" card divide-surface-200-800 overflow-hidden "
>
	{#if full}
		<div in:blur class=" bg-surface-900 shadow-lg">
			<div class="absolute m-1 rounded-full shadow-lg">
				<DropDown data={item} />
			</div>
			{#if item.url !== ''}
				<!-- svelte-ignore node_invalid_placement_ssr -->
				<a
					href={item.url}
					target="_blank"
					class=" text-primary-400 absolute right-2 top-2  rounded-full bg-black/5 shadow-lg backdrop-blur-lg"
					><Link class="size-7 p-1" /></a
				>
			{/if}
			<header>
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={img}
					onerror={imgError}
					class="aspect-video w-full object-cover"
					alt="card-preview"
					onclick={() => {
						goto('/card');
					}}
				/>
			</header>
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<article
				onclick={() => {
					goto('/card');
				}}
				class=" px-3 py-1"
			>
				<div>
					<p class="p">{h1}</p>
				</div>
				<small class="overflow-hidden opacity-60 justify-start">{p}</small>
			</article>
			<footer class="bg-black/10 flex items-center justify-between px-3 py-1">
				<small class="text-justify opacity-60">{fL}</small>
				<small class="opacity-60">On {fR}</small>
			</footer>
		</div>
	{:else}
		<div in:blur class="card relative h-27 overflow-hidden rounded-xl shadow-lg">
			{#if page.route.id === 'tabs/space'}
				<div class="absolute z-100 rounded-full shadow-lg">
					<DropDown data={item} />
				</div>
				<!-- svelte-ignore node_invalid_placement_ssr -->
				{#if item.url !== ''}
					<a
						href={item.url}
						target="_blank"
						class=" text-primary-500 absolute right-1 mt-1 rounded-full bg-black/10 backdrop-blur-lg"
						><Link class=" size-6 p-1" /></a
					>
				{/if}
			{/if}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<img
				src={img}
				onerror={imgError}
				class="aspect-video h-full w-full object-cover"
				alt="card-preview"
				onclick={() => {
					goto('/card');
				}}
			/>

			<article class="relative bottom-8 rounded-b-xl bg-primary-900/0 p-1 backdrop-blur-sm">
				<span class="-space-y-2">
					<p class="p truncate px-1">{h1}</p>
					<!-- <small class="w-fit truncate rounded-lg bg-black/20 px-1 opacity-60">{fL}</small> -->
				</span>

				<!-- <small class="text-justify opacity-60">{p}</small> -->
			</article>

			<!-- <footer class="flex items-center justify-between gap-4 p-4">
    <small class="opacity-60">On {fR}</small>
    </footer> -->
		</div>
	{/if}
</div>
