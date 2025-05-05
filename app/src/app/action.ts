"use server";

import { cookies } from "next/headers";

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

export async function checkToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return !!token;
}