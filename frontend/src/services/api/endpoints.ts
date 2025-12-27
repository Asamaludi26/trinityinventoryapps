/**
 * API Endpoint Constants
 * 
 * Centralized endpoint definitions untuk konsistensi dan mudah maintenance.
 * Semua endpoint harus didefinisikan di sini.
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Assets
  ASSETS: '/assets',
  ASSET_BY_ID: (id: string) => `/assets/${id}`,

  // Requests
  REQUESTS: '/requests',
  REQUEST_BY_ID: (id: string) => `/requests/${id}`,
  REQUEST_APPROVE: (id: string) => `/requests/${id}/approve`,
  REQUEST_REJECT: (id: string) => `/requests/${id}/reject`,

  // Loan Requests
  LOAN_REQUESTS: '/loan-requests',
  LOAN_REQUEST_BY_ID: (id: string) => `/loan-requests/${id}`,
  LOAN_REQUEST_APPROVE: (id: string) => `/loan-requests/${id}/approve`,
  LOAN_REQUEST_RETURN: (id: string) => `/loan-requests/${id}/return`,

  // Transactions
  HANDOVERS: '/transactions/handovers',
  HANDOVER_BY_ID: (id: string) => `/transactions/handovers/${id}`,

  DISMANTLES: '/transactions/dismantles',
  DISMANTLE_BY_ID: (id: string) => `/transactions/dismantles/${id}`,

  MAINTENANCES: '/transactions/maintenances',
  MAINTENANCE_BY_ID: (id: string) => `/transactions/maintenances/${id}`,

  INSTALLATIONS: '/transactions/installations',
  INSTALLATION_BY_ID: (id: string) => `/transactions/installations/${id}`,

  RETURNS: '/transactions/returns',

  // Stock Movements
  STOCK_MOVEMENTS: '/stock/movements',
  STOCK_MOVEMENT_BY_ID: (id: string) => `/stock/movements/${id}`,

  // Master Data
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,

  DIVISIONS: '/divisions',
  DIVISION_BY_ID: (id: number) => `/divisions/${id}`,

  CUSTOMERS: '/customers',
  CUSTOMER_BY_ID: (id: string) => `/customers/${id}`,

  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: number) => `/categories/${id}`,

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id: number) => `/notifications/${id}`,
  NOTIFICATIONS_MARK_READ: (id: number) => `/notifications/${id}/read`,
  NOTIFICATIONS_MARK_ALL_READ: (recipientId: number) => `/notifications/read-all/${recipientId}`,
} as const;

