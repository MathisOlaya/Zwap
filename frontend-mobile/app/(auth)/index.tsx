import { Link } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import Input from "@/components/Input";

// Colors
import colors from "@/constants/Color";

// Responsive
import Button from "@/components/Button";
import { font, gapV, height, width } from "@/utils/responsive";

// Service
import AuthService from "@/services/AuthService";

// Context
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  // Inputs value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login
  const { signIn } = useAuth();

  const login = async () => {
    // User creds
    const user = {
      email,
      password,
    };
    try {
      const response = await AuthService.loginUser(user);

      if (response) {
    } catch (err) {
      if (err instanceof Error) {
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.captionContainer}>
        <Image style={styles.image} source={require("../../assets/images/logo.png")} />
        <Text style={styles.caption}>Zwap it. Love it.</Text>
      </View>
      <View style={styles.action}>
        <View style={styles.inputContainer}>
          <Input label="Email" placeholder="Taper ici" onChangeText={setEmail} />
          <View style={styles.password}>
            <Input label="Mot de passe" placeholder="Taper ici" onChangeText={setPassword} secureTextEntry={true} />
            <Link href="/register" style={styles.passwordLink}>
              Mot de passe oublié ? Réinitialiser ici
            </Link>
          </View>
        </View>
        <View style={styles.loginButtonContainer}>
          <Button text="Se connecter" onClick={login} />
          <Link href="/register" style={styles.loginText}>
            Pas de compte ? En créer un
          </Link>
        </View>
      </View>
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
  captionContainer: {
    display: "flex",
    alignItems: "center",
    paddingVertical: height(80),
    gap: gapV(10),
  },
  image: {
    width: width(195),
    height: height(75),
    objectFit: "contain",
  },
  action: {
    gap: gapV(24),
  },
  caption: {
    fontFamily: "Poppins-LightItalic",
    fontSize: font(16),
    color: colors.grey300,
  },
  inputContainer: {
    gap: gapV(18),
  },
  password: {
    gap: gapV(6),
  },
  passwordLink: {
    fontFamily: "Poppins-Regular",
    color: colors.grey400,
    paddingLeft: width(8),
    fontSize: font(12),
  },
  loginButtonContainer: {
    alignItems: "center",
    gap: gapV(8),
  },
  loginText: {
    color: colors.grey400,
    fontSize: font(12),
  },
});
