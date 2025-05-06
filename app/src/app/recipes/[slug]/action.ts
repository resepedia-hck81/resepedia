"use server";

import { cookies } from "next/headers";

export async function getRecipeBySlug(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipes/${slug}`
  );
  const data = await response.json();
  if (!response.ok) {
    return { error: true, message: data.message };
  }
  return { error: false, data };
}

export async function getAlternativeIngredients(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recipes/${slug}/generate-alternatives`,
    {
      headers: {
        Cookie: `token=${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    return { error: true, message: data.message };
  }
  return { error: false, data };
}
