// Files API client
import { ApiClient } from '@/lib/api-client';
import { FileRef, UploadFileRequest, UpdateFileRequest } from './types';

export class FilesClient extends ApiClient {
  constructor(accountId: string, documentableId: string, authToken?: string) {
    super('files', `/accounts/${accountId}/loan-applications/${documentableId}/files`, authToken);
  }

  async getFiles(params?: any): Promise<FileRef[]> {
    const response = await this.getAll<FileRef>(params);
    return response.data;
  }

  async getFile(id: string): Promise<FileRef> {
    return this.getById<FileRef>(id);
  }

  async uploadFile(data: UploadFileRequest): Promise<FileRef> {
    const formData = new FormData();
    formData.append('document', data.document);
    formData.append('documentType', data.documentType);

    const authToken = await this.getAuthToken();
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw this.handleError(responseData);
    }
    return responseData.data;
  }

  async updateFile(id: string, data: UpdateFileRequest): Promise<FileRef> {
    return this.update<FileRef>(id, data);
  }

  async deleteFile(id: string): Promise<void> {
    return this.delete(id);
  }

  async downloadFile(id: string): Promise<Blob> {
    const authToken = await this.getAuthToken();
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/${id}/download`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw this.handleError(errorData);
    }

    return response.blob();
  }

  private handleError(data: any): Error {
    const { ApiError } = require('../../shared/errors');
    return ApiError.fromResponse(data);
  }
} 