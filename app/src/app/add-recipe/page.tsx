"use client";
import Link from "next/link";
import { useState, useEffect, ChangeEvent } from "react";
import { IIngredient, IRegion } from "../page";
import { getRegions } from "../action";

interface IRecipeInput {
  name: string;
  imageUrl: string;
  ingredients: IIngredient[];
  instruction: string;
  RegionId: string;
}

export default function AddRecipe() {
  const [recipe, setRecipe] = useState<IRecipeInput>({
    name: "",
    imageUrl: "",
    ingredients: [{ measurement: "", name: "" }],
    instruction: "",
    RegionId: "",
  });
  const [regions, setRegions] = useState<IRegion[]>([]);

  console.log(recipe);

  async function fetchRegions() {
    const response = await getRegions();
    if (response.error) {
      return <h1>REGIONS NOT FOUND</h1>;
    }
    const data: IRegion[] = response.data;
    setRegions(data);
  }

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
      if (
        recipe.ingredients.length < 2 ||
        (recipe.ingredients[recipe.ingredients.length - 2].measurement.trim() &&
          recipe.ingredients[recipe.ingredients.length - 2].name.trim())
      ) {
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

      <form className="bg-white rounded-lg shadow-md p-6">
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRecipe({ ...recipe, name: e.target.value })
            }
            placeholder="Enter recipe name"
          />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ingredients
          </h2>

          {recipe.ingredients.map((item, index) => (
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
                    setRecipe((prev) => {
                      const newIngredients = [...prev.ingredients];
                      newIngredients[index].measurement = e.target.value;
                      return { ...prev, ingredients: newIngredients };
                    })
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
            value={recipe.instruction}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setRecipe({ ...recipe, instruction: e.target.value })
            }
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
            value={recipe.RegionId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setRecipe({ ...recipe, RegionId: e.target.value })
            }
          >
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
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Image
          </label>
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
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Add Recipe
          </button>
        </div>
      </form>
    </div>
  );
}
