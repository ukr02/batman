import { PyClientConfig } from '../clients/PyClient/types';

export const pyClientConfig: PyClientConfig = {
  baseURL: process.env.PY_CLIENT_BASE_URL,
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}; 