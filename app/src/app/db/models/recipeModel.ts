import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";
import CustomError from "../exeptions/customError";
import { generateContent } from "../helpers/gemini";


interface IRecipe {
  _id: ObjectId
  name: string
  imageUrl: string
  ingredients: IIngredient[]
  instructions: string
  RegionId: ObjectId
  UserId: ObjectId
  createdAt: string
  updatedAt: string
}

interface IIngredient {
  name: string
  measurement: string
}

interface IProductParam {
  page: number
  limit: number
  sort: number
  sortBy: string
  filter: string
  search: string
}

export default class RecipeModel {
  static getCollection() {
    const db = getDB()
    return db.collection<IRecipe>("recipes")
  }

  static async getRecipes(params: IProductParam) {
    const recipes = this.getCollection()
    const skip = (params.page - 1) * params.limit
    const aggregation = [ 
      {
        $match: params.search
          ? { name: { $regex: params.search, $options: "i" } } 
          : {}, 
      },
      {
        $match: params.filter
          ? { RegionId: +params.filter} // change to filter by name later
          : {},
      },
      {
        $sort: params.sortBy
          ? { [params.sortBy]: params.sort }
          : {},
      },
      { $skip: skip },
      { $limit: params.limit },
    ]
    try {
      const result = await recipes.aggregate<IRecipe>(aggregation).toArray()
      const totalPages = Math.ceil((await recipes.countDocuments()) / params.limit)
      const totalDataCount = await recipes.countDocuments()
      return {
        page: params.page,
        totalPages,
        dataCount: params.limit,
        totalDataCount,
        result
      }
    } catch (error) {
      console.log("Error fetching recipes (model):", error)
      return new CustomError("Internal Server Error", 500)
    }
  }

  static async getRecipeBySlug(slug: string) {
    const recipes = this.getCollection()
    try {
      const recipe = await recipes.findOne({ slug })
      if (!recipe) throw new CustomError("Recipe not found", 404)
      return recipe
    } catch (error) {
      console.log("Error fetching recipe by ID (model):", error)
      return new CustomError("Internal Server Error", 500)
    }
  }

  static async generateAlternatives(slug: string) {
    const recipes = this.getCollection();
    try {
      const recipe = await recipes.findOne({ slug });
      if (!recipe) throw new CustomError("Recipe not found", 404);
      const ingredients = recipe.ingredients.map(
        (ingredient) => ingredient.name
      );
      const prompt = `Create a JSON array of objects, format: {Ingredient: [alternative1, alternative2, ...]}. Ensure each ingredient has exactly 3 alternatives. Exact keys: ${ingredients}`;
      const result = await generateContent(prompt);
      try {
        const parsedResult = JSON.parse(result.replace(/^```json\n|```$/g, ""));
        return parsedResult;
      } catch {
        return new CustomError("Failed to parse generated content", 500);
      }
    } catch {
      return new CustomError("Internal Server Error", 500);
    }
  }
}