import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers, exportUsersStream } from "../../../api/users";
import type { User } from "../types/types";

export function useUsersQuery(page: number, limit: number, search: string) {
  return useQuery<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }>({
    queryKey: ["users", page, limit, search?.trim() || ""],
    queryFn: async () => {
      const searchParam = search?.trim() || undefined;
      const res = await getUsers({ page, limit, search: searchParam });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useExportUsersQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["export-users"],
    queryFn: async () => {
      const res = await exportUsersStream();
      return res ?? [];
    },
    enabled,
    staleTime: 0,
  });
}

