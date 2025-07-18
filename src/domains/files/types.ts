// File domain types
import { BaseEntity } from '@/shared/types';

export interface FileRef extends BaseEntity {
  documentableId: string;
  documentableType: string;
  filename: string;
  fileContentType: string;
  filepath: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  size: number;
  encoding: string;
  awsBucket: string;
  awsKey: string;
}

export interface UploadFileRequest {
  document: File;
  documentType: string;
}

export interface UpdateFileRequest {
  documentType?: string;
  status?: FileRef['status'];
} 