import Image from "next/image";

export default function Banner({ id, imgUrl, title, text, prevHref, nextHref }: { id: string; imgUrl: string; title: string; text: string; prevHref: string; nextHref: string }) {
	return (
		<div id={id} className="carousel-item relative w-full">
			<div className="w-full h-[300px] relative">
				<Image src={imgUrl} alt="Food Banner 1" fill className="object-cover brightness-70" priority />
				<div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateY(-75px)" }}>
					<div className="text-center px-4">
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] font-['Playfair_Display']">{title}</h1>
						<p className="text-lg sm:text-xl md:text-2xl text-white font-medium drop-shadow-[0_2px_3px rgba(0,0,0,0.8)] font-['Montserrat']">{text}</p>
					</div>
				</div>
			</div>
			<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
				<a href={prevHref} className="btn btn-circle bg-white border-none hover:text-white hover:bg-black/50">
					❮
				</a>
				<a href={nextHref} className="btn btn-circle bg-white border-none hover:text-white hover:bg-black/50">
					❯
				</a>
			</div>
		</div>
	);
}
