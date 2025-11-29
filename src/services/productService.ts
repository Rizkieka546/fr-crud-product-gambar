import { Product, ProductFormData } from "@/types/product";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const productService = {
    async getProducts(): Promise<Product[]> {
        try {
            const response = await api.get('/products');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching products: ', error);
            throw error;
        }
    },

    async getProductById(_id: string): Promise<Product> {
        try {
            const response = await api.get(`/products/${_id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error to get data product: ', error);
            throw error;
        }
    },

    async createProduct(formData: ProductFormData): Promise<Product> {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price.toString());
            data.append('stock', formData.stock.toString());

            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await api.post('/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data
        } catch (error) {
            console.error('Error creating product: ', error);
            throw error;
        }
    },

    async updateProduct(_id: string, formData: ProductFormData): Promise<Product> {
        try {
            const data = new FormData();

            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price.toString());
            data.append('stock', formData.stock.toString());

            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await api.put(`/products/${_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data
        } catch (error) {
            console.error('Error updating product: ', error);
            throw error;
        }
    },

    async deleteProduct(_id: string): Promise<void> {
        try {
            await api.delete(`/products/${_id}`);
        } catch (error) {
            console.error('Error deleting product: ', error);
            throw error;
        }
    }
}