import type { ReactNode, TdHTMLAttributes } from "react";
import { tdStyle } from "../../styles/styles";

type TableCellProps = {
  children: ReactNode;
} & TdHTMLAttributes<HTMLTableCellElement>;

export default function TableCell({ children, style, ...props }: TableCellProps) {
  return (
    <td style={{ ...tdStyle, ...style }} {...props}>
      {children}
    </td>
  );
}

