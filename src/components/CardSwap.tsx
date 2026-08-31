import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import "./CardSwap.css";

export type CardSwapProps = {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  customClass?: string;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, className, ...rest }, ref) => (
  <div ref={ref} {...rest} className={["card", customClass, className].filter(Boolean).join(" ")} />
));
Card.displayName = "Card";

type Slot = { x: number; y: number; z: number; zIndex: number };

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export default function CardSwap({
  width = 420,
  height = 320,
  cardDistance = 52,
  verticalDistance = 58,
  delay = 4200,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 5,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config =
    easing === "elastic"
      ? { ease: "elastic.out(0.6,0.9)", durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: "power1.inOut", durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement[], [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()) as RefObject<HTMLDivElement | null>[],
    [childArr.length],
  );
  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef(0);
  const container = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);
  const swipeRef = useRef({ y: 0, moved: false });

  useLayoutEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    const busy = () => lockedRef.current || Boolean(tlRef.current?.isActive());

    const restartTimer = () => {
      window.clearInterval(intervalRef.current);
      if (childArr.length > 1) intervalRef.current = window.setInterval(() => swap("next"), delay);
    };

    const swap = (dir: "next" | "prev" = "next") => {
      if (order.current.length < 2 || busy()) return;
      lockedRef.current = true;

      if (dir === "next") {
        const [front, ...rest] = order.current;
        const elFront = refs[front]?.current;
        if (!elFront) {
          lockedRef.current = false;
          return;
        }
        const tl = gsap.timeline({
          onComplete: () => {
            lockedRef.current = false;
          },
        });
        tlRef.current = tl;
        tl.to(elFront, { y: "+=420", duration: config.durDrop, ease: config.ease });
        tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
        rest.forEach((idx, i) => {
          const el = refs[idx]?.current;
          if (!el) return;
          const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
          tl.set(el, { zIndex: slot.zIndex }, "promote");
          tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
        });
        const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
        tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
        tl.call(() => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        }, undefined, "return");
        tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, "return");
        tl.call(() => {
          order.current = [...rest, front];
        });
        return;
      }

      const rest = order.current.slice(0, -1);
      const back = order.current[order.current.length - 1];
      const elBack = refs[back]?.current;
      if (!elBack) {
        lockedRef.current = false;
        return;
      }
      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      const tl = gsap.timeline({
        onComplete: () => {
          lockedRef.current = false;
        },
      });
      tlRef.current = tl;
      gsap.set(elBack, { y: frontSlot.y + 420, zIndex: refs.length + 1 });
      tl.to(elBack, { x: frontSlot.x, y: frontSlot.y, z: frontSlot.z, duration: config.durMove, ease: config.ease });
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i + 1, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "<");
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, "<0.08");
      });
      tl.call(() => {
        order.current = [back, ...rest];
      });
    };

    const node = container.current;
    if (childArr.length > 1) {
      swap("next");
      intervalRef.current = window.setInterval(() => swap("next"), delay);
    }

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      swap(e.deltaY > 0 ? "next" : "prev");
      restartTimer();
    };

    const onTouchStart = (e: TouchEvent) => {
      swipeRef.current = { y: e.touches[0]?.clientY ?? 0, moved: false };
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = (e.touches[0]?.clientY ?? 0) - swipeRef.current.y;
      if (Math.abs(dy) > 12) {
        swipeRef.current.moved = true;
        e.preventDefault();
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = (e.changedTouches[0]?.clientY ?? swipeRef.current.y) - swipeRef.current.y;
      if (Math.abs(dy) < 36) return;
      swap(dy < 0 ? "next" : "prev");
      restartTimer();
    };

    if (node && childArr.length > 1) {
      node.addEventListener("wheel", onWheel, { passive: false });
      node.addEventListener("touchstart", onTouchStart, { passive: true });
      node.addEventListener("touchmove", onTouchMove, { passive: false });
      node.addEventListener("touchend", onTouchEnd);
    }

    const pause = () => {
      tlRef.current?.pause();
      window.clearInterval(intervalRef.current);
    };
    const resume = () => {
      tlRef.current?.play();
      restartTimer();
    };

    if (pauseOnHover && node && childArr.length > 1) {
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
    }

    return () => {
      if (node) {
        node.removeEventListener("wheel", onWheel);
        node.removeEventListener("touchstart", onTouchStart);
        node.removeEventListener("touchmove", onTouchMove);
        node.removeEventListener("touchend", onTouchEnd);
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
      }
      window.clearInterval(intervalRef.current);
      tlRef.current?.kill();
      lockedRef.current = false;
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, childArr.length]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<CardProps>, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props as CardProps).style },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            if (swipeRef.current.moved) {
              swipeRef.current.moved = false;
              return;
            }
            (child.props as CardProps).onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child,
  );

  return (
    <div
      ref={container}
      className="card-swap-container"
      style={{ width, height }}
      onPointerDown={() => {
        swipeRef.current.moved = false;
      }}
    >
      {rendered}
    </div>
  );
}
