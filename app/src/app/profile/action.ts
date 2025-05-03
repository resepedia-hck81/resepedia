"use server";

import { cookies } from "next/headers";

export async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    return {
      error: true,
      message: error.message || "Failed to fetch profile",
    };
  }
  const data = await response.json();
  return {
    error: false,
    data,
  };
}
