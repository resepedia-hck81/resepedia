import CustomError from "@/db/exeptions/customError";
import RecipeModel from "@/db/models/recipeModel";
import User from "@/db/models/Users";
import { MongoloquentNotFoundException } from "mongoloquent";
import { NextRequest, NextResponse } from "next/server";

interface IProps {
	params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, Props: IProps) {
	try {
		const { slug } = await Props.params;
		const user = await User.findOrFail(request.headers.get("x-user-id") as string);
		if (user.tokenCount <= 0) throw new CustomError("You don't have enough tokens", 402);
		const recipe = await RecipeModel.generateAlternatives(slug);
		user.payToken();
		return NextResponse.json(recipe, { status: 200 });
	} catch (err) {
		console.log("Error generating alternatives (API):", err);
		if (err instanceof CustomError) return NextResponse.json({ message: err.message }, { status: err.status as number });
		if (err instanceof MongoloquentNotFoundException) return NextResponse.json({ message: "Please login or register if you want to access this feature." }, { status: 401 });
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
