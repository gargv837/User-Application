import type { ReactNode } from "react";
import { Label, Text } from "../../atoms";

type FormFieldProps = {
  label?: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <Label>{label}</Label>}
      {children}
      {error && <Text variant="error" size="sm">{error}</Text>}
    </div>
  );
}

