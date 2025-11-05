import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "./api/users";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    const res = await getUsers({ page, limit });
    setUsers(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (editId !== null) {
      await updateUser(editId, form);
    } else {
      await createUser(form);
    }
  
    // reset after submit
    setForm({ name: "", email: "" });
    setEditId(null);
  
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h2>Users CRUD</h2>
  
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
  
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
  
        <button type="submit">{editId ? "Update" : "Add"}</button>
  
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", email: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>
  
      <table border={1} cellPadding={10} style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
  
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button
                  onClick={() => {
                    setEditId(u.id);
                    setForm({ name: u.name, email: u.email });
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {Math.max(1, Math.ceil(total / limit))}
        </span>
        <button
          onClick={() => setPage((p) => (page * limit >= total ? p : p + 1))}
          disabled={page * limit >= total}
        >
          Next
        </button>
        <span style={{ marginLeft: 12 }}>Rows per page:</span>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(Number(e.target.value));
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span style={{ marginLeft: 12 }}>Total: {total}</span>
      </div>
    </div>
  );
}

export default App;
