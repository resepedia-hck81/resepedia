import CustomError from "@/app/db/exeptions/customError"
import RecipeModel from "@/app/db/models/recipeModel"

interface IProps {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, Props: IProps) {
  try {
    const { slug } = await Props.params
    const recipe = await RecipeModel.getRecipeBySlug(slug)
    return Response.json(recipe, { status: 200 })
  } catch (err) {
    console.log("Error fetching recipes (API):", err)
    if (err instanceof CustomError) {
      return Response.json({ message: err.message }, { status: err.status })
    }
    return Response.json({ message: "ISE" }, { status: 500 })
  }
}