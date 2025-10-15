import { storage } from "@/utils/storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();
  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isAuthenticated === null) return; // still loading

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and trying to access protected route
      router.replace("/signin");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, segments]);

  const checkAuthStatus = async () => {
    const authenticated = await storage.isAuthenticated();
    setIsAuthenticated(authenticated);
  };

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ title: "Auth" }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
