import type { SuccessResponse, ErrorResponse } from '@/lib/charon-client/generated'; // adjust path

//base api client to be extended upon by charon api client and other domain api clients
type ResultWrapper<T, E = ErrorResponse> = {
  result?: T;
  error?: E;
};

export class ApiClient {
  protected accessToken?: string;

  constructor(
    private readonly instanceName: string, //name of the instance, e.g. "charonClient", "authClient"
    private readonly baseUrl: string,
    private readonly defaultHeaders: Record<string, string> = {}
  ) {}

  // In Auth.js v5, tokens are stored in JWT (server-side only)
  // Access token directly from auth() not session, (stored in JWT callback)
  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async injectAuthHeaders(options: RequestInit = {}) {
    // Prepare headers
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      'Content-Type': (options.headers as Record<string, string>)?.['content-type'] ?? 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (!this.accessToken) {
      log.error('ApiClient', 'No access token found');
    } else {
      log.debug('ApiClient', 'Access token from setAccessToken', { accessToken: this.accessToken });
    }

    return {
      ...options,
      headers,
    };
  }

  private async _fetch(path: string, options: RequestInit): Promise<Response> {
    const optionsWithAuth = await this.injectAuthHeaders(options);
    return fetch(`${this.baseUrl}${path}`, {
      ...optionsWithAuth,
      credentials: 'include',
    });
  }

  private async makeRequest<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ResultWrapper<SuccessResponse & { data: T }, ErrorResponse>> {
    try {
      const response = await this._fetch(path, options);
      const responseData = await response.json();

      if (!response.ok) {
        // Create a new, standard error object to avoid mutation issues.
        const safeError = {
          message: responseData.message || 'API request failed',
          feedback: responseData.feedback, // Add more context
          errors: responseData.errors, // Add more context
          statusCode: response.status,
        };

        log.error(`${this.instanceName}`, `${this.baseUrl}${path} Response Error`, safeError);
        return { error: responseData as ErrorResponse };
      }

      log.success(`${this.instanceName}`, `${this.baseUrl}${path} Success`, responseData);
      return { result: responseData as SuccessResponse & { data: T } };
    } catch (error) {
      const safeError = {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      };
      log.error(`${this.instanceName}`, `${this.baseUrl}${path} Network Error`, safeError);
      return {
        error: { message: error instanceof Error ? error.message : 'Unknown network error' } as ErrorResponse,
      };
    }
  }

  //uses private mehtod _fetch to handles Blob parsing
  async getBlob(path: string, options: Omit<RequestInit, 'method'> = {}): Promise<ResultWrapper<Blob, ErrorResponse>> {
    try {
      const response = await this._fetch(path, { ...options, method: 'GET' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }));
        const safeError = {
          message: errorData.message || 'Download failed',
          feedback: errorData.feedback, // Add more context
          errors: errorData.errors, // Add more context
          statusCode: response.status,
        };
        log.error(`${this.instanceName}`, `${this.baseUrl}${path} Network Error`, safeError);
        return { error: errorData as ErrorResponse };
      }
      return { result: await response.blob() };
    } catch (error) {
      const errorToLog = new Error(error instanceof Error ? error.message : 'Unknown network error');
      const safeErr = {
        error: errorToLog.message,
        stack: errorToLog.stack,
        timestamp: new Date().toISOString(),
      };
      log.error(`${this.instanceName}`, `${this.baseUrl}${path} Network Error`, safeErr);
      return { error: { message: error instanceof Error ? error.message : 'Unknown network error' } as ErrorResponse };
    }
  }

  async get<T>(
    path: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<ResultWrapper<SuccessResponse & { data: T }, ErrorResponse>> {
    return this.makeRequest<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(
    path: string,
    body?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<ResultWrapper<SuccessResponse & { data: T }, ErrorResponse>> {
    return this.makeRequest<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    path: string,
    body?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<ResultWrapper<SuccessResponse & { data: T }, ErrorResponse>> {
    return this.makeRequest<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    path: string,
    body?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<ResultWrapper<SuccessResponse & { data: T }, ErrorResponse>> {
    return this.makeRequest<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    path: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<ResultWrapper<SuccessResponse & { data: T }, ErrorResponse>> {
    return this.makeRequest<T>(path, { ...options, method: 'DELETE' });
  }
}
