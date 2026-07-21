import { C } from "./color";


export const cardStyle = {
  backgroundColor: C.white,
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

export const statTitleStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: C.mid,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export const statValueStyle = {
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1,
};