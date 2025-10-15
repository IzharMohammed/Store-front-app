import { Category } from "@/types/category";
import { getProducts } from "./product";

export async function getCategories(): Promise<Category[]> {

    try {

        const response = await getProducts({ limit: 1 });

        if (response.success && response.filters?.categories) {
            return response.filters.categories
        }

        return [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}