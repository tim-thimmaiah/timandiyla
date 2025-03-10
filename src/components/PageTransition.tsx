"use client";

import { ReactNode, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      // Use the Web Animations API directly
      const animation = element.animate(
        [
          { opacity: 0, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 300,
          easing: "ease-out",
          fill: "forwards",
        }
      );

      // Clean up animation when component unmounts
      return () => {
        animation.cancel();
        element.animate(
          [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-20px)" },
          ],
          {
            duration: 300,
            easing: "ease-in",
            fill: "forwards",
          }
        );
      };
    }
  }, []);

  // Render null if children is undefined
  if (!children) {
    return null;
  }

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
