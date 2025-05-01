'use client'
import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Ingredient {
  measurement: string;
  ingredient: string;
}

// Definisikan tipe untuk Recipe
interface Recipe {
  name: string;
  instructions: string;
  regionId: string;
}

export default function EditRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { measurement: "2 tablespoons", ingredient: "Olive oil" },
    { measurement: "1 kg", ingredient: "Chicken thighs" },
    { measurement: "4 cloves", ingredient: "Garlic, minced" },
    { measurement: "", ingredient: "" }
  ]);

  const [recipe, setRecipe] = useState<Recipe>({
    name: "Chicken Cacciatore",
    instructions: "1. Heat olive oil in a large skillet over medium-high heat.\n2. Season chicken with salt and pepper, then add to the skillet. Cook until browned on both sides.\n3. Add garlic and cook for 1 minute until fragrant.\n4. Add tomatoes, bell peppers, and herbs. Stir to combine.\n5. Reduce heat to low, cover, and simmer for 30 minutes.\n6. Serve hot with pasta or crusty bread.",
    regionId: "1"
  });

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string): void => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    
    // Pastikan hanya ada satu baris kosong di akhir
    const cleanedIngredients = newIngredients.filter((item, idx) => {
      // Jika bukan baris terakhir, simpan semua yang tidak kosong
      if (idx < newIngredients.length - 1) {
        return item.measurement.trim() !== "" || item.ingredient.trim() !== "";
      }
      // Selalu simpan baris terakhir
      return true;
    });
    
    setIngredients(cleanedIngredients);
  };

  const handleRecipeChange = (field: keyof Recipe, value: string): void => {
    setRecipe({
      ...recipe,
      [field]: value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Logic untuk update recipe akan masuk di sini
    console.log("Updated recipe:", recipe);
    console.log("Updated ingredients:", ingredients.filter(i => i.measurement.trim() || i.ingredient.trim()));
  };

  // Menambahkan field ingredient baru ketika field terakhir diisi
  useEffect(() => {
    const lastIndex = ingredients.length - 1;
    const lastIngredient = ingredients[lastIndex];
    
    // Hanya tambahkan field baru jika yang terakhir sudah diisi
    if (lastIngredient.measurement.trim() && lastIngredient.ingredient.trim()) {
      // Tambahkan baris baru hanya jika baris saat ini tidak kosong
      if (ingredients.length < 2 || 
          (ingredients[ingredients.length - 2].measurement.trim() && 
           ingredients[ingredients.length - 2].ingredient.trim())) {
        setIngredients([...ingredients, { measurement: "", ingredient: "" }]);
      }
    }
    
    // Hapus baris kosong kecuali yang terakhir
    const filledIngredients = ingredients.filter((item, idx) => {
      // Jika bukan baris terakhir, harus terisi
      if (idx < ingredients.length - 1) {
        return item.measurement.trim() !== "" || item.ingredient.trim() !== "";
      }
      // Selalu simpan baris terakhir
      return true;
    });
    
    // Pastikan minimal ada satu baris
    if (filledIngredients.length !== ingredients.length) {
      setIngredients(filledIngredients);
    }
  }, [ingredients]);

  return (
    <div className="container max-w-5xl mx-auto my-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Recipe</h1>
        <Link href="/recipe/1" className="inline-block text-gray-700 hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      </div>

      <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            id="name"
            name="name"
            value={recipe.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRecipeChange("name", e.target.value)}
            placeholder="Enter recipe name"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ingredients
          </h2>

          {ingredients.map((item, index) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              key={index}
            >
              <div>
                <label
                  htmlFor={`measurement${index + 1}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                    handleIngredientChange(index, "measurement", e.target.value)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor={`ingredient${index + 1}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ingredient {index + 1}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  id={`ingredient${index + 1}`}
                  name={`ingredient${index + 1}`}
                  placeholder="e.g. Salt"
                  value={item.ingredient}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleIngredientChange(index, "ingredient", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <label
            htmlFor="instructions"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Instructions
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            id="instructions"
            name="instructions"
            rows={10}
            value={recipe.instructions}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleRecipeChange("instructions", e.target.value)}
            placeholder="Enter cooking instructions (each step on a new line)"
          ></textarea>
        </div>

        <div className="mb-5">
          <label
            htmlFor="RegionId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Region
          </label>
          <select
            className="select w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            id="RegionId"
            name="RegionId"
            value={recipe.regionId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleRecipeChange("regionId", e.target.value)}
          >
            <option value="" disabled>
              ---SELECT REGION---
            </option>
            <option value="1">Jawa</option>
            <option value="2">Sumatera Barat</option>
            <option value="3">Jawa Timur</option>
            <option value="4">Sulawesi</option>
            <option value="5">Kalimantan</option>
          </select>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Recipe Image
            </label>
            <span className="text-xs text-gray-500">Current image will be kept if no new image is uploaded</span>
          </div>
          
          <div className="mb-3">
            <img 
              src="https://www.thespruceeats.com/thmb/oqvtWwIClU_gVpx8xp_Rf-JVMzQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/easy-chicken-cacciatore-recipe-995356-hero-01-38d6b01395b8435299ae192885ec38f9.jpg" 
              alt="Current recipe image" 
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
          
          <input
            type="file"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            id="file"
            name="file"
            accept="image/*"
          />
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/recipe/1"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Update Recipe
          </button>
        </div>
      </form>
    </div>
  );
}