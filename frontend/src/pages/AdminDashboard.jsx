import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { resolveMediaUrl, formatPrice } from '../utils/media.js';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    api
      .getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Couldn't delete product: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-2">Inventory</p>
          <h1 className="font-display text-3xl">Products</h1>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-gloss hover:bg-gloss-dark transition text-white font-semibold rounded-full px-5 py-2.5 text-sm uppercase tracking-[0.1em]"
        >
          + Add product
        </Link>
      </div>

      {loading && <p className="text-blush/40 text-sm">Loading products…</p>}
      {error && <p className="text-rust text-sm">Couldn't load products: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="border border-dashed border-studio-line rounded-2xl py-20 text-center">
          <p className="font-display text-2xl mb-1">No products yet</p>
          <p className="text-blush/40 text-sm">Add your first product to see it on the site.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {products.map((product) => {
          const mediaUrl = resolveMediaUrl(product);
          return (
            <div
              key={product._id}
              className="flex items-center gap-4 bg-studio-raised border border-studio-line rounded-xl px-4 py-3"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-studio flex-shrink-0">
                {mediaUrl && (
                  <img src={mediaUrl} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-xs text-blush/40">
                  {formatPrice(product.price)} · {product.stock} in stock
                </p>
              </div>
              <Link
                to={`/admin/products/${product._id}/edit`}
                className="text-xs uppercase tracking-[0.1em] text-blush/60 hover:text-blush transition px-3 py-1.5"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(product._id)}
                disabled={deletingId === product._id}
                className="text-xs uppercase tracking-[0.1em] text-rust hover:brightness-125 transition px-3 py-1.5 disabled:opacity-40"
              >
                {deletingId === product._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
