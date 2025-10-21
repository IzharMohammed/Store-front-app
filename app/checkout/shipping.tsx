import { getOrders } from "@/actions/order";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Shipping() {
  const router = useRouter();
  const { shippingAddress, setShippingAddress, setItems } = useCheckout();
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOrders();
        if (res?.success) {
          // extract unique shipping addresses from past orders (most recent first)
          const addresses = res.data
            .map((o) => o.shippingAddress)
            .filter(Boolean)
            .reverse();
          setSavedAddresses(addresses);
        }
      } catch (err) {
        console.warn("Failed to fetch orders", err);
      }
    };

    fetch();
  }, []);

  const handleUseAddress = (addr: any) => {
    setShippingAddress(addr);
    router.push("/checkout/payment");
  };

  const handleSubmitNew = () => {
    // simple validation
    if (!form.street || !form.city) return;
    const addr = { ...form };
    setShippingAddress(addr);
    router.push("/checkout/payment");
  };

  const anim = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(anim.value) }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View entering={FadeInDown} style={[styles.header, style]}>
        <Text style={styles.title}>Shipping Address</Text>
        <Text style={styles.subtitle}>
          Choose from saved addresses or add new
        </Text>
      </Animated.View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {savedAddresses.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ color: "#666" }}>No previous addresses found.</Text>
            <Text style={{ color: "#666", marginTop: 8 }}>
              Please add a new address.
            </Text>
          </View>
        )}

        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            onPress={() => setShowForm((s) => !s)}
            style={styles.addButton}
          >
            <Text style={{ fontWeight: "600" }}>
              {showForm ? "Cancel" : "+ Add New Address"}
            </Text>
          </TouchableOpacity>
        </View>

        {savedAddresses.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleUseAddress(item)}
            style={styles.addressCard}
          >
            <Text style={{ fontWeight: "700" }}>{item.street}</Text>
            <Text style={{ color: "#555", marginTop: 4 }}>
              {item.city}, {item.state} {item.zipCode}
            </Text>
            <Text style={{ color: "#777", marginTop: 6 }}>{item.country}</Text>
          </TouchableOpacity>
        ))}

        {showForm && (
          <View style={[styles.form, { marginTop: 0 }]}>
            <TextInput
              placeholder="Street"
              value={form.street}
              onChangeText={(v) => setForm((s) => ({ ...s, street: v }))}
              style={styles.input}
            />
            <TextInput
              placeholder="City"
              value={form.city}
              onChangeText={(v) => setForm((s) => ({ ...s, city: v }))}
              style={styles.input}
            />
            <TextInput
              placeholder="State"
              value={form.state}
              onChangeText={(v) => setForm((s) => ({ ...s, state: v }))}
              style={styles.input}
            />
            <TextInput
              placeholder="ZIP"
              value={form.zipCode}
              onChangeText={(v) => setForm((s) => ({ ...s, zipCode: v }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Country"
              value={form.country}
              onChangeText={(v) => setForm((s) => ({ ...s, country: v }))}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={handleSubmitNew}
              style={styles.primaryBtn}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Use this address
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#666", marginTop: 6 },
  addressCard: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  empty: { padding: 16, alignItems: "center" },
  addButton: {
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  form: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
});
