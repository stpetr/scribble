export type Coords = {
  x: number,
  y: number,
}

export interface Shape {
  prerender: () => void
  render: () => void
  onMouseMove: (x: number, y: number) => void
}
