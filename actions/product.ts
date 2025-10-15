import { API_CONFIG } from "@/constants/config";
import { ProductResponse } from "@/types/product";

export async function getProducts(filters: Record<string, any> = {}): Promise<ProductResponse> {
    try {
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": API_CONFIG.apiKey,
        };
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