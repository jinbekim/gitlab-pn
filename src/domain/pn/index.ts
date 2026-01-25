export type PnRule = "p1" | "p2" | "p3";
export type PnRuleSub = "P1" | "P2" | "P3";
export type PnBgColorKey = `${PnRule}-bg-color`;
export type PnTextColorKey = `${PnRule}-text-color`;

export type PnRuleMap = {
  [key in PnRule]: string;
};
export type PnRuleColorMap = {
  [key in PnBgColorKey | PnTextColorKey]?: string;
};
export type PnRuleMapWithColor = PnRuleMap & PnRuleColorMap;

export const DEFAULT_PN_RULE_MAP: PnRuleMapWithColor = {
  p1: "P1",
  p2: "P2",
  p3: "P3",
  "p1-bg-color": "#dc2626",
  "p1-text-color": "#ffffff",
  "p2-bg-color": "#f59e0b",
  "p2-text-color": "#ffffff",
  "p3-bg-color": "#10b981",
  "p3-text-color": "#ffffff",
};

export function getBgColorKey(pn: PnRule | PnRuleSub): PnBgColorKey {
  return `${pn}-bg-color`.toLocaleLowerCase() as PnBgColorKey;
}

export function getTextColorKey(pn: PnRule | PnRuleSub): PnTextColorKey {
  return `${pn}-text-color`.toLocaleLowerCase() as PnTextColorKey;
}

export function getReplacementKey(pn: PnRule | PnRuleSub): PnRule {
  return pn.toLocaleLowerCase() as PnRule;
}

function pnRegexp() {
  return /^([pP]\d)\s*[:.]?/;
}

export function findPn(text: string) {
  const match = text.match(pnRegexp());
  return match?.[1];
}

export function isPnRule(rule: string = ""): rule is PnRule {
  return pnRegexp().test(rule);
}

export function isPnRuleMap(map: unknown): map is PnRuleMapWithColor {
  if (typeof map !== "object" || map === null) return false;
  return ["p1", "p2", "p3"].every((key) => key in map);
}
