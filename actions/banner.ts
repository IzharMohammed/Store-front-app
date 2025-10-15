import { API_CONFIG } from "@/constants/config";
import { BannerResponse } from "@/types/banner";

export async function getBanners(): Promise<BannerResponse> {
    try {
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": API_CONFIG.apiKey
        }

        const response = await fetch(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.banners}`, {
            method: "GET",
            headers,
        }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(
                errorData.message || `Server error: ${response.status}. Please try again`
            )
        }

        const data = await response.json();

        return {
            data
        }
    } catch (error) {
        console.error("Failed to fetch banners", error);
        const newError = error instanceof Error ? error.message : error
        return {
            error: newError
        }
    }
}