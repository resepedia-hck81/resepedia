import { useState } from "react";

interface Recipe {
	id: number;
	name: string;
	region: string;
	ingredients: { name: string; amount: string; notes?: string }[];
	instructions: string[];
}

export default function GenerateByName() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<Recipe[]>([]);
	const [activeSearchRecipeTab, setActiveSearchRecipeTab] = useState(0);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;
		setLoading(true);
		try {
			const res = await fetch("/api/generate/name", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: searchQuery }),
			});
			if (!res.ok) throw new Error("Failed to search");
			const data = await res.json();
			setSearchResults(data.recipes || []);
			setShowSearchResult(true);
			setActiveSearchRecipeTab(0);
		} catch (err) {
			alert("Failed to search");
		} finally {
			setLoading(false);
		}
	};
	const resetSearch = () => {
		setShowSearchResult(false);
		setSearchQuery("");
		setSearchResults([]);
	};
	return (
		<div>
			<div className="text-center mb-6">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">Generate Recipe by Name</h2>
				<p className="text-gray-600 max-w-2xl mx-auto">Enter ingredients or recipe names to find the perfect dish for your next meal</p>
			</div>
			{!showSearchResult ? (
				<div className="max-w-2xl mx-auto">
					<form onSubmit={handleSearch} className="mb-6">
						<div className="relative mb-6">
							<input type="text" className="w-full h-14 px-5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900" placeholder="Search recipes or ingredients (e.g., 'chicken pasta', 'vegetarian')" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
							<button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
								</svg>
							</button>
						</div>
						<button type="submit" disabled={loading} className="px-6 py-3 rounded-md text-white transition-colors bg-red-600 hover:bg-red-700 w-full">
							{loading ? "Searching..." : "Search"}
						</button>
					</form>
				</div>
			) : (
				<div className="mt-8">
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results for: &quot;{searchQuery}&quot;</h2>
					</div>
					<div className="border-t border-gray-200 pt-8">
						<h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Recipes</h2>
						<div className="mb-6 border-b border-gray-200">
							<div className="flex overflow-x-auto">
								{searchResults.map((recipe, index) => (
									<button key={index} onClick={() => setActiveSearchRecipeTab(index)} className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeSearchRecipeTab === index ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}>
										{recipe.name}
									</button>
								))}
							</div>
						</div>
						<div>
							{searchResults.map((recipe, index) => (
								<div key={index} className={activeSearchRecipeTab === index ? "" : "hidden"}>
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
														<th className="px-4 py-2 text-left text-black font-semibold">Ingredient</th>
														<th className="px-4 py-2 text-left text-black font-semibold">Measurement</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													{recipe.ingredients.map((ingredient, idx) => (
														<tr key={idx} className="hover:bg-gray-50">
															<td className="px-4 py-3 text-black">{ingredient.name}</td>
															<td className="px-4 py-3 text-black">{ingredient.amount}</td>
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
						<div className="mt-8 text-center">
							<button onClick={resetSearch} className="px-6 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors">
								New Search
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
