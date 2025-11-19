import { Button } from "../../atoms";

type PaginationButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function PaginationButton({ onClick, disabled, children }: PaginationButtonProps) {
  return (
    <Button variant="ghost" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

