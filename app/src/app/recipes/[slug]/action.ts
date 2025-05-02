"use server";

export async function getRecipeBySlug(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${slug}`);
  const data = await response.json();
  if (!response.ok) {
    return { error: true, message: data.message };
  }
  return { error: false, data };
}

export async function getAlternativeIngredients(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${slug}/generate-alternatives`);
  const data = await response.json();
  if (!response.ok) {
    return { error: true, message: data.message };
  }
  return { error: false, data };
}
