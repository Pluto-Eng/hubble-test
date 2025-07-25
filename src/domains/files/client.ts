// Files API client
import { ApiClient } from '@/lib/api-client';
import { FileRef, UploadFileRequest, UpdateFileMetadataRequest } from './types';

export class FilesClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('files', baseUrl);
  }

  async getFiles() {
    return this.get<FileRef>('/files');
  }

  async getFile(accountId: string, documentableId: string, id: string) {
    return this.get<FileRef>(`/files/${accountId}/${documentableId}/${id}`);
  }

  async uploadFiles(data: UploadFileRequest) {
    //multipart/form-data
    return this.post<FileRef>('/files', data);
  }

  async updateFile(accountId: string, documentableId: string, id: string, data: UpdateFileMetadataRequest) {
    return this.patch<FileRef>(`/files/${accountId}/${documentableId}/${id}`, data);
  }

  async deleteFile(accountId: string, documentableId: string, id: string) {
    return this.delete(`/files/${accountId}/${documentableId}/${id}`);
  }

  async downloadFile(accountId: string, documentableId: string, id: string) {
    //application/octet-stream
    return this.getBlob(`/files/${accountId}/${documentableId}/${id}/download`);
  }
}

export const filesClient = new FilesClient();
