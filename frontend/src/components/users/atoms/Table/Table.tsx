import type { ReactNode, TableHTMLAttributes } from "react";
import { tableBase } from "../../styles/styles";

type TableProps = {
  children: ReactNode;
} & TableHTMLAttributes<HTMLTableElement>;

export default function Table({ children, style, ...props }: TableProps) {
  return (
    <table style={{ ...tableBase, ...style }} {...props}>
      {children}
    </table>
  );
}

