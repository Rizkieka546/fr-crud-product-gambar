'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Komponen untuk menampilkan daftar produk
 */
export default function ProductList() {
    // State untuk menyimpan data produk
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * Fungsi untuk mengambil data produk dari API
     */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await productService.getProducts();
            setProducts(data);
        } catch (err) {
            setError('Gagal memuat data produk');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fungsi untuk menghapus produk
     */
    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            return;
        }

        try {
            await productService.deleteProduct(id);
            // Refresh daftar produk setelah penghapusan
            fetchProducts();
            alert('Produk berhasil dihapus');
        } catch (err) {
            alert('Gagal menghapus produk');
            console.error(err);
        }
    };

    // Mengambil data produk ketika komponen pertama kali di-render
    useEffect(() => {
        fetchProducts();
    }, []);

    // Menampilkan loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Menampilkan error state
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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Header tabel */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Daftar Produk</h2>
            </div>

            {/* Tabel produk */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gambar
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Harga
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stok
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                {/* Kolom gambar */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.image ? (
                                        <Image
                                            src={`http://localhost:5000/uploads/${product.image}`}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">No Image</span>
                                        </div>
                                    )}
                                </td>
                                {/* Kolom nama dan deskripsi */}
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {product.name}
                                    </div>
                                    <div className="text-sm text-gray-500 line-clamp-2">
                                        {product.description}
                                    </div>
                                </td>

                                {/* Kolom harga */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </div>
                                </td>

                                {/* Kolom stok */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 10
                                            ? 'bg-green-100 text-green-800'
                                            : product.stock > 0
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.stock} pcs
                                    </span>
                                </td>

                                {/* Kolom aksi */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {/* Tombol edit */}
                                        <Link
                                            href={`/products/edit/${product._id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </Link>

                                        {/* Tombol hapus */}
                                        <button
                                            onClick={() => handleDelete(product._id!)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty state */}
            {products.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Belum ada produk</p>
                </div>
            )}
        </div>
    );
}