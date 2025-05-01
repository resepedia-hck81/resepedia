"use client";
import Link from "next/link";
import { useState } from "react";

export default function FindRecipe() {
  const [activeTab, setActiveTab] = useState("image");
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [activeRecipeTab, setActiveRecipeTab] = useState(0);
  const [activeSearchRecipeTab, setActiveSearchRecipeTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [detectedIngredients, setDetectedIngredients] = useState([
    "Chicken",
    "Bell peppers",
    "Garlic",
    "Onion",
    "Ginger",
  ]);

  const [recommendedRecipes, setRecommendedRecipes] = useState([
    {
      id: 1,
      name: "Spicy Garlic Chicken Stir Fry",
      region: "Asian Fusion",
      ingredients: [
        {
          name: "Chicken breast",
          amount: "500g",
          notes: "cut into thin strips",
        },
        { name: "Bell peppers", amount: "2", notes: "sliced" },
        { name: "Garlic", amount: "4 cloves", notes: "minced" },
        { name: "Onion", amount: "1 medium", notes: "thinly sliced" },
        { name: "Soy sauce", amount: "3 tbsp", notes: "" },
        { name: "Chili sauce", amount: "2 tbsp", notes: "adjust to taste" },
        { name: "Vegetable oil", amount: "2 tbsp", notes: "" },
        { name: "Sesame oil", amount: "1 tsp", notes: "" },
        { name: "Brown sugar", amount: "1 tbsp", notes: "" },
        { name: "Ginger", amount: "1 inch", notes: "grated" },
      ],
      instructions: [
        "In a bowl, combine soy sauce, chili sauce, brown sugar, and sesame oil to make the sauce.",
        "Heat vegetable oil in a large wok or skillet over high heat.",
        "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
        "Add chicken strips and cook until they turn white, about 2-3 minutes.",
        "Add onions and bell peppers, stir-fry for another 2 minutes until vegetables are crisp-tender.",
        "Pour the sauce mixture over the chicken and vegetables, toss to coat everything evenly.",
        "Cook for another 1-2 minutes until the sauce thickens slightly.",
        "Serve hot with steamed rice or noodles.",
      ],
    },
    {
      id: 2,
      name: "Chicken and Bell Pepper Fajitas",
      region: "Mexican",
      ingredients: [
        { name: "Chicken breast", amount: "450g", notes: "sliced into strips" },
        {
          name: "Bell peppers",
          amount: "3",
          notes: "different colors, sliced",
        },
        { name: "Onion", amount: "1 large", notes: "sliced" },
        { name: "Garlic", amount: "3 cloves", notes: "minced" },
        { name: "Lime", amount: "1", notes: "juice only" },
        { name: "Cumin", amount: "1 tsp", notes: "" },
        { name: "Paprika", amount: "1 tsp", notes: "" },
        { name: "Chili powder", amount: "1/2 tsp", notes: "" },
        { name: "Olive oil", amount: "2 tbsp", notes: "" },
        { name: "Tortillas", amount: "8", notes: "warmed" },
      ],
      instructions: [
        "In a bowl, mix lime juice, cumin, paprika, chili powder, and 1 tbsp olive oil.",
        "Add chicken strips to the marinade and let sit for at least 15 minutes.",
        "Heat the remaining olive oil in a large skillet over high heat.",
        "Add the marinated chicken and cook until no longer pink, about 5-6 minutes.",
        "Remove chicken and set aside. In the same skillet, add onions and bell peppers.",
        "Cook vegetables until slightly charred but still crisp, about 4-5 minutes.",
        "Add minced garlic and cook for another 30 seconds.",
        "Return chicken to the skillet and mix with the vegetables. Season with salt and pepper.",
        "Serve hot with warm tortillas and your favorite toppings.",
      ],
    },
    {
      id: 3,
      name: "Ginger Chicken with Vegetables",
      region: "Chinese",
      ingredients: [
        {
          name: "Chicken thighs",
          amount: "600g",
          notes: "boneless, cut into chunks",
        },
        { name: "Ginger", amount: "2 inch piece", notes: "julienned" },
        { name: "Garlic", amount: "4 cloves", notes: "sliced" },
        { name: "Bell peppers", amount: "2", notes: "cut into chunks" },
        { name: "Onion", amount: "1", notes: "cut into wedges" },
        { name: "Shaoxing wine", amount: "2 tbsp", notes: "or dry sherry" },
        { name: "Soy sauce", amount: "3 tbsp", notes: "" },
        { name: "Oyster sauce", amount: "1 tbsp", notes: "" },
        { name: "Sugar", amount: "1 tsp", notes: "" },
        {
          name: "Cornstarch",
          amount: "1 tbsp",
          notes: "mixed with 2 tbsp water",
        },
      ],
      instructions: [
        "Marinate chicken with 1 tbsp soy sauce and set aside for 10 minutes.",
        "Heat oil in a wok over high heat until smoking.",
        "Add ginger and garlic, stir fry for 30 seconds until fragrant.",
        "Add chicken and stir fry until no longer pink on the outside, about 3 minutes.",
        "Add bell peppers and onion, stir fry for 2 minutes until vegetables start to soften.",
        "Add Shaoxing wine, remaining soy sauce, oyster sauce, and sugar. Stir to combine.",
        "Pour in cornstarch slurry and stir until sauce thickens, about 1 minute.",
        "Serve hot over steamed rice.",
      ],
    },
  ]);

  // Same recipes for search results (in a real app, these would be different based on search)
  const [searchResults, setSearchResults] = useState([...recommendedRecipes]);

  const handleAnalyzeIngredients = () => {
    // In a real application, this would call your AI API to analyze the image
    // For now, we just show the mock result
    setShowAnalysisResult(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, this would perform an API call with the search query
    // For now, we just show the mock results
    setShowSearchResult(true);
  };

  const resetSearch = () => {
    setShowSearchResult(false);
    setSearchQuery("");
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
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

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Find Your Perfect Recipe
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Let us help you discover delicious recipes based on your ingredients
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="tabs-container">
          <div className="overflow-x-auto">
            <div className="tabs-lift tabs min-w-max border-b border-gray-200">
              <input
                type="radio"
                name="recipe_tabs"
                className="tab z-1"
                aria-label="Generate by Image"
                checked={activeTab === "image"}
                onChange={() => setActiveTab("image")}
              />
              <div
                className={`tab-content w-full border-base-300 bg-base-100 p-6 ${
                  activeTab !== "image" ? "hidden" : ""
                }`}
              >
                {/* Tab content for Find by Image */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Generate Recipe by Image
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Upload a photo of your ingredients, and our AI will analyze
                    it to suggest delicious recipes you can make!
                  </p>
                </div>

                {!showAnalysisResult ? (
                  <div className="flex flex-col items-center">
                    <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer mb-6">
                      <div className="text-center p-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 text-gray-400 mx-auto mb-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <p className="text-gray-600 mb-1">
                          Drag and drop an image here, or click to select
                        </p>
                        <p className="text-gray-500 text-sm">
                          Supported formats: JPG, PNG, WEBP
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={handleAnalyzeIngredients}
                        className="px-6 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Analyze Ingredients
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8">
                    {/* Detected Ingredients */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Detected Ingredients
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {detectedIngredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                          >
                            {ingredient}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recipe Recommendations - As Tabs */}
                    <div className="border-t border-gray-200 pt-8">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Recommended Recipes
                      </h2>

                      {/* Recipe Tabs */}
                      <div className="mb-6 border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                          {recommendedRecipes.map((recipe, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveRecipeTab(index)}
                              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                                activeRecipeTab === index
                                  ? "border-b-2 border-red-600 text-red-600"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {recipe.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recipe Content */}
                      <div>
                        {recommendedRecipes.map((recipe, index) => (
                          <div
                            key={index}
                            className={
                              activeRecipeTab === index ? "" : "hidden"
                            }
                          >
                            <div className="mb-6">
                              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {recipe.name}
                              </h1>
                              <div className="flex items-center text-gray-600 mb-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5 mr-1 text-red-600"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                  />
                                </svg>
                                <span>Region: {recipe.region}</span>
                              </div>
                            </div>

                            {/* Ingredients Table */}
                            <div className="mb-8">
                              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Ingredients
                              </h2>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-4 py-2 text-left text-black font-semibold">
                                        Ingredient
                                      </th>
                                      <th className="px-4 py-2 text-left text-black font-semibold">
                                        Measurement
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {recipe.ingredients.map(
                                      (ingredient, idx) => (
                                        <tr
                                          key={idx}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-4 py-3 text-black">
                                            {ingredient.name}
                                          </td>
                                          <td className="px-4 py-3 text-black">
                                            {ingredient.amount}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-8">
                              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Instructions
                              </h2>
                              <ol className="space-y-4 list-decimal list-inside">
                                {recipe.instructions.map((step, idx) => (
                                  <li key={idx} className="text-black">
                                    <span className="ml-2">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Back to Upload Button */}
                      <div className="mt-8 text-center">
                        <button
                          onClick={() => setShowAnalysisResult(false)}
                          className="px-6 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          Upload Another Image
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="radio"
                name="recipe_tabs"
                className="tab z-1"
                aria-label="Generate by Name"
                checked={activeTab === "name"}
                onChange={() => setActiveTab("name")}
              />
              <div
                className={`tab-content w-full border-base-300 bg-base-100 p-6 ${
                  activeTab !== "name" ? "hidden" : ""
                }`}
              >
                {/* Tab content for Find by Name */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Generate Recipe by Name
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Enter ingredients or recipe names to find the perfect dish
                    for your next meal
                  </p>
                </div>

                {!showSearchResult ? (
                  <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative mb-6">
                        <input
                          type="text"
                          className="w-full h-14 px-5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                          placeholder="Search recipes or ingredients (e.g., 'chicken pasta', 'vegetarian')"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
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
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="mt-8">
                    {/* Search Query Display */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Search Results for: "{searchQuery}"
                      </h2>
                    </div>

                    {/* Recipe Recommendations - As Tabs */}
                    <div className="border-t border-gray-200 pt-8">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Recommended Recipes
                      </h2>

                      {/* Recipe Tabs */}
                      <div className="mb-6 border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                          {searchResults.map((recipe, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveSearchRecipeTab(index)}
                              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                                activeSearchRecipeTab === index
                                  ? "border-b-2 border-red-600 text-red-600"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {recipe.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recipe Content */}
                      <div>
                        {searchResults.map((recipe, index) => (
                          <div
                            key={index}
                            className={
                              activeSearchRecipeTab === index ? "" : "hidden"
                            }
                          >
                            <div className="mb-6">
                              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {recipe.name}
                              </h1>
                              <div className="flex items-center text-gray-600 mb-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5 mr-1 text-red-600"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                  />
                                </svg>
                                <span>Region: {recipe.region}</span>
                              </div>
                            </div>

                            {/* Ingredients Table */}
                            <div className="mb-8">
                              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Ingredients
                              </h2>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-4 py-2 text-left text-black font-semibold">
                                        Ingredient
                                      </th>
                                      <th className="px-4 py-2 text-left text-black font-semibold">
                                        Measurement
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {recipe.ingredients.map(
                                      (ingredient, idx) => (
                                        <tr
                                          key={idx}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-4 py-3 text-black">
                                            {ingredient.name}
                                          </td>
                                          <td className="px-4 py-3 text-black">
                                            {ingredient.amount}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-8">
                              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Instructions
                              </h2>
                              <ol className="space-y-4 list-decimal list-inside">
                                {recipe.instructions.map((step, idx) => (
                                  <li key={idx} className="text-black">
                                    <span className="ml-2">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Back to Search Button */}
                      <div className="mt-8 text-center">
                        <button
                          onClick={resetSearch}
                          className="px-6 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          New Search
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
