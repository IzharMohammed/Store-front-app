import { storage } from "@/utils/storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";

function RouteGuard({ children }: { children: React.ReactNode }) {
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
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ title: "Auth" }} />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </RouteGuard>
    </PaperProvider>
  );
}
