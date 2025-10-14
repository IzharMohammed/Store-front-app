import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Shopping Cart</Text>
      <Text style={styles.subtext}>Build your cart functionality here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
});
