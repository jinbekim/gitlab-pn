
type HexaCode = `#${string}`;
export function genMarker({
  name,
  bgColor,
  textColor,
  replacement
}:{
  name: string;
  bgColor: HexaCode;
  textColor: HexaCode;
  replacement: string;
}) {
  return `<mark name="${name}" style="background-color: ${bgColor}; color: ${textColor}">${replacement}</mark>`;
}
