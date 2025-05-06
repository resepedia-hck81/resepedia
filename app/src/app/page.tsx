"use client";

import { useEffect, useState } from "react";
import { getRecipes, getRegions } from "./action";
import CardRecipe from "./components/CardRecipe";
import InfiniteScroll from "react-infinite-scroll-component";
import Carousel from "./components/Carousel";
import Loading from "./loading";

interface IRecipeData {
	page: number;
	totalPages: number;
	dataCount: number;
	totalDataCount: number;
	result: IRecipe[];
}

export interface IRecipe {
	_id: string;
	name: string;
	slug: string;
	imageUrl: string;
	ingredients: IIngredient[];
	instruction: string;
	RegionId: string;
	UserId: string;
	createdAt: string;
	updatedAt: string;
	region: string;
	author: string;
}

export interface IIngredient {
	name: string;
	measurement: string;
}

export interface IRegion {
	_id: string;
	name: string;
}

export default function Home() {
	const [recipes, setRecipes] = useState<IRecipeData>({
		page: 1,
		totalPages: 0,
		dataCount: 12,
		totalDataCount: 0,
		result: [],
	});

	const [regions, setRegions] = useState<IRegion[]>([]);
	const [search, setSearch] = useState("");
	const [region, setRegion] = useState("");
	const [loading, setLoading] = useState(true);

	async function fetchRecipes() {
		const response = await getRecipes(search, region, recipes.page);
		if (response.error) {
			setLoading(false);
			return <h1>RECIPES NOT FOUND</h1>;
		}
		const data: IRecipeData = response.data;
		if (recipes.page === 1) {
			setRecipes(data);
		} else {
			setRecipes((prev) => ({
				...prev,
				result: [...prev.result, ...data.result],
			}));
		}
		setLoading(false);
	}

	async function fetchRegions() {
		setLoading(true);
		const response = await getRegions();
		if (response.error) {
			setLoading(false);
			return <h1>REGIONS NOT FOUND</h1>;
		}
		const data: IRegion[] = response.data;
		setRegions(data);
		setLoading(false);
	}

	useEffect(() => {
		fetchRegions();
	}, []);

	useEffect(() => {
		fetchRecipes();
	}, [recipes.page]);

	useEffect(() => {
		setRecipes((prev) => ({
			...prev,
			page: 1,
			result: [],
		}));
		fetchRecipes();
	}, [search, region]);

	return (
		<div className="flex flex-col min-h-screen">
			<Carousel />
			{/* Page Content */}
			<div className="py-8 px-6">
				<div className="text-center">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-800 mb-6">Recipe List</h1>
					</div>
				</div>

				<div className="container mx-auto mt-4 px-4">
					<div className="flex justify-center mb-8">
						<div className="flex gap-4 items-center justify-center w-full">
							<input className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800 w-1/2" type="search" placeholder="Search menu" value={search} onChange={(e) => setSearch(e.target.value)} />
							<select className="select border border-gray-300 rounded-full px-4 py-[0.6rem] text-sm focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800 w-1/4" value={region} onChange={(e) => setRegion(e.target.value)}>
								<option value={""}>All Regions</option>
								{regions.map((region) => (
									<option key={region._id} value={region.name}>
										{region.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Loading Indicator */}
					{/* {loading && (
						<div className="flex justify-center">
							<span className="loading loading-bars loading-lg text-red-600"></span>
						</div>
					)} */}
					{loading && <Loading />}

					{/* Recipe Card Grid */}
					{!loading && (
						<InfiniteScroll className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" dataLength={recipes.result.length} next={() => setRecipes((prev) => ({ ...prev, page: prev.page + 1 }))} hasMore={recipes.page < recipes.totalPages} loader={null} scrollThreshold={0.9}>
							{recipes.result.map((recipe) => (
								<CardRecipe key={recipe._id} recipe={recipe} />
							))}
						</InfiniteScroll>
					)}
					{recipes.page < recipes.totalPages && (
						<div className="w-full flex justify-center mt-6">
							<span className="loading loading-bars loading-lg text-red-600"></span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
