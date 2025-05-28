// utils/api.ts
import axios, { AxiosResponse, HttpStatusCode } from "axios";

// Env
import Constants from "expo-constants";
import { any } from "zod";

// Axios configuration
const apiClient = axios.create({
  baseURL: `${Constants.expoConfig?.extra?.apiUrl}/`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const extractAxiosErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;
    return Array.isArray(message) ? message[0] || "Une erreur est survenue" : message || "Une erreur est survenue";
  }

  return "Une erreur est survenue";
};

export async function safeGet<T>(url: string): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
    return [] as unknown as T;
  } catch (err) {
    throw new Error(extractAxiosErrorMessage(err));
  }
}

export async function safePost<T>(url: string, content: any): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, content);

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
    return [] as unknown as T;
  } catch (err) {
    throw new Error(extractAxiosErrorMessage(err));
  }
}
