import { createFeedback } from "@/actions/feedback";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ReviewForm() {
  const { productId } = useLocalSearchParams();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!comment) {
      Toast.show({ type: "error", text1: "Please write a comment" });
      return;
    }

    const res = await createFeedback({
      productId: String(productId),
      comment,
      rating,
    });

    if (res.success) {
      Toast.show({ type: "success", text1: "Review submitted!" });
      router.back();
    } else {
      Toast.show({ type: "error", text1: res.message });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={22} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Write a Review</Text>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons
              name={i <= rating ? "star" : "star-outline"}
              size={28}
              color="#f5a623"
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Write your review"
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  back: { marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "700", color: "#000", marginBottom: 16 },
  stars: { flexDirection: "row", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
