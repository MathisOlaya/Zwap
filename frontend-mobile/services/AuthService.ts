// Dependencies
import axios, { HttpStatusCode } from "axios";

// Type
import { UserLoginInput, UserRegisterInput } from "@/types/user";

// Env
import Constants from "expo-constants";

import { extractAxiosErrorMessage, safePost } from "@/utils/api";

const apiClient = axios.create({
  baseURL: `${Constants.expoConfig?.extra?.apiUrl}/auth`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class AuthService {
  static async loginUser(User: UserLoginInput) {
    return await safePost("/auth/login", User);
  }

  static async registerUser(User: UserRegisterInput) {
    return await safePost("/auth/register", User);
  }

  static async isAuthenticated(): Promise<Boolean> {
    try {
      const response = await apiClient.get("me");
      return response.status === HttpStatusCode.Ok && response.data.authenticated === true;
    } catch {
      return false;
    }
  }

  static async logout(): Promise<Boolean> {
    try {
      const response = await apiClient.get("logout");
      return response.status === HttpStatusCode.Ok;
    } catch (err) {
      throw new Error(extractAxiosErrorMessage(err));
    }
  }
}

export default AuthService;
