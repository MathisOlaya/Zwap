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

