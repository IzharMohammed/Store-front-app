import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { authService } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be atleast 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    //clear previous errors
    setErrors({});

    //validate Form
    if (!validateForm) {
      return;
    }

    setLoading(true);

    try {
      const result = await authService.signup({
        name: name.trim(),
        email,
        password,
      });

      if (result.success) {
        Alert.alert("Success!", "Your account has been created successfully", [
          {
            text: "Continue",
            onPress: () => router.replace("/(auth)/signin"),
          },
        ]);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occured while signup";

      Alert.alert("Sign Up Failed", message);
    } finally {
      setLoading(false);
    }
  };
  const navigateToSignIn = () => {
    router.replace("/signin");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start shopping</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            error={errors.name}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Create a password (min. 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password-new"
            error={errors.password}
          />

          <View style={styles.passwordHint}>
            <Text style={styles.passwordHintText}>
              Password must be at least 6 characters long
            </Text>
          </View>

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            variant="primary"
          />

          <View style={styles.signInPrompt}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    flex: 1,
  },
  passwordHint: {
    marginBottom: 24,
  },
  passwordHintText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  signInPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signInText: {
    fontSize: 14,
    color: "#666",
  },
  signInLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});
