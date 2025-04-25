<script lang="ts">
	// import { Pageprops } from './$types';

	let {
		img = 'https://picsum.photos/200',
		h6 = 'Announcements',
		h1 = 'Skeleton is Awesome',
		p = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
		fL = 'Posted by Admin',
		fR = new Date().toLocaleDateString(),
		full = false
	}: {
		img?: string;
		h6?: String;
		h1?: string;
		p?: String;
		fL?: string;
		fR?: string;
		full?: boolean;
	} = $props();
	let date = new Date().toLocaleDateString();
</script>

<a
	href="/"
	class="card-link card bg-surface-900 border-surface-200-800 card-hover divide-surface-200-800 block overflow-hidden border-[2px]"
>
	{#if full}
		<div class="divide-primary-500/60 divide-y-2">
			<header>
				<img src={img} class="aspect-video w-full" alt="card-preview" />
			</header>
			<article class=" px-3 py-1">
				<div>
					<p class="p">{h1}</p>
				</div>
				<small class="overflow-hidden opacity-60">{p}</small>
			</article>
			<footer class=" flex items-center justify-between px-3 py-1">
				<small class="text-justify opacity-60">{fL}</small>
				<small class="opacity-60">On {fR}</small>
			</footer>
		</div>
	{:else}
		<div
			class=" card border-surface-200-800 card-hover block h-30 w-full overflow-hidden rounded-xl border-[0.5px] shadow-lg"
		>
			<img src={img} class="h-full w-full" alt="card-preview" />

			<article class="relative bottom-13 p-1">
				<span class="-space-y-2">
					<p class="p">{h1}</p>
					<small class="opacity-60">{fL}</small>
				</span>

				<!-- <small class="text-justify opacity-60">{p}</small> -->
			</article>

			<!-- <footer class="flex items-center justify-between gap-4 p-4">
    <small class="opacity-60">On {fR}</small>
    </footer> -->
		</div>
	{/if}
</a>
