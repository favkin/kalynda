import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = {
  name: '',
  price: '',
  description: '',
  stock: ''
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);

  // Existing media already stored in Cloudinary/MongoDB
  const [existingMedia, setExistingMedia] = useState([]);

  // New files selected from the computer
  const [newFiles, setNewFiles] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    api
      .getProduct(id)
      .then((product) => {
        setForm({
          name: product.name || '',
          price: product.price ?? '',
          description: product.description || '',
          stock: product.stock ?? ''
        });

        setExistingMedia(product.media || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (field) => (e) => {
    setForm((current) => ({
      ...current,
      [field]: e.target.value
    }));
  };

  // Handle newly selected files
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const images = selectedFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    const videos = selectedFiles.filter((file) =>
      file.type.startsWith('video/')
    );

    if (images.length > 8) {
      setError('You can select a maximum of 8 images at once.');
      return;
    }

    if (videos.length > 2) {
      setError('You can select a maximum of 2 videos at once.');
      return;
    }

    setNewFiles(selectedFiles);
    setError('');

    // Allow selecting the same file again
    e.target.value = '';
  };

  // Remove a newly selected file
  const removeNewFile = (indexToRemove) => {
    setNewFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // Remove an existing image/video from the product
  const removeExistingMedia = (publicId) => {
    setExistingMedia((currentMedia) =>
      currentMedia.filter((media) => media.publicId !== publicId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formData = new FormData();

      // Normal product fields
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('stock', form.stock);

      if (isEdit) {
        const keepMediaIds = existingMedia.map(
          (media) => media.publicId
        );

        formData.append(
          'keepMediaIds',
          JSON.stringify(keepMediaIds)
        );

        // Add newly selected files
        newFiles.forEach((file) => {
          formData.append('media', file);
        });

        await api.updateProduct(id, formData, token);
      } else {
        // Creating a new product requires at least one file
        if (newFiles.length === 0) {
          setError(
            'Please choose at least one image or video for this product.'
          );
          setSaving(false);
          return;
        }

        // Add selected files
        newFiles.forEach((file) => {
          formData.append('media', file);
        });

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
        <p className="text-blush/40 text-sm">
          Loading…
        </p>
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

      <form
        onSubmit={handleSubmit}
        className="max-w-lg flex flex-col gap-4"
      >

        {/* Name */}
        <div>
          <label
            htmlFor="product-name"
            className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5"
          >
            Name
          </label>

          <input
            type="text"
            id="product-name"
            name="name"
            value={form.name}
            onChange={update('name')}
            required
            className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
          />
        </div>

        {/* Price + Stock */}
        <div className="flex gap-4">

          <div className="flex-1">
            <label
              htmlFor="product-price"
              className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5"
            >
              Price
            </label>

            <input
              type="number"
              id="product-price"
              name="price"
              step="0.01"
              min="0"
              value={form.price}
              onChange={update('price')}
              required
              className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="product-stock"
              className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5"
            >
              Stock
            </label>

            <input
              type="number"
              id="product-stock"
              name="stock"
              min="0"
              value={form.stock}
              onChange={update('stock')}
              required
              className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss"
            />
          </div>

        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="product-description"
            className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5"
          >
            Description
          </label>

          <textarea
            id="product-description"
            name="description"
            value={form.description}
            onChange={update('description')}
            required
            maxLength={500}
            rows={4}
            className="w-full bg-studio-raised border border-studio-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gloss resize-none"
          />
        </div>

        {/* Existing Media - EDIT ONLY */}
        {isEdit && (
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-3">
              Current media
            </label>

            {existingMedia.length === 0 ? (
              <p className="text-xs text-blush/40">
                No existing media. You can add new media below.
              </p>
            ) : (
              <div className="flex flex-col gap-2">

                {existingMedia.map((media) => (
                  <div
                    key={media.publicId}
                    className="flex items-center justify-between gap-3 bg-studio-raised border border-studio-line rounded-lg px-3 py-2"
                  >

                    <div className="min-w-0">
                      <p className="text-sm truncate">
                        {media.publicId}
                      </p>

                      <p className="text-xs text-blush/40">
                        {media.type === 'image'
                          ? 'Image'
                          : 'Video'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingMedia(media.publicId)
                      }
                      className="text-rust hover:text-red-400 text-xs uppercase tracking-[0.08em]"
                    >
                      Remove
                    </button>

                  </div>
                ))}

              </div>
            )}
          </div>
        )}

        {/* Add Media */}
        <div>
          <label
            htmlFor="product-media"
            className="block text-xs uppercase tracking-[0.1em] text-blush/50 mb-1.5"
          >
            {isEdit ? 'Add new media' : 'Product media'}
          </label>

          <input
            type="file"
            id="product-media"
            name="media"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            onChange={handleFileChange}
            className="w-full text-sm text-blush/70 file:mr-3 file:bg-studio file:border file:border-studio-line file:rounded-lg file:px-3 file:py-2 file:text-blush/70 file:text-xs file:uppercase file:tracking-[0.08em]"
          />

          <p className="text-xs text-blush/40 mt-2">
            Maximum 8 images and 2 videos per product.
          </p>
        </div>

        {/* Newly Selected Files */}
        {newFiles.length > 0 && (
          <div className="border border-studio-line rounded-lg p-4">

            <p className="text-xs uppercase tracking-[0.1em] text-blush/50 mb-3">
              New media ({newFiles.length})
            </p>

            <div className="flex flex-col gap-2">

              {newFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 bg-studio-raised rounded-lg px-3 py-2"
                >

                  <div className="min-w-0">
                    <p className="text-sm truncate">
                      {file.name}
                    </p>

                    <p className="text-xs text-blush/40">
                      {file.type.startsWith('image/')
                        ? 'Image'
                        : 'Video'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="text-rust hover:text-red-400 text-xs uppercase tracking-[0.08em]"
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-rust text-sm">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-2">

          <button
            type="submit"
            disabled={saving}
            className="bg-gloss hover:bg-gloss-dark transition text-white font-semibold rounded-full px-6 py-2.5 text-sm uppercase tracking-[0.1em] disabled:opacity-50"
          >
            {saving
              ? 'Saving…'
              : isEdit
                ? 'Save changes'
                : 'Create product'}
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