"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { IRecipe } from "@/app/page";
import { getAlternativeIngredients, getRecipeBySlug } from "./action";
import Swal from "sweetalert2";

interface IAlternative {
  [ingredient: string]: string[];
}

export default function RecipeDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [recipe, setRecipe] = useState<IRecipe>({
    _id: "",
    name: "",
    slug: "",
    imageUrl: "",
    ingredients: [],
    instruction: "",
    RegionId: "",
    UserId: "",
    createdAt: "",
    updatedAt: "",
  });
  const [alternatives, setAlternatives] = useState<IAlternative[]>([]);

  async function fetchRecipe() {
    const response = await getRecipeBySlug(slug);
    if (response.error) {
      return <h1>NOT FOUND</h1>;
    }
    const data: IRecipe = response.data;
    setRecipe(data);
  }

  useEffect(() => {
    fetchRecipe();
  }, []);

  async function generateAlternatives() {
    Swal.fire({
      title: "Generating Alternatives...",
      text: "Please wait while we fetch alternative ingredients.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await getAlternativeIngredients(slug);
    if (response.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch alternative ingredients. Please try again later.",
      });
      return;
    }
    const data: IAlternative[] = response.data;
    setAlternatives(data);
    Swal.close();
  }

  return (
    <div className="container my-5 px-4 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link
          href="/"
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

      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">{recipe.name}</h1>
        <div
          className="mb-6 relative mx-auto"
          style={{ maxWidth: "600px", width: "100%", height: "400px" }}
        >
          {recipe.imageUrl && (
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              sizes="(max-width: 600px) 100vw, 600px"
              priority
              className="rounded-lg shadow-md object-cover"
            />
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Region</h2>
        <p className="text-gray-600">{recipe.RegionId}</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Ingredients</h2>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            onClick={generateAlternatives}
          >
            Generate Alternative Ingredients
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-2 border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold border-2 border-gray-300 whitespace-nowrap">
                  Measurement
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold border-2 border-gray-300 whitespace-nowrap">
                  Ingredient
                </th>
                {alternatives.length > 0 && (
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-2 border-gray-300">
                    Alternative Ingredients
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {recipe.ingredients.map((ingredient, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 border-2 border-gray-300 whitespace-nowrap text-gray-700">
                    {ingredient.measurement || ""}
                  </td>
                  <td className="px-4 py-3 border-2 border-gray-300 whitespace-nowrap text-gray-700 font-medium">
                    {ingredient.name || ""}
                  </td>
                  {alternatives.length > 0 && (
                    <td className="px-4 py-3 border-2 border-gray-300">
                      <div className="flex flex-wrap gap-2">
                        {alternatives[index] &&
                        alternatives[index][ingredient.name] ? (
                          alternatives[index][ingredient.name].map((alt, i) => (
                            <span
                              key={`${ingredient.name}-${i}`}
                              className="bg-red-50 text-red-700 text-sm px-2 py-1 rounded-md border border-red-100"
                            >
                              {alt}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">
                            No alternatives
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Instructions
        </h2>
        <div className="space-y-3 text-gray-700">
          {recipe.instruction.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>

      <div className="text-center mt-10 mb-6">
        <Link
          href={`/editrecipe/${recipe.slug}`}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md inline-block"
        >
          Edit Recipe
        </Link>
      </div>
    </div>
  );
}
