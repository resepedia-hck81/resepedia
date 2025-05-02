import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";
import CustomError from "../exeptions/customError";
import { z } from "zod";
import { generateContent } from "../helpers/gemini";
import { Catbox } from 'node-catbox';

interface IRecipe {
  name: string
  slug: string
  imageUrl: string
  ingredients: IIngredient[]
  instruction: string
  RegionId: ObjectId
  UserId: ObjectId
  createdAt: string
  updatedAt: string
}

interface IIngredient {
  name: string
  measurement: string
}

interface IInput {
  name: string
  imageUrl: string
  ingredients: IIngredient[]
  instruction: string
  RegionId: string
  UserId: string
}

interface IProductParam {
  page: number
  limit: number
  sort: number
  sortBy: string
  filter: string
  search: string
}

const recipeSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      measurement: z.string()
    })
  ),
  instruction: z.string()
})

export default class RecipeModel {
  static getCollection() {
    const db = getDB()
    return db.collection<IRecipe>("recipes")
  }

  static async getRecipes(params: IProductParam) {
    const recipes = this.getCollection()
    const skip = (params.page - 1) * params.limit
    const pipeline = [ 
      {
        $match: params.search
          ? { name: { $regex: params.search, $options: "i" } } 
          : {},
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'RegionId',
          foreignField: '_id',
          as: 'regions'
        }
      },
      { $unwind: { path: '$regions', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          region: '$regions.name',
        }
      },
      {
        $match: params.filter
          ? { region: params.filter} 
          : {},
      },
    ]
    const extendedPipeline = [
      ...pipeline,
      {
        $addFields: {
          sortField: {
            $toLower: `$${params.sortBy}`, 
          },
        },
      },
      {
        $sort: params.sortBy
          ? { sortField: params.sort }
          : { sortField: -1 },
      },
      { $skip: skip },
      { $limit: params.limit },
      {
        $lookup: {
          from: 'users',
          localField: 'UserId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          author: '$user.username'
        }
      },
      { $project: { regions: 0, user: 0 } }
    ]
    try {
      const result = await recipes.aggregate<IRecipe>(extendedPipeline).toArray()
      const totalDataCount = (await recipes.aggregate(pipeline).toArray()).length
      const totalPages = Math.ceil(totalDataCount / params.limit)
      return {
        page: params.page,
        totalPages,
        dataCount: result.length,
        totalDataCount,
        result
      }
    } catch (error) {
      console.log("Error fetching recipes (model):", error)
      throw new CustomError("Internal Server Error", 500)
    }
  }

  static async getRecipeBySlug(slug: string) {
    const recipes = this.getCollection()
    const pipeline = [
      {
        $match: { slug }
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'RegionId',
          foreignField: '_id',
          as: 'regions'
        }
      },
      { $unwind: { path: '$regions' } },
      {
        $lookup: {
          from: 'users',
          localField: 'UserId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user' } },
      {
        $addFields: {
          region: '$regions.name',
          author: '$user.username'
        }
      },
      { $project: { regions: 0, user: 0 } }
    ]
    try {
      const recipe = await recipes.aggregate<IRecipe>(pipeline).toArray()
      console.log("recipe", recipe)
      if (!recipe[0]) throw new CustomError("Recipe not found", 404)
      return recipe[0]
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      console.log("Error fetching recipe by ID (model):", error)
      throw new CustomError("Internal Server Error", 500)
    }
  }

  static async addRecipe(input: IInput) {
    const recipes = this.getCollection()
    recipeSchema.passthrough().parse(input)
    const { name, imageUrl, ingredients, instruction, RegionId, UserId } = input

    let newImageUrl = imageUrl;
    if (imageUrl) { 
      const catbox = new Catbox(process.env.CATBOX_USER_HASH)
      try {
        const response = await catbox.uploadFile({
          path: imageUrl,
        });
        console.log("response dari kucing :", response)
        newImageUrl = response;
      } catch (err) {
        throw new CustomError("Failed to upload image", 500);
      }
    }

    const date = new Date()
    const createdAt = date.toISOString()
    const updatedAt = date.toISOString()
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") + "-" + date.getTime()
    try {
      await recipes.insertOne({
        name,
        slug,
        imageUrl: newImageUrl,
        ingredients,
        instruction,
        RegionId: new ObjectId(RegionId),
        UserId: new ObjectId(UserId),
        createdAt,
        updatedAt
      })
      return "Recipe created successfully"
    } catch (error) {
      console.log("Error posting recipe (model):", error)
      throw new CustomError("Internal Server Error", 500)
    }
  }

  static async updateRecipeBySlug(slug: string, input: IInput) {
    const recipes = this.getCollection()
    recipeSchema.passthrough().parse(input)
    const { name, imageUrl, ingredients, instruction, RegionId, UserId } = input
    const date = new Date()
    const updatedAt = date.toISOString()
    try {
      await recipes.updateOne(
        { slug },
        {
          $set: {
            name,
            imageUrl,
            ingredients,
            instruction,
            RegionId: new ObjectId(RegionId),
            UserId: new ObjectId(UserId),
            updatedAt
          }
        }
      )
      return "Recipe updated successfully"
    } catch (error) {
      console.log("Error updating recipe (model):", error)
      return new CustomError("Internal Server Error", 500)
    }
  }

  static async deleteRecipeBySlug(slug: string, UserId: string) {
    const recipes = this.getCollection()
    try {
      const result = await recipes.deleteOne({ slug, UserId: new ObjectId(UserId) })
      console.log("result", result); // need validate
      if (result.deletedCount === 0) throw new CustomError("Forbidden", 403)
      return "Recipe deleted successfully"
    } catch (error) {
      console.log("Error deleting recipe (model):", error)
      throw new CustomError("Internal Server Error", 500)
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