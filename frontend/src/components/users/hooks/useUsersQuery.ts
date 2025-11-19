import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers } from "../../../api/users";
import type { User } from "../types/types";

export function useUsersQuery(page: number, limit: number, search: string) {
  return useQuery<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }>({
    queryKey: ["users", page, limit, search],
    queryFn: async () => {
      const res = await getUsers({ page, limit, search: search || undefined });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

