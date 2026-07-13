<script lang="ts">
	import avatar from '$lib/assets/avatar.jpg';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeft, ArrowLeftIcon, ArrowUpRightFromSquare, Link2, Github, Instagram, Linkedin, Twitter } from 'lucide-svelte';
	import { blur, slide } from 'svelte/transition';
	import { haptic } from '$lib/shared.svelte';
	let links = {
		repo: 'https://github.com/fyiimysf/GloveBox',
		github: 'https://github.com/fyiimysf',
		linkedIn: 'https://www.linkedin.com/in/yousaf-mohammad',
		insta: 'https://www.instagram.com/uceph.em/',
		blsk: 'https://bsky.app/profile/fyiimysf.bsky.social'
	};
</script>

<div in:blur class="relative flex h-fit w-full flex-col gap-2">
	<div class="card flex flex-col items-center justify-between gap-1 rounded-xl p-3">
		<img src={avatar} alt="pfp" class="size-26 rounded-full shadow-xl" />
		This app was created by
		<a target="_blank" href="https://fyiimysf.pages.dev" class="text-primary-300">Mohammad Yousaf</a
		>
		<p class="card flex items-center justify-stretch rounded-xl p-2 text-justify">
			Glove Box is a URL stashing app that allows you to save and organize your favorite links. You
			can categorize your links for better organization and quick access.
		</p>
	</div>

	<a
		href={links.repo}
		target="_blank"
		class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg"
	>
		<div class="flex gap-3">
			<Link2 />
			<p>Project Repo</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a
		href={links.linkedIn}
		target="_blank"
		class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg"
	>
		<div class="flex gap-3">
			<Linkedin />
			<p>LinkedIn</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a
		href={links.github}
		target="_blank"
		class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg"
	>
		<div class="flex gap-3">
			<Github />
			<p>GitHub</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a
		href={links.insta}
		target="_blank"
		class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg"
	>
		<div class="flex gap-3">
			<Instagram />
			<p>Instagram</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a
		href={links.blsk}
		target="_blank"
		class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg"
	>
		<div class="flex gap-3">
			<Twitter />
			<p>BlueSky</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<br />
	<br />
</div>
<!-- Back Button -->
<button
	in:slide|global={{delay:400}}
	onclick={() => {
		haptic('light');
		history.back();
	}}
	class="bg-surface-950/60 fixed bottom-0 left-1/2 z-9 w-[90vw] -translate-x-1/2 rounded-t-2xl backdrop-blur-xs"
>
	<span class="btn py-3">
		<ArrowLeft />
		Go Back
	</span>
</button>
