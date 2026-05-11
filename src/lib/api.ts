const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken(): string | null {
  return localStorage.getItem('neolance_token');
}

async function request<T>(method: string, path: string, body?: unknown, auth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) { const t = getToken(); if (t) headers['Authorization'] = `Bearer ${t}`; }
  const res = await fetch(`${API_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    register: (d: { name: string; email: string; password: string; role?: string }) => request<{ token: string; user: any }>('POST', '/auth/register', d, false),
    login: (d: { email: string; password: string }) => request<{ token: string; user: any }>('POST', '/auth/login', d, false),
    me: () => request<any>('GET', '/auth/me'),
    logout: () => request<any>('POST', '/auth/logout'),
    forgotPassword: (email: string) => request<any>('POST', '/auth/forgot-password', { email }, false),
    resetPassword: (token: string, password: string) => request<any>('POST', '/auth/reset-password', { token, password }, false),
    changePassword: (currentPassword: string, newPassword: string) => request<any>('POST', '/auth/change-password', { currentPassword, newPassword }),
  },
  users: {
    get: (id: string) => request<any>('GET', `/users/${id}`, undefined, false),
    updateMe: (data: any) => request<any>('PATCH', '/users/me', data),
    search: (query: string) => request<any[]>('GET', `/users?search=${encodeURIComponent(query)}`),
  },
  orders: {
    list: (params?: any) => {
      const p = new URLSearchParams();
      if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && p.set(k, String(v)));
      return request<{ orders: any[]; total: number }>('GET', `/orders?${p}`);
    },
    get: (id: string) => request<any>('GET', `/orders/${id}`),
    create: (data: any) => request<any>('POST', '/orders', data),
    update: (id: string, data: any) => request<any>('PATCH', `/orders/${id}`, data),
    delete: (id: string) => request<any>('DELETE', `/orders/${id}`),
    myOrders: () => request<any[]>('GET', '/orders/my/orders'),
    submitProposal: (orderId: string, data: any) => request<any>('POST', `/orders/${orderId}/proposals`, data),
  },
  messages: {
    conversations: () => request<any[]>('GET', '/messages/conversations'),
    get: (contactId: string) => request<any[]>('GET', `/messages/${contactId}`),
    send: (data: { receiver_id: string; content: string; order_id?: string }) => request<any>('POST', '/messages', data),
  },
  payments: {
    balance: () => request<any>('GET', '/payments/balance'),
    transactions: () => request<any[]>('GET', '/payments/transactions'),
    deposit: (amount: number) => request<any>('POST', '/payments/deposit', { amount }),
    withdraw: (amount: number) => request<any>('POST', '/payments/withdraw', { amount }),
    cards: {
      list: () => request<any[]>('GET', '/payments/cards'),
      add: (data: any) => request<any>('POST', '/payments/cards', data),
      delete: (id: string) => request<any>('DELETE', `/payments/cards/${id}`),
      setPrimary: (id: string) => request<any>('PATCH', `/payments/cards/${id}/primary`),
    },
    stripe: {
      createIntent: (amount: number) => request<any>('POST', '/payments/stripe/create-intent', { amount }),
      confirmDeposit: (intentId: string, amount: number) => request<any>('POST', '/payments/stripe/confirm-deposit', { intentId, amount }),
      connect: () => request<any>('POST', '/payments/stripe/connect'),
      payout: (amount: number) => request<any>('POST', '/payments/stripe/payout', { amount }),
    },
    yookassa: {
      create: (amount: number) => request<any>('POST', '/payments/yookassa/create', { amount }),
      check: (paymentId: string) => request<any>('GET', `/payments/yookassa/check/${paymentId}`),
      payout: (data: any) => request<any>('POST', '/payments/yookassa/payout', data),
    },
    escrow: {
      lock: (orderId: string) => request<any>('POST', '/payments/escrow/lock', { orderId }),
      release: (orderId: string) => request<any>('POST', '/payments/escrow/release', { orderId }),
    },
  },
  workflow: {
    proposals: (orderId: string) => request<any[]>('GET', `/workflow/orders/${orderId}/proposals`),
    acceptProposal: (proposalId: string) => request<any>('POST', `/workflow/proposals/${proposalId}/accept`),
    submitWork: (orderId: string, data: any) => request<any>('POST', `/workflow/orders/${orderId}/submit`, data),
    confirmWork: (orderId: string) => request<any>('POST', `/workflow/orders/${orderId}/confirm`),
    openDispute: (orderId: string, data: any) => request<any>('POST', `/workflow/orders/${orderId}/dispute`, data),
    orderStatus: (orderId: string) => request<any>('GET', `/workflow/orders/${orderId}/status`),
  },
  reviews: {
    get: () => request<any>('GET', '/reviews'),
    create: (data: any) => request<any>('POST', '/reviews', data),
  },
  notifications: {
    get: () => request<any[]>('GET', '/notifications'),
    markRead: (id: string) => request<any>('PATCH', `/notifications/${id}/read`),
    markAllRead: () => request<any>('PATCH', '/notifications/read-all'),
  },
  analytics: { get: () => request<any>('GET', '/analytics') },
};

export function saveToken(token: string) { localStorage.setItem('neolance_token', token); }
export function saveUser(user: any) { localStorage.setItem('neolance_user', JSON.stringify(user)); }
export function clearToken() { localStorage.removeItem('neolance_token'); localStorage.removeItem('neolance_user'); }
export function getUser(): any | null {
  try { return JSON.parse(localStorage.getItem('neolance_user') || 'null'); } catch { return null; }
}
