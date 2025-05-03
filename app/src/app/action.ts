"use server";

export async function getRecipes(search: string, region: string, page: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes?search=${search}&filter=${region}&page=${page}`);
  const data = await response.json();
  if (!response.ok) {
    return { error: true, message: data.message };
  }
  return { error: false, data };
}

export async function getRegions() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/regions`);
  const data = await response.json();
  if (!response.ok) {
    return { error: true, message: data.message };
  }
  return { error: false, data };
}
