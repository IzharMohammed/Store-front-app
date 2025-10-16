// components/CartAddedModal.tsx
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

export default function CartAddedModal({
  visible,
  onClose,
  product,
  onCheckout,
}: {
  visible: boolean;
  onClose: () => void;
  onCheckout: () => void;
  product?: { name: string; price: number; image?: string };
}) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={styles.modal}
    >
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Added to cart</Text>

        {product && (
          <View style={styles.item}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.price}>${product.price}</Text>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineButton} onPress={onClose}>
            <Text style={styles.outlineText}>Continue shopping</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filledButton} onPress={onCheckout}>
            <Text style={styles.filledText}>Proceed to checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  price: {
    color: "#666",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 12,
  },
  outlineText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#000",
  },
  filledButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 12,
  },
  filledText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
  },
});
