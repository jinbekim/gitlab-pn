export function genMarker({
  name,
  replacement,
  bgColor,
  textColor,
}:{
  name: string;
  replacement: string;
  bgColor?: string;
  textColor?: string;
}) {
  return `<mark name="${name}" style="background-color: ${bgColor}; color: ${textColor}">${replacement}</mark>`;
}
