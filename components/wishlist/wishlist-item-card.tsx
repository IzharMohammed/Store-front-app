import AddToCartButton from "@/components/cart/cart-button";
import WishlistButton from "@/components/wishlist/wishlist-button";
import { WishlistItem } from "@/types/wishlist";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const WishlistItemCard = ({
  item,
  index,
  onWishlistChange,
  wishlist,
}: {
  item: WishlistItem;
  index: number;
  onWishlistChange: () => void;
  wishlist: WishlistItem[];
}) => {
  const scale = useSharedValue(1);
  const product = item.product;
  if (!product) return null;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.15, { damping: 3 }, () => {
      scale.value = withSpring(1);
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)}
      exiting={FadeOutUp}
      style={[styles.card]}
    >
      <Animated.Image
        source={{ uri: product.image?.[0] }}
        style={[styles.image, animatedStyle]}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
        <View style={{ marginTop: 6 }}>
          <AddToCartButton productId={product.id!} />
        </View>
      </View>

      <Animated.View style={animatedStyle}>
        <WishlistButton
          wishlistData={{ data: wishlist }}
          productId={product.id!}
          onWishlistChange={() => {
            onWishlistChange();
            handlePress();
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  image: {
    width: 70,
    height: 90,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: "#f8f8f8",
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  price: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});
