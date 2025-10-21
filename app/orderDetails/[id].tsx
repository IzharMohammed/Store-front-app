import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderResponse } from "../../types/order";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { order } = useLocalSearchParams();
  const parsedOrder: OrderResponse = JSON.parse(order as string);

  const subtotal = parsedOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const discount = 30;
  const tax = 20.02;
  const total = subtotal + shipping - discount + tax;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderId}>
              #ORD-{parsedOrder.id.slice(-6).toUpperCase()}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(parsedOrder.status) },
              ]}
            >
              <Text style={styles.statusText}>{parsedOrder.status}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            {new Date(parsedOrder.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </Animated.View>

        {/* Items */}
        <View style={{ paddingHorizontal: 16 }}>
          {parsedOrder.items.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(150 * index)}
              style={styles.itemCard}
            >
              <Image source={{ uri: item.productImage }} style={styles.image} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.qty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <SummaryRow label="Shipping" value={`$${shipping.toFixed(2)}`} />
          <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} />
          <SummaryRow label="Tax" value={`$${tax.toFixed(2)}`} />
          <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
        </View>

        {/* Shipping Address */}
        <View style={styles.addressContainer}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>{parsedOrder.customerName}</Text>
          <Text style={styles.addressText}>
            {parsedOrder.shippingAddress?.street},{" "}
            {parsedOrder.shippingAddress?.city}
          </Text>
          <Text style={styles.addressText}>
            {parsedOrder.shippingAddress?.state},{" "}
            {parsedOrder.shippingAddress?.zipCode}
          </Text>
          <Text style={styles.addressText}>
            {parsedOrder.shippingAddress?.country}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { borderColor: "#ef4444" }]}>
            <Text style={[styles.btnText, { color: "#ef4444" }]}>
              Cancel Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { borderColor: "#000" }]}>
            <Text style={[styles.btnText, { color: "#000" }]}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewBtn}>
            <Text style={[styles.btnText, { color: "#fff" }]}>Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SummaryRow = ({ label, value, bold = false }: any) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && { fontWeight: "700" }]}>
      {label}
    </Text>
    <Text style={[styles.summaryValue, bold && { fontWeight: "700" }]}>
      {value}
    </Text>
  </View>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "#FCD34D";
    case "PROCESSING":
      return "#60A5FA";
    case "SHIPPED":
      return "#34D399";
    case "DELIVERED":
      return "#22C55E";
    case "CANCELLED":
      return "#EF4444";
    default:
      return "#E5E7EB";
  }
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { fontWeight: "700", fontSize: 18 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontWeight: "600", fontSize: 12 },
  date: { color: "#666", marginTop: 6 },
  itemCard: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  image: { width: 60, height: 60, borderRadius: 8 },
  productName: { fontWeight: "600", fontSize: 15 },
  qty: { color: "#777", marginTop: 4 },
  price: { fontWeight: "600", fontSize: 15 },
  summaryContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 10,
  },
  sectionTitle: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryLabel: { color: "#555" },
  summaryValue: { color: "#111" },
  addressContainer: { paddingHorizontal: 16, paddingVertical: 10 },
  addressText: { color: "#555", marginVertical: 2 },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  btn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnText: { fontWeight: "600" },
  reviewBtn: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
  },
});
