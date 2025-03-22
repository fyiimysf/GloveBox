<script>
	import { MoreHorizontal } from 'lucide-svelte';
</script>

<a href="/card">
	<div id="webcrumbs">
		<div
			class="shadow-3xl w-[100%] transform overflow-hidden rounded-xl shadow-2xl transition-transform duration-300 hover:-translate-y-2"
		>
			<div class="relative">
				<div class="h-fit w-full bg-gradient-to-tr from-blue-800 via-purple-700 to-pink-600">
					<!-- svelte-ignore a11y_img_redundant_alt -->
					<img
						src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1050&amp;q=80"
						alt="Project Image"
						class="h-full w-full object-cover mix-blend-overlay transition-opacity duration-300 hover:opacity-70"
					/>
				</div>
				<div class="fixed top-0 left-0 w-full bg-gradient-to-t from-gray-900/90 to-transparent p-1">
					<h3 class=" font-bold tracking-tight text-white">Enterprise Solutions</h3>
					<small class="line-clamp-6 font-light text-gray-200 font-stretch-60%">
						Streamlined workflows and integrated systems for modern businesses.
					</small>
					<div>
						<button class=" btn-primary relative bottom-10 left-[27.5%]"><MoreHorizontal /></button>
					</div>
					<!-- <div class="mt-3 flex flex-wrap gap-2">
                <span
                class="rounded-full bg-blue-500/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600/80"
                >Technology</span
                >
                <span
                class="rounded-full bg-purple-500/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-purple-600/80"
                >Business</span
                >
                <span
                class="rounded-full bg-pink-500/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-pink-600/80"
                >Innovation</span
                >
				</div> -->
				</div>
			</div>
		</div>
	</div>
</a>
