export interface BuildingDocumentDTO {
  id: number;
  fileName: string;
  fileUrl: string;
  contentType?: string | null;
  sizeBytes?: number | null;
  uploadedAt?: string | null;
  category?: string | null;
}
