// Dependencies
import axios, { HttpStatusCode } from "axios";

// Type
import { UserLoginInput } from "@/types/user";

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
      //console.log(err.response.data.message);
    }
  }
}

export default AuthService;
