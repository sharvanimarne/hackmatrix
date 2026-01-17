// services/apiService.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('nemesis_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('nemesis_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('nemesis_token');
};

// Base fetch wrapper with auth
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const ApiService = {
  // Auth
  register: async (name: string, email: string, password: string) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  logout: () => {
    removeToken();
  },

  getProfile: () => apiFetch('/auth/profile'),
  
  updateProfile: (name: string, email: string) => 
    apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email }),
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiFetch('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  updateTheme: (theme: string) =>
    apiFetch('/auth/theme', {
      method: 'PUT',
      body: JSON.stringify({ theme }),
    }),

  updateSettings: (settings: any) =>
    apiFetch('/auth/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    }),

  // Finance
  getFinances: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiFetch(`/finance${query}`);
  },

  createFinance: (data: any) =>
    apiFetch('/finance', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateFinance: (id: string, data: any) =>
    apiFetch(`/finance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteFinance: (id: string) =>
    apiFetch(`/finance/${id}`, { method: 'DELETE' }),

  getFinanceSummary: () => apiFetch('/finance/summary'),

  // Journal
  getJournals: () => apiFetch('/journal'),
  
  createJournal: (data: any) =>
    apiFetch('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateJournal: (id: string, data: any) =>
    apiFetch(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteJournal: (id: string) =>
    apiFetch(`/journal/${id}`, { method: 'DELETE' }),

  // Habits
  getHabits: () => apiFetch('/habits'),
  
  createHabit: (data: any) =>
    apiFetch('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleHabit: (id: string) =>
    apiFetch(`/habits/${id}/toggle`, { method: 'POST' }),

  updateHabit: (id: string, data: any) =>
    apiFetch(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteHabit: (id: string) =>
    apiFetch(`/habits/${id}`, { method: 'DELETE' }),

  // Subscriptions
  getSubscriptions: () => apiFetch('/subscriptions'),
  
  createSubscription: (data: any) =>
    apiFetch('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteSubscription: (id: string) =>
    apiFetch(`/subscriptions/${id}`, { method: 'DELETE' }),

  // Wellness
  getWellnessConfig: () => apiFetch('/wellness/config'),
  
  updateWellnessConfig: (config: string[]) =>
    apiFetch('/wellness/config', {
      method: 'PUT',
      body: JSON.stringify({ config }),
    }),

  getWellnessState: (date: string) => apiFetch(`/wellness/state/${date}`),
  
  updateWellnessState: (date: string, state: any) =>
    apiFetch(`/wellness/state/${date}`, {
      method: 'PUT',
      body: JSON.stringify({ state }),
    }),

  // Gratitude
  getGratitude: () => apiFetch('/gratitude'),
  
  updateGratitude: (items: string[]) =>
    apiFetch('/gratitude', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),

  // Hydration
  getHydrationToday: () => apiFetch('/hydration/today'),
  
  updateHydrationToday: (cups: number) =>
    apiFetch('/hydration/today', {
      method: 'PUT',
      body: JSON.stringify({ cups }),
    }),

  // Sleep
  getLatestSleep: () => apiFetch('/sleep/latest'),
  
  createSleep: (hours: number) =>
    apiFetch('/sleep', {
      method: 'POST',
      body: JSON.stringify({ hours }),
    }),

  deleteSleep: (id: string) =>
    apiFetch(`/sleep/${id}`, { method: 'DELETE' }),

  // AI Insights
  generateInsights: () =>
    apiFetch('/ai/insights', { method: 'POST' }),
};

export { getToken, setToken, removeToken };