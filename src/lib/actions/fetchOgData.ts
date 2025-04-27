import { type OpenGraphData } from '$lib/types';

export async function fetchOgData(url: string): Promise<OpenGraphData> {
    const response = await fetch('/api/opengraph', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch OpenGraph data');
    }

    return response.json();
}