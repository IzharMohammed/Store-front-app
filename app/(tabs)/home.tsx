import { getBanners } from "@/actions/banner";
import { getOrders } from "@/actions/order";
import { getProducts } from "@/actions/product";
import { BannerItem } from "@/types/banner";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 40) / 2;

export default function ProductsScreen() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bannerRes, productRes] = await Promise.all([
          getBanners(),
          getProducts({ limit: 8 }),
        ]);
        const orders = await getOrders();
        console.log("orders", orders);

        if (bannerRes.data?.success && bannerRes.data.data) {
          setBanners(bannerRes.data.data);
        } else {
          console.error("Failed to load banners!");
        }

        if (productRes.success && productRes.data) {
          setProducts(productRes.data);
        } else {
          console.error("Failed to load products!");
        }

        if (productRes.filters?.categories) {
          setCategories(productRes.filters.categories);
        } else {
          console.error("Failed to load categories!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const renderBanner = ({ item }: { item: BannerItem }) => (
    <TouchableOpacity activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.banner}
        imageStyle={{ borderRadius: 16 }}
      >
        {item.title ? (
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>New collection just arrived</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View all</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/product/[id]",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image![0] }} style={styles.productImage} />
        {item.discount ? (
          <View style={[styles.tag, { backgroundColor: "#000" }]}>
            <Text style={styles.tagText}>Sale</Text>
          </View>
        ) : (
          <View style={[styles.tag, { backgroundColor: "#000" }]}>
            <Text style={styles.tagText}>New</Text>
          </View>
        )}
      </View>
      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* --- Banner Section --- */}
      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={renderBanner}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* --- Category Tags --- */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryTag}
            onPress={() =>
              router.push({
                pathname: "/category/[category]",
                params: { category: item.name },
              })
            }
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {/* --- Product Section --- */}
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      />
    </ScrollView>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  banner: {
    width: "100%",
    height: 310,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  textContainer: {
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#eee",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  imageWrapper: {
    // position: "relative",
    width: "100%",
    height: ITEM_WIDTH * 1.3,
    backgroundColor: "#f5f5f5",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tag: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryTag: {
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  categoryText: {
    color: "#000",
    fontWeight: "500",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
