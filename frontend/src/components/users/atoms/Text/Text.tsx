import type { ReactNode, HTMLAttributes } from "react";
import { palette } from "../../styles/styles";

type TextVariant = "body" | "heading" | "subtitle" | "error";
type TextSize = "sm" | "md" | "lg";

type TextProps = {
  variant?: TextVariant;
  size?: TextSize;
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

const variantStyles: Record<TextVariant, { color: string; fontWeight: number }> = {
  body: { color: palette.text, fontWeight: 400 },
  heading: { color: palette.text, fontWeight: 700 },
  subtitle: { color: palette.subtleText, fontWeight: 400 },
  error: { color: palette.danger, fontWeight: 400 },
};

const sizeStyles: Record<TextSize, { fontSize: string }> = {
  sm: { fontSize: "12px" },
  md: { fontSize: "14px" },
  lg: { fontSize: "16px" },
};

export default function Text({ variant = "body", size = "md", children, style, ...props }: TextProps) {
  return (
    <span style={{ ...variantStyles[variant], ...sizeStyles[size], ...style }} {...props}>
      {children}
    </span>
  );
}

