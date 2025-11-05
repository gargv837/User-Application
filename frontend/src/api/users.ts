import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/users";


export const getUsers = (params?: { page?: number; limit?: number; search?: string }) => axios.get(API, { params });
export const createUser = (data: { name: string; email: string }) => axios.post(API, data);
export const updateUser = (id: number, data: { name?: string; email?: string }) => axios.patch(`${API}/${id}`, data);
export const deleteUser = (id: number) => axios.delete(`${API}/${id}`);
