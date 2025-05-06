"use client";

import Banner from "./Banner";
import { useEffect, useState } from "react";

export default function Carousel() {
	const [user, setUser] = useState({ name: "Anonymous", premium: false });
	useEffect(() => {
		const fetching = async () => {
			try {
				const response = await fetch("/api/carousel", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				setUser(data);
			} catch {
				setUser({ name: "Anonymous", premium: false });
			}
		};
		fetching();

		return () => {
			setUser({ name: "Anonymous", premium: false });
		};
	}, []);
	const carouselData = user.premium
		? [
				{
					imgUrl: "https://cdn1-production-images-kly.akamaized.net/9bmk2g8V5iJrwaPYgto-JsFzmvQ=/0x482:5921x3820/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3005563/original/092180800_1577336519-shutterstock_320422139.jpg",
					title: "Welcome Back!",
					text: "What do you want to make today?",
				},
				{
					imgUrl: "https://png.pngtree.com/thumb_back/fh260/back_pic/03/53/33/45579720d58a73c.jpg",
					title: `Hey! ${user.name}!`,
					text: "Let’s cook some delicious recipe!",
				},
		  ]
		: [
				{
					imgUrl: "https://cdn1-production-images-kly.akamaized.net/9bmk2g8V5iJrwaPYgto-JsFzmvQ=/0x482:5921x3820/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3005563/original/092180800_1577336519-shutterstock_320422139.jpg",
					title: "Let’s Get Premium!",
					text: "Unlock unlimited generate recipes today!",
				},
				{
					imgUrl: "https://png.pngtree.com/thumb_back/fh260/back_pic/03/53/33/45579720d58a73c.jpg",
					title: "Discover alternative ingredients!",
					text: "Explore new ways to enhance your dishes.",
				},
				{
					imgUrl: "https://png.pngtree.com/thumb_back/fh260/background/20190222/ourmid/pngtree-black-fashion-summer-hot-pot-food-vegetable-seasoning-potseasoningsummervegetablescornonionchiliblackfashionfoodbanner-image_50572.jpg",
					title: "Make you a recipe base only on a photo?!",
					text: "Transform your images into delicious recipes.",
				},
		  ];

	return (
		<div className="carousel w-full max-h-[150px] overflow-hidden">
			{carouselData.map((item, index) => {
				const prevSlide = index === 0 ? carouselData.length - 1 : index - 1;
				const nextSlide = index === carouselData.length - 1 ? 0 : index + 1;
				return <Banner key={index} id={`slide${index}`} imgUrl={item.imgUrl} title={item.title} text={item.text} prevHref={`#slide${prevSlide}`} nextHref={`#slide${nextSlide}`} />;
			})}
		</div>
	);
}
