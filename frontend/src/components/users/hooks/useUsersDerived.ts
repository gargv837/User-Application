import type { User } from "../types/types";

export function useUsersDerived(data: any, editId: number | null) {
  const users: User[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const editingUser =
    editId != null ? users.find((u) => u.id === editId) ?? null : null;

  return { users, total, editingUser };
}
