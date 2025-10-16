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

export async function getFeedbackItems() {
    const headers = await buildHeaders();

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.feedback}`, {
            method: "GET",
            headers,
            cache: "no-store", // Ensure fresh data on each request
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Error ${response.status}: ${errorText}`);
            return {
                success: false,
                message: "Failed to fetch feedback",
            };
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return {
            success: false,
            message: "Failed to fetch feedback",
        };
    }
}

export async function getProductFeedback({ productId, limit = 10, offset = 0 }: { productId: string, limit?: number, offset?: number }) {
    const headers = await buildHeaders();
    try {
        const url = new URL(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.feedback}/product/${productId}`);
        url.searchParams.append("limit", limit.toString());
        url.searchParams.append("offset", offset.toString());

        const response = await fetch(url.toString(), {
            method: "GET",
            headers,
            cache: "no-store", // Ensure fresh data on each request
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Error ${response.status}: ${errorText}`);
            return {
                success: false,
                message: "Failed to fetch product feedback",
            };
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching product feedback:", error);
        return {
            success: false,
            message: "Failed to fetch product feedback",
        };
    }
}

export async function createFeedback({ productId, comment, rating }: { productId: string, comment: string, rating?: number }): Promise<{ success: boolean, message: string, reason?: string }> {
    const headers = await buildHeaders();

    // Basic validation
    if (!productId || !comment) {
        return {
            success: false,
            message: "Product ID and comment are required",
        };
    }

    if (comment.length > 1000) {
        return {
            success: false,
            message: "Comment must be less than 1000 characters",
        };
    }

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.feedback}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ productId, comment, rating }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to add feedback",
            };
        }

        const result = await response.json();
        console.log("result from createFeedback", result);

        return {
            success: true,
            message: result.message || "Feedback added successfully",
        };
    } catch (error) {
        console.error("Error creating feedback:", error);
        return {
            success: false,
            message: "Failed to add feedback",
        };
    }
}

export async function updateFeedback({ feedbackId, comment }: { feedbackId: string, comment: string }): Promise<{ success: boolean, message: string, reason?: string }> {
    const headers = await buildHeaders();

    // Basic validation
    if (!feedbackId || !comment) {
        return {
            success: false,
            message: "Feedback ID and comment are required",
        };
    }

    // Basic validation
    if (!feedbackId || !comment) {
        return {
            success: false,
            message: "Feedback ID and comment are required",
        };
    }

    if (comment.length > 1000) {
        return {
            success: false,
            message: "Comment must be less than 1000 characters",
        };
    }

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.feedback}/${feedbackId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ comment }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to update feedback",
            };
        }

        const result = await response.json();
        console.log("result from updateFeedback", result);


        return {
            success: true,
            message: result.message || "Feedback updated successfully",
        };
    } catch (error) {
        console.error("Error updating feedback:", error);
        return {
            success: false,
            message: "Failed to update feedback",
        };
    }
}

export async function deleteFeedback({ feedbackId, productId }: { feedbackId: string, productId?: string }): Promise<{ success: boolean, message: string, reason?: string }> {
    const headers = await buildHeaders();

    // Basic validation
    if (!feedbackId) {
        return {
            success: false,
            message: "Feedback ID is required",
        };
    }

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.feedback}/${feedbackId}`, {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to delete feedback",
            };
        }

        const result = await response.json();
        return {
            success: true,
            message: result.message || "Feedback deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return {
            success: false,
            message: "Failed to delete feedback",
        };
    }
}
