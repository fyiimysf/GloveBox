<script>
	import { Heart } from 'lucide-svelte';
</script>

<div id="webcrumbs">
	<div
		class="group bg-primary-900-100 w-40 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
	>
		<div class="relative overflow-hidden rounded-t-xl">
			<enhanced:img
				src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
				alt="Content"
				class="h-[200px] w-full transform object-cover transition-transform duration-300 group-hover:scale-110"
			/>
		</div>
		<div class="flex flex-col gap-4">
			<div class="p-6">
				<p class="mb-4 text-sm text-gray-600">
					Learn the essential strategies for creating high-performing teams in today&#x27;s dynamic
					workplace environment.
				</p>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<enhanced:img
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
							alt="Author"
							class="h-8 w-8 rounded-full object-cover"
						/> <span class="text-sm font-medium">John Smith</span>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-1">
							<span class="text-sm text-gray-600">1.2k</span>
							<span
								class="material-symbols-outlined cursor-pointer transition-colors hover:text-blue-600"
								><Heart class="text-red-300" /></span
							>
						</div>
						<span
							class="material-symbols-outlined cursor-pointer transition-colors hover:text-blue-600"
							>bookmark</span
						>
					</div>
				</div>
				<div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4"></div>
			</div>
			<button
				class="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-300 hover:bg-blue-100"
				>Read More</button
			>
		</div>
	</div>
</div>
