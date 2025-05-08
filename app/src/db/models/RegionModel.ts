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
  static async getRegionById(id: string) {
    const collection = this.getCollection();
    const region = await collection.findOne({ _id: new ObjectId(id) });
    return region;
  }
  static async getRegionByName(name: string) {
    const collection = this.getCollection();
    const region = await collection.findOne({ name });
    return region;
  }
}
