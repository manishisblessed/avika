"use client";

import { useEffect, useRef } from "react";

/**
 * A soft brand-tinted glow that trails the cursor. Driven entirely through
 * requestAnimationFrame + direct DOM writes (no React state) so it never
 * triggers a re-render, and disabled on touch / reduced-motion devices.
 */
export default function CursorAura() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noHover = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noHover || reduced) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = -300;
    let y = -300;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${x - 210}px, ${y - 210}px, 0)`;
          raf = 0;
        });
      }
    };

    el.style.opacity = "1";
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[55] w-[420px] h-[420px] rounded-full opacity-0 hidden lg:block"
      style={{
        background:
          "radial-gradient(circle, rgba(249,115,22,0.10), rgba(249,115,22,0) 60%)",
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
