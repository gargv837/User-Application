import type { User } from "../../types/types";
import { Table, TableHeader, TableCell } from "../../atoms";
import { ActionButtons } from "../../molecules";

type DataTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

export default function DataTable({ users, onEdit, onDelete }: DataTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>ID</TableHeader>
          <TableHeader>Phone Number</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.phonenumber}</TableCell>
            <TableCell>
              <ActionButtons
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user.id)}
              />
            </TableCell>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
