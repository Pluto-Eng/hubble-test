// File domain types
import { FileRef as GeneratedFileRef } from '@/lib/charon-client/generated';

export interface FileRef extends GeneratedFileRef {}

export interface UploadFileRequest {
  accountId: string;
  documentableId: string; //loan application id, not account id
  document: File;
  documentType?: string; //W2
  documentableType?: string; //loanAsset
  filename?: string; //document.pdf
  fileContentType?: string; //application/pdf
  filepath?: string; //s3://bucket/path/to/document.pdf
  status?: string; //processed
}

export interface UpdateFileMetadataRequest {
  id: string; //file id
  accountId: string;
  documentableId: string; //loan application id, not account id
  documentableType?: string; //loanAsset
  filename?: string; //document.pdf
  fileContentType?: string; //application/pdf
  filepath?: string; //s3://bucket/path/to/document.pdf
  documentType?: string; //W2
  status?: string; //processed
}
