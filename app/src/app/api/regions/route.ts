import RegionModel from "@/db/models/RegionModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const regions = await RegionModel.getAllRegions();
    return NextResponse.json(regions);
  } catch {
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}