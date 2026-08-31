import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject } from "react";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(useGSAP);

export function useAppMotion(root: RefObject<HTMLElement | null>) {
  const location = useLocation();

  useGSAP(
    (context, contextSafe) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".logo", { y: -18, opacity: 0, duration: 0.55 })
        .from(".spot-link", { y: -12, opacity: 0, stagger: 0.05, duration: 0.36 }, "-=0.32")
        .from(".icon-round, .menu-pill", { scale: 0.82, opacity: 0, stagger: 0.06, duration: 0.32 }, "-=0.28")
        .from(".board-head h1, .see-new, .page-title, .article h1", { y: 22, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.18")
        .from(".drift-stage, .reading-sheet, .article", { y: 20, opacity: 0, duration: 0.62 }, "-=0.32")
        .from(".footer", { opacity: 0, duration: 0.35 }, "-=0.28");

      const hoverables = root.current?.querySelectorAll(".icon-round, .menu-pill, .btn, .see-new, .spot-link");
      const cleanups: Array<() => void> = [];
      hoverables?.forEach((el) => {
        const enter = contextSafe(() => {
          gsap.to(el, { scale: 1.06, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        });
        const leave = contextSafe(() => {
          gsap.to(el, { scale: 1, duration: 0.26, ease: "power2.out", overwrite: "auto" });
        });
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root, dependencies: [location.pathname], revertOnUpdate: true },
  );
}
