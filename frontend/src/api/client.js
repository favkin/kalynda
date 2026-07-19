const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4040/api';

async function request(path, { method = 'GET', body, token, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = data?.message || 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Admin
  register: (payload) => request('/admin/register', { method: 'POST', body: payload }),
  login: (payload) => request('/admin/login', { method: 'POST', body: payload }),

  // Products
  getAllProducts: () => request('/product/allProducts'),
  getProduct: (id) => request(`/product/singleProduct/${id}`),
  createProduct: (formData, token) =>
    request('/product/newProduct', { method: 'POST', body: formData, token, isForm: true }),
  updateProduct: (id, payload, token) =>
    request(`/product/updateSingle/${id}`, { method: 'PATCH', body: payload, token }),
  deleteProduct: (id, token) =>
    request(`/product/deleteSingle/${id}`, { method: 'DELETE', token })
};
