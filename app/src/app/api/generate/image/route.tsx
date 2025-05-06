import { gemini } from "@/services/gemini";
import { NextRequest, NextResponse } from "next/server";
import { schema } from "../schema";
import User from "@/db/models/Users";
import CustomError from "@/db/exeptions/customError";
import { MongoloquentNotFoundException } from "mongoloquent";

export const POST = async (request: NextRequest) => {
	try {
		const formData = await request.formData();
		const image = formData.get("image");
		if (!image) throw new CustomError("No image provided", 400);
		const systemInstruction = [
			{
				text: `**Objective:** Analyze a provided image of ingredients and generate exactly three unique recipe recommendations that can be made using *only* the items visible in the image. No external ingredients are allowed in the generated recipes.
    
    **Input:**
    
    1.  **\`image_of_ingredients\`**: (Image Input) An image file containing a collection of food ingredients.
    
    **Output Rules:**
    
    1.  **Strict Ingredient Usage:** **Crucially, each recommended recipe must exclusively use ingredients that are clearly identifiable in the \`image_of_ingredients\` input.** Do not assume the user has salt, pepper, water, or any other common staple unless they are explicitly visible in the image. If a recipe requires an ingredient not in the image, it cannot be recommended.
    2.  **Number of Recipes:** Output exactly three distinct recipe recommendations. If it's impossible to form three *distinct* recipes from the available ingredients (e.g., only one or two simple combinations are possible), generate the maximum possible distinct recipes (1 or 2) and note the limitation.
    3.  **Output Format:** Output a JSON array containing exactly three recipe objects, adhering strictly to the following schema:
    
      \`\`\`json
        {
            [
                {
                    "name": "string",
                    "ingredients": [
                        {
                        "name": "string",
                        "measurement": "string"
                        }
                    ],
                    "instructions": ["string"],
                    "Region": "string"
                },
                // ... two more recipe objects following the same schema ...
            ]
        }
      \`\`\`
    
      *   \`name\`: The name of the recipe.
      *   \`ingredients\`: An array listing the specific ingredients from the image used in this recipe, with approximate quantities and units (infer these from the image if possible, otherwise use common sense or indicate "to taste/as needed" if quantity is unclear).
      *   \`instructions\`: An array of strings. A step-by-step guide on how to prepare the dish using the listed ingredients. Keep instructions relatively simple.
      *   \`Region\`: Populate this field with \`region, country\` format.  Ensure that it must be a valid region, ex: \`Surabaya, Indonesia\`.
    4.  **Infer Ingredients from Image:** You must be able to identify the ingredients from the visual data in the image. If an ingredient is unidentifiable, it cannot be used in a recipe.
    5.  **Plausible Recipes:** The recipes should be reasonably plausible and edible combinations of the identified ingredients.
    6.  **Handle Limited Ingredients:** If the image contains very few or incompatible ingredients, generate the best possible (even simple) recommendations based on what *is* present. If no recipes are possible, return an empty array \`[]\` and potentially a brief note outside the JSON (though the primary output must be the JSON).`,
			},
		];
		const user = await User.findOrFail(request.headers.get("x-user-id") as string);
		if (user.tokenCount <= 0) throw new CustomError("You don't have enough tokens", 402);
		const result = await gemini(image, schema, systemInstruction);
		if (!result?.ingredients?.length) throw new CustomError("Please try again with a clearer image.", 400);
		await user.payToken();
		return NextResponse.json(result, { status: 200 });
	} catch (error: unknown) {
		console.error("Error in POST request:", error);
		if (error instanceof TypeError) return NextResponse.json({ message: error.message });
		if (error instanceof CustomError) return NextResponse.json({ message: error.message }, { status: error.status as number });
		if (error instanceof MongoloquentNotFoundException) return NextResponse.json({ message: "Please login or register if you want to access this feature." }, { status: 401 });
		if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 500 });
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
};
