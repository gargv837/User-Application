import type { ReactNode } from "react";
import { palette, buttonGhost } from "../styles/styles";

type UsersModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function UsersModal({ open, title, onClose, children }: UsersModalProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          backgroundColor: palette.surface,
          borderRadius: 12,
          minWidth: 420,
          maxWidth: "90vw",
          padding: 16,
          boxShadow: "0 18px 42px rgba(15, 23, 42, 0.25)",
          border: `1px solid ${palette.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={buttonGhost}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}


