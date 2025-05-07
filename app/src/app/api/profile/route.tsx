import User from "@/db/models/Users";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
	try {
		const user = await User.findOrFail(request.headers.get("x-user-id") as string);
		return NextResponse.json(user, { status: 200 });
	} catch (error: unknown) {
		// console.error("Error fetching user profile:", error);
		return NextResponse.json(error, { status: 500 });
	}
};
