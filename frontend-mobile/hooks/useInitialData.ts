// React's Hooks
import { useEffect, useState } from "react";

// Type
import { Article } from "@/types/articles";

// Service API Call
import { getUserArticlesRecommendation, getFavoritesUserCategories } from "@/services/HomeService";
import { extractAxiosErrorMessage } from "@/utils/api";
import { Category } from "@/types/category";

export const useInitialData = () => {
  const [articlesRecommendation, setArticlesRecommendation] = useState<Article[]>([]);
  const [favCategory, setFavCategory] = useState<Category[]>([]);

  // Error
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled([getUserArticlesRecommendation(), getFavoritesUserCategories()]);

      // Save results
      results.forEach((res, i) => {
        if (res.status === "fulfilled") {
          if (i === 0) setArticlesRecommendation(res.value as Article[]);
          if (i === 1) setFavCategory(res.value as Category[]);
        } else {
          setError(extractAxiosErrorMessage(res.reason));
        }
      });
    };

    // Fetch API
    fetchAll();
  }, []);

  return { articlesRecommendation, favCategory, error };
};
