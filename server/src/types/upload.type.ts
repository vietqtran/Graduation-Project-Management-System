export interface FileInfo {
  originalName: string;
  contentType: string;
  size: number;
  lastModified: number;
  lastModifiedDate: string;
  webkitRelativePath: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  originalName: string;
}

export interface UploadResult {
  success: boolean;
  key?: string;
  originalName: string;
  error?: string;
}

export interface FileUploadResponse {
  success: boolean;
  error?: string;
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  results: UploadResult[];
}
