import { API_CONFIG } from "@/constants/config";
import { CartResponse } from "@/types/cart";
import { storage } from "@/utils/storage";

export async function buildHeaders() { const user = await storage.getUserData();

    return {
        "Content-Type": "application/json",
        "x-api-key": API_CONFIG.apiKey || "",
        ...(user?.id ? { "x-customer-id": user.id } : {})
    }
}

export async function getCartItems(): Promise<CartResponse> {
    const headers = await buildHeaders();
    try {
        const response = await fetch(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`, {
            method: "GET",
            headers,
        }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json() as CartResponse;
        console.log("cart data", data);
        return data

    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}

export async function addToCart({ productId, quantity }: { productId: string, quantity: number }): Promise<{ success: boolean, message: string }> {
    const headers = await buildHeaders();

    if (!productId || !quantity) {
        return {
            success: false,
            message: "Product ID and quantity are required",
        }
    }


    try {
        const response = await fetch(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ productId, quantity }),
        }
        );
        console.log("response", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add item to cart");
        }

        return {
            success: true,
            message: "Item added to cart successfully...!!!",
        };
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}

export async function removeFromCart(cartId: string) {
    const headers = await buildHeaders();
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`, {
            method: "DELETE",
            headers,
            body: JSON.stringify({ cartId }),
        });
        console.log("delete response", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to remove cart item");
        }

    } catch (error) {
        console.error("Remove from cart failed:", error);
        throw error;
    }
}

export async function updateCartQuantity({ cartId, newQuantity }: { cartId: string, newQuantity: number }) {
    const headers = await buildHeaders();
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}/update`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
                cartItemId: cartId,
                action: "set",
                quantity: newQuantity,
            }),
        });
        console.log("update response", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update cart items");
        }

    } catch (error) {
        console.error("Update cart failed:", error);
        throw error;
    }
}
