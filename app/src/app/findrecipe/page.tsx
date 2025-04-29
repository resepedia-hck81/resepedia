'use client'
import Link from "next/link";
import { useState } from "react";

export default function FindRecipe() {
  const [activeTab, setActiveTab] = useState("image");

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Link href="/" className="inline-block text-gray-700 hover:text-red-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Find Your Perfect Recipe</h1>
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
              <div className={`tab-content w-full border-base-300 bg-base-100 p-6 ${activeTab !== "image" ? "hidden" : ""}`}>
                {/* Tab content for Find by Image */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generate Recipe by Image</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Upload a photo of your ingredients, and our AI will analyze it to suggest delicious recipes you can make!
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div 
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer mb-6"
                  >
                    <div className="text-center p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mx-auto mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-gray-600 mb-1">Drag and drop an image here, or click to select</p>
                      <p className="text-gray-500 text-sm">Supported formats: JPG, PNG, WEBP</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      className="px-6 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Analyze Ingredients
                    </button>
                  </div>
                </div>

                {/* Hidden for now - Recipes section would appear after analysis */}
                <div className="hidden mt-8">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Detected Ingredients</h2>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Chicken
                      </div>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Tomatoes
                      </div>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Onions
                      </div>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Bell peppers
                      </div>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Garlic
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Recipes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Recipe cards (same as before) */}
                  </div>
                </div>
              </div>

              <input 
                type="radio" 
                name="recipe_tabs" 
                className="tab z-1" 
                aria-label="Generate by Name"
                checked={activeTab === "name"}
                onChange={() => setActiveTab("name")} 
              />
              <div className={`tab-content w-full border-base-300 bg-base-100 p-6 ${activeTab !== "name" ? "hidden" : ""}`}>
                {/* Tab content for Find by Name */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generate Recipe by Name</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Enter ingredients or recipe names to find the perfect dish for your next meal
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="relative mb-6">
                    <input
                      type="text"
                      className="w-full h-14 px-5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                      placeholder="Search recipes or ingredients (e.g., 'chicken pasta', 'vegetarian')"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Popular Search Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                        Quick & Easy
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                        Vegetarian
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                        Desserts
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                        Breakfast
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                        Indonesian
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                        Low Calorie
                      </button>
                    </div>
                  </div>

                  {/* Sample results section - hidden initially */}
                  <div className="hidden">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Search Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Recipe card samples would go here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}