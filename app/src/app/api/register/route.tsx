import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/Users";
import { hash } from "@/services/bcrypt";

export const POST = async (request: NextRequest) => {
	try {
		const { email, username, password } = await request.json();
		if (!email || !username || !password) throw NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		const exists = await User.where("email", email).orWhere("username", username).first();
		if (exists) throw NextResponse.json({ message: "Email or username already exists" }, { status: 409 });

		const hashedPassword = await hash(password);
		await User.create({
			email,
			username,
			password: hashedPassword,
			isPremium: false,
			tokenCount: 7,
		});
		return NextResponse.json({ message: "Register success" }, { status: 201 });
	} catch (err: unknown) {
		console.log("Register error", err);
		if (err instanceof NextResponse) return err;
		return NextResponse.json({ message: err instanceof Error ? err.message : "Register failed" }, { status: 500 });
	}
};
