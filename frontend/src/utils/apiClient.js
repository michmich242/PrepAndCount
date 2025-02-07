import { API_URL } from '../config/config';
import { handleError } from './errorHandler';
import * as SecureStore from 'expo-secure-store';

class ApiClient {
  constructor(baseURL = API_URL) {
    this.baseURL = baseURL;
  }

  // Add auth token to request
  async getHeaders() {
    const token = await SecureStore.getItemAsync('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || 'An error occurred',
        code: error.code,
      };
    }
    return response.json();
  }

  // GET request
  async get(endpoint, options = {}) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: { ...headers, ...options.headers },
      });
      return this.handleResponse(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  // POST request
  async post(endpoint, data, options = {}) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: { ...headers, ...options.headers },
      });
      return this.handleResponse(response);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
