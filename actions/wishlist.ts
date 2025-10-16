import { API_CONFIG } from "@/constants/config";
import { storage } from "@/utils/storage";

export async function buildHeaders() {
    const user = await storage.getUserData();
    
    return {
        "Content-Type": "application/json",
        "x-api-key": API_CONFIG.apiKey || "",
        ...(user?.id ? { "x-customer-id": user.id } : {})
    }
}

export async function getWishlistItems() {
    const headers = await buildHeaders();
    try {

        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.wishlist}`, {
            method: "GET",
            headers,
            cache: "no-store", // Ensure fresh data on each request
        });

        if (!response.ok) {
            throw new Error("Failed to fetch wishlist items");
        }

        const data = await response.json();
        console.log("data from wishlist", data);

        return {
            ...data,
        };
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }
}

export async function addToWishlist(productId: string): Promise<{ success: boolean, message: string }> {
    const headers = await buildHeaders();

    // Basic validation
    if (!productId) {
        return {
            success: false,
            message: "Product ID is required",
        };
    }

    try {

        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.wishlist}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add to wishlist");
        }

        return {
            success: true,
            message: "Item added to wishlist successfully!",
        };
    } catch (error) {
        console.error("Error adding to wishlist:", error);

        if (
            error instanceof Error &&
            error.message.includes("already in wishlist")
        ) {
            return {
                success: false,
                message: "Item is already in your wishlist",
            };
        }

        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to add to wishlist",
        };
    }
}

export async function removeFromWishlist(itemId: string): Promise<{ success: boolean, message: string }> {
    const headers = await buildHeaders();
    // Basic validation
    if (!itemId) {
        return {
            success: false,
            message: "Item ID is required",
        };
    }

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.wishlist}`, {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to remove from wishlist");
        }

        return {
            success: true,
            message: "Item removed from wishlist successfully!",
        };
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to remove from wishlist",
        };
    }
}
