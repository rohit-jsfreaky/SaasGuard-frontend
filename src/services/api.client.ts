import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.debug(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const data = error.response?.data;
        const message = data?.message || error.message || 'An unexpected error occurred';

        console.error(`[API Error] ${status} ${error.config?.url}:`, message);

        if (status === 401) {
          // Handle 401 Unauthorized - Logout logic should be handled by the app
          // We can emit an event or just reject the promise
          console.warn('Unauthorized access - redirecting to login...');
          // Optional: window.location.href = '/login'; // Or use a callback
        } else if (status === 403) {
          console.warn('Permission denied');
        } else if (status === 429) {
          console.warn('Rate limit exceeded');
        } else if (status && status >= 500) {
          console.error('Server error');
        }

        // Return a standardized error object
        return Promise.reject({
          message,
          code: data?.code || status,
          details: data?.details,
          requestId: data?.requestId,
        });
      }
    );
  }

  public setAuthToken(token: string | null) {
    this.token = token;
  }

  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(endpoint, config);
    return response.data;
  }

  public async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  public async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  }

  public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(endpoint, config);
    return response.data;
  }
}

// Create a singleton instance
const api = new ApiClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');

export default api;
