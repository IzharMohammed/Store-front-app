import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProductsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Products Screen</Text>
      <Text style={styles.subtext}>Build your product catalog here</Text>
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
