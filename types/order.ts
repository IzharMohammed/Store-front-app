// export interface OrderItem {
//     id?: string;
//     quantity: number;
//     price: number;
//     productId: string;
//     productName?: string;
//     productImage?: string;
// }
// export interface ShippingAddress {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
// }

// export interface Order {
//     id: string;
//     total: number;
//     status: "PENDING" | "COMPLETED" | "CANCELLED";
//     customerEmail: string;
//     customerName: string;
//     customerPhone: string;
//     shippingAddress: ShippingAddress;
//     createdAt: string;
//     items: OrderItem[];
// }
// export interface OrdersResponse {
//     success: boolean;
//     count: number;
//     data: Order[];
//     message: string;
// }

// export interface CreateOrderRequest {
//     shippingAddress: ShippingAddress;
//     customerPhone?: string;
//     items: {
//         productId: string;
//         quantity: number;
//         price: number;
//     }[];
//     total: number;
// }

// export interface CreateOrderResponse {
//     success: boolean;
//     message: string;
// }

export interface OrderItemRequest {
    productId: string;
    quantity: number;
    price: number;
}

export interface SavedAddress extends ShippingAddress {
    id: string;
    isDefault?: boolean;
    customerName?: string;
    customerPhone?: string;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface CreateOrderRequest {
    shippingAddress: ShippingAddress | string;
    billingAddress?: ShippingAddress | string | null;
    customerPhone?: string;
    items: OrderItemRequest[];
    total: number;
    customerEmail?: string;
    customerName?: string;
}

export interface OrderItemResponse {
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    orderId?: string;
    product?: any;
}

export interface OrderResponse {
    id: string;
    total: number;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    shippingAddress?: ShippingAddress | string | null;
    billingAddress?: ShippingAddress | string | null;
    createdAt: string;
    updatedAt: string;
    customerId?: string;
    storeId?: string;
    items: OrderItemResponse[];
}

export interface ListOrdersResponse {
    success: true;
    data: OrderResponse[];
    count: number;
    message: string;
}

export interface CreateOrderResponse {
    success: boolean;
    data?: {
        orderId?: string;
        orderNumber?: string;
        total?: number;
        status?: string;
    };
    message: string;
    error?: string;
    unavailableProducts?: string[];
}   