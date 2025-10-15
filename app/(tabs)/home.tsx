import { getBanners } from "@/actions/banner";
import { BannerItem } from "@/types/banner";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProductsScreen() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await getBanners();
        if (response.data?.success && response.data.data) {
          setBanners(response.data.data);
        } else {
          console.error("Failed to load Banners!");
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
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

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={renderBanner}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  // banner: {
  //   width: width - 32,
  //   height: height * 0.3,
  //   marginHorizontal: 16,
  //   marginBottom: 20,
  //   justifyContent: "flex-end",
  //   overflow: "hidden",
  // },
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
