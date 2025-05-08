"use client";
import Link from "next/link";
import { useState, useEffect, ChangeEvent } from "react";
import { IIngredient, IRegion } from "../page";
import { checkToken, getRegions } from "../action";
import { uploadToCatbox } from "./action";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface IRecipeInput {
	name: string;
	imageUrl: File | null;
	ingredients: IIngredient[];
	instruction: string;
	RegionId: string;
}

export default function AddRecipe() {
	const [recipe, setRecipe] = useState<IRecipeInput>({
		name: "",
		imageUrl: null,
		ingredients: [{ measurement: "", name: "" }],
		instruction: "",
		RegionId: "",
	});
	const [regions, setRegions] = useState<IRegion[]>([]);

	const router = useRouter();

	async function checkLoginStatus() {
		const hasToken = await checkToken();
		if (!hasToken) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Unauthorized",
			});
			router.push("/login");
		}
	}
	useEffect(() => {
		checkLoginStatus();
	}, []);

	async function fetchRegions() {
		const response = await getRegions();
		if (response.error) {
			return <h1>REGIONS NOT FOUND</h1>;
		}
		const data: IRegion[] = response.data;
		setRegions(data);
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const errors = [];
		if (!recipe.name) errors.push("Name is required");
		if (recipe.ingredients.length < 2) {
			errors.push("At least one ingredient is required");
		} else {
			recipe.ingredients
				.filter((ingredient) => ingredient.name || ingredient.measurement)
				.forEach((ingredient) => {
					if (!ingredient.name || !ingredient.measurement) {
						errors.push("Both ingredient name and measurement are required");
					}
				});
		}
		if (!recipe.instruction) errors.push("Instruction is required");
		if (!recipe.RegionId) errors.push("Region is required");
		if (!recipe.imageUrl) errors.push("Image is required");
		if (errors.length) {
			return Swal.fire({
				icon: "error",
				title: "Error",
				text: errors.join(", "),
			});
		}

		// catbox upload
		let newImageUrl = "";
		const formData = new FormData();
		if (recipe.imageUrl) {
			formData.append("file", recipe.imageUrl);
		}
		formData.append("name", formData.get("name") as string);
		try {
			Swal.fire({
				title: "Uploading...",
				text: "Please wait while the image is being uploaded.",
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				},
			});
			const result = await uploadToCatbox(formData);
			newImageUrl = result.url;
			Swal.close();
		} catch {
			Swal.close();
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Failed to upload image, please try again later.",
			});
			return;
		}

		try {
			const response = await fetch("/api/recipes", {
				method: "POST",
				body: JSON.stringify({
					...recipe,
					imageUrl: newImageUrl,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message || "Failed to add recipe");
			}
			Swal.fire({
				icon: "success",
				title: "Success",
				text: "Recipe added successfully!",
			});
			router.push("/profile");
		} catch (err) {
			//   console.error("Error adding recipe:", err);
			if (err instanceof Error) {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: err.message,
				});
			}
		}
	};

	useEffect(() => {
		fetchRegions();
	}, []);

	// Menambahkan field ingredient baru ketika field terakhir diisi
	useEffect(() => {
		const lastIndex = recipe.ingredients.length - 1;
		const lastIngredient = recipe.ingredients[lastIndex] || {
			measurement: "",
			name: "",
		};

		// Hanya tambahkan field baru jika yang terakhir sudah diisi
		if (lastIngredient.measurement.trim() && lastIngredient.name.trim()) {
			// Tambahkan baris baru hanya jika baris saat ini tidak kosong
			if (recipe.ingredients.length < 2 || (recipe.ingredients[recipe.ingredients.length - 2].measurement.trim() && recipe.ingredients[recipe.ingredients.length - 2].name.trim())) {
				setRecipe((prev) => ({
					...prev,
					ingredients: [...prev.ingredients, { measurement: "", name: "" }],
				}));
			}
		}

		// Hapus baris kosong kecuali yang terakhir
		const filledIngredients = recipe.ingredients.filter((item, idx) => {
			// Jika bukan baris terakhir, harus terisi
			if (idx < recipe.ingredients.length - 1) {
				return item.measurement.trim() !== "" || item.name.trim() !== "";
			}
			// Selalu simpan baris terakhir
			return true;
		});

		// Pastikan minimal ada satu baris
		if (filledIngredients.length !== recipe.ingredients.length) {
			setRecipe((prev) => ({
				...prev,
				ingredients: filledIngredients,
			}));
		}
	}, [recipe.ingredients]);

	return (
		<div className="container max-w-5xl mx-auto my-8 px-4">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">Add Recipe</h1>

			<form className="bg-white rounded-lg shadow-md p-6" onSubmit={(e) => handleSubmit(e)}>
				<div className="mb-5">
					<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
						Name
					</label>
					<input type="text" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900" id="name" name="name" value={recipe.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setRecipe({ ...recipe, name: e.target.value })} placeholder="Enter recipe name" />
				</div>
				<div className="mb-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>

					{recipe.ingredients.map((item, index) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" key={index}>
							<div>
								<label htmlFor={`measurement${index + 1}`} className="block text-sm font-medium text-gray-700 mb-1">
									Measurement {index + 1}
								</label>
								<input
									type="text"
									className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
									id={`measurement${index + 1}`}
									name={`measurement${index + 1}`}
									placeholder="e.g. 2 tablespoons"
									value={item.measurement}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setRecipe((prev) => {
											const newIngredients = [...prev.ingredients];
											newIngredients[index].measurement = e.target.value;
											return { ...prev, ingredients: newIngredients };
										})
									}
								/>
							</div>
							<div>
								<label htmlFor={`ingredient${index + 1}`} className="block text-sm font-medium text-gray-700 mb-1">
									Ingredient {index + 1}
								</label>
								<input
									type="text"
									className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
									id={`ingredient${index + 1}`}
									name={`ingredient${index + 1}`}
									placeholder="e.g. Salt"
									value={item.name}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										setRecipe((prev) => {
											const newIngredients = [...prev.ingredients];
											newIngredients[index].name = e.target.value;
											return { ...prev, ingredients: newIngredients };
										})
									}
								/>
							</div>
						</div>
					))}
				</div>
				<div className="mb-5">
					<label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
						Instructions
					</label>
					<textarea className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900" id="instructions" name="instructions" rows={10} value={recipe.instruction} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRecipe({ ...recipe, instruction: e.target.value })} placeholder="Enter cooking instructions (each step on a new line)"></textarea>
				</div>
				<div className="mb-5">
					<label htmlFor="RegionId" className="block text-sm font-medium text-gray-700 mb-1">
						Region
					</label>
					<select className="select w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900" id="RegionId" name="RegionId" value={recipe.RegionId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setRecipe({ ...recipe, RegionId: e.target.value })}>
						<option value={""} disabled={true}>
							---SELECT REGION---
						</option>
						{regions.map((region) => (
							<option key={region._id} value={region._id}>
								{region.name}
							</option>
						))}
					</select>
				</div>

				<div className="mb-6">
					<label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
						Upload Image
					</label>
					<input
						type="file"
						className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
						id="file"
						name="file"
						accept="image/*"
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							if (e.target.files && e.target.files[0]) {
								setRecipe({ ...recipe, imageUrl: e.target.files[0] });
							}
						}}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors">
						Cancel
					</Link>
					<button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors">
						Add Recipe
					</button>
				</div>
			</form>
		</div>
	);
}
