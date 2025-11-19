import { Button } from "../../atoms";

type ActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button variant="primary" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="danger" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}

