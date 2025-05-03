import * as jose from 'jose'
import { ObjectId } from 'mongodb';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  async function findCookies() {
    const cookieStore = await cookies()
    return cookieStore.get("token")
  }
  
  async function authentication(token: RequestCookie) {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET as string)
    const { payload } = await jose.jwtVerify<{ _id: ObjectId, email: string}>(token.value, secret)
    if (!payload._id || !payload.email) return new Response("Unauthorized", { status: 401 })
    const requestHeaders = new Headers(request.headers)
    console.log("User ID:", payload._id);
    requestHeaders.set("x-user-id", payload._id.toString())
    requestHeaders.set("x-user-email", payload.email)
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    return response
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    if (request.nextUrl.pathname.startsWith("/api/recipes")) {
      const token = await findCookies()
      if (!token) return
      return authentication(token)
    }
  }
}