"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { productService } from "@/services/productService";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await productService.getProducts();
            setProducts(data);
        } catch (err) {
            setError("Gagal memuat data produk");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (_id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

        try {
            await productService.deleteProduct(_id);
            fetchProducts();
            alert("Produk berhasil dihapus");
        } catch (err) {
            alert("Gagal menghapus produk");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
                <button
                    onClick={fetchProducts}
                    className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className="py-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Produk</h2>

            {products.length === 0 && (
                <div className="text-center py-10 text-gray-500">Belum ada produk</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
                {products.map((product) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all overflow-hidden flex flex-col"
                    >
                        {/* Gambar */}
                        <div className="w-full h-48 relative bg-gray-200">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                                    No Image
                                </div>
                            )}
                        </div>


                        {/* Konten */}
                        <div className="flex flex-col gap-2 p-4 flex-grow">
                            <div className="flex justify-between items-start">
                                <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.name}</h2>
                                <span className="text-green-600 font-semibold text-lg whitespace-nowrap">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                        </div>


                        {/* Aksi */}
                        <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                            <Link
                                href={`/products/edit/${product._id}`}
                                className="text-center text-sm bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600 transition"
                            >
                                Edit
                            </Link>


                            <button
                                onClick={() => handleDelete(product._id)}
                                className="text-center text-sm bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
                            >
                                Hapus
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
