import { addToWishlist, removeFromWishlist } from "@/actions/wishlist";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message"; // lightweight toast library

interface WishlistButtonProps {
  wishlistData?: { data?: { id: string; productId: string }[] };
  productId: string;
  onWishlistChange?: () => void;
}

export default function WishlistButton({
  wishlistData,
  productId,
  onWishlistChange,
}: WishlistButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const isInWishlist =
    wishlistData?.data?.some((item) => item.productId === productId) || false;
  const wishlistItem = wishlistData?.data?.find(
    (item) => item.productId === productId
  );

  const handleToggleWishlist = async () => {
    setIsPending(true);
    try {
      if (isInWishlist && wishlistItem) {
        console.log("removeFromWishlist");
        await removeFromWishlist(wishlistItem.id);
        Toast.show({
          type: "success",
          text1: "Removed from wishlist ❤️‍🔥",
        });
      } else {
        console.log("adding item to wishlist");

        await addToWishlist(productId);
        Toast.show({
          type: "success",
          text1: "Added to wishlist 💖",
        });
      }

      onWishlistChange?.();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to update wishlist",
      });
      console.error("Wishlist error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isInWishlist ? styles.active : styles.inactive,
        isPending && { opacity: 0.6 },
      ]}
      disabled={isPending}
      onPress={handleToggleWishlist}
    >
      {isPending ? (
        <ActivityIndicator size="small" color="#ff3b30" />
      ) : (
        <Ionicons
          name={isInWishlist ? "heart" : "heart-outline"}
          size={24}
          color={isInWishlist ? "#ff3b30" : "#555"}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
  active: {
    backgroundColor: "#ffe6e6",
  },
  inactive: {
    backgroundColor: "#f0f0f0",
  },
});
