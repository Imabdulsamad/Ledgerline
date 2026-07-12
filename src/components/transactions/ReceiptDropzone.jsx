import React, { useRef, useState } from "react";
import { UploadCloud, ScanLine, Check } from "lucide-react";
import { parseReceipt } from "../../services/ocr";

/**
 * Drag-and-drop (or click-to-browse) receipt upload.
 * Delegates parsing to the OCR service and reports results upward.
 */
export default function ReceiptDropzone({ onParsed }) {
  const [ocrState, setOcrState] = useState("idle"); // idle | scanning | done
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const scan = async (file) => {
    setOcrState("scanning");
    const parsed = await parseReceipt(file);
    onParsed(parsed);
    setOcrState("done");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) scan(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className="relative mb-5 flex cursor-pointer flex-col items-center gap-1.5 overflow-hidden rounded-xl border border-dashed px-4 py-6 text-center transition-colors"
      style={{
        borderColor: dragOver ? "var(--accent)" : "var(--border)",
        background: dragOver ? "var(--chip)" : "var(--surface-2)",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && scan(e.target.files[0])}
      />
      {ocrState === "scanning" && (
        <div className="scan-bar absolute left-0 h-0.5 w-full" style={{ background: "var(--accent)" }} />
      )}
      {ocrState === "idle" && (
        <>
          <UploadCloud size={22} style={{ color: "var(--accent)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Drop a receipt image</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>OCR fills the details for you (simulated)</p>
        </>
      )}
      {ocrState === "scanning" && (
        <>
          <ScanLine size={22} style={{ color: "var(--accent)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Reading receipt…</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Extracting merchant, amount, category</p>
        </>
      )}
      {ocrState === "done" && (
        <>
          <Check size={22} style={{ color: "var(--income)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Details extracted</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Review below and save</p>
        </>
      )}
    </div>
  );
}
