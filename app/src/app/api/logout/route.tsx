import { NextResponse } from "next/server";

export async function POST() {
	const res = NextResponse.json({ ok: true, message: "Logged out" }, { status: 200 });
	res.cookies.set("token", "", {
		httpOnly: true,
		path: "/",
		maxAge: 0,
	});
	return res;
}
