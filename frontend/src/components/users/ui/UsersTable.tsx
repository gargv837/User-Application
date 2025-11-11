import type { User } from "../types/types";
import { tableBase, thStyle, tdStyle, buttonPrimary, buttonDanger } from "../styles/styles";

type UsersTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <table style={tableBase}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td style={tdStyle}>{u.id}</td>
            <td style={tdStyle}>{u.name}</td>
            <td style={tdStyle}>{u.email}</td>
            <td style={{ ...tdStyle, display: "flex", gap: 8 }}>
              <button
                onClick={() => onEdit(u)}
                style={buttonPrimary}
              >
                Edit
              </button>
              <button onClick={() => onDelete(u.id)} style={buttonDanger}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


