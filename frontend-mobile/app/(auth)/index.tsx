import { useState } from "react";
import { Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import Input from "@/components/Input";
import Toast from "react-native-toast-message";
import Caption from "@/components/Secondary/Caption";
import Link from "@/components/Link";

// Colors
import colors from "@/constants/Color";

// Responsive
import Button from "@/components/Button";
import { font, gapV, height, width } from "@/utils/responsive";

// Service
import AuthService from "@/services/AuthService";

// Context
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function LoginScreen() {
  // Inputs value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Button
  const [disabled, setDisabled] = useState(false);

  // Handle login
  const { signIn } = useAuth();

  const login = async () => {
    if (!email || !password) {
      return Toast.show({
        type: "error",
        text1: "Oupsss...",
        text2: "Merci de remplir tous les champs",
      });
    }
    // User creds
    const user = {
      email,
      password,
    };
    try {
      // Disable button request
      setDisabled(true);

      // Show loader
      setIsLoading(true);

      const response = await AuthService.loginUser(user);

      if (response) {
        // Log in
        signIn(response.user.id);
      }
    } catch (err) {
      if (err instanceof Error) {
        Toast.show({
          type: "error",
          text1: "Oupsss...",
          text2: err.message,
        });
      }
    } finally {
      // Enable button
      setDisabled(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <Caption />
      <View style={styles.action}>
        <View style={styles.inputContainer}>
          <Input label="Email" placeholder="joe@example.com" onChangeText={setEmail} />
          <View style={styles.password}>
            <Input label="Mot de passe" placeholder="**************" onChangeText={setPassword} secureTextEntry={true} />
            <Link href="/register" style={{ paddingLeft: width(8) }}>
              Mot de passe oublié ? Réinitialiser ici
            </Link>
          </View>
        </View>
        <View style={styles.loginButtonContainer}>
          <Button text="Se connecter" onClick={login} disabled={disabled} />
          <Link href="/register">Pas de compte ? En créer un</Link>
        </View>
      </View>
      <Loader enabled={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue950,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  action: {
    gap: gapV(24),
  },
  inputContainer: {
    gap: gapV(18),
  },
  password: {
    gap: gapV(6),
  },
  loginButtonContainer: {
    alignItems: "center",
    gap: gapV(8),
  },
});
