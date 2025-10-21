import { OrderItemRequest, ShippingAddress } from "@/types/order";
import React, { createContext } from "react";

type PaymentMethod = {
  id: string;
  label: string;
  type: "card" | "applepay" | "googlepay" | "cash";
};

interface CheckoutState {
  shippingAddress?: ShippingAddress | null;
  billingAddress?: ShippingAddress | null;
  paymentMethod?: PaymentMethod | null;
  items: OrderItemRequest[];
  customerPhone?: string | null;
  setShippingAddress: (address: ShippingAddress) => void;
  setBillingAddress: (address: ShippingAddress | null) => void;
  setCustomerPhone: (phone: string | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setItems: (items: OrderItemRequest[]) => void;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutState | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shippingAddress, setShippingAddress] =
    React.useState<ShippingAddress | null>(null);
  const [billingAddress, setBillingAddress] =
    React.useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod | null>(null);
  const [items, setItems] = React.useState<OrderItemRequest[]>([]);
  const [customerPhone, setCustomerPhone] = React.useState<string>("");

  const clearCheckout = () => {
    setShippingAddress(null);
    setBillingAddress(null);
    setPaymentMethod(null);
    setItems([]);
  };

  return (
    <CheckoutContext.Provider
      value={{
        shippingAddress: shippingAddress ?? undefined,
        billingAddress: billingAddress ?? undefined,
        paymentMethod: paymentMethod ?? undefined,
        items,
        customerPhone: customerPhone ?? undefined,
        setShippingAddress: (s) => setShippingAddress(s),
        setBillingAddress: (b) => setBillingAddress(b ?? null),
        setPaymentMethod: (p) => setPaymentMethod(p ?? null),
        setItems,
        setCustomerPhone: (p) => setCustomerPhone(p ?? ""),
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
export const useCheckout = (): CheckoutState => {
  const context = React.useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
