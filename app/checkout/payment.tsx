import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useCheckout } from "@/contexts/CheckoutContext";

const MOCK_METHODS = [
  { id: "visa-4242", label: "Visa ending in 4242", type: "card" },
  { id: "master-5678", label: "Mastercard ending in 5678", type: "card" },
  { id: "applepay", label: "Apple Pay", type: "applepay" },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod } = useCheckout();
  const [selected, setSelected] = useState(paymentMethod?.id ?? MOCK_METHODS[0].id);

  const handleNext = () => {
    const pm = MOCK_METHODS.find((m) => m.id === selected) ?? MOCK_METHODS[0];
    setPaymentMethod(pm as any);
    router.push("/checkout/review");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.View entering={FadeInDown} style={styles.header}>
        <Text style={styles.title}>Payment Method</Text>
      </Animated.View>

      <View style={{ padding: 16 }}>
        {MOCK_METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, selected === m.id && styles.methodSelected]}
            onPress={() => setSelected(m.id)}
          >
            <Text style={{ fontWeight: "600" }}>{m.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={handleNext} style={styles.primaryBtn}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Next — Review Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 20, fontWeight: "700" },
  methodCard: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#eee", marginBottom: 12 },
  methodSelected: { borderColor: "#000", backgroundColor: "#fff9f3" },
  primaryBtn: { marginTop: 20, backgroundColor: "#000", padding: 14, borderRadius: 8, alignItems: "center" },
});
