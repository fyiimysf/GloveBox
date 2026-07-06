import { parse, type HTMLElement } from 'node-html-parser';
import type { OpenGraphData } from '$lib/types';

const INSTAGRAM_SHORTCODE_RE = /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/;
const INSTAGRAM_UAS = [
	'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
	'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
];
const DEFAULT_UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const FETCH_HEADERS = {
	Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'Accept-Language': 'en-US,en;q=0.5'
};

function extractShortcode(url: string): string | null {
	const match = url.match(INSTAGRAM_SHORTCODE_RE);
	return match ? match[1] : null;
}

function parseOGFromRoot(root: HTMLElement): Partial<OpenGraphData> {
	const data: Partial<OpenGraphData> = {};
	const metaTags = root.querySelectorAll('meta[property^="og:"]');
	metaTags.forEach((tag: HTMLElement) => {
		const property = tag.getAttribute('property');
		const content = tag.getAttribute('content');
		if (!property || !content) return;
		switch (property) {
			case 'og:title':
				data.title ||= content;
				break;
			case 'og:description':
				data.description ||= content;
				break;
			case 'og:image':
			case 'og:image:url':
			case 'og:image:secure_url':
				if (!data.image) data.image = content;
				break;
			case 'og:url':
				data.url = content;
				break;
			case 'og:site_name':
				data.siteName ||= content;
				break;
		}
	});
	return data;
}

function applyMetaFallbacks(root: HTMLElement, ogData: Partial<OpenGraphData>): void {
	if (!ogData.title) {
		const titleTag = root.querySelector('title');
		if (titleTag) ogData.title = titleTag.text;
	}
	if (!ogData.description) {
		const descTag = root.querySelector('meta[name="description"]');
		if (descTag) ogData.description = descTag.getAttribute('content') || '';
	}
	if (!ogData.image) {
		const imgTag = root.querySelector('meta[name="image"]');
		if (imgTag) ogData.image = imgTag.getAttribute('content') || '';
	}
	if (!ogData.image) {
		const twitterImg =
			root.querySelector('meta[name="twitter:image"]') ||
			root.querySelector('meta[name="twitter:image:src"]') ||
			root.querySelector('meta[property="twitter:image:src"]');
		if (twitterImg) ogData.image = twitterImg.getAttribute('content') || '';
	}
}

function applyJsonLdFallback(html: string, ogData: Partial<OpenGraphData>): void {
	const jsonLdRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
	let match: RegExpExecArray | null;
	while ((match = jsonLdRegex.exec(html)) !== null) {
		try {
			const data = JSON.parse(match[1].trim());
			const items = Array.isArray(data)
				? data
				: data['@graph']
					? (Array.isArray(data['@graph']) ? data['@graph'] : [data['@graph']])
					: [data];
			for (const item of items) {
				if (!item || typeof item !== 'object') continue;
				if (!ogData.image) {
					if (typeof item.image === 'string') ogData.image = item.image;
					else if (item.image?.url) ogData.image = item.image.url;
				}
				if (!ogData.title)
					ogData.title = item.headline || item.name || item.caption || item.alternateName;
				if (!ogData.description && typeof item.description === 'string')
					ogData.description = item.description;
				if (!ogData.siteName) {
					if (item.author?.name) ogData.siteName = item.author.name;
					else if (item.publisher?.name) ogData.siteName = item.publisher.name;
				}
			}
		} catch {
			// skip invalid JSON
		}
	}
}

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
	const shortcode = extractShortcode(url);
	const userAgents = shortcode ? INSTAGRAM_UAS : [DEFAULT_UA];

	let html = '';
	let root: HTMLElement | null = null;
	const ogData: OpenGraphData = { title: '', description: '', image: '', url, siteName: '' };

	for (const ua of userAgents) {
		try {
			const res = await fetch(url, {
				headers: { 'User-Agent': ua, ...FETCH_HEADERS },
				signal: AbortSignal.timeout(10000)
			});
			if (!res.ok) continue;
			html = await res.text();
			root = parse(html);

			const og = parseOGFromRoot(root);
			if (og.title) ogData.title ||= og.title;
			if (og.description) ogData.description ||= og.description;
			if (og.image) ogData.image ||= og.image;
			if (og.siteName) ogData.siteName ||= og.siteName;

			if (ogData.title && ogData.image) break;
		} catch {
			// try next UA
		}
	}

	if (!root) throw new Error('Failed to fetch URL');

	applyMetaFallbacks(root, ogData);

	if (!ogData.title || !ogData.image || !ogData.description || !ogData.siteName) {
		applyJsonLdFallback(html, ogData);
	}

	// Favicon fallback
	if (!ogData.image) {
		try {
			const domain = new URL(url).hostname;
			if (domain) ogData.image = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
		} catch {
			// invalid URL
		}
	}

	return ogData;
}
