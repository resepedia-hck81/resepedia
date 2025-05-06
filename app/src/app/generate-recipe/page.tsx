"use client";
import { useState } from "react";
import GenerateByImage from "../components/GenerateByImage";
import GenerateByName from "../components/GenerateByName";

export default function GenerateRecipe() {
	const [activeTab, setActiveTab] = useState("image");

	return (
		<div className="container max-w-6xl mx-auto py-8 px-4">
			<div className="text-center mb-8">
				<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Generate Your Perfect Recipe</h1>
				<p className="text-gray-600 max-w-2xl mx-auto">Let us help you create delicious recipes based on your input!</p>
			</div>
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="tabs-container">
					<div className="overflow-x-auto">
						<div className="tabs-lift tabs border-b border-gray-200">
							<input type="radio" name="recipe_tabs" className="tab z-1 text-gray-800" aria-label="Generate by Image" checked={activeTab === "image"} onChange={() => setActiveTab("image")} />
							<div className={`tab-content w-full border-base-300 bg-base-100 p-6 ${activeTab !== "image" ? "hidden" : ""}`}>
								<GenerateByImage />
							</div>
							<input type="radio" name="recipe_tabs" className="tab z-1 text-gray-800" aria-label="Generate by Name or Description" checked={activeTab === "name"} onChange={() => setActiveTab("name")} />
							<div className={`tab-content w-full border-base-300 bg-base-100 p-6 ${activeTab !== "name" ? "hidden" : ""}`}>
								<GenerateByName />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
