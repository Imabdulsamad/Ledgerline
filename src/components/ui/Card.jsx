import React from "react";

export default function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ background: "var(--surface)", borderColor: "var(--border)", ...style }}
    >
      {children}
    </div>
  );
}
