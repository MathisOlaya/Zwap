import AuthService from "@/services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define type
type AuthContextType = {
  isAuthenticated: Boolean;
  signIn: (id: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setUserAuthenticated] = useState<Boolean>(false);

  // At start
  useEffect(() => {
    const verifyAuthentication = async () => {
      const isAuth = await AuthService.isAuthenticated();
      setUserAuthenticated(isAuth);
    };
    verifyAuthentication();
  }, []);

  const signIn = async (id: string) => {
    // Set user as authenticated
    try {
      await AsyncStorage.setItem("userId", id);
      setUserAuthenticated(true);
    } catch (err) {
      console.error("Failed to store userId:", err);
      setUserAuthenticated(false);
    }
  };

  const signOut = async () => {
    if (await AuthService.logout()) {
      // Set user as logged out
      setUserAuthenticated(false);

      // Remove from local storage
      await AsyncStorage.removeItem("userId");
    }
  };

  // Return provider
  return <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
