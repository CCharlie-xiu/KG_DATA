const LABELS: Record<string, string> = {
  prefer: "优先",
  watch: "本条",
  dual: "双报",
  custom: "自定义",
  detail: "明细",
  revenue: "收入",
  ok: "上报",
};

export function lookLabel(id: string) {
  return LABELS[id] ?? id;
}
