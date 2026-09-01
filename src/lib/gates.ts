import gates from "../../data/gates.json";

export type GateSection = {
  id: string;
  label: string;
  href: string;
  requireAuth: boolean;
  summary: string;
};

export const gateConfig = gates as {
  code: string;
  ttlSeconds: number;
  emailMask: string;
  notice: string;
  hint: string;
  sessionKey: string;
  sections: GateSection[];
};

export function getSection(id: string) {
  return gateConfig.sections.find((item) => item.id === id);
}

export function isSessionUnlocked() {
  try {
    return sessionStorage.getItem(gateConfig.sessionKey) === "1";
  } catch {
    return false;
  }
}

export function unlockSession() {
  try {
    sessionStorage.setItem(gateConfig.sessionKey, "1");
  } catch {
    /* ignore */
  }
}

export function needsGate(section?: GateSection | null) {
  if (!section) return false;
  return section.requireAuth && !isSessionUnlocked();
}

export function verifyCode(input: string) {
  return input.replace(/\D/g, "") === gateConfig.code;
}
