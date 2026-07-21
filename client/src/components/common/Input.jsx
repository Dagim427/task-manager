import { C } from "../../utils/color";

function Input({ type = "text", placeholder, value, onChange, suffix }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: "100%",
          padding: suffix ? "10px 42px 10px 12px" : "10px 12px",
          border: `1.5px solid ${C.border}`,
          borderRadius: 8,
          fontSize: 14,
          color: C.dark,
          backgroundColor: C.white,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = C.primary)}
        onBlur={(e) => (e.target.style.borderColor = C.border)}
      />
      {suffix && (
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: C.mid,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

export default Input;
