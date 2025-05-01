"use client";
import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Ingredient {
  measurement: string;
  name: string;
}

export default function AddRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { measurement: "", name: "" },
  ]);

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string): void => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    
    // Pastikan hanya ada satu baris kosong di akhir
    const cleanedIngredients = newIngredients.filter((item, idx) => {
      // Jika bukan baris terakhir, simpan semua yang tidak kosong
      if (idx < newIngredients.length - 1) {
        return item.measurement.trim() !== "" || item.name.trim() !== "";
      }
      // Selalu simpan baris terakhir
      return true;
    });
    
    setIngredients(cleanedIngredients);
  };

  // Menambahkan field name baru ketika field terakhir diisi
  useEffect(() => {
    const lastIndex = ingredients.length - 1;
    const lastIngredient = ingredients[lastIndex];
    
    // Hanya tambahkan field baru jika yang terakhir sudah diisi
    if (lastIngredient.measurement.trim() && lastIngredient.name.trim()) {
      // Tambahkan baris baru hanya jika baris saat ini tidak kosong
      if (ingredients.length < 2 || 
          (ingredients[ingredients.length - 2].measurement.trim() && 
           ingredients[ingredients.length - 2].name.trim())) {
        setIngredients([...ingredients, { measurement: "", name: "" }]);
      }
    }
    
    // Hapus baris kosong kecuali yang terakhir
    const filledIngredients = ingredients.filter((item, idx) => {
      // Jika bukan baris terakhir, harus terisi
      if (idx < ingredients.length - 1) {
        return item.measurement.trim() !== "" || item.name.trim() !== "";
      }
      // Selalu simpan baris terakhir
      return true;
    });
    
    // Pastikan minimal ada satu baris
    if (filledIngredients.length !== ingredients.length) {
      setIngredients(filledIngredients);
    }
  }, [ingredients]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Logic untuk menambahkan resep akan diimplementasikan di sini
    console.log("Form submitted");
  };

  return (
    <div className="container max-w-5xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Recipe</h1>

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
                  htmlFor={`name${index + 1}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ingredient {index + 1}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  id={`name${index + 1}`}
                  name={`name${index + 1}`}
                  placeholder="e.g. Salt"
                  value={item.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleIngredientChange(index, "name", e.target.value)
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