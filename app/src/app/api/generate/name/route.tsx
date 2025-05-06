import { gemini } from "@/services/gemini";
import { NextRequest, NextResponse } from "next/server";
import { schema } from "../schema";
import User from "@/db/models/Users";
import CustomError from "@/db/exeptions/customError";
import { MongoloquentNotFoundException } from "mongoloquent";

export const POST = async (request: NextRequest) => {
  try {
    const { name } = await request.json();
    if (!name)
      return NextResponse.json(
        { message: "No name or description provided" },
        { status: 400 }
      );
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
		const user = await User.findOrFail(request.headers.get("x-user-id") as string);
		if (!user.isPremium && user.tokenCount <= 0) throw new CustomError("You don't have enough tokens", 402);
		const result = await gemini(name, schema, systemInstruction);
		await user.payToken();
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		if (error instanceof TypeError) return NextResponse.json({ message: error.message });
		if (error instanceof CustomError) return NextResponse.json({ message: error.message }, { status: error.status as number });
		if (error instanceof MongoloquentNotFoundException) return NextResponse.json({ message: "Please login or register if you want to access this feature." }, { status: 401 });
		if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 500 });
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
};
