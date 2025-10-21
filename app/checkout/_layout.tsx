import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { Stack } from "expo-router";

export default function CheckoutLayout() {
  return (
    <CheckoutProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CheckoutProvider>
  );
}
