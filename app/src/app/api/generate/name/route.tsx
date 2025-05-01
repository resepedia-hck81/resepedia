import { gemini } from "@/services/gemini";
import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const { name } = await request.json();
	if (!name) return new NextResponse("No name provided", { status: 400 });
	const schema = {
		type: Type.OBJECT,
		required: ["recipes"],
		properties: {
			recipes: {
				type: Type.ARRAY,
				items: {
					type: Type.OBJECT,
					required: ["name", "ingredients", "instructions", "region"],
					properties: {
						name: {
							type: Type.STRING,
						},
						ingredients: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								required: ["name", "measurement"],
								properties: {
									name: {
										type: Type.STRING,
									},
									measurement: {
										type: Type.STRING,
									},
								},
							},
						},
						instructions: {
							type: Type.STRING,
						},
						region: {
							type: Type.STRING,
						},
					},
				},
			},
		},
	};
	const systemInstruction = [
		{
			text: `**Objective:** Generate exactly three distinct recipe recommendations for the specific food item provided in the input. The recipes should offer variations or different approaches to making the same dish.

**Input:**

1.  **\`food_name\`**: (String) The name of the food item for which you want recipe recommendations.

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
            "quantity": "string",
            "unit": "string"
          }
        ],
        "instructions": "string",
        "Region": "string"
      },
      // ... two more recipe objects following the same schema ...
    ]
    \`\`\`

    *   \`name\`: The specific name of this version of the recipe (e.g., "Classic Spaghetti Carbonara", "Simple Spaghetti Carbonara", "Roman-Style Spaghetti Carbonara").
    *   \`ingredients\`: An array listing the ingredients needed, including approximate quantities and units.
    *   \`instructions\`: A step-by-step guide on how to prepare the dish.
    *   \`Region\`: A string indicating a relevant geographical region or style associated with this specific recipe variation (e.g., "Italy", "Roman", "American", "Southeast Asia").
3.  **Recipe Detail:** Provide clear ingredient lists and concise, easy-to-follow instructions for each of the three recipes.
4.  **Plausibility:** Ensure the generated recipes are realistic and widely recognized methods for preparing the given \`food_name\`.`,
		},
	];
	const result = await gemini(name, schema, systemInstruction);
	return NextResponse.json(result, { status: 200 });
};
