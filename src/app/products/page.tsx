'use client';

import { useState, useEffect } from 'react';
import { Product, CreateProductData } from '@/types/product';
import { productService } from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData: CreateProductData) => {
    try {
      setFormLoading(true);
      await productService.createProduct(productData);
      await loadProducts();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (productData: CreateProductData) => {
    if (!editingProduct) return;
    
    try {
      setFormLoading(true);
      await productService.updateProduct(editingProduct._id, productData);
      await loadProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleFormSubmit = (data: CreateProductData) => {
    if (editingProduct) {
      handleUpdateProduct(data);
    } else {
      handleCreateProduct(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-2">Manage your products efficiently</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              + Add New Product
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first product</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Create Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        {(showForm || editingProduct) && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={formLoading}
          />
        )}
      </div>
    </div>
  );
}