import type { ReactNode } from "react";
import { cardStyle, sectionGap, palette } from "../../styles/styles";

type PageTemplateProps = {
  title: string;
  children: ReactNode;
};

export default function PageTemplate({ title, children }: PageTemplateProps) {
  return (
    <div style={{ color: palette.text, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ marginBottom: 20, textAlign: "center", width: "100%" }}>{title}</h2>
      <div style={{ ...cardStyle, width: "100%", maxWidth: 900 }}>
        <div style={{ ...sectionGap, alignItems: "center" }}>{children}</div>
      </div>
    </div>
  );
}

