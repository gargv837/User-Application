import type { ReactNode, ThHTMLAttributes } from "react";
import { thStyle } from "../../styles/styles";

type TableHeaderProps = {
  children: ReactNode;
} & ThHTMLAttributes<HTMLTableCellElement>;

export default function TableHeader({ children, style, ...props }: TableHeaderProps) {
  return (
    <th style={{ ...thStyle, ...style }} {...props}>
      {children}
    </th>
  );
}

