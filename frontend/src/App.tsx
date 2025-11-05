import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "./api/users";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }>({
    queryKey: ["users", page, limit, search],
    queryFn: async () => {
      const res = await getUsers({ page, limit, search: search || undefined });
      return res.data as { data: User[]; total: number; page: number; limit: number };
    },
    placeholderData: keepPreviousData,
  });

  const users: User[] = data?.data ?? [];
  const total = data?.total ?? 0;

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; email: string }) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name?: string; email?: string } }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (editId !== null) {
      await updateMutation.mutateAsync({ id: editId, payload: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  
    // reset after submit
    setForm({ name: "", email: "" });
    setEditId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
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
      <input
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={{ width: "320px", padding: "6px 8px" }}
      />
  
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
  
      {isLoading && <div>Loading...</div>}
      {isError && <div>Failed to load users.</div>}
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
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "5px" }}>
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
