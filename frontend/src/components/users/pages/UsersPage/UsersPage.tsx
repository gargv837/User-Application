import { useReducer, useState } from "react";
import { useUsersQuery, useUsersHandlers, useUsersDerived, reducer, initialState } from "../../hooks";
import { PageTemplate } from "../../templates";
import { UserForm, DataTable, PaginationControls, Modal } from "../../organisms";
import { SearchBar } from "../../molecules";
import { Text, Button } from "../../atoms";
import "../../styles/Users.css";

export default function UsersPage() {
  const [{ editId, page, limit, search }, dispatch] = useReducer(reducer, initialState);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const { data, isLoading, isError } = useUsersQuery(page, limit, search);
  const { users, total, editingUser } = useUsersDerived(data, editId);
  const { onSubmit, handleDelete } = useUsersHandlers(editId, dispatch);

  const handleAddSubmit = async (values: { name: string; email: string }) => {
    await onSubmit(values);
    setAddModalOpen(false);
  };

  return (
    <div className="users-container">
      <PageTemplate title="Users">
        <SearchBar
          value={search}
          onResetToFirstPage={() => dispatch({ type: "setPage", page: 1 })}
          onChange={(value) => dispatch({ type: "setSearch", search: value })}
        />
        <Button onClick={() => setAddModalOpen(true)}>Add User</Button>
        {isLoading && <Text>Loading...</Text>}
        {isError && <Text variant="error">Failed to load users.</Text>}
        <DataTable
          users={users}
          onEdit={(u) => dispatch({ type: "setEditId", id: u.id })}
          onDelete={handleDelete}
        />
        <PaginationControls
          page={page}
          limit={limit}
          total={total}
          onPageChange={(p) => dispatch({ type: "setPage", page: p })}
          onLimitChange={(l) => dispatch({ type: "setLimit", limit: l })}
        />
      </PageTemplate>
      <Modal
        open={isAddModalOpen}
        title="Add User"
        onClose={() => setAddModalOpen(false)}
      >
        <UserForm
          editingUser={null}
          onSubmit={handleAddSubmit}
          onCancelEdit={() => setAddModalOpen(false)}
        />
      </Modal>
      <Modal
        open={Boolean(editingUser)}
        title="Edit User"
        onClose={() => dispatch({ type: "setEditId", id: null })}
      >
        <UserForm
          editingUser={editingUser}
          onSubmit={onSubmit}
          onCancelEdit={() => {
            dispatch({ type: "setEditId", id: null });
          }}
        />
      </Modal>
    </div>
  );
}

