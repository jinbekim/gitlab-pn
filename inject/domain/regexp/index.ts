function pnRegexp() {
  return /^\s*([pP]\d)\s*[:.]?/;
}

export function findPn(text: string) {
  const match = text.match(pnRegexp());
  return match?.[1]?.toLocaleLowerCase();
}

type PnRule = 'p1' | 'p2' | 'p3';
export function isPnRule(rule: string = ''): rule is PnRule{
  return pnRegexp().test(rule);
}
