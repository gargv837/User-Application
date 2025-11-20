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

export const exportUsers = () => axios.get(API);

