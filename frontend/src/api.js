const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const request = async (path, { token, method = 'GET', body } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return payload.data || payload;
};

export const login = (credentials) => request('/auth/login', { method: 'POST', body: credentials });
export const getProjects = (token) => request('/projects', { token });
export const createProject = (token, body) => request('/projects', { token, method: 'POST', body });
export const getTasks = (token) => request('/tasks', { token });
export const createTask = (token, body) => request('/tasks', { token, method: 'POST', body });
