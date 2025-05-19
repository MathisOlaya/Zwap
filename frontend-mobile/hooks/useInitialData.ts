// React's Hooks
import { useEffect, useState } from "react";

// Type
import { Article } from "@/types/articles";

// Service API Call
import getUserArticlesRecommendation from "@/services/HomeService";

export const useInitialData = () => {
  const [articlesRecommendation, setArticlesRecommendation] = useState<Article[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [articlesRec] = await Promise.all([getUserArticlesRecommendation()]);

        // Save results
        setArticlesRecommendation(articlesRec);
      } catch (err) {
        // Displaying message here
      }
    };

    // Fetch API
    fetchAll();
  }, []);

  return articlesRecommendation;
};
