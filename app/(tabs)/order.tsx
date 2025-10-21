import { getOrders } from "@/actions/order";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderResponse } from "../../types/order";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        console.log("here", res);
        if (res?.success) setOrders(res.data);
      } catch (err) {
        console.warn("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);
  console.log(orders);

  const renderOrder = ({ item }: { item: OrderResponse }) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <Animated.View entering={FadeInDown.delay(100)} style={styles.orderCard}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/orderDetails/OrderDetailsScreen",
              params: { order: JSON.stringify(item) },
            })
          }
        >
          <View style={styles.rowBetween}>
            <Text style={styles.orderId}>
              #ORD-{item.id.slice(-6).toUpperCase()}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.date}>{date}</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.header}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

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
  safe: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: "700", marginVertical: 20 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { fontWeight: "600", fontSize: 16 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontWeight: "600", fontSize: 12, color: "#000" },
  date: { color: "#666", marginTop: 6 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: { color: "#555" },
  totalValue: { fontWeight: "700", color: "#111" },
});
