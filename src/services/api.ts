const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://c-production-fba1.up.railway.app';

export const api = {
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};