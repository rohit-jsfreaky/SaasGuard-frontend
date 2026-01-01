import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";
import type { ApiResponse, ApiError } from "@/types/api";

// Type for the token getter function (Clerk's getToken)
type TokenGetter = () => Promise<string | null>;

class ApiClient {
  private client: AxiosInstance;
  private getToken: TokenGetter | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor - Get fresh token for EVERY request
    this.client.interceptors.request.use(
      async (config) => {
        // Always get a fresh token for each request
        if (this.getToken) {
          try {
            const token = await this.getToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error("[API] Failed to get auth token:", error);
          }
        }
        console.debug(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.debug(
          `[API Response] ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        // Get user-friendly message based on status code
        let message = data?.message || error.message;

        if (status === 400) {
          message = data?.message || "Invalid input. Please check your data.";
        } else if (status === 401) {
          message = "Session expired. Please login again.";
          console.warn("Unauthorized access - token may have expired");
        } else if (status === 403) {
          message =
            data?.message ||
            "You don't have permission to perform this action.";
          console.warn("Permission denied");
        } else if (status === 404) {
          message = data?.message || "Resource not found.";
        } else if (status === 409) {
          message =
            data?.message || "This operation conflicts with existing data.";
        } else if (status === 429) {
          message = "Too many requests. Please wait a moment.";
          console.warn("Rate limit exceeded");
        } else if (status && status >= 500) {
          message = "Server error. Please try again later.";
          console.error("Server error");
        } else if (!status) {
          message = "Network error. Please check your connection.";
        }

        console.error(`[API Error] ${status} ${error.config?.url}:`, message);

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

  /**
   * Set the token getter function - this should be Clerk's getToken function
   * This is called once when the app initializes, but the function will be
   * called for EVERY request to get a fresh token
   */
  public setTokenGetter(getter: TokenGetter) {
    this.getToken = getter;
  }

  public async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(endpoint, config);
    return response.data;
  }

  public async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  public async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  public async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(endpoint, config);
    return response.data;
  }
}

// Create a singleton instance
const api = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
);

export default api;
