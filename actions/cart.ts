import { API_CONFIG } from "@/constants/config";

const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.BACKEND_API_KEY || "",
};

export async function getCartItems() {
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

        const data = response.json();

        return {
            data
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}

export async function addToCart({ productId, quantity }: { productId: string, quantity: string }) {

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
    try {
        const response = await fetch(` ${API_CONFIG.baseURL}${API_CONFIG.endpoints.carts}`, {
            method: "DELETE",
            headers,
            body: JSON.stringify({ cartId }),
        });

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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update cart items");
        }

    } catch (error) {
        console.error("Update cart failed:", error);
        throw error;
    }
}
