import User from "@/db/models/Users";
import { toPascalCase } from "@/services/helper";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
	try {
		const user = await User.find(request.headers.get("x-user-id") as string);
		const premium = user?.isPremium || false;
		const name = toPascalCase(user?.username || "anonymous");
		return NextResponse.json({ premium, name }, { status: 200 });
	} catch {
		return NextResponse.json({ premium: false, name: "Anonymous" }, { status: 200 });
	}
};
