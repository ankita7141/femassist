const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'whc_token';

// ---- Token helpers ----
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ---- Core fetch wrapper ----
async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, config);
  } catch (err) {
    throw new Error('Network error — is the backend running?');
  }

  // Handle 401 globally — token expired or invalid
  if (res.status === 401) {
    clearToken();
    // Only redirect if we're not already on an auth page
    if (
      !window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/register')
    ) {
      window.location.href = '/login';
    }
    throw new Error('Session expired — please log in again');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

// ---- Convenience methods ----
export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};

// ---- Auth endpoints ----
export const authApi = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

// ---- Onboarding endpoints ----
export const onboardingApi = {
  get: () => api.get('/onboarding'),
  update: (data) => api.put('/onboarding', data),
  complete: () => api.post('/onboarding/complete'),
};

// ---- Reports ----
export const reportsApi = {
  list: () => api.get('/reports'),
  get: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  markReviewed: (id) => api.put(`/reports/${id}/reviewed`),
  remove: (id) => api.del(`/reports/${id}`),
};

// ---- Symptoms ----
export const symptomsApi = {
  list: () => api.get('/symptoms'),
  create: (data) => api.post('/symptoms', data),
  remove: (id) => api.del(`/symptoms/${id}`),
};

// ---- Cycles ----
export const cyclesApi = {
  list: () => api.get('/cycles'),
  create: (data) => api.post('/cycles', data),
  remove: (id) => api.del(`/cycles/${id}`),
};

// ---- Training ----
export const trainingApi = {
  getProgress: () => api.get('/training/progress'),
  getLessonProgress: (lessonId) => api.get(`/training/progress/${lessonId}`),
  complete: (lessonId, score) =>
    api.post(`/training/${lessonId}/complete`, { score }),
};

// ---- Follow-ups ----
export const followupsApi = {
  list: () => api.get('/followups'),
  dismiss: (id) => api.post(`/followups/${id}/dismiss`),
  reset: () => api.post('/followups/reset'),
};
