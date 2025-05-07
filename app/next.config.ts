import withSerwist from "@serwist/next";
/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["dcostseafood.id", "asset.kompas.com", "assets.pikiran-rakyat.com", "img.okezone.com", "radarlampung.bacakoran.co", "healthybelly.s3.amazonaws.com", "cdn.idntimes.com", "cdn1-production-images-kly.akamaized.net", "png.pngtree.com", "img.pikbest.com", "www.themealdb.com", "files.catbox.moe"],
	},
};

module.exports = withSerwist({
	// Note: This is only an example. If you use Pages Router,
	// use something else that works, such as "service-worker/index.ts".
	swSrc: "src/app/sw.ts",
	swDest: "public/sw.js",
})(nextConfig);
