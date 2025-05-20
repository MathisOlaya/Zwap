// Dependencies
import axios, { HttpStatusCode } from "axios";

// Type
import { UserLoginInput, UserRegisterInput } from "@/types/user";

// Env
import Constants from "expo-constants";

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
    try {
      const response = await apiClient.post("/login", User);

      if (response.status === HttpStatusCode.Ok) {
        // Ok
        return response.data;
      }
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

  static async registerUser(User: UserRegisterInput) {
    try {
      const response = await apiClient.post("/register", User);

      if (response.status === HttpStatusCode.Created) {
        // Ok
        return response.data;
      }
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

  static async isAuthenticated(): Promise<Boolean> {
    try {
      const response = await apiClient.get("me");
      return response.status === HttpStatusCode.Ok && response.data.authenticated === true;
    } catch {
      return false;
    }
  }

}

export default AuthService;
