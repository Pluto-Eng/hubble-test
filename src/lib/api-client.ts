import { auth } from "@/auth"
import { cookies } from "next/headers"

//base api client to be extended upon by charon api client and other domain api clients
export interface CharonSuccessResponse<T = any> {
  id: string;
  message: string;
  statusCode: number;
  data: T;
  count: number;
  errors: null;
}

export interface CharonErrorResponse {
  id: string;
  message: string;
  statusCode: number;
  feedback: string;
  errors: Record<string, string>;
  data: null;
}

export type ApiResult<T> = {
  id?: string;
  message?: string;
  statusCode?: number;
  data?: T | null;
  count?: number | null;
  feedback?: string | null;
  errors?: any;
  success?: boolean;
}

export class ApiClient {
  constructor(
    private readonly instanceName: string, //name of the instance, e.g. "charonClient", "authClient"
    private readonly baseUrl: string,
    private readonly defaultHeaders: Record<string, string> = {}
  ) {}

  private async makeRequest<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ApiResult<T>> {
    try {
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...options.headers as Record<string, string>,
      };

        // In Auth.js v5, tokens are stored in JWT (server-side only)
        // Access token directly from session (stored in JWT callback)
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken')?.value;
      log.debug('ApiClient', 'Access token from cookies', accessToken);

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers,
      });

      const responseData = await response.json();

      // Handle Charon's response format
      if (response.ok) {
        log.success(`${this.instanceName}`, `${this.baseUrl}${path} Success`, responseData);
        // Success response
        const successResponse = responseData as CharonSuccessResponse<T>;
        const data = {
          id: successResponse.id,
          message: successResponse.message,
          statusCode: successResponse.statusCode,
          data: successResponse.data,
          count: successResponse.count,
          success: true,
        }
        
        return {
          id: successResponse.id,
          message: successResponse.message,
          statusCode: successResponse.statusCode,
          data: successResponse.data,
          count: successResponse.count,
          success: true,
          errors: null,
        };
      } else {
        log.error(`${this.instanceName}`, `${this.baseUrl}${path} Response Error`, responseData);
        // Error response
        const errorResponse = responseData as CharonErrorResponse;
        return {
          message: errorResponse.message,
          statusCode: errorResponse.statusCode,
          feedback: errorResponse.feedback,
          errors: errorResponse.errors,
          data: null,
          success: false,
        };
      }
    } catch (error) {
      log.error(`${this.instanceName}`, `${this.baseUrl}${path} Network Error`, error);
      // Network or parsing errors
      return {
        data: null,
        errors: error instanceof Error ? error.message : 'Unknown error occurred',
        statusCode: 0, // Indicates network error
      };
    }
  }

  async get<T>(path: string, options: Omit<RequestInit, 'method'> = {}): Promise<ApiResult<T>> {
    return this.makeRequest<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body?: any, options: Omit<RequestInit, 'method' | 'body'> = {}): Promise<ApiResult<T>> {
    return this.makeRequest<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: any, options: Omit<RequestInit, 'method' | 'body'> = {}): Promise<ApiResult<T>> {
    return this.makeRequest<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: any, options: Omit<RequestInit, 'method' | 'body'> = {}): Promise<ApiResult<T>> {
    return this.makeRequest<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string, options: Omit<RequestInit, 'method'> = {}): Promise<ApiResult<T>> {
    return this.makeRequest<T>(path, { ...options, method: 'DELETE' });
  }
}