import { parse, HTMLElement } from 'node-html-parser';
import type { OpenGraphData } from '$lib/types';

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const root = parse(html);

        const ogData: OpenGraphData = {
            title: '',
            description: '',
            image: '',
            url: url,
            siteName: '',
        };

        // Get OpenGraph tags
        const metaTags = root.querySelectorAll('meta[property^="og:"]');
        metaTags.forEach((tag: HTMLElement) => {
            const property = tag.getAttribute('property');
            const content = tag.getAttribute('content');

            if (!property || !content) return;

            switch (property) {
                case 'og:title':
                    ogData.title = content;
                    break;
                case 'og:description':
                    ogData.description = content;
                    break;
                case 'og:image':
                    ogData.image = content;
                    break;
                case 'og:url':
                    ogData.url = content;
                    break;
                case 'og:site_name':
                    ogData.siteName = content;
                    break;
            }
        });

        // Fallback to regular meta tags if OG tags are not available
        if (!ogData.title) {
            const titleTag = root.querySelector('title');
            if (titleTag) {
                ogData.title = titleTag.text;
            }
        }

        if (!ogData.description) {
            const descTag = root.querySelector('meta[name="description"]');
            if (descTag) {
                ogData.description = descTag.getAttribute('content') || '';
            }
        }

        return ogData;
    } catch (error) {
        console.error('Error fetching OpenGraph data:', error);
        throw error;
    }
}