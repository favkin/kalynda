import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = { name: '', price: '', description: '', stock: '' };

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api
      .getProduct(id)
      .then((product) =>
        setForm({
          name: product.name || '',
          price: product.price ?? '',
          description: product.description || '',
          stock: product.stock ?? ''
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await api.updateProduct(id, form, token);
      } else {
        if (!file) {
          setError('Please choose an image or video for this product.');
          setSaving(false);
          return;
        }
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('description', form.description);
        formData.append('stock', form.stock);
        formData.append('auto', file);
        await api.createProduct(formData, token);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-blush/40 text-sm">Loading…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-2">
        {isEdit ? 'Edit product' : 'New product'}
      </p>
      <h1 className="font-display text-3xl mb-8">
        {isEdit ? form.name || 'Edit product' : 'Add a product'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Name</label>
          <input
            value={form.name}
            onChange={update('name')}
            required
            className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={update('price')}
              required
              className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={update('stock')}
              required
              className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={update('description')}
            required
            maxLength={500}
            rows={4}
            className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss resize-none"
          />
        </div>

        {!isEdit && (
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5">
              Image or video
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full text-sm text-blush/70 file:mr-3 file:bg-studio file:border file:border-studio-line file:rounded-lg file:px-3 file:py-2 file:text-blush/70 file:text-xs file:uppercase file:tracking-[0.08em]"
            />
          </div>
        )}

        {isEdit && (
          <p className="text-xs text-blush/40">
            Media can't be changed after a product is created — delete and re-add if you need a new image.
          </p>
        )}

        {error && <p className="text-rust text-sm">{error}</p>}

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-gloss hover:bg-gloss-dark transition text-white font-semibold rounded-full px-6 py-2.5 text-sm uppercase tracking-[0.1em] disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="text-blush/50 hover:text-blush transition text-sm px-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
