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
  const fetchStartTime = performance.now();

  // First request the HEADERS only (fast)
  const response = await fetch(`${API.replace(/\/$/, "")}/export`, {
    method: "GET",
  });
  const fetchEndTime = performance.now();

  if (!response.ok) {
    throw new Error("Failed to export users");
  }

  // Extract filename from Content-Disposition
  const disposition = response.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] ?? "customers.csv";

  // IMPORTANT: Instead of blob() → use direct browser download
  const downloadStartTime = performance.now();

  const downloadUrl = `${API.replace(/\/$/, "")}/export`;
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  const downloadEndTime = performance.now();

  return {
    fetchDuration: fetchEndTime - fetchStartTime,
    downloadSetupDuration: downloadEndTime - downloadStartTime,
    totalDuration: downloadEndTime - fetchStartTime,
  };
};

