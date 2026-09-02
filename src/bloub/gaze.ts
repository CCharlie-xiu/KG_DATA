import type { Look } from "./bot/engine";
import type { ExpressionId } from "./bot/expressions";
import { clamp, easings } from "./bot/math";

export const YAW_MAX = 22;
export const PITCH_MAX = 16;
export const PITCH = 8;
export const TURN_TIME = 0.55;

/** 表情轮换：去掉蓝框里的怀疑 / 困惑 / 好奇 / 羞怯 / 无趣 / 困倦 */
export const PAGE_EXPRESSIONS: readonly ExpressionId[] = [
  "neutre",
  "attentif",
  "surpris",
  "excite",
  "heureux",
  "hilare",
  "colere",
  "triste",
  "effraye",
  "fier",
];

export function lookAtPointer(opts: {
  nx: number;
  ny: number;
  engaged: number;
  pointer: boolean;
}): Look {
  const k = easings.easeOutQuint(clamp(opts.engaged));
  return {
    yaw: opts.nx * YAW_MAX,
    pitch: PITCH - opts.ny * PITCH_MAX,
    mix: k,
    spin: 0,
    wander: opts.pointer ? 0 : 1,
  };
}
