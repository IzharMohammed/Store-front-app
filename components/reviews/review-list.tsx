import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getProductFeedback } from "@/actions/feedback";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ReviewList({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const router = useRouter();

  const fetchReviews = useCallback(async () => {
    const res = await getProductFeedback({ productId });
    if (res?.success) {
      setReviews(res.data || []);
      setCount(res.total || 0);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderItem = ({ item }: any) => (
    <View style={styles.reviewCard}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.customer?.name}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.rating}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < item.rating ? "star" : "star-outline"}
            color="#f5a623"
            size={16}
          />
        ))}
      </View>

      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews ({count})</Text>

      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => router.push(`/review/${productId}`)}
      >
        <Ionicons name="pencil-outline" size={16} color="#000" />
        <Text style={styles.writeText}>Write a review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginTop: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#000" },
  reviewCard: { marginBottom: 14, borderBottomWidth: 0.5, borderColor: "#eee", paddingBottom: 10 },
  header: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontWeight: "600", color: "#000" },
  date: { fontSize: 12, color: "#777" },
  rating: { flexDirection: "row", marginTop: 4 },
  comment: { color: "#333", marginTop: 6, lineHeight: 18 },
  writeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    marginTop: 12,
  },
  writeText: { marginLeft: 6, color: "#000", fontWeight: "500" },
});
