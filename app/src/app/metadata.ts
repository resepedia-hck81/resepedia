import type { Metadata, Viewport } from "next";

const APP_NAME = "Resepedia";
const APP_DEFAULT_TITLE = "Resepedia - Kumpulan Resep Masakan";
const APP_TITLE_TEMPLATE = "%s - Resepedia";
const APP_DESCRIPTION = "Platform resep masakan dari berbagai daerah dan negara.";

export const metadata: Metadata = {
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: APP_DEFAULT_TITLE,
		// startUpImage: [], // You can add startup images here if needed
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	twitter: {
		card: "summary",
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	icons: {
		icon: "/RESEPEDIA-2.png",
		shortcut: "/RESEPEDIA-2.png",
		apple: "/RESEPEDIA-2.png",
		// other: [ // You can add more specific icons if needed
		//   {
		//     rel: 'apple-touch-icon-precomposed',
		//     url: '/RESEPEDIA-2.png',
		//   },
		// ],
	},
};

export const viewport: Viewport = {
	themeColor: "#FFFFFF", // Or your desired theme color
};
