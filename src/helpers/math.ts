export const PI = Math.PI

// Linear interpolation
export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t
}

export const getHypotenuse = (width: number, height: number) => {
  return Math.sqrt(width ** 2 + height ** 2)
}
