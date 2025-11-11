import { buttonGhost, palette } from "../styles/styles";

type UsersPaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function UsersPagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: UsersPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isLastPage = page * limit >= total;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} style={buttonGhost}>
        Previous
      </button>
      <span style={{ color: palette.subtleText }}>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(isLastPage ? page : page + 1)}
        disabled={isLastPage}
        style={buttonGhost}
      >
        Next
      </button>
      <span style={{ marginLeft: 12, color: palette.subtleText }}>Rows per page:</span>
      <select
        value={limit}
        onChange={(e) => {
          onPageChange(1);
          onLimitChange(Number(e.target.value));
        }}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: `1px solid ${palette.border}`,
          background: "#fff",
          color: palette.subtleText,
        }}
      >
        <option style={{color: palette.subtleText}} value={5}>5</option>
        <option style={{color: palette.subtleText}} value={10}>10</option>
        <option style={{color: palette.subtleText}} value={20}>20</option>
        <option style={{color: palette.subtleText}} value={50}>50</option>
      </select>
      <span style={{ marginLeft: 12, color: palette.subtleText }}>Total: {total}</span>
    </div>
  );
}


