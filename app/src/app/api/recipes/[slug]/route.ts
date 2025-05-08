import CustomError from "@/db/exeptions/customError";
import RecipeModel from "@/db/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";
import { IInput } from "../route";
import RegionModel from "@/db/models/RegionModel";
import { ZodError } from "zod";

interface IProps {
	params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, Props: IProps) {
	try {
		const { slug } = await Props.params;
		const recipe = await RecipeModel.getRecipeBySlug(slug);
		return NextResponse.json(recipe, { status: 200 });
	} catch (err) {
		// console.log("Error fetching recipes (API):", err)
		if (err instanceof CustomError) {
			return NextResponse.json({ message: err.message }, { status: err.status as number });
		}
		return NextResponse.json({ message: "ISE" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, Props: IProps) {
	try {
		const _id = request.headers.get("x-user-id");
		if (!_id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const { slug } = await Props.params;
		const body: IInput = await request.json();
		const { name, imageUrl, ingredients, instruction, RegionId } = body;
		if (!name) {
			return NextResponse.json({ message: "Name is required" }, { status: 400 });
		}
		if (!imageUrl) {
			return NextResponse.json({ message: "Image Url is required" }, { status: 400 });
		}
		if (ingredients.length < 1) {
			return NextResponse.json({ message: "Ingredients are required" }, { status: 400 });
		}
		const newIngredients = ingredients
			.filter((ingredient) => ingredient.name || ingredient.measurement)
			.map((ingredient) => {
				if (!ingredient.name || !ingredient.measurement) {
					throw new Error("Both ingredient name and measurement are required");
				}
				return ingredient;
			});
		if (!instruction) {
			return NextResponse.json({ message: "Instruction is required" }, { status: 400 });
		}
		const region = await RegionModel.getRegionById(RegionId);
		if (!region) {
			return NextResponse.json({ message: "Region not found" }, { status: 400 });
		}
		const message = await RecipeModel.updateRecipeBySlug(slug, { ...body, UserId: _id, ingredients: newIngredients });
		return NextResponse.json(message, { status: 200 });
	} catch (err) {
		// console.log("Error updating recipe (API):", err);
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

export async function DELETE(request: NextRequest, Props: IProps) {
	try {
		const _id = request.headers.get("x-user-id");
		if (!_id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const { slug } = await Props.params;
		const recipe = await RecipeModel.deleteRecipeBySlug(slug, _id);
		return NextResponse.json(recipe, { status: 200 });
	} catch (err) {
		// console.log("Error deleting recipe (API):", err);
		if (err instanceof CustomError) {
			return NextResponse.json({ message: err.message }, { status: err.status as number });
		}
		return NextResponse.json({ message: "ISE" }, { status: 500 });
	}
}
