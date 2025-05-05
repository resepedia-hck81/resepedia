import CustomError from "@/db/exeptions/customError";
import RecipeModel from "@/db/models/recipeModel";
import RegionModel from "@/db/models/RegionModel";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export interface IInput {
  name: string
  imageUrl: string
  ingredients: IIngredient[]
  instruction: string
  RegionId: string
}

interface IIngredient {
  name: string
  measurement: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("profilePage") ? request.headers.get("x-user-id") : null
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const sort = searchParams.get("sort") === "desc" ? -1 : 1
    const sortBy = searchParams.get("sortBy") === "createdAt" ? "createdAt" : "name"
    const filter = searchParams.get("filter") || ""
    const search = searchParams.get("search") || ""
    const result = await RecipeModel.getRecipes({
      page,
      limit,
      sort,
      sortBy,
      filter,
      search,
      UserId: _id,
    })
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.log("Error fetching recipes (API):", err)
    if (err instanceof CustomError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: "ISE" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
	  const _id = request.headers.get("x-user-id")
    if (!_id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    let body: IInput
    body = await request.json();
    const { name, imageUrl, ingredients, instruction, RegionId } = body
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }
    if (!imageUrl) {
      return NextResponse.json({ message: "Image Url is required" }, { status: 400 })
    }
    if (ingredients.length < 1) {
      return NextResponse.json({ message: "At least put 1 ingredient" }, { status: 400 })
    }
    let newIngredients = ingredients
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
    const region = await RegionModel.getRegionById(RegionId)
    if (!region) {
      return NextResponse.json({ message: "Region not found" }, { status: 400 })
    }
    const message = await RecipeModel.addRecipe({...body, UserId: _id, ingredients: newIngredients})
    return NextResponse.json(message, { status: 201 })
  } catch (err) {
    console.log("Error adding recipe (API):", err)
    if (err instanceof CustomError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    } else if (err instanceof ZodError) {
      return NextResponse.json({ message: err.issues[0].message }, { status: 400 })
    } else if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 400 })
    }
    return NextResponse.json({ message: "ISE" }, { status: 500 })
  }
}