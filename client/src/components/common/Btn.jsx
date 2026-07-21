import { useState } from "react";
import { C } from "../../utils/color";

function Btn({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md", 
  full, 
  type = "button", 
  disabled = false,
  ...props 
}) {
  const [h, setH] = useState(false);

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "44px",
    gap: 6,
    fontFamily: "inherit",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.15s",
    width: full ? "100%" : "auto",
    borderRadius: 8,
    padding: size === "sm" ? "7px 14px" : "10px 18px",
    fontSize: size === "sm" ? 13 : 14,
  };

  const styles = {
    primary: {
      backgroundColor: h && !disabled ? C.primaryDark : C.primary,
      color: "#fff",
      border: "none",
    },
    outline: {
      backgroundColor: "transparent",
      color: C.primary,
      border: `1.5px solid ${C.primary}`,
    },
    ghost: {
      backgroundColor: h && !disabled ? C.bg : "transparent",
      color: C.mid,
      border: `1.5px solid ${C.border}`,
    },
    danger: {
      backgroundColor: h && !disabled ? "#DC2626" : C.danger,
      color: "#fff",
      border: "none",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ ...base, ...styles[variant] }}
      {...props}
    >
      {children}
    </button>
  );
}

export default Btn;