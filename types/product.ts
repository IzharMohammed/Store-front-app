export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string[];
    stock?: number;
    status: string;
    category?: string;
    createdAt: string;
    discount?: number;
}

export interface CategoryFilter {
    name: string;
    count: number;
}

export interface PriceRange {
    min: number;
    max: number;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
}

export interface ProductResponse {
    success: boolean;
    data?: Product[];
    pagination?: Pagination;
    filters?: {
        categories: CategoryFilter[];
        priceRange: PriceRange;
    };
    appliedFilters?: Record<string, any>;
    message?: string;
    error?: string;
}
