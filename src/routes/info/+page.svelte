<script lang="ts">
	import avatar from '$lib/assets/avatar.jpg';
	import { Github, Instagram, Linkedin, Twitter } from '@lucide/svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeftIcon, ArrowUpRightFromSquare, Link2 } from 'lucide-svelte';
	import { blur } from 'svelte/transition';
    let links = {
        website : 'https://fyiimysf.pages.dev',
        github : 'https://github.com/fyiimysf',
        linkedIn : 'https://www.linkedin.com/in/yousaf-mohammad',
        insta : 'https://www.instagram.com/uceph.em/',
        blsk : 'https://bsky.app/profile/fyiimysf.bsky.social',
    }

    
</script>

<div in:blur class="relative flex h-fit w-full flex-col gap-2">
	<div
		class="card flex flex-col items-center justify-between gap-1 rounded-xl p-3"
	>
		<img src={avatar} alt="pfp" class="size-26 rounded-full shadow-xl" />
		<p class="card flex items-center justify-stretch rounded-xl p-2 text-justify">
			Glove Box is a URL stashing app that allows you to save and organize your favorite links. You
			can categorize your links for better organization and quick access.
		</p>
		This app was created by <a target="_blank" href="{links.website}" class='text-primary-300' >Mohammad Yousaf</a>
	</div>
    
	<a href='{links.website}' target="_blank" class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg">
		<div class="flex gap-3">
			<Link2 />
			<p>Website</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a href='{links.linkedIn}' target="_blank" class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg">
		<div class="flex gap-3">
			<Linkedin />
			<p>LinkedIn</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a href='{links.github}' target="_blank" class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg">
		<div class="flex gap-3">
			<Github />
			<p>GitHub</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a href='{links.insta}' target="_blank" class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg">
		<div class="flex gap-3">
			<Instagram />
			<p>Instagram</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<a href='{links.blsk}' target="_blank" class="card bg-primary-900/50 flex items-center justify-between gap-4 rounded-xl p-3 text-lg">
		<div class="flex gap-3">
			<Twitter />
			<p>BlueSky</p>
		</div>
		<ArrowUpRightFromSquare />
	</a>
	<br/>
	<br/>
</div>
<button onclick="{()=>{history.back()}}"  class="btn preset-tonal backdrop-blur-sm fixed left-0 right-0 m-2 bottom-0 flex items-center justify-between gap-4 rounded-xl p-3">
    <ArrowLeftIcon />
    <p>Back</p>
    <div class="size-4"></div>
</button>
