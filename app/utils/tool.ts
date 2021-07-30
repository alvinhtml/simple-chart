function rgbToHex(r: number, g: number, b: number) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return `#${new Array(Math.abs(hex.length - 7)).join('0')}${hex}`;
}

function hexToRgb(hex: string) {
  const rgb = [];
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt(`0x${hex.slice(i, i + 2)}`, 16));
  }
  return rgb;
}

export function lighten(hex: string): string {
  let rgb = hexToRgb(hex)
  let arr = rgb.map((v) => {
    return Math.min(v + 10, 255)
  })
  return rgbToHex(arr[0], arr[1], arr[2])
}

export function darken(hex: string): string {
  let rgb = hexToRgb(hex)
  let arr = rgb.map((v) => {
    return Math.max(v - 10, 0)
  })
  return rgbToHex(arr[0], arr[1], arr[2])
}
