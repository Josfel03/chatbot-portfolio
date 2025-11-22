import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(`${API_URL}/upload_pdf/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function queryDoc(question: string) {
  const { data } = await axios.post(`${API_URL}/query/`, { question });
  return data;
}
