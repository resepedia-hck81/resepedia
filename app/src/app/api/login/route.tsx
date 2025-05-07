import User from "@/db/models/Users";
import { sign } from "@/services/jose";
import { compare } from "@/services/bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { MongoloquentNotFoundException } from "mongoloquent";

export async function POST(request: NextRequest) {
	try {
		const { username, password } = await request.json();
		const user = await User.where("email", username).orWhere("username", username).firstOrFail();
		if (!(await compare(password, user.password))) return NextResponse.json({ message: "Invalid username or password" }, { status: 400 });
		const token = await sign({ _id: user._id.toString(), email: user.email }, true);
		const resp = NextResponse.json({ message: "Success" }, { status: 200 });
		resp.cookies.set("token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
		return resp;
	} catch (err) {
		// console.log(err);
		if (err instanceof MongoloquentNotFoundException) return NextResponse.json({ message: "User does not exist" }, { status: 400 });
		return NextResponse.json({ message: "ISE" }, { status: 500 });
	}
}
