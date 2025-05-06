import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

// Components
import Caption from "@/components/Secondary/Caption";
import Toast from "react-native-toast-message";
import Input from "@/components/Input";
import Button from "@/components/Button";

// Colors
import colors from "@/constants/Color";

// Responsive
import { width, height, gapH, gapV, font } from "@/utils/responsive";

// Auth
import { useAuth } from "@/context/AuthContext";

// Validation
import { registerSchema } from "@/validation/userSchema";
import AuthService from "@/services/AuthService";

export default function RegisterScreen() {
  const [firstname, setFirstname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  // Register
  const register = async () => {
    // User infos
    const user = {
      firstname,
      phoneNumber,
      email,
      password,
    };

    try {
      // Are inputs valid
      const validation = registerSchema.safeParse(user);

      if (!validation.success) {
        return Toast.show({
          type: "error",
          text1: "Oupsss...",
          text2: validation.error.errors[0].message,
        });
      }

      const response = await AuthService.registerUser(user);

      if (response) {
        // Log user
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <Caption paddingVertical={height(65)} />
      <View style={styles.action}>
        <View style={styles.inputContainer}>
          <Input label="Prénom" placeholder="joe" onChangeText={setFirstname} />
          <Input label="Numéro de téléphone" placeholder="+4179 123 45 67" type="phone-pad" onChangeText={setPhoneNumber} />
          <Input label="Email" placeholder="joe@example.com" type="email-address" onChangeText={setEmail} />
          <View style={styles.password}>
            <Input label="Mot de passe" placeholder="**************" onChangeText={setPassword} secureTextEntry={true} />
          </View>
        </View>
        <View style={styles.loginButtonContainer}>
          <Button text="Créer un compte" onClick={register} />
          <Link href="/" style={styles.loginText}>
            Déjà un compte ? Se connecter
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
    fontFamily: "Poppins-Regular",
    color: colors.grey400,
    fontSize: font(12),
  },
});
