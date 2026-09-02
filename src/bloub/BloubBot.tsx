import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { NOTIF_BLUE } from "./bot/decor";
import { BotEngine, type BotFrame } from "./bot/engine";
import {
  EXPRESSION_BY_ID,
  DEFAULT_EXPRESSION,
  type ExpressionId,
} from "./bot/expressions";
import { makeBlock, type Block } from "./bot/cycles";
import { clamp } from "./bot/math";
import { DEMI_VIEWBOX, RAYON } from "./bot/repere";
import {
  COLOR_BY_ID,
  DEFAULT_COLOR,
  DEFAULT_SHAPE,
  SHAPE_BY_ID,
  mixHex,
} from "./bot/skins";
import { type StateId } from "./bot/states";
import { lookAtPointer, PAGE_EXPRESSIONS } from "./gaze";

const VB = DEMI_VIEWBOX;
const R = RAYON;

/** 动画循环：去掉蓝框的思考 / 警示 / 感叹号 / 休眠 / 爆散 / 彗星 */
export const PAGE_STATES: readonly StateId[] = [
  "idle",
  "wink",
  "wide",
  "notify",
  "egg",
  "hexagon",
  "play",
  "orbit",
];

export const PAGE_CYCLE: Block[] = PAGE_STATES.map((id) => makeBlock(id));

const EXPRESSION_HOLD_S = 4.2;

export type BloubBotProps = {
  size?: number;
  shape?: string;
  color?: string;
  expression?: string;
  expressions?: readonly ExpressionId[];
  paper?: string;
  cycle?: Block[];
  follow?: boolean;
  className?: string;
  style?: CSSProperties;
};

function Dot({
  dot,
  ink,
  paper,
}: {
  dot: BotFrame["dots"][number];
  ink: string;
  paper: string;
}) {
  const fill =
    dot.color ?? (dot.depth === undefined ? ink : mixHex(paper, ink, dot.depth));
  const common = { fill, opacity: dot.opacity };
  if (dot.d) {
    return (
      <path
        d={dot.d}
        transform={`translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${R})`}
        {...common}
      />
    );
  }
  return <circle cx={dot.x} cy={dot.y} r={dot.r} {...common} />;
}

export default function BloubBot({
  size = 320,
  shape = DEFAULT_SHAPE,
  color = DEFAULT_COLOR,
  expression = DEFAULT_EXPRESSION,
  expressions = PAGE_EXPRESSIONS,
  paper = "#ffffff",
  cycle = PAGE_CYCLE,
  follow = true,
  className,
  style,
}: BloubBotProps) {
  const uid = useId().replace(/:/g, "");
  const maskId = `bot-mask-${uid}`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const engineRef = useRef<BotEngine | null>(null);
  const [frame, setFrame] = useState<BotFrame | null>(null);

  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const clockRef = useRef(0);
  const lastRef = useRef(0);
  const blockRef = useRef(0);
  const blockStartRef = useRef(0);
  const nextAtRef = useRef(Infinity);
  const stateIdRef = useRef<StateId>("idle");
  const exprIndexRef = useRef(0);
  const nextExprAtRef = useRef(EXPRESSION_HOLD_S);
  const cycleRef = useRef(cycle);
  const expressionsRef = useRef(expressions);
  const followRef = useRef(follow);
  cycleRef.current = cycle;
  expressionsRef.current = expressions;
  followRef.current = follow;

  useEffect(() => {
    const radii = SHAPE_BY_ID.get(shape)?.radii ?? null;
    const startExpr =
      EXPRESSION_BY_ID.get(expression) ??
      EXPRESSION_BY_ID.get(expressions[0] ?? DEFAULT_EXPRESSION) ??
      null;
    const engine = new BotEngine(R, "idle", radii, startExpr);
    engineRef.current = engine;

    clockRef.current = 0;
    lastRef.current = 0;
    blockRef.current = 0;
    blockStartRef.current = 0;
    exprIndexRef.current = Math.max(
      0,
      expressions.findIndex((id) => id === expression),
    );
    nextExprAtRef.current = EXPRESSION_HOLD_S;

    const first = cycle[0];
    if (first) {
      engine.setState(first.state, 0);
      stateIdRef.current = first.state;
      nextAtRef.current = first.duration;
    } else {
      nextAtRef.current = Infinity;
    }

    setFrame(engine.sample(0));

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    const onLeave = () => {
      pointerRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const tick = (now: number) => {
      const eng = engineRef.current;
      if (!eng) return;

      if (!lastRef.current) lastRef.current = now;
      const dt = Math.min(0.064, (now - lastRef.current) / 1000);
      lastRef.current = now;
      clockRef.current += dt;
      const clock = clockRef.current;

      const blocks = cycleRef.current;
      if (clock >= nextAtRef.current && blocks.length) {
        blockRef.current = (blockRef.current + 1) % blocks.length;
        const b = blocks[blockRef.current]!;
        eng.setState(b.state, clock);
        stateIdRef.current = b.state;
        blockStartRef.current = clock;
        nextAtRef.current = blockStartRef.current + b.duration;
      }

      const moods = expressionsRef.current;
      if (moods.length && clock >= nextExprAtRef.current) {
        exprIndexRef.current = (exprIndexRef.current + 1) % moods.length;
        const next = EXPRESSION_BY_ID.get(moods[exprIndexRef.current]!);
        if (next) eng.setExpression(next, clock);
        nextExprAtRef.current = clock + EXPRESSION_HOLD_S;
      }

      // 全程跟鼠标：动画只改眼形/身体，视线方向始终由指针接管
      if (followRef.current) {
        const box = svgRef.current?.getBoundingClientRect();
        if (box && box.width > 0 && box.height > 0) {
          const pointer = pointerRef.current;
          const demiW = Math.max(1, window.innerWidth / 2);
          const demiH = Math.max(1, window.innerHeight / 2);
          eng.setLook(
            lookAtPointer({
              nx: pointer
                ? clamp((pointer.x - (box.left + box.width / 2)) / demiW, -1, 1)
                : 0,
              ny: pointer
                ? clamp((pointer.y - (box.top + box.height / 2)) / demiH, -1, 1)
                : 0,
              engaged: 1,
              pointer: pointer !== null,
            }),
            clock,
            1 / 60,
          );
        }
      }

      setFrame(eng.sample(clock));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [shape, expression, cycle, expressions]);

  const ink = COLOR_BY_ID.get(color)?.hex ?? "#0a0a0c";

  if (!frame) {
    return (
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
        className={className}
        style={style}
        role="img"
        aria-label="bot"
      />
    );
  }

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
      className={className}
      style={style}
      role="img"
      aria-label="bot"
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={-VB}
          y={-VB}
          width={VB * 2}
          height={VB * 2}
        >
          <path d={frame.bodyPath} fill="#fff" />
          {frame.eyes.map((eye, i) => (
            <path
              key={i}
              d={eye.d}
              transform={eye.matrix}
              opacity={eye.alpha}
              fill="#000"
            />
          ))}
          {frame.notch ? (
            <circle
              cx={frame.notch.x}
              cy={frame.notch.y}
              r={frame.notch.r}
              fill="#000"
            />
          ) : null}
        </mask>

        {frame.arcs.map((arc) => (
          <linearGradient
            key={arc.id}
            id={`${uid}-${arc.id}`}
            gradientUnits="userSpaceOnUse"
            x1={arc.grad.x1}
            y1={arc.grad.y1}
            x2={arc.grad.x2}
            y2={arc.grad.y2}
          >
            {arc.grad.stops.map((c, i) => (
              <stop
                key={i}
                offset={i / (arc.grad.stops.length - 1)}
                stopColor={c}
              />
            ))}
          </linearGradient>
        ))}
      </defs>

      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`b${arc.id}`}
            d={arc.back}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>

      {frame.dotsBehind
        ? frame.dots.map((dot, i) => (
            <Dot key={`pb${i}`} dot={dot} ink={ink} paper={paper} />
          ))
        : null}

      <g opacity={frame.bodyAlpha}>
        <path d={frame.bodyPath} fill={paper} />
        <g mask={`url(#${maskId})`}>
          <rect x={-VB} y={-VB} width={VB * 2} height={VB * 2} fill={ink} />
        </g>
      </g>

      {!frame.dotsBehind
        ? frame.dots.map((dot, i) => (
            <Dot key={`pf${i}`} dot={dot} ink={ink} paper={paper} />
          ))
        : null}

      {frame.notif ? (
        <circle
          cx={frame.notif.x}
          cy={frame.notif.y}
          r={frame.notif.r}
          fill={NOTIF_BLUE}
        />
      ) : null}

      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`f${arc.id}`}
            d={arc.front}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>
    </svg>
  );
}
