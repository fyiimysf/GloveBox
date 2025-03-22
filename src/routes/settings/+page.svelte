<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageData } from '../$types';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { fade, fly, slide } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	let disturb = $state(false);
	let notifications = $state(true);
	let disabled = $state(false);
</script>

<main
	in:slide={{ delay: 0 }}
	class="flex flex-grow flex-col items-center justify-center space-y-4 p-2"
>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border-[1px] p-4">
		<div>
			<section class="w-full space-y-4">
				<div class="flex items-center justify-between gap-4">
					<p>Default to the inactive state.</p>
					<Switch name="disturb" checked={disturb} onCheckedChange={(e) => (disturb = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Default to the active state.</p>
					<Switch
						name="notifications"
						checked={notifications}
						onCheckedChange={(e) => (notifications = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Shown in disabled mode.</p>
					<Switch
						disabled={!disabled}
						name="disabled"
						checked={disabled}
						onCheckedChange={(e) => (disabled = e.checked)}
					></Switch>
				</div>
			</section>
		</div>
	</div>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border-[1px] p-4">
		<div>
			<section class="w-full space-y-4">
				<div class="flex items-center justify-between gap-4">
					<p>Default to the inactive state.</p>
					<Switch name="disturb" checked={disturb} onCheckedChange={(e) => (disturb = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Default to the active state.</p>
					<Switch
						name="notifications"
						checked={notifications}
						onCheckedChange={(e) => (notifications = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Shown in disabled mode.</p>
					<Switch
						disabled={!disabled}
						name="disabled"
						checked={disabled}
						onCheckedChange={(e) => (disabled = e.checked)}
					></Switch>
				</div>
			</section>
		</div>
	</div>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border-[1px] p-4">
		<div>
			<section class="w-full space-y-4">
				<div class="flex items-center justify-between gap-4">
					<p>Default to the inactive state.</p>
					<Switch name="disturb" checked={disturb} onCheckedChange={(e) => (disturb = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Default to the active state.</p>
					<Switch
						name="notifications"
						checked={notifications}
						onCheckedChange={(e) => (notifications = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Shown in disabled mode.</p>
					<Switch
						disabled={!disabled}
						name="disabled"
						checked={disabled}
						onCheckedChange={(e) => (disabled = e.checked)}
					></Switch>
				</div>
			</section>
		</div>
	</div>
	<div class="card bg-primary-900/20 border-surface-200-800 w-full border-[1px] p-4">
		<div>
			<section class="w-full space-y-4">
				<div class="flex items-center justify-between gap-4">
					<p>Default to the inactive state.</p>
					<Switch name="disturb" checked={disturb} onCheckedChange={(e) => (disturb = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Default to the active state.</p>
					<Switch
						name="notifications"
						checked={notifications}
						onCheckedChange={(e) => (notifications = e.checked)}
					></Switch>
				</div>
				<hr class="hr" />
				<div class="flex items-center justify-between gap-4">
					<p>Shown in disabled mode.</p>
					<Switch
						disabled={!disabled}
						name="disabled"
						checked={disabled}
						onCheckedChange={(e) => (disabled = e.checked)}
					></Switch>
				</div>
			</section>
		</div>
	</div>
	<center>
		<button
			in:fly={{ delay: 0, y: 100 }}
			type="button"
			class="btn-icon bg-primary-950/70 fixed bottom-0 left-0 h-10 w-[100%] backdrop-blur-xs"
			onclick={() => {
				history.back();
			}}
		>
			<span class="flex flex-1/2 items-center gap-[28%]">
				<ArrowLeft class="size-7" />
				<h3 class="h4">Go Back</h3>
			</span>
		</button>
	</center>
</main>
