/**
 * HTTP Client Wrapper
 * 
 * Centralized HTTP client untuk semua API calls.
 * Menangani authentication, error handling, dan request/response interceptors.
 */

import { useAuthStore } from '../stores/useAuthStore';
import { useNotificationStore } from '../stores/useNotificationStore';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Get authentication headers
   */
  private async getHeaders(): Promise<HeadersInit> {
    const token = useAuthStore.getState().currentUser?.token;
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Core request method with error handling
   */
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const headers = await this.getHeaders();
    const url = `${this.baseURL}${endpoint}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      // Handle errors
      if (!response.ok) {
        await this.handleError(response);
      }

      // Parse JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // Return empty object for non-JSON responses
      return {} as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle abort (timeout)
      if (error.name === 'AbortError') {
        this.handleNetworkError(new Error('Request timeout. Silakan coba lagi.'));
        throw new Error('Request timeout');
      }

      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        this.handleNetworkError(error);
        throw new Error('Koneksi terputus. Silakan coba lagi.');
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Handle HTTP errors
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: any = {};
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      }
    } catch {
      // If response is not JSON, use status text
      errorData = { message: response.statusText };
    }

    const error = {
      status: response.status,
      message: errorData.message || errorData.error || response.statusText || 'Terjadi kesalahan',
      errors: errorData.errors,
    };

    // Handle 401 Unauthorized - Auto logout
    if (response.status === 401) {
      useAuthStore.getState().logout();
      useNotificationStore.getState().addToast('Sesi Anda telah berakhir. Silakan login kembali.', 'error');
      window.location.href = '/';
      throw error;
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      useNotificationStore.getState().addToast('Anda tidak memiliki izin untuk melakukan aksi ini.', 'error');
      throw error;
    }

    // Handle 404 Not Found
    if (response.status === 404) {
      useNotificationStore.getState().addToast('Data tidak ditemukan.', 'error');
      throw error;
    }

    // Handle 409 Conflict
    if (response.status === 409) {
      useNotificationStore.getState().addToast(error.message || 'Konflik data. Silakan refresh halaman.', 'error');
      throw error;
    }

    // Handle 500+ Server errors
    if (response.status >= 500) {
      useNotificationStore.getState().addToast('Terjadi kesalahan pada server. Silakan coba lagi nanti.', 'error');
      throw error;
    }

    // Default error notification
    useNotificationStore.getState().addToast(error.message, 'error');
    throw error;
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(error: Error): void {
    useNotificationStore.getState().addToast(
      'Koneksi terputus. Silakan periksa koneksi internet Anda dan coba lagi.',
      'error'
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

