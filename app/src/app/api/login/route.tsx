import User from "@/db/models/Users";
import { sign } from "@/services/jose";
import { compare } from "@/services/bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { username, email, password } = await request.json();
		const user = await User.where("email", email).orWhere("username", username).firstOrFail();
		if (!(await compare(password, user.password))) return new NextResponse("Invalid username or password", { status: 401 });
		const token = await sign({ _id: user._id, email: user.email }, true);
		return new NextResponse(JSON.stringify({ token }), { status: 200 }).cookies.set("token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
	} catch (err) {
		console.log(err);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
