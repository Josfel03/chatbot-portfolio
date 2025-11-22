export interface Message {
  id?: string;
  role: "user" | "bot" | "system";
  content: string;
  sources?: Array<{ page: number }>;
  timestamp?: Date;
}

export interface UploadResult {
  document_id: string;
  filename: string;
  pages: number;
  status: string;
}
