import { Product } from "./product";

export interface CartItem {
    productId: string;
    id: string;
    quantity: number;
}

export interface CartItemWithProduct {
    productId: string;
    id: string;
    quantity: number;
    product: Product;
}