export const palette = {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  danger: "#ef4444",
  dangerHover: "#dc2626",
  text: "#0f172a",
  subtleText: "#475569",
  border: "#e2e8f0",
  surface: "#ffffff",
  surfaceAlt: "#f8fafc",
  shadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
};

export const cardStyle: React.CSSProperties = {
  backgroundColor: palette.surface,
  border: `1px solid ${palette.border}`,
  borderRadius: 12,
  padding: 20,
  boxShadow: palette.shadow,
  width: "100%",
  maxWidth: 900,
};

export const sectionGap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  width: "100%",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 160,
  padding: "10px 12px",
  borderRadius: 8,
  border: `1px solid ${palette.border}`,
  color: palette.text,
  backgroundColor: palette.surface,
};

export const buttonBase: React.CSSProperties = {
  border: "none",
  borderRadius: 8,
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer",
  color: "#fff",
};

export const buttonPrimary: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: palette.primary,
};

export const buttonDanger: React.CSSProperties = {
  ...buttonBase,
  backgroundColor: palette.danger,
};

export const buttonGhost: React.CSSProperties = {
  borderRadius: 8,
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer",
  color: palette.subtleText,
  background: "transparent",
  border: `1px solid ${palette.border}`,
};

export const tableBase: React.CSSProperties = {
  textAlign: "left",
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  border: `1px solid ${palette.border}`,
  borderRadius: 10,
  overflow: "hidden",
};

export const thStyle: React.CSSProperties = {
  backgroundColor: palette.surfaceAlt,
  color: palette.subtleText,
  fontWeight: 700,
  padding: "12px 14px",
  borderBottom: `1px solid ${palette.border}`,
};

export const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderBottom: `1px solid ${palette.border}`,
};

