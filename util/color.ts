export function getColor() {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 100
  const lightness = Math.floor(Math.random() * (80 - 20) + 20)
  return `hsl(${hue},${saturation}%,${lightness}%)`
}
