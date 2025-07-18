// Base API client for domain-specific extensions
import { config } from '@/lib/config';
import { ApiResponse, PaginationParams } from '@/shared/types/global';
import { ApiError } from '@/lib/error-handler';

export abstract class BaseApiClient {
  protected baseUrl: string;
  protected authToken?: string;

  constructor(endpoint: string, authToken?: string) {
    this.baseUrl = `${config.api.baseUrl || 'http://localhost:3000/api/v1'}${endpoint}`;
    this.authToken = authToken;
  }

  protected async getAuthToken(): Promise<string | undefined> {
    if (this.authToken) {
      return this.authToken;
    }

    // For server-side usage, authToken should be passed explicitly
    // Client-side components should pass the token from useSession hook
    return undefined;
  }

  protected async request<T>(
    method: string,
    path: string = '',
    body?: any,
    params?: PaginationParams
  ): Promise<ApiResponse<T>> {
    const url = new URL(this.baseUrl + path);
    
    if (params) {
      if (params.limit) url.searchParams.append('pLimit', params.limit.toString());
      if (params.offset) url.searchParams.append('pOffset', params.offset.toString());
      if (params.order) url.searchParams.append('pOrder', params.order);
      if (params.fields) url.searchParams.append('pFields', params.fields);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const authToken = await this.getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.name) {
        throw ApiError.fromCognitoError(data);
      }
      throw ApiError.fromResponse(data);
    }

    return data;
  }

  // Common CRUD operations
  async getAll<T>(params?: PaginationParams): Promise<ApiResponse<T[]>> {
    return this.request<T[]>('GET', '', undefined, params);
  }

  async getById<T>(id: string, fields?: string): Promise<T> {
    const params = fields ? { fields } : undefined;
    const response = await this.request<T>('GET', `/${id}`, undefined, params);
    return response.data;
  }

  async create<T>(data: any): Promise<T> {
    const response = await this.request<T>('POST', '', data);
    return response.data;
  }

  async update<T>(id: string, data: any): Promise<T> {
    const response = await this.request<T>('PATCH', `/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.request('DELETE', `/${id}`);
  }

  async customRequest<T>(
    method: string,
    path: string,
    body?: any,
    params?: PaginationParams
  ): Promise<ApiResponse<T>> {
    return this.request<T>(method, path, body, params);
  }
} 