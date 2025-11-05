import { useEffect, useRef } from "react";

export default function useBarcodeScanner(onScan, delay = 50) {
  const bufferRef = useRef("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore non-printable keys
      if (e.key.length !== 1) return;

      bufferRef.current += e.key;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const code = bufferRef.current.trim();
        if (code) {
          onScan(code); // Send full barcode
        }
        bufferRef.current = "";
      }, delay);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onScan, delay]);
}
