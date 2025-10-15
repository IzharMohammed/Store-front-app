export interface Product {
    id: string;
    name: string;
    price: number;
    image: string[];
    stock: number;
    status: string;
    description: string;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    addedAt: string;
    product: Product;
}

export interface CartResponse {
    success: boolean;
    message: string;
    count: number;
    data: CartItem[];
}
