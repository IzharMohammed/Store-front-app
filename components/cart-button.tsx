import { addToCart } from "@/actions/cart";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

export default function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
}: {
  productId: string;
  quantity?: number;
  disabled?: boolean;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleCartAction = async () => {
    setIsPending(true);
    const retryResult = await addToCart({ productId, quantity });
    console.log("retryResult", retryResult);

    setIsPending(false);
    if (retryResult.success) {
      setIsSuccess(true);
      Alert.alert("Item added to cart!");
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      console.error(retryResult.message);
      Alert.alert("Add to cart failed!");
    }
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
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
