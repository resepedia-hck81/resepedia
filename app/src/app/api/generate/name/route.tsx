import { gemini } from "@/services/gemini";
import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { schema } from "../schema";

export const POST = async (request: NextRequest) => {
	try {
		const { name } = await request.json();
		if (!name) return new NextResponse("No name provided", { status: 400 });
		const systemInstruction = [
			{
				text: `**Objective:** Generate exactly three distinct recipe recommendations for the specific food item provided in the input. The recipes should offer variations or different approaches to making the same dish.
    
    **Input:**
    
    1.  **\`food_name\`** or \`food_description\`: (String) The name of the food item or rough description for which you want recipe recommendations.
    
    **Output Rules:**
    
    1.  **Number of Recipes:** Output a JSON array containing exactly three distinct recipe objects. These three recipes should all be for the \`food_name\` provided, but can represent different methods, regional variations, or slightly different ingredient lists for the same core dish.
    2.  **Output Format:** Adhere strictly to the following JSON array schema for the output:
    
        \`\`\`json
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
        \`\`\`
    
        *   \`name\`: The specific name of this version of the recipe (e.g., "Classic Spaghetti Carbonara", "Simple Spaghetti Carbonara", "Roman-Style Spaghetti Carbonara").
        *   \`ingredients\`: An array listing the ingredients needed, including approximate quantities and units.
        *   \`instructions\`: An array of string step-by-step guide on how to prepare the dish.
        *   \`Region\`: A string indicating a relevant geographical region or style associated with this specific recipe variation (e.g., "Italy", "Roman", "American", "Southeast Asia").
    3.  **Recipe Detail:** Provide clear ingredient lists and concise, easy-to-follow instructions for each of the three recipes.
    4.  **Plausibility:** Ensure the generated recipes are realistic and widely recognized methods for preparing the given \`food_name\`.`,
			},
		];
		const result = await gemini(name, schema, systemInstruction);
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Error in POST request:", error);
		if (error instanceof TypeError) return new NextResponse(error.message);
		if (error instanceof Error) return new NextResponse(error.message, { status: 500 });
		return new NextResponse("Internal Server Error", { status: 500 });
	}
};
