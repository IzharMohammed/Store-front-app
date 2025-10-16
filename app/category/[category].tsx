import { getProducts } from "@/actions/product";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductsByCategory() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchByCategory = async () => {
      const res = await getProducts({ category });
      if (res.success && res.data) {
        setProducts(res.data);
      }
    };
    fetchByCategory();
  }, [category]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Products</Text>
        <View style={{ width: 24 }} /> {/* spacer */}
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <View style={styles.card}>
              <Image source={{ uri: item.image?.[0] }} style={styles.image} />

              <View
                style={[
                  styles.tag,
                  { backgroundColor: item.discount ? "#000" : "#444" },
                ]}
              >
                <Text style={styles.tagText}>
                  {item.discount ? "Sale" : "New"}
                </Text>
              </View>

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: { fontSize: 20, fontWeight: "700", color: "#000" },
  card: { flex: 1, margin: 6 },
  image: { width: "100%", height: 250 },
  name: { fontWeight: "500", color: "#000", marginTop: 6 },
  price: { fontWeight: "600", color: "#000" },
  tag: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  tagText: { fontSize: 12, fontWeight: "600", color: "#fff" },
});
