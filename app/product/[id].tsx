import { getProductById } from "@/actions/product";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(id as string);
      if (res.success) setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Text>Loading...</Text>;
  console.log("product", product);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image source={{ uri: product.image?.[0] }} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.name}>{product.data.name}</Text>
          <Text style={styles.price}>${product.data.price}</Text>
          <Text style={styles.description}>{product.data.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomPrice}>${product.price}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  image: { width: "100%", height: 480, resizeMode: "cover" },
  details: { padding: 16 },
  name: { fontSize: 22, fontWeight: "700", color: "#000" },
  price: { fontSize: 18, fontWeight: "600", color: "#000", marginTop: 6 },
  description: { marginTop: 10, fontSize: 14, color: "#555" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  bottomPrice: { fontSize: 18, fontWeight: "700" },
  addButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  addButtonText: { color: "#fff", fontWeight: "600" },
});
