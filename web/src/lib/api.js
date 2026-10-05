const BASE = '/api';

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function token() {
  try { return localStorage.getItem('bb_token'); } catch { return null; }
}

export function setToken(t) {
  try {
    if (t) localStorage.setItem('bb_token', t);
    else localStorage.removeItem('bb_token');
  } catch { /* storage blocked */ }
}

async function request(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && token()) headers.Authorization = `Bearer ${token()}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    signal,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status, data);
  }
  return data;
}

const qs = (params = {}) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'all' && v !== 'All India') p.set(k, v);
  });
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const api = {
  health: () => request('/health'),

  auth: {
    signup: (b) => request('/auth/signup', { method: 'POST', body: b }),
    login: (b) => request('/auth/login', { method: 'POST', body: b }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: (signal) => request('/auth/me', { auth: true, signal }),
    update: (b) => request('/auth/me', { method: 'PATCH', body: b, auth: true }),
    changePassword: (b) => request('/auth/change-password', { method: 'POST', body: b, auth: true })
  },

  stats: () => request('/stats'),
  categories: () => request('/categories'),
  cities: () => request('/cities'),

  businesses: (p, signal) => request(`/businesses${qs(p)}`, { signal }),
  business: (slug, signal) => request(`/businesses/${encodeURIComponent(slug)}`, { signal }),
  myListings: () => request('/businesses/mine/listings', { auth: true }),
  createBusiness: (b) => request('/businesses', { method: 'POST', body: b, auth: true }),
  updateBusiness: (slug, b) => request(`/businesses/${encodeURIComponent(slug)}`, { method: 'PUT', body: b, auth: true }),
  deleteBusiness: (slug) => request(`/businesses/${encodeURIComponent(slug)}`, { method: 'DELETE', auth: true }),

  products: (p, signal) => request(`/products${qs(p)}`, { signal }),
  services: (p, signal) => request(`/services${qs(p)}`, { signal }),
  product: (slug, signal) => request(`/products/${encodeURIComponent(slug)}`, { signal }),
  service: (slug, signal) => request(`/services/${encodeURIComponent(slug)}`, { signal }),

  enquiries: {
    create: (b) => request('/enquiries', { method: 'POST', body: b }),
    received: () => request('/enquiries/received', { auth: true }),
    sent: () => request('/enquiries/sent', { auth: true }),
    setStatus: (id, status) => request(`/enquiries/${id}/status`, { method: 'PATCH', body: { status }, auth: true })
  },

  contact: (b) => request('/enquiries/contact', { method: 'POST', body: b }),

  savedSearches: {
    list: () => request('/saved-searches', { auth: true }),
    save: (b) => request('/saved-searches', { method: 'POST', body: b, auth: true }),
    remove: (id) => request(`/saved-searches/${id}`, { method: 'DELETE', auth: true })
  },

  admin: {
    stats: () => request('/admin/stats', { auth: true }),
    users: (p) => request(`/admin/users${qs(p)}`, { auth: true }),
    setUser: (id, b) => request(`/admin/users/${id}`, { method: 'PATCH', body: b, auth: true }),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE', auth: true }),
    businesses: () => request('/admin/businesses', { auth: true }),
    verify: (id, verified) => request(`/admin/businesses/${id}/verify`, { method: 'PATCH', body: { verified }, auth: true }),
    deleteBusiness: (id) => request(`/admin/businesses/${id}`, { method: 'DELETE', auth: true }),
    enquiries: (p) => request(`/admin/enquiries${qs(p)}`, { auth: true }),
    messages: () => request('/admin/messages', { auth: true })
  }
};

export { ApiError };