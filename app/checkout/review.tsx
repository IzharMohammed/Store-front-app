import { getCartItems } from "@/actions/cart";
import { createOrder } from "@/actions/order";
import { useCheckout } from "@/contexts/CheckoutContext";
import { CartItem } from "@/types/cart";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import Toast from "react-native-toast-message";

export default function ReviewOrder() {
  const router = useRouter();
  const { shippingAddress, paymentMethod, items, customerPhone } =
    useCheckout();
  const [products, setProducts] = useState<CartItem[]>([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const totalItems = products.length;
  const totalQuantity = products.reduce((sum, p) => {
    const quantity =
      items.find((item) => item.productId === p.id)?.quantity || 1;
    return sum + quantity;
  }, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getCartItems();
        if (res?.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, [items]);
  console.log(products);

  const subtotal = products
    ? products.reduce((sum, p) => {
        const quantity =
          items.find((item) => item.productId === p.id)?.quantity || 1;
        return sum + p.product.price * quantity;
      }, 0)
    : 0;

  const shipping = 9.99;
  const tax = 0;
  const total = subtotal + shipping + tax;

  //   const total = subtotal + shipping + tax;
  const placeOrder = async () => {
    try {
      const items = products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const subtotal = products.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const tax = subtotal * 0.1;
      const shipping = subtotal > 100 ? 0 : 9.99;
      const total = subtotal + tax + shipping;

      const orderData = {
        shippingAddress,
        customerPhone: customerPhone || undefined,
        items,
        total,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        setOrderSuccess(true);
        Toast.show({
          type: "success",
          text1: "Order placed successfully!",
          text2: "Thank you for your purchase.",
        });

        setTimeout(() => {
          router.push("/order");
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Order placement failed.",
          text2: result.message,
        });
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      Toast.show({
        type: "error",
        text1: "Failed to create order.",
        text2: "Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔹 Header with Back and Complete buttons (animated) */}
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        style={styles.topHeader}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text onPress={() => router.back()} style={styles.backButtonText}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => placeOrder()}
          style={styles.completeButton}
        >
          <Text style={styles.completeButtonText}>Complete</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "100%" }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* 🔹 Review Order Header (animated) */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={styles.reviewHeader}
        >
          <View>
            <Text style={styles.reviewTitle}>Review order</Text>
            <Text style={styles.reviewSubtitle}>
              Please check your order details
            </Text>
          </View>
          <Text style={styles.reviewEmoji}>📝✏️</Text>
        </Animated.View>

        {/* 🔹 Products Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400).springify()}
          style={styles.section}
        >
          <Text style={styles.productSummaryText}>
            {totalItems} {totalItems === 1 ? "item" : "items"} — Total Quantity:{" "}
            {totalQuantity}
          </Text>
          <Text style={styles.sectionTitle}>Products</Text>
          {products &&
            products.map((product, i) => {
              const quantity =
                items.find((item) => item.productId === product.id)?.quantity ||
                1;
              return (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.delay(200 + i * 100).springify()}
                  style={styles.productCard}
                >
                  <Image
                    source={{
                      uri:
                        product.product.image?.[0] ||
                        "https://via.placeholder.com/60",
                    }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {product.product.name}
                    </Text>
                    {product.product.description && (
                      <Text style={styles.productDesc} numberOfLines={1}>
                        {product.product.description}
                      </Text>
                    )}
                    <Text style={styles.productPrice}>
                      ${product.product.price.toFixed(2)}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
        </Animated.View>
        <Text style={styles.sectionTitle}>Products</Text>

        {/* 🔹 Shipping Address Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          {shippingAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressName}>John Doe</Text>
              <Text style={styles.addressText}>{shippingAddress.street}</Text>
              <Text style={styles.addressText}>
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.zipCode}
              </Text>
              <Text style={styles.addressText}>{shippingAddress.country}</Text>
              <Text style={styles.addressText}>Phone: {customerPhone}</Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>No shipping address selected</Text>
          )}
        </Animated.View>

        {/* 🔹 Payment Method Section */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethod ? (
            <View style={styles.paymentCard}>
              <View style={styles.cardIcon}>
                <Text>💳</Text>
              </View>
              <View>
                <Text style={styles.paymentLabel}>{paymentMethod.label}</Text>
                <Text style={styles.paymentType}>
                  {paymentMethod.type === "card"
                    ? "Credit Card"
                    : paymentMethod.type}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No payment method selected</Text>
          )}
        </Animated.View>

        {/* 🔹 Order Summary Section */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400).springify()}
          style={[styles.section, { marginBottom: 40 }]}
        >
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>

          <View
            style={[
              styles.summaryRow,
              {
                marginTop: 8,
                borderTopWidth: 1,
                borderColor: "#eee",
                paddingTop: 8,
              },
            ]}
          >
            <Text style={[styles.summaryLabel, { fontWeight: "700" }]}>
              Total
            </Text>
            <Text
              style={[styles.summaryValue, { fontWeight: "700", fontSize: 18 }]}
            >
              ${total.toFixed(2)}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: "#000",
  },
  completeButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: 8,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  reviewSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  reviewEmoji: {
    fontSize: 32,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  productCard: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  productImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  productDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 4,
  },
  addressCard: {
    backgroundColor: "#fff",
    padding: 0,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  paymentType: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },
  summaryValue: {
    fontSize: 14,
    color: "#000",
  },
  productSummaryText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
});
