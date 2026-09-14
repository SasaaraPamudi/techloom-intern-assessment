import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, addStock } from '../api/posApi';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ product_name: '', price: '', totalStock: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      alert('Failed to load inventory');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        product_name: formData.product_name,
        price: parseFloat(formData.price),
        totalStock: parseInt(formData.totalStock, 10),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setFormData({ product_name: '', price: '', totalStock: '' });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm('Delete product?')) {
      try {
        await deleteProduct(id);
        fetchInventory();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleAddStock = async (id) => {
    if (!id) return;
    const qty = prompt('Enter quantity to add:');
    if (qty && !isNaN(qty)) {
      try {
        await addStock(id, parseInt(qty, 10));
        fetchInventory();
      } catch (err) {
        alert('Failed to add stock');
      }
    }
  };

  const handleEdit = (product) => {
    const prodId = product.productId ?? product.product_id ?? product.id;
    setEditingId(prodId);
    setFormData({
      product_name: product.productName || product.product_name || product.name || '',
      price: product.price ?? '',
      totalStock: product.totalStock ?? product.stock ?? '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ product_name: '', price: '', totalStock: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <main className="max-w-6xl mx-auto space-y-6">

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-200">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-400"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price ($)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-400"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={formData.totalStock}
              onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
              required
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-md shadow-blue-600/20 active:scale-95"
            >
              {editingId ? 'Update Product' : '+ Add Product'}
            </button>
          </form>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                products.map((p, index) => {
                  const prodId = p.productId ?? p.product_id ?? p.id ?? index;
                  const prodName = p.productName ?? p.product_name ?? p.name ?? 'Unknown';
                  const prodStock = p.totalStock ?? p.stock ?? 0;

                  return (
                    <tr key={prodId} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 font-mono text-slate-400">#{prodId}</td>
                      <td className="px-6 py-4 font-medium text-white">{prodName}</td>
                      <td className="px-6 py-4">${Number(p.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {prodStock <= 5 ? (
                          <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full border border-red-500/20 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            {prodStock} in stock (Low Stock)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                            {prodStock} in stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium transition border border-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAddStock(prodId)}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium border border-blue-500/20 transition"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => handleDelete(prodId)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md text-xs font-medium border border-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}