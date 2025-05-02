"use server";

export async function getRecipes() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  const data = await response.json();
  if (!response.ok) {
    return { error: true, message: data.message };
  }
  return { error: false, data };
}
