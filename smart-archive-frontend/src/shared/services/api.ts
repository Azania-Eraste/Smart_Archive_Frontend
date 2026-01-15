// src/services/api.ts
import axios from 'axios';

// 1. Configuration de base (URL de Django)
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Vérifiez que c'est le bon port Django
  // Intentionally avoid setting a global Content-Type here because some
  // requests (multipart/form-data) need the browser to set the boundary.
  headers: {
    Accept: 'application/json',
  },
});

// 2. Intercepteur : Ajoute le token automatiquement avant chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token envoyé:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ Aucun token trouvé dans localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Intercepteur : Gestion des erreurs (Token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Eviter boucle infinie si l'appel lui-même est pour refresh
    if (originalRequest && originalRequest.url && originalRequest.url.includes('/comptes/token/refresh/')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      console.warn('Session expirée ou token invalide', { url: originalRequest?.url, method: originalRequest?.method });
      console.debug('[api] originalRequest headers:', originalRequest?.headers);

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.warn('[api] no refresh token available; clearing auth and rejecting');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(error);
      }

      // queue mechanism to avoid multiple refresh calls
      if (!(api as any)._isRefreshing) (api as any)._isRefreshing = false;
      if (!(api as any)._failedQueue) (api as any)._failedQueue = [];

      const processQueue = (err: any, token: string | null = null) => {
        (api as any)._failedQueue.forEach((prom: any) => {
          if (err) prom.reject(err);
          else prom.resolve(token);
        });
        (api as any)._failedQueue = [];
      };

      if ((api as any)._isRefreshing) {
        return new Promise<string>(function (resolve: (token: string) => void, reject: (err: any) => void) {
          (api as any)._failedQueue.push({ resolve, reject });
        })
          .then((token: string) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      (api as any)._isRefreshing = true;

      try {
        const base = api.defaults.baseURL || '';
        console.debug('[api] requesting token refresh to', `${base}/comptes/token/refresh/`);
        const resp = await axios.post(`${base}/comptes/token/refresh/`, { refresh: refreshToken });
        console.debug('[api] refresh response:', resp.status, resp.data);
        const newToken = resp.data.access;
        if (newToken) {
          localStorage.setItem('access_token', newToken);
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (errRefresh) {
        console.error('[api] refresh failed', (errRefresh as any)?.response?.status, (errRefresh as any)?.response?.data);
        console.debug('[api] refresh error object:', errRefresh);
        processQueue(errRefresh, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(errRefresh);
      } finally {
        (api as any)._isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;