import { StyleSheet, Text, View } from "react-native";

export default function OrderPage() {
  return (
    <View style={styles.container}>
      <Text>Order Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
