export interface Product {
    _id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
    createdAt?: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: File | null;
}