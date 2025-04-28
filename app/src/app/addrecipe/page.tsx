"use client";
import Link from "next/link";

export default function AddRecipe() {
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
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            id="name"
            name="name"
            placeholder="Enter recipe name"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ingredients
          </h2>

          {Array.from({ length: 20 }).map((_, index) => (
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  id={`measurement${index + 1}`}
                  name={`measurement${index + 1}`}
                  placeholder="e.g. 2 tablespoons"
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  id={`ingredient${index + 1}`}
                  name={`ingredient${index + 1}`}
                  placeholder="e.g. Salt"
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
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            id="instructions"
            name="instructions"
            rows="10"
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
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-700"
            id="file"
            name="file"
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
