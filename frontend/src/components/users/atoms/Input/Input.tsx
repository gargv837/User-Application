import type { InputHTMLAttributes } from "react";
import { inputStyle } from "../../styles/styles";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ style, ...props }: InputProps) {
  return <input style={{ ...inputStyle, ...style }} {...props} />;
}

