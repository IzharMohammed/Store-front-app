import { Product } from "./product";

export interface WishlistItem {
    id: string;
    productId: string;
    customerId: string;
    storeId: string;
    sessionId?: string | null;
    addedAt: string;
    product?:Partial<Product>;
}

// The full wishlist list response
export interface WishlistResponse {
    success: boolean;
    message: string;
    count: number;
    data: WishlistItem[];
}

// Generic result for simple POST/DELETE actions
export interface WishlistActionResponse {
    success: boolean;
    message: string;
}