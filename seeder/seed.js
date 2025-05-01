import { MongoClient } from "mongodb"
import { MONGO_URI } from "./setting.js";
import fs from "fs/promises";

const uri = MONGO_URI
if (!uri) {
  throw new Error("Cannot connect to mongoDB");
}

let db = null
const client = new MongoClient(uri)
const regionData = [];

(() => {
  db = client.db("resepedia")
  return db
})()

async function seed() {
  // region
  const regions = db.collection("regions")

  console.log("\n=====================\n");
  console.log("Deleting all regions...");
  await regions.deleteMany({})
  
  console.log("Inserting regions...");
  const regionParams = await JSON.parse(await fs.readFile("./json/regions.json", "utf-8")).map((region) => {
    return {
      name: region.name,
    }
  })
  await regions.insertMany(regionParams)
  console.log("Regions seeded successfully")

  // user
  const users = db.collection("users")
  
  console.log("\n=====================\n");
  
  console.log("Deleting all users...");
  await users.deleteMany({});
  
  console.log("Inserting users...");
  const userParams = await JSON.parse(await fs.readFile("./json/users.json", "utf-8")).map((user) => {
    delete user._id
    return user
  })
  await users.insertMany(userParams)
  console.log("Users seeded successfully")

  // recipe
  const recipes = db.collection("recipes")
  
  console.log("\n=====================\n");
  
  console.log("Deleting all users...");
  await recipes.deleteMany({});

  console.log("Calling regions...");
  const regionData = await regions.find().toArray()
  const oldRegionData = await JSON.parse(await fs.readFile("./json/regions.json", "utf-8"))

  console.log("Calling users...");
  const userData = await users.find().toArray()

  console.log("Inserting recipes...");
  const recipeParams = await Promise.all(
    (await JSON.parse(await fs.readFile("./json/recipes.json", "utf-8"))).map(async (recipe) => {
      delete recipe.id;
      recipe.UserId = userData[0]._id;
      const oldRegion = oldRegionData.find((oldRegion) => oldRegion._id === recipe.RegionId);
      if (oldRegion) {
        const matchingRegion = regionData.find((region) => region.name === oldRegion.name);
        if (matchingRegion) {
          recipe.RegionId = matchingRegion._id;
        }
      }
      return recipe;
    })
  );
  await recipes.insertMany(recipeParams)
  console.log("Recipes seeded successfully")
}

seed()
  .catch((err) => {
    console.error("Error seeding regions:", err)
  })
  .finally(() => {
    console.log("\n=====================\n");
    console.log("Seeding completed")
    console.log("Closing connection.");
    client.close()
  })