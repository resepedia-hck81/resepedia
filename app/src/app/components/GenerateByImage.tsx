import { useState, useRef } from "react";
import swal from "./Swal";
import GenerateResult from "./GenerateResult";
import { ObjectId } from "mongodb";
import CustomError from "@/db/exeptions/customError";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Recipe {
	id: ObjectId;
	name: string;
	region: string;
	ingredients: { name: string; measurement: string }[];
	instructions: string[];
}

export default function GenerateByImage() {
	const [dragActive, setDragActive] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [showAnalysisResult, setShowAnalysisResult] = useState(false);
	const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
	const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
	const [activeRecipeTab, setActiveRecipeTab] = useState(0);
	const [loading, setLoading] = useState(false);
	const [recipeAdded, setRecipeAdded] = useState([false, false, false]);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};
	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFile(e.dataTransfer.files[0]);
		}
	};
	const handleFile = (file: File) => {
		setSelectedImage(file);
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (e.target && typeof e.target.result === "string") {
				setImagePreview(e.target.result);
			}
		};
		reader.readAsDataURL(file);
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFile(e.target.files[0]);
		}
	};
	const handleDropAreaClick = () => {
		inputRef.current?.click();
	};

	const handleAddRecipe = async (recipe: Recipe) => {
		swal.loading("Adding recipe...");
		try {
			const res = await fetch("/api/recipes/ai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(recipe),
			});
			const data = await res.json();
			swal.close();
			if (!res.ok) throw new CustomError(data.message, res.status);
			swal.success("Recipe added successfully!");
			setRecipeAdded((prev) => {
				const newRecipeAdded = [...prev];
				newRecipeAdded[activeRecipeTab] = true;
				return newRecipeAdded;
			});
		} catch (e: unknown) {
			swal.close();
			if (e instanceof CustomError) swal.error(e.status, e.message);
			else swal.error("Failed to add recipe", "An error occurred while processing your request.");
		}
	};

	const handleAnalyzeIngredients = async () => {
		if (!selectedImage) return;
		setLoading(true);
		const formData = new FormData();
		formData.append("image", selectedImage);
		try {
			const res = await fetch("/api/generate/image", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();

			if (!res.ok) throw new CustomError(data.message, res.status);
			setDetectedIngredients(data.ingredients || []);
			setRecommendedRecipes(data.recipes || []);
			setShowAnalysisResult(true);
			setActiveRecipeTab(0);
		} catch (e: unknown) {
			if (e instanceof CustomError) {
				if (e.status === 402) return swal.warn(e.status, e.message, () => router.push("/profile"), "View Profile", "Cancel");
				if (e.status === 401) return swal.warn(e.status, e.message, () => router.push("/login"), "Login", "Cancel");
				else return swal.error(e.status, e.message);
			}
			swal.error("Failed to analyze image", "An error occurred while processing your request.");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setShowAnalysisResult(false);
		setImagePreview(null);
		setSelectedImage(null);
		setDetectedIngredients([]);
		setRecommendedRecipes([]);
		setActiveRecipeTab(0);
		setRecipeAdded([false, false, false]);
	};

	return (
		<div>
			<div className="text-center mb-6">
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Generate Recipe by Image</h2>
				<p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Upload a photo of your ingredients, and our AI will analyze it to suggest delicious recipes you can make!</p>
			</div>
			{!showAnalysisResult ? (
				<div className="flex flex-col items-center">
					<div onClick={handleDropAreaClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer mb-6 transition-all duration-300 relative overflow-hidden ${dragActive ? "border-red-500 bg-red-50 shadow-lg scale-105" : "border-gray-300"}`}>
						<input type="file" accept="image/*" ref={inputRef} onChange={handleInputChange} className="hidden" />
						{imagePreview ? (
							<Image key={imagePreview} src={imagePreview} alt="Preview" className="object-contain h-full w-full animate-fade-in" style={{ animation: "fadeIn 0.7s" }} width={400} height={400} unoptimized={true} />
						) : (
							<div className="text-center p-6 flex flex-col items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400 transition-transform duration-300 ${dragActive ? "animate-bounce text-red-400" : ""}`}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
								</svg>
								<p className="text-gray-600 mb-1 text-sm sm:text-base">Drag and drop an image here, or click to select</p>
								<p className="text-gray-500 text-xs sm:text-sm">Supported formats: JPG, PNG, WEBP</p>
							</div>
						)}
						{imagePreview && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									setImagePreview(null);
									setSelectedImage(null);
								}}
								className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
					<div className="text-center">
						<button onClick={handleAnalyzeIngredients} disabled={!selectedImage || loading} className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-white transition-colors ${selectedImage ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}>
							{loading ? "Analyzing..." : "Analyze Ingredients"}
						</button>
					</div>
				</div>
			) : (
				<div className="mt-6 sm:mt-8">
					{imagePreview && (
						<div className="flex justify-center mb-6 sm:mb-8">
							<Image src={imagePreview} alt="Preview" className="max-h-48 sm:max-h-64 rounded-lg shadow-md border border-gray-200 object-contain bg-white" style={{ maxWidth: "100%", margin: "0 auto" }} width={400} height={400} unoptimized={true} />
						</div>
					)}
					<div className="mb-6 sm:mb-8">
						<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Detected Ingredients</h2>
						<div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
							{detectedIngredients?.map((ingredient, index) => (
								<div key={index} className="bg-red-100 text-red-800 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
									{ingredient}
								</div>
							))}
						</div>
					</div>
					<div className="border-t border-gray-200 pt-6 sm:pt-8">
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">Recommended Recipes</h2>
						<div className="relative mb-5 sm:mb-6 overflow-x-auto scrollbar-hide">
							<div className="flex gap-2 sm:gap-3 pb-2">
								{recommendedRecipes.map((recipe, index) => (
									<button
										key={index}
										onClick={() => setActiveRecipeTab(index)}
										className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors rounded-lg flex-shrink-0 
											${activeRecipeTab === index ? "bg-red-50 text-red-600 border-b-2 border-red-500 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"}`}
										aria-current={activeRecipeTab === index ? "page" : undefined}>
										{recipe.name}
									</button>
								))}
							</div>
						</div>
						<GenerateResult recommendedRecipes={recommendedRecipes} activeRecipeTab={activeRecipeTab} />
						<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
							{!recipeAdded[activeRecipeTab] && (
								<button onClick={() => handleAddRecipe(recommendedRecipes[activeRecipeTab])} className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 btn rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors text-sm sm:text-base font-medium">
									Add To My Recipe
								</button>
							)}
							<button onClick={handleReset} className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 btn rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors text-sm sm:text-base font-medium">
								Upload Another Image
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
