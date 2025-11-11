import { useReducer } from "react";
import UsersForm from "./ui/UsersForm";
import UsersTable from "./ui/UsersTable";
import UsersPagination from "./ui/UsersPagination";
import UsersSearch from "./ui/UsersSearch";
import UsersModal from "./ui/UsersModal";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useUsersHandlers } from "./hooks/useUsersHandlers";
import { useUsersDerived } from "./hooks/useUsersDerived";
import { reducer, initialState } from "./hooks/useUsersState";
import { cardStyle, sectionGap, palette } from "./styles/styles";
import "./styles/Users.css";

export default function Users() {
  const [{ editId, page, limit, search }, dispatch] = useReducer(reducer, initialState);
  const { data, isLoading, isError } = useUsersQuery(page, limit, search);
  const { users, total, editingUser } = useUsersDerived(data, editId);
  const { onSubmit, handleDelete } = useUsersHandlers(editId, dispatch);

  return (
    <div className="users-container" style={{ color: palette.text }}>
      <h2 className="users-header">Users</h2>

      <div style={cardStyle}>
        <div style={sectionGap}>
          <UsersSearch
            value={search}
            onResetToFirstPage={() => dispatch({ type: "setPage", page: 1 })}
            onChange={(value) => dispatch({ type: "setSearch", search: value })}
          />
          <UsersForm
            editingUser={null}
            onSubmit={onSubmit}
            onCancelEdit={() => {}}
          />
          {isLoading && <div>Loading...</div>}
          {isError && <div>Failed to load users.</div>}
          <UsersTable
            users={users}
            onEdit={(u) => dispatch({ type: "setEditId", id: u.id })}
            onDelete={handleDelete}
          />
          <UsersPagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={(p) => dispatch({ type: "setPage", page: p })}
            onLimitChange={(l) => dispatch({ type: "setLimit", limit: l })}
          />
        </div>
      </div>
      <UsersModal
        open={Boolean(editingUser)}
        title="Edit User"
        onClose={() => dispatch({ type: "setEditId", id: null })}
      >
        <UsersForm
          editingUser={editingUser}
          onSubmit={onSubmit}
          onCancelEdit={() => {
            dispatch({ type: "setEditId", id: null });
          }}
        />
      </UsersModal>
    </div>
  );
}


