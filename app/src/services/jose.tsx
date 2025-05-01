import { JWTPayload, jwtVerify, SignJWT } from "jose";

export async function sign(payload: JWTPayload, isRemember?: boolean): Promise<string> {
	const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime(isRemember ? "7d" : "1h").sign(new TextEncoder().encode(process.env.JWT_SECRET));
	return token;
}

export async function verify(token: string): Promise<{ _id: string; email: string } | null> {
	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
		return payload as { _id: string; email: string };
	} catch (error) {
		console.error("Verification error:", error);
		return null;
	}
}
