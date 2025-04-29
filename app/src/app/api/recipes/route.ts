import CustomError from "@/app/db/exeptions/customError";
import RecipeModel from "@/app/db/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";

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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const sort = searchParams.get("sort") === "asc" ? 1 : -1
    const sortBy = searchParams.get("sortBy") === "name" ? "name" : "createdAt"
    const filter = searchParams.get("filter") || ""
    const search = searchParams.get("search") || ""
    const result = await RecipeModel.getRecipes({
      page,
      limit,
      sort,
      sortBy,
      filter,
      search
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

    const body: IInput = await request.json()
    const { name, imageUrl, ingredients, instruction } = body
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }
    if (!imageUrl) {
      return NextResponse.json({ message: "Image Url is required" }, { status: 400 })
    }
    if (ingredients.length < 1) {
      return NextResponse.json({ message: "At least put 1 ingredient" }, { status: 400 })
    }
    if (!instruction) {
      return NextResponse.json({ message: "Instruction is required" }, { status: 400 })
    }
    
    // call regionid, then validate

    const message = await RecipeModel.addRecipe({...body, UserId: _id})
    return NextResponse.json(message, { status: 201 })
  } catch (err) {
    console.log("Error adding recipe (API):", err)
    if (err instanceof CustomError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: "ISE" }, { status: 500 })
  }
}