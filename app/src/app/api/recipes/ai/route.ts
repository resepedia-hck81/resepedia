import CustomError from "@/db/exeptions/customError";
import RecipeModel from "@/db/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import RegionModel from "@/db/models/RegionModel";
import { IIngredient } from "@/app/page";

interface IAiInput {
	name: string;
	imageUrl: string;
	ingredients: IIngredient[];
	instructions: string[];
	RegionId: string;
}

export async function POST(request: NextRequest) {
	try {
		const _id = request.headers.get("x-user-id");
		if (!_id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const body: IAiInput = await request.json();
		const { instructions } = body;
		const newInstruction = instructions.join("\n");
		const region = await RegionModel.getRegionByName("Other");
		if (!region) {
			return NextResponse.json({ message: "Failed fetching regions" }, { status: 404 });
		}
		const message = await RecipeModel.addRecipe({ ...body, UserId: _id, instruction: newInstruction, imageUrl: "https://files.catbox.moe/b6vx9b.png", RegionId: region?._id.toString() });
		return NextResponse.json(message, { status: 201 });
	} catch (err) {
		// console.log("Error adding recipe (API):", err);
		if (err instanceof CustomError) {
			return NextResponse.json({ message: err.message }, { status: err.status as number });
		} else if (err instanceof ZodError) {
			return NextResponse.json({ message: err.issues[0].message }, { status: 400 });
		} else if (err instanceof Error) {
			return NextResponse.json({ message: err.message }, { status: 400 });
		}
		return NextResponse.json({ message: "ISE" }, { status: 500 });
	}
}
