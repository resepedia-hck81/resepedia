"use client";

import Image from "next/image";
import Link from "next/link";
import { IRecipe } from "../page";

interface IProps {
	recipe: IRecipe;
}

export default function CardRecipe({ recipe }: IProps) {
	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
			<div className="h-48 overflow-hidden relative">
				<Image src={recipe.imageUrl} alt={recipe.name} fill className="object-cover" />
			</div>
			<div className="p-4 flex flex-col justify-between flex-grow">
				<div>
					<h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{recipe.name}</h3>
					<div className="flex justify-between mb-3">
						<p className="text-sm text-gray-600">{recipe.region}</p>
						<p className="text-sm text-gray-600">By: {recipe.author}</p>
					</div>
				</div>
				<Link href={`/recipes/${recipe.slug}`} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block w-full text-center">
					View Recipe
				</Link>
			</div>
		</div>
	);
}
