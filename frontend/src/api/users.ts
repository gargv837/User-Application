import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/customers";

export const getUsers = (params?: { page?: number; limit?: number; search?: string }) =>
  axios.get(API, { params });

export const createUser = (data: { phonenumber: string }) =>
  axios.post(API, data);

export const updateUser = (id: number, data: { phonenumber?: string }) =>
  axios.patch(`${API}/${id}`, data);

export const deleteUser = (id: number) =>
  axios.delete(`${API}/${id}`);

export const exportUsersStream = async () => {
  const response = await fetch(`${API.replace(/\/$/, "")}/export`);

  if (!response.ok || !response.body) {
    throw new Error("Failed to export users");
  }

  const blob = await response.blob();

  const disposition = response.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] ?? "customers.csv";

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

