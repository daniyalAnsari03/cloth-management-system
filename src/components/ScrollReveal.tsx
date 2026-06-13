"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type RevealAnimation =
  | "reveal-up"
  | "reveal-down"
  | "reveal-left"
  | "reveal-right"
  | "reveal-scale"
  | "reveal-rotate"
  | "reveal-clip";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: "div" | "section" | "article" | "span";
  once?: boolean;
}

export function ScrollReveal({
  children,
  animation = "reveal-up",
  delay = 0,
  duration,
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  className = "",
  as: Tag = "div",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const style: React.CSSProperties = {
    animation: revealed
      ? `${animation} ${duration ?? 700}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms backwards`
      : "none",
    opacity: revealed ? undefined : 0,
    willChange: "transform, opacity",
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
