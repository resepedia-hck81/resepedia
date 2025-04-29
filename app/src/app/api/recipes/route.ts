import CustomError from "@/app/db/exeptions/customError";
import RecipeModel from "@/app/db/models/recipeModel";

export async function GET(request: Request) {
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
    return Response.json(result, { status: 200 })
  } catch (err) {
    console.log("Error fetching recipes (API):", err)
    if (err instanceof CustomError) {
      return Response.json({ message: err.message }, { status: err.status })
    }
    return Response.json({ message: "ISE" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = await RecipeModel.addRecipe(body)
    return Response.json(message, { status: 201 })
  } catch (err) {
    console.log("Error adding recipe (API):", err)
    if (err instanceof CustomError) {
      return Response.json({ message: err.message }, { status: err.status })
    }
    return Response.json({ message: "ISE" }, { status: 500 })
  }
}