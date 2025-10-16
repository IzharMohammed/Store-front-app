import { addToCart } from "@/actions/cart";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import CartAddedModal from "./cart-modal";

export default function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
  product,
}: {
  productId: string;
  quantity?: number;
  disabled?: boolean;
  product?: { name: string; price: number; image?: string };
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCartAction = async () => {
    setIsPending(true);
    const retryResult = await addToCart({ productId, quantity });
    setIsPending(false);

    if (retryResult.success) {
      setIsSuccess(true);
      // Alert.alert("Item added to cart!");
      // Toast.show({
      //   type: "success",
      //   text1: "Added to cart 🛒",
      // });
      setVisible(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      console.error(retryResult.message);
      Alert.alert("Add to cart failed!");
    }
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: "#333" }, // change style when pressed
        ]}
        onPress={handleCartAction}
        disabled={disabled || isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>
            {isSuccess ? "Added!" : "+ Add to Cart"}
          </Text>
        )}
      </Pressable>
      <CartAddedModal
        visible={visible}
        onClose={() => setVisible(false)}
        onCheckout={() => {
          setVisible(false);
        }}
        product={product}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    width: 120,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
  success: {
    backgroundColor: "#4CAF50", // green success state
  },
});
