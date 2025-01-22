function pnRegexp() {
  return /^\s*([pP]\d)\s*[:.]?/;
}

export function findPn(text: string) {
  const match = text.match(pnRegexp());
  return match?.[1]?.toLocaleLowerCase();
}
