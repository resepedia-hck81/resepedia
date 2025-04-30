import CustomError from "@/app/db/exeptions/customError";
import RecipeModel from "@/app/db/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";

interface IProps {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, Props: IProps) {
  try {
    const { slug } = await Props.params;
    const recipe = await RecipeModel.generateAlternatives(slug);
    return NextResponse.json(recipe, { status: 200 });
  } catch (err) {
    console.log("Error generating alternatives (API):", err);
    if (err instanceof CustomError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
