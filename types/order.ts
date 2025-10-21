export interface OrderItem {
    id?: string;
    quantity: number;
    price: number;
    productId: string;
    productName?: string;
    productImage?: string;
}
export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    id: string;
    total: number;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    createdAt: string;
    items: OrderItem[];
}
export interface OrdersResponse {
    success: boolean;
    count: number;
    data: Order[];
    message: string;
}

export interface CreateOrderRequest {
    shippingAddress: ShippingAddress;
    customerPhone?: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    total: number;
}

export interface CreateOrderResponse {
    success: boolean;
    message: string;
}