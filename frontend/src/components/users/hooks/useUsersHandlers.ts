import { useCallback } from "react";
import { useUserMutations } from "./useUsersMutations";

export function useUsersHandlers(editId: number | null, dispatch: any) {
  const { createMutation, updateMutation, deleteMutation } = useUserMutations();

  const onSubmit = useCallback(
    async (values: { name: string; email: string }) => {
      if (editId !== null) {
        await updateMutation.mutateAsync({ id: editId, payload: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      dispatch({ type: "setEditId", id: null });
    },
    [editId, updateMutation, createMutation, dispatch]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  return { onSubmit, handleDelete };
}
