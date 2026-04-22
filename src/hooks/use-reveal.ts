import { useEffect, useRef } from "react";

/**
 * Adds the `is-visible` class to elements with `.reveal` once they
 * intersect the viewport. Returns a ref to attach to a container.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".reveal");
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [options]);

  return ref;
}