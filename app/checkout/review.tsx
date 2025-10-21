import { createOrder } from "@/actions/order";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ReviewScreen() {
  const router = useRouter();
  const { shippingAddress, paymentMethod, items, clearCheckout } =
    useCheckout();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.quantity, 0),
    [items]
  );
  const tax = +(subtotal * 0.1).toFixed(2);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = +(subtotal + tax + shipping).toFixed(2);

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      Toast.show({ type: "error", text1: "Please select shipping address" });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      shippingAddress,
      items,
      total,
      customerPhone: undefined,
    };

    const res = await createOrder(payload);
    setIsSubmitting(false);

    if (res.success) {
      clearCheckout();
      router.replace("/checkout/placed"); // move to placed screen
    } else {
      Toast.show({
        type: "error",
        text1: res.message || "Failed to place order",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.View entering={FadeInDown} style={styles.header}>
        <Text style={styles.title}>Review order</Text>
      </Animated.View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.productId}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {/* If you have product image in item, show it; here we don't, so placeholder */}
            <View style={styles.thumbnail} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>{item.productId}</Text>
              <Text style={{ color: "#666" }}>Qty: {item.quantity}</Text>
            </View>
            <Text style={{ fontWeight: "700" }}>${item.price}</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={{ padding: 16 }}>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Shipping</Text>
              <Text>${shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Tax</Text>
              <Text>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: 10 }]}>
              <Text style={{ fontWeight: "700" }}>Total</Text>
              <Text style={{ fontWeight: "700" }}>${total.toFixed(2)}</Text>
            </View>

            <View
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text style={{ fontWeight: "700" }}>Shipping Address</Text>
              <Text style={{ color: "#555", marginTop: 6 }}>
                {(shippingAddress as any)?.street}
              </Text>
              <Text style={{ color: "#555" }}>
                {(shippingAddress as any)?.city},{" "}
                {(shippingAddress as any)?.state}{" "}
                {(shippingAddress as any)?.zipCode}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handlePlaceOrder}
              style={[styles.primaryBtn, { opacity: isSubmitting ? 0.6 : 1 }]}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {isSubmitting ? "Placing order..." : "Place Order"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 20, fontWeight: "700" },
  itemRow: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#f3f3f3",
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  primaryBtn: {
    marginTop: 18,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});
