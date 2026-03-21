import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 60000,
});

export interface CreateAssignmentPayload {
  subject: string;
  topic: string;
  grade: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  dueDate: string;
  additionalInstructions: string;
  file?: File;
}

export async function createAssignment(data: CreateAssignmentPayload) {
  const formData = new FormData();
  formData.append("subject", data.subject);
  formData.append("topic", data.topic);
  formData.append("grade", data.grade);
  formData.append("questionTypes", JSON.stringify(data.questionTypes));
  formData.append("numberOfQuestions", data.numberOfQuestions.toString());
  formData.append("totalMarks", data.totalMarks.toString());
  formData.append("dueDate", data.dueDate);
  formData.append("additionalInstructions", data.additionalInstructions);

  if (data.file) {
    formData.append("file", data.file);
  }

  for (let i = 0; i < 2; i++) {
    try {
      const response = await api.post("/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      if (i === 1) throw err;
    }
  }
}

export async function pingHealth() {
  try {
    const response = await api.get("/health", { timeout: 5000 });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getAssignment(id: string) {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
}

export async function regenerateAssignment(id: string) {
  const response = await api.post(`/assignments/${id}/regenerate`);
  return response.data;
}

export default api;
