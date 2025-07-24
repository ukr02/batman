import { AxiosRequestConfig, AxiosResponse, AxiosHeaders } from 'axios';

export interface PyClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

export interface PyClientRequestOptions extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  retries?: number;
  retryDelay?: number;
}

export interface PyClientResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  ok: boolean;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface PyClientRequestConfig {
  url: string;
  method: RequestMethod;
  data?: any;
  params?: Record<string, any>;
  headers?: AxiosHeaders | Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
} 