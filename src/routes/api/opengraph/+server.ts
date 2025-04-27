import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { fetchOpenGraphData } from '$lib/server/opengraph';

export const POST = async ({ request }: RequestEvent) => {
    try {
        const { url } = await request.json();
        
        if (!url) {
            return json({ error: 'URL is required' }, { status: 400 });
        }

        const ogData = await fetchOpenGraphData(url);
        return json(ogData);
    } catch (error) {
        console.error('Error processing request:', error);
        return json({ error: 'Failed to fetch OpenGraph data' }, { status: 500 });
    }
};