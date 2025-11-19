import { Select, Text } from "../../atoms";
import { PaginationButton } from "../../molecules";

type PaginationControlsProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function PaginationControls({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isLastPage = page * limit >= total;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
      <PaginationButton onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
        Previous
      </PaginationButton>
      <Text variant="subtitle" size="md">
        Page {page} of {totalPages}
      </Text>
      <PaginationButton onClick={() => onPageChange(isLastPage ? page : page + 1)} disabled={isLastPage}>
        Next
      </PaginationButton>
      <Text variant="subtitle" size="md" style={{ marginLeft: 12 }}>
        Rows per page:
      </Text>
      <Select
        value={limit}
        onChange={(e) => {
          onPageChange(1);
          onLimitChange(Number(e.target.value));
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </Select>
      <Text variant="subtitle" size="md" style={{ marginLeft: 12 }}>
        Total: {total}
      </Text>
    </div>
  );
}

