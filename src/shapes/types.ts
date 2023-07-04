export type Coords = {
  x: number,
  y: number,
}

export type Rect = {
  topLeft: Coords,
  bottomRight: Coords,
}

export type Circle = {
  center: Coords,
  radius: number,
}

export interface Shape {
  prerender: () => void
  render: () => void
  move: (x: number, y: number) => void
  onMouseMove: (x: number, y: number) => void
  isWithinRect: (rect: Rect) => boolean
}
