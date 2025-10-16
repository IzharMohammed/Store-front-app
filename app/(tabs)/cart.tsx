import {
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from "@/actions/cart";
import { CartItem } from "@/types/cart";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const navigation = useNavigation();

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await getCartItems();
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, [])
  );

  console.log("cartItems", cartItems);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 30;
  const total = subtotal + shipping;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Your Cart",
      headerRight: () => (
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleIncrease = async (cartId: string, quantity: number) => {
    const newQuantity = quantity + 1;
    await updateCartQuantity({ cartId, newQuantity });
    fetchCartData();
  };

  const handleDecrease = async (cartId: string, quantity: number) => {
    if (quantity <= 1) return;
    const newQuantity = quantity - 1;
    await updateCartQuantity({ cartId, newQuantity });
    fetchCartData();
  };

  const handleDelete = async (cartId: string) => {
    // Alert.alert("Remove Item", "Are ou sure you want to remove this item?", [
    //   { text: "Cancel", style: "cancel" },
    //   {
    //     text: "Remove",
    //     style: "destructive",
    //     onPress: async () => {
    //       await removeFromCart(cartId);
    //       fetchCartData();
    //     },
    //   },
    // ]);
    // Toast.show({
    //   type: "info",
    //   text1: "Remove item?",
    //   text2: "Tap to confirm removing this item",
    //   visibilityTime: 4000,
    //   autoHide: true,
    //   position: "bottom",
    //   onPress: async () => {
    //     await removeFromCart(cartId);
    //     fetchCartData();
    //     Toast.show({
    //       type: "success",
    //       text1: "Item removed",
    //       position: "bottom",
    //     });
    //   },
    // });
    setSelectedId(cartId);
    setVisible(true);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <Animated.View
      entering={FadeInUp.springify().delay(100)}
      exiting={FadeOutDown.springify()}
      style={styles.card}
    >
      <Image source={{ uri: item.product.image[0] }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.product.name}</Text>
        <Text style={styles.price}>${item.product.price}</Text>

        <View style={styles.actionsRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => handleDecrease(item.id, item.quantity)}
              style={styles.qtyButton}
            >
              <Ionicons name="remove" size={18} color="#333" />
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => handleIncrease(item.id, item.quantity)}
              style={styles.qtyButton}
            >
              <Ionicons name="add" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCartData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={styles.list}
        // ListFooterComponentStyle={{ paddingBottom: 0 }}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Remove Item</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to remove this item from your cart?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button
              onPress={async () => {
                if (selectedId) {
                  await removeFromCart(selectedId);
                  fetchCartData();
                  setVisible(false);
                }
              }}
            >
              Remove
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={styles.value}>${shipping.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
  },
  image: { width: 80, height: 100, borderRadius: 6 },
  info: { flex: 1, marginLeft: 10, justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  price: { fontSize: 14, color: "#333" },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  qtyText: { color: "#666", fontSize: 14 },
  summary: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  qtyButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 8,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { color: "#555", fontSize: 15 },
  value: { color: "#000", fontSize: 15 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 18, fontWeight: "bold" },
  checkoutButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
