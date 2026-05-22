"use client";

import { useEffect, useState } from "react";

export default function CursorAura() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) {
      setEnabled(false);
      return;
    }
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[55] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full opacity-60 mix-blend-screen transition-transform duration-300"
      style={{
        left: pos.x,
        top: pos.y,
        background:
          "radial-gradient(circle, rgba(212,175,55,0.18), rgba(212,175,55,0) 60%)",
        filter: "blur(8px)",
      }}
    />
  );
}
