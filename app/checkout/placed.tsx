import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlacedScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.View entering={FadeInDown} style={styles.container}>
        <Text style={styles.title}>Order placed</Text>
        <Text style={{ color: "#666", marginTop: 8 }}>
          Your order has been placed successfully
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/order")}
          style={styles.primaryBtn}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>View Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home")}
          style={[styles.secondaryBtn]}
        >
          <Text style={{ color: "#000", fontWeight: "600" }}>
            Continue shopping
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center", marginTop: 80 },
  title: { fontSize: 22, fontWeight: "700" },
  primaryBtn: {
    marginTop: 30,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  secondaryBtn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
});
