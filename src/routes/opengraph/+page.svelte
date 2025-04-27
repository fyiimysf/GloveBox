<script lang="ts">
    import { fetchOgData } from '$lib/actions/fetchOgData';
    import type { OpenGraphData } from '$lib/types';
    
    let url = '';
    let loading = false;
    let error: string | null = null;
    let ogData: OpenGraphData | null = null;

    async function handleSubmit() {
        if (!url) {
            error = 'Please enter a URL';
            return;
        }

        loading = true;
        error = null;
        ogData = null;

        try {
            ogData = await fetchOgData(url);
        } catch (e) {
            error = e instanceof Error ? e.message : 'An error occurred';
        } finally {
            loading = false;
        }
    }
</script>

<div class="p-4">
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
            <label for="url" class="block text-sm font-medium">Enter URL</label>
            <input
                type="url"
                id="url"
                bind:value={url}
                placeholder="https://example.com"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
            />
        </div>
        <button
            type="submit"
            disabled={loading}
            class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? 'Loading...' : 'Fetch OpenGraph Data'}
        </button>
    </form>

    {#if error}
        <div class="mt-4 rounded-md bg-red-50 p-4 text-red-700">
            {error}
        </div>
    {/if}

    {#if ogData}
        <div class="mt-4 rounded-md border p-4">
            <h2 class="text-xl font-bold">{ogData.title}</h2>
            {#if ogData.siteName}
                <p class="text-sm text-gray-500">{ogData.siteName}</p>
            {/if}
            {#if ogData.description}
                <p class="mt-2">{ogData.description}</p>
            {/if}
            {#if ogData.image}
                <img
                    src={ogData.image}
                    alt={ogData.title}
                    class="mt-4 max-h-48 rounded-md object-cover"
                />
            {/if}
            <a
                href={ogData.url}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-4 block text-blue-600 hover:underline"
            >
                {ogData.url}
            </a>
        </div>
    {/if}
</div>