import { useState } from "react";
import swal from "./Swal";
import GenerateResult from "./GenerateResult";
import { ObjectId } from "mongodb";
import CustomError from "@/db/exeptions/customError";
import { useRouter } from "next/navigation";

interface Recipe {
	id: ObjectId;
	name: string;
	region: string;
	ingredients: { name: string; measurement: string }[];
	instructions: string[];
}

export default function GenerateByName() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<Recipe[]>([]);
	const [activeSearchRecipeTab, setActiveSearchRecipeTab] = useState(0);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;
		setLoading(true);
		try {
			const res = await fetch("/api/generate/name", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: searchQuery }),
			});
			const data = await res.json();
			if (!res.ok) throw new CustomError(data.message, res.status);
			setSearchResults(data.recipes || []);
			setShowSearchResult(true);
			setActiveSearchRecipeTab(0);
		} catch (e: unknown) {
			if (e instanceof CustomError) {
				if (e.status === 402)
					return swal.warn(
						e.status,
						e.message,
						async () => {
							try {
								swal.loading("Processing payment...");
								const response = await fetch("/api/order", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
								});

								const data = await response.json();
								if (!response.ok) throw new CustomError(data.message, response.status);
								swal.close();

								if (data.redirectUrl) window.open(data.redirectUrl, "_blank");
								else throw new CustomError("No redirect URL received", 400);
							} catch (error) {
								console.error("Payment error:", error);
								swal.error("Payment Error", "An error occurred while processing your payment.");
							}
						},
						"Yes, proceed to payment",
						"No, cancel"
					);
				if (e.status === 401) return swal.warn(e.status, e.message, () => router.push("/login"), "Login", "Cancel");
				else return swal.error(e.status, e.message);
			}
			swal.error("Failed to generate recipes", "An error occurred while processing your request.");
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
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">Generate Recipe by Name or Description</h2>
				<p className="text-gray-600 max-w-2xl mx-auto">Enter a recipe name or describe a recipe to find the perfect dish for your next meal!</p>
			</div>
			{!showSearchResult ? (
				<div className="max-w-2xl mx-auto">
					<form onSubmit={handleSearch} className="mb-6">
						<div className="relative mb-6">
							<input type="text" className="w-full h-14 px-5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900" placeholder="e.g. 'Classic margherita pizza' or 'Cheesy oven-baked pizza with tomato sauce'" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
							<button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors" disabled={loading}>
								{loading ? (
									<div className="flex items-center">
										<span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
									</div>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
									</svg>
								)}
							</button>
						</div>
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
						<GenerateResult recommendedRecipes={searchResults} activeRecipeTab={activeSearchRecipeTab} />
						{/* Reset Search Button */}
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
