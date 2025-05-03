import { ObjectId } from "mongodb";

interface Recipe {
	id: ObjectId;
	name: string;
	region: string;
	ingredients: { name: string; measurement: string }[];
	instructions: string[];
}

export default function GenerateResult({ recommendedRecipes, activeRecipeTab }: { recommendedRecipes: Recipe[]; activeRecipeTab: number }) {
	return (
		<div>
			{recommendedRecipes.map((recipe, index) => (
				<div key={index} className={activeRecipeTab === index ? "" : "hidden"}>
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.name}</h1>
						<div className="flex items-center text-gray-600 mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-red-600">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
							</svg>
							<span>Region: {recipe.region}</span>
						</div>
					</div>
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-gray-50">
										<th className="px-4 py-2 text-left text-black font-semibold">Measurement</th>
										<th className="px-4 py-2 text-left text-black font-semibold">Ingredient</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{recipe.ingredients.map((ingredient, idx) => (
										<tr key={idx} className="hover:bg-gray-50">
											<td className="px-4 py-3 text-black">{ingredient.measurement}</td>
											<td className="px-4 py-3 text-black">{ingredient.name}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
						<ol className="space-y-4 list-decimal list-inside">
							{recipe.instructions.map((step, idx) => (
								<li key={idx} className="text-black">
									<span className="ml-2">{step}</span>
								</li>
							))}
						</ol>
					</div>
				</div>
			))}
		</div>
	);
}
