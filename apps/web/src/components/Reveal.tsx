'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Reveal({ children, delay = 0, className, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If reduced motion is preferred, reveal immediately without transition.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true);
      return;
    }

    // If the element is already in view on mount, reveal immediately.
    // IntersectionObserver does NOT fire reliably for already-intersecting
    // elements in all browsers/timing scenarios, so this guards against
    // a blank hero on first paint.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setSeen(true);
      return;
    }

    const io = new IntersectionObserver(([e]) => {
      if (e && e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const classes = ['reveal', seen ? 'in' : '', className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
