import type { SelectHTMLAttributes, ReactNode } from "react";
import { palette } from "../../styles/styles";

type SelectProps = {
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ style, children, ...props }: SelectProps) {
  return (
    <select
      style={{
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${palette.border}`,
        background: "#fff",
        color: palette.subtleText,
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}

