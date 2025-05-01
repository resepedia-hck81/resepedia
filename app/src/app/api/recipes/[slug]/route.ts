import CustomError from "@/app/db/exeptions/customError"
import RecipeModel from "@/app/db/models/recipeModel"
import { NextRequest, NextResponse } from "next/server"
import { IInput } from "../route"

interface IProps {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, Props: IProps) {
  try {
    const { slug } = await Props.params
    const recipe = await RecipeModel.getRecipeBySlug(slug)
    return NextResponse.json(recipe, { status: 200 })
  } catch (err) {
    console.log("Error fetching recipes (API):", err)
    if (err instanceof CustomError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: "ISE" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, Props: IProps) {
  try {
    const _id = request.headers.get("x-user-id")
    if (!_id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { slug } = await Props.params
    const body: IInput = await request.json()
    const { name, imageUrl, ingredients, instruction } = body
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }
    if (!imageUrl) {
      return NextResponse.json({ message: "Image Url is required" }, { status: 400 })
    }
    if (ingredients.length < 1) {
      return NextResponse.json({ message: "Ingredients are required" }, { status: 400 })
    }
    if (!instruction) {
      return NextResponse.json({ message: "Instruction is required" }, { status: 400 })
    }
    const recipe = await RecipeModel.updateRecipeBySlug(slug, {...body, UserId: _id})
    return NextResponse.json(recipe, { status: 200 })
  } catch (err) {
    console.log("Error updating recipe (API):", err)
    if (err instanceof CustomError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: "ISE" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, Props: IProps) {
  try {
    const _id = request.headers.get("x-user-id")
    if (!_id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { slug } = await Props.params
    const recipe = await RecipeModel.deleteRecipeBySlug(slug, _id)
    return NextResponse.json(recipe, { status: 200 })
  } catch (err) {
    console.log("Error deleting recipe (API):", err)
    if (err instanceof CustomError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    return NextResponse.json({ message: "ISE" }, { status: 500 })
  }
}