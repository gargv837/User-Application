import type { ReactNode, LabelHTMLAttributes } from "react";
import { palette } from "../../styles/styles";

type LabelProps = {
  children: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ children, style, ...props }: LabelProps) {
  return (
    <label style={{ color: palette.text, fontWeight: 600, fontSize: "14px", ...style }} {...props}>
      {children}
    </label>
  );
}

