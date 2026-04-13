import { useRef, useEffect, useCallback } from "react";

interface MiddleTruncateProps {
  text: string;
  className?: string;
}

/**
 * Truncates text from the middle so that both the beginning and end remain
 * visible when the container is too narrow. Falls back to the full string
 * when there is enough room.
 */
export function MiddleTruncate({ text, className }: MiddleTruncateProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const recalc = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    // Temporarily show full text so we can measure its natural width.
    el.textContent = text;
    // scrollWidth gives the full content width even when overflow is hidden.
    if (el.scrollWidth <= el.clientWidth) {
      return;
    }

    // Binary-search for the maximum number of characters we can keep from
    // each side while still fitting inside the container.
    let lo = 0;
    let hi = Math.floor(text.length / 2);

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const candidate = text.slice(0, mid) + "…" + text.slice(-mid);
      el.textContent = candidate;
      if (el.scrollWidth <= el.clientWidth) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    el.textContent =
      lo > 0 ? text.slice(0, lo) + "…" + text.slice(-lo) : "…";
  }, [text]);

  useEffect(() => {
    recalc();

    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => recalc());
    ro.observe(el);
    return () => ro.disconnect();
  }, [recalc]);

  return (
    <span
      ref={containerRef}
      title={text}
      className={`block overflow-hidden whitespace-nowrap ${className ?? ""}`}
    >
      {text}
    </span>
  );
}
