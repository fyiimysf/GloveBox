export interface OpenGraphData {
	title: string;
	description: string;
	image: string;
	url: string;
	siteName: string;
}

export interface SharedItem {
	title: string;
	img: any;
	link: string;
	text: string;
	date: string;
}

export interface Space {
	name: string;
	clr: string;
	desc: string;
	items: [];
}
