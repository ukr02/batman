import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { 
  PyClientConfig, 
  PyClientRequestOptions, 
  PyClientResponse, 
  PyClientRequestConfig,
  RequestMethod 
} from './types';

// Load environment variables
config();

export class PyClient {
  private axiosInstance: AxiosInstance;
  private defaultRetries: number;
  private defaultRetryDelay: number;

  constructor(config: PyClientConfig = {}) {
    this.defaultRetries = config.retries || 3;
    this.defaultRetryDelay = config.retryDelay || 1000;

    this.axiosInstance = axios.create({
      baseURL: config.baseURL || '',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[PyClient] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
      },
      (error) => {
        console.error('[PyClient] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[PyClient] Success: ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url} - ${response.status}`);
        return response;
      },
      (error) => {
        console.error(`[PyClient] Response error: ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url} - ${error.response?.status || 'Network Error'}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make an HTTP request with automatic retries and error handling
   */
  private async makeRequest<T>(
    requestConfig: PyClientRequestConfig,
    methodName?: string
  ): Promise<PyClientResponse<T>> {
    const {
      url,
      method,
      data,
      params,
      headers = {},
      timeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
    } = requestConfig;

    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      data,
      params,
      headers,
      timeout,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`[PyClient] ${methodName || method} ${url} (attempt ${attempt + 1}/${retries + 1})`);

        const response: AxiosResponse<T> = await this.axiosInstance.request(axiosConfig);

        const responseHeaders: Record<string, string> = {};
        Object.keys(response.headers).forEach((key) => {
          responseHeaders[key] = response.headers[key];
        });

        const result: PyClientResponse<T> = {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          ok: response.status >= 200 && response.status < 300,
        };

        return result;

      } catch (error: any) {
        lastError = error;
        console.error(`[PyClient] Error on attempt ${attempt + 1}:`, error.message);

        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          console.log(`[PyClient] Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Request failed after ${retries + 1} attempts: ${lastError?.message}`);
  }

  /**
   * Utility method for sleeping
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generic request method
   */
  public request<T = any>(
    requestConfig: PyClientRequestConfig,
    methodName?: string
  ): Promise<PyClientResponse<T>> {
    return this.makeRequest<T>(requestConfig, methodName);
  }

  /**
   * GET request
   */
  public get<T = any>(url: string, options?: PyClientRequestOptions): Promise<PyClientResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'GET',
      params: options?.params,
      headers: options?.headers as Record<string, string>,
      timeout: options?.timeout,
      retries: options?.retries,
      retryDelay: options?.retryDelay,
    }, 'get');
  }

  /**
   * POST request
   */
  public post<T = any>(url: string, data?: any, options?: PyClientRequestOptions): Promise<PyClientResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'POST',
      data,
      params: options?.params,
      headers: options?.headers as Record<string, string>,
      timeout: options?.timeout,
      retries: options?.retries,
      retryDelay: options?.retryDelay,
    }, 'post');
  }

  /**
   * PUT request
   */
  public put<T = any>(url: string, data?: any, options?: PyClientRequestOptions): Promise<PyClientResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'PUT',
      data,
      params: options?.params,
      headers: options?.headers as Record<string, string>,
      timeout: options?.timeout,
      retries: options?.retries,
      retryDelay: options?.retryDelay,
    }, 'put');
  }

  /**
   * DELETE request
   */
  public delete<T = any>(url: string, options?: PyClientRequestOptions): Promise<PyClientResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'DELETE',
      params: options?.params,
      headers: options?.headers as Record<string, string>,
      timeout: options?.timeout,
      retries: options?.retries,
      retryDelay: options?.retryDelay,
    }, 'delete');
  }

  /**
   * PATCH request
   */
  public patch<T = any>(url: string, data?: any, options?: PyClientRequestOptions): Promise<PyClientResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'PATCH',
      data,
      params: options?.params,
      headers: options?.headers as Record<string, string>,
      timeout: options?.timeout,
      retries: options?.retries,
      retryDelay: options?.retryDelay,
    }, 'patch');
  }

  /**
   * Generate metric for a specific metrics config and date
   */
  public genMetric = async (metrics_config_id: number, date: number): Promise<boolean> => {
    try {
      const response = await this.post('/api/metrics/generate', {
        metrics_config_id,
        date
      });
      
      return response.ok && response.data?.ack === true;
    } catch (error) {
      console.error(`[PyClient] Error generating metric for config ${metrics_config_id}, date ${date}:`, error);
      return false;
    }
  };

  /**
   * Set default headers
   */
  public setDefaultHeaders(headers: Record<string, string>): void {
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...headers,
    };
  }

  /**
   * Set base URL
   */
  public setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Get current configuration
   */
  public getConfig(): PyClientConfig {
    return {
      baseURL: this.axiosInstance.defaults.baseURL,
      timeout: this.axiosInstance.defaults.timeout,
      headers: this.axiosInstance.defaults.headers.common as Record<string, string>,
      retries: this.defaultRetries,
      retryDelay: this.defaultRetryDelay,
    };
  }
}

// Export a default instance
export const pyClient = new PyClient();

// Export commonly used configurations
export const createPyClient = (config: PyClientConfig) => new PyClient(config); 