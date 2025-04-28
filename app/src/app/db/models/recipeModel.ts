import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";


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
  }
}