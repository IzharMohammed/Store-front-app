import { API_CONFIG } from "@/constants/config";
import { ProductDetailResponse, ProductResponse } from "@/types/product";

const headers = {
    "Content-Type": "application/json",
    "x-api-key": API_CONFIG.apiKey,
};

export async function getProducts(filters: Record<string, any> = {}): Promise<ProductResponse> {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || "Failed to fetch products" };
        }

        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, error: "Network error" };
    }
}

export async function getProductById(productId: string): Promise<ProductDetailResponse> {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}/${productId}`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error:
                    errorData.message ||
                    `Server error: ${response.status}. Please try again.`,
            };
        }

        const data = await response.json();
        console.log("data", data);

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Error fetching product details:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to fetch product details",
        };
    }
}