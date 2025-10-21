import { API_CONFIG } from "@/constants/config";
import { ListOrdersResponse } from "@/types/order";
import { storage } from "@/utils/storage";

export async function buildHeaders() {
    const user = await storage.getUserData();

    return {
        "Content-Type": "application/json",
        "x-api-key": API_CONFIG.apiKey || "",
        ...(user?.id ? { "x-customer-id": user.id } : {})
    }
}

export async function getOrders(): Promise<ListOrdersResponse> {
    const headers = await buildHeaders();
    try {

        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`, {
            method: "GET",
            headers,
            cache: "no-store", // Ensure fresh data on each request
        });

        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }

        // return response.json();
        const data = await response.json();

        return data as ListOrdersResponse;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

export async function createOrder(orderData: any): Promise<{ success: boolean, message: string }> {
    const headers = await buildHeaders();

    // Basic validation
    if (!orderData.items || orderData.items.length === 0) {
        return {
            success: false,
            message: "Customer email and order items are required",
        };
    }

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`, {
            method: "POST",
            headers,
            body: JSON.stringify(orderData),
        });
        console.log("response from createOrder", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create order");
        }

        const result = await response.json();
        console.log("Order created successfully:", result);

        return {
            success: true,
            message: "Order placed successfully!",
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to create order",
        };
    }
}
