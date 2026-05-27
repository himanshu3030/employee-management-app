import axios from 'axios';

const BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('accessToken');
const getRefresh = () => localStorage.getItem('refreshToken');

const api = axios.create({ baseURL: BASE });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && getRefresh()) {
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh`, { token: getRefresh() });
        localStorage.setItem('accessToken', data.accessToken);
        err.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(err.config);
      } catch {
        localStorage.clear();
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
