// Env
import Constants from "expo-constants";

// Types
import { Article } from "@/types/articles";
import { Category } from "@/types/category";
import { safeGet } from "@/utils/api";

// Get articles recommendation for user
export async function getUserArticlesRecommendation(): Promise<Article[]> {
  return await safeGet<Article[]>("articles/foryou");
}

// Get favorites user categories
export async function getFavoritesUserCategories(): Promise<Category[]> {
  return await safeGet<Category[]>("category/foryou");
}
