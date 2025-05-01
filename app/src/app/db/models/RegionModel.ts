import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb";

interface IRegion {
  _id: ObjectId;
  name: string;
}

export default class RegionModel {
  static getCollection() {
    const db = getDB();
    return db.collection<IRegion>("regions");
  }
  static async getAllRegions() {
    const collection = this.getCollection();
    const regions = await collection.find().toArray();
    return regions;
  }
}
