import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

let db: Db;

function connect() {
  try {
    db = client.db("resepedia");
  } catch (error) {
    console.log("🚀 ~ run ~ error:", error);
  }
}

export function getDB() {
  if (!db) connect();
  return db;
}
