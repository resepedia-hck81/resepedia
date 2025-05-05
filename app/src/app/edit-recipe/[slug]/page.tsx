"use client";
import { getRegions } from "@/app/action";
import { IIngredient, IRecipe, IRegion } from "@/app/page";
import { getRecipeBySlug } from "@/app/recipes/[slug]/action";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { uploadToCatbox } from "./action";
import Swal from "sweetalert2";

interface IRecipeInput {
  name: string;
  imageUrl: File | null;
  ingredients: IIngredient[];
  instruction: string;
  RegionId: string;
}

export default function EditRecipe() {
  const { slug } = useParams<{ slug: string }>();

  const [recipe, setRecipe] = useState<IRecipeInput>({
    name: "",
    imageUrl: null,
    ingredients: [{ measurement: "", name: "" }],
    instruction: "",
    RegionId: "",
  });
  const [oldImageUrl, setOldImageUrl] = useState<string>("");
  const [regions, setRegions] = useState<IRegion[]>([]);

  async function fetchRecipe() {
    const response = await getRecipeBySlug(slug);
    if (response.error) {
      return <h1>NOT FOUND</h1>;
    }
    const data: IRecipe = response.data;
    setOldImageUrl(data.imageUrl);
    setRecipe({
      name: data.name,
      imageUrl: null,
      ingredients: data.ingredients.map((item) => ({
        measurement: item.measurement,
        name: item.name,
      })),
      instruction: data.instruction,
      RegionId: data.RegionId,
    });
  }

  async function fetchRegions() {
    const response = await getRegions();
    if (response.error) {
      return <h1>REGIONS NOT FOUND</h1>;
    }
    const data: IRegion[] = response.data;
    setRegions(data);
  }

  const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
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
    if (errors.length) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: errors.join(", "),
      });
    }

    // to change => name, imageUrl, ingredients, instruction, RegionId
    // catbox if imageUrl is not null
    let newImageUrl = "";
    if (recipe.imageUrl) {
      const formData = new FormData();
      if (recipe.imageUrl) {
        formData.append("file", recipe.imageUrl);
      }
      formData.append("name", formData.get("name") as string);
      try {
        const result = await uploadToCatbox(formData);
        newImageUrl = result.url;
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to upload image",
        });
        return;
      }
    } else {
      newImageUrl = oldImageUrl;
    }

    try {
      const response = await fetch("/api/recipes/" + slug, {
        method: "PUT",
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
        throw new Error(result.message || "Failed to edit recipe");
      }
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Recipe edited successfully!",
      });
    } catch (err) {
      console.error("Error editing recipe:", err);
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
    fetchRecipe();
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Recipe</h1>
        <Link
          href={`/recipes/${slug}`}
          className="inline-block text-gray-700 hover:text-red-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      </div>

      <form
        className="bg-white rounded-lg shadow-md p-6"
        onSubmit={(e) => handleChange(e)}
      >
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
            {regions.map((region) => (
              <option key={region._id} value={region._id}>
                {region.name}
              </option>
            ))}
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
            <span className="text-xs text-gray-500">
              Current image will be kept if no new image is uploaded
            </span>
          </div>
          ={" "}
          <div className="mb-3">
            <img
              src={oldImageUrl}
              alt={recipe.name}
              className="w-full h-48 object-contain rounded-md"
            />
          </div>
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
