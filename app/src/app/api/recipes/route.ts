import CustomError from "@/app/db/exeptions/customError";
import RecipeModel from "@/app/db/models/recipeModel";
import { ZodError } from "zod";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const sort = searchParams.get("sort") === "asc" ? 1 : -1
    const sortBy = searchParams.get("sortBy") === "name" ? "name" : "createdAt"
    const filter = searchParams.get("filter") || ""
    const search = searchParams.get("search") || ""

    const recipes = await RecipeModel.getRecipes({
      page,
      limit,
      sort,
      sortBy,
      filter,
      search,
    });

    return Response.json(recipes, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      const error = err.errors[0];
      return Response.json(
        { message: `${error.path} - ${error.message}` },
        { status: 400 }
      );
    }
    if (err instanceof CustomError) {
      return Response.json(
        { message: err.message },
        { status: err.status }
      );
    }
    return Response.json({ message: "ISE" }, { status: 500 });
  }
}