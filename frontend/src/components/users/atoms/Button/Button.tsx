import type { ReactNode, ButtonHTMLAttributes } from "react";
import { buttonPrimary, buttonDanger, buttonGhost } from "../../styles/styles";

type ButtonVariant = "primary" | "danger" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: buttonPrimary,
  danger: buttonDanger,
  ghost: buttonGhost,
};

export default function Button({ variant = "primary", children, style, ...props }: ButtonProps) {
  return (
    <button style={{ ...variantStyles[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

