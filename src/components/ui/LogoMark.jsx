import React, { useState } from "react";
import { Wallet } from "lucide-react";

/**
 * App logo. Renders /logo-mark.png when present, and falls back to the
 * accent Wallet chip if the file is missing or fails to load — so the
 * header never shows a broken image.
 */
export default function LogoMark({ size = 36 }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="flex items-center justify-center rounded-xl"
        style={{ height: size, width: size, background: "var(--chip)", color: "var(--accent)" }}
      >
        <Wallet size={size * 0.5} />
      </span>
    );
  }

  return (
    <img
      src="/favicon.svg"
      alt="Ledgerline logo"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="rounded-xl object-cover"
      style={{ height: size, width: size }}
    />
  );
}
