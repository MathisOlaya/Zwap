import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define type
type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (id: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  // At start
  useEffect(() => {
    const loadToken = async () => {
      const userId = await AsyncStorage.getItem("userId");

      // Is he logged ?
      if (userId && !isAuthenticated) {
        setUserAuthenticated(true);
      }
    };
    loadToken();
  }, []);

  const signIn = async (id: string) => {
    // Set user as authenticated
    setUserAuthenticated(true);

    // Store it localy
    await AsyncStorage.setItem("userId", id);
  };

  const signOut = async () => {
    // Set user as logged out
    setUserAuthenticated(false);

    // Remove from local storage
    await AsyncStorage.removeItem("userId");
  };

  // Return provider
  return <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
