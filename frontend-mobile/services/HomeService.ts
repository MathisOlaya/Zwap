// Axios
import axios, { HttpStatusCode } from "axios";

// Env
import Constants from "expo-constants";

// Types
import { Article } from "@/types/articles";

// Axios configuration
const apiClient = axios.create({
  baseURL: `${Constants.expoConfig?.extra?.apiUrl}/articles`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Get articles recommendation for user
async function getUserArticlesRecommendation(): Promise<Article[]> {
  try {
    // Fetching API
    const response = await apiClient.get("/foryou");

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
    return [];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // Axios error from backend
      const message = Array.isArray(err.response?.data.message)
        ? err.response?.data.message[0] || "Une erreur est survenue"
        : err.response?.data.message || "Une erreur est survenue";

      throw new Error(message);
    }
    throw new Error("Une erreur est survenue");
  }
}

export default getUserArticlesRecommendation;
