// import { useLocalSearchParams, useRouter } from "expo-router";
// import React from "react";
// import {
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Animated, { FadeInDown } from "react-native-reanimated";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { OrderResponse } from "../../types/order";
// import { Ionicons } from "@expo/vector-icons";

// export default function OrderDetailsScreen() {
//   const router = useRouter();
//   const { order } = useLocalSearchParams();
//   console.log(JSON.parse(order));

//   const parsedOrder: OrderResponse = JSON.parse(order as string);

//   const subtotal = parsedOrder.items.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const shipping = 10;
//   const discount = 30;
//   const tax = 20.02;
//   const total = subtotal + shipping - discount + tax;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Header */}
//         <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backIcon}
//           >
//             <Ionicons name="arrow-back" size={22} color="#000" />
//           </TouchableOpacity>
//           <View style={styles.rowBetween}>
//             <Text style={styles.orderId}>
//               #ORD-{parsedOrder.id.slice(-6).toUpperCase()}
//             </Text>
//             <View
//               style={[
//                 styles.statusBadge,
//                 { backgroundColor: getStatusColor(parsedOrder.status) },
//               ]}
//             >
//               <Text style={styles.statusText}>{parsedOrder.status}</Text>
//             </View>
//           </View>
//           <Text style={styles.date}>
//             {new Date(parsedOrder.createdAt).toLocaleDateString("en-US", {
//               month: "long",
//               day: "numeric",
//               year: "numeric",
//             })}
//           </Text>
//         </Animated.View>

//         {/* Items */}
//         <View style={{ paddingHorizontal: 16 }}>
//           {parsedOrder.items.map((item, index) => (
//             <Animated.View
//               key={item.id}
//               entering={FadeInDown.delay(150 * index)}
//               style={styles.itemCard}
//             >
//               <Image source={{ uri: item.productImage }} style={styles.image} />
//               <View style={{ flex: 1, marginLeft: 12 }}>
//                 <Text style={styles.productName}>{item.productName}</Text>
//                 <Text style={styles.qty}>Qty: {item.quantity}</Text>
//               </View>
//               <Text style={styles.price}>${item.price.toFixed(2)}</Text>
//             </Animated.View>
//           ))}
//         </View>

//         {/* Order Summary */}
//         <View style={styles.summaryContainer}>
//           <Text style={styles.sectionTitle}>Order Summary</Text>
//           <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
//           <SummaryRow label="Shipping" value={`$${shipping.toFixed(2)}`} />
//           <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} />
//           <SummaryRow label="Tax" value={`$${tax.toFixed(2)}`} />
//           <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
//         </View>

//         {/* Shipping Address */}
//         <View style={styles.addressContainer}>
//           <Text style={styles.sectionTitle}>Shipping Address</Text>
//           <Text style={styles.addressText}>{parsedOrder.customerName}</Text>
//           <Text style={styles.addressText}>
//             {parsedOrder.shippingAddress?.street},{" "}
//             {parsedOrder.shippingAddress?.city}
//           </Text>
//           <Text style={styles.addressText}>
//             {parsedOrder.shippingAddress?.state},{" "}
//             {parsedOrder.shippingAddress?.zipCode}
//           </Text>
//           <Text style={styles.addressText}>
//             {parsedOrder.shippingAddress?.country}
//           </Text>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.btnRow}>
//           <TouchableOpacity style={[styles.btn, { borderColor: "#ef4444" }]}>
//             <Text style={[styles.btnText, { color: "#ef4444" }]}>
//               Cancel Order
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.btn, { borderColor: "#000" }]}>
//             <Text style={[styles.btnText, { color: "#000" }]}>Track Order</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.reviewBtn}>
//             <Text style={[styles.btnText, { color: "#fff" }]}>Review</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const SummaryRow = ({ label, value, bold = false }: any) => (
//   <View style={styles.summaryRow}>
//     <Text style={[styles.summaryLabel, bold && { fontWeight: "700" }]}>
//       {label}
//     </Text>
//     <Text style={[styles.summaryValue, bold && { fontWeight: "700" }]}>
//       {value}
//     </Text>
//   </View>
// );

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "PENDING":
//       return "#FCD34D";
//     case "PROCESSING":
//       return "#60A5FA";
//     case "SHIPPED":
//       return "#34D399";
//     case "DELIVERED":
//       return "#22C55E";
//     case "CANCELLED":
//       return "#EF4444";
//     default:
//       return "#E5E7EB";
//   }
// };

// const styles = StyleSheet.create({
//   header: { paddingHorizontal: 16, paddingVertical: 12 },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   orderId: { fontWeight: "700", fontSize: 18 },
//   statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
//   statusText: { fontWeight: "600", fontSize: 12 },
//   date: { color: "#666", marginTop: 6 },
//   itemCard: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
//   image: { width: 60, height: 60, borderRadius: 8 },
//   productName: { fontWeight: "600", fontSize: 15 },
//   qty: { color: "#777", marginTop: 4 },
//   price: { fontWeight: "600", fontSize: 15 },
//   summaryContainer: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     marginTop: 10,
//   },
//   sectionTitle: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 4,
//   },
//   summaryLabel: { color: "#555" },
//   summaryValue: { color: "#111" },
//   addressContainer: { paddingHorizontal: 16, paddingVertical: 10 },
//   addressText: { color: "#555", marginVertical: 2 },
//   btnRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 20,
//   },
//   btn: {
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     flex: 1,
//     marginHorizontal: 4,
//     alignItems: "center",
//   },
//   btnText: { fontWeight: "600" },
//   reviewBtn: {
//     backgroundColor: "#000",
//     borderRadius: 10,
//     paddingVertical: 10,
//     flex: 1,
//     alignItems: "center",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderResponse } from "../../types/order";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { order } = useLocalSearchParams();
  const parsedOrder: OrderResponse = JSON.parse(order as string);

  const subtotal = parsedOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const discount = 30;
  const tax = 20.02;
  const total = subtotal + shipping - discount + tax;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top header with back button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>
            #ORD-{parsedOrder.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={styles.orderDate}>
            {new Date(parsedOrder.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(parsedOrder.status) },
          ]}
        >
          <Text style={styles.statusText}>{parsedOrder.status}</Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 160,
        }}
      >
        {/* Order Items */}
        {parsedOrder.items.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInDown.delay(100 * index)}
            style={styles.productRow}
          >
            <Image
              source={{ uri: item.productImage }}
              style={styles.productImg}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productQty}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          </Animated.View>
        ))}

        <View style={styles.separator} />

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <SummaryRow label="Shipping" value={`$${shipping.toFixed(2)}`} />
          <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} />
          <SummaryRow label="Tax" value={`$${tax.toFixed(2)}`} />
          <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
        </View>
      </ScrollView>

      {/* Fixed bottom section */}
      <View style={styles.bottomSection}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.addressLine}>{parsedOrder.customerName}</Text>
        <Text style={styles.addressLine}>
          {parsedOrder.shippingAddress?.street}
        </Text>
        <Text style={styles.addressLine}>
          {parsedOrder.shippingAddress?.city},{" "}
          {parsedOrder.shippingAddress?.state}
        </Text>
        <Text style={styles.addressLine}>
          {parsedOrder.shippingAddress?.zipCode},{" "}
          {parsedOrder.shippingAddress?.country}
        </Text>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.trackBtn}>
            <Text style={styles.trackText}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewBtn}>
            <Text style={styles.reviewText}>Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const SummaryRow = ({ label, value, bold = false }: any) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && { fontWeight: "700" }]}>
      {label}
    </Text>
    <Text style={[styles.summaryValue, bold && { fontWeight: "700" }]}>
      {value}
    </Text>
  </View>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "#FCD34D";
    case "PROCESSING":
      return "#60A5FA";
    case "SHIPPED":
      return "#34D399";
    case "DELIVERED":
      return "#22C55E";
    case "CANCELLED":
      return "#EF4444";
    default:
      return "#E5E7EB";
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  backIcon: {
    marginRight: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
  },
  orderDate: {
    color: "#777",
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  productImg: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  productName: {
    fontWeight: "600",
    fontSize: 15,
  },
  productQty: {
    color: "#777",
    fontSize: 13,
  },
  productPrice: {
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryLabel: {
    color: "#555",
  },
  summaryValue: {
    color: "#111",
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addressLine: {
    color: "#555",
    marginBottom: 2,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginRight: 6,
  },
  trackBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  reviewBtn: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginLeft: 6,
  },
  cancelText: { color: "#ef4444", fontWeight: "600" },
  trackText: { color: "#000", fontWeight: "600" },
  reviewText: { color: "#fff", fontWeight: "600" },
});
