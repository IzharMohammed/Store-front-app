import { getWishlistItems } from "@/actions/wishlist";
import { WishlistItemCard } from "@/components/wishlist-item-card";
import { WishlistItem } from "@/types/wishlist";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function WishlistScreen() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlistItems();
      if (res?.success && Array.isArray(res.data)) {
        setWishlist(res.data);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load wishlist",
      });
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistChange = useCallback(() => {
    fetchWishlist();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlist();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.subHeader}>
          {wishlist.length} {wishlist.length === 1 ? "product" : "products"} in
          your favorites
        </Text>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <WishlistItemCard
            item={item}
            index={index}
            wishlist={wishlist}
            onWishlistChange={handleWishlistChange}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.emptyContainer}
          >
            <Text style={styles.emptyText}>Your wishlist is empty 💔</Text>
          </Animated.View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
