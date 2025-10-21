import { RouteGuard } from "@/contexts/route-guard";
import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";

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
