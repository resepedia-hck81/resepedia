import { gemini } from "@/services/gemini";
import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const formData = await request.formData();
	const image = formData.get("image");
	console.log("image", image);

	if (!image) return new NextResponse("No image provided", { status: 400 });
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
			text: `**Objective:** Analyze a provided image of ingredients and generate exactly three unique recipe recommendations that can be made using *only* the items visible in the image. No external ingredients are allowed in the generated recipes.

**Input:**

1.  **\`image_of_ingredients\`**: (Image Input) An image file containing a collection of food ingredients.
2.  **\`user_region_id\`**: (String) The ObjectId string representing the user's geographical region. This will be included in the output \`recipes\` schema.

**Output Rules:**

1.  **Strict Ingredient Usage:** **Crucially, each recommended recipe must exclusively use ingredients that are clearly identifiable in the \`image_of_ingredients\` input.** Do not assume the user has salt, pepper, water, or any other common staple unless they are explicitly visible in the image. If a recipe requires an ingredient not in the image, it cannot be recommended.
2.  **Number of Recipes:** Output exactly three distinct recipe recommendations. If it's impossible to form three *distinct* recipes from the available ingredients (e.g., only one or two simple combinations are possible), generate the maximum possible distinct recipes (1 or 2) and note the limitation.
3.  **Output Format:** Output a JSON array containing exactly three recipe objects, adhering strictly to the following schema:

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
      "instructions": "string",
      "Regionid": "ObjectId string"
    },
    // ... two more recipe objects following the same schema ...
  ]
  \`\`\`

  *   \`name\`: The name of the recipe.
  *   \`ingredients\`: An array listing the specific ingredients from the image used in this recipe, with approximate quantities and units (infer these from the image if possible, otherwise use common sense or indicate "to taste/as needed" if quantity is unclear).
  *   \`instructions\`: A step-by-step guide on how to prepare the dish using the listed ingredients. Keep instructions relatively simple.
  *   \`Region\`: Populate this field with \`country_region\` ex: \`INDONESIA_SURABAYA\`.
4.  **Infer Ingredients from Image:** You must be able to identify the ingredients from the visual data in the image. If an ingredient is unidentifiable, it cannot be used in a recipe.
5.  **Plausible Recipes:** The recipes should be reasonably plausible and edible combinations of the identified ingredients.
6.  **Handle Limited Ingredients:** If the image contains very few or incompatible ingredients, generate the best possible (even simple) recommendations based on what *is* present. If no recipes are possible, return an empty array \`[]\` and potentially a brief note outside the JSON (though the primary output must be the JSON).`,
		},
	];
	const result = await gemini(image, schema, systemInstruction);
	return NextResponse.json(result, { status: 200 });
};
