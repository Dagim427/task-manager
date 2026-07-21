import { C } from "../../utils/color";

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: C.dark,
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

export default Label;
