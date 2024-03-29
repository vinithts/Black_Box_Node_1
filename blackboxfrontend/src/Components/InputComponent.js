import React from "react";

const InputComponent = ({ label, value, onChange, type, name, textArea }) => {
  return (
    <div>
      <label
        style={{
          color: "white",
          fontWeight: "600",
          display: "flex",
          alignItems: "end",
        }}
      >
        {label}
      </label>
      <input
        type={type ? "search" : "text"}
        style={{
          padding: "10px",
          width: "100%",
          borderRadius: "10px",
          background: "transparent",
          border: "1px solid #D9D9D9",
          caretColor: "#D9D9D9",
          color: "white",
          height: textArea ? "100px" : "",
          resize: textArea ? "none" : "",
          overflowY: textArea ? "auto" : "",
        }}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputComponent;
