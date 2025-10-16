import { getProductById, getProducts } from "@/actions/product";
import { getWishlistItems } from "@/actions/wishlist";
import AddToCartButton from "@/components/cart/cart-button";
import { ProductImageCarousel } from "@/components/image-carousel";
import WishlistButton from "@/components/wishlist/wishlist-button";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlistData, setWishlistData] = useState<{
    data?: { id: string; productId: string }[];
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await getProductById(String(id));
      if (res.success && res.data) {
        setProduct(res.data);

        const category = res.data.category;
        const relatedRes = await getProducts({ category });
        if (relatedRes.success && relatedRes.data) {
          setRelatedProducts(
            relatedRes.data.filter((p: Product) => p.id !== res.data?.id)
          );
        }
      }

      setWishlistData(await getWishlistItems());
    };

    fetchData();
  }, [id]);

  if (!product) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        {/* <Ionicons name="heart-outline" size={22} color="#000" /> */}
        <WishlistButton
          wishlistData={wishlistData}
          productId={product.id}
          onWishlistChange={async () => {
            setWishlistData(await getWishlistItems());
          }}
        />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Image Carousel */}
        {product && product.image && (
          <ProductImageCarousel images={product.image!} />
        )}

        {/* Product Info */}
        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Related Products */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionHeader}>You might also like</Text>
          <FlatList
            data={relatedProducts}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.relatedCard}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Image
                  source={{ uri: item.image![0] }}
                  style={styles.relatedImage}
                />
                <Text style={styles.relatedName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.relatedPrice}>${item.price}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${product.price}</Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          {/* <Text onPress={()=>handleAddToCart()} style={styles.cartText}>
            + Add to cart
          </Text> */}
          <AddToCartButton productId={product.id} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 4,
  },
  image: {
    width: width,
    height: 420,
  },
  details: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 6,
  },
  description: {
    color: "#555",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  sizeContainer: {
    flexDirection: "row",
    marginTop: 14,
    gap: 8,
  },
  sizeBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sizeText: {
    color: "#000",
    fontWeight: "500",
  },
  reviewsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  reviewCard: {
    marginBottom: 14,
  },
  reviewerName: {
    fontWeight: "600",
    color: "#000",
  },
  reviewDate: {
    fontSize: 12,
    color: "#777",
  },
  reviewText: {
    color: "#444",
    marginTop: 4,
    lineHeight: 18,
  },
  relatedSection: {
    marginTop: 25,
    paddingLeft: 16,
    paddingBottom: 30,
  },
  relatedCard: {
    width: 140,
    marginRight: 12,
  },
  relatedImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  relatedName: {
    marginTop: 6,
    fontWeight: "500",
    color: "#000",
  },
  relatedPrice: {
    color: "#000",
    fontWeight: "600",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: "relative",
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  cartButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cartText: {
    color: "#fff",
    fontWeight: "600",
  },
});
